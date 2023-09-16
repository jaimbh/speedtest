// npm init -y
// npm i express axios nodemon ioredis

const express = require('express');
const axios = require('axios').default;
const client = require('./client');

const app = express();

app.get('/', async (req, res)=>{
	const cacheValue = await client.get('todos');
	
	if(cacheValue) return res.json(JSON.parse(cacheValue));
	
	const {data} = await axios.get('https://jsonplaceholder.typicode.com/todos');
	await client.set('todos', JSON.stringify(data));
	await client.expire('todos', 30);
	return res.json(data);
});

app.get('/redis', async (req, res)=>{
		const redisData = await client.get('redisData');

		if(redisData == null || redisData == ''){
			const {data} = await axios.get('https://jsonplaceholder.typicode.com/todos');
			await client.set('redisData', JSON.stringify(data));
		}
		
		console.time('redis');
		const value = await client.get('redisData');
		console.timeEnd('redis');
		
		return res.json(JSON.parse(value));
});

app.get('/fetchapi', async (req, res)=>{		
	console.time('fetchapi');
	const {data} = await axios.get('https://jsonplaceholder.typicode.com/todos');
	console.timeEnd('fetchapi');
	
	return res.json(data);
});

app.listen(3000);