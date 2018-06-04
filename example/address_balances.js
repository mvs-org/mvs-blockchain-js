let blockchain = require('..')({
    url: "https://explorer.mvs.org/api/"
});
let Metaverse = require('metaversejs');

Metaverse.wallet.fromMnemonic("lunar there win define minor shadow damage lounge bitter abstract sail alcohol yellow left lift vapor tourist rent gloom sustain gym dry congress zero")
    .then((wallet) =>
        blockchain.height()
        .then((height) => {
            blockchain.addresses.txs(wallet.getAddresses()) //Get transactions
                .then((txs) => blockchain.balance.addresses(txs.transactions, wallet.getAddresses(), height)) //
                .then(balances=>console.log(JSON.stringify(balances)));
        })
    )
    .catch(console.error);
