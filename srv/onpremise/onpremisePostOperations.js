
const core = require('@sap-cloud-sdk/core');
const constants = require("../util/constants-util.js");
/**
* Function to get token details 
* Function invoked in Create,delete n Update function calls
* @param {String} url
*/
async function getToken(url) {
    try {
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: constants.httpGet,
            url: url + constants.URL_metadata,
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
/**
* Function call to update customer/shipto selected at On-Demand Prosessing 
* Function invoked in updateOnDemand function
* @param {Object} req
*/
let editOnDemand = async (req) => {
    try {
        let sUrl = constants.DEFAULTURL;
        let { xcsrfToken, cookie } = await getToken(sUrl);
        let payload = JSON.parse(req.data.createData);
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: constants.httpPost,
            url: sUrl + "/OnDemandDetailSet",
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
/**
* Function call to create Product Details
* Function invoked in createProduct function
* @param {Object} req
*/
let createProductDetail = async (req) => {
    try {
        let sUrl = constants.DEFAULTURL;
        let { xcsrfToken, cookie } = await getToken(sUrl);
        let payload = JSON.parse(req.data.createData);
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: constants.httpPost,
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
/**
* Function call to create/update CCEmails
* Function invoked in createCCEmail function
* @param {Object} req
*/
let createCCEmailDetail = async (req) => {
    try {
        let sUrl = constants.DEFAULTURL;
        let { xcsrfToken, cookie } = await getToken(sUrl);
        let payload = JSON.parse(req.data.createData);
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: constants.httpPost,
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
/**
* Function call to create Terminal Details
* Function invoked in createTerminal function
* @param {Object} req
*/
let createTerminalDetail = async (req) => {
    try {
        let sUrl = constants.DEFAULTURL;
        let { xcsrfToken, cookie } = await getToken(sUrl);
        let payload = JSON.parse(req.data.createData);
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: constants.httpPost,
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
/**
* Function call to create Customer Details
* Function invoked in createCustomer function
* @param {Object} req
*/
let createCustomerDetail = async (req) => {
    try {
        let sUrl = constants.DEFAULTURL;
        let { xcsrfToken, cookie } = await getToken(sUrl);
        let payload = JSON.parse(req.data.createData);
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: constants.httpPost,
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
/**
* Function call to update Terminal Details
* Function invoked in updateTerminal function
* @param {Object} req
* @param {String} m
*/
let updateTerminalDetail = async (req,m) => {
    try {
        let sUrl = constants.DEFAULTURL;
        let { xcsrfToken, cookie } = await getToken(sUrl);
        let payload = JSON.parse(req.data.createData);
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: constants.httpPut,
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
/**
* Function call to update Customer Details
* Function invoked in updateCustomer function
* @param {Object} req
*/
let updateCustomerDetail = async (req) => {
    try {
        let sUrl = constants.DEFAULTURL;
        let { xcsrfToken, cookie } = await getToken(sUrl);
        let payload = JSON.parse(req.data.createData);
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: constants.httpPost,
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
/**
* Function call to update Product Details
* Function invoked in updateProduct function
* @param {Object} req
* @param {String} m
*/
let updateProductDetail = async (req,m) => {
    try {
        let sUrl = constants.DEFAULTURL;
        let { xcsrfToken, cookie } = await getToken(sUrl);
        let payload = JSON.parse(req.data.createData);
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: constants.httpPut,
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
/**
* Function call to delete Customer Details
* Function invoked in deleteCustomer function
* @param {Object} req
* @param {String} m
* @param {String} n
*/
let deleteCustomerDetail = async (req,m,n) => {
    try {
        let sUrl = constants.DEFAULTURL;
        let { xcsrfToken, cookie } = await getToken(sUrl);
        // let payload = JSON.parse(req.data.createData);
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: constants.httpDelete,
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
/**
* Function call to delete Terminal Details
* Function invoked in deleteTerminal function
* @param {Object} req
* @param {String} m
*/
let deleteTerminalDetail = async (req,m) => {
    try {
        let sUrl = constants.DEFAULTURL;
        let { xcsrfToken, cookie } = await getToken(sUrl);
        // let payload = JSON.parse(req.data.createData);
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: constants.httpDelete,
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
/**
* Function call to delete Product Details
* Function invoked in deleteProduct function
* @param {Object} req
* @param {String} m
*/
let deleteProductDetail = async (req,m) => {
    try {
        let sUrl = constants.DEFAULTURL;
        let { xcsrfToken, cookie } = await getToken(sUrl);
        // let payload = JSON.parse(req.data.createData);
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: constants.httpDelete,
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
// module.exports.deleteProductDetail = deleteProductDetail;

module.exports = {editOnDemand,createProductDetail,createCCEmailDetail,createTerminalDetail,createCustomerDetail,updateTerminalDetail,updateCustomerDetail,updateProductDetail,deleteCustomerDetail,deleteTerminalDetail,deleteProductDetail};