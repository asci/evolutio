#!/usr/bin/env node
const path = require('path');
const jscodeshift = require('jscodeshift/src/Runner');
const opts = require('nomnom')
   .option('dry', {
      abbr: 'd',
      flag: true,
      default: true,
      help: 'Dry run'
   })
   .option('print', {
      abbr: 'p',
      flag: true,
      help: 'Print output'
   })
   .option('src', {
      abbr: 's',
      default: './src',
      help: 'path to directory to remove outdated mutations'
   })
   .option('winners', {
      abbr: 'w',
      default: '',
      help: 'Winners DNA: a JSON file with winner mutations, key is a mutation name and value is a winner gene'
   })
   .option('version', {
      flag: true,
      help: 'print version and exit',
      callback: function() {
         return require('../package').version;
      }
   })
   .parse();

process.env.DNA = path.join(process.cwd(), opts.winners);

jscodeshift.run(
  path.join(__dirname, '../src/transform.js'),
  [path.join(process.cwd(), opts.src)],
  {
    dry: opts.dry,
    print: opts.print
  });
