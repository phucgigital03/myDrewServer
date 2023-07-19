const md5 = require('md5');

const genSign = (params)=>{
    const sortKey = [];
    let placeHolder = '';
    params.v = 'v1';
    params.keySecret = 'xxxyyy';
    for (const key in params) {
        if(key !== 'sign'){
            sortKey.push(key);
        }
    }
    sortKey.sort();
    sortKey.forEach(key => {
        placeHolder += `${key}${params[key]}`
    })
    return md5(placeHolder);
}

module.exports = genSign