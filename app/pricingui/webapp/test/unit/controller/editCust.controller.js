/*global QUnit*/

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"demo/app/controller/editCust.controller",
	"sap/ui/base/ManagedObject",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (Controller, JSONModel,AppController, ManagedObject) {
	"use strict";
	QUnit.module("editCust Controller");
	QUnit.test("Should test onInit", function (assert) {
		var oAppController = new AppController();
		assert.ok(true, "this test is fine");
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
