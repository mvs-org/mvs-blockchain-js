let blockchain = require('..')({
    url: "https://explorer.mvs.org/api/"
});
let Metaverse = require('metaversejs');

var target = {
    ETP: 100000
};

var recipient_address = "MAe4x3pGxMxaKWs9YTsTVgV2vfvsaTXaUs";
var change_address = "MKXYH2MhpvA3GU7kMk8y3SoywGnyHEj5SB";

Metaverse.wallet.fromMnemonic("lunar there win define minor shadow damage lounge bitter abstract sail alcohol yellow left lift vapor tourist rent gloom sustain gym dry congress zero")
    .then((wallet) =>
        blockchain.addresses.txs(wallet.getAddresses())
        .then(txs => Metaverse.transaction_builder.calculateUtxo(txs.transactions, wallet.getAddresses())) //Get all utxo
        .then((utxos) => Metaverse.transaction_builder.findUtxo(utxos, target)) //Collect utxo for given target
        .then((result) => Metaverse.transaction_builder.send(result.utxo, recipient_address, target, change_address, result.change))
        .then((tx) => wallet.sign(tx))
        .then((tx) => tx.encode())
        // .then((tx) => blockchain.transaction.broadcast(tx.toString('hex')))
        .then(console.log))
    .catch(console.error);
