var _				=	require('underscore');
var geoip 	= require('geoip-lite');
var regions	= require('./libs/region_codes');

exports.lookup = function(ip, callback){
	var geo = geoip.lookup(ip);

	if (geo == null) {
    if (ip === '127.0.0.1' || ip.indexOf('192.168') > -1) {
        geo = {country: 'local', region: 'local', city: 'local'};
    } else {
        geo = {country: "unknown", region: "unknown", city: "unknown"};
    }
	}

	var region = _.find(regions, { 
		country_code		: geo.country, 
		subcountry_code	: geo.region 
	});

	if(region){
		geo.region = region.region_name;
	}
	callback && callback(geo);
}
