var Mwsic = require('..')
var config = require('./config.json')

var mwsic = Mwsic(config)

mwsic.createFinancialEventsStream({
  dateStart: '2016-07-10',
  dateEnd: '2016-07-11',
  sellerId: config.sellerId
}).on('data', function (row) {
  console.log(JSON.stringify(row))
}).on('error', function (err) {
  console.log('err.code', err.code)
})
