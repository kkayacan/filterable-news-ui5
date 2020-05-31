sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/core/routing/HashChanger"
], function (BaseController, JSONModel, formatter, HashChanger) {
	"use strict";

	return BaseController.extend("com.fnews.ui5.controller.Filters", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			var that = this;

			var oConstantsModel = this.getOwnerComponent().getModel("constants");
			oConstantsModel.attachRequestCompleted(function () {
				var sCategoriesUrl = this.getOwnerComponent().getModel("constants").getData().api_url.replace("news", "categories");
			});

			var sCategoriesUrl = this.getOwnerComponent().getModel("constants").getData().api_url.replace("news", "categories");

			//var sCategoriesUrl = "https://api.haber.keremkayacan.com/report/categories/";
			var oCategoriesModel = new JSONModel(sCategoriesUrl);
			this.getOwnerComponent().setModel(oCategoriesModel, "categories");
			oCategoriesModel.attachRequestCompleted(function () {
				that.setFilters(that, oCategoriesModel);
			});

		}

	});
});