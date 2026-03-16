sap.ui.define([
    "sap/fe/core/PageController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], function (PageController, JSONModel, MessageToast, MessageBox, Fragment) {
    "use strict";

    const CHARACTER_LIMITS = [
        { id: "moveReferenceNumberInput", path: "moveReferenceNumber", label: "Move Request Reference Number", limit: 8 },
        { id: "addressLineInput", path: "addressLine", label: "Address Line", limit: 256 },
        { id: "postCodeInput", path: "postCode", label: "Post Code", limit: 8 },
        { id: "cityInput", path: "city", label: "City", limit: 256 }
    ];

    const REQUIRED_FIELDS = [
        { path: "employee", label: "Employee Name" },
        { path: "movementType_ID", label: "Movement Type" },
        { path: "policy_ID", label: "Policy" },
        { path: "estimatedStartDate", label: "Estimated Start Date" },
        { path: "estimatedEoADate", label: "Estimated EoA Date" },
        { path: "taxSensitiveRolesFormCompleted", label: "Tax Sensitive Roles Form Completed", type: "boolean" },
        { path: "newEndDate", label: "New End Date" },
        { path: "program_ID", label: "Program" },
        { path: "phase_ID", label: "Phase" },
        { path: "requestDescription", label: "Request Description" },
        { path: "hrResponsible", label: "HR Responsible" },
        { path: "employeeCanBeContactedByExternalProviders", label: "Employee Can Be Contacted By External Providers", type: "boolean" },
        { path: "dateOfBirth", label: "Date Of Birth" },
        { path: "countryOfBirth_code", label: "Country Of Birth" },
        { path: "nationality", label: "Nationality" },
        { path: "addressLine", label: "Address Line" },
        { path: "postCode", label: "Post Code" },
        { path: "city", label: "City" },
        { path: "country_code", label: "Country" },
        { path: "phoneNumber", label: "Phone Number" },
        { path: "civiNumber", label: "CIVI Number" },
        { path: "socialSecurityNumber", label: "Social Security Number" },
        { path: "passportNumber", label: "Passport Number" },
        { path: "duration", label: "Duration", type: "number" },
        { path: "desiredDepartureDate", label: "Desired Departure Date" },
        { path: "purposeOfMissionFR", label: "Purpose Of Mission (FR)" },
        { path: "positionNameFR", label: "Position Name (FR)" },
        { path: "hostCompanyAddress", label: "Host Company Address" },
        { path: "hostCompanyPhoneNumber", label: "Host Company Phone Number" },
        { path: "personResponsibleForCandidateInHostCompany", label: "Person Responsible In Host Company" },
        { path: "personResponsibleForCandidateInFrance", label: "Person Responsible In France" },
        { path: "purchaseOrder", label: "Purchase Order" },
        { path: "numberOfDependents", label: "Number Of Dependents", type: "number" },
        { path: "numberOfChildren", label: "Number Of Children", type: "number" },
        { path: "familyStatus_ID", label: "Family Status" },
        { path: "homeCompanyCar", label: "Home Company Car", type: "boolean" },
        { path: "hostCountry_code", label: "Host Country" },
        { path: "hostCompany", label: "Host Company" },
        { path: "hostSite", label: "Host Site" },
        { path: "hostBusinessUnit", label: "Host Business Unit" },
        { path: "hostCostCenter", label: "Host Cost Center" },
        { path: "hostPayGrade", label: "Host Pay Grade" },
        { path: "hostCompanyCar", label: "Host Company Car", type: "boolean" }
    ];

    return PageController.extend("com.syensqo.hr.empmovementform.controller.EmploymentMovementObjectPage", {

        onInit: function () {
            PageController.prototype.onInit.apply(this, arguments);

            this.getView().setModel(
                new JSONModel({ isEditable: false }),
                "ui"
            );

            this.getView().attachModelContextChange(async function () {

                const oContext = this.getView().getBindingContext();
                if (!oContext) return;

                const oObject = await oContext.requestObject();
                if (!oObject) return;

                const bIsActive = oObject.IsActiveEntity;

                // active → display
                // draft → edit
                this.getView().getModel("ui").setProperty("/isEditable", !bIsActive);
                this._syncCharacterLimitValueStates(oObject);

            }.bind(this));
        },

        _getCharacterLimitConfigByControl: function (oControl) {
            var sLocalId = this.getView().getLocalId(oControl.getId()) || oControl.getId();
            return CHARACTER_LIMITS.find(function (oConfig) {
                return oConfig.id === sLocalId;
            });
        },

        _applyCharacterLimitValueState: function (oControl, oConfig, sValue) {
            var iLength = (sValue || "").length;

            if (iLength > oConfig.limit) {
                oControl.setValueState("Error");
                oControl.setValueStateText(
                    oConfig.label + " can have at most " + oConfig.limit + " characters (current: " + iLength + ")."
                );
                return true;
            }

            oControl.setValueState("None");
            oControl.setValueStateText("");
            return false;
        },

        onLimitedFieldLiveChange: function (oEvent) {
            var oControl = oEvent.getSource();
            var oConfig = this._getCharacterLimitConfigByControl(oControl);
            if (!oConfig) {
                return;
            }

            this._applyCharacterLimitValueState(oControl, oConfig, oEvent.getParameter("value"));
        },

        _syncCharacterLimitValueStates: function (oData) {
            CHARACTER_LIMITS.forEach(function (oConfig) {
                var oControl = this.byId(oConfig.id);
                if (!oControl) {
                    return;
                }

                this._applyCharacterLimitValueState(oControl, oConfig, oData[oConfig.path] || "");
            }.bind(this));
        },

        _validateCharacterLimits: async function () {
            var oContext = this.getView().getBindingContext();
            if (!oContext) {
                MessageBox.error("No context found.");
                return false;
            }

            var oData = await oContext.requestObject();
            this._syncCharacterLimitValueStates(oData);

            var aLimitViolations = CHARACTER_LIMITS.filter(function (oConfig) {
                return (oData[oConfig.path] || "").length > oConfig.limit;
            }).map(function (oConfig) {
                return oConfig.label + " (max " + oConfig.limit + " characters)";
            });

            if (aLimitViolations.length > 0) {
                MessageBox.error(
                    "Please fix character limit errors:\n\n- " + aLimitViolations.join("\n- ")
                );
                return false;
            }

            return true;
        },

        onNavBack: function () {
            this._openCancelDialog({ navBack: true });
        },

        onCancel: function () {
            this._openCancelDialog({ navBack: false });
        },

        _openCancelDialog: function (oOptions) {
            this._oCancelDialogOptions = oOptions;

            if (!this._oCancelConfirmDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "com.syensqo.hr.empmovementform.fragments.CancelConfirmDialog",
                    controller: this
                }).then(function (oDialog) {
                    this._oCancelConfirmDialog = oDialog;
                    this.getView().addDependent(oDialog);
                    oDialog.open();
                }.bind(this));
            } else {
                this._oCancelConfirmDialog.open();
            }
        },

        onConfirmDiscard: async function () {
            this._oCancelConfirmDialog.close();

            var oContext = this.getView().getBindingContext();
            if (!oContext) return;

            try {
                const oObject = await oContext.requestObject();
                if (!oObject.IsActiveEntity) {
                    await oContext.delete("$auto");
                }

                this.getView().getModel("ui").setProperty("/isEditable", false);
                window.history.back();

            } catch (oError) {
                MessageBox.error("Discard failed: " + (oError && oError.message ? oError.message : oError));
            }
        },

        onKeepEditing: function () {
            this._oCancelConfirmDialog.close();
        },


        onEdit: async function () {
            var oContext = this.getView().getBindingContext();
            if (!oContext) return;

            try {
                await this.editFlow.editDocument(oContext); // creates draft
                this.getView().getModel("ui").setProperty("/isEditable", true);
            } catch (oError) {
                MessageBox.error("Edit failed: " + oError.message);
            }
        },

        _isMissingMandatoryValue: function (vValue, sType) {
            if (sType === "boolean") {
                return vValue === null || vValue === undefined;
            }

            if (sType === "number") {
                if (vValue === null || vValue === undefined) {
                    return true;
                }

                if (typeof vValue === "string") {
                    return vValue.trim() === "";
                }

                return Number.isNaN(vValue);
            }

            if (typeof vValue === "string") {
                return vValue.trim() === "";
            }

            return vValue === null || vValue === undefined;
        },

        _validateMandatoryFields: async function () {
            var oContext = this.getView().getBindingContext();
            if (!oContext) {
                MessageBox.error("No context found.");
                return false;
            }

            var oData = await oContext.requestObject();
            var aMissingFields = REQUIRED_FIELDS.filter(function (oField) {
                return this._isMissingMandatoryValue(oData[oField.path], oField.type);
            }.bind(this)).map(function (oField) {
                return oField.label;
            });

            if (aMissingFields.length > 0) {
                MessageBox.error(
                    "Please fill all mandatory fields before continuing:\n\n- " + aMissingFields.join("\n- ")
                );
                return false;
            }

            return true;
        },

        onSave: async function () {
            var oContext = this.getView().getBindingContext();

            if (!oContext) {
                MessageBox.error("No context found.");
                return;
            }

            var bIsValid = await this._validateMandatoryFields();
            if (!bIsValid) {
                return;
            }

            bIsValid = await this._validateCharacterLimits();
            if (!bIsValid) {
                return;
            }

            this.editFlow.saveDocument(oContext).then(function () {
                MessageToast.show("Record saved successfully");
                this.getView().getModel("ui").setProperty("/isEditable", false);
            }.bind(this)).catch(function (oError) {
                MessageBox.error("Save failed: " + (oError && oError.message ? oError.message : oError));
            });
        },

        onCancelRequest: function () {
            var oContext = this.getView().getBindingContext();
            if (!oContext) return;

            MessageBox.confirm("Cancel this movement request?", {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                emphasizedAction: MessageBox.Action.CANCEL,
                onClose: function (sAction) {
                    if (sAction !== MessageBox.Action.OK) return;

                    var oModel = this.getView().getModel();
                    var oOperation = oModel.bindContext("/cancelMovement(...)");

                    oOperation.setParameter("ID", oContext.getProperty("ID"));
                    oOperation.execute("$auto").then(function () {
                        MessageToast.show("Movement request cancelled");
                        this.getView().getBindingContext().refresh();
                    }.bind(this)).catch(function (oError) {
                        MessageBox.error("Cancel failed: " + (oError.message || oError));
                    });
                }.bind(this)
            });
        },

        onSubmit: async function () {
            var oContext = this.getView().getBindingContext();
            if (!oContext) return;
            try {
                var bIsValid = await this._validateMandatoryFields();
                if (!bIsValid) {
                    return;
                }

                bIsValid = await this._validateCharacterLimits();
                if (!bIsValid) {
                    return;
                }

                var oModel = oContext.getModel();
                var oAction = oModel.bindContext("/acceptMovement(...)");
                oAction.setParameter("ID", oContext.getProperty("ID"));
                await oAction.execute();
                await oContext.requestRefresh();
                MessageToast.show("Status changed to Accepted");
            } catch (oError) {
                MessageBox.error("Submit failed: " + (oError && oError.message ? oError.message : oError));
            }
        }
    });
});