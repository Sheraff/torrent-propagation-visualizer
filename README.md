Map popular torrents' peers over time
==============================

Through the torrent protocol, it is easy to discover peers and localize their IP addresses. Let’s use this info to track over time the geographical propagation of popular torrents (populars tv shows, YIFY movies…).

![Screen shot of the current prototype](https://github.com/Sheraff/torrent-propagation-visualizer/blob/master/ScreenShot.png)

# test it yourself
- Clone the repository and navigate with the terminal in its folder.
- With one terminal, launch the websocket server: `node ws.js`
- With another terminal, launch the php server: `php -S localhost:8888` (or whichever local host and port you want)
- In your browser, navigate to [`http://localhost:8888`](http://localhost:8888)

# files
- [`ws.js`](https://github.com/Sheraff/torrent-propagation-visualizer/blob/master/ws.js) is meant to be the a websocket server used to discover peers for torrents and stream their GPS coordinates to the clients
- [`client.js`](https://github.com/Sheraff/torrent-propagation-visualizer/blob/master/client.js) is the main script for the display of informations, both a websocket client (using [einaros' ws](https://github.com/einaros/ws)) and an SVG engine (using [d3.js](https://github.com/mbostock/d3) and [topojson](https://github.com/mbostock/topojson))

# credits
- peer discovery algorithm by [Feross](https://github.com/feross/bittorrent-dht)
- svg & d3 map representation by [dwtkns](https://gist.github.com/dwtkns/4973620) (demo [here](http://bl.ocks.org/dwtkns/4973620))
