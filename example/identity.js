let blockchain = require('..')({
    url: "https://explorer-testnet.mvs.org/api/"
});
let Metaverse = require('metaversejs');

blockchain.addresses.txs(["tDZ5YMLJ3z6VbvAsX1c8oe9hJ2nND4jszz"])
    .then(txs => Metaverse.output.calculateUtxo(txs.transactions,["tDZ5YMLJ3z6VbvAsX1c8oe9hJ2nND4jszz"])) //Get all utxo
    .then((outputs)=>Metaverse.output.filter(outputs, {type:["did-issue", "did-transfer"]}))
    .then((outputs)=>blockchain.avatar.extract(outputs))
    .then(console.log)
    .catch(console.error);
