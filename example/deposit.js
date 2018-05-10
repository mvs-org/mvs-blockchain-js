let blockchain = require('..')({
    url: "https://explorer.mvs.org/api/"
});
let Metaverse = require('metaversejs');

var quantity = 1000;
var duration = 25200;

var recipient_address = "MDyq6w7RqXPF9F5SSrKpTrharr8wF1D4gX";
var change_address = "MDc9rsRr5Ukgro4mu89G2Spdts5aACRJdb";

Metaverse.wallet.fromMnemonic("lunar there win define minor shadow damage lounge bitter abstract sail alcohol yellow left lift vapor tourist rent gloom sustain gym dry congress zero")
    .then((wallet) =>
        blockchain.addresses.utxo(wallet.getAddresses()) //Get all utxo
        .then((utxos) => Metaverse.transaction_builder.findUtxo(utxos, {
            'ETP': quantity
        }, Metaverse.transaction.DEFAULT_FEE)) //Collect utxo for given target
        .then((result) => Metaverse.transaction_builder.deposit(result.utxo, recipient_address, quantity, duration, change_address, result.change))
        .then((tx) => wallet.sign(tx))
        .then((tx) => tx.encode())
        .then((tx) => blockchain.transaction.broadcast(tx.toString('hex')))
        .then(console.log);
    )
    .catch(console.error);
