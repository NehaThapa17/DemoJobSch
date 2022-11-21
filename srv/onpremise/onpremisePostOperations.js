
const core = require('@sap-cloud-sdk/core');
const constants = require("../util/constants-util.js");
async function getToken(url) {
    try {
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: 'GET',
            url: url + "/$metadata",
            headers: {
                "content-type": "application/json",
                'x-csrf-token': 'fetch'
            }
        });
        let xcsrfToken = response.headers['x-csrf-token'];
        let cookies = response.headers['set-cookie'];
        let cookie = '';
        if (cookies.length > 0) {
            cookies.map(item => {
                cookie = cookie.concat(item + "; ");
            });
        }
        return { xcsrfToken, cookie }
    }
    catch (error) {
        return req.error({
            message: error
        })
    }
}

let createProductDetail = async (req) => {
    try {
        let sUrl = constants.CREATEPRODUCTURL;
        let { xcsrfToken, cookie } = await getToken(sUrl);
        let payload = JSON.parse(req.data.createData);
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: 'POST',
            url: sUrl + "/ProductDetailSet",
            headers: {
                "content-type": "application/json",
                'x-csrf-token': xcsrfToken,
                'Cookie': cookie,
            },
            data: payload
        });
        let result = [{
            "status": response.status,
            "statusText": response.statusText,
            "data": response.data.d
        }];
        return result;
    }
    catch (error) {
        return error;
    }
}
module.exports.createProductDetail = createProductDetail;

let createCCEmailDetail = async (req) => {
    try {
        let sUrl = constants.CREATEPRODUCTURL;
        let { xcsrfToken, cookie } = await getToken(sUrl);
        let payload = JSON.parse(req.data.createData);
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: 'POST',
            url: sUrl + "/KeyValueSet",
            headers: {
                "content-type": "application/json",
                'x-csrf-token': xcsrfToken,
                'Cookie': cookie,
            },
            data: payload
        });
        let result = [{
            "status": response.status,
            "statusText": response.statusText,
            "data": response.data.d
        }];
        return result;
    }
    catch (error) {
        return error;
    }
}
module.exports.createCCEmailDetail = createCCEmailDetail;

let createTerminalDetail = async (req) => {
    try {
        let sUrl = constants.CREATETERMINALURL;
        let { xcsrfToken, cookie } = await getToken(sUrl);
        let payload = JSON.parse(req.data.createData);
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: 'POST',
            url: sUrl + "/TerminalDetailSet",
            headers: {
                "content-type": "application/json",
                'x-csrf-token': xcsrfToken,
                'Cookie': cookie,
            },
            data: payload
        });
        let result = [{
            "status": response.status,
            "statusText": response.statusText,
            "data": response.data.d
        }];
        return result;
    }
    catch (error) {
        return error;
    }
}
module.exports.createTerminalDetail = createTerminalDetail;

let createCustomerDetail = async (req) => {
    try {
        let sUrl = constants.CREATEPRODUCTURL;
        let { xcsrfToken, cookie } = await getToken(sUrl);
        let payload = JSON.parse(req.data.createData);
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: 'POST',
            url: sUrl + "/CustomerShipToDetailSet",
            headers: {
                "content-type": "application/json",
                'x-csrf-token': xcsrfToken,
                'Cookie': cookie,
            },
            data: payload
        });
        let result = [{
            "status": response.status,
            "statusText": response.statusText,
            "data": response.data.d
        }];
        return result;
    }
    catch (error) {
        return error;
    }
}
module.exports.createCustomerDetail = createCustomerDetail;
/// Update Operations
let updateTerminalDetail = async (req,m) => {
    try {
        let sUrl = constants.CREATEPRODUCTURL;
        let { xcsrfToken, cookie } = await getToken(sUrl);
        let payload = JSON.parse(req.data.createData);
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: 'PUT',
            url: sUrl + "/TerminalDetailSet('"+m+"')",
            headers: {
                "content-type": "application/json",
                'x-csrf-token': xcsrfToken,
                'Cookie': cookie,
            },
            data: payload
        });
        let result = [{
            "status": response.status,
            "statusText": response.statusText,
            "data": response.data.d
        }];
        return result;
    }
    catch (error) {
        return error;
    }
}
module.exports.updateTerminalDetail = updateTerminalDetail;

let updateCustomerDetail = async (req) => {
    try {
        let sUrl = constants.CREATEPRODUCTURL;
        let { xcsrfToken, cookie } = await getToken(sUrl);
        let payload = JSON.parse(req.data.createData);
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: 'POST',
            url: sUrl + "/CustomerShipToDetailSet",
            headers: {
                "content-type": "application/json",
                'x-csrf-token': xcsrfToken,
                'Cookie': cookie,
            },
            data: payload
        });
        let result = [{
            "status": response.status,
            "statusText": response.statusText,
            "data": response.data.d
        }];
        return result;
    }
    catch (error) {
        return error;
    }
}
module.exports.updateCustomerDetail = updateCustomerDetail;

let updateProductDetail = async (req,m) => {
    try {
        let sUrl = constants.CREATEPRODUCTURL;
        let { xcsrfToken, cookie } = await getToken(sUrl);
        let payload = JSON.parse(req.data.createData);
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: 'PUT',
            url: sUrl + "/ProductDetailSet('"+m+"')",
            headers: {
                "content-type": "application/json",
                'x-csrf-token': xcsrfToken,
                'Cookie': cookie,
            },
            data: payload
        });
        let result = [{
            "status": response.status,
            "statusText": response.statusText,
            "data": response.data.d
        }];
        return result;
    }
    catch (error) {
        return error;
    }
}
module.exports.updateProductDetail = updateProductDetail;

//Delete Operations
let deleteCustomerDetail = async (req,m,n) => {
    try {
        let sUrl = constants.CREATEPRODUCTURL;
        let { xcsrfToken, cookie } = await getToken(sUrl);
        // let payload = JSON.parse(req.data.createData);
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: 'DELETE',
            url: sUrl + "/CustomerShipToDetailSet(Customer='"+m+"',ShipTo='"+n+"')",
            headers: {
                "content-type": "application/json",
                'x-csrf-token': xcsrfToken,
                'Cookie': cookie,
            }
            // data: payload
        });
        let result = [{
            "status": response.status,
            "statusText": response.statusText
            // "data": response.data.d
        }];
        return result;
    }
    catch (error) {
        return error;
    }
}
module.exports.deleteCustomerDetail = deleteCustomerDetail;


let deleteTerminalDetail = async (req,m) => {
    try {
        let sUrl = constants.CREATEPRODUCTURL;
        let { xcsrfToken, cookie } = await getToken(sUrl);
        // let payload = JSON.parse(req.data.createData);
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: 'DELETE',
            url: sUrl + "/TerminalDetailSet('"+m+"')",
            headers: {
                "content-type": "application/json",
                'x-csrf-token': xcsrfToken,
                'Cookie': cookie,
            }
            // data: payload
        });
        let result = [{
            "status": response.status,
            "statusText": response.statusText
            // "data": response.data.d
        }];
        return result;
    }
    catch (error) {
        return error;
    }
}
module.exports.deleteTerminalDetail = deleteTerminalDetail;

let deleteProductDetail = async (req,m) => {
    try {
        let sUrl = constants.CREATEPRODUCTURL;
        let { xcsrfToken, cookie } = await getToken(sUrl);
        // let payload = JSON.parse(req.data.createData);
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: 'DELETE',
            url: sUrl + "/ProductDetailSet('"+m+"')",
            headers: {
                "content-type": "application/json",
                'x-csrf-token': xcsrfToken,
                'Cookie': cookie,
            }
            // data: payload
        });
        let result = [{
            "status": response.status,
            "statusText": response.statusText
            // "data": response.data.d
        }];
        return result;
    }
    catch (error) {
        return error;
    }
}
module.exports.deleteProductDetail = deleteProductDetail;