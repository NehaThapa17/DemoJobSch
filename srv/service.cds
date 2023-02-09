service CatalogService @(requires : 'authenticated-user')
 {
    type response{
        data : String
    };

    action MasterUpload() returns String;
    function createSchedule(time:String,desc:String) returns String;
    function createOnDemandSchedule(time:String,desc:String) returns String;
    function updateSchedule(desc:String) returns String;
    function deleteSchedule(desc:String) returns String; 
    function deleteSuspendSchedule(desc:String) returns String; 
    function createSuspendSchedule(time:String,desc:String) returns String;
    function getJobDetails() returns String;
    function getTerminalDetails() returns response;
    function getCustomerDetails() returns response;
    function getOnPremProductDetails() returns response;
    function getOnPremCustomerF4() returns response;
    function getOnPremTerminalF4() returns response; 
    function getOnPremProductF4() returns response;
    function getOnCCEmail() returns response; 
    action updateOnDemand(createData: String) returns response;
    action createCCEmail(createData: String) returns response;
    action createProduct(createData: String) returns response;
    action createTerminal(createData: String) returns response; 
    action createCustomer(createData: String) returns response; 
    action updateTerminal(createData: String,terminal:String) returns response;  
    action updateProduct(createData: String,product:String) returns response;
    action updateCustomer(createData: String) returns response; 
    action deleteCustomer(customer:String,shipTo:String) returns response; 
    action deleteTerminal(terminal:String) returns response;
    action deleteProduct(product:String) returns response;
    action unbindShipTo(createData:String,terminal:String) returns response;
    
  
}

//@(requires : 'authenticated-user')