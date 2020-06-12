sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"./model/models",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator"
], function (UIComponent, Device, models, JSONModel, BusyIndicator) {
	"use strict";
	return UIComponent.extend("com.fnews.ui5.Component", {
		metadata: {
			manifest: "json"
		},
		init: function () {
			UIComponent.prototype.init.apply(this, arguments);
			BusyIndicator.show();
			this.createClientModels();
			this.parseUrlParameters();
			var oConstantsModel = new JSONModel("model/constants.json");
			this.setModel(oConstantsModel, "constants");
			oConstantsModel.attachRequestCompleted(function () {
				this.fetchDynamicFilters();
				this.createApiModel();
			}.bind(this));
		},

		createClientModels: function () {
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(new JSONModel({
				showChains: false
			}), "view");
			this.setModel(new JSONModel({
				urlParamString: "",
				urlParams: [],
				apiParamString: "",
				filterText: "",
				defaultOffset: 20,
				offset: 20,
				limit: 10,
				hours: 24
			}), "filter");
			this.setModel(new JSONModel([]));
		},

		fetchDynamicFilters: function () {
			var sFiltersUrl = this.getModel("constants").getData().api_url.replace("news", "filters");
			var oDynamicFiltersModel = new JSONModel();
			oDynamicFiltersModel.attachRequestCompleted(function () {
				var oFilterModel = this.getModel("filter");
				oFilterModel.getData().dynamicFilters = oDynamicFiltersModel.getData();
				oFilterModel.refresh(true);
			}.bind(this));
			oDynamicFiltersModel.loadData(sFiltersUrl);
		},

		parseUrlParameters: function () {
			var iOffset = window.location.href.search("\\?");
			if (iOffset >= 0) {
				var oFilterData = this.getModel("filter").getData();
				oFilterData.urlParamString = window.location.href.substr(iOffset + 1);
				oFilterData.apiParamString = "";
				var aUrlParams = oFilterData.urlParamString.split("&");
				aUrlParams.forEach(function (oParam) {
					iOffset = oParam.search("=");
					if (iOffset === 1) {
						oFilterData.urlParams.push({
							"key": oParam.substr(0, 1),
							"value": oParam.substr(2)
						});
						oFilterData.apiParamString = oFilterData.apiParamString + "/" + oParam.substr(0, 1) + "/" + oParam.substr(2);
					}
				});
			}
		},

		createApiModel: function () {
			var sUrl = this.getModel("constants").getData().api_url + this.getModel("filter").getData().apiParamString;
			var oApiModel = new JSONModel(sUrl);
			this.setModel(oApiModel, "api");
			oApiModel.attachRequestCompleted(this.onStoriesRequestCompleted.bind(this));
		},

		onStoriesRequestCompleted: function () {
			var oNewsModel = this.getModel();
			var aNewsData = oNewsModel.getData();
			var oApiData = this.getModel("api").getData();
			oApiData.stories.forEach(function (oStory) {
				aNewsData.push(oStory);
			});
			this.setFilters(oApiData);
			oNewsModel.refresh(true);
			BusyIndicator.hide();
		},

		setFilters: function (oApiData) {
			var oFilterModel = this.getModel("filter");
			var oFilterData = oFilterModel.getData();
			if (oApiData.appliedFilters.hasOwnProperty("h")) {
				oFilterData.hours = parseInt(oApiData.appliedFilters.h, 10);
				oFilterData.filterText = this.getText("last") + " " + oFilterData.hours + " " + this.getText("hours");
			}
			oFilterData.dynamicFilters.categories.forEach(function (oCategory) {
				oCategory.selected = false;
				if (oApiData.appliedFilters.hasOwnProperty("categories")) {
					oApiData.appliedFilters.categories.forEach(function (oAppliedCategory) {
						if (oAppliedCategory === oCategory.id) {
							oCategory.selected = true;
							if (oFilterData.filterText.length > 0) {
								oFilterData.filterText += ", ";
							}
							oFilterData.filterText += this.getText(oCategory.gCat);
						}
					}.bind(this));
				}
			}.bind(this));
			if (oApiData.appliedFilters.hasOwnProperty("i")) {
				oFilterData.filterText = oApiData.stories[0].title;
			}
			oFilterModel.refresh(true);
		},

		getText: function (sKey) {
			return this.getModel("i18n").getResourceBundle().getText(sKey);
		}
	});
});