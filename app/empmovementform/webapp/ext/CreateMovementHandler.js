sap.ui.define([
    'sap/ui/core/Fragment',
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/core/Item',
    'sap/m/MessageBox'
], function (Fragment, JSONModel, Filter, FilterOperator, Item, MessageBox) {
    'use strict';

    var FRAGMENT_ID = 'createMovementDialog';

    function getSelectionModel() {
        return new JSONModel({
            personType: 'candidate',
            personName: '',
            movementTypeId: ''
        });
    }

    function bindMovementTypeItems(oSelect) {
        oSelect.bindItems({
            path: '/ValueHelp',
            filters: [new Filter('type', FilterOperator.EQ, 'cust_movementtype')],
            template: new Item({
                key: '{ID}',
                text: '{name}'
            })
        });
    }

    function isUsableModel(oModel) {
        return !!(oModel && typeof oModel.bindList === 'function');
    }

    function resolveModelFromContext(oContext) {
        var oModel = null;
        var oSource;

        // 1) FE action context can directly expose getModel()
        if (oContext && typeof oContext.getModel === 'function') {
            try {
                oModel = oContext.getModel();
                if (isUsableModel(oModel)) {
                    return oModel;
                }
            } catch (e) {
                // Continue with fallbacks
            }
        }

        // 2) FE extension API wrapper
        if (oContext && typeof oContext.getExtensionAPI === 'function') {
            try {
                var oExtApi = oContext.getExtensionAPI();
                if (oExtApi && typeof oExtApi.getModel === 'function') {
                    oModel = oExtApi.getModel();
                    if (isUsableModel(oModel)) {
                        return oModel;
                    }
                }
            } catch (e) {
                // Continue with fallbacks
            }
        }

        // 3) Event source model
        if (oContext && typeof oContext.getSource === 'function') {
            try {
                oSource = oContext.getSource();
                if (oSource && typeof oSource.getModel === 'function') {
                    oModel = oSource.getModel();
                    if (isUsableModel(oModel)) {
                        return oModel;
                    }
                }
            } catch (e) {
                // Continue with fallbacks
            }
        }

        // 3b) Resolve model from owner component of the source control
        if (oSource && sap.ui && sap.ui.core && sap.ui.core.Component && typeof sap.ui.core.Component.getOwnerComponentFor === 'function') {
            try {
                var oOwnerComponent = sap.ui.core.Component.getOwnerComponentFor(oSource);
                if (oOwnerComponent && typeof oOwnerComponent.getModel === 'function') {
                    oModel = oOwnerComponent.getModel();
                    if (isUsableModel(oModel)) {
                        return oModel;
                    }
                }
            } catch (e) {
                // Continue with fallbacks
            }
        }

        // 4) View/Controller context
        if (oContext && typeof oContext.getView === 'function') {
            try {
                var oView = oContext.getView();
                if (oView && typeof oView.getModel === 'function') {
                    oModel = oView.getModel();
                    if (isUsableModel(oModel)) {
                        return oModel;
                    }
                }
            } catch (e) {
                // Continue with fallbacks
            }
        }

        return null;
    }

    function getI18nModel(oContext) {
        var oI18nModel = null;

        try {
            oI18nModel = sap.ui.getCore().getModel('i18n');
        } catch (e) {
            // Continue with fallbacks
        }

        if (!oI18nModel && oContext && typeof oContext.getSource === 'function') {
            try {
                var oSource = oContext.getSource();
                if (oSource && typeof oSource.getModel === 'function') {
                    oI18nModel = oSource.getModel('i18n');
                }
            } catch (e) {
                // Continue with fallbacks
            }
        }

        if (!oI18nModel) {
            try {
                var aComps = sap.ui.core.Component.registry.all();
                for (var i = 0; i < aComps.length; i++) {
                    var oComp = aComps[i];
                    if (oComp && typeof oComp.getModel === 'function') {
                        var oModel = oComp.getModel('i18n');
                        if (oModel) {
                            oI18nModel = oModel;
                            break;
                        }
                    }
                }
            } catch (e) {
                // Keep null if not found
            }
        }

        return oI18nModel;
    }

    return {
        createMovement: async function (oContext, aSelectedContexts) {
            // Get the OData model - try context-aware approach first
            var oModel = null;

            oModel = resolveModelFromContext(oContext);

            // Approach 1: Get default model from sap.ui.getCore()
            if (!oModel) {
                try {
                    oModel = sap.ui.getCore().getModel('empmovement') || sap.ui.getCore().getModel();
                    if (isUsableModel(oModel)) {
                        // Success
                    } else {
                        oModel = null;
                    }
                } catch (e) {
                    // Continue to next approach
                }
            }

            // Approach 2: Try from binding context if available
            if (!oModel && oContext) {
                try {
                    if (typeof oContext.getModel === 'function') {
                        oModel = oContext.getModel();
                    }
                } catch (e) {
                    // Continue
                }
            }

            // Approach 2b: If handler receives an event object, read model from source control
            if (!oModel && oContext) {
                try {
                    if (typeof oContext.getSource === 'function') {
                        var oSource = oContext.getSource();
                        if (oSource && typeof oSource.getModel === 'function') {
                            oModel = oSource.getModel();
                        }
                    }
                } catch (e) {
                    // Continue
                }
            }

            // Approach 3: Search through all components for ListReport
            if (!oModel) {
                try {
                    var aComps = sap.ui.core.Component.registry.all();
                    for (var i = 0; i < aComps.length; i++) {
                        var oComp = aComps[i];
                        if (oComp && typeof oComp.getModel === 'function') {
                            var oCompModel = oComp.getModel();
                            if (isUsableModel(oCompModel)) {
                                oModel = oCompModel;
                                break;
                            }
                        }
                    }
                } catch (e) {
                    // Continue
                }
            }

            // Approach 4: Scan existing views for a default OData V4 model
            if (!oModel) {
                try {
                    var aViews = sap.ui.core.mvc.View.registry.all();
                    for (var j = 0; j < aViews.length; j++) {
                        var oView = aViews[j];
                        if (oView && typeof oView.getModel === 'function') {
                            var oViewModel = oView.getModel();
                            if (isUsableModel(oViewModel)) {
                                oModel = oViewModel;
                                break;
                            }
                        }
                    }
                } catch (e) {
                    // Continue
                }
            }

            if (!oModel) {
                MessageBox.error('Unable to determine the data model for the create flow.');
                return;
            }

            var oSelectionModel = getSelectionModel();
            var oDialog;
            var oI18nModel = getI18nModel(oContext);

            var oDialogController = {
                onConfirmCreate: async function () {
                    var sPersonName = (oSelectionModel.getProperty('/personName') || '').trim();
                    var sPersonType = oSelectionModel.getProperty('/personType');
                    var sMovementTypeId = oSelectionModel.getProperty('/movementTypeId');

                    if (!sPersonName || !sMovementTypeId) {
                        MessageBox.warning('Select a candidate/employee name and movement type before creating the record.');
                        return;
                    }

                    var oPayload = {
                        movementType_ID: sMovementTypeId,
                        employee: sPersonType === 'employee' ? sPersonName : '',
                        candidate: sPersonType === 'candidate' ? sPersonName : ''
                    };

                    try {
                        var oListBinding = oModel.bindList('/EmploymentMovement');
                        var oCreatedContext = oListBinding.create(oPayload);

                        if (typeof oModel.submitBatch === 'function') {
                            await oModel.submitBatch('$auto');
                        }
                        await oCreatedContext.created();

                        var sCanonicalPath = null;
                        if (typeof oCreatedContext.requestCanonicalPath === 'function') {
                            sCanonicalPath = await oCreatedContext.requestCanonicalPath();
                        } else if (typeof oCreatedContext.getPath === 'function') {
                            sCanonicalPath = oCreatedContext.getPath();
                        }

                        oDialog.close();
                        oDialog.destroy();
                        if (sCanonicalPath) {
                            window.location.hash = sCanonicalPath.replace(/^\//, '');
                        }
                    } catch (oError) {
                        MessageBox.error('Create failed: ' + (oError && oError.message ? oError.message : oError));
                    }
                },

                onCancelCreate: function () {
                    oDialog.close();
                    oDialog.destroy();
                }
            };

            oDialog = await Fragment.load({
                id: FRAGMENT_ID,
                name: 'com.syensqo.hr.empmovementform.ext.fragments.CreateMovementDialog',
                controller: oDialogController
            });

            oDialog.setModel(oModel);
            oDialog.setModel(oSelectionModel, 'dialog');
            if (oI18nModel) {
                oDialog.setModel(oI18nModel, 'i18n');
            }
            bindMovementTypeItems(Fragment.byId(FRAGMENT_ID, 'movementTypeSelect'));

            oDialog.open();
        }
    };
});
