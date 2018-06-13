let blockchain = require('..')({
    url: "https://explorer-testnet.mvs.org/api/"
});
let Metaverse = require('metaversejs');

var quantity = 100;
var duration = 20;

var recipient_address = "MDyq6w7RqXPF9F5SSrKpTrharr8wF1D4gX";
var change_address = "MDc9rsRr5Ukgro4mu89G2Spdts5aACRJdb";

Metaverse.wallet.fromMnemonic("lunar there win define minor shadow damage lounge bitter abstract sail alcohol yellow left lift vapor tourist rent gloom sustain gym dry congress zero",'testnet')
    .then((wallet) =>
        blockchain.addresses.txs(wallet.getAddresses())
        .then(txs => Metaverse.output.calculateUtxo(txs.transactions, wallet.getAddresses())) //Get all utxo
	    .then(console.log)
        .then((utxos) => Metaverse.output.findUtxo(utxos, {
            'ETP': quantity
        }, Metaverse.constants.FEE.DEFAULT)) //Collect utxo for given target
        .then((result) => Metaverse.transaction_builder.deposit(result.utxo, recipient_address, quantity, duration, change_address, result.change, undefined, 'testnet'))
        .then((tx) => wallet.sign(tx))
        .then((tx) => tx.encode())
        .then((tx) => blockchain.transaction.broadcast(tx.toString('hex')))
        .then(console.log)
    )
    .catch(console.error);
