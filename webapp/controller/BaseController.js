sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/m/library",
	"sap/ui/core/routing/HashChanger"
], function (Controller, UIComponent, mobileLibrary, HashChanger) {
	"use strict";

	return Controller.extend("com.fnews.ui5.controller.BaseController", {

		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		setFilters: function (that, oCategoriesModel) {
			var oFilterModel = that.getOwnerComponent().getModel("filter");
			var oFilterData = oFilterModel.getData();
			var iOffset = window.location.href.search("\\?");
			if (iOffset >= 0) {
				var sParam = window.location.href.substr(iOffset + 1);
				iOffset = sParam.search("i=");
				if (iOffset >= 0) {
					sParam = sParam.substr(iOffset + 2);
					iOffset = sParam.search(/[^0-9]/);
					if (iOffset >= 0) {
						sParam = sParam.substr(0, iOffset);
					}
					sParam = "i/" + sParam;
				} else {
					sParam = "";
				}
			} else {
				var oHashChanger = HashChanger.getInstance();
				oHashChanger.init();
				sParam = oHashChanger.getHash();
			}
			var sHash = sParam;
			iOffset = sHash.search("h/");
			if (iOffset >= 0) {
				iOffset += 2;
				sHash = sHash.substr(iOffset);
				iOffset = sHash.search("/");
				if (iOffset >= 0) {
					sHash = sHash.substr(0, iOffset);
				}
				oFilterData.hours = parseInt(sHash, 10);
				oFilterData.filterText = that.getResourceBundle().getText("last") + " " + oFilterData.hours + " " + that.getResourceBundle().getText(
					"hours");
			}

			sHash = sParam;
			iOffset = sHash.search("c/");
			if (iOffset >= 0) {
				iOffset += 2;
				sHash = sHash.substr(iOffset);
				iOffset = sHash.search("/");
				if (iOffset >= 0) {
					sHash = sHash.substr(0, iOffset);
				}
				var aHashCategories = sHash.split("-");
				var aCategoriesData = that.getOwnerComponent().getModel("categories").getData();
				aCategoriesData.forEach(function (oCategory) {
					oCategory.selected = false;
					aHashCategories.forEach(function (sHashCategory) {
						if (sHashCategory === oCategory.id) {
							oCategory.selected = true;
							if (oFilterData.filterText.length > 0) {
								oFilterData.filterText += ", ";
							}
							oFilterData.filterText += that.getResourceBundle().getText(oCategory.gCat);
						}
					});
				});
				oCategoriesModel.refresh(true);
			}

			oFilterModel.refresh(true);
		},

		getBaseUrl: function () {
			var sUrl = window.location.href;
			var iOffset = sUrl.search("#/");
			if (iOffset >= 0) {
				sUrl = sUrl.substr(0, iOffset);
			}
			return sUrl;
		},

		getCustomData: function (oControl, sKey) {
			var sValue = "";
			oControl.getCustomData().forEach(function (oCustomData) {
				if (oCustomData.getProperty("key") === sKey) {
					sValue = oCustomData.getProperty("value");
				}
			});
			return sValue;
		}
	});

});