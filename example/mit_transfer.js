let blockchain = require('..')({
    url: "https://explorer-testnet.mvs.org/api/"
});
let Metaverse = require('metaversejs');

var recipient_address = "tFhuyTYeNAttzvEN8FUM5h52GGAujkrKbs";
var recipient_avatar = "laurent";
var change_address = "tGBMcLr6dwfaMaoYiJgtZ3cYUbbGsbpb8t";

Metaverse.wallet.fromMnemonic("butter vacuum breeze glow virtual mutual veteran argue want pipe elite blast judge write sand toilet file joy exotic reflect truck topic receive wait", 'testnet')
    .then((wallet) =>
        blockchain.height()
        .then(height => blockchain.addresses.txs(["tGBMcLr6dwfaMaoYiJgtZ3cYUbbGsbpb8t"])
            .then(txs => Metaverse.output.calculateUtxo(txs.transactions, ["tGBMcLr6dwfaMaoYiJgtZ3cYUbbGsbpb8t"])) //Get all utxo
            .then((utxos) => Promise.all([
                Metaverse.output.findUtxo(utxos, {}, height),
                Metaverse.output.filter(utxos, {
                    type: "mit"
                })
            ]))
            .then((results) => Metaverse.transaction_builder.transferMIT(results[0].utxo.concat(results[1]), "nova", recipient_address, recipient_avatar, "MIT_SUPERNOVA", change_address, results[0].change))
            .then((tx) => wallet.sign(tx))
            .then((tx) => tx.encode())
            .then((tx) => blockchain.transaction.broadcast(tx.toString('hex')))
            // .then(tx=>tx.toString('hex'))
            .then(console.log)))
    .catch(console.error);
