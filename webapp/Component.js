sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"./model/models",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, Device, models, JSONModel) {
	"use strict";
	return UIComponent.extend("com.fnews.ui5.Component", {
		metadata: {
			manifest: "json"
		},
		init: function () {
			UIComponent.prototype.init.apply(this, arguments);
			this.setModel(models.createDeviceModel(), "device");

			this.setModel(new JSONModel({
				hours: 3,
				filterText: this.getModel("i18n").getResourceBundle().getText("last") + " 3 " + this.getModel("i18n").getResourceBundle().getText(
					"hours")
			}), "filter");

			this.setModel(new JSONModel({
				showChains: false
			}), "view");

		}
	});
});