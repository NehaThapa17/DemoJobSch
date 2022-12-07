const constants = require("./util/constants-util.js");
const log = require('cf-nodejs-logging-support');
const cds = require('@sap/cds');
const axios = require('axios');
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
const LG_SERVICE = 'Service: ';
// access credentials from environment variable (alternatively use xsenv)
const VCAP_SERVICES = JSON.parse(process.env.VCAP_SERVICES)
const CREDENTIALS = VCAP_SERVICES.jobscheduler[0].credentials
// oauth
const UAA = CREDENTIALS.uaa;
const baseURL = CREDENTIALS.url;
const OA_CLIENTID = UAA.clientid;
const OA_SECRET = UAA.clientsecret;
const OA_ENDPOINT = UAA.url;
const core = require('@sap-cloud-sdk/core');
const onPremData = require('./onpremise/onpremiseGetOperations.js');
const SapCfAxios = require('sap-cf-axios').default;
const SapCfAxiosObj = SapCfAxios('CPI');
const onPostData = require('./onpremise/onpremisePostOperations.js');
const JobSchedulerClient = require('@sap/jobs-client');
//Function referance to onpremiseGetOperations.js
const {getOnPremDetails} = require('./onpremise/onpremiseGetOperations.js');
const {getOnPremTerminalDetails} = require('./onpremise/onpremiseGetOperations.js');
const {getOnPremCustomerDetails} = require('./onpremise/onpremiseGetOperations.js');
const {getOnPremProductDetails} = require('./onpremise/onpremiseGetOperations.js');
const {getOnPremCustomerValueHelp} = require('./onpremise/onpremiseGetOperations.js');
const {getOnPremTerminalValueHelp} = require('./onpremise/onpremiseGetOperations.js');
const {getOnPremProductValueHelp} = require('./onpremise/onpremiseGetOperations.js');
const {getOnPremCCEmail} = require('./onpremise/onpremiseGetOperations.js');
//Function referance to onpremisePostOperations.js
const {createProductDetail} = require('./onpremise/onpremisePostOperations.js');
const {editOnDemand} = require('./onpremise/onpremisePostOperations.js');
const {createCCEmailDetail} = require('./onpremise/onpremisePostOperations.js');
const {createTerminalDetail} = require('./onpremise/onpremisePostOperations.js');
const {createCustomerDetail} = require('./onpremise/onpremisePostOperations.js');
const {updateTerminalDetail} = require('./onpremise/onpremisePostOperations.js');
const {updateCustomerDetail} = require('./onpremise/onpremisePostOperations.js');
const {updateProductDetail} = require('./onpremise/onpremisePostOperations.js');
const {deleteCustomerDetail} = require('./onpremise/onpremisePostOperations.js');
const {deleteTerminalDetail} = require('./onpremise/onpremisePostOperations.js');
const {deleteProductDetail} = require('./onpremise/onpremisePostOperations.js');


module.exports = cds.service.impl(async function () {
   /**
* Function to get Job Details that will be called from UI
*/  
  this.on('getJobDetails', async (req) => {
    const token = await fetchJwtToken(OA_CLIENTID, OA_SECRET); 
    const options = {
      baseURL: baseURL,
      token: token
    };
    const scheduler = new JobSchedulerClient.Scheduler(options);
    let jobID = await getJobId(constants.jobNAME, scheduler);
    let jobDetails = await getJobDetals(jobID,scheduler);
    let sdisplayT,sdemandT;
    let resultJob = jobDetails.results;
    if(resultJob){
      for(var i=0; i<resultJob.length; i++ ){
        if(resultJob[i].description === constants.daily){
          sdisplayT = resultJob[i].repeatAt;
        }
        if(resultJob[i].description === constants.onDemand){
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
  /**
* Function to delete Schedule
*/   
  this.on('deleteSchedule', async (req) => {
    const token = await  fetchJwtToken(OA_CLIENTID, OA_SECRET); 
    const options = {
      baseURL: baseURL,
      token: token
    };
    const scheduler = new JobSchedulerClient.Scheduler(options);
    let jobID = await getJobId(constants.jobNAME, scheduler);
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
            log.info(constants.LOG_JS_DEL);
          });
          break;
        }
      };
    }
  });
  /**
* Function to create Daily Schedule
*/     
  this.on('createSchedule', async (req) => {
    const token = await  fetchJwtToken(OA_CLIENTID, OA_SECRET); 
    const options = {
      baseURL: baseURL,
      token: token
    };
    const scheduler = new JobSchedulerClient.Scheduler(options);
    let jobID = await getJobId(constants.jobNAME, scheduler);
    let sTime= req.data.time;
    let sDesc= req.data.desc;
  
    var scJob = {
      jobId: jobID._id,
      schedule: {
         "repeatAt": sTime,
         "type": "recurring",
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
  /**
* Function to create On-Demand Schedule
*/   
  this.on('createOnDemandSchedule', async (req) => {
    const token = await  fetchJwtToken(OA_CLIENTID, OA_SECRET); 
    const options = {
      baseURL: baseURL,
      token: token
    };
    const scheduler = new JobSchedulerClient.Scheduler(options);
    let jobID = await getJobId(constants.jobNAME, scheduler);
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
            log.info(constants.LOG_JS_DEL);
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
  /**
* Function to create Suspend Schedule
*/   
  this.on('createSuspendSchedule', async (req) => {
    let timeArray= JSON.parse(req.data.time);
    const token = await  fetchJwtToken(OA_CLIENTID, OA_SECRET);
    const options = {
      baseURL: baseURL,
      token: token
    };
    const scheduler = new JobSchedulerClient.Scheduler(options);
    let jobID = await getJobId(constants.jobNAME, scheduler);
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
            log.info(constants.LOG_JS_DEL);
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
    /**
* Function to get Job Details
*/ 
  async function getJobDetals(jobID, scheduler) {
    var req = {
      jobId: jobID._id
    };
      return new Promise((resolve, reject) => {
        scheduler.fetchJobSchedules(req, function(err, result) {
          if(err){
            
            reject(err.message);
          }
          //job details retrieved successfully
          resolve(result)
          
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
  /**
* Function to get Schedule Details
*/   
  async function getScheduleDetals(job_Id,schedule_Id,scheduler) {
    var req = {
      jobId: job_Id,
      scheduleId:schedule_Id,
      displayLogs: false
    };
      return new Promise((resolve, reject) => {
        scheduler.fetchJobSchedule(req, function(err, result) {
          if(err){
            reject(err.message);
          }
          //job details retrieved successfully
          resolve(result)
        });
    })

  }
    /**
* Function to get Job ID
*/ 
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
    /**
* Function for Job schedule ENDPOINT
*/ 
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
        let jobID = await getJobId(constants.jobNAME, scheduler);
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
        let result = await operationTriggerEndpoint(req,oDesc,resultJob,job_Id)
        if ((typeof result !== 'undefined') && (result !== null)) {
            await doUpdateStatus(headers, true, result)
            return result;
        } else {
            await operationTriggerEndpoint(req,oDesc,resultJob,job_Id)
        }
    } catch (error) {
        doUpdateStatus(headers, false, error.message)
            .then(() => {
                console.log(constants.LOG_JS_API);
                log.info(constants.LOG_JS_API);
            }).catch((error) => {
                console.log(constants.LOG_JS_ERR + error);
                log.info(constants.LOG_JS_ERR + error);   
            })
    }
}
/**
* Function is the endpoint of the Job Schedules which sends Emails by calling the CPI endpoint
*/  
  const operationTriggerEndpoint = async function (req,oDesc,resultJob,job_Id) {
    try {
      log.info(`${LG_SERVICE}${__filename}`, "operationTriggerEndpoint", constants.LOG_RETRIVING_RESPONSE);
      if(oDesc === constants.daily || oDesc === constants.onDemand ){
      let sUrl = constants.CPI_DATA_URL+oDesc+"'";
      let responseData = await getOnPremDetails(sUrl);
      let response = await SapCfAxiosObj({
        method: constants.httpPost,
        url: constants.CPI_ENDPOINT,
        headers: {
          'Content-Type': 'application/json'
        },
        data: responseData.data 
      }).then(res => {
        return constants.SUCCESS;
      }).catch(async (error) => {
        return error;
      })
      return response ;
    } else if(oDesc === constants.suspend){
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
              log.info(constants.LOG_SCH_DEL);
            });
          }
        }
      }  
    }


    }
    catch (error) {
      req.error({ code: constants.ERR, message: error.message });
    }
  }
/********************Get Dynamic token for Jobscheduler***********************/
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
            if (status !== constants.INTTWO && status !== constants.INTTW) {
              return reject(new Error('Failed to update status of job'))
            }
            res.on('data', () => {
              console.log(constants.LOG_JS_SUCC)
              resolve(message)
            })
          });
          req.on('error', (error) => {
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
  /**
* Function to get Terminal Details
*/ 
  this.on('getTerminalDetails', async (req) => {
    try {
      let sUrl = constants.URL_TerDetails;
      let response = await  getOnPremTerminalDetails(sUrl);
      let resultData = {
        data: response.data.d.results
      }
      return resultData;
    }
    catch (error) {
      return error
    }
  });
  /**
* Function to get Customer Details
*/ 
  this.on('getCustomerDetails', async (req) => {
    try {
      let sUrl = constants.URL_CustDetails;
      let response = await  getOnPremCustomerDetails(sUrl);
      let resultData = {
        data: response.data.d.results
      }
      return resultData;
    }
    catch (error) {
      return error
    }
  });
  /**
* Function to get Product Details
*/    
  this.on('getOnPremProductDetails', async (req) => {
    try {
      let sUrl = constants.URL_ProdDetails;
      // let response = await  getOnPremProductDetails(sUrl);
      let response = await  getOnPremProductDetails(req,sUrl);
      let resultData = {
        data: response.data.d.results
      }
      return resultData;
    }
    catch (error) {
      return error
    }
  });
  /**
* Function to get Customer F4 help data
*/  
  this.on('getOnPremCustomerF4', async (req) => {
    try {
      let sUrl = constants.URL_F4cust;
      let response = await  getOnPremCustomerValueHelp(sUrl);
      let resultData = {
        data: response.data.d.results
      }
      return resultData;
    }
    catch (error) {
    }
  });
  /**
* Function to get Terminal F4 help data
*/     
  this.on('getOnPremTerminalF4', async (req) => {
    try {
      let sUrl = constants.URL_F4Ter;
      let response = await  getOnPremTerminalValueHelp(sUrl);
      let resultData = {
        data: response.data.d.results
      }
      return resultData;
    }
    catch (error) {

    }
  });
/**
* Function to get Product F4 Details
*/   
  this.on('getOnPremProductF4', async (req) => {
    try {
      let sUrl = constants.URL_F4Prod;
      let response = await  getOnPremProductValueHelp(sUrl);
      let resultData = {
        data: response.data.d.results
      }
      return resultData;
    }
    catch (error) {
    }
  });
/**
* Function to get CCEmails
*/   
  this.on('getOnCCEmail', async (req) => {
    try {
      let sUrl = constants.URL_CC;
      let response = await  getOnPremCCEmail(sUrl);
      let resultData = {
        data: response.data.d.results
      }
      return resultData;
    }
    catch (error) {
    }
  });
/**
* Function to create/update CCEmails
*/     
  this.on("createCCEmail", async (req) => {
    try {
      let response = await  createCCEmailDetail(req);
      let resultData = { data: response };
      return resultData;
    }
    catch (error) {
      return error
    }
  });
  /**
* Function to delete Customer Details
*/   
  this.on("deleteCustomer", async (req) => {
    try {
      let m = req.data.customer;
      let n = req.data.shipTo;
      let response = await  deleteCustomerDetail(req, m, n);
      let resultData = { data: response };
      return resultData;
    }
    catch (error) {
      return error
    }
  });
/**
* Function to delete Terminal Details
*/     
  this.on("deleteTerminal", async (req) => {
    try {
      let m = req.data.terminal;
      let response = await  deleteTerminalDetail(req, m);
      let resultData = { data: response };
      return resultData;
    }
    catch (error) {
      return error
    }
  });
/**
* Function to delete Product Details
*/   
  this.on("deleteProduct", async (req) => {
    try {
      let m = req.data.product;
      let response = await  deleteProductDetail(req, m);
      let resultData = { data: response };
      return resultData;
    }
    catch (error) {
      return error
    }
  });
/**
* Function to create Product Details
*/     
  this.on("createProduct", async (req) => {
    try {
      let response = await  createProductDetail(req);
      let resultData = { data: response };
      return resultData;
    }
    catch (error) {
      return error
    }
  });
/**
* Function to create Terminal Details
*/   
  this.on("createTerminal", async (req) => {
    try {
      let response = await  createTerminalDetail(req);
      let resultData = { data: response };
      return resultData;
    }
    catch (error) {
      return error
    }
  });
/**
* Function to create Customer Details
*/   
  this.on("createCustomer", async (req) => {
    try {
      let response = await  createCustomerDetail(req);
      let resultData = { data: response };
      return resultData;
    }
    catch (error) {
      return error
    }
  });
/**
* Function to update customer/shipto selected at On-Demand Prosessing 
*/
  this.on("updateOnDemand", async (req) => {
    try {
      let response = await  editOnDemand(req);
      let resultData = { data: response };
      return resultData;
    }
    catch (error) {
      return error
    }
  });
/**
* Function to update Terminal Details
*/  
  this.on("updateTerminal", async (req) => {
    try {
      let m = req.data.terminal;
      let response = await  updateTerminalDetail(req, m);
      let resultData = { data: response };
      return resultData;
    }
    catch (error) {
      return error
    }
  });
/**
* Function to update Customer Details
*/    
  this.on("updateCustomer", async (req) => {
    try {
      let response = await  updateCustomerDetail(req);
      let resultData = { data: response };
      return resultData;
    }
    catch (error) {
      return error
    }
  });
/**
* Function to update Product Details
*/   
  this.on("updateProduct", async (req) => {
    try {
      let m = req.data.product;
      let response = await  updateProductDetail(req, m);
      let resultData = { data: response };
      return resultData;
    }
    catch (error) {
      return error
    }
  });
});