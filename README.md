# bedrock-ledger-test-cli

## Setup:

  - You need to have a [web ledger node](https://github.com/digitalbazaar/bedrock-ledger-app-template) already running somewhere.
  - You then use that node as the --hostName or -h to the cli 
  - *note: do not specify a protocol such as https for the ledger node*

```
git clone git@github.com:digitalbazaar/bedrock-ledger-app-template.git
cd bedrock-ledger-app-template
npm i
npm start //note the address of the node
cd ..
cd bedrock-ledger-test-cli
npm run send -- -h your-ledger-node:port -k
```

cli commands
```
  .option('-h, --hostname <value>', 'The ledger host.')
  .option('-k, --ignoreSslErrors', 'Use strict SSL.')
  .option('-s, --send', 'Send a demonstration operation.')
  .option('-r, --recordFile <value>', 'A path to a JSON record file to be sent.')
  .option('-g, --getRecordId <value>', 'Get a record by ID.')
```

npm commands
```
npm run send -- -h your-node:port
```
