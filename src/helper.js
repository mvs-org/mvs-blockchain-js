const Metaverse = require('metaversejs');

module.exports = {
    balances: {
        all: calculateBalancesFromUtxo,
        addresses: calculateAddressesBalancesFromUtxo
    },
    avatar: {
        extract: extractAvatars
    }
};

function extractAvatars(outputs) {
    return new Promise(resolve => {
        let avatars = [];
        outputs.forEach((output) => {
            switch (output.attachment.type) {
                case Metaverse.constants.ATTACHMENT.TYPE.AVATAR:
                case 'did-register':
                case 'did-transfer':
                    avatars.push({
                        symbol: output.attachment.symbol,
                        address: output.attachment.address
                    });
            }
        });
        resolve(avatars);
    });
}

function calculateBalancesFromUtxo(utxo, addresses, height, init) {
    if (init == undefined) init = {
        ETP: {
            available: 0,
            frozen: 0,
            decimals: 8
        },
        MST: {},
        MIT: []
    };
    return utxo.reduce((acc, output) => {
        if (addresses.indexOf(output.address) !== -1) {
            switch (output.attachment.type) {
                case Metaverse.constants.ATTACHMENT.TYPE.MST:
                case 'asset-transfer':
                case 'asset-issue':
                    if (acc.MST[output.attachment.symbol] == undefined)
                        acc.MST[output.attachment.symbol] = {
                            available: 0,
                            frozen: 0,
                            decimals: output.attachment.decimals
                        };
                    let available = Metaverse.output.assetSpendable(output, output.height, height);
                    acc.MST[output.attachment.symbol].available += available;
                    acc.MST[output.attachment.symbol].frozen += output.attachment.quantity - available;
                    break;
                case Metaverse.constants.ATTACHMENT.TYPE.MIT:
                case 'mit':
                    acc.MIT.push({
                        symbol: output.attachment.symbol,
                        address: output.attachment.address,
                        content: output.attachment.content,
                        owner: output.attachment.to_did,
                        status: output.attachment.status
                    });
                    break;
            }
            if (output.value) {
                if (output.locked_until > height)
                    acc['ETP'].frozen += output.value;
                else
                    acc['ETP'].available += output.value;
            }
        }
        return acc;
    }, init);
}

function calculateAddressesBalancesFromUtxo(utxo, addresses, height, init) {
    if (init == undefined) init = {};
    return utxo.reduce((acc, output) => {
        if (acc[output.address] == undefined)
            acc[output.address] = {
                ETP: {
                    available: 0,
                    frozen: 0,
                    decimals: 8
                },
                MST: {},
                MIT: [],
                AVATAR: ""
            };
        if (addresses.indexOf(output.address) !== -1) {
            switch (output.attachment.type) {
                case Metaverse.constants.ATTACHMENT.TYPE.MST:
                case 'asset-transfer':
                case 'asset-issue':
                    if (acc[output.address]['MST'][output.attachment.symbol] == undefined)
                        acc[output.address]['MST'][output.attachment.symbol] = {
                            available: 0,
                            frozen: 0,
                            decimals: output.attachment.decimals
                        };
                    let available = Metaverse.output.assetSpendable(output, output.height, height);
                    acc[output.address]['MST'][output.attachment.symbol].available += available;
                    acc[output.address]['MST'][output.attachment.symbol].frozen += output.attachment.quantity - available;
                    break;
                case Metaverse.constants.ATTACHMENT.TYPE.MIT:
                case 'mit':
                    acc[output.address].MIT.push({
                        symbol: output.attachment.symbol,
                        address: output.attachment.address,
                        content: output.attachment.content,
                        owner: output.attachment.to_did,
                        status: output.attachment.status
                    });
                    break;
                case Metaverse.constants.ATTACHMENT.TYPE.AVATAR:
                case 'did-register':
                    acc[output.address].AVATAR = output.attachment.symbol;
                    break;
            }
            if (output.value) {
                if (output.locked_until > height)
                    acc[output.address]['ETP'].frozen += output.value;
                else
                    acc[output.address]['ETP'].available += output.value;
            }
        }
        return acc;
    }, init);
}
