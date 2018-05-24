'use strict';
/*
  ███╗   ███╗███████╗████████╗ █████╗ ██╗   ██╗███████╗██████╗ ███████╗███████╗
  ████╗ ████║██╔════╝╚══██╔══╝██╔══██╗██║   ██║██╔════╝██╔══██╗██╔════╝██╔════╝
  ██╔████╔██║█████╗     ██║   ███████║██║   ██║█████╗  ██████╔╝███████╗█████╗
  ██║╚██╔╝██║██╔══╝     ██║   ██╔══██║╚██╗ ██╔╝██╔══╝  ██╔══██╗╚════██║██╔══╝
  ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║ ╚████╔╝ ███████╗██║  ██║███████║███████╗
  ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝
*/

module.exports = (options={}) => {
    if (options.source && options.source != 'remote') throw Error(`Unknown source ${options.source}`);
    if (options.network == 'testnet' && options.url == undefined){
        options.url='https://explorer-testnet.mvs.org';
    }
    return require('./src/adapter/remote.js')(options.url);
};
