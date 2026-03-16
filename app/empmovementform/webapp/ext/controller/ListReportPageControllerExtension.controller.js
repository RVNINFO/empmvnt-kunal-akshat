sap.ui.define([
    'sap/ui/core/mvc/ControllerExtension',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function (ControllerExtension, Filter, FilterOperator) {
	'use strict';

	return ControllerExtension.extend('com.syensqo.hr.empmovementform.ext.controller.ListReportPageControllerExtension', {
		override: {
			onInit: function () {
				this.base.getAppComponent().getRouter().getRoute("EmploymentMovementList").attachPatternMatched(async function () {
					var oModel = this.base.getExtensionAPI().getModel();

					var oListBinding = oModel.bindList("/EmploymentMovement");
					oListBinding.filter(new Filter("IsActiveEntity", "EQ", false));

					var aContexts = await oListBinding.requestContexts(0, 1);

					if (aContexts.length > 0) {
						var oAction = oModel.bindContext("/clearMyDrafts(...)");
						await oAction.execute("$auto");
					}
					this.base.getExtensionAPI().refresh();
				}.bind(this));
			}
		}
	});
});