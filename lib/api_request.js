require('env2')('.env');
var http_request = require('./http_request');

/**
 * make_path_from_params constructs the string that is used to request
 * data from the nordics API.
 * @param {Object} params - the parameters for the search
 * e.g: {adults:2, children:1, allInclusive: 'true'}
 */
function make_path_from_params (params) {
  var path = (params.path || 'trips') + '?'; // default to trips if unset
  delete params.path;  // ensure we don't send un-recognised params to NE API.
  Object.keys(params).forEach(function (k, i) {
    path += k + '=' + params[k] + '&';
  });
  console.log(path);
  return path;
}

/**
 * api_request makes an https request to the API Gateway "Outbound" endpoint
 * which in turn makes the request to the NE "Classic" API (V2)
 * the reason for using the API Gateway is response Caching.
 * @param {Object} params - the parameters for the search
 * e.g: {adults:2, children:1, allInclusive: 'true'}
 * @param {Function} callback - the function to call when results returned
 * standard node params. e.g: function callback (err, response) { ... }
 */
module.exports = function api_request (params, callback) {
  var options = {
    headers: {
      'Authorization': process.env.NE_API_KEY
    },
    port: 443,
    host: process.env.NE_API_URL,
    path: '/v2/sd/' + make_path_from_params(params)
  };
  console.log(options);
  http_request(options, callback);
};
