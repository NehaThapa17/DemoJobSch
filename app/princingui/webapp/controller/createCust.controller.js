sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/BusyIndicator",
    "sap/ui/core/routing/Route",
    "sap/m/Token",
    "marathon/pp/princingui/utils/constants",
    "sap/m/SearchField"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, JSONModel, Fragment, Filter, FilterOperator, BusyIndicator, Route, Token, constants, SearchField) {
        "use strict";
        var aTokens;

        return Controller.extend("marathon.pp.princingui.controller.createCust", {
            onInit: function () {
                this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                this.oDataModel = this.getOwnerComponent().getModel();
                // var fgModel = this.getOwnerComponent().getModel("oModel");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RoutecreateView").attachPatternMatched(this.onRouteCustomer, this);
                var oModel = new JSONModel();

                var oItemData = [];
                oModel.setData(oItemData);
                this.getView().setModel(oModel, "oCustModel");
                // this.getView().getModel("oCustModel").setProperty("/CustValHelp", fgModel.oData.CustValHelp);
                // this.getView().getModel("oCustModel").setProperty("/ProductData", fgModel.oData.ProductData);
                this.getCustomerDetails2();
                this.getF4Product2();
            },
            getCustomerDetails2: function () {
                var that = this;
                debugger;
                this.oDataModel.callFunction("/getOnPremCustomerF4", {
                    method: 'GET',
                    success: function (oData) {
                        that.getView().getModel("oCustModel").setProperty("/CustValHelp", oData.getOnPremCustomerF4.data);
                        BusyIndicator.hide();
                    },
                    error: function (err) {
                        BusyIndicator.hide();
                        MessageBox.error("errorTechnical", {
                            details: err
                        });

                    }
                })
            },
            getF4Product2: function () {
                var that = this;
                this.oDataModel.callFunction("/getOnPremProductDetails", {
                    method: 'GET',
                    success: function (oData) {
                        debugger;
                        that.getView().getModel("oCustModel").setProperty("/ProductData", oData.getOnPremProductDetails.data);
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
            onRouteCustomer: function () {
                this.getView().byId("idInputCustomerIDAdd").setValue(""),
                    this.getView().byId("idInputCustomerNameAdd").setValue(""),
                    this.getView().byId("idInputSHAdd").setValue(""),
                    this.getView().byId("idInputSHNameAdd").setValue(""),
                    this.getView().byId("idMultiComboBoxProductsAdd").removeAllTokens(),
                    this.getView().byId("idInputEmailAdd").removeAllTokens(),
                    this.getView().byId("daily_distribution").setSelected(false),
                    this.getView().byId("on_demand_distribution").setSelected(false);
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
            handleConfirm: function (oEvt) {
                // reset the filter
                var oBinding = oEvt.getSource().getBinding("items");
                oBinding.filter([]);
                var aContexts = oEvt.getParameter("selectedContexts");
                if (aContexts && aContexts.length) {
                    this.getView().byId("idInputCustomerIDAdd").setValue(aContexts.map(function (oContext) { return oContext.getObject().Customer; }));
                    this.getView().byId("idInputCustomerNameAdd").setValue(aContexts.map(function (oContext) { return oContext.getObject().CustomerName; }));
                    this.getView().byId("idInputSHAdd").setValue(aContexts.map(function (oContext) { return oContext.getObject().Shipto; }));
                    this.getView().byId("idInputSHNameAdd").setValue(aContexts.map(function (oContext) { return oContext.getObject().ShiptoName; }));
                    // var v = aContexts.map(function (oContext) { return oContext.getObject().Customer; });
                }
            },
            handleClose: function () {

            },
            onValueHelpRequestedcust: function (oEvent) {
                var oView = this.getView();
                // create dialog lazily
                if (!this.byId("openDialog")) {
                    // load asynchronous XML fragment
                    Fragment.load({
                        id: oView.getId(),
                        name: "marathon.pp.princingui.fragments.customerF4",
                        controller: this
                    }).then(function (oDialog) {
                        // connect dialog to the root view
                        //of this component (models, lifecycle)
                        oView.addDependent(oDialog);
                        oDialog.open();
                    });
                } else {
                    this.byId("openDialog").open();
                }
            },
            onValueHelpCancelPress: function () {
                this.byId("openDialog").close();
            },
            onBack: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RoutecontrolView");
            },
            onSaveCustomer: function () {
                BusyIndicator.show();
                var oCustID = this.getView().byId("idInputCustomerIDAdd").getValue(),
                    oCustName = this.getView().byId("idInputCustomerNameAdd").getValue(),
                    oSh = this.getView().byId("idInputSHAdd").getValue(),
                    oSHName = this.getView().byId("idInputSHNameAdd").getValue(),
                    oProd = this.getView().byId("idMultiComboBoxProductsAdd").getTokens(),
                    oEmail = this.getView().byId("idInputEmailAdd").getTokens(), that = this,
                    oDaily = this.getView().byId("daily_distribution").getSelected(), oProdArray = [],
                    oDemand = this.getView().byId("on_demand_distribution").getSelected(), oEmailString = "";
                if (oCustID !== "" && oCustName !== "" && oSh !== "" && oSHName !== "" && oProd.length !== constants.INTZERO && oEmail.length !== constants.INTZERO) {
                    for (var i = constants.INTZERO; i < oProd.length; i++) {
                        var objProd = {
                            "Customer": oCustID,
                            "ShipTo": oSh,
                            "Product": oProd[i].getKey()
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
                    var oPayloadCus = JSON.stringify(oJsonData)
                    this.oDataModel.callFunction("/createCustomer", {
                        method: constants.httpPost,
                        urlParameters: {
                            createData: oPayloadCus
                        },
                        success: function (oData) {
                            BusyIndicator.hide();
                            // if(oData.createCustomer != undefined)
                            // {
                            if (oData.createCustomer.data[constants.INTZERO]) {
                                MessageBox.success(that.oBundle.getText("customerCreated", [oData.createCustomer.data[constants.INTZERO].data.Customer]), {
                                    onClose: function (sAction) {
                                        if (sAction === MessageBox.Action.OK) {
                                            that.onBack();
                                        }
                                    }
                                });
                            }
                            else {
                                MessageBox.error(oData.createCustomer.data.message);
                            }
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
            onProductsValueHelpRequestedAdd: function () {
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
                this.oProductsModel = this.getView().getModel("oCustModel");
                //***Delete Start */
                // var oF4Data = {
                //     "productF4": [{
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
                //***Delete ENd */
                this.oColModel.setData(aCols);
                this._oValueHelpDialog = sap.ui.xmlfragment("marathon.pp.princingui.fragments.productListVH", this);
                this.getView().addDependent(this._oValueHelpDialog);
                // Set Basic Search for FilterBar
                var oFilterBar = this._oValueHelpDialog.getFilterBar();
                oFilterBar.setFilterBarExpanded(false);
                oFilterBar.setBasicSearch(this._oBasicSearchField);

                // Trigger filter bar search when the basic search is fired
                this._oBasicSearchField.attachSearch(function () {
                    oFilterBar.search();
                });
                this._oValueHelpDialog.getTableAsync().then(function (oTable) {
                    oTable.setModel(this.oProductsModel);
                    oTable.setModel(this.oColModel, "columns");

                    if (oTable.bindRows) {
                        oTable.bindAggregation("rows", "/ProductData");
                    }

                    if (oTable.bindItems) {
                        oTable.bindAggregation("items", "/ProductData", function () {
                            return new ColumnListItem({
                                cells: aCols.map(function (column) {
                                    return new Label({ text: "{" + column.template + "}" });
                                })
                            });
                        });
                    }
                    this._oValueHelpDialog.update();
                }.bind(this));


                this._oValueHelpDialog.open();
            },
            onFilterBarSearchProd: function (oEvent) {
                var sSearchQuery = this._oBasicSearchField.getValue(),
                    aSelectionSet = oEvent.getParameter("selectionSet");
                var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                    if (oControl.getValue()) {
                        if (oControl.getName() === "Product ID") {
                            aResult.push(new Filter({
                                path: "Product",
                                operator: FilterOperator.Contains,
                                value1: oControl.getValue()
                            }));
                        } else if (oControl.getName() === "Product Name") {
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
                this.getView().byId("idMultiComboBoxProductsAdd").setTokens(aTokens);
                this._oValueHelpDialog.close();
            },
            onValueHelpCancelPressProd: function () {
                this._oValueHelpDialog.close();
                this._oValueHelpDialog.destroy();
            },
            onEmailChangeAddCust: function (oEvt) {
                var oMultiInput1 = this.getView().byId("idInputEmailAdd");
                var sVal = oEvt.getParameters().value;
                var fnValidator = function (args) {
                    var email = args.text;
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
            onEmailEnter: function (oEvent) {
                debugger;
                if (oEvent.getSource().getValue().includes('\n')) {
                    this.onEmailChangeAddCust(oEvent);
                }
            }
            // onBackCancel: function(){
            //     debugger;
            //     var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            //     oRouter.navTo("RoutecontrolView", {
            //         Data: "Cancel"
            //     });
            // }

        });
    });
