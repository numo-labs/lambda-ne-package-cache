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
      hotelIds: ne_hotel_ids.splice(0, 29) // take the first 30 items each time.
    };

    api_request(params, function (err, json) {
      console.log(err, json.result.length);
      json.result.sort((a, b) => a.price < b.price).forEach((p) => {
        package_map[p.wvHotelPartId] = p; // over-write more expensive packages
      });

      if (++results === batches) { // we are finished fetching
        console.log('Cached:', Object.keys(package_map).length, 'packages. in',
          Date.now() - start, 'ms');
      }
    });
  }
  for (var i = 0; i < batches; i++) {
    var time = i * 10;
    console.log('Wait:', time, 'ms');
    setTimeout(function () {
      get_batch();
    }, time); // 10 API requests per second
  }
  return;
}

get_packages();
