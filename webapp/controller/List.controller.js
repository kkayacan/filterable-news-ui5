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
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			sap.ui.core.BusyIndicator.show();

			var that = this;

			var oHashChanger = HashChanger.getInstance();
			oHashChanger.init();

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
				sParam = oHashChanger.getHash();
			}

			var oTrackData = {
				offset: 10,
				limit: 10,
				hash: sParam
			};
			this.setModel(new JSONModel(oTrackData), "track");

			var aNewsData = [];
			var oNewsModel = new JSONModel(aNewsData);
			this.getOwnerComponent().setModel(oNewsModel);

			var oApiModel = new JSONModel(this.getOwnerComponent().getModel("constants").getData().api_url + oTrackData.hash);
			this.getOwnerComponent().setModel(oApiModel, "api");
			oApiModel.attachRequestCompleted(function () {
				aNewsData = that.getOwnerComponent().getModel().getData();
				oApiModel.getData().forEach(function (oItem) {
					aNewsData.push(oItem);
				});
				oNewsModel.setData(aNewsData);
				oNewsModel.refresh(true);

				var iOffset = oTrackData.hash.search("i/");
				if (iOffset >= 0) {
					if (aNewsData.length > 0) {
						var oFilterModel = that.getOwnerComponent().getModel("filter");
						oFilterModel.getData().filterText = aNewsData[0].title;
						oFilterModel.refresh(true);
						document.title = aNewsData[0].title + " - [Top News]";
						/*
						$("head").append('<meta property=”og:title” content=”' + document.title + '” />');
						$("head").append('<meta property=”og:type” content=”website” />');
						$("head").append('<meta property=”og:url” content=”' + window.location.href + '” />');
						$("head").append('<meta property=”og:image” content=”' + aNewsData[0].urlToImage + '” />');
						*/
					}
				}

				sap.ui.core.BusyIndicator.hide();
			});

			oHashChanger.attachEvent("hashChanged", function (oEvent) {
				sap.ui.core.BusyIndicator.show();
				oTrackData = that.getModel("track").getData();
				oTrackData.offset = 10;
				oTrackData.limit = 10;
				oNewsModel = that.getModel();
				aNewsData = oNewsModel.getData();
				aNewsData = [];
				oNewsModel.setData(aNewsData);
				oTrackData.hash = oEvent.getParameter("newHash");
				that.getModel("api").loadData(that.getModel("constants").getData().api_url + oTrackData.hash);
				that.setFilters(that, that.getModel("categories"));
			});
		},

		onUpdateStarted: function (oEvent) {
			if (oEvent.getParameter("reason") === "Growing") {
				var oTrackData = this.getModel("track").getData();
				oTrackData.offset = (parseInt(oTrackData.offset, 10) + 10).toString();
				if (oTrackData.hash) {
					this.getModel("api").loadData(this.getModel("constants").getData().api_url + oTrackData.hash + "/o/" +
						oTrackData.offset + "/l/10");
				} else {
					this.getModel("api").loadData(this.getModel("constants").getData().api_url + "o/" +
						oTrackData.offset + "/l/10");
				}
			}
		},

		onSharePress: function (oEvent) {
			if (navigator.share) {
				navigator.share({
					title: this.getCustomData(oEvent.getSource(), "title"),
					url: this.getBaseUrl() + "?i=" + this.getCustomData(oEvent.getSource(), "id")
				});
			}
		}

	});
});