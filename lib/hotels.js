var fs = require('fs');
var json = require('./ne_hotels_wvitemid_map.json');
// console.log(json);
var map = {};
Object.keys(json).forEach((k) => {
  map[k] = json[k].MHID;
});
fs.writeFileSync('./lib/ne_hotels_with_mhid.json', JSON.stringify(map));
console.log(Object.keys(map).length);
