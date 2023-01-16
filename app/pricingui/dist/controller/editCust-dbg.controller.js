/*&--------------------------------------------------------------------------------------*
 * File name                    	   : editCust.controller.js	                     *
 * Created By                          : NThapa@marathonpetroleum.com                   *            	
 * Created On                          : 17-Oct-2022                                	 *                           							                                         *
 * Purpose                             : Controller for editCust.view.xml to edit Customer/ShipTo  
 *                                                                                                    
 *---------------------------------------------------------------------------------------*
 */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/BusyIndicator",
    "sap/m/Token",
    "marathonpetroleum/hsc/pricingui/utils/constants",
    "sap/m/SearchField"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, JSONModel, Filter, FilterOperator, BusyIndicator, Token, constants, SearchField) {
        "use strict";
        return Controller.extend("marathonpetroleum.hsc.pricingui.controller.editCust", {
            /**
              * Method to initialize all models and global variables
              * @public
              */    
            onInit: function () {
                //fetch i18n model for text translation
                this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                //fetch the service model
                this.oDataModelE = this.getOwnerComponent().getModel();
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteEditView").attachPatternMatched(this.onRouteEditCustomer, this);
            },
            /**
      * Method for  Routing
      * @public
      */             
            onRouteEditCustomer: function () {
                var oModel = new JSONModel();
                var fgModel = this.getOwnerComponent().getModel("oModel");
                var aArray = fgModel.oData.selectedRow; 
                this.getView().byId("idInputCustomerID").setValue(aArray[constants.INTZERO].Customer);
                this.getView().byId("idInputCustomerName").setValue(aArray[constants.INTZERO].CustomerName);
                this.getView().byId("idInputShipToID").setValue(aArray[constants.INTZERO].ShipTo);
                this.getView().byId("idInputShipToName").setValue(aArray[constants.INTZERO].ShipToName);

                var tokenArray = [];
                if (aArray[constants.INTZERO].ProductList.length != constants.INTZERO) {
                    for (var i = constants.INTZERO; i < aArray[constants.INTZERO].ProductList.length; i++) {
                        var otokenProduct = new sap.m.Token({ key: aArray[constants.INTZERO].ProductList[i].Product, text: aArray[constants.INTZERO].ProductList[i].ProductName });
                        tokenArray.push(otokenProduct);
                    }
                    this.getView().byId("idMultiComboBoxProducts").setTokens(tokenArray);
                }
                oModel.setData({ "items": aArray[constants.INTZERO].EmailArray });
                //set model 
                this.getView().setModel(oModel, "detailModel");
                this.getView().byId("idInputEmail").setModel(oModel, "detailModel");
                this.getView().byId("idCheckBoxDaily").setSelected(aArray[constants.INTZERO].DailyJob);
                this.getView().byId("idCheckBoxOnDemand").setSelected(aArray[constants.INTZERO].OnDemandJob);
                this.getView().getModel("detailModel").setProperty("/ProductData", fgModel.oData.ProductData);
                
            },
            /**
      * Method to handle Save of create Customer 
      * @public 
      */                
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
                    var that = this;
                    var oPayloadCus = JSON.stringify(oJsonData)
                    this.oDataModelE.callFunction("/updateCustomer", {
                        method: constants.httpPost,
                        urlParameters: {
                            createData: oPayloadCus
                        },
                        success: function (oData) {
                            BusyIndicator.hide();
                            if (oData.updateCustomer !== undefined) {
                                MessageBox.success(that.oBundle.getText("savedSucc"), {
                                    onClose: function (sAction) {
                                        if (sAction === MessageBox.Action.OK) {
                                            that.onBack();
                                            BusyIndicator.hide();

                                        }
                                    }
                                });
                            } else {
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
                    BusyIndicator.hide();
                    MessageBox.error(that.oBundle.getText("errormsgrequired"));
                }
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
      * Method to validation on Email MutiInput
      * @public
      * @param {sap.ui.base.Event} oEvt An Event object consisting of an ID, a source and a map of parameter
      */              
            onEmailChangeEditCust: function (oEvt) {
                var oMultiInput1 = this.getView().byId("idInputEmail");
                var sVal = oEvt.getParameters().value;
                var fnValidator = function (args) {
                    var email = args.text;
                    // var eArr = email.split('@');
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
            /**
      * Method to handle the fragment ProductVH
      * @public
      */             
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

                this.oProductsModel = this.getView().getModel("detailModel");

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

                this._oValueHelpDialog.setTokens(this.getView().byId("idMultiComboBoxProducts").getTokens());
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
                        if (oControl.getName() === "Product ID") {
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
                this.getView().byId("idMultiComboBoxProducts").setTokens(aTokens);
                this._oValueHelpDialog.close();
            },
           /**
      * Method to handle cancel on ProductVH
      * @public
      * @param {sap.ui.base.Event} oEvent An Event object consisting of an ID, a source and a map of parameter
      */ 
            onValueHelpCancelPressProd: function () {
                this._oValueHelpDialog.close();
                this._oValueHelpDialog.destroy();
            },
           /**
      * Method to handle afterclose on ProductVH
      * @public
      * @param {sap.ui.base.Event} oEvent An Event object consisting of an ID, a source and a map of parameter
      */ 
            onValueHelpAfterClose: function () {
                this._oValueHelpDialog.destroy();
            },
        });
    });
