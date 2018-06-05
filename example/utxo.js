let blockchain = require('..')({
    url: "https://explorer-testnet.mvs.org/api/"
});
let Metaverse = require('metaversejs');
let addresses = ['t85Hm2nYwQXrry2cVmEHPq8krRdJ7KYjmq']

blockchain.addresses.txs(addresses)
    .then(txs => Metaverse.output.calculateUtxo(txs.transactions,addresses)) //Get all utxo
    .then(JSON.stringify)
    .then(console.log)
    .catch(console.error);
