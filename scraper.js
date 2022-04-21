const express = require('express');
const { spawn } = require("child_process");
const axios = require("axios");
const yaml = require('js-yaml');
const fs   = require('fs');
const args = require('minimist')(process.argv.slice(2))
const path = require('path')

const file_name = args['config'];
let doc_name;

if (path.isAbsolute(file_name)) {
    doc_name = file_name;
} else {
    doc_name = path.join(__dirname, file_name);
}

let config;

try {
    config = yaml.load(fs.readFileSync(doc_name, 'utf8'));
} catch (e) {
    console.log(e);
    process.exit(1)
}

const targets = config['targets'];

function pullFile(fileUrl, outputFile) {
  axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream',
  }).then(response => {
    response.data.pipe(fs.createWriteStream(outputFile));
  });
}

function processTarget(target) {
    const rand = Math.floor(Math.random() * 100000);
    const intermediateFileNameOne = "interFile-" + rand + ".perf";
    const intermediateFileNameTwo = "interFile-" + rand + ".folded";
    const finalFileName = "kernel-" + rand + ".svg";
    pullFile(target, intermediateFileNameOne);
    spawn(path.join(__dirname, "stackcollapse-perf.pl"), [intermediateFileName],
      { stdio: ['ignore', fs.openSync(intermediateFileNameTwo, 'a')] });
    spawn(path.join(__dirname, "flamegraph.pl"),
      { stdio: ['ignore', fs.openSync(finalFileName, 'a')] });
    spawn("rm", ["-f", intermediateFileNameOne, intermediateFileNameTwo]);
}

targets.forEach(processTarget)



/*
const app = express();

app.get('/', (req, res) => {

})*/

