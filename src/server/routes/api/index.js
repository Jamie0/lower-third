import { Router } from 'express';
import bodyParser from 'body-parser';

import { h } from 'preact';
import renderToString from 'preact-render-to-string';

import fs from 'fs';
import path from 'path';

const router = Router();


let live = { items: [] };
try {
	live = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../../template.json')))
} catch (e) { }
let clients = [];

router.use(bodyParser.json());

function eventsHandler(req, res, next) {
	if (req.internal) return next();

	const headers = {
		'Content-Type': 'text/event-stream',
		'Connection': 'keep-alive',
		'Cache-Control': 'no-cache'
	};

	res.writeHead(200, headers);
	const data = `data: ${JSON.stringify(live)}\n\n`;
	res.write(data);
	res.flush && res.flush();

	// Generate an id based on timestamp and save res
	// object of client connection on clients list
	// Later we'll iterate it and send updates to each client

	const clientId = Date.now();
	const newClient = {
		id: clientId,
		res
	};
	clients.push(newClient);

	// When client closes connection we update the clients list
	// avoiding the disconnected one

	req.on('close', () => {
		console.log(`${clientId} Connection closed`);
		clients = clients.filter(c => c.id !== clientId);
	});
}

router.get('/', (req, res) => {
	// fetch any data here for whatever is at / :) 

	console.log('hi', req, req.path)
	res.json(live)
});

router.post('/transition', (req, res) => {
	live = req.body || {};
	clients.forEach(c => {
		c.res.write(`data: ${JSON.stringify(live)}\n\n`)
		c.res.flush && c.res.flush();
	});

	res.json({ success: true })
})

router.get('/subscribe', eventsHandler);

router.get('/live', (req, res) => {
	// uncomment to make it cachable 
	// res.set('Cache-Control', 'public, max-age=3600');

	res.json({})
});

router.use((req, res) => {
	res.status(404)
	res.json(null)
})

export default router;