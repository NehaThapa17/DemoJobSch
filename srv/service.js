const core = require('@sap-cloud-sdk/core');
const onPremData = require('./onpremise/onpremiseoperations.js');
const SapCfAxios = require('sap-cf-axios').default;
const SapCfAxiosObj = SapCfAxios('CPIDEV');
const onPostData = require('./onpremise/onpremisePostOperations.js');

//JOB SCHEDULING START//
// const cds = require('@sap/cds');
// const express = require('express');
// const passport = require('passport');
// const xsenv = require('@sap/xsenv');
// const JWTStrategy = require('@sap/xssec').JWTStrategy;
// //configure passport
// const xsuaaService = xsenv.getServices({ myXsuaa: { tag: 'xsuaa' } });
// const xsuaaCredentials = xsuaaService.myXsuaa;
// const jwtStrategy = new JWTStrategy(xsuaaCredentials);
// passport.use(jwtStrategy);
// // configure express server with authentication middleware
// const app = express();
// app.use(passport.initialize());
// app.use(passport.authenticate('JWT', { session: false }));
// const https = require('https');
// // access credentials from environment variable (alternatively use xsenv)
// const VCAP_SERVICES = JSON.parse(process.env.VCAP_SERVICES)
// const CREDENTIALS = VCAP_SERVICES.jobscheduler[0].credentials
// // oauth
// const UAA = CREDENTIALS.uaa
// const OA_CLIENTID = UAA.clientid;
// const OA_SECRET = UAA.clientsecret;
// const OA_ENDPOINT = UAA.url;


// module.exports = cds.service.impl(async function () {
//  this.on('MasterUpload', async (req) => {
//     try {
//         req.notify(200, 'Accepted long running job.');
//         // afterwards the actual processing
//         let finalResult = await handleAsyncJob(req.headers, req);
//         return finalResult;

//         // return 'testing here in trial';
//     }
//     catch (error) {
//         console.log(error);
//     }
// });


// const handleAsyncJob = async function (headers, req) {
//     try {
//         let result = await operationMasterUpload(req)
//         if ((typeof result !== 'undefined') && (result !== null)) {
//             await doUpdateStatus(headers, true, result)
//             return result;
//         } else {
//             await operationMasterUpload(req)
//         }
//     } catch (error) {
//         doUpdateStatus(headers, false, error.message)
//             .then(() => {
//                 console.log('Successfully called REST api of Jobscheduler')
//             }).catch((error) => {
//                 console.log('Error occurred while calling REST api of Jobscheduler' + error)
                
//             })
//     }
// }

// const operationMasterUpload = async function (req) {
//     try {
//         console.log('**********line 64*************');
//         return 'tested from Job, success!!';
//     }
//     catch (error) {
//         req.error({ code: 400, message: error.message });
//     }
// }


// const fetchJwtToken = function (clientId, clientSecret) {
//     return new Promise((resolve, reject) => {
//         const options = {
//             host: OA_ENDPOINT.replace('https://', ''),
//             path: '/oauth/token?grant_type=client_credentials&response_type=token',
//             headers: {
//                 Authorization: "Basic " + Buffer.from(clientId + ':' + clientSecret).toString("base64")
//             }
//         }
//         https.get(options, res => {
//             res.setEncoding('utf8')
//             let response = ''
//             res.on('data', chunk => {
//                 response += chunk
//             })
//             res.on('end', () => {
//                 try {
//                     const responseAsJson = JSON.parse(response)
//                     const jwtToken = responseAsJson.access_token
//                     if (!jwtToken) {
//                         return reject(new Error('Error while fetching JWT token'))
//                     }
//                     resolve(jwtToken)
//                 } catch (error) {
//                     return reject(new Error('Error while fetching JWT token'))
//                 }
//             })
//         })
//             .on("error", (error) => {
//                 console.log("Error: " + error.message);
//                 return reject({ error: error })
//             });
//     })
// }

// /********************Set the status in Jobscheduler***********************/
// const doUpdateStatus = function (headers, success, message) {
//     return new Promise((resolve, reject) => {
//         return fetchJwtToken(OA_CLIENTID, OA_SECRET)
//             .then((jwtToken) => {
//                 const jobId = headers['x-sap-job-id']
//                 const scheduleId = headers['x-sap-job-schedule-id']
//                 const runId = headers['x-sap-job-run-id']
//                 const host = headers['x-sap-scheduler-host']
//                 const data = JSON.stringify({ success: success, message: JSON.stringify(message) })
//                 const options = {
//                     host: host.replace('https://', ''),
//                     path: `/scheduler/jobs/${jobId}/schedules/${scheduleId}/runs/${runId}`,
//                     method: 'PUT',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Content-Length': data.length,
//                         Authorization: 'Bearer ' + jwtToken
//                     }
//                 }
//                 const req = https.request(options, (res) => {
//                     res.setEncoding('utf8')
//                     const status = res.statusCode
//                     if (status !== 200 && status !== 201) {
//                         return reject(new Error('Failed to update status of job'))
//                     }
//                     res.on('data', () => {
//                         console.log('Successfully heating to jobschedular')
//                         resolve(message)
//                     })
//                 });
//                 req.on('error', (error) => {
//                     console.log('error on heating to jobschedular')
//                     return reject({ error: error })
//                 });
//                 req.write(data)
//                 req.end()
//             })
//             .catch((error) => {
//                 console.log(error)
//                 reject(error)
//             })
//     })
// }

// });

//JOB SCHEDULING END//



//Calling onpremise operations
module.exports =cds.service.impl(async function(){
this.on('getTerminalDetails',async(req) =>{
  try{
  let sUrl= "/sap/opu/odata/sap/ZHSC_PRICING_NOTIF_SRV/TerminalDetailSet?$inlinecount=allpages";
  let response = await onPremData.getOnPremTerminalDetails(sUrl);
  let resultData = {
    data: response.data.d.results
  }
  return resultData;
  } 
  catch(error){

  }
});

this.on('getCustomerDetails',async(req) =>{
  try{
  let sUrl= "/sap/opu/odata/sap/ZHSC_PRICING_NOTIF_SRV/CustomerShipToDetailSet?$expand=ProductList&$inlinecount=allpages";
  let response = await onPremData.getOnPremCustomerDetails(sUrl);
  let resultData = {
    data: response.data.d.results
  }
  return resultData;
  } 
  catch(error){

  }
});

this.on('getOnPremProductDetails',async(req) =>{
  try{
  let sUrl= "/sap/opu/odata/sap/ZHSC_PRICING_NOTIF_SRV/ProductDetailSet?$inlinecount=allpages";
  let response = await onPremData.getOnPremProductDetails(sUrl);
  let resultData = {
    data: response.data.d.results
  }
  return resultData;
  } 
  catch(error){

  }
});
//Value Help Functions
this.on('getOnPremCustomerF4',async(req) =>{
  try{
  let sUrl= "/sap/opu/odata/sap/ZHSC_PRICING_NOTIF_SRV/CustomerShipTo_VHSet";
  let response = await onPremData.getOnPremCustomerValueHelp(sUrl);
  let resultData = {
    data: response.data.d.results
  }
  return resultData;
  } 
  catch(error){

  }
});
this.on('getOnPremTerminalF4',async(req) =>{
  try{
  let sUrl= "/sap/opu/odata/sap/ZHSC_PRICING_NOTIF_SRV/Terminal_VHSet";
  let response = await onPremData.getOnPremTerminalValueHelp(sUrl);
  let resultData = {
    data: response.data.d.results
  }
  return resultData;
  } 
  catch(error){

  }
});

this.on('getOnPremProductF4',async(req) =>{
  try{
  let sUrl= "/sap/opu/odata/sap/ZHSC_PRICING_NOTIF_SRV/Product_VHSet";
  let response = await onPremData.getOnPremProductValueHelp(sUrl);
  let resultData = {
    data: response.data.d.results
  }
  return resultData;
  } 
  catch(error){

  }
});
//Function for get CC Email
this.on('getOnCCEmail',async(req) =>{
  try{
  let sUrl= "/sap/opu/odata/sap/ZHSC_PRICING_NOTIF_SRV/KeyValueSet";
  let response = await onPremData.getOnPremCCEmail(sUrl);
  let resultData = {
    data: response.data.d.results
  }
  return resultData;
  } 
  catch(error){
  }
});
this.on("createCCEmail", async (req) => {
  try {
      let response = await onPostData.createCCEmailDetail(req);
      let resultData = { data: response };
      return resultData;
  }
  catch (error) {
      return error
  }
});
//Function to delete 
this.on("deleteCustomer", async (req) => {
  try {
    let m = req.data.customer;
    let n = req.data.shipTo;
      let response = await onPostData.deleteCustomerDetail(req,m,n);
      let resultData = { data: response };
      return resultData;
  }
  catch (error) {
      return error
  }
});
this.on("deleteTerminal", async (req) => {
  try {
    let m = req.data.terminal;
    
      let response = await onPostData.deleteTerminalDetail(req,m);
      let resultData = { data: response };
      return resultData;
  }
  catch (error) {
      return error
  }
});

this.on("deleteProduct", async (req) => {
  try {
    let m = req.data.product;
      let response = await onPostData.deleteProductDetail(req,m);
      let resultData = { data: response };
      return resultData;
  }
  catch (error) {
      return error
  }
});
//Function to call create product operation
this.on("createProduct", async (req) => {
  try {
      // log.info(`${LG_SERVICE}${__filename}`, "createSalesOrder", constants.LOG_INITIAL_COMMENT);
      let response = await onPostData.createProductDetail(req);
      // log.info(`${LG_SERVICE}${__filename}`, "createSalesOrder", constants.LOG_CREATING_SALES_ORDER);
      let resultData = { data: response };
      return resultData;
  }
  catch (error) {
      return error
  }
});
this.on("createTerminal", async (req) => {
  try {
      // log.info(`${LG_SERVICE}${__filename}`, "createSalesOrder", constants.LOG_INITIAL_COMMENT);
      let response = await onPostData.createTerminalDetail(req);
      // log.info(`${LG_SERVICE}${__filename}`, "createSalesOrder", constants.LOG_CREATING_SALES_ORDER);
      let resultData = { data: response };
      return resultData;
  }
  catch (error) {
      return error
  }
});
this.on("createCustomer", async (req) => {
  try {
      // log.info(`${LG_SERVICE}${__filename}`, "createSalesOrder", constants.LOG_INITIAL_COMMENT);
      let response = await onPostData.createCustomerDetail(req);
      // log.info(`${LG_SERVICE}${__filename}`, "createSalesOrder", constants.LOG_CREATING_SALES_ORDER);
      let resultData = { data: response };
      return resultData;
  }
  catch (error) {
      return error
  }
});
//Update Functions
this.on("updateTerminal", async (req) => {
  try {
    let m = req.data.terminal;
      // log.info(`${LG_SERVICE}${__filename}`, "createSalesOrder", constants.LOG_INITIAL_COMMENT);
      let response = await onPostData.updateTerminalDetail(req,m);
      let resultData = { data: response };
      return resultData;
  }
  catch (error) {
      return error
  }
}); 
this.on("updateCustomer", async (req) => {
  try {
    let m = req.data.customer;
    let n = req.data.shipTo;
      let response = await onPostData.updateCustomerDetail(req);
      let resultData = { data: response };
      return resultData;
  }
  catch (error) {
      return error
  }
});
this.on("updateProduct", async (req) => {
  try {
    let m = req.data.product;
      let response = await onPostData.updateProductDetail(req,m);
      let resultData = { data: response };
      return resultData;
  }
  catch (error) {
      return error
  }
}); 
//Function to Trigger CPI for sending emails
this.on('triggerCPI',async(req) =>{    
  let response = await SapCfAxiosObj({
          method: 'POST',
          url: "/http/mailendpoint",
          headers: {
              'Content-Type': 'application/json'
          },
          data:{      
              "d": [{
                "To": "gchalumuri@marathonpetroleum.com;NThapa@marathonpetroleum.com",
                "CC": "gchalumuri@marathonpetroleum.com",
                "Subject": "MX-MARATHON PRICE NOTIFICATION (ALMACENES DISTRIBUIDORES DE LA FRONTERA)",
                "Customer": [{
                    "Terminal": {
                      "SoldtopartyName": "ALMACENES DISTRIBUIDORES DE LA FRONTERA",
                      "ShiptopartyName": "702268-PARAJE DE ORIENTE-8070",
                      "Plant": "MX-MAZATLAN-PEMEX",
                      "PricingDate": "5-Oct-22"
                    },
                    "Products": [
                      {
                        "Product": "ARCO REGULAR"
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      }
                    ],
            
            
            
                    "Tabledata": [
            
            
                      {
                        "ElementName": "Base Price:",
                        "REG": 16.6065,
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Volume Adjustment:",
                        "REG": "-1.3600",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Temp Competitive:",
                        "REG": "-0.1000",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Frieght Adjustment:",
                        "REG": "0.0101",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Rack Price Diff:",
                        "REG": "0.2087",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Temp Adjustment:",
                        "REG": "0.4098",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Premium:",
                        "REG": "0.2315",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Rin Value Obligation:",
                        "REG": "0.1234",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Reid Vapour Pressure",
                        "REG": "0.1234",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Gross Up Adjustment:",
                        "REG": "0.3421",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Tax Incentive:",
                        "REG": "0.5634",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Price:",
                        "REG": 15.1465,
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Tax MX - IEPS 2D:",
                        "REG": 1.4929,
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Tax MX - IEPS 2H:",
                        "REG": 0.1456,
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Tax MX - IEPS 2A:",
                        "REG": 0.4847,
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Unit Price:",
                        "REG": 17.2696,
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      }
                    ]
                  },
                  {
                    "Terminal": {
                      "SoldtopartyName": "ALMACENES DISTRIBUIDORES DE LA FRONTERA",
                      "ShiptopartyName": "702268-PARAJE DE ORIENTE-8070",
                      "Plant": "MX-LA PAZ-PEMEX",
                      "PricingDate": "5-Oct-22"
                    },
                    "Products": [
                      {
            
                        "Product": "ARCO REGULAR"
                      },
                      {
                        "Product": "ARCO PREMIUM"
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      }
                    ],
            
            
                    "Tabledata": [
            
            
                      {
                        "ElementName": "Base Price:",
                        "REG": 16.6065,
                        "PRE": 17.5780,
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
            
                      },
                      {
                        "ElementName": "Volume Adjustment:",
                        "REG": "-1.3600",
                        "PRE": "-1.1700",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
            
                      },
                      {
                        "ElementName": "Temp Competitive:",
                        "REG": "-0.1000",
                        "PRE": "-0.1000",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
            
                      },
                      {
                        "ElementName": "Frieght Adjustment:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
            
                      },
                      {
                        "ElementName": "Rack Price Diff:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
            
                      },
                      {
                        "ElementName": "Temp Adjustment:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
            
                      },
                      {
                        "ElementName": "Premium:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Rin Value Obligation:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Reid Vapour Pressure",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
            
                      },
                      {
                        "ElementName": "Gross Up Adjustment:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Tax Incentive:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Price:",
                        "REG": 15.1465,
                        "PRE": 16.3080,
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Tax MX - IEPS 2D:",
                        "REG": 1.4929,
                        "PRE": 2.1461,
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Tax MX - IEPS 2H:",
                        "REG": 0.1456,
                        "PRE": 0.1456,
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Tax MX - IEPS 2A:",
                        "REG": 0.4847,
                        "PRE": 0.5914,
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Unit Price:",
                        "REG": 17.2696,
                        "PRE": 19.1911,
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      }
                    ]
                  },
            
                  {
                    "Terminal": {
                      "SoldtopartyName": "ALMACENES DISTRIBUIDORES DE LA FRONTERA",
                      "ShiptopartyName": "702268-PARAJE DE ORIENTE-8070",
                      "Plant": "MX-VT-ELPASO",
                      "PricingDate": "5-Oct-22"
                    },
                    "Products": [
                      {
            
                        "Product": "ARCO REGULAR"
                      },
                      {
                        "Product": "ARCO PREMIUM"
                      },
                      {
                        "Product": "ARCO DIESEL"
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      }
                    ],
            
            
                    "Tabledata": [
            
            
                      {
                        "ElementName": "Base Price:",
                        "REG": 16.6065,
                        "PRE": 17.5780,
                        "DSL": 19.3730,
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Volume Adjustment:",
                        "REG": "-1.3600",
                        "PRE": "-1.1700",
                        "DSL": "-1.1700",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Temp Competitive:",
                        "REG": "-0.1000",
                        "PRE": "-0.1000",
                        "DSL": "-0.1000",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Frieght Adjustment:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Rack Price Diff:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Temp Adjustment:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Premium:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Rin Value Obligation:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Reid Vapour Pressure",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Gross Up Adjustment:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "0.3156",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Tax Incentive:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "-0.3156",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Price:",
                        "REG": 15.1465,
                        "PRE": 16.3080,
                        "DSL": 17.5730,
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Tax MX - IEPS 2D:",
                        "REG": 1.4929,
                        "PRE": 2.1461,
                        "DSL": "0.0000",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Tax MX - IEPS 2H:",
                        "REG": 0.1456,
                        "PRE": 0.1456,
                        "DSL": 0.1766,
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Tax MX - IEPS 2A:",
                        "REG": 0.4847,
                        "PRE": 0.5914,
                        "DSL": 0.4023,
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Unit Price:",
                        "REG": 17.2696,
                        "PRE": 19.1911,
                        "DSL": 18.1519,
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      }
                    ]
                  },
            
            
                  {
                    "Terminal": {
                      "SoldtopartyName": "ALMACENES DISTRIBUIDORES DE LA FRONTERA",
                      "ShiptopartyName": "702268-PARAJE DE ORIENTE-8070",
                      "Plant": "MX-CULIACAN-PEMEX",
                      "PricingDate": "5-Oct-22"
                    },
                    "Products": [
                      {
            
                        "Product": "ARCO REGULAR"
                      },
                      {
                        "Product": "ARCO PREMIUM"
                      },
                      {
                        "Product": "ARCO DIESEL"
                      },
                      {
                        "Product": "CLEAR REGULAR"
                      },
                      {
                        "Product": "CLEAR PREMIUM"
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      }
                    ],
            
            
                    "Tabledata": [
            
            
                      {
                        "ElementName": "Base Price:",
                        "REG": 16.6065,
                        "PRE": 17.5780,
                        "DSL": 19.3730,
                        "CREG": 15.4812,
                        "CPRE": 16.2401,
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Volume Adjustment:",
                        "REG": "-1.3600",
                        "PRE": "-1.1700",
                        "DSL": "-1.1700",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Temp Competitive:",
                        "REG": "-0.1000",
                        "PRE": "-0.1000",
                        "DSL": "-0.1000",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Frieght Adjustment:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Rack Price Diff:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Temp Adjustment:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Premium:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Rin Value Obligation:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Reid Vapour Pressure",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Gross Up Adjustment:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "0.3156",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Tax Incentive:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "-0.3156",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Price:",
                        "REG": 15.1465,
                        "PRE": 16.3080,
                        "DSL": 17.5730,
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Tax MX - IEPS 2D:",
                        "REG": 1.4929,
                        "PRE": 2.1461,
                        "DSL": "0.0000",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Tax MX - IEPS 2H:",
                        "REG": 0.1456,
                        "PRE": 0.1456,
                        "DSL": 0.1766,
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Tax MX - IEPS 2A:",
                        "REG": 0.4847,
                        "PRE": 0.5914,
                        "DSL": 0.4023,
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
                      },
                      {
                        "ElementName": "Unit Price:",
                        "REG": 17.2696,
                        "PRE": 19.1911,
                        "DSL": 18.1519,
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
            
            
                      }
                    ]
                  },
                  {
                    "Terminal": {
                      "SoldtopartyName": "ALMACENES DISTRIBUIDORES DE LA FRONTERA",
                      "ShiptopartyName": "702268-PARAJE DE ORIENTE-8070",
                      "Plant": "MX-TOPOLOBAMPO-PEMEX",
                      "PricingDate": "5-Oct-22"
                    },
                    "Products": [
                      {
            
                        "Product": "ARCO REGULAR"
                      },
                      {
                        "Product": "ARCO PREMIUM"
                      },
                      {
                        "Product": "ARCO DIESEL"
                      },
                      {
                        "Product": "CLEAR REGULAR"
                      },
                      {
                        "Product": "CLEAR PREMIUM"
                      },
                      {
                        "Product": "CLEAR DIESEL"
                      },
                      {
                        "Product": "PRODUCT7"
                      },
                      {
                        "Product": "PRODUCT8"
                      },
                      {
                        "Product": ""
                      },
                      {
                        "Product": ""
                      }
                    ],
            
            
            
                    "Tabledata": [
            
            
                      {
                        "ElementName": "Base Price:",
                        "REG": 16.6065,
                        "PRE": 17.5780,
                        "DSL": 19.3730,
                        "CREG": 15.4812,
                        "CPRE": 16.2401,
                        "CDSL": 18.9900,
                        "P7": "12.0106",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Volume Adjustment:",
                        "REG": "-1.3600",
                        "PRE": "-1.1700",
                        "DSL": "-1.1700",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Temp Competitive:",
                        "REG": "-0.1000",
                        "PRE": "-0.1000",
                        "DSL": "-0.1000",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Frieght Adjustment:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Rack Price Diff:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Temp Adjustment:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Premium:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Rin Value Obligation:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Reid Vapour Pressure",
                        "REG": "",
                        "PRE": "",
                        "DSL": "",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Gross Up Adjustment:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "0.3156",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Tax Incentive:",
                        "REG": "",
                        "PRE": "",
                        "DSL": "-0.3156",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Price:",
                        "REG": 15.1465,
                        "PRE": 16.3080,
                        "DSL": 17.5730,
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Tax MX - IEPS 2D:",
                        "REG": 1.4929,
                        "PRE": 2.1461,
                        "DSL": "0.0000",
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Tax MX - IEPS 2H:",
                        "REG": 0.1456,
                        "PRE": 0.1456,
                        "DSL": 0.1766,
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Tax MX - IEPS 2A:",
                        "REG": 0.4847,
                        "PRE": 0.5914,
                        "DSL": 0.4023,
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      },
                      {
                        "ElementName": "Unit Price:",
                        "REG": 17.2696,
                        "PRE": 19.1911,
                        "DSL": 18.1519,
                        "CREG": "",
                        "CPRE": "",
                        "CDSL": "",
                        "P7": "",
                        "P8": "",
                        "P9": "",
                        "P10": ""
                      }
                    ]
                  }
            
            
                ],
                "Footerdata": [{
                  "line1": "Business Confidential This e-mail message and all corresponding e-mail messages, including all attachments, are intended solely for the individual(s) named above. They contain confidential and/or proprietary information.",
                  "line2": "If you have received this e-mail message in error, do not read, forward, copy or distribute it or any of its content to anyone. In addition, please notify the sender that you have received this message immediately by return e-mail and delete it.",
                  "line3": "If there are any questions, please contact your Marathon Territory Manager."
                }]
              }]
}

          
      }).then(res => {
          return 'success';
      }).catch(async (error) => {
          return error;
      })
  return response;
});

});