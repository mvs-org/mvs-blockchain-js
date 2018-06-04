let blockchain = require('..')({
    url: "https://explorer-testnet.mvs.org/api/"
});
let Metaverse = require('../../metaversejs');

blockchain.addresses.txs(["t82k8SzgW7rwW3SRPKj4KqbXoaixSRo74U"])
    .then(txs => Metaverse.output.calculateUtxo(txs.transactions,["t82k8SzgW7rwW3SRPKj4KqbXoaixSRo74U"])) //Get all utxo
    .then(utxo=>blockchain.balance.addressesFromUtxo(utxo, ["t82k8SzgW7rwW3SRPKj4KqbXoaixSRo74U"], 452650))
//    .then((outputs)=>Metaverse.output.filter(outputs, {type:"asset-cert"}))
    .then(JSON.stringify)
    .then(console.log)
    .catch(console.error);
