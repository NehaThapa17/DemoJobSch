
const log = require('cf-nodejs-logging-support');
const constants = require("../util/constants-util.js");
const {getClientFromDestination} = require("../sap_client.js");
const xsuaaService = constants.xsuaaService;
const destService = constants.destService;
const destination = constants.dest;
const SapCfAxios = require('sap-cf-axios').default;
const sapcfaxios= SapCfAxios(destination);
const core = require('@sap-cloud-sdk/core');
/**
* Function to get token details 
* Function invoked in Create,delete n Update function calls
* @param {String} url
*/
async function getToken(req, authorization, sap_client,url) {
    try {
        let tokenResult = await sapcfaxios({
            method: constants.httpGet,
            url: url,
            headers: {
                "content-type": "application/json",
                'x-csrf-token': 'fetch',
                'sap-client': sap_client,
                'Authorization': authorization
            }
        });
        var xcsrfToken = tokenResult.headers['x-csrf-token'];
        var cookie = tokenResult.headers['set-cookie'];
        var cookie1 = '';
        if (cookie.length > 0) {
            cookie.map(item => {
                cookie1 = cookie1.concat(item + "; ");
            });
        }
        return { xcsrfToken, cookie1 }
    } catch (e) {
        log.error("Error in getToken" +e);
        return e;
    }
}
/**
* Function call to create Table Details
* Function invoked in all create/POST function calls
* @param {Object} req
* @param {String} sUrl
*/
let createonPremCall = async (req,sUrl) => {
    
    try {
        const authorization = req.headers.authorization;
        let url = constants.PPSERVICEURL;
        // let sUrl = constants.DEFAULTURL;
        const sap_client = await getClientFromDestination(xsuaaService, destService, destination);
        let payload = JSON.parse(req.data.createData);
        let { xcsrfToken, cookie1 } = await getToken(req, authorization, sap_client,url);//get xcsrf token
        let result = await sapcfaxios({
            method: constants.httpPost,
            url: constants.DEFAULTURL + sUrl,
            headers: {
                "content-type": "application/json",
                'x-csrf-token': xcsrfToken,
                'sap-client': sap_client,
                'Authorization': authorization,
                'Cookie': cookie1
            },
            data: payload
        });       
        return result.data.d;
    }
    catch (error) {
        log.error("createonPremCall error" +error);
        if (error.response.data.error.innererror.errordetails !== undefined){
            error.message = error.response.data.error.innererror.errordetails[0].message;
        }
        else {
            error.message = error.response.data.error.message.value;
        }
        return error;
        // req.error({ message: error.response.data.error.innererror.errordetails[0].message });
       
    }
}
/**
* Function call to update Details
* Function invoked in update function calls
* @param {Object} req
* @param {String} sUrl
*/
let updateonPremCall = async (req,sUrl) => {  
    try {
        const authorization = req.headers.authorization;
        let url = constants.PPSERVICEURL;
        const sap_client = await getClientFromDestination(xsuaaService, destService, destination);
        let payload = JSON.parse(req.data.createData);
        let { xcsrfToken, cookie1 } = await getToken(req, authorization, sap_client,url);//get xcsrf token
        let result = await sapcfaxios({
            method: constants.httpPut,
            url: constants.DEFAULTURL + sUrl,
            headers: {
                "content-type": "application/json",
                'x-csrf-token': xcsrfToken,
                'sap-client': sap_client,
                'Authorization': authorization,
                'Cookie': cookie1
            },
            data: payload
        });       
        return constants.SUCCESS_EDIT;
    }
    catch (error) {
        log.error("updateonPremCall error" +error);
        if (error.response.data.error.innererror.errordetails !== undefined && error.response.data.error.innererror.errordetails.length !== 0){
            error.message = error.response.data.error.innererror.errordetails[0].message;
        }
        else {
            error.message = error.response.data.error.message.value;
        }
        return error;
        // req.error({ message: error.response.data.error.innererror.errordetails[0].message });
    }
}

/**
* Function call to delete  Details
* Function invoked in delete function calls
* @param {Object} req
* @param {String} sUrl
*/
let deleteonPremCall = async (req,sUrl) => {  
    try {
        const authorization = req.headers.authorization;
        let url = constants.PPSERVICEURL;
        const sap_client = await getClientFromDestination(xsuaaService, destService, destination);
        // let payload = JSON.parse(req.data.createData);
        let { xcsrfToken, cookie1 } = await getToken(req, authorization, sap_client,url);//get xcsrf token
        let result = await sapcfaxios({
            method: constants.httpDelete,
            url: constants.DEFAULTURL + sUrl,
            headers: {
                "content-type": "application/json",
                'x-csrf-token': xcsrfToken,
                'sap-client': sap_client,
                'Authorization': authorization,
                'Cookie': cookie1
            }
        });       
        return constants.SUCCESS_DEL;
    }
    catch (error) {
        log.error("deleteonPremCall error" +error);
        error.message = error.response.data.error.message.value;
        // req.error({ message: error.response.data.error.message.value });
        return error;
    }
}

/**
 * 
 */
async function getTokenJS(sUrl) {
    try {
        
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAMEBASIC }, {
            method: 'GET',
            url: sUrl,
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
        log.info("ERROR getTokenJS()" + error);
        return req.error({
            message: error
        })
    }
}
let clearOnDemandFlag = async (oUrl) => {
    try {
        let sUrl = constants.PPSERVICEURL;
        let { xcsrfToken, cookie } = await getTokenJS(sUrl);
        let payload = {"ClearFlag" : true, "Customer" : [ ]}; 
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAMEBASIC }, {
            method: 'POST',
            url: oUrl,
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
        log.info("SUCCESS clearOnDemandFlag()" + JSON.stringify(result));
        return result;
    }
    catch (error) {
        log.info("ERROR clearOnDemandFlag()" +error); 
        return error;
    }
}
module.exports = {updateonPremCall,createonPremCall,deleteonPremCall,clearOnDemandFlag};