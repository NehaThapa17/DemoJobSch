/*&--------------------------------------------------------------------------------------*
 * File name                    	   : controlView.controller.js	                     *
 * Created By                          : neha.thapa@accenture.com                   *            	
 * Created On                          : 3-Apr-2023                                	 *                           							                                         *
 * Purpose                             : Controller for controlView.view.xml to process Job Scheduler                                                              
 *---------------------------------------------------------------------------------------*
 */

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator",
    "demo/app/utils/constants"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, JSONModel, BusyIndicator,  constants) {
        "use strict";
        return Controller.extend("demo.app.controller.controlView", {
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
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RoutecontrolView").attachPatternMatched(this.onRouteControl, this);
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
                        if (oDataArr2.RECURSIVE !== undefined) {
                            var date = new Date(),
                                index = oDataArr2.RECURSIVE.indexOf(constants.DIV),
                                hours = oDataArr2.RECURSIVE.substring(constants.INTZERO, index),
                                minutes = oDataArr2.RECURSIVE.substring(index + constants.INTONE);
                            date.setHours(hours);
                            date.setMinutes(minutes);
                            var finalDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                            var sTime = finalDate.toLocaleString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true
                            });

                            that.getView().byId("idTimePickerInput").setDateValue(finalDate);
                            that.getView().byId("idTextDailyST").setText(sTime);
                            that.getView().byId("idSwitchInput").setState(true);
                            that.getView().byId("idTimePickerInput").setEnabled(false);
                        } else {
                            that.getView().byId("idTextDailyST").setText(constants.SPACE);
                            that.getView().byId("idTimePickerInput").setValue(constants.SPACE);
                            that.getView().byId("idSwitchInput").setState(false);
                            that.getView().byId("idTimePickerInput").setEnabled(true);
                        }
                        if (oDataArr2.ONDEMAND !== undefined) {
                            var date = new Date(oDataArr2.ONDEMAND);
                            var date2 = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                            var sTime = date2.toLocaleString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true
                            });
                            // replace first nonspace combination along with whitespace
                            var dDate = date2.toDateString().replace(/^\S+\s/, ''),
                                finalDate = dDate + constants.SPACE + sTime;
                            that.getView().byId("idTextOnDemandST").setText(finalDate);
                            that.getView().byId("idDatePickerOnDemand").setValue(finalDate);
                            that.getView().byId("idSwitchInputD").setState(true);
                            that.getView().byId("idDatePickerOnDemand").setEnabled(false);
                            that.getView().getModel("oModel").setProperty("/dateValue", finalDate);

                        } else {
                            that.getView().byId("idTextOnDemandST").setText(constants.SPACE);
                            that.getView().byId("idSwitchInputD").setState(false);
                            that.getView().byId("idDatePickerOnDemand").setEnabled(true);
                            that.getView().getModel("oModel").setProperty("/dateValue", constants.SPACE);

                        }
                        if (oDataArr2.SUSPENDTo !== undefined && oDataArr2.SUSPENDFrom !== undefined) {
                            var dateTo = new Date(oDataArr2.SUSPENDTo);
                            var dateFrom = new Date(oDataArr2.SUSPENDFrom);
                            dateFrom = new Date(dateFrom.getTime() - dateFrom.getTimezoneOffset() * 60000);
                            dateTo = new Date(dateTo.getTime() - dateTo.getTimezoneOffset() * 60000);
                            var sTime = dateFrom.toLocaleString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true
                            });
                            var dDate = dateFrom.toDateString().replace(/^\S+\s/, ''),
                                finalText = dDate + constants.SPACE + sTime;
                            /*************************** Suspend To Date ***************************/

                            var sTimeT = dateTo.toLocaleString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true
                            });
                            var dDateT = dateTo.toDateString().replace(/^\S+\s/, ''),
                                finalTextTo = dDateT + constants.SPACE + sTimeT;
                            if (oDataArr2.sActive === constants.suspended) {
                                that.getView().byId("idDatePickerSuspend").setEnabled(false);
                                that.getView().byId("idDatePicker2Suspend").setEnabled(false);
                                that.getView().byId("idSwitchInputSuspend").setState(true);
                                that.getView().byId("idInfoLabelSuspend").setVisible(true);
                                that.getView().byId("idInfoLabelSuspend").setText(constants.suspended);
                                that.getView().byId("idInfoLabelSuspend").setColorScheme(2);
                            }
                            if (oDataArr2.sActive === true) {
                                that.getView().byId("idDatePickerSuspend").setEnabled(false);
                                that.getView().byId("idDatePicker2Suspend").setEnabled(false);
                                that.getView().byId("idSwitchInputSuspend").setState(true);
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
                            that.getView().byId("idDatePickerSuspend").setEnabled(true);
                            that.getView().byId("idDatePicker2Suspend").setEnabled(true);
                            that.getView().byId("idSwitchInputSuspend").setState(false);
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
                this.getJSTime();
            },
            /**
              * Method called on change Event of idSwitchInput to handle creation of Recursive Job Schedule. 
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
              * Method called inside onSwtichChange 
              * @public
              */
            getJSStatus: function (oState, oDaily) {
                var that = this;
                this.oDataModelT.callFunction("/getJobDetails", {
                    method: constants.httpGet,
                    success: function (oData) {
                        BusyIndicator.hide();
                        var oDataArr2 = JSON.parse(oData.getJobDetails);
                        if (oDataArr2.sActive === constants.suspended) {

                            if (oState === false) {
                                that.getView().byId("idSwitchInput").setState(true);
                            } else {
                                that.getView().byId("idSwitchInput").setState(false);
                            }
                            that.getView().byId("idDatePickerSuspend").setEnabled(false);
                            that.getView().byId("idDatePicker2Suspend").setEnabled(false);
                            that.getView().byId("idSwitchInputSuspend").setState(true);
                            that.getView().byId("idInfoLabelSuspend").setText(constants.suspended);
                            that.getView().byId("idInfoLabelSuspend").setColorScheme(2);
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

                    //Delete Schedule
                    this.oDataModelT.callFunction("/updateSchedule", {
                        method: constants.httpGet,
                        urlParameters: {
                            desc: constants.Recursive
                        },
                        success: function (oData) {
                            BusyIndicator.hide();
                            MessageBox.information(that.oBundle.getText("turnOffRecursive"));
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
                            dateM = (oDate.getMinutes() < 10 ? 0 : '') + oDate.getMinutes(),
                            now = new Date();
                        now.setHours(dateH);
                        now.setMinutes(dateM);
                        //Convert to UTC
                        // var nowUTC = now.toUTCString();
                        // var dateValue = new Date(nowUTC);
                        var dateValue = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
                        var oMin = (dateValue.getMinutes() < 10 ? 0 : '') + dateValue.getMinutes();
                        var oTime = dateValue.getHours() + ":" + oMin;
                        this.getView().byId("idTimePickerInput").setEnabled(false);
                        this.getView().byId("idTextDailyST").setText(oDaily);
                        //Create recursive Schedule
                        this.oDataModelT.callFunction("/createSchedule", {
                            method: constants.httpGet,
                            urlParameters: {
                                time: oTime,
                                desc: constants.Recursive
                            },
                            success: function (oData) {
                                BusyIndicator.hide();
                                MessageBox.success(that.oBundle.getText("succJSRecursive"));
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
              * Method called to handle switch button for OnDemand Job
              * @public
              */    
            onSwtichChangeD: function (oEvent) {
                BusyIndicator.show();
                var oState = oEvent.getSource().getState(),
                    oValue = this.getView().byId("idDatePickerOnDemand").getValue();
                this.getJSStatusOnDemand(oState, oValue);
            },         
            getJSStatusOnDemand: function (oState, oValue) {
                var that = this;
                this.oDataModelT.callFunction("/getJobDetails", {
                    method: constants.httpGet,
                    success: function (oData) {
                        BusyIndicator.hide();
                        var oDataArr2 = JSON.parse(oData.getJobDetails);
                        if (oDataArr2.sActive === constants.suspended) {
                            if (oState === false) {
                                that.getView().byId("idSwitchInputD").setState(true);
                            } else {
                                that.getView().byId("idSwitchInputD").setState(false);
                            }
                            that.getView().byId("idInfoLabelSuspend").setText(constants.suspended);
                            that.getView().byId("idInfoLabelSuspend").setColorScheme(2);
                            MessageBox.error(that.oBundle.getText("susCheck"));
                        } else {
                            
                            that.executeSchOnDemand(oState);
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
            executeSchOnDemand: function (oState) {
                var that = this;

                if (oState === false) {
                    that.getView().byId("idDatePickerOnDemand").setEnabled(true);

                    //Delete Schedule
                    that.oDataModelT.callFunction("/deleteSchedule", {
                        method: constants.httpGet,
                        urlParameters: {
                            desc: constants.onDemand
                        },
                        success: function (oData) {
                            BusyIndicator.hide();
                            MessageBox.information(that.oBundle.getText("turnOffIn"));

                            that.getView().byId("idDatePickerOnDemand").setValue("");
                            that.getView().byId("idTextOnDemandST").setText(constants.SPACE);
                            that.getView().getModel("oModel").setProperty("/dateValue", constants.SPACE);
                        },
                        error: function (err) {
                            BusyIndicator.hide();
                            MessageBox.error(that.oBundle.getText("techError"), {
                                details: err
                            });
                        }
                    });
                } else {
                    that.onPressSaveOnDemand();
                }
            },                     


            /**
              * Method called to handle creation for OnDemand Job
              * @public
              */
            onPressSaveOnDemand: function () {
                var oDate = this.getView().byId("idDatePickerOnDemand").getValue(),
                    that = this,
                    checkDate = this.getView().byId("idDatePickerOnDemand").getValueState(),
                    now = new Date(oDate);
                var cDate = new Date();

                if (now < cDate) {
                    this.getView().byId("idDatePickerOnDemand").setValueState(sap.ui.core.ValueState.Error);
                    MessageBox.error(this.oBundle.getText("dateError"));
                } else {

                    //Convert to UTC
                    var dateValue = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
                    var xTime = dateValue.toLocaleString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                    }),
                        onDemand = dateValue.toDateString() + constants.SPACE + xTime;

                    if ((oDate !== "" && oDate !== constants.SPACE && oDate !== undefined) ) {
                       
                            this.getView().byId("idDatePickerOnDemand").setEnabled(false);
                            this.getView().byId("idTextOnDemandST").setText(onDemand);
                            this.getView().getModel("oModel").setProperty("/dateValue", oDate);

                            this.oDataModelT.callFunction("/createOnDemandSchedule", {
                                method: constants.httpGet,
                                urlParameters: {
                                    time: onDemand,
                                    desc: constants.onDemand
                                },
                                success: function (oData) {
                                    if (oData.createOnDemandSchedule) {
                                        MessageBox.success(that.oBundle.getText("succJSOD"));
                                    }

                                },
                                error: function (err) {
                                    MessageBox.error(that.oBundle.getText("techError"), {
                                        details: err
                                    });

                                }
                            });
                        
                    } else {

                        MessageBox.error(that.oBundle.getText("errormsgrequired"));
                    }

                }
            },

            /**
              * Method called to handle Save button for Suspend
              * @public
              */
            onSwtichChangeSuspend: function (oEvent) {
                var that = this;
                BusyIndicator.show();
                var oState = oEvent.getSource().getState();
                if (oState === false) {
                    this.getView().byId("idDatePickerSuspend").setEnabled(true);
                    this.getView().byId("idDatePicker2Suspend").setEnabled(true);


                    //Delete Schedule
                    that.oDataModelT.callFunction("/deleteSuspendSchedule", {
                        method: constants.httpGet,
                        urlParameters: {
                            desc: constants.suspend
                        },
                        success: function (oData) {
                            BusyIndicator.hide();
                            // var dState = that.getView().byId("idSwitchInput").getState();
                            // if (dState === true) {
                            //     that.getView().byId("idInfoLabel").setColorScheme(constants.INTSEVEN);
                            //     that.getView().byId("idInfoLabel").setText(that.oBundle.getText("active"));
                            // } else {
                            //     that.getView().byId("idInfoLabel").setText(that.oBundle.getText("inactive"));
                            //     that.getView().byId("idInfoLabel").setColorScheme(constants.INTONE);
                            // }
                            MessageBox.information(that.oBundle.getText("turnOffSus"));
                        },
                        error: function (err) {
                            BusyIndicator.hide();
                            that.getView().byId("idSwitchInputSuspend").setState(true);
                            that.getView().byId("idDatePickerSuspend").setEnabled(false);
                            that.getView().byId("idDatePicker2Suspend").setEnabled(false);
                            MessageBox.error(that.oBundle.getText("techError"), {
                                details: err
                            });

                        }
                    });


                } else {
                    var oDateSuspendFrom = this.getView().byId("idDatePickerSuspend").getValue(),
                        oDateSuspendTo = this.getView().byId("idDatePicker2Suspend").getValue(),
                        checkVSF = this.getView().byId("idDatePickerSuspend").getValueState(),
                        checkVST = this.getView().byId("idDatePicker2Suspend").getValueState(),
                        oArr = [], that = this,
                        FromDate = new Date(oDateSuspendFrom),
                        ToDate = new Date(oDateSuspendTo),
                      //Convert to UTC
                     oSusFrom =  new Date(FromDate.getTime() + FromDate.getTimezoneOffset() * 60000), 
                     oSusTo = new Date(ToDate.getTime() + ToDate.getTimezoneOffset() * 60000);

                    var xSuspendTo = oSusTo.toLocaleString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                    }),
                        SuspendTo = oSusTo.toDateString() + constants.SPACE + xSuspendTo,

                        xSuspendFrom = oSusFrom.toLocaleString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                        }),
                        SuspendFrom = oSusFrom.toDateString() + constants.SPACE + xSuspendFrom;
                    var cDate = new Date();
                    if (ToDate < cDate) {
                        BusyIndicator.hide();
                        that.getView().byId("idSwitchInputSuspend").setState(false);
                        this.getView().byId("idDatePicker2Suspend").setValueState(sap.ui.core.ValueState.Error);
                        MessageBox.error(this.oBundle.getText("dateError"));
                    } else {
                        if ((oDateSuspendTo !== "" && oDateSuspendTo !== constants.SPACE && oDateSuspendTo !== undefined) && (oDateSuspendFrom !== "" && oDateSuspendFrom !== constants.SPACE && oDateSuspendFrom !== undefined)) {

                            if (checkVSF !== constants.ERROR && checkVST !== constants.ERROR) {
                                this.getView().byId("idDatePickerSuspend").setEnabled(false);
                                this.getView().byId("idDatePicker2Suspend").setEnabled(false);
                                this.getView().byId("idObjStatusS1").setText(oDateSuspendFrom);
                                this.getView().byId("idObjStatusS2").setText(oDateSuspendTo);
                                this.getView().getModel("oModel").setProperty("/dateValueF", oDateSuspendFrom);
                                this.getView().getModel("oModel").setProperty("/dateValueT", oDateSuspendTo);

                                oArr.push({
                                    "time": SuspendFrom,
                                    "Desc": "SUSPENDFROM"
                                });
                                oArr.push({
                                    "time": SuspendTo,
                                    "Desc": "SUSPENDTO"
                                });
                                var oPayloadSus = JSON.stringify(oArr);
                                that.oDataModelT.callFunction("/createSuspendSchedule", {
                                    method: constants.httpGet,
                                    urlParameters: {
                                        time: oPayloadSus,
                                        desc: constants.suspend
                                    },
                                    success: function (oData) {
                                        BusyIndicator.hide();
                                        // var now = new Date(),
                                        //     curr = now.toLocaleString("en-US", {
                                        //         timeZone: constants.timezone,
                                        //     });
                                        // curr = new Date(curr);
                                        // if (FromDate < curr) {
                                        //     that.getView().byId("idInfoLabel").setText(constants.suspended);
                                        //     that.getView().byId("idInfoLabel").setColorScheme(2);
                                        // }
                                        MessageBox.success(that.oBundle.getText("succJSSus"));
                                    },
                                    error: function (err) {
                                        BusyIndicator.hide();
                                        that.getView().byId("idSwitchInputSuspend").setState(false);
                                        that.getView().byId("idDatePickerSuspend").setEnabled(true);
                                        that.getView().byId("idDatePicker2Suspend").setEnabled(true);
                                        MessageBox.error(that.oBundle.getText("techError"), {
                                            details: err
                                        });

                                    }
                                });
                                
                            } else {
                                BusyIndicator.hide();
                                that.getView().byId("idSwitchInputSuspend").setState(false);
                                that.getView().byId("idSwitchInputSuspend").setState(false);
                                MessageBox.error(that.oBundle.getText("dateError"));
                            }
                        } else {
                            BusyIndicator.hide();
                            that.getView().byId("idSwitchInputSuspend").setState(false);
                            MessageBox.error(that.oBundle.getText("errormsgrequired"));
                        }
                    }
                }

            },
            /**
              * Method called to change events for Suspend To
              * @public
              */
            onhandleChangeDP1Suspend: function () {
                var oDateSuspendTo = this.getView().byId("idDatePickerSuspend").getDateValue(),
                    oDateSuspendFrom = this.getView().byId("idDatePicker2Suspend").getDateValue();
                if (oDateSuspendFrom != null && oDateSuspendFrom <= oDateSuspendTo) {
                    this.getView().byId("idDatePicker2Suspend").setValueState(sap.ui.core.ValueState.Error);
                    this.getView().byId("idDatePicker2Suspend").setValueStateText(this.oBundle.getText("plcErrorDate"));
                }
                else {
                    this.getView().byId("idDatePicker2Suspend").setValueState(sap.ui.core.ValueState.None);
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
                    this.getView().byId("idDatePicker2Suspend").setValueState(sap.ui.core.ValueState.Error);
                    this.getView().byId("idDatePicker2Suspend").setValueStateText(this.oBundle.getText("plcErrorDate"));
                } else if (oDateSuspendTo === null) {
                    this.getView().byId("idDatePicker2Suspend").setValueState(sap.ui.core.ValueState.Error);
                    this.getView().byId("idDatePicker2Suspend").setValueStateText(this.oBundle.getText("timeTo"));
                }
                else {
                    this.getView().byId("idDatePicker2Suspend").setValueState(sap.ui.core.ValueState.None);
                }
            },
            onhandleDateCheck: function (oEvent) {
                var oDTP = oEvent.getSource(),
                    sValue = oEvent.getParameter("value"),
                    bValid = oEvent.getParameter("valid");
                var selectedDate = new Date(sValue);
                var now = new Date(),
                    cDate = now.toLocaleString("en-US", {
                        timeZone: constants.timezone,
                    });
                cDate = new Date(cDate);
                if (bValid) {
                    if (selectedDate < cDate) {
                        oDTP.setValueState(sap.ui.core.ValueState.Error);
                        MessageBox.error(this.oBundle.getText("dateError"));
                    } else {
                        oDTP.setValueState(sap.ui.core.ValueState.None);
                    }
                } else {
                    oDTP.setValueState(sap.ui.core.ValueState.Error);
                }
            },
            onhandleDateCheckSusFrom: function (oEvent) {
                var oDTP = oEvent.getSource(),
                    sValue = oEvent.getParameter("value"),
                    bValid = oEvent.getParameter("valid");
                var oDateSuspendTo = this.getView().byId("idDatePickerSuspend").getDateValue(),
                    oDateSuspendFrom = this.getView().byId("idDatePicker2Suspend").getDateValue();
                var selectedDate = new Date(sValue);
                var now = new Date(),
                    cDate = now.toLocaleString("en-US", {
                        timeZone: constants.timezone,
                    });
                cDate = new Date(cDate);
                if (bValid) {
                    if (selectedDate < cDate) {
                        oDTP.setValueState(sap.ui.core.ValueState.Error);
                        oDTP.setValueStateText(this.oBundle.getText("timeCurr"));
                        // MessageBox.error(this.oBundle.getText("dateError"));
                    } else if (oDateSuspendFrom != null && oDateSuspendFrom <= oDateSuspendTo) {
                        oDTP.setValueState(sap.ui.core.ValueState.Error);
                    } else {
                        oDTP.setValueState(sap.ui.core.ValueState.None);
                    }
                } else {
                    oDTP.setValueState(sap.ui.core.ValueState.Error);
                }
            },
            onhandleDateCheckSusTo: function (oEvent) {
                var oDTP = oEvent.getSource(),
                    sValue = oEvent.getParameter("value"),
                    bValid = oEvent.getParameter("valid");
                var oDateSuspendTo = this.getView().byId("idDatePickerSuspend").getDateValue(),
                    oDateSuspendFrom = this.getView().byId("idDatePicker2Suspend").getDateValue();
                var selectedDate = new Date(sValue);
                var now = new Date(),
                    cDate = now.toLocaleString("en-US", {
                        timeZone: constants.timezone,
                    });
                cDate = new Date(cDate);
                if (bValid) {
                    if (selectedDate < cDate) {
                        oDTP.setValueState(sap.ui.core.ValueState.Error);
                        oDTP.setValueStateText(this.oBundle.getText("timeCurr"));
                    } else if (oDateSuspendTo === null) {
                        this.getView().byId("idDatePicker2Suspend").setValueState(sap.ui.core.ValueState.Error);
                    } else if (oDateSuspendFrom <= oDateSuspendTo) {
                        oDTP.setValueState(sap.ui.core.ValueState.Error);
                    } else {
                        oDTP.setValueState(sap.ui.core.ValueState.None);
                    }
                } else {
                    oDTP.setValueState(sap.ui.core.ValueState.Error);
                }
            },
        });
    });