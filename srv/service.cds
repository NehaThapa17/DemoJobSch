service CatalogService 
 {
    type response{
        data : String
    };
    function getTerminalDetails() returns response;
    function getCustomerDetails() returns response;
    function getOnPremProductDetails() returns response;
    function getOnPremCustomerF4() returns response;
    function getOnPremTerminalF4() returns response; 
    function getOnPremProductF4() returns response;
    function getOnCCEmail() returns response; 
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
    function triggerCPI() returns String;
    function createJob() returns String
}

//@(requires : 'authenticated-user')