var Mwsic = require('..')
var config = require('./config.json')

var mwsic = Mwsic(config)

mwsic.createOrdersStream({
  dateStart: '2016-08-10',
  dateEnd: '2016-08-17'
})
