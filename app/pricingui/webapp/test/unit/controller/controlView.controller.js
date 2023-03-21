/*global QUnit*/

sap.ui.define([
	"marathonpetroleum/hsc/pricingui/controller/controlView.controller",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/base/ManagedObject",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (AppController,Controller,JSONModel,ManagedObject) {
	"use strict";

	// QUnit.module("controlView Controller");

// 	QUnit.test("I should test the controlView controller", function (assert) {
// 		var oStubs = {
// 			getModel: sinon.stub()
// 		};
// // var fnController = AppController.onInit().bind(oStubs);
// // 		var oAppController = new AppController();
// // 		oAppController.onInit();
// // 		assert.ok( true, "this test is fine" );

// 		// regular init of controller
// 		var oController = new AppController();
// 		// regular init of a JSON model
// 		var oJsonModelStub = new JSONModel({});
// 		var oNewToDoModelStub = new JSONModel({});
// 		// construct a dummy DOM element
// 		var oDomElementStub = document.createElement("div");
// 		// construct a dummy View
// 		var oViewStub = new ManagedObject({});

// 		// mock View.byId().getDomRef()
// 		oViewStub.byId = function (sNeverUsed) {
// 			return {
// 				getDomRef: function () {
// 					return oDomElementStub;
// 				}
// 			}
// 		};

// 		// regular setting of a model to a View
// 		oViewStub.setModel(oJsonModelStub);
// 		oViewStub.setModel(oNewToDoModelStub, "new");

// 		// stubbing Controller.getView() to return our dummy view object
// 		var oGetViewStub = sinon.stub(Controller.prototype, "getView").returns(oViewStub);
// 		//// end arrangements

// 		// prepare data model for controller method
// 		oNewToDoModelStub.setProperty("/onValueHelpRequested", "some new item");

// 		// actual test call!
// 		oController.onValueHelpRequested();

// 		// check result of test call
// 		assert.strictEqual(oJsonModelStub.getProperty("/onValueHelpRequested").length, 1, "1 new todo item was added");

// 		// follow-up: never forget to un-stub!
// 		oGetViewStub.restore();
// 	});

// 	QUnit.module("getCCEmails Module");
// 	QUnit.test("Should return the values for Emails",function(assert){
		
// 		assert.ok(AppController.getCCEmails());
// 	})

});
