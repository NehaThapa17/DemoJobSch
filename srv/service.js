const constants = require("./util/constants-util.js");

const cds = require('@sap/cds');
const express = require('express');
const passport = require('passport');
const xsenv = require('@sap/xsenv');
const JWTStrategy = require('@sap/xssec').JWTStrategy;
const cfenv = require("cfenv");
const appEnv = cfenv.getAppEnv();
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
let OA_CLIENTID, OA_SECRET, OA_ENDPOINT,baseURL;

if (appEnv.isLocal) {
    //update this variables if you are checking it locally clientid and clientsecret
    CLIENTID = constants.CLIENT_ID;
    CLIENTSECRET = constants.CLIENT_SECRET;
    CLIENTURL = constants.CLIENT_URL;   
} else {
// access credentials from environment variable (alternatively use xsenv)
const VCAP_SERVICES = JSON.parse(process.env.VCAP_SERVICES)
const CREDENTIALS = VCAP_SERVICES.jobscheduler[0].credentials
// oauth
 UAA = CREDENTIALS.uaa;
 baseURL = CREDENTIALS.url;
 OA_CLIENTID = UAA.clientid;
 OA_SECRET = UAA.clientsecret;
 OA_ENDPOINT = UAA.url;
}
const JobSchedulerClient = require('@sap/jobs-client');


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
    let jobDetails = await getJobDetals(jobID, scheduler);
    let sdisplayT, sdemandT, sSuspendT, sSuspendF, sActiveT, sActiveF, SuspendActive;
    let resultJob = jobDetails.results;
    console.log("getJobDetails called" +JSON.stringify(resultJob));
    if (resultJob) {
      for (var i = 0; i < resultJob.length; i++) {
        if (resultJob[i].description === constants.daily && resultJob[i].active === true) {
          sdisplayT = resultJob[i].repeatAt;
        } else if (resultJob[i].description === constants.onDemand && resultJob[i].active === true) {
          sdemandT = resultJob[i].time;
        } else if (resultJob[i].description === constants.suspendTo) {
          sSuspendT = resultJob[i].time;
          sActiveT = resultJob[i].active;
        } else if (resultJob[i].description === constants.suspendFrom) {
          sSuspendF = resultJob[i].time;
          sActiveF = resultJob[i].active;
        } 
      };
      if (sActiveF === false && sActiveT === true) {
        SuspendActive = "Suspended";
      } else if (sActiveF === false && sActiveT === false) {
        SuspendActive = "Completed";
      } else if (sActiveF === true && sActiveT === true) {
        SuspendActive = true;
      } else {
        SuspendActive = false;
      }
    }
    let msg = {
      "RECURSIVE": sdisplayT,
      "ONDEMAND": sdemandT,
      "SUSPENDTo": sSuspendT,
      "SUSPENDFrom": sSuspendF,
      "sActive": SuspendActive
    };

    return JSON.stringify(msg);

  });
  /**
* Function to delete Fixed Period Schedule
*/
  this.on('deleteSchedule', async (req) => {
    const token = await fetchJwtToken(OA_CLIENTID, OA_SECRET);
    const options = {
      baseURL: baseURL,
      token: token
    };
    const scheduler = new JobSchedulerClient.Scheduler(options);
    let jobID = await getJobId(constants.jobNAME, scheduler);
    let jobDetails = await getJobDetals(jobID, scheduler);
    let sDesc = req.data.desc;
    let sSId;
    let resultJob = jobDetails.results;

    if (resultJob) {
      for (var i = 0; i < resultJob.length; i++) {
        if (resultJob[i].description === sDesc) {
          sSId = resultJob[i].scheduleId;
          var req = {
            jobId: jobID._id,
            scheduleId: sSId
          };
          scheduler.deleteJobSchedule(req, function (err, result) {
            if (err) {
              return logger.log('Error deleting schedule: %s', err);
            }
            //Schedule deleted successfully
            console.log(constants.LOG_JS_DEL);
          });
          break;
        }

      };
    }
  });
  /**
* Function to delete Suspend Schedule
*/
  this.on('deleteSuspendSchedule', async (req) => {
    const token = await fetchJwtToken(OA_CLIENTID, OA_SECRET);
    const options = {
      baseURL: baseURL,
      token: token
    };
    const scheduler = new JobSchedulerClient.Scheduler(options);
    let jobID = await getJobId(constants.jobNAME, scheduler);
    let jobDetails = await getJobDetals(jobID, scheduler);
    let sSId;
    let resultJob = jobDetails.results;

    if (resultJob) {
      for (var i = 0; i < resultJob.length; i++) {
        if (resultJob[i].description === constants.suspendFrom) {
          sSId = resultJob[i].scheduleId;
      //schedule details needed even after refresh

          var scJob = {
            jobId: jobID._id,
            scheduleId: sSId,
            schedule: {
              "active": false
            }
          };
          console.log("Suspend Schedule Updated" + JSON.stringify(scJob));
          console.log("Suspend Schedule Updated" + JSON.stringify(scJob));

          scheduler.updateJobSchedule(scJob, function (err, result) {
            if (err) {
              return logger.log('Error deactivating schedule: %s', err);
            }
            //Schedule deleted successfully
            console.log(constants.LOG_SCH_DEL);
          });

        } else if (resultJob[i].description === constants.suspendTo) {
          sSId = resultJob[i].scheduleId;

          //Incase of schedule details needed even after refresh

          var scJob = {
            jobId: jobID._id,
            scheduleId: sSId,
            schedule: {
              "active": false
            }
          };
          console.log("Suspend Schedule Updated" + JSON.stringify(scJob));
          console.log("Suspend Schedule Updated" + JSON.stringify(scJob));

          scheduler.updateJobSchedule(scJob, function (err, result) {
            if (err) {
              return logger.log('Error deactivating schedule: %s', err);
            }
            //Schedule deleted successfully
            console.log(constants.LOG_SCH_DEL);
          });

          let nRes = await suspendToOperation(resultJob, jobID._id);
          return nRes;
        }
      };
    }
  });
  /**
* Function to create Recursive Schedule
*/
  this.on('createSchedule', async (req) => {
    const token = await fetchJwtToken(OA_CLIENTID, OA_SECRET);
    const options = {
      baseURL: baseURL,
      token: token
    };
    const scheduler = new JobSchedulerClient.Scheduler(options);
    let jobID = await getJobId(constants.jobNAME, scheduler);
    let jobDetails = await getJobDetals(jobID, scheduler);
    let sTime = req.data.time;
    let sDesc = req.data.desc;
    let dFlag = "";
    let resultJob = jobDetails.results;
    if (resultJob) {
      for (var i = 0; i < resultJob.length; i++) {
        if (resultJob[i].description === sDesc) {
          dFlag = "X";
          sSId = resultJob[i].scheduleId;
          var scJob = {
            jobId: jobID._id,
            scheduleId: sSId,
            schedule: {
              "repeatAt": sTime,
              "active": true
            }
          };

        }
      };
    }
    if (dFlag === "X") {
      console.log("Schedule Updated" + scJob);
      console.log("Schedule Updated" + scJob);

      scheduler.updateJobSchedule(scJob, function (err, result) {
        if (err) {
          return logger.log('Error deleting schedule: %s', err);
        }
        //Schedule deleted successfully
        console.log(constants.LOG_SCH_DEL);
      });

    } else {
      var scJob = {
        jobId: jobID._id,
        schedule: {
          "repeatAt": sTime,
          "type": "recurring",
          "description": sDesc,
          "data": {
            "headers": { "Content-Type": "application/json" },
            "suspendStatus": "INACTIVE"
          },
          "active": true
        }
      };
      console.log( sDesc + "Schedule Created" + scJob);
      console.log("Schedule Created" + JSON.stringify(scJob));

      scheduler.createJobSchedule(scJob, function (error, body) {
        if (error) {
          console.log(error.message);
        }
        // Job successfully created.
        console.log('Job successfully created')
      });

    }
  });

  /**
* Function to deactivate Recursive Schedule
*/
  this.on('updateSchedule', async (req) => {
    const token = await fetchJwtToken(OA_CLIENTID, OA_SECRET);
    const options = {
      baseURL: baseURL,
      token: token
    };
    const scheduler = new JobSchedulerClient.Scheduler(options);
    let jobID = await getJobId(constants.jobNAME, scheduler);
    let jobDetails = await getJobDetals(jobID, scheduler);
    let sSId;
    let resultJob = jobDetails.results;
    let sDesc = req.data.desc;
    if (resultJob) {
      for (var k = 0; k < resultJob.length; k++) {
        if (resultJob[k].description === sDesc) {
          sSId = resultJob[k].scheduleId;
          var scJob = {
            jobId: jobID._id,
            scheduleId: sSId,
            schedule: {
              "active": false
            }
          };
          console.log("Schedule Updated" + JSON.stringify(scJob));
          console.log("Schedule Updated" + JSON.stringify(scJob));

          scheduler.updateJobSchedule(scJob, function (err, result) {
            if (err) {
              return logger.log('Error deleting schedule: %s', err);
            }
            //Schedule deleted successfully
            console.log(constants.LOG_SCH_DEL);
          });

        }
      }
    }
  });
  /**
* Function to create Fixed Period Schedule
*/
  this.on('createOnDemandSchedule', async (req) => {
    const token = await fetchJwtToken(OA_CLIENTID, OA_SECRET);
    const options = {
      baseURL: baseURL,
      token: token
    };
    const scheduler = new JobSchedulerClient.Scheduler(options);
    let jobID = await getJobId(constants.jobNAME, scheduler);
    let jobDetails = await getJobDetals(jobID, scheduler);
    let sTime = req.data.time;
    let sDesc = req.data.desc;
    let sSId;
    let resultJob = jobDetails.results;
    if (resultJob) {
      for (var i = 0; i < resultJob.length; i++) {
        if (resultJob[i].description === sDesc) {
          sSId = resultJob[i].scheduleId;
          var req = {
            jobId: jobID._id,
            scheduleId: sSId
          };
          scheduler.deleteJobSchedule(req, function (err, result) {
            if (err) {
              return logger.log('Error deleting schedule: %s', err);
            }
            //Schedule deleted successfully
            console.log(constants.LOG_JS_DEL);
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
          "headers": { "Content-Type": "application/json" },
          "suspendStatus": "INACTIVE"
        },
        "active": true
      }
    };
    console.log("OnDemand Schedule Created" + scJob);
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
    let timeArray = JSON.parse(req.data.time);
    const token = await fetchJwtToken(OA_CLIENTID, OA_SECRET);
    const options = {
      baseURL: baseURL,
      token: token
    };
    const scheduler = new JobSchedulerClient.Scheduler(options);
    let jobID = await getJobId(constants.jobNAME, scheduler);
    let jobDetails = await getJobDetals(jobID, scheduler);
    let sSId;
    let dFlag = "";
    let resultJob = jobDetails.results;
    if (resultJob) {
      for (var i = 0; i < resultJob.length; i++) {
        if (resultJob[i].description === constants.suspendTo || resultJob[i].description === constants.suspendFrom) {
          dFlag = "X";
          sSId = resultJob[i].scheduleId;
          for (var j = 0; j < timeArray.length; j++) {
            if(timeArray[j].Desc === resultJob[i].description){
            var scJob = {
              jobId: jobID._id,
              scheduleId: sSId,
              schedule: {
                "time": timeArray[j].time,
                "description": timeArray[j].Desc,
                "data": {
                  "headers": { "Content-Type": "application/json" }
                },
                "active": true
              }
            };
            console.log("Suspend Schedule Created" + scJob);
            console.log("Schedule Updated" + scJob);
            scheduler.updateJobSchedule(scJob, function (err, result) {
              if (err) {
                return logger.log('Error deleting schedule: %s', err);
              }
              //Schedule deleted successfully
              console.log(constants.LOG_SCH_DEL);
            });
          }
          }
        }
      };
    }
    if (dFlag !== "X") {
      for (var j = 0; j < timeArray.length; j++) {
        var scJob = {
          jobId: jobID._id,
          schedule: {
            "time": timeArray[j].time,
            "description": timeArray[j].Desc,
            "data": {
              "headers": { "Content-Type": "application/json" }
            },
            "active": true
          }
        };
        console.log("Suspend Schedule Created" + scJob);
        scheduler.createJobSchedule(scJob, function (error, body) {
          if (error) {
            console.log(error.message);
          }
          // Job successfully created.
          console.log('Job successfully created')
        });
  
  
      }

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
      scheduler.fetchJobSchedules(req, function (err, result) {
        if (err) {

          reject(err.message);
        }
        //job details retrieved successfully
        resolve(result)

      });
    })

  }
  /**
* Function to get Schedule Details
*/
  async function getScheduleDetals(job_Id, schedule_Id, scheduler) {
    var req = {
      jobId: job_Id,
      scheduleId: schedule_Id,
      displayLogs: false
    };
    return new Promise((resolve, reject) => {
      scheduler.fetchJobSchedule(req, function (err, result) {
        if (err) {
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

          reject(err.message);
        }
        resolve(result);

      });
    });
  }
  /**
* Function for Job schedule ENDPOINT
*/
  this.on('MasterEndpoint', async (req) => {
    try {
      console.log("Job Schedular Endpoint hit successfully");
      const token = await fetchJwtToken(OA_CLIENTID, OA_SECRET);
      const options = {
        baseURL: baseURL,
        token: token
      };
      const scheduler = new JobSchedulerClient.Scheduler(options);
      let job_Id = req.headers['x-sap-job-id'];
      let schedule_Id = req.headers['x-sap-job-schedule-id'];
      let schDetails = await getScheduleDetals(job_Id, schedule_Id, scheduler);
      let oDesc = schDetails.description;
      let jobID = await getJobId(constants.jobNAME, scheduler);
      let jobDetails = await getJobDetals(jobID, scheduler);
      let resultJob = jobDetails.results;
      // afterwards the actual processing
      let finalResult = await handleAsyncJob(req.headers, req, oDesc, resultJob, job_Id);
      return finalResult;
    }
    catch (error) {

      console.log("Error in MasterEndpoint" + error);
    }
  });
  const handleAsyncJob = async function (headers, req, oDesc, resultJob, job_Id) {
    try {
      let result = await operationTriggerEndpoint(req, oDesc, resultJob, job_Id)
      if ((typeof result !== 'undefined') && (result !== null)) {
        console.log("Update Job status");
        await doUpdateStatus(headers, true, result)
        return result;
      }
    } catch (error) {
      console.log("handleAsyncJob Catch" + error);

      doUpdateStatus(headers, false, error.message)
        .then(() => {
          console.log(constants.LOG_JS_API);
          console.log(constants.LOG_JS_API);
        }).catch((error) => {
          console.log(constants.LOG_JS_ERR + error);
          console.log(constants.LOG_JS_ERR + error);
        })
    }
  }
  /**
  * Function is the endpoint of the Job Schedules 
  */
  const operationTriggerEndpoint = async function (req, oDesc, resultJob, job_Id) {
    try {
      console.log("Schedule Description" + oDesc);
      let suspendStatus;
      for (var q = 0; q < resultJob.length; q++) {
        if (resultJob[q].description === oDesc) {
          let test = JSON.parse(resultJob[q].data);
          suspendStatus = test.suspendStatus;
        }
        
      }
      console.log(`${LG_SERVICE}${__filename}`, "operationTriggerEndpoint", constants.LOG_RETRIVING_RESPONSE);
      console.log("suspendStatus " + suspendStatus + "for " + oDesc);
      if (suspendStatus === constants.inactive && (oDesc === constants.daily || oDesc === constants.onDemand)) {

      
      

      } else if (oDesc === constants.suspendFrom) {
        console.log(oDesc + " Triggered");
        if (resultJob) {
          const token = await fetchJwtToken(OA_CLIENTID, OA_SECRET);
          const options = {
            baseURL: baseURL,
            token: token
          };
          const scheduler = new JobSchedulerClient.Scheduler(options);
          for (var k = 0; k < resultJob.length; k++) {
            if (resultJob[k].description === constants.daily || resultJob[k].description === constants.onDemand) { //
              sSId = resultJob[k].scheduleId;
              var scJob = {
                jobId: job_Id,
                scheduleId: sSId,
                schedule: {
                  "data": {
                    "headers": { "Content-Type": "application/json" },
                    "suspendStatus": "ACTIVE"
                  }
                }
              };
              scheduler.updateJobSchedule(scJob, function (err, result) {
                if (err) {
                  return logger.log('Error deleting schedule: %s', err);
                }
                //Schedule deleted successfully
                console.log(constants.LOG_SCH_DEL);
              });
            }
          }
        }
      } else if (oDesc === constants.suspendTo) {
        console.log(oDesc + " Triggered");
        if (resultJob) {
          let iRes = await suspendToOperation(resultJob, job_Id);
          return iRes;
        }
      } 
      console.log("operationTriggerEndpoint - Out of IF condition");
      return "Job has been successfully run";
    }
    catch (error) {
      req.error({ code: constants.ERR, message: error.message });
      console.log(`${LG_SERVICE}${__filename}`, "operationTriggerEndpoint", error.message);
    }
  }
  const suspendToOperation = async function (resultJob, job_Id) {

    const token = await fetchJwtToken(OA_CLIENTID, OA_SECRET);
    const options = {
      baseURL: baseURL,
      token: token
    };
    const scheduler = new JobSchedulerClient.Scheduler(options);
    for (var k = 0; k < resultJob.length; k++) {
      if (resultJob[k].description === constants.daily || resultJob[k].description === constants.onDemand) { 
        sSId = resultJob[k].scheduleId;
        var scJob = {
          jobId: job_Id,
          scheduleId: sSId,
          schedule: {
            "data": {
              "headers": { "Content-Type": "application/json" },
              "suspendStatus": "INACTIVE"
            }
          }
        };
        scheduler.updateJobSchedule(scJob, function (err, result) {
          if (err) {
            return logger.log('Error deleting schedule: %s', err);
          }
          //Schedule deleted successfully
          console.log(constants.LOG_SCH_DEL);
        });
      }
    }

  }


  /********************Get Dynamic token for Jobscheduler***********************/
  const fetchJwtToken = function (clientId, clientSecret) {
    return new Promise((resolve, reject) => {
      const options = {
        host: OA_ENDPOINT.replace('https://', ''),
        path: '/oauth/token?grant_type=client_credentials&response_type=token',
        headers: {
          Authorization: constants.preURL + Buffer.from(clientId + ':' + clientSecret).toString("base64")
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
              console.log("fetchJwtToken Error while fetching JWT token" );
              return reject(new Error('Error while fetching JWT token'));
            }
            resolve(jwtToken)
          } catch (error) {
            console.log("fetchJwtToken Error while fetching JWT token" );
            return reject(new Error('Error while fetching JWT token'));
            
          }
        })
      })
        .on("error", (error) => {
          console.log("Error JWT token function" + error);
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
          console.log("doUpdateStatus function error" + error);

          reject(error)
        })
    })
  }
});