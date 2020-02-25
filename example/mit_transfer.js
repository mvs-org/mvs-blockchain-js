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
            .then(height => Promise.all([
                blockchain.addresses.txs(["tGBMcLr6dwfaMaoYiJgtZ3cYUbbGsbpb8t"])
                    .then(txs => makeMITTransfer(txs, height)),
                blockchain.addresses.txs(["tDZ5YMLJ3z6VbvAsX1c8oe9hJ2nND4jszz"])
                    .then(txs => makeETPTransfer(txs, height)),
            ]))
            .then(([mitTransfer, etpTransfer])=> {
                mitTransfer.inputs=[mitTransfer.inputs[0]]
                mitTransfer.outputs=[mitTransfer.outputs[0]]
                etpTransfer.inputs.forEach(input => mitTransfer.inputs.push(input))
                etpTransfer.outputs.forEach(output => mitTransfer.outputs.push(output))
                return mitTransfer
            })
            .then((tx) => wallet.sign(tx))
            .then((tx) => tx.encode())
            // .then((tx) => blockchain.transaction.broadcast(tx.toString('hex')))
            .then(tx=>tx.toString('hex'))
            // .then(tx => JSON.stringify(tx, null, 4))
            .then(console.log))
    .catch(console.error);

function makeMITTransfer(txs, height) {
    return Metaverse.output.calculateUtxo(txs.transactions, ["tGBMcLr6dwfaMaoYiJgtZ3cYUbbGsbpb8t"])
        .then(utxos => Promise.all([
            Metaverse.output.findUtxo(utxos, {}, height),
            Metaverse.output.filter(utxos, {
                type: "mit"
            })
        ]))
        .then((results) => Metaverse.transaction_builder.transferMIT(results[0].utxo.concat(results[1]), "nova", recipient_address, recipient_avatar, "MIT_SUPERNOVA", change_address, results[0].change))
}

function makeETPTransfer(txs, height) {
    return Metaverse.output.calculateUtxo(txs.transactions, ["tDZ5YMLJ3z6VbvAsX1c8oe9hJ2nND4jszz"])
        .then(utxos => Metaverse.output.filter(utxos, {
            type: "etp"
        }))
        .then(utxos => Metaverse.output.findUtxo(utxos, { ETP: 123 }, height))
        // .then(console.log)
        .then((result) => Metaverse.transaction_builder.send(result.utxo, "tGBMcLr6dwfaMaoYiJgtZ3cYUbbGsbpb8t", undefined, { ETP: 123 }, result.utxo[0].address, result.change))
}