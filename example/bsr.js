var Mwsic = require('..')
var config = require('./config.json')

var mwsic = Mwsic({
  key: config.key,
  secret: config.secret
})

var opts = {
  asin: config.asin,
  sellerId: config.sellerId,
  marketplaceId: config.marketplaceId
}

mwsic.getBSR(opts, function (err, rankInfo) {
  if (err) return console.error(err)
  console.log('rankInfo', rankInfo)
})
