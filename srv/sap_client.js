const cfenv = require('cfenv');
const axios = require('axios');

const getClientFromDestination = async (xsuaaService, destinationService, destination) => {
    try {
        const uaa_service = cfenv.getAppEnv().getService(xsuaaService);
        const dest_service = cfenv.getAppEnv().getService(destinationService);

        const sUaaCredentials = dest_service.credentials.clientid + ':' + dest_service.credentials.clientsecret;

             const getAuthTokenRequest = {
            url: uaa_service.credentials.url + '/oauth/token?grant_type=client_credentials&client_id=' + dest_service.credentials.clientid,
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(sUaaCredentials).toString('base64'),
                'Content-type': 'application/x-www-form-urlencoded'
            }
        };
        const authTokenResponse = await axios(getAuthTokenRequest);
        const jwtTokenFromMethod = authTokenResponse.data.access_token;
        const getDestdetailsRequest = {
            url: dest_service.credentials.uri + '/destination-configuration/v1/destinations/' + destination,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + jwtTokenFromMethod
            }
        };
        const destDetailsResponse = await axios(getDestdetailsRequest);
        const sap_client = destDetailsResponse.data.destinationConfiguration['sap-client']
        return sap_client;
    } catch (error) {
      //  console.log(error);
        return "Error";
    }
}

module.exports = {
    getClientFromDestination
}
