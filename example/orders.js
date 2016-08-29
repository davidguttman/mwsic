var Mwsic = require('..')
var config = require('./config.json')

var mwsic = Mwsic(config)

mwsic.createOrdersStream({
  dateStart: '2016-07-10',
  dateEnd: '2016-07-24',
  sellerId: config.sellerId,
  marketplaceId: config.marketplaceId
}).on('data', function (row) {
  console.log(JSON.stringify(row))
}).on('error', function (err) {
  console.log('err.code', err.code)
})

// mwsic.getOrders({
//   dateStart: '2016-07-17',
//   dateEnd: '2016-08-18',
//   sellerId: config.sellerId,
//   marketplaceId: config.marketplaceId
// }, function (err, resp) {
//   if (err) return console.error(err)
//   console.log('resp', JSON.stringify(resp, null, 2))
// })
