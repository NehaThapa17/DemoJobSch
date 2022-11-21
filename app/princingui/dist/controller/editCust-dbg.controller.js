sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/BusyIndicator",
    "sap/ui/core/routing/Route",
    "marathon/pp/princingui/utils/constants",
    "sap/m/SearchField"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, JSONModel, Fragment, Filter, FilterOperator, BusyIndicator, Route, constants,SearchField) {
        "use strict";

        return Controller.extend("marathon.pp.princingui.controller.editCust", {
            onInit: function () {
                this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                this.oDataModelE = this.getOwnerComponent().getModel();
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteEditView").attachPatternMatched(this.onRouteEditCustomer, this);
                

            },
            onRouteEditCustomer: function (oEvent) {
               
                var oModel = new JSONModel();
                var aArray = JSON.parse(oEvent.getParameter("arguments").Data);
                this.getView().byId("idInputCustomerID").setValue(aArray[constants.INTZERO].Customer);
                this.getView().byId("idInputCustomerName").setValue(aArray[constants.INTZERO].CustomerName);
                this.getView().byId("idInputShipToID").setValue(aArray[constants.INTZERO].ShipTo);
                this.getView().byId("idInputShipToName").setValue(aArray[constants.INTZERO].ShipToName);

                var tokenArray = [];
                if (aArray[constants.INTZERO].ProductList.length != constants.INTZERO) {
                    for (var i = constants.INTZERO; i < aArray[constants.INTZERO].ProductList.length; i++) {
                        var otokenProduct = new sap.m.Token({ key: aArray[constants.INTZERO].ProductList[i].Product, text: aArray[constants.INTZERO].ProductList[i].ProductName });
                        tokenArray = [otokenProduct];
                    }
                    this.getView().byId("idMultiComboBoxProducts").setTokens(tokenArray);
                }
                oModel.setData({ "items": aArray[constants.INTZERO].EmailArray });
                this.getView().setModel(oModel, "detailModel");
                this.getView().byId("idInputEmail").setModel(oModel, "detailModel");
                this.getView().byId("idCheckBoxDaily").setSelected(aArray[constants.INTZERO].DailyJob);
                this.getView().byId("idCheckBoxOnDemand").setSelected(aArray[constants.INTZERO].OnDemandJob);
                this.getF4Product2();
            },
            getF4Product2: function () {
                var that = this;
                this.oDataModelE.callFunction("/getOnPremProductF4", {
                    method: 'GET',
                    success: function (oData) {
                        debugger;
                        that.getView().getModel("detailModel").setProperty("/ProductValHelp", oData.getOnPremProductF4.data);
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
            handleSearch: function (oEvent) {
                var sQuery = oEvent.getParameter("value");
                var aFilters = [], aFiltersCombo = [];
                if (sQuery && sQuery.length > constants.INTZERO) {
                aFilters.push(new Filter({
                    filters: [
                        new Filter({ path: "Customer", operator: FilterOperator.Contains, value1: sQuery }),
                        new Filter({ path: "CustomerName", operator: FilterOperator.Contains, value1: sQuery }),
                        new Filter({ path: "Shipto", operator: FilterOperator.Contains, value1: sQuery }),
                        new Filter({ path: "ShiptoName", operator: FilterOperator.Contains, value1: sQuery })
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
            onPressSaveEditCust: function () {
                var oCustID = this.getView().byId("idInputCustomerID").getValue(),
                    oCustName = this.getView().byId("idInputCustomerName").getValue(),
                    oSh = this.getView().byId("idInputShipToID").getValue(),
                    oSHName = this.getView().byId("idInputShipToName").getValue(),
                    oProd = this.getView().byId("idMultiComboBoxProducts").getTokens(),
                    oEmail = this.getView().byId("idInputEmail").getTokens(), that = this,
                    oDaily = this.getView().byId("idCheckBoxDaily").getSelected(), oProdArray = [],
                    oDemand = this.getView().byId("idCheckBoxOnDemand").getSelected(), oEmailString = "";
                if (oCustID !== "" && oCustName !== "" && oSh !== "" && oSHName !== "" && oProd.length !== constants.INTZERO && oEmail.length !== constants.INTZERO) {
                    BusyIndicator.show();
                    for (var i = constants.INTZERO; i < oProd.length; i++) {
                        var objProd = {
                            "Customer": oCustID,
                            "ShipTo": oSh,
                            "Product": oProd[i].getKey(),
                            "ProductName": oProd[i].getText()
                        };
                        oProdArray.push(objProd);
                    }
                    for (var j = constants.INTZERO; j < oEmail.length; j++) {
                        var objEmail = oEmail[j].getKey();
                        if (j === constants.INTZERO) {
                            oEmailString = objEmail;
                        } else {
                            oEmailString = oEmailString + ";" + objEmail;
                        }

                    }
                    var oJsonData = {
                        "Customer": oCustID,
                        "ShipTo": oSh,
                        "CustomerName": oCustName,
                        "ShipToName": oSHName,
                        "DailyJob": oDaily,
                        "OnDemandJob": oDemand,
                        "EmailTo": oEmailString,
                        "ProductList": oProdArray
                    }
                    var that = this;
                    var oPayloadCus = JSON.stringify(oJsonData)
                    this.oDataModelE.callFunction("/updateCustomer", {
                        method: constants.httpPost,
                        urlParameters: {
                            createData: oPayloadCus
                        },
                        success: function (oData) {
                            if(oData.createCustomer.data[constants.INTZERO]){
                            MessageBox.success(that.oBundle.getText("savedSucc"), {
                                onClose: function (sAction) {
                                    if (sAction === MessageBox.Action.OK) {
                                        that.onBack();
                                        BusyIndicator.hide();

                                    }
                                }
                            });
                        } else {
                            MessageBox.error(oData.createCustomer.data.message); 
                        }
                        }
                    });
                } else {
                    MessageBox.error("Kindly fill the mandatory fields");
                }
            },
            onBack: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RoutecontrolView");
            },
            onEmailChangeEditCust: function () {
                var oMultiInput1 = this.getView().byId("idInputEmail");
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
            },
            onProductsValueHelpRequested: function () {
                this._oBasicSearchField = new SearchField();
                this.oColModel = new JSONModel();
                var aCols = {
                    "cols": [
                        {
                            "label": "Product ID",
                            "template": "Product",
                        },
                        {
                            "label": "Product Name",
                            "template": "ProductName"
                        }
                    ]
                };
                
                this.oProductsModel  = this.getView().getModel("detailModel");
                //Delete//
                // var oF4Data = {
                //     "ProductValHelp": [{
                //         "Customer": "4725",
                //         "ShipTo": "4726",
                //         "Product": "1286",
                //         "ProductName": "ARCO PREMIUM GAS EXP MX",
                //         "Selected": "X"
                //     },
                //     {
                //         "Customer": "4725",
                //         "ShipTo": "4726",
                //         "Product": "1287",
                //         "ProductName": "CLEAR PREMIUM GAS EXP MX",
                //         "Selected": "X"
                //     }
                //     ]
                // }
                // this.oProductsModel = new JSONModel();
                // this.oProductsModel.setData(oF4Data);
                //
                this.oColModel.setData(aCols);
                this._oValueHelpDialog = sap.ui.xmlfragment("marathon.pp.princingui.fragments.productListVH", this);
                this.getView().addDependent(this._oValueHelpDialog);
	// Set Basic Search for FilterBar
    var oFilterBar = this._oValueHelpDialog.getFilterBar();
    oFilterBar.setFilterBarExpanded(false);
    oFilterBar.setBasicSearch(this._oBasicSearchField);

    // Trigger filter bar search when the basic search is fired
    this._oBasicSearchField.attachSearch(function() {
        oFilterBar.search();
    });
                this._oValueHelpDialog.getTableAsync().then(function (oTable) {
                    oTable.setModel(this.oProductsModel);
                    oTable.setModel(this.oColModel, "columns");

                    if (oTable.bindRows) {
                        oTable.bindAggregation("rows", "/ProductValHelp");
                    }

                    if (oTable.bindItems) {
                        oTable.bindAggregation("items", "/ProductValHelp", function () {
                            return new ColumnListItem({
                                cells: aCols.map(function (column) {
                                    return new Label({ text: "{" + column.template + "}" });
                                })
                            });
                        });
                    }
                    this._oValueHelpDialog.update();
                }.bind(this));

                this._oValueHelpDialog.setTokens(this.getView().byId("idMultiComboBoxProducts").getTokens());
                this._oValueHelpDialog.open();
            },
            onFilterBarSearchProd: function (oEvent) {
                var sSearchQuery = this._oBasicSearchField.getValue(),
                    aSelectionSet = oEvent.getParameter("selectionSet");
                var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                    if (oControl.getValue()) {
                        if(oControl.getName() === "Product ID"){
                        aResult.push(new Filter({
                            path: "Product",
                            operator: FilterOperator.Contains,
                            value1: oControl.getValue()
                        }));
                        } else if(oControl.getName() === "Product Name"){
                            aResult.push(new Filter({
                                path: "ProductName",
                                operator: FilterOperator.Contains,
                                value1: oControl.getValue()
                            }));
                            }
                    }
                    return aResult;
                }, []);
                aFilters.push(new Filter({
                    filters: [
                        new Filter({ path: "Product", operator: FilterOperator.Contains, value1: sSearchQuery }),
                        new Filter({ path: "ProductName", operator: FilterOperator.Contains, value1: sSearchQuery })
                    ],
                    and: false
                }));
                this._filterTable(new Filter({
                    filters: aFilters,
                    and: true
                }));
            },
            _filterTable: function (oFilter) {
                var oVHD = this._oValueHelpDialog;
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
            onValueHelpOkPressProd: function (oEvent) {
                var aTokens = oEvent.getParameter("tokens");
                this.getView().byId("idMultiComboBoxProducts").setTokens(aTokens);
                this._oValueHelpDialog.close();
            },

            onValueHelpCancelPressProd: function () {
                this._oValueHelpDialog.close();
                this._oValueHelpDialog.destroy();
            },

            onValueHelpAfterClose: function () {
                this._oValueHelpDialog.destroy();
            },
        });
    });
