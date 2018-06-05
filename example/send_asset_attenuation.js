let blockchain = require('..')({
    url: "https://explorer-testnet.mvs.org/api/"
});
let Metaverse = require('../../metaversejs');

var target = {
    "SUPER.NOVAE": 2
};

var recipient_address = "t85Hm2nYwQXrry2cVmEHPq8krRdJ7KYjmq";
var change_address = "tGwPZUjqAmTfY8m4i36bgBuLFaEMtcVY72";

Metaverse.wallet.fromMnemonic("butter vacuum breeze glow virtual mutual veteran argue want pipe elite blast judge write sand toilet file joy exotic reflect truck topic receive wait", 'testnet')
    .then((wallet) =>
        blockchain.height()
        .then(height => blockchain.addresses.txs(["tGwPZUjqAmTfY8m4i36bgBuLFaEMtcVY72", "t85Hm2nYwQXrry2cVmEHPq8krRdJ7KYjmq"])
            .then(txs => Metaverse.output.calculateUtxo(txs.transactions, ["tGwPZUjqAmTfY8m4i36bgBuLFaEMtcVY72", "t85Hm2nYwQXrry2cVmEHPq8krRdJ7KYjmq"])) //Get all utxo
            .then((utxos) => Metaverse.output.findUtxo(utxos, target, height)) //Collect utxo for given target
              // .then(console.log)
              // .then((result) => Metaverse.transaction_builder.send(result.utxo, recipient_address, target, change_address, result.change, result.lockedAssetChange))
//              .then((result) => Metaverse.transaction_builder.sendLockedAsset(result.utxo, recipient_address, "SUPER.NOVAE", 2, "PN=0;LH=5;TYPE=2;LQ=2;LP=10;UN=2;UC=5,5;UQ=1,1", change_address, result.change, result.lockedAssetChange))
             .then((result) => Metaverse.transaction_builder.sendLockedAsset(result.utxo, recipient_address, "SUPER.NOVAE", 2, "PN=0;LH=45;TYPE=1;LQ=2;LP=90;UN=2", change_address, result.change, result.lockedAssetChange))
            .then((tx) => wallet.sign(tx))
            .then((tx) => tx.encode())
            .then((tx) => blockchain.transaction.broadcast(tx.toString('hex')))
              // .then(tx=>tx.toString('hex'))
              // .then(tx=>Metaverse.transaction.decode(tx))
              // .then(JSON.stringify)
              // .then(tx=>tx.outputs)
            .then(console.log)))
    .catch(console.error);
