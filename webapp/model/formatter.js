sap.ui.define([], function () {
	"use strict";
	return {

		getI18nValue: function (sKey) {
			if (sKey !== undefined) {
				return this.getView().getModel("i18n").getResourceBundle().getText(sKey);
			} else {
				return "";
			}
		},

		buildCategoryText: function (aCategories) {
			var that = this;
			var sCategories;
			var i = 0;
			aCategories.forEach(function (oCategory) {
				i++;
				var sCategory = that.getOwnerComponent().getModel("i18n").getResourceBundle().getText(oCategory.gCat);
				if (i === 1) {
					sCategories = sCategory;
				} else {
					sCategories = sCategories + " | " + sCategory;
				}
			});
			return sCategories;
		}

	};
});