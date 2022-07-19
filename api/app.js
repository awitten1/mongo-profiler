
const express = require('express');
const app = express();
const { MongoClient } = require("mongodb");
require('dotenv').config();

const port = 3000;

const uri = process.env.ATLAS_URI;
const client = new MongoClient(uri);
const db = client.db("flamegraphs");
const flamegraphs = db.collection("flamegraphs");

async function findOne(hostname, date) {
    const query = {hostname: hostname, date: date};
    const result = await flamegraphs.findOne(query);
    return result.flamegraph;
}

async function findDistinct() {
    const res = await flamegraphs.distinct("hostname")
    console.log(`Found hostnames: ${res}`)
    return res
}

app.get('/:hostname/flamegraph/:datetime', async function(req, res, next) {
    res.setHeader('Content-Type', 'image/svg+xml');
    findOne(req.params.hostname, new Date(req.params.datetime))
        .then((fg) => res.send(fg))
        .catch(next);
})

app.get('/:hostname/timestamps', async function(req, res, next) {
    const query = {hostname: req.params.hostname}
    const options = {projection: {date: 1}}
    const cursor = flamegraphs.find(query, options).limit(10)
    const count = await cursor.count()
    console.log(`Found ${count} docs in handling req ${req.originalUrl}`);
    const timestamps = [];
    try {
        await cursor.forEach((doc) => { timestamps.push(doc); });
    } catch (err) {
        next(err)
    }
    res.setHeader('Content-Type', "application/json");
    res.send({timestamps: timestamps})
});

app.get('/hostnames', async function(_, res, next) {
    res.setHeader('Content-Type', 'application/json');
    findDistinct().then((hostnames) => res.send({hostnames: hostnames})).catch(next)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})