#!/usr/bin/env node

'use strict';

var debug = require('debug')('vcl-preprocessor:cli');
var vcl = require('../index');
var path = require('path');
var info = require('../package.json');
var chalk = require('chalk');
var chokidar = require('chokidar');

debug('cli time');

var yargs = require('yargs')
  .version(info.version, 'version')
  .help('help')
  .alias('version', 'v')
  .alias('help', 'h')
  .usage('Usage: vcl-preprocessor <input> <output>')
  .describe('watch', 'watches the input file for changes')
  .alias('watch', 'w')
  .describe('import-root', 'base directory for file based imports')
  .alias('import-root', 'i')
  .describe('source-map', 'enable source maps')
  .alias('source-map', 's')
  .describe('optimize', 'optimize css')
  .alias('optimize', 'o')
  .describe('theme', 'use theme')
  .alias('theme', 't')
  .count('verbose')
  .alias('V', 'verbose');

// Examples
yargs
  .example('vcl-preprocessor index.sss dist/compiled.css',
    'Compile index.sss and output to dist/compiled.css');

var argv = yargs.argv;

var V_LEVEL = argv.verbose;

if (V_LEVEL === 0) {
  // catch exceptions and show only error message
  // if not running verbosely
  process.on('uncaughtException', function(err){
    console.log(chalk.red(err.toString()));
    console.log('run with --verbose to see stacktrace');
    process.exit(1);
  });
}

debug('command line options:');
debug(argv);

const opts = {};

if (argv.root) {
  var root = path.resolve(argv.root);
  debug('using root: ' + root);
  opts.root = root;
}

if (argv.optimize) {
  opts.optimize = true;
}

if (argv['source-map']) {
  opts.sourceMap = true;
}



if (argv['theme']) {
  opts.theme = argv['theme'];
}

if (process.stdin.isTTY) {
  var inputFile = argv._[0];
  var outputFile = argv._[1];

  if (!inputFile) {
    return yargs.showHelp();
  }

  (async () => {
    const result = await vcl.compileFile(inputFile, outputFile, opts);

    if (argv['watch']) {
      const fileChangeNotify = () => console.log('\nWaiting for file changes...');

      const extractImports = (result) => result.messages
                                               .filter(msg => (msg.type === 'dependency'))
                                               .map(dep => dep.file);

      let watchlist = [ inputFile, ...extractImports(result) ];

      const watcher = chokidar.watch(watchlist, {
        usePolling: argv.poll,
        interval: argv.poll && typeof argv.poll === 'number' ? argv.poll : 100,
        awaitWriteFinish: {
          stabilityThreshold: 50,
          pollInterval: 10
        }
      })

      console.log(chalk`{green Finished {bold ${result.outputFile}}}`);

      watcher.on('ready', fileChangeNotify).on('change', file => {

        console.log('Change detected in ' + file);

        (async () => {
          try {
            const result = await vcl.compileFile(inputFile, outputFile, opts);
            const updatedWatchlist = [ inputFile, ...extractImports(result) ];

            // Find files that are not part of the updated watchlist
            const toRemove = watchlist.filter(f => !updatedWatchlist.includes(f));
            // Find files that are new in the updated watchlist
            const toAdd = updatedWatchlist.filter(f => !watchlist.includes(f));
            watcher.unwatch(toRemove);
            watcher.add(toAdd);

            watchlist = updatedWatchlist;

            console.log(chalk`{green Updated {bold ${result.outputFile}}}`);

            return result
          } catch(ex) {
            error(ex);
          }
        })();
      })
    }

  })();
} else {
  var buffers = [];

  process.stdin.on('data', function(data){
    buffers.push(Buffer.from(data));
  });

  process.stdin.on('end', function(){
    var sssRaw = new Buffer.concat(buffers);
    var sss = sssRaw.toString();
    vcl(sss, opts).then(({css}) => {
      process.stdout.write(css);
    });
  });
}

function error(err, hold) {
  if (typeof err === 'string') {
    console.error(chalk.red(err))
  } else if (err.name === 'CssSyntaxError') {
    console.error(err.toString())
  } else {
    console.error(err)
  }
  if (hold) {
    return;
  }
  process.exit(1)
}
