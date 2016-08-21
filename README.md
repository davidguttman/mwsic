# Mwsic

A high-level API for Amazon MWS. Handles iteration and rate-limiting.

## Installation

`npm i -S mwsic`

## API

### `mwsic = Mwsic(opts)`

```js
var opts = { key, secret }
```

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
var opts = { dateStart, dateEnd }
```

### `mwsic.createFinancialEventsStream(opts)`

```js
var opts = { dateStart, dateEnd }
```

## License

MIT
