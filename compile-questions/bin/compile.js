#! /usr/bin/env node
const glob = require('glob')
const markdownToJson = require("markdown-to-json")

glob('questions/**/*.md', {}, (err, files)=>{
  markdownToJson.parse(files, {'width':100, 'outfile': 'test.json', 'stripfilename': true})
})
