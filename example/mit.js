let blockchain = require('..')({
    url: "https://explorer-testnet.mvs.org/api/"
});
let Metaverse = require('metaversejs');

var target = {
};

var recipient_address = "tGBMcLr6dwfaMaoYiJgtZ3cYUbbGsbpb8t";
var change_address = "tGBMcLr6dwfaMaoYiJgtZ3cYUbbGsbpb8t";

Metaverse.wallet.fromMnemonic("butter vacuum breeze glow virtual mutual veteran argue want pipe elite blast judge write sand toilet file joy exotic reflect truck topic receive wait", 'testnet')
    .then((wallet) =>
        blockchain.height()
        .then(height => blockchain.addresses.txs(["tGBMcLr6dwfaMaoYiJgtZ3cYUbbGsbpb8t"])
            .then(txs => Metaverse.output.calculateUtxo(txs.transactions, ["tGBMcLr6dwfaMaoYiJgtZ3cYUbbGsbpb8t"])) //Get all utxo
            .then((utxos) => Metaverse.output.findUtxo(utxos, target, height)) //Collect utxo for given target
             .then((result) => Metaverse.transaction_builder.registerMIT(result.utxo, recipient_address, "nova", "MIT_SUPERNOVAE", "SOME OTHER CONTENT", change_address, result.change))
            .then((tx) => wallet.sign(tx))
            .then((tx) => tx.encode())
            .then((tx) => blockchain.transaction.broadcast(tx.toString('hex')))
              // .then(tx=>tx.toString('hex'))
            .then(console.log)))
    .catch(console.error);
