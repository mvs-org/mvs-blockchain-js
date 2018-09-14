let blockchain = require('..')({
    url: "https://explorer-testnet.mvs.org/api/"
});
blockchain.multisig.get("3QabhM8fsQMxTQerGKfiuteZNCfsSKxPRX")
.then(console.log)
