var Mwsic = require('..')
var config = require('./config.json')

var mwsic = Mwsic(config)

mwsic.createInventorySupplyStream({
  dateStart: '2016-07-10',
  sellerId: config.sellerId,
  marketplaceId: config.marketplaceId
}).on('data', function (row) {
  console.log(JSON.stringify(row))
}).on('error', function (err) {
  console.log('err.code', err.code)
})
