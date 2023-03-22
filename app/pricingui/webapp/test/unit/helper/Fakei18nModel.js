sap.ui.define([
    "sap/ui/model/Model"
], function (Model) {
    "use strict";
    return Model.extend("test.unit.helper.Fakei18nModel", {
        constructor: function (mTexts) {
            Model.call(this);
            this.mTexts = mTexts || {};
        },
        getResourceBundle: function () {
            return {
                getText: function () {
                    return this.mTexts[sTextsName];
                }.bind(this)
            };
        }
    });
}
);