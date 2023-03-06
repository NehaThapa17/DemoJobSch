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
    function dataInconCheck() returns response; 
    function sendInconEmail() returns response;
    function getTerminal(terminal:String) returns response;
    function getProduct(product:String) returns response;
    function getCustomer(customer:String,shipTo:String) returns response;
    action updateOnDemand(createData: String) returns response;
    action createCCEmail(createData: String) returns response;
    action createProduct(createData: String) returns response;
    action createTerminal(createData: String) returns response; 
    action createCustomer(createData: String) returns response; 
    action updateTerminal(etag:String,createData: String,terminal:String) returns response;  
    action updateProduct(etag:String,createData: String,product:String) returns response;
    action updateCustomer(etag:String,createData: String) returns response; 
    action deleteCustomer(etag:String,customer:String,shipTo:String) returns response; 
    action deleteTerminal(etag:String,terminal:String) returns response;
    action deleteProduct(etag:String,product:String) returns response;
    action unbindShipTo(etag:String,createData:String,terminal:String) returns response;
     action unbindProdShipTo(etag:String,createData:String,product:String) returns response;
    
  
}

//@(requires : 'authenticated-user')