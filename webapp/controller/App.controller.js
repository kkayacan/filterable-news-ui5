sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/HashChanger"
], function (BaseController, JSONModel, HashChanger) {
	"use strict";

	return BaseController.extend("com.fnews.ui5.controller.App", {

		onInit: function () {
			this.byId("SplitApp").toDetail(this.createId("detail"));
		},

		onAfterRendering: function () {
			var that = this;
			var aPanels = sap.ui.getCore().byFieldGroupId("panelHeader");
			for (var i = 0; i < aPanels.length; i++) {
				aPanels[i].attachBrowserEvent("mousedown", function () {
					if (typeof this.getParent().setExpanded === 'function') {
						this.getParent().setExpanded(!this.getParent().getExpanded());
					}
				});
			}

			var aDetailLinks = sap.ui.getCore().byFieldGroupId("detailLink");
			for (i = 0; i < aDetailLinks.length; i++) {
				aDetailLinks[i].attachBrowserEvent("mousedown", function (oEvent) {
					var sUrl = that.getBaseUrl();
					sUrl = sUrl + "?i=" + that.getCustomData(this, "id");
					window.open(sUrl, "_blank");
				});
			}
		},

		onSearch: function () {
			var sHash = "";
			var i = 0;
			var oCategoriesData = this.getModel("categories").getData();
			oCategoriesData.forEach(function (oItem) {
				if (oItem.hasOwnProperty("selected") && oItem.selected === true) {
					i++;
					if (i === 1) {
						sHash = "c/" + oItem.id;
					} else {
						sHash = sHash + "-" + oItem.id;
					}
				}
			});
			if (sHash.length > 0) {
				sHash = sHash + "/";
			}
			sHash = sHash + "h/" + this.getModel("filter").getData().hours;
			HashChanger.getInstance().replaceHash(sHash);
			this.byId("SplitApp").toDetail(this.createId("detail"));
		},

		onToMaster: function () {
			this.byId("SplitApp").toMaster(this.createId("master"));
		},

		onShowChains: function () {
			var oViewModel = this.getModel("view");
			var oViewData = oViewModel.getData();
			if (oViewData.showChains) {
				oViewData.showChains = false;
			} else {
				oViewData.showChains = true;
			}
			oViewModel.refresh(true);
		},

		onScrollToTop: function () {
			this.byId("detail").scrollTo(0, 1000);
		}
	});

});