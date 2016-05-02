var stats = [];
var api_request = require('./api_request');
var ne_hotel_ids = Object.keys(require('./ne_hotels_with_mhid.json'));
var batch_list = [30, 25, 20, 15, 10, 5, 1];
batch_list = [10];

function get_packages () {
  var ids = ne_hotel_ids.map((id) => id);
  var start = Date.now();
  var BATCH_SIZE = batch_list.splice(0, 1)[0];
  console.log('Number of NE Hotels we need packages for:', ids.length);
  console.log('Number of API Requests:', Math.ceil(ids.length / BATCH_SIZE));
  var batches = Math.ceil(ids.length / BATCH_SIZE);
  var results = 0;
  var package_map = {};

  function get_batch () {
    var params = {
      path: 'trips',
      hotelIds: ids.splice(0, BATCH_SIZE).join(',')
    };

    api_request(params, function (err, json) {
      results++;
      if (err) {
        console.log('ERROR:', err);
        return;
      } else {
        console.log('Batch #', results, 'Results:', json.result.length, '(', batches - results, ' remaining)');
        json.result.sort((a, b) => a.price < b.price).forEach((p) => {
          package_map[p.wvHotelPartId] = p; // over-write more expensive packages
        });

        if (results === batches) { // we are finished fetching
          stats.push({
            size: BATCH_SIZE,
            packages: Object.keys(package_map).length,
            time: Date.now() - start,
            requests: results
          });
          console.log('Batch size: ', BATCH_SIZE,
          '| Packages:', Object.keys(package_map).length,
          '| Time:', Date.now() - start, 'ms ',
          '| Requests: ', results);

          if (batch_list.length === 0) {
            console.log(JSON.stringify(stats, null, 2));
          } else {
            get_packages();
          }
        }
      }
    });
  }
  for (var i = 0; i < batches; i++) {
    var time = i * 500; // 5 requests per second! (slow!!)
    console.log('Wait:', time, 'ms');
    setTimeout(function () {
      get_batch();
    }, time); // 10 API requests per second
  }
}

get_packages();
