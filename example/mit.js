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
        .then(height => blockchain.addresses.txs([recipient_address])
            .then(txs => Metaverse.output.calculateUtxo(txs.transactions, [recipient_address])) //Get all utxo
            .then((utxos) => Metaverse.output.findUtxo(utxos, target, height)) //Collect utxo for given target
             .then((result) => Metaverse.transaction_builder.registerMIT(result.utxo, recipient_address, "nova", "MULTI_MIT_1", "SOME CONTENT", change_address, result.change))
             .then(tx=>{
                 tx.addInput('tGBMcLr6dwfaMaoYiJgtZ3cYUbbGsbpb8t', 'ee1de35cd4cbf0f83978cb7feda50f5742cb3f6936758ea690a58aefffb10259', 0)
                 tx.addInput('tGBMcLr6dwfaMaoYiJgtZ3cYUbbGsbpb8t', 'ee1de35cd4cbf0f83978cb7feda50f5742cb3f6936758ea690a58aefffb10259', 2)

                 tx.addMITTransferOutput(recipient_address, "MULTI_MIT_1")
                 tx.addMITTransferOutput(recipient_address, "MULTI_MIT_2")
                 tx.outputs.splice(0,1)
                 return tx
             })
            .then((tx) => wallet.sign(tx))
            .then((tx) => tx.encode())
            // .then((tx) => blockchain.transaction.broadcast(tx.toString('hex')))
              .then(tx=>tx.toString('hex'))
            .then(console.log)))
    .catch(console.error);