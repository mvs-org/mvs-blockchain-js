let blockchain = require('..')({
    url: "https://explorer-testnet.mvs.org/api/"
});
let Metaverse = require('metaversejs');

blockchain.height()
    .then((height) => blockchain.addresses.txs(['t85Hm2nYwQXrry2cVmEHPq8krRdJ7KYjmq']) //Get transactions
        .then((txs) => blockchain.balance.addresses(txs.transactions, ['t85Hm2nYwQXrry2cVmEHPq8krRdJ7KYjmq'], height)) //
          .then(balances => console.log(JSON.stringify(balances)))
    )
    .catch(console.error);
