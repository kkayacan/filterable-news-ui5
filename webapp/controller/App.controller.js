sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator"
], function (BaseController, JSONModel, BusyIndicator) {
	"use strict";

	return BaseController.extend("com.fnews.ui5.controller.App", {

		onInit: function () {
			this.byId("SplitApp").toDetail(this.createId("detail"));
		},

		onSearch: function () {
			BusyIndicator.show();
			this.getModel().setData([]);
			var i = 0;
			var oFilterData = this.getModel("filter").getData();
			oFilterData.urlParamString = "";
			oFilterData.apiParamString = "";
			oFilterData.offset = oFilterData.defaultOffset;
			oFilterData.dynamicFilters.categories.forEach(function (oCategory) {
				if (oCategory.hasOwnProperty("selected") && oCategory.selected === true) {
					i++;
					if (i === 1) {
						oFilterData.urlParamString = "c=" + oCategory.id;
						oFilterData.apiParamString = "/c/" + oCategory.id;
					} else {
						oFilterData.urlParamString = oFilterData.urlParamString + "-" + oCategory.id;
						oFilterData.apiParamString = oFilterData.apiParamString + "-" + oCategory.id;
					}
				}
			});
			if (oFilterData.urlParamString.length > 0) {
				oFilterData.urlParamString += "&";
			}
			oFilterData.urlParamString = oFilterData.urlParamString + "h=" + oFilterData.hours;
			oFilterData.apiParamString = oFilterData.apiParamString + "/h/" + oFilterData.hours;
			this.getModel("api").loadData(this.getModel("constants").getData().api_url + oFilterData.apiParamString);
			var sNewUrl = this.buildUrl(oFilterData.urlParamString);
			window.history.pushState({
				path: sNewUrl
			}, "", sNewUrl);
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