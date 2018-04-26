const Request = require("superagent");

function get(url, parameters) {
    return new Promise((resolve, reject) => {
        return Request.get(url)
            .send()
            .set('accept', 'json')
            .end((err, response) => {
                try {
                    response = JSON.parse(response.text);
                } catch (e) {}
                if (err) {
                    reject(Error(err.message));
                } else if (response.error != undefined)
                    reject({
                        name: response.error.code,
                        message: response.error.message
                    });
                else {
                    resolve(response.result);
                }
            });
    });
}

let REMOTE = null;

module.exports = (url) => {
    if (url)
        REMOTE = url;
    else
        REMOTE = 'https://explorer.mvs.org/api/';
    return {
        transaction: {
            get: getTx,
            list: listTxs
        },
        block: {
            get: getBlock,
            list: listBlocks
        },
        address:{
            txs: listAddressTxs,
            utxo: listAddressUtxo
        },
        asset:{
            get: getAsset,
            list: listAssets
        }
    };
};

function getTx(hash) {
    return get(`${REMOTE}tx/${hash}`);
}

function listTxs(page=0, items_per_page=10) {
    return get(`${REMOTE}txs?page=${page}`);
}

function getBlock(hash) {
    return get(`${REMOTE}block/${hash}`);
}

function listBlocks(page) {
    return get(`${REMOTE}blocks/${page}`);
}

function getAsset(symbol) {
    return get(`${REMOTE}asset/${symbol}`)
        .then((result)=>result[0]);
}

function listAssets() {
    return get(`${REMOTE}assets`);
}

function listAddressTxs(address, page=0, items_per_page=10) {
    return get(`${REMOTE}address/txs/${address}?page=${page}&items_per_page=${items_per_page}`);
}

function listAddressUtxo(address) {
    return get(`${REMOTE}address/txs/${address}?items_per_page=0`)
        .then((result) => {
            let candidates={};
            for(let i=result.transactions.length-1; i>=0; i--){
                //Search received outputs
                result.transactions[i].outputs.forEach((output)=>{
                    if(output.address==address){
                        output.locked_until=(output.locked_height_range)?result.transactions[i].height+output.locked_height_range:0;
                        delete output['locked_height_range'];
                        output.hash=result.transactions[i].hash;
                        candidates[result.transactions[i].hash+'-'+output.index]=output;
                    }
                });
                //Remove spent outputs if matching input is found
                result.transactions[i].inputs.forEach((input)=>{
                    if(input.address==address){
                        if(candidates[input.previous_output.hash+'-'+input.previous_output.index]){
                            delete candidates[input.previous_output.hash+'-'+input.previous_output.index];
                        }
                        else throw Error('Found input without matching output');
                    }
                });
            }
            return Object.values(candidates);
        });
}
