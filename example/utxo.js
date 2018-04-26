let blockchain = require('.')({url: "https://explorer.mvs.org/api/"});

var target={'MVS.ZGC': 13, etp: 1000};

blockchain.address.utxo('MU17FVAKGoB4HPxLfdfappymjCuTJVgTfD')
    .then(()=>[
        {value: 100000, "attachment": {type:'asset-transfer', symbol: "MVS.ZDC", quantity: 2000 },},
        {value: 100000, "attachment": {type:'asset-transfer', symbol: "MVS.ZGC", quantity: 20 },}
    ])
    .then((utxos)=>{
        var rest = JSON.parse(JSON.stringify(target));
        var list=[];
        utxos.forEach((output)=>{
            if(!complete(rest)&&rest.etp>0&&output.value>0){
                rest.etp-=output.value;
                if(output.attachment.type=='asset-transfer'||output.attachment.type=='asset-issue'){
                    if(rest[output.attachment.symbol]==undefined)
                        rest[output.attachment.symbol]=0;
                    rest[output.attachment.symbol]-=output.attachment.quantity;
                }
                list.push(output);
            } else if(!complete(rest)){
                if((output.attachment.type=='asset-transfer'||output.attachment.type=='asset-issue')&&rest[output.attachment.symbol]>0){
                    if(rest[output.attachment.symbol]==undefined)
                        rest[output.attachment.symbol]=0;
                    rest[output.attachment.symbol]-=output.attachment.quantity;
                }
                list.push(output);
            }
        });
        if(!complete(rest)) throw Error('ERR_INSUFFICIENT_UTXO');
        
        return { utxo: list, rest: rest, target: target};
    })
    .then(console.log)
    .catch(console.error);

function complete(target){
    let complete=true;
    Object.values(target).forEach((value)=>{
        if(value>0)
            complete=false;
    });
    return complete;
}
