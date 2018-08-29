let blockchain = require('..')({
    url: "https://explorer-testnet.mvs.org/api/"
});
let Metaverse = require('metaversejs');

var avatar_name = "your avatar name here";

var avatar_address = "your address here";
var change_address = "your change address here";

Metaverse.wallet.fromMnemonic("your mnemonic here", 'testnet')
    .then((wallet) =>
        blockchain.height()
        .then(height => blockchain.addresses.txs([avatar_address])
            .then(txs => Metaverse.output.calculateUtxo(txs.transactions, [avatar_address])) //Get all utxo for the avatar address
            .then((utxos) => Metaverse.output.findUtxo(utxos, {}, height, 100000000)) //Collect utxo to pay for the fee of 1 ETP
            .then((result) => Metaverse.transaction_builder.issueDid(result.utxo, avatar_address, avatar_name, change_address, result.change, 80000000, 'testnet'))
            .then((tx) => wallet.sign(tx))
            .then((tx) => tx.encode())
            .then(tx => tx.toString('hex'))
            .then((tx) => blockchain.transaction.broadcast(tx))
            .then(console.log)))
    .catch(console.error);
