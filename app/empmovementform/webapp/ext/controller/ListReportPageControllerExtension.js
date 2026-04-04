sap.ui.define([
    'sap/ui/core/mvc/ControllerExtension',
    'sap/ui/core/Fragment',
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/core/Item',
    'sap/m/MessageBox'
], function (ControllerExtension, Fragment, JSONModel, Filter, FilterOperator, Item, MessageBox) {
    'use strict';

    var DIALOG_FRAGMENT = 'com.syensqo.hr.empmovementform.ext.fragments.CreateMovementDialog';

    return ControllerExtension.extend('com.syensqo.hr.empmovementform.ext.controller.ListReportPageControllerExtension', {
        _createDialog: null,
        _createDialogModel: null,

        _getDialogId: function () {
            return this.base.getView().getId() + '--createMovementDialog';
        },

        _getSelectionModel: function () {
            return new JSONModel({
                personType: 'candidate',
                personName: '',
                movementTypeId: ''
            });
        },

        _bindMovementTypeItems: function () {
            var oSelect = Fragment.byId(this._getDialogId(), 'movementTypeSelect');
            if (!oSelect) {
                return;
            }

            oSelect.bindItems({
                path: '/ValueHelp',
                filters: [new Filter('type', FilterOperator.EQ, '1')],
                template: new Item({
                    key: '{ID}',
                    text: '{name}'
                })
            });
        },

        createMovement: async function () {
            var oModel = this.base.getExtensionAPI().getModel();
            if (!oModel) {
                MessageBox.error('Unable to determine the data model for the create flow.');
                return;
            }

            if (!this._createDialog) {
                this._createDialog = await Fragment.load({
                    id: this._getDialogId(),
                    name: DIALOG_FRAGMENT,
                    controller: this
                });
                this.base.getView().addDependent(this._createDialog);
                this._bindMovementTypeItems();
            }

            this._createDialogModel = this._getSelectionModel();
            this._createDialog.setModel(oModel);
            this._createDialog.setModel(this._createDialogModel, 'dialog');
            this._createDialog.open();
        },

        onConfirmCreate: async function () {
            var oModel = this.base.getExtensionAPI().getModel();
            var sPersonType = this._createDialogModel.getProperty('/personType');
            var sPersonName = (this._createDialogModel.getProperty('/personName') || '').trim();
            var sMovementTypeId = this._createDialogModel.getProperty('/movementTypeId');

            if (!sPersonName || !sMovementTypeId) {
                MessageBox.warning('Select a candidate/employee name and movement type before creating the record.');
                return;
            }

            try {
                var oListBinding = oModel.bindList('/EmploymentMovement');
                var oCreatedContext = oListBinding.create({
                    movementType_ID: sMovementTypeId,
                    employee: sPersonType === 'employee' ? sPersonName : '',
                    candidate: sPersonType === 'candidate' ? sPersonName : ''
                });

                await oModel.submitBatch('$auto');
                await oCreatedContext.created();

                this.onCancelCreate();
                this.base.getExtensionAPI().getRouting().navigateToContext(oCreatedContext);
            } catch (oError) {
                MessageBox.error('Create failed: ' + (oError && oError.message ? oError.message : oError));
            }
        },

        onCancelCreate: function () {
            if (this._createDialog) {
                this._createDialog.close();
            }
        },

        override: {
            onInit: function () {
                var oInitModel = this.base.getExtensionAPI().getModel();
                if (oInitModel) {
                    sap.ui.getCore().setModel(oInitModel, 'empmovement');
                }

                this.base.getAppComponent().getRouter().getRoute("EmploymentMovementList").attachPatternMatched(async function () {
                    var oModel = this.base.getExtensionAPI().getModel();
                    sap.ui.getCore().setModel(oModel, 'empmovement');
                    this.base.getExtensionAPI().refresh();
                }.bind(this));
            }
        }
    });
});