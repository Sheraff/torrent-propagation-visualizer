(function WebSocketBoot() {
	// ws = new WebSocket("ws://vps62456.ovh.net:8080");
	ws = new WebSocket("ws://localhost:8080");
	ws.onopen = function() {
		console.log("open")
		// ws.send();
	};
	ws.onmessage = function(event) {
		JSON.parse(event.data).forEach(parseItem);
	};
	ws.onclose = function() {
		console.log("close")
	};
	ws.onerror = function() {
		console.log("error")
	}
})();


var h1 = document.querySelector('header>h1');
var p = document.querySelector('header>p');
var span = document.querySelector('section>span');
function parseItem (item) {
	switch (item.type){
		case 'name':
			h1.innerHTML = item.text;
			span.innerHTML = "";
			p.innerHTML = 0;
			places = [];
			links = [],
			arcLines = [];
			break;
		case 'details':
			p.innerHTML = item.text;
			break;
		case 'peer':
			add_point([item.coords[1], item.coords[0]])
			break;
	}
}





var width = 960,
	height = 500;

var proj = d3.geo.orthographic()
	.translate([width / 2, height / 2])
	.clipAngle(90)
	.scale(220);

var sky = d3.geo.orthographic()
	.translate([width / 2, height / 2])
	.clipAngle(90)
	.scale(300);

var path = d3.geo.path().projection(proj).pointRadius(2);

var swoosh = d3.svg.line()
		.x(function(d) { return d[0] })
		.y(function(d) { return d[1] })
		.interpolate("cardinal")
		.tension(.0);

var links = [],
	arcLines = [];

var svg = d3.select("body").append("svg")
			.attr("width", width)
			.attr("height", height);

var places = [];

queue()
	.defer(d3.json, "world-110m.json")
	.await(ready);

function ready(error, world) {
	svg.append("path")
		.datum(topojson.object(world, world.objects.land))
		.attr("class", "land noclicks")
		.attr("d", path);

	// spawn links between cities as source/target coord pairs
	refresh();
}

function flying_arc(pts) {
  var source = pts.source,
	  target = pts.target;

  var mid = location_along_arc(source, target, .5);
  var result = [ proj(source),
				 sky(mid),
				 proj(target) ]
  return result;
}

function add_point(coordinates){
	var new_feature = {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": coordinates
		}
	};

	// spawn links between points
	var temp_links = [];
	places.forEach(function(a) {
		if(a.geometry.coordinates != coordinates){
			var new_link = { source: a.geometry.coordinates, target: coordinates };
			links.push(new_link);
			temp_links.push(new_link);
		}
	});
	places.push(new_feature)

	// build geoJSON features from links array
	// var temp_arcLines = [];
	// temp_links.forEach(function(e) {
	// 	var feature = { "type": "Feature", "geometry": { "type": "LineString", "coordinates": [e.source,e.target] }}
	// 	arcLines.push(feature)
	// 	temp_arcLines.push(feature);
	// })

	// svg.append("g").attr("class","arcs")
	// .selectAll("path").data(temp_arcLines)
	// .enter().append("path")
	// 	.attr("class","arc")
	// 	.attr("d",path)

	svg.append("g").attr("class","flyers")
		.selectAll("path").data(temp_links)
		.enter().append("path")
		.attr("class","flyer")
		.attr("d", function(d) { return swoosh(flying_arc(d)) })

	refresh();
}

function refresh() {
  svg.selectAll(".land").attr("d", path);
  svg.selectAll(".point").attr("d", path);
  
  svg.selectAll(".arc").attr("d", path)
	.attr("opacity", function(d) {
		return fade_at_edge(d)
	})

  svg.selectAll(".flyer")
	.attr("d", function(d) { return swoosh(flying_arc(d)) })
	.attr("opacity", function(d) {
		return fade_at_edge(d)
	}) 
}

function fade_at_edge(d) {
	var centerPos = proj.invert([width/2,height/2]),
		arc = d3.geo.greatArc(),
		start, end;
	// function is called on 2 different data structures..
	if (d.source) {
		start = d.source, 
		end = d.target;  
	} else {
		start = d.geometry.coordinates[0];
		end = d.geometry.coordinates[1];
	}
	
	var start_dist = 1.57 - arc.distance({source: start, target: centerPos}),
		end_dist = 1.57 - arc.distance({source: end, target: centerPos});
		
	var fade = d3.scale.linear().domain([-.1,0]).range([0,.1]) 
	var dist = start_dist < end_dist ? start_dist : end_dist; 
	
	return fade(dist)
}

function location_along_arc(start, end, loc) {
	var interpolator = d3.geo.interpolate(start,end);
	return interpolator(loc)
}


// var ticker = 0;
// var speed = 10;
// var last_time = Date.now();
// function rotate(){
// 	window.requestAnimationFrame(rotate);
// 	var this_time = Date.now();
// 	ticker+=speed*(this_time-last_time)/1000;
// 	last_time=this_time;
// 	proj.rotate([ticker]);
// 	sky.rotate([ticker]);
// 	refresh();
// };
// rotate();