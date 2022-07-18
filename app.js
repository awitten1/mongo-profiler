// /hostname/date-time => flamegraph file

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

app.get('/:hostname/:datetime', async function(req, res, next) {
    res.setHeader('Content-Type', 'image/svg+xml');
    findOne(req.params.hostname, new Date(req.params.datetime))
        .then((fg) => res.send(fg))
        .catch(next);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})