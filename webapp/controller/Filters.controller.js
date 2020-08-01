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
		 * Called when the controller is instantiated.
		 * @public
		 */
		onAfterRendering: function () {
			this.getModel("filter").getData().oTopicInput = this.byId("topicInput");
		}

	});
});