# bedrock-ledger-test-cli

Setup:

  - You need to have a [web ledger node](https://github.com/digitalbazaar/bedrock-ledger-app-template/tree/initial) already running somewhere.
  - you then use that node as the --hostName or -h to the cli
  - note: do not specify a protocol such as https for the ledger node

```
git clone git@github.com:digitalbazaar/bedrock-ledger-app-template.git
cd bedrock-ledger-app-template
npm i
npm start
cd ..
cd bedrock-ledger-test-cli
npm run send -- -h your-ledger-node:port
```
