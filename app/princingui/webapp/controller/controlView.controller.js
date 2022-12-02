sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/BusyIndicator",
    "sap/base/Log",
    "sap/ui/table/library",
    "sap/m/MessageToast",
    "sap/ui/core/format/DateFormat",
    "sap/ui/thirdparty/jquery",
    "sap/m/Token",
    "marathon/pp/princingui/utils/formatter",
    "marathon/pp/princingui/utils/constants",
    "sap/m/SearchField"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, JSONModel, Fragment, Filter, FilterOperator, BusyIndicator, Log, library, MessageToast, DateFormat, jquery, Token, formatter, constants, SearchField) {
        "use strict";
        var aTokens;
        return Controller.extend("marathon.pp.princingui.controller.controlView", {
            formatter: formatter,
            onInit: function () {

                this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                this.oDataModelT = this.getOwnerComponent().getModel();
                BusyIndicator.show();
                var oModel = new JSONModel();
                var oObj = new Date();
                var oItemData = [];
                oModel.setData(oItemData);
                this.getView().setModel(oModel, "oModel");
                this.getOwnerComponent().setModel(oModel, "oModel");
                this.getView().byId("idMultiInputTerminal").setModel(oModel, "oModel");
                this.getView().byId("idDatePickerOnDemand").setMinDate(new Date());
                this.getView().byId("idDatePickerSuspend").setMinDate(new Date());
                this.getView().byId("idDatePicker2Suspend").setMinDate(new Date());
                this.getView().getModel("oModel").setProperty("/dateValue", oObj);
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RoutecontrolView").attachPatternMatched(this.onRouteControl, this);
                this.getTerminalDetails();
                this.getProductDetails();
                this.getF4Customer();
                this.getF4Terminal();
                this.getF4Product();
                this.getCCEmails();
                this.getTime();
            },
            getTime: function () {
                debugger;
                var that = this;
                this.oDataModelT.callFunction("/getJobDetails", {
                    method: "GET",
                    success: function (oData) {
                        BusyIndicator.hide();
                        debugger;
                        var oDataArr2 = JSON.parse(oData.getJobDetails);
                        if (oDataArr2.DISPLAY !== undefined) {
                            var date = new Date(),
                                index = oDataArr2.DISPLAY.indexOf(":"),
                                hours = oDataArr2.DISPLAY.substring(0, index),
                                minutes = oDataArr2.DISPLAY.substring(index + 1);
                            date.setHours(hours);
                            date.setMinutes(minutes);
                            // Get dates for January and July
                            var dateJan = new Date(date.getFullYear(), 0, 1);
                            var dateJul = new Date(date.getFullYear(), 6, 1);
                            // Get timezone offset
                            var timezoneOffset = Math.max(dateJan.getTimezoneOffset(), dateJul.getTimezoneOffset());
                            // var oTempDate = new Date(date.getTime() + ((1 * 60 * 60 * 1000) * 6));
                            if (date.getTimezoneOffset() < timezoneOffset) {
                                // Adjust date by 5 hours
                                date = new Date(date.getTime() - ((1 * 60 * 60 * 1000) * 5));
                            }
                            else {
                                // Adjust date by 6 hours
                                date = new Date(date.getTime() - ((1 * 60 * 60 * 1000) * 6));
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
                            that.getView().byId("idInfoLabel").setColorScheme(7);
                            that.getView().byId("idInfoLabel").setText("Active");
                            that.getView().byId("idTimePickerInput").setEnabled(false);
                        } else {
                            that.getView().byId("idTextDailyST").setText(" ");
                            that.getView().byId("idTimePickerInput").setValue(" ");
                            that.getView().byId("idSwitchInput").setState(false);
                            that.getView().byId("idTimePickerInput").setEnabled(true);
                            that.getView().byId("idInfoLabel").setText("InActive");
                            that.getView().byId("idInfoLabel").setColorScheme(1);
                        }
                    },
                    error: function (err) {
                        debugger;
                        BusyIndicator.hide();
                        MessageBox.error("Technical error has occurred ", {
                            details: err
                        });

                    }
                });
            },
            onRouteControl: function (oEvent) {
                this.getCustomerDetails();
            },
            getCCEmails: function () {
                var that = this;
                this.oDataModelT.callFunction("/getOnCCEmail", {
                    method: 'GET',
                    success: function (oData) {
                        var dataTmp = oData.getOnCCEmail.data, oEmailArray;
                        debugger;
                        if (dataTmp != undefined) {
                            if (dataTmp.length != constants.INTZERO) {
                                for (var u = 0; u < dataTmp.length; u++) {
                                    switch (dataTmp[u].Key) {
                                        case "EMAILCC":
                                            oEmailArray = dataTmp[u].Value.split(";");
                                            break;
                                        case "ONDEMANDT":
                                            // that.getView().byId("idTextOnDemandST").setText(dataTmp[u].Value);
                                            // that.getView().byId("idDatePickerOnDemand").setValue(dataTmp[u].Value);
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
                        MessageBox.error("Technical error has occurred ", {
                            details: err
                        });

                    }
                })
            },
            getTerminalDetails: function () {

                var that = this;
                this.oDataModelT.callFunction("/getTerminalDetails", {
                    method: 'GET',
                    success: function (oData) {
                        if (oData.getTerminalDetails.data) {
                            that.getView().getModel("oModel").setProperty("/TerminalData", oData.getTerminalDetails.data);
                            that.getView().byId("idTitleTerminal").setText(that.oBundle.getText("comTerText", [oData.getTerminalDetails.data.length]));
                        }
                        BusyIndicator.hide();
                    },
                    error: function (err) {
                        BusyIndicator.hide();
                        MessageBox.error("Technical error has occurred ", {
                            details: err
                        });

                    }
                })
            },
            getProductDetails: function () {
                var that = this;
                this.oDataModelT.callFunction("/getOnPremProductDetails", {
                    method: 'GET',
                    success: function (oData) {
                        if (oData.getOnPremProductDetails.data) {
                            that.getView().getModel("oModel").setProperty("/ProductData", oData.getOnPremProductDetails.data);
                            that.getView().byId("idTitleProduct").setText(that.oBundle.getText("comProText", [oData.getOnPremProductDetails.data.length]));
                        }
                        BusyIndicator.hide();
                    },
                    error: function (err) {
                        BusyIndicator.hide();
                        MessageBox.error("Technical error has occurred ", {
                            details: err
                        });

                    }
                })
            },
            getCustomerDetails: function () {
                var that = this;
                this.oDataModelT.callFunction("/getCustomerDetails", {
                    method: 'GET',
                    success: function (oData) {

                        var finalArray = [];
                        var oDataCust = oData.getCustomerDetails.data;
                        if (oDataCust) {
                            that.getView().byId("idTitleCustomer").setText(that.oBundle.getText("comCusText", [oData.getCustomerDetails.data.length]));
                            for (var a = constants.INTZERO; a < oDataCust.length; a++) {
                                var oEmailArray = oDataCust[a].EmailTo.split(";"), oArray = [], oFirstProd;
                                for (var b = constants.INTZERO; b < oEmailArray.length; b++) {
                                    var obj = {};
                                    obj.email = oEmailArray[b];
                                    oArray.push(obj);
                                }
                                if (oDataCust[a].ProductList.results.length != constants.INTZERO) {
                                    oFirstProd = oDataCust[a].ProductList.results[constants.INTZERO].Product;
                                }
                                var objData = {};
                                objData = {
                                    "CountEmail": oDataCust[a].CountEmail,
                                    "CountProduct": oDataCust[a].CountProduct,
                                    "Customer": oDataCust[a].Customer,
                                    "CustomerName": oDataCust[a].CustomerName,
                                    "DailyJob": oDataCust[a].DailyJob,
                                    "EmailTo": oDataCust[a].EmailTo,
                                    "OnDemandJob": oDataCust[a].OnDemandJob,
                                    "ProductList": oDataCust[a].ProductList,
                                    "ProductFirst": oFirstProd,
                                    "ShipTo": oDataCust[a].ShipTo,
                                    "ShipToName": oDataCust[a].ShipToName,
                                    "EmailArray": oArray
                                }
                                finalArray.push(objData);
                            }
                            that.getView().getModel("oModel").setProperty("/CustomerData", finalArray);
                            BusyIndicator.hide();
                        }
                    },
                    error: function (err) {
                        BusyIndicator.hide();
                        MessageBox.error("Technical error has occurred ", {
                            details: err
                        });

                    }

                })

            },
            getF4Customer: function () {
                var that = this;
                this.oDataModelT.callFunction("/getOnPremCustomerF4", {
                    method: 'GET',
                    success: function (oData) {
                        that.getView().getModel("oModel").setProperty("/CustValHelp", oData.getOnPremCustomerF4.data);
                        BusyIndicator.hide();
                    },
                    error: function (err) {
                        BusyIndicator.hide();
                        MessageBox.error("Technical error has occurred ", {
                            details: err
                        });

                    }
                })
            },
            getF4Terminal: function () {
                var that = this;

                this.oDataModelT.callFunction("/getOnPremTerminalF4", {
                    method: 'GET',
                    success: function (oData) {
                        that.getView().getModel("oModel").setProperty("/TerminalValHelp", oData.getOnPremTerminalF4.data);
                        // ;
                        BusyIndicator.hide();
                    },
                    error: function (err) {
                        BusyIndicator.hide();
                        MessageBox.error("Technical error has occurred ", {
                            details: err
                        });

                    }
                })
            },
            getF4Product: function () {
                var that = this;

                this.oDataModelT.callFunction("/getOnPremProductF4", {
                    method: 'GET',
                    success: function (oData) {

                        that.getView().getModel("oModel").setProperty("/ProductValHelp", oData.getOnPremProductF4.data);
                        BusyIndicator.hide();
                    },
                    error: function (err) {
                        BusyIndicator.hide();
                        MessageBox.error("Technical error has occurred ", {
                            details: err
                        });

                    }
                })
            },
            //Delete Customer
            onDeleteCustomer: function () {
                var oTable = this.getView().byId("idProductsTable"), that = this;
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());
                var oTableData = this.getView().getModel("oModel").getProperty("/CustomerData");
                if (itemIndex !== -1) {
                    var oItems = oTableData[itemIndex];
                    MessageBox.confirm(that.oBundle.getText("customerDeleted", [oItems.Customer]), {
                        onClose: function (oAction) {
                            if (oAction === "OK") {
                                BusyIndicator.show();
                                that.oDataModelT.callFunction("/deleteCustomer", {
                                    method: "POST",
                                    urlParameters: {
                                        customer: oItems.Customer,
                                        shipTo: oItems.ShipTo,
                                    },
                                    success: function (oData) {
                                        BusyIndicator.hide();
                                        MessageToast.show(that.oBundle.getText("delSucc"));
                                        that.getCustomerDetails();
                                    },
                                    error: function (err) {
                                        BusyIndicator.hide();
                                        MessageBox.error("Technical error has occurred ", {
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
            onDeleteCustomerPopout: function () {
                var oTable = this.getView().byId("idTablePopout"), that = this;
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());
                var oTableData = this.getView().getModel("oModel").getProperty("/CustomerData");
                if (itemIndex !== -1) {

                    var oItems = oTableData[itemIndex];
                    MessageBox.confirm(that.oBundle.getText("customerDeleted", [oItems.Customer]), {
                        onClose: function (oAction) {
                            if (oAction === "OK") {
                                BusyIndicator.show();
                                that.oDataModelT.callFunction("/deleteCustomer", {
                                    method: "POST",
                                    urlParameters: {
                                        customer: oItems.Customer,
                                        shipTo: oItems.ShipTo,
                                    },
                                    success: function (oData) {
                                        BusyIndicator.hide();
                                        MessageToast.show(that.oBundle.getText("delSucc"));
                                        that.getCustomerDetails();
                                    },
                                    error: function (err) {
                                        BusyIndicator.hide();
                                        MessageBox.error("Technical error has occurred ", {
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
            onSwtichChange: function (oEvent) {
                var oState = oEvent.getSource().getState(), that = this,
                    oDaily = this.getView().byId("idTimePickerInput").getValue();
                if (oState === false) {
                    this.getView().byId("idTimePickerInput").setEnabled(true);
                    this.getView().byId("idInfoLabel").setText("InActive");
                    this.getView().byId("idInfoLabel").setColorScheme(1);
                    //Delete Schedule
                    var emptyString = " ";
                    this.oDataModelT.callFunction("/deleteSchedule", {
                        method: "GET",
                        urlParameters: {
                            desc: "DAILY"
                        },
                        success: function (oData) {
                            BusyIndicator.hide();
                            // if (oData.createSchedule) {
                            //     var jsonDT = {
                            //         "Key": "DAILYT",
                            //         "Value": emptyString
                            //     }
                            //     var oPayloadDT = JSON.stringify(jsonDT);
                            //     debugger;
                            //     that.oDataModelT.callFunction("/createCCEmail", {
                            //         method: constants.httpPost,
                            //         urlParameters: {
                            //             createData: oPayloadDT
                            //         },
                            //         success: function (oData) {
                            //             debugger;
                            //         },
                            //         error: function (err) {
                            //             BusyIndicator.hide();
                            //             MessageBox.error("Technical error has occurred ", {
                            //                 details: err
                            //             });

                            //         }
                            //     });
                            // }
                        },
                        error: function (err) {
                            BusyIndicator.hide();
                            MessageBox.error("Technical error has occurred ", {
                                details: err
                            });

                        }
                    });
                } else {
                    if (oDaily !== "" && oDaily !== " " && oDaily !== undefined) {
                        BusyIndicator.show();
                        var oDate = new Date(this.getView().byId("idTimePickerInput").getDateValue()),
                            dateH = oDate.getHours(),
                            dateM = oDate.getMinutes(),
                            dateValue = new Date();
                        dateValue.setHours(dateH);
                        dateValue.setMinutes(dateM);
                        // Get dates for January and July
                        var dateJan = new Date(dateValue.getFullYear(), 0, 1);
                        var dateJul = new Date(dateValue.getFullYear(), 6, 1);
                        // Get timezone offset
                        var timezoneOffset = Math.max(dateJan.getTimezoneOffset(), dateJul.getTimezoneOffset());
                        // var oTempDate = new Date(dateValue.getTime() + ((1 * 60 * 60 * 1000) * 6));
                        if (dateValue.getTimezoneOffset() < timezoneOffset) {
                            // Adjust date by 5 hours
                            dateValue = new Date(dateValue.getTime() + ((1 * 60 * 60 * 1000) * 5));
                        }
                        else {
                            // Adjust date by 6 hours
                            dateValue = new Date(dateValue.getTime() + ((1 * 60 * 60 * 1000) * 6));
                        }
                        var oTime = dateValue.getHours() + ":" + dateValue.getMinutes();

                        this.getView().byId("idTimePickerInput").setEnabled(false);
                        this.getView().byId("idInfoLabel").setColorScheme(7);
                        this.getView().byId("idInfoLabel").setText("Active");
                        this.getView().byId("idTextDailyST").setText(oDaily);

                        this.oDataModelT.callFunction("/createSchedule", {
                            method: "GET",
                            urlParameters: {
                                time: oTime,
                                desc: "DAILY"
                            },
                            success: function (oData) {
                                BusyIndicator.hide();
                                // if (oData.createSchedule) {
                                //     var jsonDT = {
                                //         "Key": "DAILYT",
                                //         "Value": oDaily
                                //     }
                                //     var oPayloadDT = JSON.stringify(jsonDT);
                                //     debugger;
                                //     that.oDataModelT.callFunction("/createCCEmail", {
                                //         method: constants.httpPost,
                                //         urlParameters: {
                                //             createData: oPayloadDT
                                //         },
                                //         success: function (oData) {
                                //             debugger;
                                //         },
                                //         error: function (err) {
                                //             BusyIndicator.hide();
                                //             MessageBox.error("Technical error has occurred ", {
                                //                 details: err
                                //             });

                                //         }
                                //     });
                                // }
                                MessageBox.success(that.oBundle.getText("succJS"));
                            },
                            error: function (err) {
                                BusyIndicator.hide();
                                MessageBox.error("Technical error has occurred ", {
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

            //Customer ID & Ship To Value Help
            onValueHelpRequested: function () {
                this._oBasicSearchField = new SearchField();
                this.oColModel = new JSONModel();
                var aCols = {
                    "cols": [
                        {
                            "label": "Customer ID",
                            "template": "Customer",
                        },
                        {
                            "label": "Customer Name",
                            "template": "CustomerName"
                        },
                        {
                            "label": "Ship-To",
                            "template": "ShipTo"
                        },
                        {
                            "label": "Ship-To Name",
                            "template": "ShipToName"
                        }
                    ]
                };
                this.oColModel.setData(aCols);
                this._oValueHelpDialogCust = sap.ui.xmlfragment("marathon.pp.princingui.fragments.CustomerListVH", this);
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
            handleTableSelectDialogPress: function (oEvent) {

                var oButton = oEvent.getSource(),
                    oView = this.getView();
                if (!this.byId("custTable")) {
                    Fragment.load({
                        id: oView.getId(),
                        name: "marathon.pp.princingui.fragments.tablePopout",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        // return oDialog;
                        oDialog.open();
                    });
                } else {
                    this.byId("custTable").open();
                }

            },
            //Expand Product Table
            handleProductTableSelectDialogPress: function (oEvent) {
                var oButton = oEvent.getSource(),
                    oView = this.getView();
                if (!this.byId("prodTable")) {
                    Fragment.load({
                        id: oView.getId(),
                        name: "marathon.pp.princingui.fragments.tableProdPopout",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        // return oDialog;
                        oDialog.open();
                    });
                } else {
                    this.byId("prodTable").open();
                }
            },
            //Expand Terminal Table
            handleTerminalTableSelectDialogPress: function (oEvent) {
                var oView = this.getView();
                if (!this.byId("terTable")) {
                    Fragment.load({
                        id: oView.getId(),
                        name: "marathon.pp.princingui.fragments.tableTerPopout",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        // return oDialog;
                        oDialog.open();
                    });
                } else {
                    this.byId("terTable").open();
                }
            },
            handleEmailPopoverPress: function (oEvent) {
                var oButton2 = oEvent.getSource(),
                    oView = this.getView(),
                    // oB_ID = oButton2.getId(),
                    oB_ID = oEvent.getSource().getParent().getParent().getBindingContextPath(),
                    oB_len = oB_ID.length,
                    olen = oB_len - 1,
                    oB_Indx = oB_ID.slice(olen),
                    oCustData = this.getView().getModel("oModel").getProperty("/CustomerData")[oB_Indx],
                    oTempModel = new JSONModel();
                oTempModel.setData(oCustData.EmailArray);

                if (!this._pPopoverEmail) {
                    this._pPopoverEmail = Fragment.load({
                        id: oView.getId(),
                        name: "marathon.pp.princingui.fragments.emailPopover",
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
            handlePopoverPress: function (oEvent) {
                var oButton = oEvent.getSource(),
                    oView = this.getView(),
                    oB_ID = oEvent.getSource().getParent().getParent().getBindingContextPath(),
                    // oButton.getId(),
                    oB_len = oB_ID.length,
                    olen = oB_len - 1,
                    oB_Indx = oB_ID.slice(olen),
                    oCustData = this.getView().getModel("oModel").getProperty("/CustomerData")[oB_Indx],
                    oTempModel = new JSONModel();
                oTempModel.setData(oCustData.ProductList);

                if (!this._pPopover) {
                    this._pPopover = Fragment.load({
                        id: oView.getId(),
                        name: "marathon.pp.princingui.fragments.productPopover",
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
            //Add Terminal
            handleTerminalSelectDialogPress: function () {
                var oView = this.getView();
                // create dialog lazily

                if (!this.byId("addTerminal")) {
                    // load asynchronous XML fragment
                    Fragment.load({
                        id: oView.getId(),
                        name: "marathon.pp.princingui.fragments.addTerminal",
                        controller: this
                    }).then(function (oDialog) {
                        // connect dialog to the root view
                        //of this component (models, lifecycle)
                        oView.addDependent(oDialog);
                        oDialog.open();
                        oDialog.setTitle("Add Terminal");
                    });
                } else {
                    this.byId("addTerminal").open();
                    oDialog.setTitle("Add Terminal");
                }
            },
            onTerminalClose: function (oEvent) {
                this.byId("addTerminal").close();
                this.byId("addTerminal").destroy();
                // oEvent.getSource().getParent().close();
                // oEvent.getSource().getParent().destroy();

            },
            //Edit Terminal
            handleEditTerminalSelectDialogPress: function () {
                var oTable = this.getView().byId("idTableTerminal");
                var oTableData = this.getView().getModel("oModel").getProperty("/TerminalData");
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());
                if (itemIndex !== -1) {
                    var oItems = oTableData[itemIndex];
                    var oView = this.getView();
                    // create dialog lazily

                    if (!this.byId("addTerminal")) {
                        //     // load asynchronous XML fragment
                        //     this._oTerminalDialog = 
                        Fragment.load({
                            id: oView.getId(),
                            name: "marathon.pp.princingui.fragments.addTerminal",
                            controller: this
                        }).then(function (oDialog) {
                            oView.addDependent(oDialog);
                            oDialog.open();
                            oDialog.setTitle("Edit Terminal");
                            var oInputTer = sap.ui.core.Fragment.byId(oView.getId(), "idInputTerminalID");
                            oInputTer.setEnabled(false);
                            sap.ui.core.Fragment.byId(oView.getId(), "idInputTerminalID").setValue(oItems.Terminal);
                            sap.ui.core.Fragment.byId(oView.getId(), "idInputTerminalName").setValue(oItems.TerminalName);
                            sap.ui.core.Fragment.byId(oView.getId(), "idCheckBoxDaily").setSelected(oItems.DailyJob);
                            sap.ui.core.Fragment.byId(oView.getId(), "idCheckBoxOnDemand").setSelected(oItems.OnDemandJob);
                        });

                    }
                }
                else {
                    MessageBox.error("Select a Terminal to proceed");
                }
            },
            //Edit Terminal Popout
            handleEditTerminalPopout: function () {
                var oTable = this.getView().byId("idTerTablePopout"), that = this;
                var oTableData = this.getView().getModel("oModel").getProperty("/TerminalData");
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());
                if (itemIndex !== -1) {
                    var oItems = oTableData[itemIndex];
                    var oView = this.getView();
                    // create dialog lazily

                    if (!this.byId("addTerminal")) {
                        Fragment.load({
                            id: oView.getId(),
                            name: "marathon.pp.princingui.fragments.addTerminal",
                            controller: this
                        }).then(function (oDialog) {
                            oView.addDependent(oDialog);
                            oDialog.open();
                            oDialog.setTitle("Edit Terminal");
                            var oInputTer = sap.ui.core.Fragment.byId(oView.getId(), "idInputTerminalID");
                            oInputTer.setEnabled(false);
                            sap.ui.core.Fragment.byId(oView.getId(), "idInputTerminalID").setValue(oItems.Terminal);
                            sap.ui.core.Fragment.byId(oView.getId(), "idInputTerminalName").setValue(oItems.TerminalName);
                            sap.ui.core.Fragment.byId(oView.getId(), "idCheckBoxDaily").setSelected(oItems.DailyJob);
                            sap.ui.core.Fragment.byId(oView.getId(), "idCheckBoxOnDemand").setSelected(oItems.OnDemandJob);
                        });

                    }
                }
                else {
                    MessageBox.error("Select a Terminal to proceed");
                }
            },
            //Add Product
            handleProductSelectDialogPress: function () {
                var oView = this.getView();
                // create dialog lazily
                if (!this.byId("addProduct")) {
                    // load asynchronous XML fragment
                    Fragment.load({
                        id: oView.getId(),
                        name: "marathon.pp.princingui.fragments.addProduct",
                        controller: this
                    }).then(function (oDialog) {
                        // connect dialog to the root view
                        //of this component (models, lifecycle)
                        oView.addDependent(oDialog);
                        oDialog.open();
                        oDialog.setTitle("Add Product");
                    });
                } else {
                    this.byId("addProduct").open();
                    oDialog.setTitle("Add Product");
                }
            },
            //Edit Product
            handleEditProductSelectDialogPress: function () {
                var oTable = this.getView().byId("producttbl");
                var oTableData = this.getView().getModel("oModel").getProperty("/ProductData");
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());

                if (itemIndex !== -1) {

                    var lineData = oTableData[itemIndex];
                    var oView = this.getView();
                    // create dialog lazily
                    if (!this.byId("addProduct")) {
                        // load asynchronous XML fragment
                        Fragment.load({
                            id: oView.getId(),
                            name: "marathon.pp.princingui.fragments.addProduct",
                            controller: this
                        }).then(function (oDialog) {
                            // connect dialog to the root view
                            //of this component (models, lifecycle)
                            oView.addDependent(oDialog);
                            oDialog.open();
                            oDialog.setTitle("Edit Product");
                            var oProdID = sap.ui.core.Fragment.byId(oView.getId(), "idInputProductID");
                            var oProdName = sap.ui.core.Fragment.byId(oView.getId(), "idInputProductName");
                            oProdID.setValue(lineData.Product);
                            oProdID.setEnabled(false);
                            oProdName.setValue(lineData.ProductName);
                        });
                    } else {
                        this.byId("addProduct").open();
                        oDialog.setTitle("Edit Product");
                    }
                }
                else {
                    MessageBox.error("Select a Product to proceed");
                }
            },
            handleEditProductPopout: function () {
                var oTable = this.getView().byId("idProdTablePopout");
                var oTableData = this.getView().getModel("oModel").getProperty("/ProductData");
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());

                if (itemIndex !== -1) {
                    var lineData = oTableData[itemIndex];
                    var oView = this.getView();
                    // create dialog lazily
                    if (!this.byId("addProduct")) {
                        // load asynchronous XML fragment
                        Fragment.load({
                            id: oView.getId(),
                            name: "marathon.pp.princingui.fragments.addProduct",
                            controller: this
                        }).then(function (oDialog) {
                            // connect dialog to the root view
                            //of this component (models, lifecycle)
                            oView.addDependent(oDialog);
                            oDialog.open();
                            oDialog.setTitle("Edit Product");
                            var oProdID = sap.ui.core.Fragment.byId(oView.getId(), "idInputProductID");
                            var oProdName = sap.ui.core.Fragment.byId(oView.getId(), "idInputProductName");
                            oProdID.setValue(lineData.Product);
                            oProdID.setEnabled(false);
                            oProdName.setValue(lineData.ProductName);
                        });
                    } else {
                        this.byId("addProduct").open();
                        oDialog.setTitle("Edit Product");
                    }
                }
                else {
                    MessageBox.error("Select a Product to proceed");
                }
            },
            onProductClose: function () {
                this.byId("addProduct").close();
                this.byId("addProduct").destroy();
            },

            onValueHelpOkEmail: function (oEvent) {
                var oMultiInput1 = oView.byId("multiInput1");
                oMultiInput1.setTokens([
                    new Token({ text: { email }, key: { key } }),
                ]);
            },

            onClose: function () {
                this.byId("custTable").close();
            },
            onCloseProd: function () {
                this.byId("prodTable").close();
            },
            onCloseTer: function () {
                this.byId("terTable").close();
            },
            onCreateCustomer: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RoutecreateView");

            },
            onSearchCustomerPop: function (oEvent) {
                var aFilters = [], aFiltersCombo = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > constants.INTZERO) {
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: "Customer", operator: FilterOperator.Contains, value1: sQuery }),
                            new Filter({ path: "CustomerName", operator: FilterOperator.Contains, value1: sQuery }),
                            new Filter({ path: "ShipTo", operator: FilterOperator.Contains, value1: sQuery }),
                            new Filter({ path: "ShipToName", operator: FilterOperator.Contains, value1: sQuery })
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
            _filterTableC: function (oFilter) {
                var oVHD = this.byId("custTable");
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
            onSearchTerminalPop: function (oEvent) {
                var aFilters = [], aFiltersCombo = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > constants.INTZERO) {
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: "Terminal", operator: FilterOperator.Contains, value1: sQuery }),
                            new Filter({ path: "TerminalName", operator: FilterOperator.Contains, value1: sQuery })
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
            onSearchProductPop: function (oEvent) {
                var aFilters = [], aFiltersCombo = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > constants.INTZERO) {
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: "Product", operator: FilterOperator.Contains, value1: sQuery }),
                            new Filter({ path: "ProductName", operator: FilterOperator.Contains, value1: sQuery })
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
            //Edit Customer
            onEditCustomer: function () {

                var oTable = this.getView().byId("idProductsTable"), oArray = [];
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());
                if (itemIndex !== -1) {

                    var value = this.getView().getModel("oModel").getProperty("/CustomerData")[itemIndex];
                    var prodObj = [];
                    for (var g = constants.INTZERO; g < value.ProductList.results.length; g++) {
                        prodObj.push({
                            Product: value.ProductList.results[g].Product,
                            ProductName: value.ProductList.results[g].ProductName
                        });
                    }
                    oArray.push({
                        Customer: value.Customer,
                        CustomerName: value.CustomerName,
                        ShipTo: value.ShipTo,
                        ShipToName: value.ShipToName,
                        ProductList: prodObj,
                        EmailTo: value.EmailTo,
                        EmailArray: value.EmailArray,
                        DailyJob: value.DailyJob,
                        OnDemandJob: value.OnDemandJob
                    });
                    this.getView().getModel("oModel").setProperty("/selectedRow", oArray);
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteEditView", {
                        Data: "1"//JSON.stringify(oArray)
                    });

                } else {
                    MessageBox.error("Select a Customer to proceed");

                }

            },
            //Edit Customer Popout
            onEditCustomerPopout: function (oEvent) {
                var oTable = this.getView().byId("idTablePopout"), oArray = [];
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());
                if (itemIndex !== -1) {

                    var value = this.getView().getModel("oModel").getProperty("/CustomerData")[itemIndex];
                    var prodObj = [];
                    for (var g = constants.INTZERO; g < value.ProductList.results.length; g++) {
                        prodObj.push({
                            Product: value.ProductList.results[g].Product,
                            ProductName: value.ProductList.results[g].ProductName
                        });
                    }
                    oArray.push({
                        Customer: value.Customer,
                        CustomerName: value.CustomerName,
                        ShipTo: value.ShipTo,
                        ShipToName: value.ShipToName,
                        ProductList: prodObj,
                        EmailTo: value.EmailTo,
                        EmailArray: value.EmailArray,
                        DailyJob: value.DailyJob,
                        OnDemandJob: value.OnDemandJob
                    });
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                    oRouter.navTo("RouteEditView", {
                        Data: JSON.stringify(oArray)
                    });

                } else {
                    MessageBox.error("Select a Customer to proceed");

                }

            },
            onValueProductAfterClose: function () {
                this.byId("addProduct").destroy();
            },
            //Delete Terminal
            onDeleteTerminal: function () {
                var oTable = this.getView().byId("idTableTerminal"), that = this;
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());
                var oTableData = this.getView().getModel("oModel").getProperty("/TerminalData");
                if (itemIndex !== -1) {
                    var oItems = oTableData[itemIndex];
                    MessageBox.confirm(that.oBundle.getText("terminalDeleted", [oItems.Terminal]), {
                        onClose: function (oAction) {
                            if (oAction === "OK") {
                                BusyIndicator.show();
                                that.oDataModelT.callFunction("/deleteTerminal", {
                                    method: "POST",
                                    urlParameters: {
                                        terminal: oItems.Terminal
                                    },
                                    success: function (oData) {
                                        BusyIndicator.hide();
                                        MessageToast.show(that.oBundle.getText("delSucc"));
                                        that.getTerminalDetails();
                                    },
                                    error: function (err) {
                                        BusyIndicator.hide();
                                        MessageBox.error("Technical error has occurred ", {
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
            //Delete Product
            onDeleteProduct: function (_evt) {
                var oTable = this.getView().byId("producttbl"), that = this;
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());
                var oTableData = this.getView().getModel("oModel").getProperty("/ProductData");
                if (itemIndex !== -1) {
                    var oItems = oTableData[itemIndex];
                    MessageBox.confirm(that.oBundle.getText("productDeleted", [oItems.Product]), {
                        onClose: function (oAction) {
                            if (oAction === "OK") {
                                BusyIndicator.show();
                                that.oDataModelT.callFunction("/deleteProduct", {
                                    method: "POST",
                                    urlParameters: {
                                        product: oItems.Product
                                    },
                                    success: function (oData) {
                                        BusyIndicator.hide();
                                        MessageToast.show(that.oBundle.getText("delSucc"));
                                        that.getProductDetails();
                                        that.getCustomerDetails();
                                    },
                                    error: function (err) {
                                        BusyIndicator.hide();
                                        MessageBox.error("Technical error has occurred ", {
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
            onDeleteTerminalPopout: function () {
                var oTable = this.getView().byId("idTerTablePopout"), that = this;
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());
                var oTableData = this.getView().getModel("oModel").getProperty("/TerminalData");
                if (itemIndex !== -1) {
                    var oItems = oTableData[itemIndex];
                    MessageBox.confirm(that.oBundle.getText("terminalDeleted", [oItems.Terminal]), {
                        onClose: function (oAction) {
                            if (oAction === "OK") {
                                BusyIndicator.show();
                                that.oDataModelT.callFunction("/deleteTerminal", {
                                    method: "POST",
                                    urlParameters: {
                                        terminal: oItems.Terminal
                                    },
                                    success: function (oData) {
                                        BusyIndicator.hide();
                                        MessageToast.show(that.oBundle.getText("delSucc"));
                                        that.getTerminalDetails();
                                    },
                                    error: function (err) {
                                        BusyIndicator.hide();
                                        MessageBox.error("Technical error has occurred ", {
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
            //Delete Product Popout
            onDeleteProductPopout: function (_evt) {
                var oTable = this.getView().byId("idProdTablePopout"), that = this;
                var itemIndex = oTable.indexOfItem(oTable.getSelectedItem());
                var oTableData = this.getView().getModel("oModel").getProperty("/ProductData");
                if (itemIndex !== -1) {

                    var oItems = oTableData[itemIndex];
                    MessageBox.confirm(that.oBundle.getText("productDeleted", [oItems.Product]), {
                        onClose: function (oAction) {
                            if (oAction === "OK") {
                                BusyIndicator.show();
                                that.oDataModelT.callFunction("/deleteProduct", {
                                    method: "POST",
                                    urlParameters: {
                                        product: oItems.Product
                                    },
                                    success: function (oData) {
                                        BusyIndicator.hide();
                                        MessageToast.show(that.oBundle.getText("delSucc"));
                                        that.getProductDetails();
                                    },
                                    error: function (err) {
                                        BusyIndicator.hide();
                                        MessageBox.error("Technical error has occurred ", {
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
            //CC button
            onEmailCCSelectDialogPress: function (oEvent) {
                var oView = this.getView(), aTokens = [],
                    oDataCC = oView.getModel("oModel").getProperty("/emailsCC");
                if (oDataCC) {
                    for (var e = constants.INTZERO; e < oDataCC.length; e++) {
                        var otoken1 = new sap.m.Token({ key: oDataCC[e], text: oDataCC[e] });
                        aTokens.push(otoken1);
                    }
                }

                // var otoken2 = new sap.m.Token({ key: "002", text: 'almacenesemail@address.com' });
                // aTokens = [otoken1, otoken2];
                // create dialog lazily
                if (!this.byId("addEmail")) {
                    // load asynchronous XML fragment
                    Fragment.load({
                        id: oView.getId(),
                        name: "marathon.pp.princingui.fragments.addEmailCc",
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
                            if (!mailregex.test(email) || eArr[1] !== "marathonpetroleum.com") {
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
                // else {
                oMultiInput1.addValidator(fnValidator);
                // }

            },
            onCCEmailClose: function () {
                this.byId("addEmail").close();
                this.byId("addEmail").destroy();
            },
            onCCEmailSave: function (oEvent) {
                BusyIndicator.show();
                var oCCEmail = this.getView().byId("multiInputemail").getTokens(), oCCEmailString, that = this;
                if (oCCEmail.length !== constants.INTZERO) {
                    for (var j = constants.INTZERO; j < oCCEmail.length; j++) {
                        var objEmail = oCCEmail[j].getKey();
                        if (j === constants.INTZERO) {
                            oCCEmailString = objEmail;
                        } else {
                            oCCEmailString = oCCEmailString + ";" + objEmail;
                        }

                    }
                    var jsonCC = {
                        "Key": "EMAILCC",
                        "Value": oCCEmailString
                    }
                    var oPayloadCC = JSON.stringify(jsonCC);
                    this.oDataModelT.callFunction("/createCCEmail", {
                        method: constants.httpPost,
                        urlParameters: {
                            createData: oPayloadCC
                        },
                        success: function (oData) {
                            console.log(oData);
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
                            MessageBox.error("Technical error has occurred ", {
                                details: err
                            });

                        }
                    });
                }
            },
            onPressEditOnDemand: function (oEvent) {
                this.getView().byId("idMultiInputCustomer").setEnabled(true);
                this.getView().byId("idDatePickerOnDemand").setEnabled(true);
                this.getView().byId("idMultiInputTerminal").setEnabled(true);
                this.getView().byId("idButtonSave").setVisible(true);
                this.getView().byId("idButtonCancel").setVisible(true);
                this.getView().byId("idButtonEdit").setVisible(false);
            },
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
                //once data bindined remove
                this.getView().byId("idMultiInputCustomer").setValue("");
                this.getView().byId("idDatePickerOnDemand").setDateValue("");
                this.getView().byId("idMultiInputTerminal").setValue("");


            },
            onPressSaveOnDemand: function () {
                debugger;
                // var oDate = this.getView().byId("idDatePickerOnDemand").getDateValue(),
                var oDate = this.getView().byId("idDatePickerOnDemand").getValue(),
                    that = this,
                    oCust = this.getView().byId("idMultiInputCustomer").getTokens(),
                    oTer = this.getView().byId("idMultiInputTerminal").getSelectedItems(),
                    oTer2 = this.getView().byId("idMultiInputTerminal").getSelectedKeys(),
                    xLen = oDate.length - 4,
                    result = oDate.slice(0,xLen),
                    dateValue = new Date(result);
                // Get dates for January and July
                var dateJan = new Date(dateValue.getFullYear(), 0, 1);
                var dateJul = new Date(dateValue.getFullYear(), 6, 1);
                // Get timezone offset
                var timezoneOffset = Math.max(dateJan.getTimezoneOffset(), dateJul.getTimezoneOffset());
                if (dateValue.getTimezoneOffset() < timezoneOffset) {
                    // Adjust date by 5 hours
                    dateValue = new Date(dateValue.getTime() + ((1 * 60 * 60 * 1000) * 5));
                }
                else {
                    // Adjust date by 6 hours
                    dateValue = new Date(dateValue.getTime() + ((1 * 60 * 60 * 1000) * 6));
                }

                if (oDate && oCust.length !== constants.INTZERO && oTer.length !== constants.INTZERO) {
                    this.getView().byId("idMultiInputCustomer").setEnabled(false);
                    this.getView().byId("idDatePickerOnDemand").setEnabled(false);
                    this.getView().byId("idMultiInputTerminal").setEnabled(false);
                    this.getView().byId("idButtonSave").setVisible(false);
                    this.getView().byId("idButtonCancel").setVisible(false);
                    this.getView().byId("idButtonEdit").setVisible(true);
                    this.getView().byId("idTextOnDemandST").setText(result);
                    this.oDataModelT.callFunction("/createOnDemandSchedule", {
                        method: "GET",
                        urlParameters: {
                            time: result,
                            desc: "ONDEMAND"
                        },
                        success: function (oData) {
                            BusyIndicator.hide();
                            // if (oData.createSchedule) {
                            //     var jsonDT = {
                            //         "Key": "ONDEMANDT",
                            //         "Value": oDate1
                            //     }
                            //     var oPayloadDT = JSON.stringify(jsonDT);
                            //     debugger;
                            //     that.oDataModelT.callFunction("/createCCEmail", {
                            //         method: constants.httpPost,
                            //         urlParameters: {
                            //             createData: oPayloadDT
                            //         },
                            //         success: function (oData) {
                            //             debugger;
                            //         },
                            //         error: function (err) {
                            //             BusyIndicator.hide();
                            //             MessageBox.error("Technical error has occurred ", {
                            //                 details: err
                            //             });

                            //         }
                            //     });
                            // }
                            MessageBox.success(that.oBundle.getText("succJS"));
                        },
                        error: function (err) {
                            BusyIndicator.hide();
                            MessageBox.error("Technical error has occurred ", {
                                details: err
                            });

                        }
                    });

                } else {
                    MessageBox.error("Kindly fill the mandatory fields");
                }
            },
            onPressSuspendEdit: function () {
                this.getView().byId("idDatePickerSuspend").setEnabled(true);
                this.getView().byId("idDatePicker2Suspend").setEnabled(true);
                this.getView().byId("idButtonSuspendSave").setVisible(true);
                this.getView().byId("idButtonSuspendCancel").setVisible(true);
                this.getView().byId("idButtonSuspendEdit").setVisible(false);
            },
            onPressSuspendClear: function () {
                this.getView().byId("idButtonSuspendCancel").setVisible(false);
                this.getView().byId("idButtonSuspendSave").setVisible(false);
                this.getView().byId("idButtonSuspendEdit").setVisible(true);
                this.getView().byId("idDatePickerSuspend").setEnabled(false);
                this.getView().byId("idDatePicker2Suspend").setEnabled(false);
                this.getView().byId("idDatePicker2Suspend").setValueState("None");
                this.getView().byId("idDatePicker2Suspend").setValueState("None");
                //once data bindined remove
                this.getView().byId("idDatePickerSuspend").setDateValue("");
                this.getView().byId("idDatePicker2Suspend").setDateValue("");

            },
            onPressSuspendSave: function () {
                var oDateSuspendTo = this.getView().byId("idDatePickerSuspend").getDateValue(),
                    oDateSuspendFrom = this.getView().byId("idDatePicker2Suspend").getDateValue(),
                    xSuspendTo = oDateSuspendTo.toDateString().length,
                    resultTo = oDateSuspendTo.toDateString() + oDateSuspendTo.toString().substring(xSuspendTo, xSuspendTo + 9),
                    xSuspendFrom = oDateSuspendFrom.toDateString().length,
                    resultFrom = oDateSuspendFrom.toDateString() + oDateSuspendFrom.toString().substring(xSuspendFrom, xSuspendFrom + 9);
                if (oDateSuspendTo && oDateSuspendFrom) {
                    this.getView().byId("idInfoLabel").setText("Suspended");
                    this.getView().byId("idInfoLabel").setColorScheme(2);
                    this.getView().byId("idDatePickerSuspend").setEnabled(false);
                    this.getView().byId("idDatePicker2Suspend").setEnabled(false);
                    this.getView().byId("idButtonSuspendSave").setVisible(false);
                    this.getView().byId("idButtonSuspendEdit").setVisible(true);
                    this.getView().byId("idButtonSuspendCancel").setVisible(false);
                    this.getView().byId("idObjStatusS1").setText(resultFrom);
                    this.getView().byId("idObjStatusS2").setText(resultTo);
                } else {
                    MessageBox.error("Kindly fill the mandatory fields");
                }

            },
            onhandleChangeDP1Suspend: function (onEvent) {
                var oDateSuspendTo = this.getView().byId("idDatePickerSuspend").getDateValue(),
                    oDateSuspendFrom = this.getView().byId("idDatePicker2Suspend").getDateValue();
                if (oDateSuspendFrom <= oDateSuspendTo) {
                    this.getView().byId("idDatePicker2Suspend").setValueState("Error");
                }
                else {
                    this.getView().byId("idDatePicker2Suspend").setValueState("None");
                    // var suspendstarttime = this.getView().byId("idObjStatusS1");
                    // suspendstarttime.setText(this.getView().byId("idDatePickerSuspend").getValue());
                    // const date = new Date(this.getView().byId("idDatePickerSuspend").getValue());
                    // //  convert date to CST (Central Standard Time)
                    // suspendstarttime.setText(date.toLocaleString('en-US', {
                    //     timeZone: 'CST',
                    //     dateStyle: 'medium',
                    //     timeStyle: 'medium',
                    //   }));
                }
            },
            onhandleChangeDP2Suspend: function (onEvent) {
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
            onChangeDP2: function () {
                this.getView().byId("idDatePicker2Suspend").setValueState("None");
            },
            //*************Terminal Value Help */
            onHandleValueHelpTerminal: function (oEvent) {
                var oView = this.getView();
                // create dialog lazily
                if (!this.byId("idDialogTerminalF4")) {
                    // load asynchronous XML fragment
                    Fragment.load({
                        id: oView.getId(),
                        name: "marathon.pp.princingui.fragments.terminalF4",
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
            onPressTerminalSave: function (oEvent) {
                var oTerID = this.getView().byId("idInputTerminalID").getValue(),
                    oTerName = this.getView().byId("idInputTerminalName").getValue(), oJsonData,
                    isEnabled = this.getView().byId("idInputTerminalID").getEnabled(),
                    oDaily = this.getView().byId("idCheckBoxDaily").getSelected(),
                    oDemand = this.getView().byId("idCheckBoxOnDemand").getSelected(),
                    that = this;

                if (oTerID !== "" && oTerName !== "") {
                    BusyIndicator.show();
                    oJsonData = {
                        "Terminal": oTerID,
                        "TerminalName": oTerName,
                        "DailyJob": oDaily,
                        "OnDemandJob": oDemand
                    }
                    var oPayloadTer = JSON.stringify(oJsonData)
                    if (isEnabled === true) {
                        // this.openBusyDialog(this.oBundle.getText("placingOrder"));
                        this.oDataModelT.callFunction("/createTerminal", {
                            method: constants.httpPost,
                            urlParameters: {
                                createData: oPayloadTer
                            },
                            success: function (oData) {
                                BusyIndicator.hide();
                                if (oData.createTerminal.data[constants.INTZERO]) {
                                    MessageBox.success(that.oBundle.getText("terminalCreated", [oData.createTerminal.data[constants.INTZERO].data.Terminal]), { //, [oData.createTerminal.data[constants.INTZERO].data]
                                        onClose: function (sAction) {
                                            if (sAction === MessageBox.Action.OK) {
                                                that.onTerminalClose();
                                                that.getTerminalDetails();
                                            }
                                        }
                                    });
                                } else {
                                    MessageBox.error(oData.createTerminal.data.message);
                                }
                            },
                            error: function (err) {
                                BusyIndicator.hide();
                                MessageBox.error("Technical error has occurred ", {
                                    details: err
                                });

                            }
                        });
                    }
                    else {
                        var that = this;
                        // this.openBusyDialog(this.oBundle.getText("placingOrder"));
                        this.oDataModelT.callFunction("/updateTerminal", {
                            method: constants.httpPost,
                            urlParameters: {
                                createData: oPayloadTer,
                                terminal: oTerID,
                            },

                            success: function (oData) {
                                BusyIndicator.hide();
                                if (oData.updateTerminal.data[constants.INTZERO]) {
                                    MessageBox.success(that.oBundle.getText("savedSucc"));
                                    that.onTerminalClose();
                                    that.getTerminalDetails();
                                } else {
                                    MessageBox.error(oData.updateTerminal.data.message);
                                }

                            },
                            error: function (err) {
                                BusyIndicator.hide();
                                MessageBox.error("Technical error has occurred ", {
                                    details: err
                                });

                            }
                        });
                    }


                } else {
                    MessageBox.error("Kindly fill the mandatory fields");
                }
            },
            //*************Product Value Help */
            onHandleValueHelpProduct: function (oEvent) {
                var oView = this.getView();
                // create dialog lazily
                this._oValueHelpDialogListProd = sap.ui.xmlfragment("marathon.pp.princingui.fragments.productF4", this);
                oView.addDependent(this._oValueHelpDialogListProd);
                this._oValueHelpDialogListProd.open();
                // if (!this.byId("idDialogProductF4")) {
                //     // load asynchronous XML fragment
                //     Fragment.load({
                //         id: oView.getId(),
                //         name: "marathon.pp.princingui.fragments.productF4",
                //         controller: this
                //     }).then(function (oDialog) {
                //         oView.addDependent(oDialog);
                //         oDialog.open();
                //     });
                // } else {
                //     this.byId("idDialogProductF4").open();
                // }
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
            onPressProductSave: function () {

                BusyIndicator.show();
                var oProdID = this.getView().byId("idInputProductID").getValue(),
                    oProdName = this.getView().byId("idInputProductName").getValue(), oPayloadPro, oJsonData,
                    oInputStatus = this.getView().byId("idInputProductID").getEnabled();
                var that = this;
                if (oProdID !== "" && oProdName !== "") {
                    oJsonData = {
                        "Product": oProdID,
                        "ProductName": oProdName
                    }
                    var oPayloadPro = JSON.stringify(oJsonData)
                    if (oInputStatus === true) {
                        // this.openBusyDialog(this.oBundle.getText("placingOrder"));
                        this.oDataModelT.callFunction("/createProduct", {
                            method: constants.httpPost,
                            urlParameters: {
                                createData: oPayloadPro
                            },
                            success: function (oData) {
                                BusyIndicator.hide();
                                if (oData.createProduct.data[constants.INTZERO]) {
                                    MessageBox.success(that.oBundle.getText("productCreated", [oData.createProduct.data[constants.INTZERO].data.Product]), { //
                                        onClose: function (sAction) {
                                            if (sAction === MessageBox.Action.OK) {
                                                that.onProductClose();
                                                that.getProductDetails();
                                            }
                                        }
                                    });
                                } else {
                                    MessageBox.error(oData.createProduct.data.message);
                                }
                            },
                            error: function (err) {
                                BusyIndicator.hide();
                                MessageBox.error("Technical error has occurred ", {
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
                                if (oData.updateProduct.data[constants.INTZERO]) {
                                    MessageBox.success(that.oBundle.getText("savedSucc"));
                                    that.onProductClose();
                                    that.getProductDetails();
                                } else {
                                    MessageBox.error(oData.updateProduct.data.message);
                                }
                            },
                            error: function (err) {
                                BusyIndicator.hide();
                                MessageBox.error("Technical error has occurred ", {
                                    details: err
                                });

                            }
                        });
                    }

                } else {
                    MessageBox.error("Kindly fill the mandatory fields");
                }
            },
            /**
      * Method to close the Busy Dialog
      * @public
      */
            closeBusyDialog: function () {
                this._pBusyDialog.then(function (oBusyDialog) {
                    oBusyDialog.close();
                });
            },
            onFilterBarSearch: function (oEvent) {
                var sSearchQuery = this._oBasicSearchField.getValue(),
                    aSelectionSet = oEvent.getParameter("selectionSet");
                var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                    if (oControl.getValue()) {
                        switch (oControl.getName()) {
                            case "Customer ID":
                                aResult.push(new Filter({
                                    path: "Customer",
                                    operator: FilterOperator.Contains,
                                    value1: oControl.getValue()
                                }));
                                break;
                            case "Ship-To":
                                aResult.push(new Filter({
                                    path: "Shipto",
                                    operator: FilterOperator.Contains,
                                    value1: oControl.getValue()
                                }));
                                break;
                            case "Customer Name":
                                aResult.push(new Filter({
                                    path: "CustomerName",
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
                        new Filter({ path: "Customer", operator: FilterOperator.Contains, value1: sSearchQuery }),
                        new Filter({ path: "CustomerName", operator: FilterOperator.Contains, value1: sSearchQuery }),
                        new Filter({ path: "ShipTo", operator: FilterOperator.Contains, value1: sSearchQuery }),
                        new Filter({ path: "ShipToName", operator: FilterOperator.Contains, value1: sSearchQuery })
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
            _handleValueHelpSearchTerminal: function (oEvent) {

                var sQuery = oEvent.getParameter("value"), aFilters = [], aFiltersCombo = [];
                if (sQuery && sQuery.length > constants.INTZERO) {
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: "Terminal", operator: FilterOperator.Contains, value1: sQuery }),
                            new Filter({ path: "Terminalname", operator: FilterOperator.Contains, value1: sQuery })
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
            _handleValueHelpSearchProduct: function (oEvent) {

                var sQuery = oEvent.getParameter("value"), aFilters = [], aFiltersCombo = [];
                if (sQuery && sQuery.length > constants.INTZERO) {
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: "Product", operator: FilterOperator.Contains, value1: sQuery }),
                            new Filter({ path: "ProductName", operator: FilterOperator.Contains, value1: sQuery })
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
            handleChangeOnDemand: function (oEvent) {
                debugger;
                var oDTP = oEvent.getSource(),
				sValue = oEvent.getParameter("value"),
				bValid = oEvent.getParameter("valid");
                // oDTP.getId().setValue(sValue);
                
                //  convert date to CST (Central Standard Time)
                // suspendstarttime.setText(date.toLocaleString('en-US', {

                //     timeZone: 'CST',

                //     dateStyle: 'medium',

                //     timeStyle: 'medium',

                // }));
                // debugger;
                // var date = new Date(this.getView().byId("idDatePickerOnDemand").getValue()),
                // result = date.toDateString() + date.toString().substring(x, x + 9);
                // this.getView().byId("idDatePickerOnDemand").setValue(result);

            },
            //Suspend From
            handleChangeSuspensStartTime: function (oEvent) {
                this.getView().byId("idDatePicker2Suspend").setValueState("None");
                var suspendstarttime = this.getView().byId("idObjStatusS1");
                suspendstarttime.setText(this.getView().byId("idDatePickerSuspend").getValue());
                const date = new Date(this.getView().byId("idDatePickerSuspend").getValue());
                //  convert date to CST (Central Standard Time)
                suspendstarttime.setText(date.toLocaleString('en-US', {

                    timeZone: 'CST',

                    dateStyle: 'medium',

                    timeStyle: 'medium',

                }));

            },
            //Suspend End
            handleChangeSuspensEndTime: function (oEvent) {
                this.getView().byId("idDatePicker2Suspend").setValueState("None");
                var suspendendtime = this.getView().byId("idObjStatusS2");
                const date = new Date(this.getView().byId("idDatePicker2Suspend").getValue());
                //  convert date to CST (Central Standard Time)
                suspendendtime.setText(date.toLocaleString('en-US', {
                    timeZone: 'CST',
                    dateStyle: 'medium',
                    timeStyle: 'medium',
                }));

            },
            // Daily Processing Start Time
            handleChange: function (oEvent) {
                var showondailytime = this.getView().byId("idTextDailyST");
                showondailytime.setText(this.getView().byId("idTimePickerInput").getValue());
                const date = new Date(this.getView().byId("idTimePickerInput").getValue());
                //  convert date to CST (Central Standard Time)
                showondailytime.setText(date.toLocaleString('en-US', {
                    timeZone: 'CST',
                    dateStyle: 'medium',
                    timeStyle: 'medium',
                }));
            },
        });
    });