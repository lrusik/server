const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

const app = express();
const domain = "";

// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/' + domain + '/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/' + domain + '/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/' + domain + '/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

// Starting both http & https servers
const httpServer = http.createServer(app);
const server = https.createServer(credentials, app);

app.use(express.static('assets'));

/*
httpServer.get('*', (req, res) => {
	res.redirect('https://' + req.headers.host + req.url);
})
*/

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
})

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

server.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});
