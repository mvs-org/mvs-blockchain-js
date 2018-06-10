let blockchain = require('..')({
    url: "https://explorer-testnet.mvs.org/api/"
});
let Metaverse = require('metaversejs');


Metaverse.wallet.fromMnemonic("butter vacuum breeze glow virtual mutual veteran argue want pipe elite blast judge write sand toilet file joy exotic reflect truck topic receive wait", 'testnet')
    .then((wallet) =>
          blockchain.height()
          .then(height =>
                blockchain.addresses.txs(wallet.getAddresses())
                .then(txs => Metaverse.output.calculateUtxo(txs.transactions, wallet.getAddresses()))
                .then((utxo) => blockchain.balance.addresses(utxo, wallet.getAddresses(), height))
                .then(balances => console.log(JSON.stringify(balances)))
               )
         )
    .catch(console.error);
