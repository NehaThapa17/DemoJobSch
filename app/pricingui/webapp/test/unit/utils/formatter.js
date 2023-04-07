/*global QUnit*/

sap.ui.define([
	"demo/app/utils/formatter",
    "sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (formatter) {
	"use strict";

	QUnit.module("icon Formatter Module");
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

	QUnit.module("status Formatter Module");
    function visibleTestCase(oOptions) {
		// Act
		var sState = formatter.getStatus(oOptions.count);

		// Assert
		oOptions.assert.strictEqual(sState, oOptions.expected, "The visibility was updated");
	}
    QUnit.test("Should change the visibility to false based on count", function (assert) {
		visibleTestCase.call(this, {
			assert: assert,
			count: 0,
			expected: false
		});
	});
	QUnit.test("Should change the visibility to true based on count", function (assert) {
		visibleTestCase.call(this, {
			assert: assert,
			count: 1,
			expected: true
		});
	});
	QUnit.module("email Formatter Module");
    function emailFormatCase(oOptions) {
		// Act
		var sState = formatter.getStatus(oOptions.email);

		// Assert
		oOptions.assert.strictEqual(sState, oOptions.expected, "The email was formatted");
	}
    QUnit.test("Should change the visibility to false based on count", function (assert) {
		emailFormatCase.call(this, {
			assert: assert,
			email: 'abc@marathonpetroleum.com ;xyz@marathonpetroleum.com ;test123@marathonpetroleum.com',
			expected: true
		});
	});
});
