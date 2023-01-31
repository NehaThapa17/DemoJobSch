/*&--------------------------------------------------------------------------------------*
 * File name                    	   : controlView.controller.js	                     *
 * Created By                          : NThapa@marathonpetroleum.com                   *            	
 * Created On                          : 17-Oct-2022                                	 *                           							                                         *
 * Purpose                             : Controller for controlView.view.xml to process data  
 *                                       by the Pricing Analyst                                                               
 *---------------------------------------------------------------------------------------*
 */

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageToast",
    "sap/m/Token",
    "marathonpetroleum/hsc/pricingui/utils/formatter",
    "marathonpetroleum/hsc/pricingui/utils/constants",
    "sap/m/SearchField"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, JSONModel, Fragment, Filter, FilterOperator, BusyIndicator, MessageToast, Token, formatter, constants, SearchField) {
        "use strict";
        return Controller.extend("marathonpetroleum.hsc.pricingui.controller.controlView", {
            formatter: formatter,
            /**
              * Method to initialize all models and global variables
              * @public
              */
            onInit: function () {
                //fetch i18n model for text translation
                this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                //fetch the service model
                this.oDataModelT = this.getOwnerComponent().getModel();
                BusyIndicator.show();
                var oModel = new JSONModel();
                var oItemData = [];
                oModel.setData(oItemData);
                //set model 
                this.getView().setModel(oModel, "oModel");
                this.getOwnerComponent().setModel(oModel, "oModel");
                this.getView().byId("idMultiInputTerminal").setModel(oModel, "oModel");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RoutecontrolView").attachPatternMatched(this.onRouteControl, this);
                //OData call to get display data
                // this.getTerminalDetails();
                this.getProductDetails();
                this.getF4Customer();
                this.getF4Terminal();
                this.getF4Product();
                this.getCCEmails();
                // this.getJSTime();
            },
            /**
              * Method called on init() to get Job Schedule Time.
              * @public
              */
            getJSTime: function () {
                BusyIndicator.show();
                var that = this;
                this.oDataModelT.callFunction("/getJobDetails", {
                    method: constants.httpGet,
                    success: function (oData) {
                        BusyIndicator.hide();
                        var oDataArr2 = JSON.parse(oData.getJobDetails);
                        if (oDataArr2.DISPLAY !== undefined) {
                            var date = new Date(),
                                index = oDataArr2.DISPLAY.indexOf(constants.DIV),
                                hours = oDataArr2.DISPLAY.substring(constants.INTZERO, index),
                                minutes = oDataArr2.DISPLAY.substring(index + constants.INTONE);
                            date.setHours(hours);
                            date.setMinutes(minutes);
                            // Get dates for January and July
                            var dateJan = new Date(date.getFullYear(), constants.INTZERO, constants.INTONE);
                            var dateJul = new Date(date.getFullYear(), constants.INTSIX, constants.INTONE);
                            // Get timezone offset
                            var timezoneOffset = Math.max(dateJan.getTimezoneOffset(), dateJul.getTimezoneOffset());
                            // var oTempDate = new Date(date.getTime() + ((constants.INTONE * constants.INTSIXTY * constants.INTSIXTY * constants.INTTHOUS) * 6));
                            if (date.getTimezoneOffset() < timezoneOffset) {
                                // Adjust date by 5 hours
                                date = new Date(date.getTime() - ((constants.INTONE * constants.INTSIXTY * constants.INTSIXTY * constants.INTTHOUS) * constants.INTFIVE));
                            }
                            else {
                                // Adjust date by 6 hours
                                date = new Date(date.getTime() - ((constants.INTONE * constants.INTSIXTY * constants.INTSIXTY * constants.INTTHOUS) * constants.INTSIX));
                            }
                            // var timzone = new Date().toLocaleDateString(undefined, { day: '2-digit', timeZoneName: 'long' }).substring(4).match(/\b(\w)/g).join('');
                            var sTime = date.toLocaleString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true
                            });
                            that.getView().byId("idTextDailyST").setText(sTime);
                            that.getView().byId("idTimePickerInput").setValue(sTime);
                            that.getView().byId("idSwitchInput").setState(true);
                            that.getView().byId("idInfoLabel").setColorScheme(constants.INTSEVEN);
                            that.getView().byId("idInfoLabel").setText("Active");
                            that.getView().byId("idTimePickerInput").setEnabled(false);
                        } else {
                            that.getView().byId("idTextDailyST").setText(constants.SPACE);
                            that.getView().byId("idTimePickerInput").setValue(constants.SPACE);
                            that.getView().byId("idSwitchInput").setState(false);
                            that.getView().byId("idTimePickerInput").setEnabled(true);
                            that.getView().byId("idInfoLabel").setText("InActive");
                            that.getView().byId("idInfoLabel").setColorScheme(constants.INTONE);
                        }
                        if (oDataArr2.ONDEMAND !== undefined) {
                            var date = new Date(oDataArr2.ONDEMAND);
                            // // Get dates for January and July
                            var dateJan = new Date(date.getFullYear(), constants.INTZERO, constants.INTONE);
                            var dateJul = new Date(date.getFullYear(), constants.INTSIX, constants.INTONE);
                            // Get timezone offset
                            var timezoneOffset = Math.max(dateJan.getTimezoneOffset(), dateJul.getTimezoneOffset());
                            // var oTempDate = new Date(date.getTime() + ((constants.INTONE * constants.INTSIXTY * constants.INTSIXTY * constants.INTTHOUS) * 6));
                            if (date.getTimezoneOffset() < timezoneOffset) {
                                // Adjust date by 5 hours
                                date = new Date(date.getTime() - ((constants.INTONE * constants.INTSIXTY * constants.INTSIXTY * constants.INTTHOUS) * constants.INTFIVE));
                            }
                            else {
                                // Adjust date by 6 hours
                                date = new Date(date.getTime() - ((constants.INTONE * constants.INTSIXTY * constants.INTSIXTY * constants.INTTHOUS) * constants.INTSIX));
                            }
                            var sTime = date.toLocaleString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true
                            });
                            var dDate = date.toDateString(),
                                finalDate = dDate.slice(4) + constants.SPACE + sTime;
                            that.getView().byId("idTextOnDemandST").setText(finalDate);
                            that.getView().byId("idDatePickerOnDemand").setValue(finalDate);
                            that.getView().getModel("oModel").setProperty("/dateValue", finalDate);
                        } else {
                            that.getView().byId("idTextOnDemandST").setText(constants.SPACE);
                            // that.getView().byId("idDatePickerOnDemand").setValue();
                            that.getView().getModel("oModel").setProperty("/dateValue", constants.SPACE);
                        }
                        if (oDataArr2.sActive !== "Completed" && oDataArr2.SUSPENDTo !== undefined && oDataArr2.SUSPENDFrom !== undefined) {
                            var dateTo = new Date(oDataArr2.SUSPENDTo);
                            var dateFrom = new Date(oDataArr2.SUSPENDFrom);
                            // Get dates for January and July
                            var dateJanF = new Date(dateFrom.getFullYear(), constants.INTZERO, constants.INTONE);
                            var dateJulF = new Date(dateFrom.getFullYear(), constants.INTSIX, constants.INTONE);
                            // Get timezone offset
                            var timezoneOffsetF = Math.max(dateJanF.getTimezoneOffset(), dateJulF.getTimezoneOffset());
                            // var oTempDate = new Date(date.getTime() + ((constants.INTONE * constants.INTSIXTY * constants.INTSIXTY * constants.INTTHOUS) * 6));
                            if (dateFrom.getTimezoneOffset() < timezoneOffsetF) {
                                // Adjust date by 5 hours
                                dateFrom = new Date(dateFrom.getTime() - ((constants.INTONE * constants.INTSIXTY * constants.INTSIXTY * constants.INTTHOUS) * constants.INTFIVE));
                            }
                            else {
                                // Adjust date by 6 hours
                                dateFrom = new Date(dateFrom.getTime() - ((constants.INTONE * constants.INTSIXTY * constants.INTSIXTY * constants.INTTHOUS) * constants.INTSIX));
                            }

                            var sTime = dateFrom.toLocaleString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true
                            });
                            var dDate = dateFrom.toDateString(),
                                finalText = dDate.slice(4) + constants.SPACE + sTime;
                            /*************************** Suspend To Date ***************************/
                            // Get dates for January and July
                            var dateJanT = new Date(dateTo.getFullYear(), constants.INTZERO, constants.INTONE);
                            var dateJulT = new Date(dateTo.getFullYear(), constants.INTSIX, constants.INTONE);
                            // Get timezone offset
                            var timezoneOffsetT = Math.max(dateJanT.getTimezoneOffset(), dateJulT.getTimezoneOffset());
                            // var oTempDate = new Date(date.getTime() + ((constants.INTONE * constants.INTSIXTY * constants.INTSIXTY * constants.INTTHOUS) * 6));
                            if (dateTo.getTimezoneOffset() < timezoneOffsetT) {
                                // Adjust date by 5 hours
                                dateTo = new Date(dateTo.getTime() - ((constants.INTONE * constants.INTSIXTY * constants.INTSIXTY * constants.INTTHOUS) * constants.INTFIVE));
                            }
                            else {
                                // Adjust date by 6 hours
                                dateTo = new Date(dateTo.getTime() - ((constants.INTONE * constants.INTSIXTY * constants.INTSIXTY * constants.INTTHOUS) * constants.INTSIX));
                            }
                            // var timzone = new Date().toLocaleDateString(undefined, { day: '2-digit', timeZoneName: 'long' }).substring(4).match(/\b(\w)/g).join('');
                            var sTimeT = dateTo.toLocaleString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true
                            });
                            var dDateT = dateTo.toDateString(),
                                finalTextTo = dDateT.slice(4) + constants.SPACE + sTimeT;
                            if (oDataArr2.sActive === true) {
                                that.getView().byId("idInfoLabel").setText("Suspended");
                                that.getView().byId("idInfoLabel").setColorScheme(2);
                            }
                            that.getView().byId("idObjStatusS2").setText(finalTextTo);
                            that.getView().byId("idObjStatusS1").setText(finalText);
                            that.getView().getModel("oModel").setProperty("/dateValueF", finalText);
                            that.getView().getModel("oModel").setProperty("/dateValueT", finalTextTo);
                            that.getView().byId("idDatePickerSuspend").setValue(finalText);
                            that.getView().byId("idDatePicker2Suspend").setValue(finalTextTo);

                        } else {
                            that.getView().byId("idObjStatusS2").setText(constants.SPACE);
                            that.getView().byId("idObjStatusS1").setText(constants.SPACE);
                            that.getView().getModel("oModel").setProperty("/dateValueF", constants.SPACE);
                            that.getView().getModel("oModel").setProperty("/dateValueT", constants.SPACE);
                        }

                    },
                    error: function (err) {
                        BusyIndicator.hide();
                        MessageBox.error(that.oBundle.getText("techError"), {
                            details: err
                        });

                    }
                });
            },

            /**
               * Method called for Routing.
               * @public
               */
            onRouteControl: function () {
                this.getCustomerDetails();
                this.getTerminalDetails();
            },
            /**
              * Method called on init() to get CC Emails.
              * @public
              */
            getCCEmails: function () {
                var that = this;
                this.oDataModelT.callFunction("/getOnCCEmail", {
                    method: constants.httpGet,
                    success: function (oData) {
                        var dataTmp = oData.getOnCCEmail.data, oEmailArray;
                        if (dataTmp != undefined) {
                            if (dataTmp.length != constants.INTZERO) {
                                for (var u = constants.INTZERO; u < dataTmp.length; u++) {
                                    switch (dataTmp[u].Key) {
                                        case constants.emailCC:
                                            oEmailArray = dataTmp[u].Value.split(constants.spliter);
                                            break;
                                        case constants.checkD:
                                            break;
                                    }
                                }
                            }
                        }
                        that.getView().getModel("oModel").setProperty("/emailsCC", oEmailArray);
                        BusyIndicator.hide();
                    },
                    error: function (err) {
                        BusyIndicator.hide();
                        MessageBox.error(that.oBundle.getText("techError"), {
                            details: err
                        });

                    }
                })
            },
            /**
              * Method called on init() to get Terminal Details.
              * @public
              */
            getTerminalDetails: function () {
                var that = this;
                this.oDataModelT.callFunction("/getTerminalDetails", {
                    method: constants.httpGet,
                    success: function (oData) {

                        if (oData.getTerminalDetails.data.status !== undefined && oData.getTerminalDetails.data.status !== 200) {
                            MessageBox.error(oData.getTerminalDetails.data.message);
                        }
                        else {
                            var oDataTer = oData.getTerminalDetails.data, tokenArray = [];
                            for (var g = 0; g < oDataTer.length; g++) {
                                if (oDataTer[g].OnDemandJob === true) {
                                    var otokenD = oDataTer[g].Terminal;
                                    tokenArray.push(otokenD);
                                }
                            }
                            that.getView().byId("idMultiInputTerminal").setSelectedKeys(tokenArray);
                            that.getView().getModel("oModel").setProperty("/TerminalData", oData.getTerminalDetails.data);
                            that.getView().byId("idTitleTerminal").setText(that.oBundle.getText("comTerText", [oData.getTerminalDetails.data.length]));
                        }
                        BusyIndicator.hide();
                    },
                    error: function (err) {
                        BusyIndicator.hide();
                        MessageBox.error(err.message, {
                            details: err
                        });

                    }
                })
            },
            /**
              * Method called on init() to get Product Details.
              * @public
              */
            getProductDetails: function () {
                var that = this;
                this.oDataModelT.callFunction("/getOnPremProductDetails", {
                    method: constants.httpGet,
                    success: function (oData) {
                        if (oData.getOnPremProductDetails.data) {
                            that.getView().getModel("oModel").setProperty("/ProductData", oData.getOnPremProductDetails.data);
                            that.getView().byId("idTitleProduct").setText(that.oBundle.getText("comProText", [oData.getOnPremProductDetails.data.length]));
                        }
                        BusyIndicator.hide();
                    },
                    error: function (err) {
                        BusyIndicator.hide();
                        MessageBox.error(that.oBundle.getText("techError"), {
                            details: err
                        });

                    }
                })
            },
            /**
              * Method called on init() to get Customer Details.
              * @public
              */
            getCustomerDetails: function () {
                var that = this;
                this.oDataModelT.callFunction("/getCustomerDetails", {
                    method: constants.httpGet,
                    success: function (oData) {
                        var finalArray = [], tokenArray = [];
                        var oDataCust = oData.getCustomerDetails.data;
                        if (oDataCust) {
                            that.getView().byId("idTitleCustomer").setText(that.oBundle.getText("comCusText", [oData.getCustomerDetails.data.length]));
                            for (var a = constants.INTZERO; a < oDataCust.length; a++) {
                                var oEmailArray = oDataCust[a].EmailTo.split(constants.spliter), oArray = [];
                                for (var b = constants.INTZERO; b < oEmailArray.length; b++) {
                                    var obj = {}, oFirstTer = "", oFirstTerName = "", oFirstProd = "", oFirstProdName = "";
                                    obj.email = oEmailArray[b];
                                    oArray.push(obj);
                                }
                                if (oDataCust[a].TerminalList.results.length != constants.INTZERO) {
                                    oFirstTer = oDataCust[a].TerminalList.results[constants.INTZERO].Terminal;
                                    oFirstTerName = oDataCust[a].TerminalList.results[constants.INTZERO].TerminalName;
                                }
                                if (oDataCust[a].ProductList.results.length != constants.INTZERO) {
                                    oFirstProd = oDataCust[a].ProductList.results[constants.INTZERO].Product;
                                    oFirstProdName = oDataCust[a].ProductList.results[constants.INTZERO].ProductName;
                                }
                                if (oDataCust[a].OnDemandJob === true) {
                                    var otokenD = new sap.m.Token({ key: oDataCust[a].Customer + "/" + oDataCust[a].ShipTo, text: oDataCust[a].ShipToName + "(" + oDataCust[a].Customer + "/" + oDataCust[a].ShipTo + ")" });
                                    tokenArray.push(otokenD);
                                }

                                var objData = {};
                                objData = {
                                    "CountEmail": oDataCust[a].CountEmail,
                                    "CountProduct": oDataCust[a].CountProduct,
                                    "CountTerminal": oDataCust[a].CountTerminal,
                                    "CountShipTo": oDataCust[a].CountShipTo,
                                    "Customer": oDataCust[a].Customer,
                                    "CustomerName": oDataCust[a].CustomerName,
                                    "DailyJob": oDataCust[a].DailyJob,
                                    "EmailTo": oDataCust[a].EmailTo,
                                    "OnDemandJob": oDataCust[a].OnDemandJob,
                                    "ProductList": oDataCust[a].ProductList,
                                    "TerminalList": oDataCust[a].TerminalList,
                                    "ProductFirst": oFirstProd,
                                    "ProdNameFirst": oFirstProdName,
                                    "TerminalFirst": oFirstTer,
                                    "TerNameFirst": oFirstTerName,
                                    "ShipTo": oDataCust[a].ShipTo,
                                    "ShipToName": oDataCust[a].ShipToName,
                                    "EmailArray": oArray,
                                    "VHKey": oDataCust[a].Customer + "/" + oDataCust[a].ShipTo
                                }
                                finalArray.push(objData);
                            }
                            that.getView().byId("idMultiInputCustomer").setTokens(tokenArray);
                            that.getView().getModel("oModel").setProperty("/CustomerData", finalArray);
                            BusyIndicator.hide();
                        }
                    },
                    error: function (err) {

                        BusyIndicator.hide();
                        MessageBox.error(that.oBundle.getText("techError"), {
                            details: err
                        });
                    }
                })
            },
            /**
              * Method called on init() to get Customer F4 Details.
              * @public
              */
            getF4Customer: function () {
                var that = this;
                this.oDataModelT.callFunction("/getOnPremCustomerF4", {
                    method: constants.httpGet,
                    success: function (oData) {
                        that.getView().getModel("oModel").setProperty("/CustValHelp", oData.getOnPremCustomerF4.data);
                        BusyIndicator.hide();
                    },
                    error: function (err) {
                        BusyIndicator.hide();
                        MessageBox.error(that.oBundle.getText("techError"), {
                            details: err
                        });
                    }
                })
            },
            /**
              * Method called on init() to get Terminal F4 Details.
              * @public
              */
            getF4Terminal: function () {
                var that = this;
                this.oDataModelT.callFunction("/getOnPremTerminalF4", {
                    method: constants.httpGet,
                    success: function (oData) {
                        that.getView().getModel("oModel").setProperty("/TerminalValHelp", oData.getOnPremTerminalF4.data);
                        BusyIndicator.hide();
                    },
                    error: function (err) {
                        BusyIndicator.hide();
                        MessageBox.error(that.oBundle.getText("techError"), {
                            details: err
                        });
                    }
                })
            },
            /**
              * Method called on init() to get Product F4 Details.
              * @public
              */
            getF4Product: function () {
                var that = this;
                this.oDataModelT.callFunction("/getOnPremProductF4", {
                    method: constants.httpGet,
                    success: function (oData) {
                        that.getView().getModel("oModel").setProperty("/ProductValHelp", oData.getOnPremProductF4.data);
                        BusyIndicator.hide();
                    },
                    error: function (err) {
                        BusyIndicator.hide();
                        MessageBox.error(that.oBundle.getText("techError"), {
                            details: err
                        });
                    }
                })
            },
            /**
              * Method called on click of Delete button on Customer/Ship-To Table.
              * @public
              */
            onDeleteCustomer: function () {
                var oTable = this.getView().byId("idProductsTable"), that = this,
                    iDx = oTable.getSelectedContextPaths()[0];
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());
                var oTableData = this.getView().getModel("oModel").getProperty(iDx);
                if (itemIndex !== constants.INTNEGONE) {
                    var oItems = oTableData;
                    MessageBox.confirm(that.oBundle.getText("customerDeleted", [oItems.Customer, oItems.CustomerName, oItems.ShipTo, oItems.ShipToName]), {
                        onClose: function (oAction) {
                            if (oAction === constants.actionOK) {
                                BusyIndicator.show();
                                that.oDataModelT.callFunction("/deleteCustomer", {
                                    method: constants.httpPost,
                                    urlParameters: {
                                        customer: oItems.Customer,
                                        shipTo: oItems.ShipTo,
                                    },
                                    success: function (oData) {
                                        BusyIndicator.hide();
                                        if (oData.deleteCustomer.data.message !== undefined) {
                                            MessageBox.error(oData.deleteCustomer.data.message);
                                        }
                                        else {
                                            MessageToast.show(that.oBundle.getText("delSucc"));
                                            that.getCustomerDetails();
                                        }
                                    },
                                    error: function (err) {
                                        BusyIndicator.hide();
                                        var msg = err.message;
                                        MessageBox.error(msg, {
                                            details: err
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
                else {
                    MessageBox.error(that.oBundle.getText("delCheck"));

                }

            },
            /**
              * Method called on click of Delete button on Customer Pop-out Table
              * @public
              */
            onDeleteCustomerPopout: function () {
                var oTable = this.getView().byId("idTablePopout"), that = this,
                    iDx = oTable.getSelectedContextPaths()[0];
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());
                var oTableData = this.getView().getModel("oModel").getProperty(iDx);
                if (itemIndex !== constants.INTNEGONE) {
                    var oItems = oTableData;
                    MessageBox.confirm(that.oBundle.getText("customerDeleted", [oItems.Customer, oItems.CustomerName, oItems.ShipTo, oItems.ShipToName]), {
                        onClose: function (oAction) {
                            if (oAction === constants.actionOK) {
                                BusyIndicator.show();
                                that.oDataModelT.callFunction("/deleteCustomer", {
                                    method: constants.httpPost,
                                    urlParameters: {
                                        customer: oItems.Customer,
                                        shipTo: oItems.ShipTo,
                                    },
                                    success: function (oData) {
                                        BusyIndicator.hide();
                                        if (oData.deleteCustomer.data.message !== undefined) {
                                            MessageBox.error(oData.deleteCustomer.data.message);
                                        }
                                        else {
                                            MessageToast.show(that.oBundle.getText("delSucc"));
                                            that.getCustomerDetails();
                                        }
                                    },
                                    error: function (err) {
                                        BusyIndicator.hide();
                                        var msg = err.message;
                                        MessageBox.error(msg, {
                                            details: err
                                        });

                                    }
                                });
                            }
                        }
                    });
                }
                else {
                    MessageBox.error(that.oBundle.getText("delCheck"));

                }

            },
            /**
              * Method called on change Event of idSwitchInput to handle creation of Daily Job Schedule. 
              * @public
              * @param {sap.ui.base.Event} oEvent An Event object consisting of an ID, a source and a map of parameters
              */
            onSwtichChange: function (oEvent) {
                BusyIndicator.show();
                var oState = oEvent.getSource().getState(),
                    oDaily = this.getView().byId("idTimePickerInput").getValue();
                this.getJSStatus(oState, oDaily);
            },
            /**
              * Method called inside onSwitchChange 
              * @public
              */
            getJSStatus: function (oState, oDaily) {
                var that = this;
                this.oDataModelT.callFunction("/getJobDetails", {
                    method: constants.httpGet,
                    success: function (oData) {
                        var oDataArr2 = JSON.parse(oData.getJobDetails);
                        if (oDataArr2.sActive === true) {
                            BusyIndicator.hide();
                            if (oState === false) {
                                that.getView().byId("idSwitchInput").setState(true);
                            } else {
                                that.getView().byId("idSwitchInput").setState(false);
                            }
                            that.getView().byId("idInfoLabel").setText("Suspended");
                            that.getView().byId("idInfoLabel").setColorScheme(2);
                            MessageBox.error(that.oBundle.getText("susCheck"));
                        } else {
                            BusyIndicator.hide();
                            that.executeSchDaily(oState, oDaily);
                        }
                    },
                    error: function (err) {
                        BusyIndicator.hide();
                        MessageBox.error(that.oBundle.getText("techError"), {
                            details: err
                        });

                    }
                });
            },
            executeSchDaily: function (oState, oDaily) {
                var that = this;

                if (oState === false) {
                    this.getView().byId("idTimePickerInput").setEnabled(true);
                    this.getView().byId("idInfoLabel").setText("InActive");
                    this.getView().byId("idInfoLabel").setColorScheme(constants.INTONE);
                    //Delete Schedule
                    this.oDataModelT.callFunction("/deleteSchedule", {
                        method: constants.httpGet,
                        urlParameters: {
                            desc: constants.daily
                        },
                        success: function (oData) {
                            BusyIndicator.hide();
                        },
                        error: function (err) {
                            BusyIndicator.hide();
                            MessageBox.error(that.oBundle.getText("techError"), {
                                details: err
                            });

                        }
                    });
                } else {
                    if (oDaily !== "" && oDaily !== constants.SPACE && oDaily !== undefined) {
                        BusyIndicator.show();
                        var oDate = new Date(this.getView().byId("idTimePickerInput").getDateValue()),
                            dateH = oDate.getHours(),
                            dateM = (oDate.getMinutes() < constants.INTTEN ? constants.ZERO : '') + oDate.getMinutes(),
                            dateValue = new Date();
                        dateValue.setHours(dateH);
                        dateValue.setMinutes(dateM);
                        // Get dates for January and July
                        var dateJan = new Date(dateValue.getFullYear(), constants.INTZERO, constants.INTONE);
                        var dateJul = new Date(dateValue.getFullYear(), constants.INTSIX, constants.INTONE);
                        // Get timezone offset
                        var timezoneOffset = Math.max(dateJan.getTimezoneOffset(), dateJul.getTimezoneOffset());
                        if (dateValue.getTimezoneOffset() < timezoneOffset) {
                            // Adjust date by 5 hours
                            dateValue = new Date(dateValue.getTime() + ((constants.INTONE * constants.INTSIXTY * constants.INTSIXTY * constants.INTTHOUS) * constants.INTFIVE));
                        }
                        else {
                            // Adjust date by 6 hours
                            dateValue = new Date(dateValue.getTime() + ((constants.INTONE * constants.INTSIXTY * constants.INTSIXTY * constants.INTTHOUS) * constants.INTSIX));
                        }
                        var oMin = (dateValue.getMinutes() < constants.INTTEN ? constants.ZERO : '') + dateValue.getMinutes();
                        var oTime = dateValue.getHours() + constants.DIV + oMin;
                        this.getView().byId("idTimePickerInput").setEnabled(false);
                        this.getView().byId("idInfoLabel").setColorScheme(constants.INTSEVEN);
                        this.getView().byId("idInfoLabel").setText("Active");
                        this.getView().byId("idTextDailyST").setText(oDaily);
                        //Create Daily Schedule
                        this.oDataModelT.callFunction("/createSchedule", {
                            method: constants.httpGet,
                            urlParameters: {
                                time: oTime,
                                desc: constants.daily
                            },
                            success: function (oData) {
                                BusyIndicator.hide();
                                MessageBox.success(that.oBundle.getText("succJSDaily"));
                            },
                            error: function (err) {
                                BusyIndicator.hide();
                                MessageBox.error(that.oBundle.getText("techError"), {
                                    details: err
                                });

                            }
                        });
                    } else {
                        that.getView().byId("idSwitchInput").setState(false);
                        MessageBox.error(that.oBundle.getText("manTime"));
                    }
                }
            },
            /**
              * Method called for idMultiInputCustomer (Customer ID & Ship To Value Help) to fetch valuehelp dialog 
              * @public
              */
            onValueHelpRequested: function () {
                this._oBasicSearchField = new SearchField();
                this.oColModel = new JSONModel();
                var aCols = {
                    "cols": [
                        {
                            "label": this.oBundle.getText("customerID"), //"Customer ID"
                            "template": "Customer",
                            "iskey": true
                        },
                        {
                            "label": "Customer Name",
                            "template": "CustomerName"
                        },
                        {
                            "label": "Ship-To",
                            "template": "ShipTo",
                            "iskey": true
                        },
                        {
                            "label": "Ship-To Name",
                            "template": "ShipToName"
                        }
                    ]
                };
                this.oColModel.setData(aCols);
                this._oValueHelpDialogCust = sap.ui.xmlfragment(constants.fragmentCusVH, this);
                this.getView().addDependent(this._oValueHelpDialogCust);
                // Set Basic Search for FilterBar
                var oFilterBar = this._oValueHelpDialogCust.getFilterBar();
                oFilterBar.setFilterBarExpanded(false);
                oFilterBar.setBasicSearch(this._oBasicSearchField);

                // Trigger filter bar search when the basic search is fired
                this._oBasicSearchField.attachSearch(function () {
                    oFilterBar.search();
                });
                this.valueHelpModel = this.getView().getModel("oModel");
                this._oValueHelpDialogCust.getTableAsync().then(function (oTable) {
                    oTable.setModel(this.valueHelpModel);
                    oTable.setModel(this.oColModel, "columns");

                    if (oTable.bindRows) {
                        oTable.bindAggregation("rows", "/CustomerData");
                    }

                    if (oTable.bindItems) {
                        oTable.bindAggregation("items", "/CustomerData", function () {
                            return new ColumnListItem({
                                cells: aCols.map(function (column) {
                                    return new Label({ text: "{" + column.template + "}" });
                                })
                            });
                        });
                    }
                    this._oValueHelpDialogCust.update();
                }.bind(this));

                this._oValueHelpDialogCust.setTokens(this.getView().byId("idMultiInputCustomer").getTokens());
                this._oValueHelpDialogCust.open();
            },
            /**
              * Method called for idMultiInputCustomer (Customer ID & Ship To Value Help) 
              * @public
              * @param {sap.ui.base.Event} oEvent An Event object consisting of an ID, a source and a map of parameters
              */
            onValueHelpOkPress: function (oEvent) {
                var aTokens = oEvent.getParameter("tokens");
                this.getView().byId("idMultiInputCustomer").setTokens(aTokens);
                this._oValueHelpDialogCust.close();
            },
            onValueHelpCancelPress: function () {
                this._oValueHelpDialogCust.close();
            },
            onValueHelpAfterClose: function () {
                this._oValueHelpDialogCust.destroy();
            },
            /**
              * Method called for Fullscreen Pop-out for Customer/Ship-To Table
              * @public
              */
            handleTableSelectDialogPress: function () {
                var oView = this.getView();
                // that=this,
                // oCount=this.getView().getModel("oModel").getProperty("/CustomerData").length;
                if (!this.byId("custTable")) {
                    Fragment.load({
                        id: oView.getId(),
                        name: constants.fragmentCusTablePopout,
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        oDialog.open();
                        // var txt = that.oBundle.getText("comCusText", [oCount]);
                        // oDialog.setTitle(txt);
                    });
                } else {
                    this.byId("custTable").open();
                }

            },
            /**
              * Method called for Fullscreen Pop-out for Product Table
              * @public
              */
            handleProductTableSelectDialogPress: function () {
                var oView = this.getView();
                if (!this.byId("prodTable")) {
                    Fragment.load({
                        id: oView.getId(),
                        name: constants.fragmentProdTablePopout,
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        oDialog.open();

                    });
                } else {
                    this.byId("prodTable").open();
                }
            },
            /**
              * Method called for Fullscreen Pop-out for Terminal Table
              * @public
              */
            handleTerminalTableSelectDialogPress: function () {
                var oView = this.getView();
                if (!this.byId("terTable")) {
                    Fragment.load({
                        id: oView.getId(),
                        name: constants.fragmentTerTablePopout,
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        oDialog.open();
                    });
                } else {
                    this.byId("terTable").open();
                }
            },
            /**
              * Method called for email pop-over link on Customer/Ship-To Customer
              * @public
              * @param {sap.ui.base.Event} oEvent An Event object consisting of an ID, a source and a map of parameters
              */
            handleEmailPopoverPress: function (oEvent) {
                var oButton2 = oEvent.getSource(),
                    oView = this.getView(),
                    oB_ID = oEvent.getSource().getParent().getParent().getBindingContextPath(),
                    oCustData = this.getView().getModel("oModel").getProperty(oB_ID), //[oB_Indx],
                    oTempModel = new JSONModel();
                oTempModel.setData(oCustData.EmailArray);
                if (!this._pPopoverEmail) {
                    this._pPopoverEmail = Fragment.load({
                        id: oView.getId(),
                        name: constants.fragmentEmailPopover,
                        controller: this
                    }).then(function (oPopover) {
                        oView.addDependent(oPopover);
                        return oPopover;
                    });
                }
                this._pPopoverEmail.then(function (oPopover) {
                    oPopover.openBy(oButton2);
                    oPopover.setModel(oTempModel);
                });
            },
            /**
              * Method called for product pop-over link on Customer/Ship-To Customer
              * @public
              * @param {sap.ui.base.Event} oEvent An Event object consisting of an ID, a source and a map of parameters
              */
            handlePopoverPress: function (oEvent) {
                var oButton = oEvent.getSource(),
                    oView = this.getView(),
                    oB_ID = oEvent.getSource().getParent().getParent().getParent().getBindingContextPath(),
                    oCustData = this.getView().getModel("oModel").getProperty(oB_ID),
                    oTempModel = new JSONModel();
                oTempModel.setData(oCustData.ProductList);
                if (!this._pPopover) {
                    this._pPopover = Fragment.load({
                        id: oView.getId(),
                        name: constants.fragmentProdPopover,
                        controller: this
                    }).then(function (oPopover) {
                        oView.addDependent(oPopover);
                        return oPopover;
                    });
                }
                this._pPopover.then(function (oPopover) {
                    oPopover.openBy(oButton);
                    oPopover.setModel(oTempModel);
                });
            },
            handleTerPopoverPress: function (oEvent) {
                var oButton = oEvent.getSource(),
                    oView = this.getView(),
                    oB_ID = oEvent.getSource().getParent().getParent().getParent().getBindingContextPath(),
                    oCustData = this.getView().getModel("oModel").getProperty(oB_ID), 
                    oTempModel = new JSONModel();
                oTempModel.setData(oCustData.TerminalList);
                if (!this._tPopover) {
                    this._tPopover = Fragment.load({
                        id: oView.getId(),
                        name: constants.fragmentTerPopover,
                        controller: this
                    }).then(function (oPopover) {
                        oView.addDependent(oPopover);
                        return oPopover;
                    });
                }
                this._tPopover.then(function (oPopover) {
                    oPopover.openBy(oButton);
                    oPopover.setModel(oTempModel);
                });
            },
            /**
              * Method called on click of add button of add terminal
              * @public
              */
            handleTerminalSelectDialogPress: function () {
                var oView = this.getView();
                // create dialog lazily
                if (!this.byId("addTerminal")) {
                    // load asynchronous XML fragment
                    Fragment.load({
                        id: oView.getId(),
                        name: constants.fragmentAddTerminal,
                        controller: this
                    }).then(function (oDialog) {
                        // connect dialog to the root view
                        //of this component (models, lifecycle)
                        oView.addDependent(oDialog);
                        oDialog.open();
                        oDialog.setTitle("Add Terminal");
                        sap.ui.core.Fragment.byId(oView.getId(), "idTxtShCount").setText(constants.INTZERO);
                    });
                } else {
                    this.byId("addTerminal").open();
                    oDialog.setTitle("Add Terminal");
                }
            },
            onTerminalClose: function () {
                this.byId("addTerminal").close();
                this.byId("addTerminal").destroy();
            },
            /**
              * Method called on click of edit button of terminal
              * @public
              */
            handleEditTerminalSelectDialogPress: function () {
                var oTable = this.getView().byId("idTableTerminal"), that = this;
                var oTableData = this.getView().getModel("oModel").getProperty("/TerminalData");
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());
                if (itemIndex !== constants.INTNEGONE) {
                    var oItems = oTableData[itemIndex];
                    var oView = this.getView();
                    // create dialog lazily
                    if (!this.byId("addTerminal")) {
                        Fragment.load({
                            id: oView.getId(),
                            name: constants.fragmentAddTerminal,
                            controller: this
                        }).then(function (oDialog) {
                            oView.addDependent(oDialog);
                            oDialog.open();
                            oDialog.setTitle(that.oBundle.getText("editTerminal"));
                            var oInputTer = sap.ui.core.Fragment.byId(oView.getId(), "idInputTerminalID");
                            oInputTer.setEnabled(false);
                            sap.ui.core.Fragment.byId(oView.getId(), "idInputTerminalID").setValue(oItems.Terminal);
                            sap.ui.core.Fragment.byId(oView.getId(), "idInputTerminalName").setValue(oItems.TerminalName);
                            sap.ui.core.Fragment.byId(oView.getId(), "idTxtShCount").setText(oItems.ShiptoCount);
                            // sap.ui.core.Fragment.byId(oView.getId(), "idCheckBoxDaily").setSelected(oItems.DailyJob);
                            // sap.ui.core.Fragment.byId(oView.getId(), "idCheckBoxOnDemand").setSelected(oItems.OnDemandJob);
                        });
                    }
                }
                else {
                    MessageBox.error(that.oBundle.getText("selectTerminal"));
                }
            },
            /**
              * Method called on click of edit button of terminal pop-out table
              * @public
              */
            handleEditTerminalPopout: function () {
                var oTable = this.getView().byId("idTerTablePopout"), that = this;
                var oTableData = this.getView().getModel("oModel").getProperty("/TerminalData");
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());
                if (itemIndex !== constants.INTNEGONE) {
                    var oItems = oTableData[itemIndex];
                    var oView = this.getView();
                    // create dialog lazily
                    if (!this.byId("addTerminal")) {
                        Fragment.load({
                            id: oView.getId(),
                            name: constants.fragmentAddTerminal,
                            controller: this
                        }).then(function (oDialog) {
                            oView.addDependent(oDialog);
                            oDialog.open();
                            oDialog.setTitle(that.oBundle.getText("editTerminal"));
                            var oInputTer = sap.ui.core.Fragment.byId(oView.getId(), "idInputTerminalID");
                            oInputTer.setEnabled(false);
                            sap.ui.core.Fragment.byId(oView.getId(), "idInputTerminalID").setValue(oItems.Terminal);
                            sap.ui.core.Fragment.byId(oView.getId(), "idInputTerminalName").setValue(oItems.TerminalName);
                            sap.ui.core.Fragment.byId(oView.getId(), "idTxtShCount").setText(oItems.ShiptoCount);
                            // sap.ui.core.Fragment.byId(oView.getId(), "idCheckBoxDaily").setSelected(oItems.DailyJob);
                            // sap.ui.core.Fragment.byId(oView.getId(), "idCheckBoxOnDemand").setSelected(oItems.OnDemandJob);
                        });

                    }
                }
                else {
                    MessageBox.error(that.oBundle.getText("selectTerminal"));
                }
            },
            /**
              * Method called on click of add button of product table
              * @public
              */
            handleProductSelectDialogPress: function () {
                var oView = this.getView(), that = this;
                // create dialog lazily
                if (!this.byId("addProduct")) {
                    // load asynchronous XML fragment
                    Fragment.load({
                        id: oView.getId(),
                        name: constants.fragmentAddProd,
                        controller: this
                    }).then(function (oDialog) {
                        // connect dialog to the root view
                        //of this component (models, lifecycle)
                        oView.addDependent(oDialog);
                        oDialog.open();
                        oDialog.setTitle(that.oBundle.getText("addProduct"));
                    });
                } else {
                    this.byId("addProduct").open();
                    oDialog.setTitle(that.oBundle.getText("addProduct"));
                }
            },
            /**
               * Method called on click of edit button of product table
               * @public
               */
            handleEditProductSelectDialogPress: function () {
                var oTable = this.getView().byId("producttbl"), that = this;
                var oTableData = this.getView().getModel("oModel").getProperty("/ProductData");
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());
                if (itemIndex !== constants.INTNEGONE) {
                    var lineData = oTableData[itemIndex];
                    var oView = this.getView();
                    // create dialog lazily
                    if (!this.byId("addProduct")) {
                        // load asynchronous XML fragment
                        Fragment.load({
                            id: oView.getId(),
                            name: constants.fragmentAddProd,
                            controller: this
                        }).then(function (oDialog) {
                            // connect dialog to the root view
                            //of this component (models, lifecycle)
                            oView.addDependent(oDialog);
                            oDialog.open();
                            oDialog.setTitle(that.oBundle.getText("editProduct"));
                            var oProdID = sap.ui.core.Fragment.byId(oView.getId(), "idInputProductID");
                            var oProdName = sap.ui.core.Fragment.byId(oView.getId(), "idInputProductName");
                            oProdID.setValue(lineData.Product);
                            oProdID.setEnabled(false);
                            oProdName.setValue(lineData.ProductName);
                        });
                    } else {
                        this.byId("addProduct").open();
                        oDialog.setTitle(that.oBundle.getText("editProduct"));
                    }
                }
                else {
                    MessageBox.error(this.oBundle.getText("selectProduct"));
                }
            },
            /**
               * Method called on click of edit button of product pop-out table
               * @public
               */
            handleEditProductPopout: function () {
                var oTable = this.getView().byId("idProdTablePopout"), that = this;
                var oTableData = this.getView().getModel("oModel").getProperty("/ProductData");
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());
                if (itemIndex !== constants.INTNEGONE) {
                    var lineData = oTableData[itemIndex];
                    var oView = this.getView();
                    // create dialog lazily
                    if (!this.byId("addProduct")) {
                        // load asynchronous XML fragment
                        Fragment.load({
                            id: oView.getId(),
                            name: constants.fragmentAddProd,
                            controller: this
                        }).then(function (oDialog) {
                            // connect dialog to the root view
                            //of this component (models, lifecycle)
                            oView.addDependent(oDialog);
                            oDialog.open();
                            oDialog.setTitle(that.oBundle.getText("editProduct"));
                            var oProdID = sap.ui.core.Fragment.byId(oView.getId(), "idInputProductID");
                            var oProdName = sap.ui.core.Fragment.byId(oView.getId(), "idInputProductName");
                            oProdID.setValue(lineData.Product);
                            oProdID.setEnabled(false);
                            oProdName.setValue(lineData.ProductName);
                        });
                    } else {
                        this.byId("addProduct").open();
                        oDialog.setTitle(that.oBundle.getText("editProduct"));
                    }
                }
                else {
                    MessageBox.error(this.oBundle.getText("selectProduct"));
                }
            },
            onProductClose: function () {
                this.byId("addProduct").close();
                this.byId("addProduct").destroy();
            },
            /**
               * Method called on Close Event for pop-out Tables
               * @public
               */
            onClose: function () {
                this.byId("custTable").close();
            },
            onCloseProd: function () {
                this.byId("prodTable").close();
            },
            onCloseTer: function () {
                this.byId("terTable").close();
            },
            /**
               * Method called to Nav to createCust.View 
               * @public
               */
            onCreateCustomer: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RoutecreateView");
            },
            /**
               * Method called on search of Customer popout Table
               * @public
               * @param {sap.ui.base.Event} oEvent An Event object consisting of an ID, a source and a map of parameters
               */
            onSearchCustomerPop: function (oEvent) {
                var aFilters = [], aFiltersCombo = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > constants.INTZERO) {
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: constants.pathCus, operator: FilterOperator.Contains, value1: sQuery }),
                            new Filter({ path: constants.pathCName, operator: FilterOperator.Contains, value1: sQuery }),
                            new Filter({ path: constants.pathSH, operator: FilterOperator.Contains, value1: sQuery }),
                            new Filter({ path: constants.pathSHName, operator: FilterOperator.Contains, value1: sQuery })
                        ],
                        and: false
                    }));
                    aFiltersCombo.push(new Filter({
                        filters: aFilters,
                        and: true
                    }));
                }
                var oList = this.byId("idTablePopout");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFiltersCombo, "Application");


            },

            /**
               * Method called on search of Terminal popout Table
               * @public
                * @param {sap.ui.base.Event} oEvent An Event object consisting of an ID, a source and a map of parameters
               */
            onSearchTerminalPop: function (oEvent) {
                var aFilters = [], aFiltersCombo = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > constants.INTZERO) {
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: constants.pathTer, operator: FilterOperator.Contains, value1: sQuery }),
                            new Filter({ path: constants.pathTName, operator: FilterOperator.Contains, value1: sQuery })
                        ],
                        and: false
                    }));
                    aFiltersCombo.push(new Filter({
                        filters: aFilters,
                        and: true
                    }));
                }
                var oList = this.byId("idTerTablePopout");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFiltersCombo, "Application");
            },
            /**
               * Method called on search of Product popout Table
               * @public
                * @param {sap.ui.base.Event} oEvent An Event object consisting of an ID, a source and a map of parameters
               */
            onSearchProductPop: function (oEvent) {
                var aFilters = [], aFiltersCombo = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > constants.INTZERO) {
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: constants.pathProd, operator: FilterOperator.Contains, value1: sQuery }),
                            new Filter({ path: constants.pathProdName, operator: FilterOperator.Contains, value1: sQuery })
                        ],
                        and: false
                    }));
                    aFiltersCombo.push(new Filter({
                        filters: aFilters,
                        and: true
                    }));
                }
                // update list binding
                var oList = this.byId("idProdTablePopout");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFiltersCombo, "Application");
            },
            /**
               * Method called on edit for customer Table
               * @public
               */
            onEditCustomer: function () {
                var oTable = this.getView().byId("idProductsTable"), oArray = [];
                var itemIndex = oTable.getSelectedContextPaths()[0],
                    iDx = oTable.indexOfItem(oTable.getSelectedItem());
                if (iDx !== constants.INTNEGONE) {
                    var value = this.getView().getModel("oModel").getProperty(itemIndex);
                    var prodObj = [], terObj = [];
                    for (var g = constants.INTZERO; g < value.ProductList.results.length; g++) {
                        prodObj.push({
                            Product: value.ProductList.results[g].Product,
                            ProductName: value.ProductList.results[g].ProductName
                        });
                    }
                    for (var g = constants.INTZERO; g < value.TerminalList.results.length; g++) {
                        terObj.push({
                            Terminal: value.TerminalList.results[g].Terminal,
                            TerminalName: value.TerminalList.results[g].TerminalName
                        });
                    }
                    oArray.push({
                        Customer: value.Customer,
                        CustomerName: value.CustomerName,
                        ShipTo: value.ShipTo,
                        ShipToName: value.ShipToName,
                        ProductList: prodObj,
                        TerminalList: terObj,
                        EmailTo: value.EmailTo,
                        EmailArray: value.EmailArray,
                        DailyJob: value.DailyJob,
                        OnDemandJob: value.OnDemandJob
                    });
                    this.getView().getModel("oModel").setProperty("/selectedRow", oArray);
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteEditView", {
                        Data: "1"
                    });

                } else {
                    MessageBox.error(this.oBundle.getText("selectCustomerproceed"));

                }

            },
            /**
               * Method called on edit for customer pop-out Table
               * @public
               */
            onEditCustomerPopout: function () {
                var oTable = this.getView().byId("idTablePopout"), oArray = [];
                var itemIndex = oTable.getSelectedContextPaths()[0],
                    iDx = oTable.indexOfItem(oTable.getSelectedItem());
                if (iDx !== constants.INTNEGONE) {
                    // var value = this.getView().getModel("oModel").getProperty("/CustomerData")[itemIndex];
                    var value = this.getView().getModel("oModel").getProperty(itemIndex);
                    var prodObj = [], terObj = [];
                    for (var g = constants.INTZERO; g < value.ProductList.results.length; g++) {
                        prodObj.push({
                            Product: value.ProductList.results[g].Product,
                            ProductName: value.ProductList.results[g].ProductName
                        });
                    }
                    for (var g = constants.INTZERO; g < value.TerminalList.results.length; g++) {
                        terObj.push({
                            Terminal: value.TerminalList.results[g].Terminal,
                            TerminalName: value.TerminalList.results[g].TerminalName
                        });
                    }
                    oArray.push({
                        Customer: value.Customer,
                        CustomerName: value.CustomerName,
                        ShipTo: value.ShipTo,
                        ShipToName: value.ShipToName,
                        ProductList: prodObj,
                        TerminalList: terObj,
                        EmailTo: value.EmailTo,
                        EmailArray: value.EmailArray,
                        DailyJob: value.DailyJob,
                        OnDemandJob: value.OnDemandJob
                    });
                    this.getView().getModel("oModel").setProperty("/selectedRow", oArray);
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteEditView", {
                        Data: "1"
                    });

                } else {
                    MessageBox.error(this.oBundle.getText("selectCustomerproceed"));

                }

            },
            onValueProductAfterClose: function () {
                this.byId("addProduct").destroy();
            },
            /**
              * Method called to delete Terminal
              * @public
              */
            onDeleteTerminal: function () {
                var oTable = this.getView().byId("idTableTerminal"), that = this;
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());
                var oTableData = this.getView().getModel("oModel").getProperty("/TerminalData");
                if (itemIndex !== constants.INTNEGONE) {
                    var oItems = oTableData[itemIndex];
                    MessageBox.confirm(that.oBundle.getText("terminalDeleted", [oItems.Terminal, oItems.TerminalName]), {
                        onClose: function (oAction) {
                            if (oAction === constants.actionOK) {
                                BusyIndicator.show();
                                that.oDataModelT.callFunction("/deleteTerminal", {
                                    method: constants.httpPost,
                                    urlParameters: {
                                        terminal: oItems.Terminal
                                    },
                                    success: function (oData) {
                                        BusyIndicator.hide();
                                        if (oData.deleteTerminal.data.message !== undefined) {
                                            MessageBox.error(oData.deleteTerminal.data.message);
                                        }
                                        else {
                                            MessageToast.show(that.oBundle.getText("delSucc"));
                                            that.getTerminalDetails();
                                        }
                                    },
                                    error: function (err) {
                                        BusyIndicator.hide();
                                        var msg = JSON.parse(err.responseText).error.message.value;
                                        MessageBox.error(msg, {
                                            details: err
                                        });

                                    }
                                });
                            }
                        }
                    });
                }
                else {
                    MessageBox.error(that.oBundle.getText("delCheck"));

                }

            },
            /**
              * Method called to delete Product
              * @public
              * @param {sap.ui.base.Event} _evt An Event object consisting of an ID, a source and a map of parameters
              */
            onDeleteProduct: function (_evt) {
                var oTable = this.getView().byId("producttbl"), that = this;
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());
                var oTableData = this.getView().getModel("oModel").getProperty("/ProductData");
                if (itemIndex !== constants.INTNEGONE) {
                    var oItems = oTableData[itemIndex];
                    MessageBox.confirm(that.oBundle.getText("productDeleted", [oItems.Product, oItems.ProductName]), {
                        onClose: function (oAction) {
                            if (oAction === constants.actionOK) {
                                BusyIndicator.show();
                                that.oDataModelT.callFunction("/deleteProduct", {
                                    method: constants.httpPost,
                                    urlParameters: {
                                        product: oItems.Product
                                    },
                                    success: function (oData) {
                                        BusyIndicator.hide();
                                        if (oData.deleteProduct.data.message !== undefined) {
                                            MessageBox.error(oData.deleteProduct.data.message);
                                        }
                                        else {
                                            MessageToast.show(that.oBundle.getText("delSucc"));
                                            that.getProductDetails();
                                            that.getCustomerDetails();
                                        }
                                    },
                                    error: function (err) {
                                        BusyIndicator.hide();
                                        var msg = JSON.parse(err.responseText).error.message.value;
                                        MessageBox.error(msg, {
                                            details: err
                                        });

                                    }
                                });
                            }
                        }
                    });

                } else {
                    MessageBox.error(that.oBundle.getText("delCheck"));

                }
            },
            /**
              * Method called to delete Terminal pop-out table
              * @public
              * @param {sap.ui.base.Event} oEvent An Event object consisting of an ID, a source and a map of parameters
              */
            onDeleteTerminalPopout: function () {
                var oTable = this.getView().byId("idTerTablePopout"), that = this;
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());
                var oTableData = this.getView().getModel("oModel").getProperty("/TerminalData");
                if (itemIndex !== constants.INTNEGONE) {
                    var oItems = oTableData[itemIndex];
                    MessageBox.confirm(that.oBundle.getText("terminalDeleted", [oItems.Terminal, oItems.TerminalName]), {
                        onClose: function (oAction) {
                            if (oAction === constants.actionOK) {
                                BusyIndicator.show();
                                that.oDataModelT.callFunction("/deleteTerminal", {
                                    method: constants.httpPost,
                                    urlParameters: {
                                        terminal: oItems.Terminal
                                    },
                                    success: function (oData) {
                                        BusyIndicator.hide();
                                        if (oData.deleteTerminal.data.message !== undefined) {
                                            MessageBox.error(oData.deleteTerminal.data.message);
                                        }
                                        else {
                                            MessageToast.show(that.oBundle.getText("delSucc"));
                                            that.getTerminalDetails();
                                        }
                                    },
                                    error: function (err) {
                                        BusyIndicator.hide();
                                        var msg = JSON.parse(err.responseText).error.message.value;
                                        MessageBox.error(msg, {
                                            details: err
                                        });

                                    }
                                });
                            }
                        }
                    });
                } else {
                    MessageBox.error(that.oBundle.getText("delCheck"));
                }
            },
            /**
              * Method called to delete Product pop-out table
              * @public
              * @param {sap.ui.base.Event} _evt An Event object consisting of an ID, a source and a map of parameters
              */
            onDeleteProductPopout: function (_evt) {
                var oTable = this.getView().byId("idProdTablePopout"), that = this;
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());
                var oTableData = this.getView().getModel("oModel").getProperty("/ProductData");
                if (itemIndex !== constants.INTNEGONE) {

                    var oItems = oTableData[itemIndex];
                    MessageBox.confirm(that.oBundle.getText("productDeleted", [oItems.Product, oItems.ProductName]), {
                        onClose: function (oAction) {
                            if (oAction === constants.actionOK) {
                                BusyIndicator.show();
                                that.oDataModelT.callFunction("/deleteProduct", {
                                    method: constants.httpPost,
                                    urlParameters: {
                                        product: oItems.Product
                                    },
                                    success: function (oData) {
                                        BusyIndicator.hide();
                                        if (oData.deleteProduct.data.message !== undefined) {
                                            MessageBox.error(oData.deleteProduct.data.message);
                                        }
                                        else {
                                            MessageToast.show(that.oBundle.getText("delSucc"));
                                            that.getProductDetails();
                                            that.getCustomerDetails();
                                        }
                                    },
                                    error: function (err) {
                                        BusyIndicator.hide();
                                        var msg = JSON.parse(err.responseText).error.message.value;
                                        MessageBox.error(msg, {
                                            details: err
                                        });

                                    }
                                });
                            }
                        }
                    });
                } else {
                    MessageBox.error(that.oBundle.getText("delCheck"));
                }
            },
            /**
              * Method called to open CCEmail dialog
              * @public
              */
            onEmailCCSelectDialogPress: function () {
                var oView = this.getView(), aTokens = [],
                    oDataCC = oView.getModel("oModel").getProperty("/emailsCC");
                if (oDataCC) {
                    if (oDataCC[0] != '') {
                        for (var e = constants.INTZERO; e < oDataCC.length; e++) {
                            var otoken1 = new sap.m.Token({ key: oDataCC[e], text: oDataCC[e] });
                            aTokens.push(otoken1);
                        }
                    }
                }
                // create dialog lazily
                if (!this.byId("addEmail")) {
                    // load asynchronous XML fragment
                    Fragment.load({
                        id: oView.getId(),
                        name: constants.fragmentAddCCEmail,
                        controller: this
                    }).then(function (oDialog) {
                        // connect dialog to the root view
                        //of this component (models, lifecycle)
                        oView.addDependent(oDialog);
                        // oDialog.open();
                        var oMultiInput1 = sap.ui.core.Fragment.byId(oView.getId(), "multiInputemail");
                        oMultiInput1.setTokens(aTokens);
                        var fnValidator = function (args) {
                            var email = args.text;
                            var eArr = email.split('@');
                            var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
                            if (!mailregex.test(email) || eArr[constants.INTONE] !== "marathonpetroleum.com") {
                                oMultiInput1.setValueState(sap.ui.core.ValueState.Error);
                            } else {
                                oMultiInput1.setValueState(sap.ui.core.ValueState.None);
                                return new Token({ key: email, text: email });
                            }
                        };

                        oMultiInput1.addValidator(fnValidator);
                        oDialog.open();

                    });
                } else {
                    this.byId("addEmail").open();
                }
            },
            /**
              * Method called for validation of emailCC MultiInput
              * @public
              * @param {sap.ui.base.Event} oEvt An Event object consisting of an ID, a source and a map of parameters
              */
            onEmailChangeCC: function (oEvt) {
                var oMultiInput1 = this.getView().byId(oEvt.getSource().getId());
                var sVal = oEvt.getParameters().value;
                var fnValidator = function (args) {
                    var email = args.text;
                    var eArr = email.split('@');
                    var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
                    if (!mailregex.test(email)) {
                        oMultiInput1.setValueState(sap.ui.core.ValueState.Error);
                    } else {
                        oMultiInput1.setValueState(sap.ui.core.ValueState.None);
                        return new Token({ key: email, text: email });
                    }
                };
                if (sVal === "") {
                    oMultiInput1.setValueState(sap.ui.core.ValueState.None);
                }

                oMultiInput1.addValidator(fnValidator);


            },
            onCCEmailClose: function () {
                this.byId("addEmail").close();
                this.byId("addEmail").destroy();
            },
            /**
              * Method called to save CCEmails in S/4
              * @public
              */
            onCCEmailSave: function () {
                BusyIndicator.show();
                var oCCEmail = this.getView().byId("multiInputemail").getTokens(), oCCEmailString = "", that = this;
                if (oCCEmail.length !== constants.INTZERO) {
                    for (var j = constants.INTZERO; j < oCCEmail.length; j++) {
                        var objEmail = oCCEmail[j].getKey();
                        if (j === constants.INTZERO) {
                            oCCEmailString = objEmail;
                        } else {
                            oCCEmailString = oCCEmailString + constants.spliter + objEmail;
                        }
                    }
                }
                var jsonCC = {
                    "Key": constants.emailCC,
                    "Value": oCCEmailString
                }
                var oPayloadCC = JSON.stringify(jsonCC);
                this.oDataModelT.callFunction("/createCCEmail", {
                    method: constants.httpPost,
                    urlParameters: {
                        createData: oPayloadCC
                    },
                    success: function (oData) {

                        BusyIndicator.hide();
                        MessageBox.success(that.oBundle.getText("savedSucc"), {
                            onClose: function (sAction) {
                                if (sAction === MessageBox.Action.OK) {
                                    that.onCCEmailClose();
                                    that.getCCEmails();
                                }
                            }
                        });
                    },
                    error: function (err) {
                        BusyIndicator.hide();
                        MessageBox.error(that.oBundle.getText("techError"), {
                            details: err
                        });

                    }
                });

            },
            /**
              * Method called to handle Edit button for OnDemand Processing
              * @public
              */
            onPressEditOnDemand: function () {
                BusyIndicator.show();
                this.getJSStatusOnDemand();
            },
            getJSStatusOnDemand: function () {
                var that = this;
                this.oDataModelT.callFunction("/getJobDetails", {
                    method: constants.httpGet,
                    success: function (oData) {
                        BusyIndicator.hide();
                        var oDataArr2 = JSON.parse(oData.getJobDetails);
                        if (oDataArr2.sActive === true) {
                            that.getView().byId("idInfoLabel").setText("Suspended");
                            that.getView().byId("idInfoLabel").setColorScheme(2);
                            MessageBox.error(that.oBundle.getText("susCheck"));
                        } else {
                            that.getView().byId("idMultiInputCustomer").setEnabled(true);
                            that.getView().byId("idDatePickerOnDemand").setEnabled(true);
                            that.getView().byId("idMultiInputTerminal").setEnabled(true);
                            that.getView().byId("idButtonSave").setVisible(true);
                            that.getView().byId("idButtonCancel").setVisible(true);
                            that.getView().byId("idButtonEdit").setVisible(false);

                        }
                    },
                    error: function (err) {
                        BusyIndicator.hide();
                        MessageBox.error(that.oBundle.getText("techError"), {
                            details: err
                        });

                    }
                });
            },
            /**
              * Method called to handle cancel button for OnDemand Processing
              * @public
              */
            onPressCancelOnDemand: function () {
                this.getView().byId("idButtonSave").setVisible(false);
                this.getView().byId("idButtonCancel").setVisible(false);
                this.getView().byId("idButtonEdit").setVisible(true);
                this.getView().byId("idMultiInputCustomer").setEnabled(false);
                this.getView().byId("idDatePickerOnDemand").setEnabled(false);
                this.getView().byId("idMultiInputTerminal").setEnabled(false);
                this.getView().byId("idMultiInputCustomer").setValueState("None");
                this.getView().byId("idDatePickerOnDemand").setValueState("None");
                this.getView().byId("idMultiInputTerminal").setValueState("None");
                var r = this.getView().getModel("oModel").getProperty("/dateValue");
                this.getView().byId("idDatePickerOnDemand").setValue(r);
            },
            /**
              * Method called to handle Save button for OnDemand Processing
              * @public
              */
            onPressSaveOnDemand: function () {
                var oDate = this.getView().byId("idDatePickerOnDemand").getValue(),
                    that = this,
                    oStatus = this.getView().byId("idInfoLabel").getText(),
                    oCust = this.getView().byId("idMultiInputCustomer").getTokens(),
                    oTer = this.getView().byId("idMultiInputTerminal").getSelectedItems(),
                    oTer2 = this.getView().byId("idMultiInputTerminal").getSelectedKeys(),
                    checkTer = this.getView().byId("idMultiInputTerminal").getValueState(),
                    checkCus = this.getView().byId("idMultiInputCustomer").getValueState(),
                    checkDate = this.getView().byId("idDatePickerOnDemand").getValueState(),
                    xLen = oDate.length - 21,
                    result = oDate.slice(constants.INTZERO, xLen),
                    dateValue = new Date(result);
                // Get dates for January and July
                var dateJan = new Date(dateValue.getFullYear(), constants.INTZERO, constants.INTONE);
                var dateJul = new Date(dateValue.getFullYear(), constants.INTSIX, constants.INTONE);
                // Get timezone offset
                var timezoneOffset = Math.max(dateJan.getTimezoneOffset(), dateJul.getTimezoneOffset());
                if (dateValue.getTimezoneOffset() < timezoneOffset) {
                    // Adjust date by 5 hours
                    dateValue = new Date(dateValue.getTime() + ((constants.INTONE * constants.INTSIXTY * constants.INTSIXTY * constants.INTTHOUS) * constants.INTFIVE));
                }
                else {
                    // Adjust date by 6 hours
                    dateValue = new Date(dateValue.getTime() + ((constants.INTONE * constants.INTSIXTY * constants.INTSIXTY * constants.INTTHOUS) * constants.INTSIX));
                }
                var xTime = dateValue.toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                }),
                    onDemand = dateValue.toDateString().slice(4) + constants.SPACE + xTime;
                if (oStatus !== "Suspended") {
                    if ((oDate !== "" && oDate !== constants.SPACE && oDate !== undefined) && oCust.length !== constants.INTZERO && oTer.length !== constants.INTZERO) {
                        if (checkTer !== constants.ERROR || checkCus !== constants.ERROR || checkDate !== constants.ERROR) {
                            this.getView().byId("idMultiInputCustomer").setEnabled(false);
                            this.getView().byId("idDatePickerOnDemand").setEnabled(false);
                            this.getView().byId("idMultiInputTerminal").setEnabled(false);
                            this.getView().byId("idButtonSave").setVisible(false);
                            this.getView().byId("idButtonCancel").setVisible(false);
                            this.getView().byId("idButtonEdit").setVisible(true);
                            this.getView().byId("idTextOnDemandST").setText(result);
                            this.getView().getModel("oModel").setProperty("/dateValue", result);
                            var oJsonData = this.getPayloadJson(oCust, oTer2);

                            this.oDataModelT.callFunction("/createOnDemandSchedule", {
                                method: constants.httpGet,
                                urlParameters: {
                                    time: onDemand,
                                    desc: constants.onDemand
                                },
                                success: function (oData) {
                                    BusyIndicator.hide();
                                    if (oData.createOnDemandSchedule) {
                                        that.updateOndemandData(oJsonData);
                                        MessageBox.success(that.oBundle.getText("succJSOD"));
                                        that.getCustomerDetails();
                                        that.getTerminalDetails();
                                    }

                                },
                                error: function (err) {
                                    BusyIndicator.hide();
                                    MessageBox.error(that.oBundle.getText("techError"), {
                                        details: err
                                    });

                                }
                            });

                        }
                    } else {

                        MessageBox.error(that.oBundle.getText("errormsgrequired"));
                    }
                } else {
                    MessageBox.error(that.oBundle.getText("susCheck"));
                }
            },
            /**
              * Method called in onPressSaveOnDemand to create Payload
              * @public
              */
            getPayloadJson: function (oCust, oTer2) {

                var oCustArray = [], oTerArray = [];
                for (var i = constants.INTZERO; i < oCust.length; i++) {
                    var len = oCust[i].getText().split('('),
                        key = oCust[i].getKey().split('/');
                    var obj = {
                        "Customer": key[0],
                        "ShipTo": key[1]
                    };
                    oCustArray.push(obj);
                }
                for (var i = constants.INTZERO; i < oTer2.length; i++) {
                    var objTer = {
                        "Terminal": oTer2[i]
                    };
                    oTerArray.push(objTer);
                }
                var oJsonData = {
                    "Customer": oCustArray,
                    "Terminal": oTerArray
                };
                return oJsonData
            },
            /**
              * Method called in onPressSaveOnDemand to update S/4
              * @public
              */
            updateOndemandData: function (oJsonData) {
                var that = this;
                var oPayloadOnD = JSON.stringify(oJsonData)
                this.oDataModelT.callFunction("/updateOnDemand", {
                    method: constants.httpPost,
                    urlParameters: {
                        createData: oPayloadOnD
                    },
                    success: function (oData) {
                        BusyIndicator.hide();
                    },
                    error: function (err) {
                        BusyIndicator.hide();
                        MessageBox.error(that.oBundle.getText("techError"), {
                            details: err
                        });

                    }
                });
            },
            /**
              * Method called to handle Edit button for Suspend
              * @public
              */
            onPressSuspendEdit: function () {
                this.getView().byId("idDatePickerSuspend").setEnabled(true);
                this.getView().byId("idDatePicker2Suspend").setEnabled(true);
                this.getView().byId("idButtonSuspendSave").setVisible(true);
                this.getView().byId("idButtonSuspendCancel").setVisible(true);
                this.getView().byId("idButtonSuspendEdit").setVisible(false);
            },
            /**
              * Method called to handle Cancel button for Suspend
              * @public
              */
            onPressSuspendClear: function () {
                this.getView().byId("idButtonSuspendCancel").setVisible(false);
                this.getView().byId("idButtonSuspendSave").setVisible(false);
                this.getView().byId("idButtonSuspendEdit").setVisible(true);
                this.getView().byId("idDatePickerSuspend").setEnabled(false);
                this.getView().byId("idDatePicker2Suspend").setEnabled(false);
                this.getView().byId("idDatePicker2Suspend").setValueState("None");
                this.getView().byId("idDatePicker2Suspend").setValueState("None");
                var rFrom = this.getView().getModel("oModel").getProperty("/dateValueF"),
                    rTo = this.getView().getModel("oModel").getProperty("/dateValueT");
                this.getView().byId("idDatePickerSuspend").setValue(rFrom);
                this.getView().byId("idDatePicker2Suspend").setValue(rTo);

            },
            /**
              * Method called to handle Save button for Suspend
              * @public
              */
            onPressSuspendSave: function () {
                var oDateSuspendFrom = this.getView().byId("idDatePickerSuspend").getValue(),
                    oDateSuspendTo = this.getView().byId("idDatePicker2Suspend").getValue(),
                    checkVSF = this.getView().byId("idDatePickerSuspend").getValueState(),
                    checkVST = this.getView().byId("idDatePicker2Suspend").getValueState(),
                    oArr = [], that = this,
                    len = oDateSuspendTo.length - 21,
                    lenF = oDateSuspendFrom.length - 21,
                    resultTo = oDateSuspendTo.substring(0, len),
                    resultFrom = oDateSuspendFrom.substring(0, lenF),
                    oSusFrom = new Date(resultFrom),
                    oSusTo = new Date(resultTo),
                    // Get dates for January and July
                    dateJanF = new Date(oSusFrom.getFullYear(), constants.INTZERO, constants.INTONE),
                    dateJulF = new Date(oSusFrom.getFullYear(), constants.INTSIX, constants.INTONE),
                    dateJanT = new Date(oSusTo.getFullYear(), constants.INTZERO, constants.INTONE),
                    dateJulT = new Date(oSusTo.getFullYear(), constants.INTSIX, constants.INTONE);
                // Get timezone offset
                var timezoneOffsetFrom = Math.max(dateJanF.getTimezoneOffset(), dateJulF.getTimezoneOffset());
                var timezoneOffsetTo = Math.max(dateJanT.getTimezoneOffset(), dateJulT.getTimezoneOffset());
                if (oSusFrom.getTimezoneOffset() < timezoneOffsetFrom) {
                    // Adjust date by 5 hours
                    oSusFrom = new Date(oSusFrom.getTime() + ((constants.INTONE * constants.INTSIXTY * constants.INTSIXTY * constants.INTTHOUS) * constants.INTFIVE));
                }
                else {
                    // Adjust date by 6 hours
                    oSusFrom = new Date(oSusFrom.getTime() + ((constants.INTONE * constants.INTSIXTY * constants.INTSIXTY * constants.INTTHOUS) * constants.INTSIX));
                }
                if (oSusTo.getTimezoneOffset() < timezoneOffsetTo) {
                    // Adjust date by 5 hours
                    oSusTo = new Date(oSusTo.getTime() + ((constants.INTONE * constants.INTSIXTY * constants.INTSIXTY * constants.INTTHOUS) * constants.INTFIVE));
                }
                else {
                    // Adjust date by 6 hours
                    oSusTo = new Date(oSusTo.getTime() + ((constants.INTONE * constants.INTSIXTY * constants.INTSIXTY * constants.INTTHOUS) * constants.INTSIX));
                }
                var xSuspendTo = oSusTo.toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                }),
                    SuspendTo = oSusTo.toDateString().slice(4) + constants.SPACE + xSuspendTo,
                    // SuspendTo = oSusTo.toDateString() + oSusTo.toString().substring(xSuspendTo, xSuspendTo + constants.INTNINE),
                    xSuspendFrom = oSusFrom.toLocaleString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                    }),
                    SuspendFrom = oSusFrom.toDateString().slice(4) + constants.SPACE + xSuspendFrom;


                if ((oDateSuspendTo !== "" && oDateSuspendTo !== constants.SPACE && oDateSuspendTo !== undefined) && (oDateSuspendFrom !== "" && oDateSuspendFrom !== constants.SPACE && oDateSuspendFrom !== undefined)) {

                    if (checkVSF !== constants.ERROR || checkVST !== constants.ERROR) {
                        this.getView().byId("idDatePickerSuspend").setEnabled(false);
                        this.getView().byId("idDatePicker2Suspend").setEnabled(false);
                        this.getView().byId("idButtonSuspendSave").setVisible(false);
                        this.getView().byId("idButtonSuspendEdit").setVisible(true);
                        this.getView().byId("idButtonSuspendCancel").setVisible(false);
                        this.getView().byId("idObjStatusS1").setText(resultFrom);
                        this.getView().byId("idObjStatusS2").setText(resultTo);
                        this.getView().getModel("oModel").setProperty("/dateValueF", resultFrom);
                        this.getView().getModel("oModel").setProperty("/dateValueT", resultTo);
                        oArr.push({
                            "time": SuspendFrom,
                            "Desc": "SUSPENDFROM"
                        });
                        oArr.push({
                            "time": SuspendTo,
                            "Desc": "SUSPENDTO"
                        });
                        var oPayloadSus = JSON.stringify(oArr);
                        this.oDataModelT.callFunction("/createSuspendSchedule", {
                            method: constants.httpGet,
                            urlParameters: {
                                time: oPayloadSus,
                                desc: constants.suspend
                            },
                            success: function (oData) {
                                BusyIndicator.hide();
                                MessageBox.success(that.oBundle.getText("succJSSus"));
                                // window.location.reload()

                            },
                            error: function (err) {
                                BusyIndicator.hide();
                                MessageBox.error(that.oBundle.getText("techError"), {
                                    details: err
                                });

                            }
                        });
                    }
                } else {
                    BusyIndicator.hide();
                    MessageBox.error(that.oBundle.getText("errormsgrequired"));
                }

            },
            /**
              * Method called to change events for Suspend To
              * @public
              */
            onhandleChangeDP1Suspend: function () {
                var oDateSuspendTo = this.getView().byId("idDatePickerSuspend").getDateValue(),
                    oDateSuspendFrom = this.getView().byId("idDatePicker2Suspend").getDateValue();
                if (oDateSuspendFrom <= oDateSuspendTo) {
                    this.getView().byId("idDatePicker2Suspend").setValueState("Error");
                }
                else {
                    this.getView().byId("idDatePicker2Suspend").setValueState("None");
                }
            },
            /**
              * Method called to change events for Suspend From
              * @public
              */
            onhandleChangeDP2Suspend: function () {
                var oDateSuspendTo = this.getView().byId("idDatePickerSuspend").getDateValue(),
                    oDateSuspendFrom = this.getView().byId("idDatePicker2Suspend").getDateValue();
                if (oDateSuspendFrom <= oDateSuspendTo) {
                    this.getView().byId("idDatePicker2Suspend").setValueState("Error");
                } else if (oDateSuspendTo === null) {
                    this.getView().byId("idDatePicker2Suspend").setValueState("Error");
                }
                else {
                    this.getView().byId("idDatePicker2Suspend").setValueState("None");
                }
            },
            onhandleDateCheck: function (oEvent) {
                var oDTP = oEvent.getSource(),
                    sValue = oEvent.getParameter("value"),
                    bValid = oEvent.getParameter("valid");
                var selectedDate = new Date(sValue);
                var now = new Date(),
                    cDate = now.toLocaleString("en-US", {
                        timeZone: "America/Mexico_City",
                    });
                cDate = new Date(cDate);
                if (bValid) {
                    oDTP.setValueState("None");
                } else if (selectedDate < cDate) {
                    oDTP.setValueState("Error");
                    MessageBox.error(this.oBundle.getText("dateError"));
                }
            },
            /**
        * Method to open Terminal value help 
        * @public
        */
            onHandleValueHelpTerminal: function () {
                var oView = this.getView();
                // create dialog lazily
                if (!this.byId("idDialogTerminalF4")) {
                    // load asynchronous XML fragment
                    Fragment.load({
                        id: oView.getId(),
                        name: constants.fragmentTerF4,
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        oDialog.open();
                    });
                } else {
                    this.byId("idDialogTerminalF4").open();
                }
            },
            _handleValueHelpClose: function () {
                this.byId("idDialogTerminalF4").close();
                this.byId("idDialogTerminalF4").destroy();
            },
            _handleValueHelpOKTerminal: function (oEvt) {
                var oBinding = oEvt.getSource().getBinding("items");
                oBinding.filter([]);
                var aContexts = oEvt.getParameter("selectedContexts");
                if (aContexts && aContexts.length) {
                    this.getView().byId("idInputTerminalID").setValue(aContexts.map(function (oContext) { return oContext.getObject().Terminal; }));
                    this.getView().byId("idInputTerminalName").setValue(aContexts.map(function (oContext) { return oContext.getObject().Terminalname; }));
                }
            },
            /**
            * Method to Save Terminal data to S/4
            * @public
            */
            onPressTerminalSave: function () {
                var oTerID = this.getView().byId("idInputTerminalID").getValue(),
                    oTerName = this.getView().byId("idInputTerminalName").getValue(), oJsonData,
                    isEnabled = this.getView().byId("idInputTerminalID").getEnabled(),
                    oSHCount= this.getView().byId("idTxtShCount").getText(),
                    // oDaily = this.getView().byId("idCheckBoxDaily").getSelected(),
                    // oDemand = this.getView().byId("idCheckBoxOnDemand").getSelected(),
                    that = this;

                if (oTerID !== "" && oTerName !== "") {
                    BusyIndicator.show();
                    oJsonData = {
                        "Terminal": oTerID,
                        "TerminalName": oTerName
                        // "ShiptoCount" : oSHCount
// "                        "DailyJob": oDaily,
//                         "OnDemandJob": oDemand"
                    }
                    var oPayloadTer = JSON.stringify(oJsonData)
                    if (isEnabled === true) {
                        this.oDataModelT.callFunction("/createTerminal", {
                            method: constants.httpPost,
                            urlParameters: {
                                createData: oPayloadTer
                            },
                            success: function (oData) {
                                BusyIndicator.hide();
                                if (oData.createTerminal.data.status !== undefined && oData.createTerminal.data.status !== 200) {
                                    MessageBox.error(oData.createTerminal.data.message);
                                }
                                else {
                                    MessageBox.success(that.oBundle.getText("terminalCreated", [oData.createTerminal.data.Terminal]), {
                                        onClose: function (sAction) {
                                            if (sAction === MessageBox.Action.OK) {
                                                that.onTerminalClose();
                                                that.getTerminalDetails();
                                            }
                                        }
                                    });
                                }
                            },
                            error: function (err) {
                                BusyIndicator.hide();
                                // MessageBox.error(that.oBundle.getText("techError"), {
                                //     details: err
                                // });
                                var msg = err.message;
                                MessageBox.error(msg, {
                                    details: err
                                });

                            }
                        });
                    }
                    else {
                        var that = this;
                        this.oDataModelT.callFunction("/updateTerminal", {
                            method: constants.httpPost,
                            urlParameters: {
                                createData: oPayloadTer,
                                terminal: oTerID,
                            },

                            success: function (oData) {
                                BusyIndicator.hide();
                                if (oData.updateTerminal.data.status !== undefined && oData.updateTerminal.data.status !== 200) {
                                    MessageBox.error(oData.updateTerminal.data.message);
                                }
                                else {
                                    MessageBox.success(that.oBundle.getText("savedSucc"));
                                    that.onTerminalClose();
                                    that.getTerminalDetails();
                                }

                            },
                            error: function (err) {
                                BusyIndicator.hide();
                                var msg = err.message;
                                MessageBox.error(msg, {
                                    details: err
                                });
                            }
                        });
                    }

                } else {
                    MessageBox.error(that.oBundle.getText("errormsgrequired"));
                }
            },
            /**
              * Method to open productVH fargment
              * @public
              */
            onHandleValueHelpProduct: function () {
                var oView = this.getView();
                // create dialog lazily
                this._oValueHelpDialogListProd = sap.ui.xmlfragment(constants.fragmentProdF4, this);
                oView.addDependent(this._oValueHelpDialogListProd);
                this._oValueHelpDialogListProd.open();
            },
            _handleValueHelpCloseProduct: function () {
                this._oValueHelpDialogListProd.close();
                // this.byId("idDialogProductF4").destroy();
            },
            _handleValueHelpOKProduct: function (oEvt) {
                var oBinding = oEvt.getSource().getBinding("items");
                oBinding.filter([]);
                var aContexts = oEvt.getParameter("selectedContexts");
                if (aContexts && aContexts.length) {
                    this.getView().byId("idInputProductID").setValue(aContexts.map(function (oContext) { return oContext.getObject().Product; }));
                    this.getView().byId("idInputProductName").setValue(aContexts.map(function (oContext) { return oContext.getObject().ProductName; }));
                }
            },
            /**
              * Method to Save product details to S/4
              * @public
              */
            onPressProductSave: function () {

                var oProdID = this.getView().byId("idInputProductID").getValue(),
                    oProdName = this.getView().byId("idInputProductName").getValue(), oPayloadPro, oJsonData,
                    oInputStatus = this.getView().byId("idInputProductID").getEnabled();
                var that = this;
                if (oProdID !== "" && oProdName !== "") {
                    BusyIndicator.show();
                    oJsonData = {
                        "Product": oProdID,
                        "ProductName": oProdName
                    }
                    var oPayloadPro = JSON.stringify(oJsonData)
                    if (oInputStatus === true) {
                        this.oDataModelT.callFunction("/createProduct", {
                            method: constants.httpPost,
                            urlParameters: {
                                createData: oPayloadPro
                            },
                            success: function (oData) {
                                BusyIndicator.hide();
                                if (oData.createProduct.data.status !== undefined && oData.createProduct.data.status !== 200) {
                                    MessageBox.error(oData.createProduct.data.message);
                                }
                                else {
                                    MessageBox.success(that.oBundle.getText("productCreated", [oData.createProduct.data.Product]), { //
                                        onClose: function (sAction) {
                                            if (sAction === MessageBox.Action.OK) {
                                                that.onProductClose();
                                                that.getProductDetails();
                                            }
                                        }
                                    });
                                }

                            },
                            error: function (err) {
                                BusyIndicator.hide();
                                var msg = err.message;
                                MessageBox.error(msg, {
                                    details: err
                                });

                            }
                        });
                    }
                    else {
                        this.oDataModelT.callFunction("/updateProduct", {
                            method: constants.httpPost,
                            urlParameters: {
                                createData: oPayloadPro,
                                product: oProdID,
                            },
                            success: function (oData) {
                                BusyIndicator.hide();
                                if (oData.updateProduct.data.status !== undefined && oData.updateProduct.data.status !== 200) {
                                    MessageBox.error(oData.updateProduct.data.message);
                                }
                                else {
                                    MessageBox.success(that.oBundle.getText("savedSucc"));
                                    that.onProductClose();
                                    that.getProductDetails();
                                }

                            },
                            error: function (err) {
                                BusyIndicator.hide();
                                var msg = err.message;
                                MessageBox.error(msg, {
                                    details: err
                                });
                            }
                        });
                    }

                } else {

                    MessageBox.error(that.oBundle.getText("errormsgrequired"));
                }
            },
            /*
                    * Method for  customerVH fargment filter bar 
                    * @public
                    * @param {sap.ui.base.Event} oEvent An Event object consisting of an ID, a source and a map of parameter
                    */
            onFilterBarSearch: function (oEvent) {
                var sSearchQuery = this._oBasicSearchField.getValue(),
                    aSelectionSet = oEvent.getParameter("selectionSet");
                var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                    if (oControl.getValue()) {
                        switch (oControl.getName()) {
                            case constants.filterCUSID:
                                aResult.push(new Filter({
                                    path: constants.pathCus,
                                    operator: FilterOperator.Contains,
                                    value1: oControl.getValue()
                                }));
                                break;
                            case constants.filterSH:
                                aResult.push(new Filter({
                                    path: constants.pathSH,
                                    operator: FilterOperator.Contains,
                                    value1: oControl.getValue()
                                }));
                                break;
                            case constants.filterName:
                                aResult.push(new Filter({
                                    path: constants.pathCName,
                                    operator: FilterOperator.Contains,
                                    value1: oControl.getValue()
                                }));
                                break;
                        }
                    }
                    return aResult;
                }, []);
                aFilters.push(new Filter({
                    filters: [
                        new Filter({ path: constants.pathCus, operator: FilterOperator.Contains, value1: sSearchQuery }),
                        new Filter({ path: constants.pathCName, operator: FilterOperator.Contains, value1: sSearchQuery }),
                        new Filter({ path: constants.pathSH, operator: FilterOperator.Contains, value1: sSearchQuery }),
                        new Filter({ path: constants.pathSHName, operator: FilterOperator.Contains, value1: sSearchQuery })
                    ],
                    and: false
                }));
                this._filterTable(new Filter({
                    filters: aFilters,
                    and: true
                }));
            },
            _filterTable: function (oFilter) {
                var oVHD = this._oValueHelpDialogCust;
                oVHD.getTableAsync().then(function (oTable) {
                    if (oTable.bindRows) {
                        oTable.getBinding("rows").filter(oFilter);
                    }
                    if (oTable.bindItems) {
                        oTable.getBinding("items").filter(oFilter);
                    }
                    // This method must be called after binding update of the table.
                    oVHD.update();
                });
            },
            /**
        * Method for  customerVH fargment filter bar 
        * @public
        * @param {sap.ui.base.Event} oEvent An Event object consisting of an ID, a source and a map of parameter
        */
            _handleValueHelpSearchTerminal: function (oEvent) {
                var sQuery = oEvent.getParameter("value"), aFilters = [], aFiltersCombo = [];
                if (sQuery && sQuery.length > constants.INTZERO) {
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: constants.pathTer, operator: FilterOperator.Contains, value1: sQuery }),
                            new Filter({ path: constants.pathTername, operator: FilterOperator.Contains, value1: sQuery })
                        ],
                        and: false
                    }));
                    aFiltersCombo.push(new Filter({
                        filters: aFilters,
                        and: true
                    }));
                }
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([aFiltersCombo]);
            },
            /**
        * Method for  customerVH fargment filter bar 
        * @public
        * @param {sap.ui.base.Event} oEvent An Event object consisting of an ID, a source and a map of parameter
        */
            _handleValueHelpSearchProduct: function (oEvent) {
                var sQuery = oEvent.getParameter("value"), aFilters = [], aFiltersCombo = [];
                if (sQuery && sQuery.length > constants.INTZERO) {
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: constants.pathProd, operator: FilterOperator.Contains, value1: sQuery }),
                            new Filter({ path: constants.pathProdName, operator: FilterOperator.Contains, value1: sQuery })
                        ],
                        and: false
                    }));
                    aFiltersCombo.push(new Filter({
                        filters: aFilters,
                        and: true
                    }));
                }
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([aFiltersCombo]);
            },
            getGroup: function (oContext) {
                // return oContext.getProperty('Customer'); 
                var gKey = oContext.getProperty("Customer"),
                    gTitle = gKey + " " + oContext.getProperty("CustomerName");
                // var gEmail = oContext.getProperty("CPECond") + "/" + oContext.getProperty("CPECondName");
                return {
                    key: gTitle,
                    title: oContext.getProperty("CountShipTo").trim()
                };
            },
            getGroupHeader: function (oGroup) {

                var oTitleTxt = this.oBundle.getText("TABLE_GROUP_HEADER");
                return new sap.m.GroupHeaderListItem({
                    title: oGroup.key,
                    count: oGroup.title
                    // title:oTitleTxt
                    // type:"Detail"
                    // title:"<a href>link text</a>"
                })
            },
            onPressUnbind: function (oEvt) {
                debugger;
             
                var oPath = oEvt.oSource.getParent().getBindingContextPath(), that = this,
                    oData = this.getView().getModel("oModel").getProperty(oPath);
                MessageBox.confirm(that.oBundle.getText("unBindconfirm", [oData.Terminal, oData.TerminalName]), {
                    onClose: function (oAction) {
                        if (oAction === constants.actionOK) {
                            BusyIndicator.show();
                            var jsonData = {
                                "Terminal" : oData.Terminal,
                                "RemoveShipto" : true
                                };
                               var oPayload = JSON.stringify(jsonData);
                            that.oDataModelT.callFunction("/unbindShipTo", {
                                method: constants.httpPost,
                                urlParameters: {
                                    createData: oPayload,
                                    terminal:oData.Terminal
                                  
                                },
                                success: function (oData) {
                                    BusyIndicator.hide();
                                    if (oData.unbindShipTo.data.message !== undefined) {
                                        MessageBox.error(oData.unbindShipTo.data.message);
                                    }
                                    else {
                                        MessageToast.show(that.oBundle.getText("terminalunBind"), [oData.unbindShipTo.data.Terminal]);
                                        that.getTerminalDetails();
                                        that.getCustomerDetails();
                                    }
                                },
                                error: function (err) {
                                    BusyIndicator.hide();
                                    var msg = err.message;
                                    MessageBox.error(msg, {
                                        details: err
                                    });

                                }

                            });
                        }
                    }
                });
            },
            onUnbindTerminal: function (oEvt) {
                var oTable = this.getView().byId("idTableTerminal"), that = this;
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());
                // var oPath = oEvt.oSource.getParent().getBindingContextPath(),
                if (itemIndex !== constants.INTNEGONE) { 
                    var  oData = this.getView().getModel("oModel").getProperty("/TerminalData")[itemIndex];
                    // oData = oPath[itemIndex];
                    if(oData.ShiptoCount !== constants.INTZERO){
                    MessageBox.confirm(that.oBundle.getText("unBindconfirm", [oData.Terminal, oData.TerminalName]), {
                        onClose: function (oAction) {
                            if (oAction === constants.actionOK) {
                                BusyIndicator.show();
                                var jsonData = {
                                    "Terminal" : oData.Terminal,
                                    "RemoveShipto" : true
                                    };
                                   var oPayload = JSON.stringify(jsonData);
                                that.oDataModelT.callFunction("/unbindShipTo", {
                                    method: constants.httpPost,
                                    urlParameters: {
                                        createData: oPayload,
                                        terminal:oData.Terminal
                                      
                                    },
                                    success: function (oData) {
                                        BusyIndicator.hide();
                                        if (oData.unbindShipTo.data.message !== undefined) {
                                            MessageBox.error(oData.unbindShipTo.data.message);
                                        }
                                        else {
                                            MessageToast.show(that.oBundle.getText("terminalunBind"), [oData.unbindShipTo.data.Terminal]);
                                            that.getTerminalDetails();
                                            that.getCustomerDetails();
                                        }
                                    },
                                    error: function (err) {
                                        BusyIndicator.hide();
                                        var msg = err.message;
                                        MessageBox.error(msg, {
                                            details: err
                                        });
    
                                    }
    
                                });
                            }
                        }
                    });
                } else {
                    MessageBox.error(that.oBundle.getText("checkSH",[oData.Terminal, oData.TerminalName]));
                }
                }
                else {
                    MessageBox.error(that.oBundle.getText("delCheck"));
                }
            },
            onUnbindTerminalPopout:function(oEvent){
                var oTable = this.getView().byId("idTerTablePopout"), that = this;
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());
                if (itemIndex !== constants.INTNEGONE) { 
                    var  oData = this.getView().getModel("oModel").getProperty("/TerminalData")[itemIndex];
                    // oData = oPath[itemIndex];
                    if(oData.ShiptoCount !== constants.INTZERO){
                    MessageBox.confirm(that.oBundle.getText("unBindconfirm", [oData.Terminal, oData.TerminalName]), {
                        onClose: function (oAction) {
                            if (oAction === constants.actionOK) {
                                BusyIndicator.show();
                                var jsonData = {
                                    "Terminal" : oData.Terminal,
                                    "RemoveShipto" : true
                                    };
                                   var oPayload = JSON.stringify(jsonData);
                                that.oDataModelT.callFunction("/unbindShipTo", {
                                    method: constants.httpPost,
                                    urlParameters: {
                                        createData: oPayload,
                                        terminal:oData.Terminal
                                      
                                    },
                                    success: function (oData) {
                                        BusyIndicator.hide();
                                        if (oData.unbindShipTo.data.message !== undefined) {
                                            MessageBox.error(oData.unbindShipTo.data.message);
                                        }
                                        else {
                                            MessageToast.show(that.oBundle.getText("terminalunBind"));
                                            that.getTerminalDetails();
                                            that.getCustomerDetails();
                                        }
                                    },
                                    error: function (err) {
                                        BusyIndicator.hide();
                                        var msg = err.message;
                                        MessageBox.error(msg, {
                                            details: err
                                        });
    
                                    }
    
                                });
                            }
                        }
                    });
                } else {
                    MessageBox.error(that.oBundle.getText("checkSH",[oData.Terminal, oData.TerminalName]));
                }
                }
                else {
                    MessageBox.error(that.oBundle.getText("delCheck"));
                }   
            }
        });
    });