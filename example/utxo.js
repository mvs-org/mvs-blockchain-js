let blockchain = require('..')({url: "https://explorer.mvs.org/api/"});
let Metaverse = require('metaversejs');

var target={'MVS.ZDC': 13, ETP: 1000};

blockchain.address.utxo('MU17FVAKGoB4HPxLfdfappymjCuTJVgTfD')
    .then((utxos)=>Metaverse.transaction_builder.findUtxo(utxos,target))
    .then(result=>console.log(JSON.stringify(result)))
    .catch(console.error);
