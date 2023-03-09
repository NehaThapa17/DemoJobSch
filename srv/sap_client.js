const cfenv = require('cfenv');
const axios = require('axios');
const constants = require("./util/constants-util.js");
const log = require('cf-nodejs-logging-support');

const getClientFromDestination = async (xsuaaService, destinationService, destination) => {
    try {
        log.info("sap_client.js file has been called");
        const uaa_service = cfenv.getAppEnv().getService(xsuaaService);
        const dest_service = cfenv.getAppEnv().getService(destinationService);

        const sUaaCredentials = dest_service.credentials.clientid + ':' + dest_service.credentials.clientsecret;

             const getAuthTokenRequest = {
            url: uaa_service.credentials.url + '/oauth/token?grant_type=client_credentials&client_id=' + dest_service.credentials.clientid,
            method: constants.httpPost,
            headers: {
                'Authorization': constants.preURL + Buffer.from(sUaaCredentials).toString('base64'),
                'Content-type': 'application/x-www-form-urlencoded'
            }
        };
        const authTokenResponse = await axios(getAuthTokenRequest);
        const jwtTokenFromMethod = authTokenResponse.data.access_token;
        const getDestdetailsRequest = {
            url: dest_service.credentials.uri + '/destination-configuration/v1/destinations/' + destination,
            method: constants.httpGet,
            headers: {
                'Authorization': 'Bearer ' + jwtTokenFromMethod
            }
        };
        const destDetailsResponse = await axios(getDestdetailsRequest);
        const sap_client = destDetailsResponse.data.destinationConfiguration['sap-client']
        return sap_client;
    } catch (error) {
        log.error("sap_client.js" +error);
        return constants.ERROR;
    }
}

module.exports = {
    getClientFromDestination
}
