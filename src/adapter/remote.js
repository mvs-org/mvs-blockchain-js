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
            broadcast: broadcastTx,
        },
        block: {
            get: getBlock,
            list: listBlocks,
            blocktime: getBlocktime,
        },
        address: {
            txs: listAddressTxs,
        },
        addresses: {
            txs: listAllAddressesTxs,
            listTxs: listAddressesTxs,
        },
        pricing: {
            tickers: listTickers,
        },
        avatar: {
            extract: helper.avatar.extract,
            get: getAvatar,
            available: getAvatarAvailable,
            list: listAvatars,
        },
        MST: {
            get: getAsset,
            list: listAssets,
            icons: listIcons,
        },
        MIT: {
            get: getMIT,
            list: listMIT,
        },
        balance: {
            all: helper.balances.all,
            addresses: helper.balances.addresses,
        },
        suggest: {
            avatar: suggestAvatar,
            address: suggestAddress,
            tx: suggestTx,
            block: suggestBlock,
            mst: suggestMst,
            mit: suggestMit,
            all: suggestAll,
        },
        multisig: {
            add: addMultisigWallet,
            get: getMultisigWallet,
        },
        bridge: {
            whitelist: listBridgeMst,
        },
        utxo: {
            get: getUtxo,
        },
        cert: {
            get: getCert,
        },
        output: {
            get: getOutput,
        }
    };
};

function getHeight() {
    return get(`${REMOTE}height`);
}

function getBlocktime(downscale) {
    return getBlockStats(undefined, downscale)
        .then(stats => stats[0][1]);
}

function getBlockStats(type, downscale) {
    return get(`${REMOTE}stats/block?type=${type}&downscale=${downscale}`);
}

function getTx(hash) {
    return get(`${REMOTE}tx/${hash}`);
}

function listTickers() {
    return get(`${REMOTE}pricing/tickers`);
}

function listTxs(page = 0, items_per_page = 10) {
    return get(`${REMOTE}txs?page=${page}`);
}

function addMultisigWallet(wallet) {
    return post(`https://metastore.mvs.org/multisig`, wallet);
}

function getMultisigWallet(address) {
    return get(`https://metastore.mvs.org/multisig/${address}`);
}

function broadcastTx(tx) {
    return post(`${REMOTE}tx`, {
        tx: tx
    });
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

function listIcons() {
    return get(`${REMOTE}assets/icons`);
}

function getMIT(symbol) {
    return get(`${REMOTE}mits/${symbol}?show_invalidated=1`)
        .then((result) => result);
}

function listMIT() {
    return get(`${REMOTE}mits`);
}

function getAvatar(symbol, showInvalidated = 0) {
    return get(`${REMOTE}avatar/${symbol}`)
        .then((result) => result);
}

function getAvatarAvailable(symbol) {
    return get(`${REMOTE}v2/avatar/available/${symbol}`)
        .then((result) => result);
}

function listAvatars() {
    return get(`${REMOTE}avatars`);
}

function listAddressTxs(address, options) {
    return listAllAddressesTxs([address], options);
}

function suggestAvatar(prefix) {
    return get(`${REMOTE}suggest/avatar/${prefix}`);
}

function suggestAddress(prefix) {
    return get(`${REMOTE}suggest/address/${prefix}`);
}

function suggestTx(prefix) {
    return get(`${REMOTE}suggest/tx/${prefix}`);
}

function suggestBlock(prefix) {
    return get(`${REMOTE}suggest/blocks/${prefix}`);
}

function suggestMst(prefix) {
    return get(`${REMOTE}suggest/asset/${prefix}`);
}

function suggestMit(prefix) {
    return get(`${REMOTE}suggest/mit/${prefix}`);
}

function suggestAll(prefix) {
    return get(`${REMOTE}suggest/all/${prefix}`);
}

function listBridgeMst() {
    return get(`${REMOTE}bridge/whitelist`);
}

function listAllAddressesTxs(addresses, options = {}) {
    let url = `${REMOTE}addresses/txs?addresses=` + addresses.join('&addresses=');
    if (options.max_height)
        url += '&max_height=' + options.max_height;
    if (options.min_height)
        url += '&min_height=' + options.min_height;
    if (options.max_time)
        url += '&max_time=' + options.max_time;
    if (options.min_time)
        url += '&min_time=' + options.min_time;
    return get(url);
}

function listAddressesTxs(addresses, options = {}) {
    let url = `${REMOTE}v2/addresses/txs?addresses=` + addresses.join('&addresses=');
    if (options.min_height)
        url += '&min_height=' + options.min_height;
    return get(url);
}

function getUtxo(addresses, options = {}) {
    let url = `${REMOTE}v2/utxo?addresses=` + addresses.join('&addresses=')
    if (options.sort)
        url += '&sort=' + options.sort;
    if (options.maxHeight)
        url += '&maxHeight=' + options.maxHeight;
    if (options.target)
        url += '&target=' + options.target;
    if (options.limit)
        url += '&limit=' + options.limit;
    return get(url);
}

function getCert(symbol, type) {
    return get(`${REMOTE}v2/cert?symbol=${symbol}&type=${type}`);
}

function getOutput(hash, index) {
    return get(`${REMOTE}v2/output/${hash}/${index}`);
}

function get(url, parameters) {
    return new Promise((resolve, reject) => {
        return Request.get(url)
            .send()
            .set('accept', 'json')
            .end((err, response) => {
                try {
                    response = JSON.parse(response.text);
                } catch (e) { }
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
                } catch (e) { }
            });
    });
}
