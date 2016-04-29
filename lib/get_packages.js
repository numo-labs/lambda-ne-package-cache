var start = Date.now();
var api_request = require('./api_request');
var ne_hotel_ids = Object.keys(require('./ne_hotels_with_mhid.json'));
console.log('Number of NE Hotels we need packages for:', ne_hotel_ids.length);
console.log('Number of API Requests:', Math.ceil(ne_hotel_ids.length / 30));

function get_packages () {

  var batches = Math.ceil(ne_hotel_ids.length / 30);
  var results = 0;
  var package_map = {};

  function get_batch () {
    var params = {
      path: 'trips',
      // adults: 2,
      // allInclusive: 'true', // yes these values are strings not boolean!
      // lmsOnly: 'true',
      hotelIds: ne_hotel_ids.splice(0, 29)
    };

    api_request(params, function (err, json) {
      console.log(err, json.totalHits);
      // sort packages by price decending
      json.result.sort((a, b) => a.price < b.price ).forEach((p) => {
        package_map[p.wvHotelPartId] = p; // over-write more expensive
      });

      if(++results === batches - 70) {
        console.log(JSON.stringify(packages, null, 2));
        console.log('Finished in:', Date.now() - start, 'ms');
        console.log(packages[0].price, ' > ', packages[packages.length - 1].price);
      }
    });
  }
  for(var i = 0; i < batches - 70; i++) {
    var time = i * 10;
    console.log('Wait:', time, 'ms');
    setTimeout(function () {
      get_batch();
    }, time) // 10 API requests per second
  }
  return;
}

get_packages();
