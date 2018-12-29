#!/usr/bin/env node

const pandoc = require('pandoc-filter-promisified');
const action = require('../src/index.js')

pandoc.stdio(action)
