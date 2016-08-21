var _ = require('lodash')
var MWS = require('dg-amazon-mws')
var xtend = require('xtend')
var traverse = require('traverse')
var parseString = require('xml2js').parseString

var Mwsic = module.exports = function (opts) {
  if (!(this instanceof Mwsic)) return new Mwsic(opts)

  this.mws = MWS({
    AWSAccessKeyId: opts.key,
    AmzSecretKey: opts.secret
  })

  return this
}

Mwsic.prototype.getBSR = getBSR
Mwsic.prototype.getProductInfo = getProductInfo
Mwsic.prototype.createOrdersStream = createOrdersStream
Mwsic.prototype.createFinancialEventsStream = createFinancialEventsStream
Mwsic.prototype.request = request

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

function createOrdersStream () {

}

function createFinancialEventsStream () {

}

function request (opts, cb) {
  return this.mws({
    method: opts.method || 'GET',
    base: opts.base || 'mws.amazonservices.com',
    endpoint: opts.endpoint,
    params: opts.params,
    callback: parseResponse(cb)
  })
}

function parseResponse (cb) {
  return function (err, res, body) {
    if (err) return cb(err)

    var xmlObj = parseString(body, function (err, rawResult) {
      if (err) return cb(err)

      var result = cleanXMLObject(rawResult)
      err = parseError(result, res)

      cb(err, result, res, body)
    })
  }
}

function cleanXMLObject (xml) {
  return traverse(xml).forEach(function (x, a) {
    if (!x) return
    if (x.length === 1) this.update(x[0])
    if (this.key === '$') {
      this.parent.update(xtend(x, this.parent.node))
      this.remove()
    }
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
