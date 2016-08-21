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

mwsic.getProductInfo(opts, function (err, productInfo) {
  if (err) return console.error(err)
  console.log('productInfo', JSON.stringify(productInfo, null, 2))
})
