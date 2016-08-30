var Mwsic = require('..')
var config = require('./config.json')

var mwsic = Mwsic({
  key: config.key,
  secret: config.secret
})

var opts = {
  asin: 'B01AURE4K4',
  sellerId: config.sellerId,
  marketplaceId: config.marketplaceId
}

mwsic.getProductInfo(opts, function (err, productInfo) {
  if (err) return console.error(err)
  console.log('productInfo', JSON.stringify(productInfo, null, 2))

  // {
  //   "ASIN": "B01AURE4K4",
  //   "status": "Success",
  //   "Product": {
  //     "xmlns": "http://mws.amazonservices.com/schema/Products/2011-10-01",
  //     "xmlns:ns2": "http://mws.amazonservices.com/schema/Products/2011-10-01/default.xsd",
  //     "Identifiers": {
  //       "MarketplaceASIN": {
  //         "MarketplaceId": "ATVPDKIKX0DER",
  //         "ASIN": "B01AURE4K4"
  //       }
  //     },
  //     "AttributeSets": {
  //       "ns2:ItemAttributes": {
  //         "xml:lang": "en-US",
  //         "ns2:Binding": "Electronics",
  //         "ns2:Brand": "Misfit Wearables",
  //         "ns2:Color": "Carbon black",
  //         "ns2:Department": "unisex-adult",
  //         "ns2:Feature": [
  //           "Vibration alerts for call and text notifications, movement reminders, and alarms",
  //           "Smart button enabled to control connected household devices",
  //           "Swimproof, anodized aluminum disc with multicolor LED progress and time display",
  //           "Automatically tracks steps, distance, calories, and light and heavy sleep",
  //           "Non-charging, replaceable battery lasts up to 6 months"
  //         ],
  //         "ns2:Format": "Color",
  //         "ns2:Genre": "Exercise & Fitness",
  //         "ns2:ItemDimensions": {
  //           "ns2:Height": {
  //             "Units": "inches",
  //             "_": "7.28"
  //           },
  //           "ns2:Length": {
  //             "Units": "inches",
  //             "_": "3.54"
  //           },
  //           "ns2:Width": {
  //             "Units": "inches",
  //             "_": "1.57"
  //           }
  //         },
  //         "ns2:IsAutographed": "false",
  //         "ns2:IsMemorabilia": "false",
  //         "ns2:Label": "Misfit wearables",
  //         "ns2:ListPrice": {
  //           "ns2:Amount": "99.99",
  //           "ns2:CurrencyCode": "USD"
  //         },
  //         "ns2:Manufacturer": "Misfit wearables",
  //         "ns2:Model": "SH303",
  //         "ns2:OperatingSystem": "Android/iOS",
  //         "ns2:PackageDimensions": {
  //           "ns2:Height": {
  //             "Units": "inches",
  //             "_": "1.40"
  //           },
  //           "ns2:Length": {
  //             "Units": "inches",
  //             "_": "8.40"
  //           },
  //           "ns2:Width": {
  //             "Units": "inches",
  //             "_": "4.10"
  //           },
  //           "ns2:Weight": {
  //             "Units": "pounds",
  //             "_": "0.25"
  //           }
  //         },
  //         "ns2:PackageQuantity": "1",
  //         "ns2:PartNumber": "SH303",
  //         "ns2:ProductGroup": "Wireless",
  //         "ns2:ProductTypeName": "CONSUMER_ELECTRONICS",
  //         "ns2:Publisher": "Misfit wearables",
  //         "ns2:SmallImage": {
  //           "ns2:URL": "http://ecx.images-amazon.com/images/I/31A6-s8i6lL._SL75_.jpg",
  //           "ns2:Height": {
  //             "Units": "pixels",
  //             "_": "75"
  //           },
  //           "ns2:Width": {
  //             "Units": "pixels",
  //             "_": "75"
  //           }
  //         },
  //         "ns2:Studio": "Misfit wearables",
  //         "ns2:Title": "Misfit Shine 2 Fitness Tracker & Sleep Monitor (Carbon Black)"
  //       }
  //     },
  //     "Relationships": {
  //       "VariationParent": {
  //         "Identifiers": {
  //           "MarketplaceASIN": {
  //             "MarketplaceId": "ATVPDKIKX0DER",
  //             "ASIN": "B01IU06JUQ"
  //           }
  //         }
  //       }
  //     },
  //     "SalesRankings": {
  //       "SalesRank": {
  //         "ProductCategoryId": "10048706011",
  //         "Rank": "87"
  //       }
  //     }
  //   }
  // }
})
