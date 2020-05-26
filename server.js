const path = require("path");
var fs = require('fs');
var http = require('http');
var https = require('https');
// Certificate
const domain = "";

const privateKey = fs.readFileSync('/etc/letsencrypt/live/' + domain + '/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/' + domain + '/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/' + domain + '/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

var express = require('express');
var app = express();

// your express configuration here

var httpsServer = https.createServer(credentials, app);


function toHttps(req, res) {
	if(req.protocol !== "https"){
      const fullUrl = 'https://' + req.headers.host + req.url;
      res.redirect(fullUrl);
   }
}

app.use(express.static(path.join(__dirname, "assets")));

app.get('*', (req, res) =>  {
	toHttps(req, res);
	res.sendFile(path.join(__dirname, "/index.html"));
});


httpsServer.listen(443);
app.listen(80);