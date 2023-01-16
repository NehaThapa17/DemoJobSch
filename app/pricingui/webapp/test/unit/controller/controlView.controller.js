/*global QUnit*/

sap.ui.define([
	"marathonpp/pricingui/controller/controlView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("controlView Controller");

	QUnit.test("I should test the controlView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
