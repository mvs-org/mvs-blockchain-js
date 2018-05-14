let blockchain = require('..')({
    url: "https://explorer.mvs.org/api/"
});
let Metaverse = require('metaversejs');

var target = {
    "ETP": 100000,
    "MVS.ZGC": 10
};

blockchain.addresses.txs(["MR2Vwv8RQh6Lf4G2kjHaavvzyNYJScFm3n"])
    .then(txs => Metaverse.transaction_builder.calculateUtxo(txs.transactions,["MR2Vwv8RQh6Lf4G2kjHaavvzyNYJScFm3n"])) //Get all utxo
    .then((utxos) => Metaverse.transaction_builder.findUtxo(utxos, target)) //Collect utxo for given target
    .then(console.log)
    .catch(console.error);
