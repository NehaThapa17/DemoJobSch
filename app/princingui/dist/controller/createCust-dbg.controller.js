/*&--------------------------------------------------------------------------------------*
 * File name                    	   : createCust.controller.js	                     *
 * Created By                          : NThapa@marathonpetroleum.com                   *            	
 * Created On                          : 17-Oct-2022                                	 *                           							                                         *
 * Purpose                             : Controller for createCust.view.xml to save Customer/ShipTo  
 *                                                                                                    
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
    "sap/m/Token",
    "marathon/pp/princingui/utils/constants",
    "sap/m/SearchField"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, JSONModel, Fragment, Filter, FilterOperator, BusyIndicator, Token, constants, SearchField) {
        "use strict";
        return Controller.extend("marathon.pp.princingui.controller.createCust", {
            /**
              * Method to initialize all models and global variables
              * @public
              */            
            onInit: function () {
                //fetch i18n model for text translation
                this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                //fetch the service model
                this.oDataModel = this.getOwnerComponent().getModel();
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RoutecreateView").attachPatternMatched(this.onRouteCustomer, this);
                var oModel = new JSONModel();
                var oItemData = [];
                oModel.setData(oItemData);
                //set model 
                this.getView().setModel(oModel, "oCustModel");
                // this.getCustomerDetails2();
                // this.getF4Product2();
            },
            getCustomerDetails2: function () {
                var that = this;
                debugger;
                this.oDataModel.callFunction("/getOnPremCustomerF4", {
                    method: constants.httpGet,
                    success: function (oData) {
                        that.getView().getModel("oCustModel").setProperty("/CustValHelp", oData.getOnPremCustomerF4.data);
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
            getF4Product2: function () {
                var that = this;
                this.oDataModel.callFunction("/getOnPremProductDetails", {
                    method: constants.httpGet,
                    success: function (oData) {
                        
                        that.getView().getModel("oCustModel").setProperty("/ProductData", oData.getOnPremProductDetails.data);
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
      * Method for  Routing
      * @public
      */            
            onRouteCustomer: function () {
                var pvModel = this.getOwnerComponent().getModel("oModel");
                console.log(pvModel);
                this.getView().getModel("oCustModel").setProperty("/CustValHelp", pvModel.oData.CustValHelp);
                this.getView().getModel("oCustModel").setProperty("/ProductData", pvModel.oData.ProductData);
                this.getView().byId("idInputCustomerIDAdd").setValue(""),
                    this.getView().byId("idInputCustomerNameAdd").setValue(""),
                    this.getView().byId("idInputSHAdd").setValue(""),
                    this.getView().byId("idInputSHNameAdd").setValue(""),
                    this.getView().byId("idMultiComboBoxProductsAdd").removeAllTokens(),
                    this.getView().byId("idInputEmailAdd").removeAllTokens(),
                    this.getView().byId("daily_distribution").setSelected(false),
                    this.getView().byId("on_demand_distribution").setSelected(false);
            },
            /**
      * Method to handle search on Customer F4 
      * @public
      * @param {sap.ui.base.Event} oEvent An Event object consisting of an ID, a source and a map of parameter
      */            
            handleSearch: function (oEvent) {
                var sQuery = oEvent.getParameter("value");
                var aFilters = [], aFiltersCombo = [];
                if (sQuery && sQuery.length > constants.INTZERO) {
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: constants.pathCus, operator: FilterOperator.Contains, value1: sQuery }),
                            new Filter({ path: constants.pathCName, operator: FilterOperator.Contains, value1: sQuery }),
                            new Filter({ path: constants.pathSH2, operator: FilterOperator.Contains, value1: sQuery }),
                            new Filter({ path: constants.pathSHName2, operator: FilterOperator.Contains, value1: sQuery })
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
      * Method to handle confirm on Customer F4 
      * @public
      * @param {sap.ui.base.Event} oEvt An Event object consisting of an ID, a source and a map of parameter
      */               
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
            /**
      * Method to open fragment Customer F4 
      * @public
      */               
            onValueHelpRequestedcust: function () {
                var oView = this.getView();
                // create dialog lazily
                if (!this.byId("openDialog")) {
                    // load asynchronous XML fragment
                    Fragment.load({
                        id: oView.getId(),
                        name: constants.fargmentCusF4,
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
            /**
      * Method to navigate Back through navigation
      * @public
      */               
            onBack: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RoutecontrolView");
            },
            /**
      * Method to handle Save of create Customer 
      * @public 
      */               
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
                            oEmailString = oEmailString + constants.spliter + objEmail;
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

                            if (oData.createCustomer.data) {
                                MessageBox.success(that.oBundle.getText("customerCreated", [oData.createCustomer.data.Customer,oData.createCustomer.data.ShipTo]), {
                                    onClose: function (sAction) {
                                        if (sAction === MessageBox.Action.OK) {
                                            that.onBack();
                                        }
                                    }
                                });
                            }
                            else {
                                MessageBox.error(that.oBundle.getText("techError"));
                            }
                        },
                        error: function (err) {
                            BusyIndicator.hide();
                            MessageBox.error(that.oBundle.getText("techError"), {
                                details: err
                            });

                        }
                    });
                } else {
                    MessageBox.error(that.oBundle.getText("errormsgrequired"));
                }
            },
            /**
      * Method to handle the fragment ProductVH
      * @public
      */               
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
                this.oColModel.setData(aCols);
                this._oValueHelpDialog = sap.ui.xmlfragment(constants.fragmentProdVH, this);
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
            /**
      * Method to handle search on Product F4 
      * @public
      * @param {sap.ui.base.Event} oEvent An Event object consisting of an ID, a source and a map of parameter
      */               
            onFilterBarSearchProd: function (oEvent) {
                var sSearchQuery = this._oBasicSearchField.getValue(),
                    aSelectionSet = oEvent.getParameter("selectionSet");
                var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                    if (oControl.getValue()) {
                        if (oControl.getName() === constants.prodID) {
                            aResult.push(new Filter({
                                path: constants.pathProd,
                                operator: FilterOperator.Contains,
                                value1: oControl.getValue()
                            }));
                        } else if (oControl.getName() === constants.prodName) {
                            aResult.push(new Filter({
                                path: constants.pathProdName,
                                operator: FilterOperator.Contains,
                                value1: oControl.getValue()
                            }));
                        }
                    }
                    return aResult;
                }, []);
                aFilters.push(new Filter({
                    filters: [
                        new Filter({ path: constants.pathProd, operator: FilterOperator.Contains, value1: sSearchQuery }),
                        new Filter({ path: constants.pathProdName, operator: FilterOperator.Contains, value1: sSearchQuery })
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
            /**
      * Method to handle confirm on ProductVH
      * @public
      * @param {sap.ui.base.Event} oEvent An Event object consisting of an ID, a source and a map of parameter
      */               
            onValueHelpOkPressProd: function (oEvent) {
                var aTokens = oEvent.getParameter("tokens");
                this.getView().byId("idMultiComboBoxProductsAdd").setTokens(aTokens);
                this._oValueHelpDialog.close();
            },
            onValueHelpCancelPressProd: function () {
                this._oValueHelpDialog.close();
                this._oValueHelpDialog.destroy();
            },
            /**
      * Method to validation on Email MutiInput
      * @public
      * @param {sap.ui.base.Event} oEvt An Event object consisting of an ID, a source and a map of parameter
      */               
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
                if (oEvent.getSource().getValue().includes('\n')) {
                    this.onEmailChangeAddCust(oEvent);
                }
            }
        });
    });
