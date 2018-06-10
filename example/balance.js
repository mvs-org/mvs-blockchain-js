let blockchain = require('..')({
    url: "https://explorer-testnet.mvs.org/api/"
});
let Metaverse = require('metaversejs');

let addresses = ['t85Hm2nYwQXrry2cVmEHPq8krRdJ7KYjmq', 'tGBMcLr6dwfaMaoYiJgtZ3cYUbbGsbpb8t', 'tDZ5YMLJ3z6VbvAsX1c8oe9hJ2nND4jszz', 'tGwPZUjqAmTfY8m4i36bgBuLFaEMtcVY72', 't82k8SzgW7rwW3SRPKj4KqbXoaixSRo74U'];

Metaverse.wallet.fromMnemonic("butter vacuum breeze glow virtual mutual veteran argue want pipe elite blast judge write sand toilet file joy exotic reflect truck topic receive wait", 'testnet')
    .then((wallet) =>
        blockchain.height()
        .then(height =>
            blockchain.addresses.txs(wallet.getAddresses())
            .then(txs => Metaverse.output.calculateUtxo(txs.transactions, wallet.getAddresses()))
            .then((utxo) => blockchain.balance.all(utxo, wallet.getAddresses(), height))
            .then(balances => console.log(JSON.stringify(balances)))
        )
    )
    .catch(console.error);
