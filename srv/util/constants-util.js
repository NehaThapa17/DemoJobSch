module.exports=Object.freeze({
    INTZERO:0,
    TOP:2,
    DESTINATIONNAME:"s4rt",
    DESTINATIONNAMEBASIC:"s4rt_basic",
    DEFAULTURL:"sap/opu/odata/sap/zhsc_pricing_notification_srv",
    PPSERVICEURL:"sap/opu/odata/sap/zhsc_pricing_notification_srv/$metadata",
    httpPost: 'POST',
    httpGet: 'GET',
    httpPut: 'PUT',
    httpDelete: 'DELETE',
    ERROR: "Error",
    NONE: "None",
    onDemand:'ONDEMAND',
    daily:'DAILY',
    suspendTo:'SUSPENDTO',
    suspendFrom:'SUSPENDFROM',
    URL_metadata:"/$metadata",
    jobNAME:'pricingNotificationV2Jobs',
    LOG_RETRIVING_RESPONSE:"Endpoint to trigger CPI emails and suspend schedules",
    LOG_JS_API:'Successfully called REST api of Jobscheduler',
    LOG_JS_ERR:'Error occurred while calling REST api of Jobscheduler',
    CPI_DATA_URL:"/sap/opu/odata/sap/zhsc_pricing_notification_srv/EmailCustomerDetailsSet?$expand=ShipToNav/Terminal/ProdText,ShipToNav/Terminal/Price&$filter=JobCategory eq '",
    CPI_ENDPOINT:"/http/httpendpointv2",
    SUCCESS:"Mail sent Successfully",
    SUCCESS_DEL:"Successfully Deleted",
    SUCCESS_EDIT:"Successfully Updated",
    LOG_SCH_DEL:"Schedule Deactivated",
    LOG_JS_DEL:"Schedule Deleted",
    LOG_JS_SUCC:'Successfully hitting to jobschedular',
    LOG_ONPREM_SELECT_ERR:"Error in getOnPremTerminalDetails",
    preURL:'Basic ',
    URL_TerDetails:"/sap/opu/odata/sap/zhsc_pricing_notification_srv/TerminalDetailSet?$orderby=UpdDate Desc,UpdTime Desc",
    URL_CustDetails:"/sap/opu/odata/sap/ZHSC_PRICING_NOTIFICATION_SRV/CustomerShipToDetailSet?$expand=ProductList,TerminalList&$format=json",
    URL_ProdDetails:"/sap/opu/odata/sap/zhsc_pricing_notification_srv/ProductDetailSet?$orderby=UpdDate Desc,UpdTime Desc",
    URL_F4cust:"/sap/opu/odata/sap/zhsc_pricing_notification_srv/CustomerShipTo_VHSet",
    URL_F4Ter:"/sap/opu/odata/sap/zhsc_pricing_notification_srv/Terminal_VHSet",
    URL_F4Prod:"/sap/opu/odata/sap/zhsc_pricing_notification_srv/Product_VHSet",
    URL_CC:"/sap/opu/odata/sap/zhsc_pricing_notification_srv/KeyValueSet",
    URL_ProdCreate:"/ProductDetailSet",
    URL_TerCreate:"/TerminalDetailSet",
    URL_CusCreate:"/CustomerShipToDetailSet",
    URL_CCCreate:"/KeyValueSet",
    URL_DPCreate:"/OnDemandDetailSet",
    inactive:"INACTIVE",
    xsuaaService:"pricingNotificationV2-xsuaa-service",
    destService:"pricingNotificationV2-destination-service",
    dest:"s4rt",
    INTTWO:200,
    ERR:401,
    INTTW:201,
});