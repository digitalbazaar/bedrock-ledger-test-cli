#!/usr/bin/env node

/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
const {config, util: {uuid}} = bedrock;
const {constants} = config;
const https = require('https');
const {WebLedgerClient} = require('web-ledger-client');

require('bedrock-ledger-context');

config.paths.log = '/tmp/bedrock';
config.loggers.console.level = 'error';

bedrock.events.on('bedrock-cli.init', () => bedrock.program
  .option('-h, --hostname <value>', 'The ledger host.')
  .option('-k, --ignoreSslErrors', 'Use strict SSL.')
  .option('-s, --send', 'Send a demonstration operation.')
  .option('-r, --recordPath <value>', 'A path to a json record to be sent.')
  .option('-g, --getRecordId <value>', 'Get a record by ID.')
);

bedrock.events.on('bedrock.started', async () => {
  try {
    await work();
  } catch(e) {
    console.error(
      'event bedrock.started failed when trying to initialize work.');
    console.error(e.message);
  }
  bedrock.exit();
});

// gets or creates a default record
function getRecord(path) {
  if(path) {
    // must have extension .json or .js
    return require(path);
  }
  return {
    '@context': constants.TEST_CONTEXT_V1_URL,
    id: `https://example.com/transaction/${uuid()}`,
    price: Math.floor(Math.random() * 1000000000000),
  };
}

async function work() {
  const {getRecordId, recordPath,
    hostname, ignoreSslErrors, send} = bedrock.program;
  const rejectUnauthorized = !ignoreSslErrors;
  if(!hostname) {
    throw new Error('hostname is a required parameter.');
  }
  const ledgerClient = new WebLedgerClient({
    hostname,
    httpsAgent: https.Agent({rejectUnauthorized}),
  });
  if(send) {
    const record = getRecord(recordPath);
    return _sendOperation({ledgerClient, record});
  }
  if(getRecordId) {
    return _getRecord({id: getRecordId, ledgerClient});
  }
}

async function _getRecord({id, ledgerClient}) {
  try {
    const result = await ledgerClient.getRecord({id});
    console.log(`Record details:\n${JSON.stringify(result, null, 2)}`);
  } catch(e) {
    console.error(`command get record failed for ${id}.`);
    console.error(e);
  }
}


async function _sendOperation({ledgerClient, record}) {
  try {
    const creator = await ledgerClient.getTargetNode();
    const operation = {
      '@context': constants.WEB_LEDGER_CONTEXT_V1_URL,
      creator,
      type: 'CreateWebLedgerRecord',
      record
    };
    await ledgerClient.sendOperation({operation});
    console.log(
      `Operation sent successfully.\n${JSON.stringify(operation, null, 2)}`);
  } catch(e) {
    console.error('command send record failed.');
    console.error(e);
  }
}

bedrock.start();
