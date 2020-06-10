sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/core/routing/HashChanger"
], function (BaseController, JSONModel, formatter, HashChanger) {
	"use strict";

	return BaseController.extend("com.fnews.ui5.controller.List", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the controller is instantiated.
		 * @public
		 */
		onInit: function () {

		},

		onAfterRendering: function () {
			var aPanels = sap.ui.getCore().byFieldGroupId("panelHeader");
			for (var i = 0; i < aPanels.length; i++) {
				aPanels[i].attachBrowserEvent("mousedown", function (oEvent) {
					if (!oEvent.target.getAttribute("id").includes("icon")) {
						if (typeof this.getParent().setExpanded === 'function') {
							this.getParent().setExpanded(!this.getParent().getExpanded());
						}
					}
				});
			}
		},

		onUpdateStarted: function (oEvent) {
			if (oEvent.getParameter("reason") === "Growing") {
				var oFilterData = this.getModel("filter").getData();
				this.getModel("api").loadData(this.getModel("constants").getData().api_url + oFilterData.apiParamString + "/o/" +
					oFilterData.offset + "/l/" + oFilterData.limit);
				oFilterData.offset = (parseInt(oFilterData.offset, 10) + 10);
			}
		},

		onDetailPress: function (oEvent) {
			window.open(this.buildUrl("i=" + this.getCustomData(oEvent.getSource(), "id")), "_blank");
		},

		onSharePress: function (oEvent) {
			if (navigator.share) { //eslint-disable-line
				navigator.share({
					title: this.getCustomData(oEvent.getSource(), "title"),
					url: this.buildUrl("i=" + this.getCustomData(oEvent.getSource(), "id"))
				});
			}
		}

	});
});