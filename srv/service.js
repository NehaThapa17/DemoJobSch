const constants = require("./util/constants-util.js");
const log = require('cf-nodejs-logging-support');
const cds = require('@sap/cds');
const axios = require('axios');
//***START Comment Before running in Local */
const express = require('express');
const passport = require('passport');
const xsenv = require('@sap/xsenv');
const JWTStrategy = require('@sap/xssec').JWTStrategy;
//configure passport
const xsuaaService = xsenv.getServices({ myXsuaa: { tag: 'xsuaa' } });
const xsuaaCredentials = xsuaaService.myXsuaa;
const jwtStrategy = new JWTStrategy(xsuaaCredentials);
passport.use(jwtStrategy);
// configure express server with authentication middleware
const app = express();
app.use(passport.initialize());
app.use(passport.authenticate('JWT', { session: false }));
const https = require('https');
// access credentials from environment variable (alternatively use xsenv)
const VCAP_SERVICES = JSON.parse(process.env.VCAP_SERVICES)
const CREDENTIALS = VCAP_SERVICES.jobscheduler[0].credentials
// oauth
const UAA = CREDENTIALS.uaa;
const baseURL = CREDENTIALS.url;
const OA_CLIENTID = UAA.clientid;
const OA_SECRET = UAA.clientsecret;
const OA_ENDPOINT = UAA.url;
// let oDesc="";
//***END Comment Before running in Local */
const core = require('@sap-cloud-sdk/core');
const onPremData = require('./onpremise/onpremiseoperations.js');
const SapCfAxios = require('sap-cf-axios').default;
const SapCfAxiosObj = SapCfAxios('CPIDEV');
const onPostData = require('./onpremise/onpremisePostOperations.js');
const JobSchedulerClient = require('@sap/jobs-client');

module.exports = cds.service.impl(async function () {
  
  this.on('getJobDetails', async (req) => {
    const token = await fetchJwtToken(OA_CLIENTID, OA_SECRET); //getAccessToken; 
    console.log("NEHA0 "+baseURL);
    const options = {
      baseURL: baseURL,
      token: token
    };
    const scheduler = new JobSchedulerClient.Scheduler(options);
    let jobID = await getJobId('pricingNotificationJobs', scheduler);
    let jobDetails = await getJobDetals(jobID,scheduler);
    let sdisplayT,sdemandT;
    let resultJob = jobDetails.results;
    if(resultJob){
      for(var i=0; i<resultJob.length; i++ ){
        if(resultJob[i].description === 'DAILY'){
          sdisplayT = resultJob[i].repeatAt;
        }
        if(resultJob[i].description === 'ONDEMAND'){
          sdemandT = resultJob[i].time;
        }
      };
    }
    let msg = {
      "DISPLAY":sdisplayT,
      "ONDEMAND":sdemandT
    };

    return JSON.stringify(msg);

  });
  this.on('deleteSchedule', async (req) => {
    const token = await  fetchJwtToken(OA_CLIENTID, OA_SECRET);//getAccessToken;
    const options = {
      baseURL: baseURL,
      token: token
    };
    const scheduler = new JobSchedulerClient.Scheduler(options);
    let jobID = await getJobId('pricingNotificationJobs', scheduler);
    let jobDetails = await getJobDetals(jobID,scheduler);
    let sDesc= req.data.desc;
    let sSId;
    let resultJob = jobDetails.results;
    
    if(resultJob){
      for(var i=0; i<resultJob.length; i++ ){
        if(resultJob[i].description === sDesc){
          sSId = resultJob[i].scheduleId;
          var req = {
            jobId: jobID._id,
            scheduleId: sSId
          };
          scheduler.deleteJobSchedule(req, function(err, result) {
            if(err){
              return logger.log('Error deleting schedule: %s', err);
            }
            //Schedule deleted successfully
            log.info("Schedule Deleted");
          });
          break;
        }
      };
    }
  });  
  this.on('createSchedule', async (req) => {
    const token = await  fetchJwtToken(OA_CLIENTID, OA_SECRET);//getAccessToken;
    const options = {
      baseURL: baseURL,
      token: token
    };
    const scheduler = new JobSchedulerClient.Scheduler(options);
    let jobID = await getJobId('pricingNotificationJobs', scheduler);
    let sTime= req.data.time;
    let sDesc= req.data.desc;
    // oDesc = sDesc;
    // oDesc = sDesc;
    // let sSId;
    // let resultJob = jobDetails.results;
    // if(resultJob){
    //   for(var i=0; i<resultJob.length; i++ ){
    //     if(resultJob[i].description.localeCompare(sDesc) == 0){
    //       sSId = resultJob[i].scheduleId;
    //       var req = {
    //         jobId: jobID._id,
    //         scheduleId: sSId
    //       };
    //       scheduler.deleteJobSchedule(req, function(err, result) {
    //         if(err){
    //           return logger.log('Error deleting schedule: %s', err);
    //         }
    //         //Schedule deleted successfully
    //         log.info("Schedule Deleted");
    //       });
    //       break;
    //     }
    //   };
    // }

    var scJob = {
      jobId: jobID._id,
      schedule: {
         "repeatAt": sTime,
         "type": "recurring",
        // "time": sTime,
        "description": sDesc,
        "data": {
          "headers":{"Content-Type":"application/json"},
          "sDesc":sDesc
        },
        "active": true
      }
    };
    return new Promise((resolve, reject) => {
      scheduler.createJobSchedule(scJob, function (error, body) {
        if (error) {
          reject(error.message);
        }
        // Job successfully created.
        resolve('Job successfully created')
      });
    })

  });
  this.on('createOnDemandSchedule', async (req) => {
    const token = await  fetchJwtToken(OA_CLIENTID, OA_SECRET);//getAccessToken;
    const options = {
      baseURL: baseURL,
      token: token
    };
    const scheduler = new JobSchedulerClient.Scheduler(options);
    let jobID = await getJobId('pricingNotificationJobs', scheduler);
    let jobDetails = await getJobDetals(jobID,scheduler);
    let sTime= req.data.time;
    let sDesc= req.data.desc;
    let sSId;
    let resultJob = jobDetails.results;
    if(resultJob){
      for(var i=0; i<resultJob.length; i++ ){
        if(resultJob[i].description === sDesc){
          sSId = resultJob[i].scheduleId;
          var req = {
            jobId: jobID._id,
            scheduleId: sSId
          };
          scheduler.deleteJobSchedule(req, function(err, result) {
            if(err){
              return logger.log('Error deleting schedule: %s', err);
            }
            //Schedule deleted successfully
            log.info("Schedule Deleted");
          });
          break;
        }
      };
    }

    var scJob = {
      jobId: jobID._id,
      schedule: {
        "time": sTime,
        "description": sDesc,
        "data": {
          "headers":{"Content-Type":"application/json"}
        },
        "active": true
      }
    };
    return new Promise((resolve, reject) => {
      scheduler.createJobSchedule(scJob, function (error, body) {
        if (error) {
          reject(error.message);
        }
        // Job successfully created.
        resolve('Job successfully created')
      });
    })

  });
  this.on('createSuspendSchedule', async (req) => {
    let timeArray= JSON.parse(req.data.time);
    const token = await  fetchJwtToken(OA_CLIENTID, OA_SECRET);
    const options = {
      baseURL: baseURL,
      token: token
    };
    const scheduler = new JobSchedulerClient.Scheduler(options);
    let jobID = await getJobId('pricingNotificationJobs', scheduler);
    let jobDetails = await getJobDetals(jobID,scheduler);
    // let oTemp = [timeArray];
    let sDesc = req.data.desc;
    
    let sSId;
    let resultJob = jobDetails.results;
    if(resultJob){
      for(var i=0; i<resultJob.length; i++ ){
        if(resultJob[i].description === sDesc){
          sSId = resultJob[i].scheduleId;
          var req = {
            jobId: jobID._id,
            scheduleId: sSId
          };
          scheduler.deleteJobSchedule(req, function(err, result) {
            if(err){
              return logger.log('Error deleting schedule: %s', err);
            }
            //Schedule deleted successfully
            log.info("Schedule Deleted");
          });
        }
      };
    }
for(var j=0; j<timeArray.length; j++){
  var scJob = {
    jobId: jobID._id,
    schedule: {
      "time": timeArray[j],
      "description": sDesc,
      "data": {
        "headers":{"Content-Type":"application/json"}
      },
      "active": true
    }
  };
      scheduler.createJobSchedule(scJob, function (error, body) {
      if (error) {
        reject(error.message);
      }
      // Job successfully created.
      resolve('Job successfully created')
    });
}

  });
  async function getJobDetals(jobID, scheduler) {
    var req = {
      jobId: jobID._id
    };
      return new Promise((resolve, reject) => {
        scheduler.fetchJobSchedules(req, function(err, result) {
          if(err){
            // return logger.log('Error retrieving job: %s', err);
            reject(err.message);
          }
          //job details retrieved successfully
          resolve(result)
          // return logger.log('Fetched Job Details', req);
        });
    })

  }
  async function getJobDetals1(job_Id, scheduler) {
    var req = {
      jobId: job_Id
    };
      return new Promise((resolve, reject) => {
        scheduler.fetchJobSchedules(req, function(err, result) {
          if(err){
            // return logger.log('Error retrieving job: %s', err);
            reject(err.message);
          }
          //job details retrieved successfully
          resolve(result)
          // return logger.log('Fetched Job Details', req);
        });
    })

  }
  async function getScheduleDetals(job_Id,schedule_Id,scheduler) {
    var req = {
      jobId: job_Id,
      scheduleId:schedule_Id,
      displayLogs: false
    };
      return new Promise((resolve, reject) => {
        scheduler.fetchJobSchedule(req, function(err, result) {
          if(err){
            // return logger.log('Error retrieving job: %s', err);
            reject(err.message);
          }
          //job details retrieved successfully
          resolve(result)
          // return logger.log('Fetched Job Details', req);
        });
    })

  }
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
  this.on('MasterUpload', async (req) => {
    try {
      const token = await  fetchJwtToken(OA_CLIENTID, OA_SECRET);
      const options = {
        baseURL: baseURL,
        token: token
      };
        const scheduler = new JobSchedulerClient.Scheduler(options);
        let job_Id = req.headers['x-sap-job-id'];
        let schedule_Id = req.headers['x-sap-job-schedule-id'];
        let schDetails = await getScheduleDetals(job_Id,schedule_Id,scheduler);
        let oDesc = schDetails.description;
        let jobID = await getJobId('pricingNotificationJobs', scheduler);
        let jobDetails = await getJobDetals(jobID,scheduler);
        let resultJob = jobDetails.result;
        console.log("NEHA JOB: "+JSON.stringify(jobID));
        console.log("NEHA1: "+JSON.stringify(jobDetails) +"JOBID:" +jobID._id);
        // afterwards the actual processing
        let finalResult = await handleAsyncJob(req.headers, req,oDesc,resultJob,job_Id);
        return finalResult;
    }
    catch (error) {
        console.log(error);
    }
});


const handleAsyncJob = async function (headers, req,oDesc,resultJob,job_Id) {
    try {
        let result = await operationMasterUpload(req,oDesc,resultJob,job_Id)
        if ((typeof result !== 'undefined') && (result !== null)) {
            await doUpdateStatus(headers, true, result)
            return result;
        } else {
            await operationMasterUpload(req,oDesc,resultJob,job_Id)
        }
    } catch (error) {
        doUpdateStatus(headers, false, error.message)
            .then(() => {
                console.log('Successfully called REST api of Jobscheduler')
            }).catch((error) => {
                console.log('Error occurred while calling REST api of Jobscheduler' + error)
                
            })
    }
}
  const operationMasterUpload = async function (req,oDesc,resultJob,job_Id) {
    try {
      console.log("NEHA5 "+oDesc);
      if(oDesc === 'DAILY' || oDesc === 'ONDEMAND' ){
      let sUrl = "/sap/opu/odata/sap/ZHSC_PRICING_NOTIF_SRV/EmailCustomerDetailsSet?$expand=ShipToNav/Terminal/ProdText,ShipToNav/Terminal/Price&$filter=JobCategory eq '"+oDesc+"'";
      console.log("NEHA1 "+sUrl);
      let responseData = await onPremData.getOnPremDetails(sUrl);
      let response = await SapCfAxiosObj({
        method: 'POST',
        url: "/http/httpendpoint",
        headers: {
          'Content-Type': 'application/json'
        },
        data: responseData.data 
        // {
        //   result: resultData
        // }
      }).then(res => {
        return 'success';
      }).catch(async (error) => {
        return error;
      })
      return 'tested from Job, success!!';
    } else if(oDesc === 'SUSPEND'){
      if(resultJob){
        console.log("NEHA2 " +resultJob);
        console.log("NEHA3 "+resultJob.length);
        // var req = {
        //   jobId: job_Id
        // };
        // scheduler.deactivateAllSchedules(req, function(err, result) {
        //   if(err){
        //     return logger.log('Error deactivating bulk schedules: %s', err);
        //   }
        //   //All schedules deactivated successfully
        // });
        for(var k=0; k<resultJob.length; k++ ){
          console.log("NEHA4 " +resultJob[k].description+" "+k);
          if(resultJob[k].description !== oDesc){
            sSId = resultJob[k].scheduleId;
            var scJob = {
              jobId: job_Id,
              scheduleId: sSId,
              schedule: {
                "active": false
              }
            };
            console.log("NEHA4 "+JSON.stringify(scJob));
            scheduler.updateJobSchedule(scJob, function(err, result) {
              if(err){
                return logger.log('Error deleting schedule: %s', err);
              }
              //Schedule deleted successfully
              log.info("Schedule Deactivated");
            });
          }
        }
      }  
    }


    }
    catch (error) {
      req.error({ code: 401, message: error.message });
    }
  }

  const fetchJwtToken = function (clientId, clientSecret) {
    return new Promise((resolve, reject) => {
      const options = {
        host: OA_ENDPOINT.replace('https://', ''),
        path: '/oauth/token?grant_type=client_credentials&response_type=token',
        headers: {
          Authorization: "Basic " + Buffer.from(clientId + ':' + clientSecret).toString("base64")
        }
      }
      https.get(options, res => {
        res.setEncoding('utf8')
        let response = ''
        res.on('data', chunk => {
          response += chunk
        })
        res.on('end', () => {
          try {
            const responseAsJson = JSON.parse(response)
            const jwtToken = responseAsJson.access_token
            if (!jwtToken) {
              return reject(new Error('Error while fetching JWT token'))
            }
            resolve(jwtToken)
          } catch (error) {
            return reject(new Error('Error while fetching JWT token'))
          }
        })
      })
        .on("error", (error) => {
          console.log("Error: " + error.message);
          return reject({ error: error })
        });
    })
  }

  /********************Set the status in Jobscheduler***********************/
  const doUpdateStatus = function (headers, success, message) {
    return new Promise((resolve, reject) => {
      return fetchJwtToken(OA_CLIENTID, OA_SECRET)
        .then((jwtToken) => {
          const jobId = headers['x-sap-job-id']
          const scheduleId = headers['x-sap-job-schedule-id']
          const runId = headers['x-sap-job-run-id']
          const host = headers['x-sap-scheduler-host']
          const data = JSON.stringify({ success: success, message: JSON.stringify(message) })
          const options = {
            host: host.replace('https://', ''),
            path: `/scheduler/jobs/${jobId}/schedules/${scheduleId}/runs/${runId}`,
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': data.length,
              Authorization: 'Bearer ' + jwtToken
            }
          }
          const req = https.request(options, (res) => {
            res.setEncoding('utf8')
            const status = res.statusCode
            if (status !== 200 && status !== 201) {
              return reject(new Error('Failed to update status of job'))
            }
            res.on('data', () => {
              console.log('Successfully hitting to jobschedular')
              resolve(message)
            })
          });
          req.on('error', (error) => {
            console.log('error on hitting to jobschedular')
            return reject({ error: error })
          });
          req.write(data)
          req.end()
        })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  }
  this.on('getEmailDetails', async (req) => {
    try {
      let sUrl = "/sap/opu/odata/sap/ZHSC_PRICING_NOTIF_SRV/EmailCustomerDetailsSet?$expand=ShipToNav/Terminal/ProdText,ShipToNav/Terminal/Price&$filter=JobCategory eq 'D'";
      let response = await onPremData.getOnPremDetails(sUrl);
      let resultData = {
        data: response.data.d.results
      }
      return resultData;
    }
    catch (error) {
      return error
    }
  });
  //JOB SCHEDULING END//
  this.on('getTerminalDetails', async (req) => {
    try {
      let sUrl = "/sap/opu/odata/sap/ZHSC_PRICING_NOTIF_SRV/TerminalDetailSet?$orderby=UpdDate Desc,UpdTime Desc";
      let response = await onPremData.getOnPremTerminalDetails(sUrl);
      let resultData = {
        data: response.data.d.results
      }
      return resultData;
    }
    catch (error) {
      return error
    }
  });

  this.on('getCustomerDetails', async (req) => {
    try {
      let sUrl = "/sap/opu/odata/sap/ZHSC_PRICING_NOTIF_SRV/CustomerShipToDetailSet?$expand=ProductList";
      let response = await onPremData.getOnPremCustomerDetails(sUrl);
      let resultData = {
        data: response.data.d.results
      }
      return resultData;
    }
    catch (error) {
      return error
    }
  });
  this.on('getOnPremProductDetails', async (req) => {
    try {
      let sUrl = "/sap/opu/odata/sap/ZHSC_PRICING_NOTIF_SRV/ProductDetailSet?$orderby=UpdDate Desc,UpdTime Desc";
      let response = await onPremData.getOnPremProductDetails(sUrl);
      let resultData = {
        data: response.data.d.results
      }
      return resultData;
    }
    catch (error) {
      return error
    }
  });
  //Value Help Functions
  this.on('getOnPremCustomerF4', async (req) => {
    try {
      let sUrl = "/sap/opu/odata/sap/ZHSC_PRICING_NOTIF_SRV/CustomerShipTo_VHSet";
      let response = await onPremData.getOnPremCustomerValueHelp(sUrl);
      let resultData = {
        data: response.data.d.results
      }
      return resultData;
    }
    catch (error) {

    }
  });
  this.on('getOnPremTerminalF4', async (req) => {
    try {
      let sUrl = "/sap/opu/odata/sap/ZHSC_PRICING_NOTIF_SRV/Terminal_VHSet";
      let response = await onPremData.getOnPremTerminalValueHelp(sUrl);
      let resultData = {
        data: response.data.d.results
      }
      return resultData;
    }
    catch (error) {

    }
  });

  this.on('getOnPremProductF4', async (req) => {
    try {
      let sUrl = "/sap/opu/odata/sap/ZHSC_PRICING_NOTIF_SRV/Product_VHSet";
      let response = await onPremData.getOnPremProductValueHelp(sUrl);
      let resultData = {
        data: response.data.d.results
      }
      return resultData;
    }
    catch (error) {

    }
  });

  //Function for get CC Email
  this.on('getOnCCEmail', async (req) => {
    try {
      let sUrl = "/sap/opu/odata/sap/ZHSC_PRICING_NOTIF_SRV/KeyValueSet";
      let response = await onPremData.getOnPremCCEmail(sUrl);
      let resultData = {
        data: response.data.d.results
      }
      return resultData;
    }
    catch (error) {
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
      let response = await onPostData.deleteCustomerDetail(req, m, n);
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

      let response = await onPostData.deleteTerminalDetail(req, m);
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
      let response = await onPostData.deleteProductDetail(req, m);
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
  this.on("updateOnDemand", async (req) => {
    try {
      let response = await onPostData.EditOnDemand(req);
      let resultData = { data: response };
      return resultData;
    }
    catch (error) {
      return error
    }
  });
  this.on("updateTerminal", async (req) => {
    try {
      let m = req.data.terminal;
      // log.info(`${LG_SERVICE}${__filename}`, "createSalesOrder", constants.LOG_INITIAL_COMMENT);
      let response = await onPostData.updateTerminalDetail(req, m);
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
      let response = await onPostData.updateProductDetail(req, m);
      let resultData = { data: response };
      return resultData;
    }
    catch (error) {
      return error
    }
  });
  //Function to Trigger CPI for sending emails
  this.on('triggerCPI', async (req) => {
    let response = await SapCfAxiosObj({
      method: 'POST',
      url: "/http/httpendpoint",
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        "Customer": [{
          "To": "neha.thapa@accenture.com",
          "CC": "neha.thapa@accenture.com",
          "Subject": "MX-MARATHON PRICE NOTIFICATION (ALMACENES DISTRIBUIDORES DE LA FRONTERA)",
          "Terminal": [{
            "SoldtopartyName": "ALMACENES DISTRIBUIDORES DE LA FRONTERA",
            "ShiptopartyName": "702268-PARAJE DE ORIENTE-8070",
            "Plant": "MX-MAZATLAN-PEMEX",
            "PricingDate": "5-Oct-22",
            "ProductNames": [{
              "Product1": "ARCO REGULAR"
            }],
            "PricingData": [

              {
                "ElementName": "Base Price:",
                "P1": 16.6065
              },
              {
                "ElementName": "Volume Adjustment:",
                "P1": "-1.3600"
              },
              {
                "ElementName": "Temp Competitive:",
                "P1": "-0.1000"

              },
              {
                "ElementName": "Frieght Adjustment:",
                "P1": "0.0101"
              },
              {
                "ElementName": "Rack Price Diff:",
                "P1": "0.2087"
              },
              {
                "ElementName": "Temp Adjustment:",
                "P1": "0.4098"
              },
              {
                "ElementName": "Premium:",
                "P1": "0.2315"
              },
              {
                "ElementName": "Rin Value Obligation:",
                "P1": "0.1234"

              },
              {
                "ElementName": "Reid Vapour Pressure",
                "P1": "0.1234"

              },
              {
                "ElementName": "Gross Up Adjustment:",
                "P1": "0.3421"

              },
              {
                "ElementName": "Tax Incentive:",
                "P1": "0.5634"

              },
              {
                "ElementName": "Price:",
                "P1": 15.1465

              },
              {
                "ElementName": "Tax MX - IEPS 2D:",
                "P1": 1.4929
              },
              {
                "ElementName": "Tax MX - IEPS 2H:",
                "P1": 0.1456
              },
              {
                "ElementName": "Tax MX - IEPS 2A:",
                "P1": 0.4847
              },
              {
                "ElementName": "Unit Price:",
                "P1": 17.2696
              }
            ]
          },
          {

            "SoldtopartyName": "ALMACENES DISTRIBUIDORES DE LA FRONTERA",
            "ShiptopartyName": "702268-PARAJE DE ORIENTE-8070",
            "Plant": "MX-LA PAZ-PEMEX",
            "PricingDate": "5-Oct-22",

            "ProductNames": [{

              "Product1": "ARCO REGULAR"
            },
            {
              "Product2": "ARCO PREMIUM"
            }

            ],


            "PricingData": [


              {
                "ElementName": "Base Price:",
                "P1": 16.6065,
                "P2": 17.5780

              },
              {
                "ElementName": "Volume Adjustment:",
                "P1": "-1.3600",
                "P2": "-1.1700"
              },
              {
                "ElementName": "Temp Competitive:",
                "P1": "-0.1000",
                "P2": "-0.1000"
              },
              {
                "ElementName": "Frieght Adjustment:",
                "P1": "",
                "P2": ""
              },
              {
                "ElementName": "Rack Price Diff:",
                "P1": "",
                "P2": ""

              },
              {
                "ElementName": "Temp Adjustment:",
                "P1": "",
                "P2": ""
              },
              {
                "ElementName": "Premium:",
                "P1": "",
                "P2": ""
              },
              {
                "ElementName": "Rin Value Obligation:",
                "P1": "",
                "P2": ""
              },
              {
                "ElementName": "Reid Vapour Pressure",
                "P1": "",
                "P2": ""
              },
              {
                "ElementName": "Gross Up Adjustment:",
                "P1": "",
                "P2": ""
              },
              {
                "ElementName": "Tax Incentive:",
                "P1": "",
                "P2": ""
              },
              {
                "ElementName": "Price:",
                "P1": 15.1465,
                "P2": 16.3080

              },
              {
                "ElementName": "Tax MX - IEPS 2D:",
                "P1": 1.4929,
                "P2": 2.1461
              },
              {
                "ElementName": "Tax MX - IEPS 2H:",
                "P1": 0.1456,
                "P2": 0.1456
              },
              {
                "ElementName": "Tax MX - IEPS 2A:",
                "P1": 0.4847,
                "P2": 0.5914
              },
              {
                "ElementName": "Unit Price:",
                "P1": 17.2696,
                "P2": 19.1911
              }
            ]
          },

          {

            "SoldtopartyName": "ALMACENES DISTRIBUIDORES DE LA FRONTERA",
            "ShiptopartyName": "702268-PARAJE DE ORIENTE-8070",
            "Plant": "MX-VT-ELPASO",
            "PricingDate": "5-Oct-22",

            "ProductNames": [{

              "Product1": "ARCO REGULAR"
            },
            {
              "Product2": "ARCO PREMIUM"
            },
            {
              "Product3": "ARCO DIESEL"
            }
            ],


            "PricingData": [


              {
                "ElementName": "Base Price:",
                "P1": 16.6065,
                "P2": 17.5780,
                "P3": 19.3730
              },
              {
                "ElementName": "Volume Adjustment:",
                "P1": "-1.3600",
                "P2": "-1.1700",
                "P3": "-1.1700"

              },
              {
                "ElementName": "Temp Competitive:",
                "P1": "-0.1000",
                "P2": "-0.1000",
                "P3": "-0.1000"

              },
              {
                "ElementName": "Frieght Adjustment:",
                "P1": "",
                "P2": "",
                "P3": ""

              },
              {
                "ElementName": "Rack Price Diff:",
                "P1": "",
                "P2": "",
                "P3": ""
              },
              {
                "ElementName": "Temp Adjustment:",
                "P1": "",
                "P2": "",
                "P3": ""
              },
              {
                "ElementName": "Premium:",
                "P1": "",
                "P2": "",
                "P3": ""
              },
              {
                "ElementName": "Rin Value Obligation:",
                "P1": "",
                "P2": "",
                "P3": ""
              },
              {
                "ElementName": "Reid Vapour Pressure",
                "P1": "",
                "P2": "",
                "P3": ""

              },
              {
                "ElementName": "Gross Up Adjustment:",
                "P1": "",
                "P2": "",
                "P3": "0.3156"
              },
              {
                "ElementName": "Tax Incentive:",
                "P1": "",
                "P2": "",
                "P3": "-0.3156"

              },
              {
                "ElementName": "Price:",
                "P1": 15.1465,
                "P2": 16.3080,
                "P3": 17.5730
              },
              {
                "ElementName": "Tax MX - IEPS 2D:",
                "P1": 1.4929,
                "P2": 2.1461,
                "P3": "0.0000"
              },
              {
                "ElementName": "Tax MX - IEPS 2H:",
                "P1": 0.1456,
                "P2": 0.1456,
                "P3": 0.1766
              },
              {
                "ElementName": "Tax MX - IEPS 2A:",
                "P1": 0.4847,
                "P2": 0.5914,
                "P3": 0.4023
              },
              {
                "ElementName": "Unit Price:",
                "P1": 17.2696,
                "P2": 19.1911,
                "P3": 18.1519
              }
            ]
          },


          {

            "SoldtopartyName": "ALMACENES DISTRIBUIDORES DE LA FRONTERA",
            "ShiptopartyName": "702268-PARAJE DE ORIENTE-8070",
            "Plant": "MX-CULIACAN-PEMEX",
            "PricingDate": "5-Oct-22",

            "ProductNames": [{

              "Product1": "ARCO REGULAR"
            },
            {
              "Product2": "ARCO PREMIUM"
            },
            {
              "Product3": "ARCO DIESEL"
            },
            {
              "Product4": "CLEAR REGULAR"
            },
            {
              "Product5": "CLEAR PREMIUM"
            }

            ],


            "PricingData": [


              {
                "ElementName": "Base Price:",
                "P1": 16.6065,
                "P2": 17.5780,
                "P3": 19.3730,
                "P4": 15.4812,
                "P5": 16.2401

              },
              {
                "ElementName": "Volume Adjustment:",
                "P1": "-1.3600",
                "P2": "-1.1700",
                "P3": "-1.1700",
                "P4": "",
                "P5": ""

              },
              {
                "ElementName": "Temp Competitive:",
                "P1": "-0.1000",
                "P2": "-0.1000",
                "P3": "-0.1000",
                "P4": "",
                "P5": ""
              },
              {
                "ElementName": "Frieght Adjustment:",
                "P1": "",
                "P2": "",
                "P3": "",
                "P4": "",
                "P5": ""

              },
              {
                "ElementName": "Rack Price Diff:",
                "P1": "",
                "P2": "",
                "P3": "",
                "P4": "",
                "P5": ""
              },
              {
                "ElementName": "Temp Adjustment:",
                "P1": "",
                "P2": "",
                "P3": "",
                "P4": "",
                "P5": ""

              },
              {
                "ElementName": "Premium:",
                "P1": "",
                "P2": "",
                "P3": "",
                "P4": "",
                "P5": ""

              },
              {
                "ElementName": "Rin Value Obligation:",
                "P1": "",
                "P2": "",
                "P3": "",
                "P4": "",
                "P5": ""
              },
              {
                "ElementName": "Reid Vapour Pressure",
                "P1": "",
                "P2": "",
                "P3": "",
                "P4": "",
                "P5": ""
              },
              {
                "ElementName": "Gross Up Adjustment:",
                "P1": "",
                "P2": "",
                "P3": "0.3156",
                "P4": "",
                "P5": ""

              },
              {
                "ElementName": "Tax Incentive:",
                "P1": "",
                "P2": "",
                "P3": "-0.3156",
                "P4": "",
                "P5": ""

              },
              {
                "ElementName": "Price:",
                "P1": 15.1465,
                "P2": 16.3080,
                "P3": 17.5730,
                "P4": "",
                "P5": ""

              },
              {
                "ElementName": "Tax MX - IEPS 2D:",
                "P1": 1.4929,
                "P2": 2.1461,
                "P3": "0.0000",
                "P4": "",
                "P5": ""

              },
              {
                "ElementName": "Tax MX - IEPS 2H:",
                "P1": 0.1456,
                "P2": 0.1456,
                "P3": 0.1766,
                "P4": "",
                "P5": ""

              },
              {
                "ElementName": "Tax MX - IEPS 2A:",
                "P1": 0.4847,
                "P2": 0.5914,
                "P3": 0.4023,
                "P4": "",
                "P5": ""
              },
              {
                "ElementName": "Unit Price:",
                "P1": 17.2696,
                "P2": 19.1911,
                "P3": 18.1519,
                "P4": "",
                "P5": ""
              }
            ]
          },
          {

            "SoldtopartyName": "ALMACENES DISTRIBUIDORES DE LA FRONTERA",
            "ShiptopartyName": "702268-PARAJE DE ORIENTE-8070",
            "Plant": "MX-TOPOLOBAMPO-PEMEX",
            "PricingDate": "5-Oct-22",

            "ProductNames": [{

              "Product1": "ARCO REGULAR"
            },
            {
              "Product2": "ARCO PREMIUM"
            },
            {
              "Product3": "ARCO DIESEL"
            },
            {
              "Product4": "CLEAR REGULAR"
            },
            {
              "Product5": "CLEAR PREMIUM"
            },
            {
              "Product6": "CLEAR DIESEL"
            },
            {
              "Product7": "PRODUCT7"
            },
            {
              "Product8": "PRODUCT8"
            }
            ],



            "PricingData": [


              {
                "ElementName": "Base Price:",
                "P1": 16.6065,
                "P2": 17.5780,
                "P3": 19.3730,
                "P4": 15.4812,
                "P5": 16.2401,
                "P6": 18.9900,
                "P7": "12.0106",
                "P8": ""
              },
              {
                "ElementName": "Volume Adjustment:",
                "P1": "-1.3600",
                "P2": "-1.1700",
                "P3": "-1.1700",
                "P4": "",
                "P5": "",
                "P6": "",
                "P7": "",
                "P8": ""
              },
              {
                "ElementName": "Temp Competitive:",
                "P1": "-0.1000",
                "P2": "-0.1000",
                "P3": "-0.1000",
                "P4": "",
                "P5": "",
                "P6": "",
                "P7": "",
                "P8": ""

              },
              {
                "ElementName": "Frieght Adjustment:",
                "P1": "",
                "P2": "",
                "P3": "",
                "P4": "",
                "P5": "",
                "P6": "",
                "P7": "",
                "P8": ""

              },
              {
                "ElementName": "Rack Price Diff:",
                "P1": "",
                "P2": "",
                "P3": "",
                "P4": "",
                "P5": "",
                "P6": "",
                "P7": "",
                "P8": ""

              },
              {
                "ElementName": "Temp Adjustment:",
                "P1": "",
                "P2": "",
                "P3": "",
                "P4": "",
                "P5": "",
                "P6": "",
                "P7": "",
                "P8": ""

              },
              {
                "ElementName": "Premium:",
                "P1": "",
                "P2": "",
                "P3": "",
                "P4": "",
                "P5": "",
                "P6": "",
                "P7": "",
                "P8": ""

              },
              {
                "ElementName": "Rin Value Obligation:",
                "P1": "",
                "P2": "",
                "P3": "",
                "P4": "",
                "P5": "",
                "P6": "",
                "P7": "",
                "P8": ""

              },
              {
                "ElementName": "Reid Vapour Pressure",
                "P1": "",
                "P2": "",
                "P3": "",
                "P4": "",
                "P5": "",
                "P6": "",
                "P7": "",
                "P8": ""

              },
              {
                "ElementName": "Gross Up Adjustment:",
                "P1": "",
                "P2": "",
                "P3": "0.3156",
                "P4": "",
                "P5": "",
                "P6": "",
                "P7": "",
                "P8": ""

              },
              {
                "ElementName": "Tax Incentive:",
                "P1": "",
                "P2": "",
                "P3": "-0.3156",
                "P4": "",
                "P5": "",
                "P6": "",
                "P7": "",
                "P8": ""
              },
              {
                "ElementName": "Price:",
                "P1": 15.1465,
                "P2": 16.3080,
                "P3": 17.5730,
                "P4": "",
                "P5": "",
                "P6": "",
                "P7": "",
                "P8": ""
              },
              {
                "ElementName": "Tax MX - IEPS 2D:",
                "P1": 1.4929,
                "P2": 2.1461,
                "P3": "0.0000",
                "P4": "",
                "P5": "",
                "P6": "",
                "P7": "",
                "P8": ""

              },
              {
                "ElementName": "Tax MX - IEPS 2H:",
                "P1": 0.1456,
                "P2": 0.1456,
                "P3": 0.1766,
                "P4": "",
                "P5": "",
                "P6": "",
                "P7": "",
                "P8": ""

              },
              {
                "ElementName": "Tax MX - IEPS 2A:",
                "P1": 0.4847,
                "P2": 0.5914,
                "P3": 0.4023,
                "P4": "",
                "P5": "",
                "P6": "",
                "P7": "",
                "P8": ""

              },
              {
                "ElementName": "Unit Price:",
                "P1": 17.2696,
                "P2": 19.1911,
                "P3": 18.1519,
                "P4": "",
                "P5": "",
                "P6": "",
                "P7": "",
                "P8": ""

              }
            ]
          }


          ]

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