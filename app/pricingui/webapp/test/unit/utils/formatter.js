/*global QUnit*/

sap.ui.define([
	"marathonpetroleum/hsc/pricingui/utils/formatter",
    "sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (formatter) {
	"use strict";

	QUnit.module("Icon Module");
    function stateTestCase(oOptions) {
		// Act
		var sState = formatter.getIconOrder(oOptions.state);

		// Assert
		oOptions.assert.strictEqual(sState, oOptions.expected, "The state was correct");
	}
    QUnit.test("Should format the state with value to accept icon", function (assert) {
		stateTestCase.call(this, {
			assert: assert,
			state: true,
			expected: "sap-icon://accept"
		});
	});
    QUnit.test("Should format the state with no value to no icon", function (assert) {
		stateTestCase.call(this, {
			assert: assert,
			state: "",
			expected: ""
		});
	});

	QUnit.module("Status Module");
    function visibleTestCase(oOptions) {
		// Act
		var sState = formatter.getStatus(oOptions.count);

		// Assert
		oOptions.assert.strictEqual(sState, oOptions.expected, "The state was correct");
	}
    QUnit.test("Should change the visibility based on count", function (assert) {
		visibleTestCase.call(this, {
			assert: assert,
			count: 0,
			expected: false
		});
	});
});
