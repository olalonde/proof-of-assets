#!/usr/bin/env node

var program = require('commander'),
  bitcoin = require('bitcoin'),
  async = require('async'),
  fs = require('fs');

program
  .version(JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf8')).version)
  .usage('<action>')
  .option('-h, --host <host>', 'bitcoind RPC host', 'localhost')
  .option('-p, --port <port>', 'bitcoind RPC port', parseInt, 8332)
  .option('--user <user>', 'bitcoind RPC user')
  .option('--pass <pass>', 'bitcoind RPC pass')
  .option('--human', 'Human readable output.');

function parse_list (str) {
  var arr = str.split(',');
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].trim();
  }
  return arr;
}

program
  .command('signall <id>')
  .description('Generates an asset proof file with all private keys in wallet.')
  .option('--addresses <addresses>', 'Comma separated list of addresses to sign.', parse_list)
  .action(function (id, opts) {
    var client = new bitcoin.Client({
      host: program.host,
      port: program.port,
      user: program.user,
      pass: program.pass
    });

    //client.getBalance('*', 6, function (err, balance) {
      //if (err) return console.log(err);
      //console.log('Balance:', balance);
    //});

    //@TODO: batch requests https://github.com/freewil/node-bitcoin#batch-multiple-rpc-calls-into-single-http-request

    var addresses = opts.addresses,
      output = {
        id: id,
        signatures: []
      };

    async.series([
      function (cb) {
        if (addresses) return cb();

        client.cmd('listreceivedbyaddress', 1, function (err, res){
          if (err) return cb(err);
          cb();
        });
      },
      function (cb) {
        async.each(addresses, function (addr, cb) {
          client.cmd('signmessage', addr, id, function (err, res) {
            if (err) return cb(err);

            output.signatures.push({
              address: addr,
              signature: res
            });

            cb();
          });
        }, cb);
      }
    ], function (err) {
      if (err) return console.error(err);            
      if (program.human) {
        console.log(output);
      }
      else {
        console.log(JSON.stringify(output));
      }
    });


  });

program.parse(process.argv);
