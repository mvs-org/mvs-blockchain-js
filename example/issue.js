let blockchain = require('..')({
    url: "https://explorer.mvs.org/api/"
});
let Metaverse = require('metaversejs');

const symbol = 'TEST.TEST',
    max_supply = 10,
    precision = 2,
    issuer = 'tester',
    description = 'some boring asset';

var recipient_address = "MDyq6w7RqXPF9F5SSrKpTrharr8wF1D4gX";
var change_address = "MDc9rsRr5Ukgro4mu89G2Spdts5aACRJdb";

Metaverse.wallet.fromMnemonic("lunar there win define minor shadow damage lounge bitter abstract sail alcohol yellow left lift vapor tourist rent gloom sustain gym dry congress zero")
    .then((wallet) =>
        blockchain.addresses.txs(wallet.getAddresses())
        .then(txs => Metaverse.transaction_builder.calculateUtxo(txs.transactions, wallet.getAddresses())) //Get all utxo
        .then((utxos) => Metaverse.transaction_builder.findUtxo(utxos, {}, Metaverse.transaction.ASSET_ISSUE_DEFAULT_FEE)) //Collect utxo for given target
        .then((result) => Metaverse.transaction_builder.issue(result.utxo, recipient_address, symbol, max_supply, precision, issuer, description, change_address, result.change))
        .then((tx) => wallet.sign(tx))
        .then((tx) => tx.encode())
        .then(tx => console.log(tx.toString('hex')));
    )
    .catch(console.error);
