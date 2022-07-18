// /hostname/date-time => flamegraph file

const express = require('express')
const app = express()
const { MongoClient } = require("mongodb");

const port = 3000

const uri = "mongodb+srv://skunkworks:skunkworks@cluster0.vqgeawv.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})