var _ = require('lodash')
var MWS = require('dg-amazon-mws')
var from = require('from2').obj
var xtend = require('xtend')
var moment = require('moment-timezone')
var traverse = require('traverse')
var parseString = require('xml2js').parseString

var Mwsic = module.exports = function (opts) {
  if (!(this instanceof Mwsic)) return new Mwsic(opts)

  var _mws = this._mws = MWS({
    AWSAccessKeyId: opts.key,
    AmzSecretKey: opts.secret
  })

  this.mws = function (mOpts, cb) {
    _mws(xtend(mOpts, {callback: cb}))
  }

  var m = opts.timezone ? moment.tz : moment
  this.moment = function () {
    var args = Array.prototype.slice.call(arguments)
    if (opts.timezone) args.push(opts.timezone)
    return m.apply(m, args)
  }

  return this
}

Mwsic.prototype._request = request
Mwsic.prototype.request = requestWithRetry
Mwsic.prototype.getBSR = getBSR
Mwsic.prototype.getOrders = getOrders
Mwsic.prototype.getProductInfo = getProductInfo
Mwsic.prototype.createOrdersStream = createOrdersStream
Mwsic.prototype.createFinancialEventsStream = createFinancialEventsStream

function getBSR (opts, cb) {
  this.getProductInfo(opts, function (err, info) {
    if (err) return cb(err)

    var salesRank = _.get(info, [
      'GetMatchingProductResponse','GetMatchingProductResult', 'Product',
      'SalesRankings', 'SalesRank'
    ])

    if (!salesRank) return cb(new Error('Could not find BSR'))

    var bsr = salesRank.map(function (cat) {
      return {
        categoryId: _.get(cat, 'ProductCategoryId'),
        rank: Number(_.get(cat, 'Rank'))
      }
    })

    cb(null, bsr)
  })
}

function getOrders (opts, cb) {
  var params = {
    'Action': 'ListOrders',
    'SellerId': opts.sellerId,
    'MarketplaceId.Id.1' : opts.marketplaceId,
    'OrderStatus.Status.1' : 'Pending',
    'OrderStatus.Status.2' : 'Unshipped',
    'OrderStatus.Status.3' : 'Shipped',
    'OrderStatus.Status.4' : 'PartiallyShipped',
  }

  if (opts.nextToken) {
    params.Action = 'ListOrdersByNextToken'
    params.NextToken = opts.nextToken
  } else {
    if (opts.dateStart)
      params.CreatedAfter = this.moment(opts.dateStart).toISOString()

    if (opts.dateEnd)
      params.CreatedBefore = this.moment(opts.dateEnd).toISOString()
  }

  return this.request({
    endpoint: '/Orders/2013-09-01',
    params: params
  }, cb)
}

function getProductInfo (opts, cb) {
  return this.request({
    endpoint: '/Products/2011-10-01',
    params: {
      'Action': 'GetMatchingProduct',
      'MarketplaceId': opts.marketplaceId,
      'ASINList.ASIN.1': opts.asin,
      'SellerId': opts.sellerId,
    }
  }, cb)
}

function createOrdersStream (opts) {
  var self = this

  if (opts.dateStart) opts.dateStart = this.moment(opts.dateStart).toISOString()
  if (opts.dateEnd) opts.dateEnd = this.moment(opts.dateEnd).toISOString()

  var nextToken
  var buffer = []
  var firstCall = true

  return from(function (size, cb) {
    opts.nextToken = nextToken
    if (buffer[0]) return cb(null, buffer.shift())
    if (!firstCall && !nextToken) return cb(null, null)

    self.getOrders(opts, function (err, resp) {
      if (err) return cb(err)

      nextToken = resp.NextToken
      var orders = resp.Orders.Order

      orders.forEach(function (raw) {
        var order = _.pick(raw, [
          'PurchaseDate', 'AmazonOrderId', 'LastUpdateDate',
          'NumberOfItemsShipped', 'NumberOfItemsUnshipped',
          'OrderTotal.Amount', 'IsPrime'
        ])

        order.NumberOfItems = parseFloat(order.NumberOfItemsShipped)
          + parseFloat(order.NumberOfItemsUnshipped)

        buffer.push(order)
      })

      cb(null, buffer.shift())
    })
  })
}

function createFinancialEventsStream () {

}

function request (opts, cb) {
  var mOpts = {
    method: opts.method || 'GET',
    base: opts.base || 'mws.amazonservices.com',
    endpoint: opts.endpoint,
    params: opts.params
  }

  return this.mws(mOpts, parseResponse(opts.params.Action, cb))
}

function requestWithRetry (opts, cb) {
  var interval = 5000
  var self = this

  this._request(opts, function (err, result, res, body) {
    if (err && err.code === 'RequestThrottled') {
      console.log('throttled: waiting %d ms', interval)
      return setTimeout(self.request.bind(self), interval, opts, cb)
    }

    cb(err, result, res, body)
  })
}

function parseResponse (action, cb) {
  return function (err, res, body) {
    if (err) return cb(err)

    var xmlObj = parseString(body, function (err, rawResult) {
      if (err) return cb(err)

      var data = cleanXMLObject(action, rawResult)
      err = parseError(data, res)

      var result = _.get(data, 'Response.Result')

      cb(err, result, res, body)
    })
  }
}

function cleanXMLObject (action, xml) {
  var blacklist = [
    'ListOrdersResponse.ListOrdersResult.Orders.Order',
    'ListOrdersByNextTokenResponse.ListOrdersByNextTokenResult.Orders.Order'
  ]

  return traverse(xml).forEach(function (x, a) {
    if (blacklist.indexOf(this.path.join('.')) > -1) return

    if (this.key && this.key.match(action)) {
      var update = {}
      update[this.key] = undefined
      this.parent.update(xtend(this.parent.node, update))
      this.key = this.key.replace(action, '')
    }

    if (this.key === '$') {
      this.parent.update(xtend(x, this.parent.node))
      this.remove()
    }

    if (x.length === 1) this.update(x[0])
  })
}

function parseError (result, response) {
  var statusCode = response.statusCode
  var errObj = _.get(result, 'ErrorResponse.Error')

  var err = null

  if (errObj) {
    err = new Error(errObj.Message)
    err.code = errObj.Code
    err.statusCode = response.statusCode
  }

  if (statusCode >= 400) {
    err = err || new Error(statusCode + ': ' + response.request.uri.href)
    err.statusCode = statusCode
  }

  return err
}
