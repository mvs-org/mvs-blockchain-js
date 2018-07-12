let blockchain = require('..')({
    url: "https://explorer-testnet.mvs.org/api/"
});
let Metaverse = require('metaversejs');

var target = {
    ETP: 1000
};

var recipient_address = "tPd41bKLJGf1C5RRvaiV2mytqZB6WfM1vR";

Metaverse.wallet.fromMnemonic("lunar there win define minor shadow damage lounge bitter abstract sail alcohol yellow left lift vapor tourist rent gloom sustain gym dry congress zero",'testnet')
    .then((wallet) =>
	    blockchain.height()
	    .then(height=>blockchain.addresses.txs(wallet.getAddresses())
        .then(txs => Metaverse.output.calculateUtxo(txs.transactions, wallet.getAddresses())) //Get all utxo
        .then((utxos) => Metaverse.output.findUtxo(utxos, target, height)) //Collect utxo for given target
            .then((result) => Metaverse.transaction_builder.send(result.utxo, recipient_address, undefined, target, result.utxo[0].address, result.change))
        .then((tx) => wallet.sign(tx))
        .then((tx) => tx.encode())
        .then((tx) => blockchain.transaction.broadcast(tx.toString('hex')))
        .then(console.log)))
    .catch(console.error);
