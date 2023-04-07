service CatalogService 
 {

    action MasterEndpoint() returns String;
    function createSchedule(time:String,desc:String) returns String;
    function createOnDemandSchedule(time:String,desc:String) returns String;
    function updateSchedule(desc:String) returns String;
    function deleteSchedule(desc:String) returns String; 
    function deleteSuspendSchedule(desc:String) returns String; 
    function createSuspendSchedule(time:String,desc:String) returns String;
    function getJobDetails() returns String;
   
  
}
