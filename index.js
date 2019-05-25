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
  .option('-g, --getRecordId <value>', 'Get a record by ID.')
);

bedrock.events.on('bedrock.started', async () => {
  try {
    await work();
  } catch(e) {
    console.error(e.message);
  }
  bedrock.exit();
});

async function work() {
  const {getRecordId, hostname, ignoreSslErrors, send} = bedrock.program;
  const rejectUnauthorized = !ignoreSslErrors;
  if(!hostname) {
    throw new Error('hostname is a required parameter.');
  }
  const ledgerClient = new WebLedgerClient({
    hostname,
    httpsAgent: https.Agent({rejectUnauthorized}),
  });
  if(send) {
    return _sendOperation({ledgerClient});
  }
  if(getRecordId) {
    return _getRecord({id: getRecordId, ledgerClient});
  }
}

async function _getRecord({id, ledgerClient}) {
  const result = await ledgerClient.getRecord({id});
  console.log(`Record details:\n${JSON.stringify(result, null, 2)}`);
}

async function _sendOperation({ledgerClient}) {
  const creator = await ledgerClient.getTargetNode();
  const operation = {
    '@context': constants.WEB_LEDGER_CONTEXT_V1_URL,
    creator,
    type: 'CreateWebLedgerRecord',
    record: {
      '@context': constants.TEST_CONTEXT_V1_URL,
      id: `https://example.com/transaction/${uuid()}`,
      price: Math.floor(Math.random() * 1000000000000),
    }
  };
  await ledgerClient.sendOperation({operation});
  console.log(
    `Operation sent successfully.\n${JSON.stringify(operation, null, 2)}`);
}

bedrock.start();
