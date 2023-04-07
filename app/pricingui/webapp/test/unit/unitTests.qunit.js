/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"demo/app/test/unit/AllTests",
		"sap/ui/thirdparty/sinon",
	    "sap/ui/thirdparty/sinon-qunit"
	], function () {
		QUnit.start();
	});
});
