const core = require('@sap-cloud-sdk/core');
const constants = require("../util/constants-util.js");


async function getOnPremTerminalDetails(sUrl){
    try{

        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: 'GET',
            url: sUrl,
            // get:sGetURL,
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
module.exports.getOnPremTerminalDetails = getOnPremTerminalDetails;

async function getOnPremCustomerDetails(sUrl){
    try{

        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: 'GET',
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
module.exports.getOnPremCustomerDetails = getOnPremCustomerDetails;

async function getOnPremProductDetails(sUrl){
    try{

        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: 'GET',
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
module.exports.getOnPremProductDetails = getOnPremProductDetails;



async function getOnPremCustomerValueHelp(sUrl){
    try{

        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: 'GET',
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
module.exports.getOnPremCustomerValueHelp = getOnPremCustomerValueHelp;

async function getOnPremTerminalValueHelp(sUrl){
    try{

        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: 'GET',
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
module.exports.getOnPremTerminalValueHelp = getOnPremTerminalValueHelp;

async function getOnPremProductValueHelp(sUrl){
    try{

        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: 'GET',
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
module.exports.getOnPremProductValueHelp = getOnPremProductValueHelp;

//Get CC Email
async function getOnPremCCEmail(sUrl){
    try{

        let response = await core.executeHttpRequest({ destinationName: constants.DESTINATIONNAME }, {
            method: 'GET',
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
module.exports.getOnPremCCEmail = getOnPremCCEmail;