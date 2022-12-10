const core = require('@sap-cloud-sdk/core');
const constants = require("../util/constants-util.js");
const {getClientFromDestination} = require("../sap_client.js");
const xsuaaService = constants.xsuaaService;
const destService = constants.destService;
const destination = constants.dest;
const SapCfAxios = require('sap-cf-axios').default;
const sapcfaxios= SapCfAxios(destination);
// const username = require('username');
// let os = require('os');

/**
* Function to call the url 
* Function invoked in all get function calls
* @param {String} sUrl
*/ 
async function getOnPremCall(req,sUrl) {
    try {
        const authorization = req.headers.authorization;
        log.info("getOnPremCall is called");
        let sap_client = await getClientFromDestination(xsuaaService, destService, destination);
        let respSchedule = await sapcfaxios({
            method: constants.httpGet,
            url: sUrl,
            headers: {
                "content-type": "application/json",
                'sap-client': sap_client,
                'Authorization': authorization
            }
        });
        return respSchedule;    
    }
    catch (error) {
        log.info("getOnPremCall error" +error);
        return error;
    }
}

/**
* Function to call the url 
* Function invoked in operationTriggerEndpoint function call
* @param {String} sUrl
*/
async function getOnPremDetails(sUrl){
    try{
        log.info("getOnPremDetails Call to get Email Odata");
        console.log("getOnPremDetails Call to get Email Odata");
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAMEBASIC }, {
            method: constants.httpGet,
            url: sUrl,
            headers: {
                "content-type": "application/json",
                'x-csrf-token': 'fetch'
            }
        });
        console.log("EMAIL Data" +response);
        return response;
    }
    catch (error) {
        log.info("getOnPremDetails error" +error);
        return error;
    }
}
module.exports = {getOnPremDetails,getOnPremCall};