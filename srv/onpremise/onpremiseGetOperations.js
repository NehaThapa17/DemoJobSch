const core = require('@sap-cloud-sdk/core');
const constants = require("../util/constants-util.js");
const {getClientFromDestination} = require("../sap_client.js");
const xsuaaService = "pricingNotification-xsuaa-service";
const destService = "pricingNotification-destination-service";
const destination = "s4rt";

 
async function getOnPremProductDetails(req,sUrl) {
    try {
        const authorization = req.headers.authorization;
        let sap_client = await getClientFromDestination(xsuaaService, destService, destination);
        let respSchedule = await sapcfaxios({
            method: 'GET',
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
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: constants.httpGet,
            url: sUrl,
            headers: {
                "content-type": "application/json",
                'x-csrf-token': 'fetch'
            }
        });
        return response;
    }
    catch (error) {
        return error;
    }
}
/**
* Function to call the url 
* Function invoked in getTerminalDetails function call
* @param {String} sUrl
*/
async function getOnPremTerminalDetails(sUrl){
    try{
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: constants.httpGet,
            url: sUrl,
            headers: {
                "content-type": "application/json",
                'x-csrf-token': 'fetch'
            }
        });
        return response;
    }
    catch (error) {
        log.info(constants.LOG_ONPREM_SELECT_ERR);
        return error;
    }
}

/**
* Function to call the url 
* Function invoked in getCustomerDetails function call
* @param {String} sUrl
*/
async function getOnPremCustomerDetails(sUrl){
    try{

        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: constants.httpGet,
            url: sUrl,
            headers: {
                "content-type": "application/json",
                'x-csrf-token': 'fetch'
            }
        });
        return response;
    }
    catch (error) {
        // log.info(errConstants.LOG_ONPREM_SELECT_ERR);
        // log.info(error.message);
        return error;
    }
}
/**
* Function to call the url 
* Function invoked in getOnPremProductDetails function call
* @param {String} sUrl
*/
/*
async function getOnPremProductDetails(sUrl){
    try{
        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: constants.httpGet,
            url: sUrl,
            headers: {
                "content-type": "application/json",
                'x-csrf-token': 'fetch'
            }
        });
        return response;
    }
    catch (error) {
        // log.info(errConstants.LOG_ONPREM_SELECT_ERR);
        // log.info(error.message);
        return error;
    }
}
*/
/**
* Function to call the url 
* Function invoked in getOnPremCustomerF4 function call
* @param {String} sUrl
*/
async function getOnPremCustomerValueHelp(sUrl){
    try{

        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: constants.httpGet,
            url: sUrl,
            headers: {
                "content-type": "application/json",
                'x-csrf-token': 'fetch'
            }
        });
        return response;
    }
    catch (error) {
        // log.info(errConstants.LOG_ONPREM_SELECT_ERR);
        // log.info(error.message);
        return error;
    }
}
/**
* Function to call the url 
* Function invoked in getOnPremTerminalF4 function call
* @param {String} sUrl
*/
async function getOnPremTerminalValueHelp(sUrl){
    try{

        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: constants.httpGet,
            url: sUrl,
            headers: {
                "content-type": "application/json",
                'x-csrf-token': 'fetch'
            }
        });
        return response;
    }
    catch (error) {
        // log.info(errConstants.LOG_ONPREM_SELECT_ERR);
        // log.info(error.message);
        return error;
    }
}
/**
* Function to call the url 
* Function invoked in getOnPremProductF4 function call
* @param {String} sUrl
*/
async function getOnPremProductValueHelp(sUrl){
    try{

        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: constants.httpGet,
            url: sUrl,
            headers: {
                "content-type": "application/json",
                'x-csrf-token': 'fetch'
            }
        });
        return response;
    }
    catch (error) {
        log.info(errConstants.LOG_ONPREM_SELECT_ERR);
        return error;
    }
}
/**
* Function to call the url to get CC emails 
* Function invoked in getOnCCEmail function call
* @param {String} sUrl
*/
async function getOnPremCCEmail(sUrl){
    try{

        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: constants.httpGet,
            url: sUrl,
            headers: {
                "content-type": "application/json",
                'x-csrf-token': 'fetch'
            }
        });
        return response;
    }
    catch (error) {
        return error;
    }
}
// module.exports.getOnPremCCEmail = getOnPremCCEmail;

module.exports = {getOnPremDetails,getOnPremTerminalDetails,getOnPremCustomerDetails,getOnPremProductDetails,getOnPremCustomerValueHelp,getOnPremTerminalValueHelp,getOnPremProductValueHelp,getOnPremCCEmail};