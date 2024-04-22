#! /usr/bin/env node

const fs = require('fs');
const yargs = require('yargs');
const { loadConfig, scanDirectory } = require('../src/index.js');

const banner = fs.readFileSync('banner.txt', { encoding: 'utf8' });

const usage = `${banner}\nUsage: server-scanner -p <path> -c <config>`;

const options = yargs
  .usage(usage)
  .option('p', {
    alias: 'path',
    describe: 'Web root path location',
    default: '/var/www/html',
  })
  .option('c', {
    alias: 'config',
    describe: 'Config path location',
    default: 'list.json',
  })
  .help(true).argv;

const { path, config } = options;

// Load config file and start scanning
loadConfig(config)
  .then((cfg) => scanDirectory(path, cfg))
  .catch((err) => {
    console.error(err);
  });
