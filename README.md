# Mwsic

A high-level API for Amazon MWS. Handles iteration and rate-limiting.

## Installation

`npm i -S mwsic`

## API

### `mwsic = Mwsic(opts)`

```js
var opts = { key, secret, [timezone] }
```

* `timezone`, if provided, will convert date strings to the specified [timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) for you. This is useful if your server is on UTC but you want to query on a "Pacific" date range.

### `mwsic.getBSR(opts, cb)`

```js
var opts = { asin, sellerId, marketPlaceId }
var cb = function (err, rankInfo) {
  rankInfo === [
    { categoryId: 'category_display_on_website', rank: 7293 },
    { categoryId: '110592813', rank: 36 }
  ]
}
```

### `mwsic.getProductInfo(opts, cb)`

```js
var opts = { asin, sellerId, marketPlaceId }
var cb = function (err, productInfo) {
  productInfo === { GetMatchingProductResponse: ... }
}
```

### `mwsic.createOrdersStream(opts)`

```js
mwsic.createOrdersStream({
  dateStart: '2016-07-10',
  dateEnd: '2016-07-24',
  sellerId: config.sellerId,
  marketplaceId: config.marketplaceId
}).on('data', function (row) {
  // {
  //   "PurchaseDate": "2016-07-10T20:18:32Z",
  //   "AmazonOrderId": "910-6853146-8217084",
  //   "LastUpdateDate": "2016-07-11T21:26:50Z",
  //   "NumberOfItemsShipped": "1",
  //   "NumberOfItemsUnshipped": "0",
  //   "IsPrime": "false",
  //   "NumberOfItems": 1,
  //   "OrderItems": [
  //     {
  //       "QuantityOrdered": "1",
  //       "Title": "Awesome Item",
  //       "PromotionDiscount": {
  //         "CurrencyCode": "USD",
  //         "Amount": "0.00"
  //       },
  //       "ASIN": "B01AURE4K4",
  //       "SellerSKU": "A001",
  //       "OrderItemId": "32230629473577",
  //       "QuantityShipped": "1",
  //       "ItemPrice": {
  //         "CurrencyCode": "USD",
  //         "Amount": "82.00"
  //       },
  //       "ItemTax": {
  //         "CurrencyCode": "USD",
  //         "Amount": "6.31"
  //       }
  //     }
  //   ]
  // }
})
```

### `mwsic.createFinancialEventsStream(opts)`

```js
mwsic.createFinancialEventsStream({
  dateStart: '2016-07-10',
  dateEnd: '2016-07-11',
  sellerId: config.sellerId
}).on('data', function (row) {
  // {
  //   "eventType": "Shipment",
  //   "AmazonOrderId": "111-2631094-0301903",
  //   "PostedDate": "2016-07-10T09:15:31Z",
  //   "MarketplaceName": "Amazon.com",
  //   "SellerOrderId": "111-2631094-0301903",
  //   "ShipmentItemList": {
  //     "ShipmentItem": {
  //       "ItemChargeList": {
  //         "ChargeComponent": [
  //           {
  //             "ChargeType": "Principal",
  //             "ChargeAmount": {
  //               "CurrencyAmount": "28.0",
  //               "CurrencyCode": "USD"
  //             }
  //           },
  //           {
  //             "ChargeType": "Tax",
  //             "ChargeAmount": {
  //               "CurrencyAmount": "1.68",
  //               "CurrencyCode": "USD"
  //             }
  //           },
  //           {
  //             "ChargeType": "GiftWrap",
  //             "ChargeAmount": {
  //               "CurrencyAmount": "0.0",
  //               "CurrencyCode": "USD"
  //             }
  //           },
  // ...
})
```

### `mwsic.createInventorySupplyStream(opts)`

```js
mwsic.createInventorySupplyStream({
  dateStart: '2016-07-10',
  sellerId: config.sellerId,
  marketplaceId: config.marketplaceId
}).on('data', function (row) {
// {"Condition":"NewItem","SupplyDetail":"","TotalSupplyQuantity":"321","EarliestAvailability":{"TimepointType":"Immediately"},"FNSKU":"xxx","InStockSupplyQuantity":"316","ASIN":"B01AURE4K4","SellerSKU":"A001"}
})
```

## License

MIT
