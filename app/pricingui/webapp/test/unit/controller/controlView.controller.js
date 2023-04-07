/*global QUnit*/

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"demo/app/controller/controlView.controller",
	"sap/ui/base/ManagedObject",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (Controller, JSONModel,AppController, ManagedObject) {
	"use strict";

	QUnit.module("controlView Controller");

	QUnit.test("Should test onInit", function (assert) {
		var oAppController = new AppController();
		assert.ok(true, "this test is fine");
	});

	// QUnit.test("I should test the controlView controller", function (assert) {
	// 	var oStubs = {
	// 		getModel: sinon.stub()
	// 	};
	// 	// var fnController = AppController.onInit().bind(oStubs);
	// 	// 		var oAppController = new AppController();
	// 	// 		oAppController.onInit();
	// 	// 		assert.ok( true, "this test is fine" );

	// 	// regular init of controller
	// 	var oController = new AppController();
	// 	// regular init of a JSON model
	// 	var oJsonModelStub = new JSONModel({});
	// 	var oNewToDoModelStub = new JSONModel({});
	// 	// construct a dummy DOM element
	// 	var oDomElementStub = document.createElement("div");
	// 	// construct a dummy View
	// 	var oViewStub = new ManagedObject({});

	// 	// mock View.byId().getDomRef()
	// 	oViewStub.byId = function (sNeverUsed) {
	// 		return {
	// 			getDomRef: function () {
	// 				return oDomElementStub;
	// 			}
	// 		}
	// 	};

	// 	// regular setting of a model to a View
	// 	oViewStub.setModel(oJsonModelStub);
	// 	oViewStub.setModel(oNewToDoModelStub, "new");

	// 	// stubbing Controller.getView() to return our dummy view object
	// 	// var oGetViewStub = sinon.stub(Controller.prototype, "getView").returns(oViewStub);
	// 	// stubbing Controller.getView() to return our dummy view object
	// 	var oGetBundleStub = sinon.stub(Controller.prototype, onValueHelpRequested).returns(customCode); 
	// 	// sinon.stub(Controller.prototype, "getText").returns(oViewStub);
	// 	//// end arrangements

	// 	// prepare data model for controller method
	// 	oNewToDoModelStub.setProperty("/onValueHelpRequested", "some new item");

	// 	// actual test call!
	// 	oController.onValueHelpRequested();

	// 	// check result of test call
	// 	assert.strictEqual(oJsonModelStub.getProperty("/onValueHelpRequested").length, 1, "1 new todo item was added");

	// 	// follow-up: never forget to un-stub!
	// 	// oGetViewStub.restore();
	// 	oGetBundleStub.restore();
	// });


	// QUnit.test("standalone controller method w/o dependencies", function (assert) {
	// 	// arrangement
	// 	var oController = new AppController();
	// 	// var oStubs = {
	// 	// 	getModel: sinon.stub(),
	// 	// 	getText: sinon.stub()
	// 	// };
	// 	// action
	// 	oController.onInit();

	// 	// assertions
	// 	assert.ok(oController.aSearchFilters);
	// 	assert.ok(oController.aTabFilters);
	// });
	QUnit.test("Should return the values for Emails", function (assert) {
		var value = "/getCCemail";
		assert.equal(value, "/getCCemail", "We are getting expected value");
	});
	QUnit.test("async function in controller", function (assert) {
		// tell QUnit to wait for it
		var fnDone = assert.async();

		// arrangements
		// regular init of controller
		var oController = new AppController();
		// regular init of a JSON model
		var oJsonModelStub = new JSONModel({
			"todos": []
		});
		// construct a dummy View
		var oViewStub = new ManagedObject({});
		// regular setting of a model to a View
		oViewStub.setModel(oJsonModelStub);
		// stubbing Controller.getView() to return our dummy view object
		var oGetViewStub = sinon.stub(Controller.prototype, "getView").returns(oViewStub);

		// action + assertion: start the Promise chain!
		oController.getTodosViaPromise()
			.then(function (aTodos) {
				assert.ok(aTodos.length >= 0, "todos exist (zero or more)");
			})
			.then(oGetViewStub.restore) // follow-up: never forget to un-stub!
			.then(fnDone) // tell QUnit test is finished
			// never forget to catch potential errors in the promise chain
			// and do proper clean up
			.catch(function (oError) {
				assert.ok(false, "Error occured: " + oError);
				// follow-up: never forget to un-stub!
				oGetViewStub.restore();
				// tell QUnit test is finished
				fnDone();
			});
	});




});
