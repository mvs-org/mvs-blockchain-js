const Request = require("superagent"),
 helper = require("../helper.js");

let REMOTE = null;

module.exports = (url) => {
    if (url)
        REMOTE = url;
    else
        REMOTE = 'https://explorer.mvs.org/api/';
    return {
        height: getHeight,
        transaction: {
            get: getTx,
            list: listTxs,
            broadcast: broadcastTx
        },
        block: {
            get: getBlock,
            list: listBlocks
        },
        address: {
            txs: listAddressTxs
        },
        addresses: {
            txs: listAllAddressesTxs
        },
        avatar: {
            extract: helper.avatar.extract
        },
        asset: {
            get: getAsset,
            list: listAssets
        },
        balance:{
            all: helper.balances.all,
            addresses:  helper.balances.addresses
        }
    };
};

function getHeight() {
    return get(`${REMOTE}height`);
}

function getTx(hash) {
    return get(`${REMOTE}tx/${hash}`);
}

function listTxs(page = 0, items_per_page = 10) {
    return get(`${REMOTE}txs?page=${page}`);
}

function broadcastTx(tx){
    return post(`${REMOTE}tx`,{tx:tx});
}

function getBlock(hash) {
    return get(`${REMOTE}block/${hash}`);
}

function listBlocks(page) {
    return get(`${REMOTE}blocks/${page}`);
}

function getAsset(symbol) {
    return get(`${REMOTE}asset/${symbol}`)
        .then((result) => result[0]);
}

function listAssets() {
    return get(`${REMOTE}assets`);
}

function listAddressTxs(address, options) {
    return listAllAddressesTxs([address],options);
}

function listAllAddressesTxs(addresses, options = {}) {
    let url = `${REMOTE}addresses/txs?addresses=`+addresses.join('&addresses=');
    if(options.max_height)
        url+='&max_height='+options.max_height;
    if(options.min_height)
        url+='&min_height='+options.min_height;
    if(options.max_time)
        url+='&max_time='+options.max_time;
    if(options.min_time)
        url+='&min_time='+options.min_time;
    return get(url);
}

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

function post(url, data) {
    return new Promise((resolve, reject) => {
        return Request.post(url)
            .send(data)
            .set('accept', 'json')
            .end((err, response) => {
                try {
                    response = JSON.parse(response.text);
                    if (err) {
                        reject(Error(err.message));
                    } else if (response.result.error != undefined)
                        reject(Error(response.result.error));
                    else {
                        resolve(response.result);
                    }
                } catch (e) {}
            });
    });
}
