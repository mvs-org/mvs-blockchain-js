let blockchain = require('..')({
    url: "https://explorer-testnet.mvs.org/api/"
});
let Metaverse = require('metaversejs');

blockchain.addresses.txs(["tGBMcLr6dwfaMaoYiJgtZ3cYUbbGsbpb8t"])
    .then(txs => Metaverse.output.calculateUtxo(txs.transactions,["tGBMcLr6dwfaMaoYiJgtZ3cYUbbGsbpb8t"])) //Get all utxo
    .then((outputs)=>Metaverse.output.filter(outputs, {type:"did-register"}))
    .then((outputs)=>blockchain.avatar.extract(outputs))
    .then(console.log)
    .catch(console.error);
