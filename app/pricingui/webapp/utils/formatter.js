sap.ui.define(
    ["marathonpetroleum/hsc/pricingui/utils/constants",
    "marathonpetroleum/hsc/pricingui/utils/formatter"
], function (constants) {
    "use strict";
    return {
/**
         * Method to format Order status Icon in My Orders table
         * @public
         * @param {String} sNum value for Order status
         * @returns {String} sap icon value string
         */
 getIconOrder: function (sNum) {
    if(sNum === true){
        return "sap-icon://accept";
    } else {
        return ""
    }
},

/**
 * Method to format email in Customer table
 * @public
 * @param {String} sNum value for emails
 * @returns {String} single email 
 */
getFirstEmail: function (sNum) {
    var oEmailArray = sNum.split(";");
    return oEmailArray[0];
     },
     getStatus:function(sCount){
        
        if (parseInt(sCount) === 0){
            return false;
        } else {
            return true;
        }
     }     
    }
});