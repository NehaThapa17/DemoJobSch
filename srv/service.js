const core = require('@sap-cloud-sdk/core');
const onPremData = require('./onpremise/onpremiseoperations.js');
const SapCfAxios = require('sap-cf-axios').default;
const SapCfAxiosObj = SapCfAxios('CPIDEV');
const onPostData = require('./onpremise/onpremisePostOperations.js');
const JobSchedulerClient = require('@sap/jobs-client');
const axios = require('axios');


// const CREDENTIALS = VCAP_SERVICES.jobscheduler[0].credentials.uaa;
// const CLIENTID = CREDENTIALS.clientid;
// const CLIENTSECRET = CREDENTIALS.clientsecret;

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
//JobScheduler
// const VCAP_SERVICES = JSON.parse(process.env.VCAP_SERVICES);
// const CREDENTIALS = VCAP_SERVICES.jobscheduler[0].credentials;
// const userName = CREDENTIALS.user;
// const password = CREDENTIALS.password;
    this.on('createJob', async (req) => {
      const token = await getAccessToken();
      const options = {
          baseURL: 'https://jobscheduler-rest.cfapps.us21.hana.ondemand.com',
          token: token
      };
      // const options = {
      //     baseURL: 'https://jobscheduler-rest.cfapps.us21.hana.ondemand.com',
      //     user: userName,
      //     password: password
      // };

      const scheduler = new JobSchedulerClient.Scheduler(options);

      let jobID = await getJobId('pricingNotificationJobs', scheduler);
      var scJob = {
          jobId: jobID._id,
          schedule: {
              "time": "in 3 seconds",
              "description": "Dynamic Job Test 002",
              "data": {
                  "JobId": "1234"
              },
              "active": true,
              "endTime": { "date": "2030-W06-5" },
          }
      };
      // var id = '';
      return new Promise((resolve, reject) => {
          scheduler.createJobSchedule(scJob, function (error, body) {
              if (error) {
                  reject(error.message);
              }
              // Job successfully created.
              //  = body._id;
              resolve('Job successfully created')
          });
      })
  });

  async function getJobId(name, scheduler) {
      var req = {
          name: name
      };

      return new Promise((resolve, reject) => {
          scheduler.fetchJob(req, function (err, result) {
              if (err) {
                  console.log(err);
                  reject(err.message);
              }
              resolve(result);
              
          });
      });
  }


  async function getAccessToken() {
      var clientid = 'sb-d8057bd6-7582-43e3-987c-b41338be5e40!b460|sap-jobscheduler!b4';
      var clientsecret = 'e389e395-6a8f-4b57-addb-e363e159b0b0$4wwgaOw2FAUnM_TCsT2VBxaZSLcbtPPKEEju_2cBs-A=';
      const sUaaCredentials = clientid + ':' + clientsecret;
      const getAuthTokenRequest = {
          url: 'https://mexicoerpdev.authentication.us21.hana.ondemand.com' + '/oauth/token?grant_type=client_credentials',
          method: 'POST',
          headers: {
              'Authorization': 'Basic ' + Buffer.from(sUaaCredentials).toString('base64'),
              'Content-type': 'application/x-www-form-urlencoded'
          }
      };
      const authTokenResponse = await axios(getAuthTokenRequest).catch(error => {
           console.log(error);
      })
      const jwtTokenFromMethod = authTokenResponse.data.access_token;
      return jwtTokenFromMethod;
  }
});