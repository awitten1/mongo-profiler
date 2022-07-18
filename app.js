// /hostname/date-time => flamegraph file

const express = require('express');
const app = express();
const { MongoClient } = require("mongodb");

const port = 3000;

const uri = "mongodb+srv://skunkworks:skunkworks@cluster0.vqgeawv.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function findOne(hostname, date) {
    const db = client.db("flamegraphs");
    const flamegraphs = db.collection("flamegraphs");
    const query = {hostname: hostname, date: date};
    const result = await flamegraphs.findOne(query);
    return result.flamegraph;
}

//new Date("2022-07-18T15:41:26.839+00:00")
app.get('/:hostname/:datetime', async function(req, res) {
    const result = await findOne(req.params.hostname, new Date(req.params.datetime))
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(result)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})