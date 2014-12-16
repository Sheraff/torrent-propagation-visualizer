///////////////////
// SOCKET SERVER //
///////////////////

var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({ port: 8080 });
wss.on('connection', function connection(ws) {
	ws.on('message', function incoming(message) {
		
	});
	ws.on('close', function closing() {
		console.log('connection closed');
		// pause
		pause()
	});

	console.log('connection opened');
	// unpause
	unpause()
	// catch me up
	ws.send(JSON.stringify(catchup));
});

var catchup = [];
wss.broadcast = function broadcast(data) {
	data.forEach(function(item){catchup.push(item)});
	data = JSON.stringify(data);
	for (var i in this.clients) {
		this.clients[i].send(data);
	}
};
function reset_broadcast(){
	catchup = [];
}

var paused = true;
function pause () {
	if(!paused && wss.clients.length===0){
		console.log('let it go man');
		paused = true;
	}
}
function unpause () {
	if(paused && wss.clients.length>0){
		console.log('let\'s get moving');
		paused = false;
		fetch();
	}
}


////////////////////
// TORRENT SERVER //
////////////////////

var DHT = require('bittorrent-dht')
var geoip = require('geoip-local');
function fetch () {
	// get next magnet
	magnets_pointer = (magnets_pointer+1)%magnets.length;
	var uri = magnets[magnets_pointer];
	var hash = uri.match(/btih:([a-z0-9]+)/i)[1];
	var name = uri.split('&')[1].replace(/\+/g, ' ').substr(3);

	var dht = new DHT()

	dht.listen(20000, function () {
		console.log('now listening to hash '+hash);
		resetTimeout();
	})

	dht.on('ready', function () {
		console.log('ready');
		reset_broadcast();
		wss.broadcast([{
			type: "name",
			text: name
		}]);
		dht.lookup(hash)
		resetTimeout();
	})

	var peerCount = 0;
	var timeout;
	resetTimeout();
	dht.on('peer', function (addr, hash, from) {
		peerCount++;
		geoip.lookup(addr.split(":")[0], function(geo){
			wss.broadcast([{
				type: "peer",
				text: geo.city+' '+geo.region+' '+geo.country,
				coords: geo.ll
			}, {
				type: "details",
				text: peerCount
			}]);
		});
		resetTimeout(10000);
	})
	dht.on('error', function () {
		console.log('error');
		finish();
	})

	function resetTimeout(time){
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			console.log('timed out');
			finish();
		}, time || 50000);
	}

	function finish(){
		clearTimeout(timeout);
		dht.destroy(function () {
			if(!paused) fetch();
		})
	}
}

var magnets_pointer = 0;
var magnets = ["magnet:?xt=urn:btih:D18B786E32D43705AD37DF09A10A0F5B9173111E&dn=the+equalizer+2014+720p+brrip+x264+yify&tr=http%3A%2F%2Ftracker.trackerfix.com%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.com%3A1337",
"magnet:?xt=urn:btih:CCFDBD308CFE0CF051DD86A44CF50FBC2435A236&dn=renaissance+2006+bdrip1080+hd+net+mkv+rus&tr=http%3A%2F%2Fwww.hd-net.org%2F%2Fannounce.php&tr=udp%3A%2F%2Fopen.demonii.com%3A1337",
"magnet:?xt=urn:btih:C4477073A96A9BED8B739E1BAE477731282243C3&dn=horrible+bosses+2+2014+hdrip+hc+xvid+ac3+rav3n&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.com%3A1337",
"magnet:?xt=urn:btih:FE4CD297ECE7ECDEECA59462ACD825327215D2B5&dn=the+equalizer+2014+1080p+brrip+x264+yify&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
"magnet:?xt=urn:btih:11A2AC68A11634E980F265CB1433C599D017A759&dn=guardians+of+the+galaxy+2014+1080p+brrip+x264+yify&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
"magnet:?xt=urn:btih:2552169E161A1E766AA1DDC5F03B16AC5CB50F68&dn=the+maze+runner+2014+1080p+brrip+x264+yify&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
"magnet:?xt=urn:btih:5E75B9E56EF8CD2AE9215DB0C97970B1B1F3E2E4&dn=gone+girl+2014+1080p+web+dl+dd5+1+h264+rarbg&tr=udp%3A%2F%2F12.rarbg.me%3A80%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.com%3A1337",
"magnet:?xt=urn:btih:07C5AE66B57763F5DC0E598A29355A61C975B04F&dn=teenage+mutant+ninja+turtles+2014+1080p+brrip+x264+yify&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
"magnet:?xt=urn:btih:1865BAF195B6DE7402B84093FCAA12A0275C7E4C&dn=my+illegal+wife+2014&tr=http%3A%2F%2Fpinoy-talaga.net%2Fannounce.php%3Fpasskey%3D030112af0c02ce78d4d9c0cbc2ccb8ab&tr=udp%3A%2F%2Fopen.demonii.com%3A1337",
"magnet:?xt=urn:btih:8532E6A6EF10C42591CB23714D71BB9B05AB5B5A&dn=the+equalizer+2014+french+subforced+brrip+xvid+venum&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
"magnet:?xt=urn:btih:9F65B621A211E9DF47137ACE6DEFDC63F284C594&dn=this+is+where+i+leave+you+2014+720p+brrip+x264+yify&tr=http%3A%2F%2Ftracker.trackerfix.com%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.com%3A1337",
"magnet:?xt=urn:btih:902524F2D596A0FA57D43C077442ADF673A45F20&dn=the+maze+runner+2014+truefrench+bdrip+xvid+glups&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
"magnet:?xt=urn:btih:2432BC44B05327B1AAE16E2DA0A59FD720300956&dn=the+maze+runner+2014+720p+brrip+x264+yify&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
"magnet:?xt=urn:btih:836D2E8C6350E4CE3800E812B60DE53A63FEB027&dn=guardians+of+the+galaxy+2014+720p+brrip+x264+yify&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
"magnet:?xt=urn:btih:D00F27955A386954B648A11AFC62A8BF654709C9&dn=dracula+untold+2014+720p+hdrip+x264+ac3+jyk&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
"magnet:?xt=urn:btih:CD7D8693E8D10A3AF97A34D8158C5BEE5F09085B&dn=nightcrawler+2014+dvdscr+x264+aac+rarbg&tr=udp%3A%2F%2F12.rarbg.me%3A80%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.com%3A1337",
"magnet:?xt=urn:btih:6B37AB7B52375D6052022542AF23F249549D3C37&dn=let+s+be+cops+2014+720p+brrip+x264+yify&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
"magnet:?xt=urn:btih:5A37B321FD63828F2B304961CC151A1C696AEE3E&dn=edge+of+tomorrow+2014+1080p+brrip+x264+yify&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
"magnet:?xt=urn:btih:4EFE4986FC8B15951469CF6AC82FE102E8C9007A&dn=if+i+stay+2014+720p+brrip+x264+yify&tr=http%3A%2F%2Ftracker.trackerfix.com%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.com%3A1337",
"magnet:?xt=urn:btih:5ABFFD8A216F9AED98A8B22BC05CB642FDC409F2&dn=the+maze+runner+2014+dvdrip+xvid+mp3+rarbg&tr=udp%3A%2F%2F12.rarbg.me%3A80%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.com%3A1337",
"magnet:?xt=urn:btih:F5483E44EBD64519D5FEACFC22F7373B03B4CB59&dn=the+good+lie+2014+720p+brrip+x264+yify&tr=http%3A%2F%2Ftracker.trackerfix.com%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.com%3A1337",
"magnet:?xt=urn:btih:1E44E73983D4CE54A0B4AFF91E078A699610B7EC&dn=gone+girl+2014+hdrip+xvid+sam+etrg&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce",
"magnet:?xt=urn:btih:650F3803E15881E22E04B6223CE38BDEF38FA2BD&dn=dawn+of+the+planet+of+the+apes+2014+720p+brrip+x264+yify&tr=http%3A%2F%2Ftracker.trackerfix.com%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.com%3A1337",
"magnet:?xt=urn:btih:D7643A7ECFA90151DF3C4C2665F5C593CD240DC9&dn=bachelor+night+2014+1080p+brrip+x264+yify&tr=http%3A%2F%2Ftracker.trackerfix.com%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.com%3A1337",
"magnet:?xt=urn:btih:68D3BAB92818BC9075032F619740F14421F1280D&dn=the+fault+in+our+stars+2014+720p+brrip+x264+yify&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce"]