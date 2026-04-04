sap.ui.define([
    "sap/fe/core/PageController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (PageController, JSONModel, MessageToast, MessageBox, Fragment, Filter, FilterOperator) {
    "use strict";

    const VISIBILITY_RULES_PATH = sap.ui.require.toUrl("com/syensqo/hr/empmovementform/config/visibility-rules.json");

    const CHARACTER_LIMITS = [
        { id: "moveReferenceNumberInput", path: "moveReferenceNumber", label: "Move Request Reference Number", limit: 8 },
        { id: "addressLineInput", path: "addressLine", label: "Address Line", limit: 256 },
        { id: "postCodeInput", path: "postCode", label: "Post Code", limit: 8 },
        { id: "cityInput", path: "city", label: "City", limit: 256 }
    ];

    const REQUIRED_FIELDS = [
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
            this._boundPopState = this._onPopState.bind(this);
            this._formNameDependencyBindings = [];
            this._durationRuleBindings = [];
            this._formNameWatcherId = null;
            this._durationRuleWatcherId = null;
            this._lastFormNameDeps = null;
            this._lastDurationRuleDeps = null;
            this._isFormNameUpdateRunning = false;
            this._attachmentsModel = new JSONModel({ items: [] });
            window.addEventListener('popstate', this._boundPopState);

            this.getView().setModel(
                new JSONModel({ isEditable: false }),
                "ui"
            );

            this.getView().setModel(
                new JSONModel({ enabled: false, defaultVisible: true, fieldRules: [], fields: {} }),
                "visibility"
            );

            this.getView().setModel(this._attachmentsModel, "attachments");
            this.getView().setModel(new JSONModel({ reason: "" }), "cancelRequestDialog");

            this._loadVisibilityRules();

            this.getView().attachModelContextChange(async function () {

                const oContext = this.getView().getBindingContext();
                if (!oContext) return;

                const oObject = await oContext.requestObject();
                if (!oObject) return;

                var bForceEditForNewlyCreated = false;
                if (window.sessionStorage && oObject.ID) {
                    var sForceEditId = window.sessionStorage.getItem("empmovementform.forceEditId");
                    if (sForceEditId && sForceEditId === oObject.ID) {
                        bForceEditForNewlyCreated = true;
                        window.sessionStorage.removeItem("empmovementform.forceEditId");
                    }
                }

                const bIsEditable = (oObject.IsActiveEntity === false) || bForceEditForNewlyCreated;

                // Non-draft records open in display mode.
                // Draft records (IsActiveEntity === false) open in edit mode.
                this.getView().getModel("ui").setProperty("/isEditable", bIsEditable);
                this._syncCharacterLimitValueStates(oObject);
                this._applyDurationValueState(oObject);
                this._applyVisibilityRules(oObject);
                this._attachFormNameDependencyBindings(oContext);
                this._attachDurationRuleBindings(oContext);
                this._startFormNameLiveWatcher(oContext);
                this._startDurationRuleWatcher(oContext);
                await this._autoFillFormName(oContext, oObject);
                await this._autoFillDateSubmitted(oContext, oObject);
                this._updateDateLeadTimeConstraints(oContext, oObject);
                await this._syncAttachmentsFromContext(oContext, oObject);

            }.bind(this));
        },

        _syncAttachmentsFromContext: async function (oContext, oObject) {
            var aAttachments = oObject && Array.isArray(oObject.attachments) ? oObject.attachments : [];
            var sAttachmentsPayload = oObject && oObject.attachmentsPayload;

            if (!aAttachments.length && !sAttachmentsPayload && oContext && typeof oContext.requestProperty === "function") {
                try {
                    sAttachmentsPayload = await oContext.requestProperty("attachmentsPayload");
                } catch (oError) {
                    sAttachmentsPayload = "";
                }
            }

            if (!aAttachments.length && sAttachmentsPayload) {
                try {
                    aAttachments = JSON.parse(sAttachmentsPayload) || [];
                } catch (oError) {
                    aAttachments = [];
                }
            }
            this._attachmentsModel.setProperty("/items", aAttachments.map(function (oAttachment) {
                return {
                    ID: oAttachment.ID,
                    fileName: oAttachment.fileName || "",
                    fileType: oAttachment.fileType || "",
                    createdAt: oAttachment.createdAt || "",
                    fileSize: oAttachment.fileSize || 0,
                    fileDataUrl: oAttachment.fileDataUrl || "",
                    source: "existing"
                };
            }));
        },

        _buildAttachmentsPayload: function () {
            var aItems = this._attachmentsModel.getProperty("/items") || [];
            return aItems.map(function (oItem) {
                return {
                    ID: oItem.ID,
                    fileName: oItem.fileName,
                    fileType: oItem.fileType,
                    createdAt: oItem.createdAt,
                    fileSize: oItem.fileSize,
                    source: oItem.source
                };
            });
        },

        _readFileAsDataUrl: function (oFile) {
            return new Promise(function (resolve, reject) {
                var oReader = new FileReader();
                oReader.onload = function (oEvent) {
                    resolve(oEvent && oEvent.target ? oEvent.target.result : "");
                };
                oReader.onerror = function () {
                    reject(new Error("Failed to read file " + (oFile && oFile.name ? oFile.name : "")));
                };
                oReader.readAsDataURL(oFile);
            });
        },

        onAttachmentsSelected: async function (oEvent) {
            var oSource = oEvent.getSource();
            var aFiles = oEvent.getParameter("files") || [];

            if (!aFiles.length && oSource) {
                var oDomRef = oSource.getDomRef && oSource.getDomRef();
                if (oDomRef && oDomRef.files) {
                    aFiles = Array.prototype.slice.call(oDomRef.files);
                }
            }

            if (!aFiles.length) {
                return;
            }

            var aItems = this._attachmentsModel.getProperty("/items") || [];

            for (var i = 0; i < aFiles.length; i++) {
                var oFile = aFiles[i];
                var sDataUrl = await this._readFileAsDataUrl(oFile);

                aItems.push({
                    ID: "tmp-" + Date.now() + "-" + i,
                    fileName: oFile.name,
                    fileType: oFile.type || "application/octet-stream",
                    fileSize: oFile.size || 0,
                    createdAt: new Date().toISOString(),
                    fileDataUrl: sDataUrl,
                    source: "local"
                });
            }

            this._attachmentsModel.setProperty("/items", aItems);

            if (oSource && typeof oSource.setValue === "function") {
                oSource.setValue("");
            }

            MessageToast.show(aFiles.length + " file(s) added to the attachment table.");
        },

        formatAttachmentPreviewSrc: function (sDataUrl) {
            return sDataUrl || "";
        },

        formatAttachmentPreviewIcon: function (sMimeType) {
            if (!sMimeType) {
                return "sap-icon://document-text";
            }
            if (sMimeType.indexOf("image/") === 0) {
                return "sap-icon://picture";
            }
            if (sMimeType === "application/pdf") {
                return "sap-icon://pdf-attachment";
            }
            if (sMimeType.indexOf("video/") === 0) {
                return "sap-icon://video";
            }
            return "sap-icon://document-text";
        },

        formatFileSize: function (vSize) {
            var iSize = Number(vSize) || 0;
            if (iSize <= 0) {
                return "-";
            }
            if (iSize < 1024) {
                return iSize + " B";
            }
            if (iSize < 1024 * 1024) {
                return (iSize / 1024).toFixed(1) + " KB";
            }
            return (iSize / (1024 * 1024)).toFixed(1) + " MB";
        },

        onOpenAttachment: function (oEvent) {
            var oCtx = oEvent.getSource().getBindingContext("attachments");
            var oAttachment = oCtx && oCtx.getObject ? oCtx.getObject() : null;

            if (!oAttachment || !oAttachment.fileDataUrl) {
                MessageToast.show("Preview is available for files selected in the current draft session.");
                return;
            }

            window.open(oAttachment.fileDataUrl, "_blank", "noopener,noreferrer");
        },

        onRemoveAttachment: function (oEvent) {
            var oCtx = oEvent.getSource().getBindingContext("attachments");
            if (!oCtx || typeof oCtx.getPath !== "function") {
                return;
            }

            var sPath = oCtx.getPath();
            var aSegments = sPath.split("/");
            var iIndex = Number(aSegments[aSegments.length - 1]);

            if (Number.isNaN(iIndex)) {
                return;
            }

            var aItems = this._attachmentsModel.getProperty("/items") || [];
            if (iIndex < 0 || iIndex >= aItems.length) {
                return;
            }

            aItems.splice(iIndex, 1);
            this._attachmentsModel.setProperty("/items", aItems);
            MessageToast.show("Attachment removed.");
        },

        _getTodayDateIso: function () {
            return new Date().toISOString().slice(0, 10);
        },

        _autoFillDateSubmitted: async function (oContext, oData) {
            if (!oContext || !oData) {
                return;
            }

            if (oData.IsActiveEntity === false && !oData.dateSubmitted) {
                await oContext.setProperty("dateSubmitted", this._getTodayDateIso());
            }
        },

        _detachFormNameDependencyBindings: function () {
            if (!Array.isArray(this._formNameDependencyBindings)) {
                return;
            }

            this._formNameDependencyBindings.forEach(function (oBinding) {
                if (oBinding && typeof oBinding.detachChange === "function") {
                    oBinding.detachChange(this._onFormNameDependencyChange, this);
                }
                if (oBinding && typeof oBinding.destroy === "function") {
                    oBinding.destroy();
                }
            }.bind(this));

            this._formNameDependencyBindings = [];
        },

        _detachDurationRuleBindings: function () {
            if (!Array.isArray(this._durationRuleBindings)) {
                return;
            }

            this._durationRuleBindings.forEach(function (oBinding) {
                if (oBinding && typeof oBinding.detachChange === "function") {
                    oBinding.detachChange(this._onDurationRuleDependencyChange, this);
                }
                if (oBinding && typeof oBinding.destroy === "function") {
                    oBinding.destroy();
                }
            }.bind(this));

            this._durationRuleBindings = [];
        },

        _attachDurationRuleBindings: function (oContext) {
            if (!oContext) {
                return;
            }

            this._detachDurationRuleBindings();

            var oModel = this.getView().getModel();
            ["duration", "hostCountry_code"].forEach(function (sPath) {
                var oBinding = oModel.bindProperty(sPath, oContext);
                oBinding.attachChange(this._onDurationRuleDependencyChange, this);
                this._durationRuleBindings.push(oBinding);
            }.bind(this));
        },

        _onDurationRuleDependencyChange: function () {
            var oContext = this.getView().getBindingContext();
            if (!oContext) {
                return;
            }

            var sHostCountry = this._resolveHostCountryForRules({
                hostCountry_code: oContext.getProperty("hostCountry_code"),
                hostCountry: null
            }, oContext);

            this._applyDurationValueState({
                duration: oContext.getProperty("duration"),
                hostCountry_code: sHostCountry
            });
        },

        _attachFormNameDependencyBindings: function (oContext) {
            if (!oContext) {
                return;
            }

            this._detachFormNameDependencyBindings();

            var oModel = this.getView().getModel();
            ["movementType_ID", "policy_ID"].forEach(function (sPath) {
                var oBinding = oModel.bindProperty(sPath, oContext);
                oBinding.attachChange(this._onFormNameDependencyChange, this);
                this._formNameDependencyBindings.push(oBinding);
            }.bind(this));

            var oFormNameBinding = oModel.bindProperty("formName", oContext);
            this._formNameDependencyBindings.push(oFormNameBinding);
        },

        _stopFormNameLiveWatcher: function () {
            if (this._formNameWatcherId) {
                clearInterval(this._formNameWatcherId);
                this._formNameWatcherId = null;
            }
            this._lastFormNameDeps = null;
        },

        _stopDurationRuleWatcher: function () {
            if (this._durationRuleWatcherId) {
                clearInterval(this._durationRuleWatcherId);
                this._durationRuleWatcherId = null;
            }
            this._lastDurationRuleDeps = null;
        },

        _startDurationRuleWatcher: function (oContext) {
            this._stopDurationRuleWatcher();
            if (!oContext) {
                return;
            }

            this._durationRuleWatcherId = setInterval(function () {
                var oActiveContext = this.getView().getBindingContext();
                if (!oActiveContext || oActiveContext !== oContext) {
                    return;
                }

                var sDuration = (oActiveContext.getProperty("duration") || "").toString();
                var sHostCountry = this._resolveHostCountryForRules({
                    hostCountry_code: oActiveContext.getProperty("hostCountry_code"),
                    hostCountry: null
                }, oActiveContext);

                var oLast = this._lastDurationRuleDeps || {};
                if (oLast.duration === sDuration && oLast.hostCountry === sHostCountry) {
                    return;
                }

                this._lastDurationRuleDeps = {
                    duration: sDuration,
                    hostCountry: sHostCountry
                };

                this._applyDurationValueState({
                    duration: sDuration,
                    hostCountry_code: sHostCountry
                });
            }.bind(this), 150);
        },

        _startFormNameLiveWatcher: function (oContext) {
            this._stopFormNameLiveWatcher();
            if (!oContext) {
                return;
            }

            this._formNameWatcherId = setInterval(async function () {
                if (this._isFormNameUpdateRunning) {
                    return;
                }

                var oActiveContext = this.getView().getBindingContext();
                if (!oActiveContext || oActiveContext !== oContext) {
                    return;
                }

                var sMovementTypeId = oActiveContext.getProperty("movementType_ID") || "";
                var sPolicyId = oActiveContext.getProperty("policy_ID") || "";
                var oLast = this._lastFormNameDeps || {};

                if (oLast.movementType_ID === sMovementTypeId && oLast.policy_ID === sPolicyId) {
                    return;
                }

                this._lastFormNameDeps = {
                    movementType_ID: sMovementTypeId,
                    policy_ID: sPolicyId
                };

                this._isFormNameUpdateRunning = true;
                try {
                    if (!sMovementTypeId || !sPolicyId) {
                        if ((oActiveContext.getProperty("formName") || "") !== "") {
                            await oActiveContext.setProperty("formName", "");
                        }
                        return;
                    }

                    await this._autoFillFormName(oActiveContext, {
                        movementType_ID: sMovementTypeId,
                        policy_ID: sPolicyId,
                        formName: oActiveContext.getProperty("formName") || ""
                    });
                } finally {
                    this._isFormNameUpdateRunning = false;
                }
            }.bind(this), 150);
        },

        _onFormNameDependencyChange: async function () {
            var oContext = this.getView().getBindingContext();
            if (!oContext) {
                return;
            }

            try {
                var oData = await oContext.requestObject();
                if (oData) {
                    this._applyVisibilityRules(oData);
                }
            } catch (oError) {
                // Ignore transient refresh timing during rule re-evaluation.
            }

            if (!Array.isArray(this._formNameDependencyBindings) || this._formNameDependencyBindings.length < 2) {
                return;
            }

            var oMovementTypeBinding = this._formNameDependencyBindings[0];
            var oPolicyBinding = this._formNameDependencyBindings[1];
            var oFormNameBinding = this._formNameDependencyBindings[2];

            var sMovementTypeId = oMovementTypeBinding && typeof oMovementTypeBinding.getValue === "function"
                ? oMovementTypeBinding.getValue()
                : "";
            var sPolicyId = oPolicyBinding && typeof oPolicyBinding.getValue === "function"
                ? oPolicyBinding.getValue()
                : "";
            var sCurrentFormName = oFormNameBinding && typeof oFormNameBinding.getValue === "function"
                ? (oFormNameBinding.getValue() || "")
                : "";

            if (!sMovementTypeId || !sPolicyId) {
                if (sCurrentFormName) {
                    await oContext.setProperty("formName", "");
                }
                return;
            }

            try {
                var sMovementTypeText = await this._getValueHelpTextById(sMovementTypeId);
                var sPolicyText = await this._getValueHelpTextById(sPolicyId);
                var sFormName = (sMovementTypeText && sPolicyText) ? (sMovementTypeText + "-" + sPolicyText) : "";

                if (sCurrentFormName !== sFormName) {
                    await oContext.setProperty("formName", sFormName);
                }
            } catch (oError) {
                // Ignore lookup timing issues during value-help interaction.
            }
        },

        _getValueHelpTextById: async function (sId) {
            if (!sId) {
                return "";
            }

            var oModel = this.getView().getModel();
            var oBinding = oModel.bindList("/ValueHelp", null, null, [
                new Filter("ID", FilterOperator.EQ, sId)
            ]);
            var aContexts = await oBinding.requestContexts(0, 1);

            if (!aContexts || aContexts.length === 0) {
                return "";
            }

            var oValueHelp = await aContexts[0].requestObject();
            return oValueHelp && oValueHelp.name ? oValueHelp.name : "";
        },

        _resolveMovementTypeText: async function (oData) {
            if (oData && oData.movementType && oData.movementType.name) {
                return oData.movementType.name;
            }
            return this._getValueHelpTextById(oData && oData.movementType_ID);
        },

        _resolvePolicyText: async function (oData) {
            if (oData && oData.policy && oData.policy.name) {
                return oData.policy.name;
            }
            return this._getValueHelpTextById(oData && oData.policy_ID);
        },

        _autoFillFormName: async function (oContext, oData) {
            if (!oContext || !oData) {
                return;
            }

            try {
                var sMovementTypeText = await this._resolveMovementTypeText(oData);
                var sPolicyText = await this._resolvePolicyText(oData);
                var sFormName = (sMovementTypeText && sPolicyText) ? (sMovementTypeText + "-" + sPolicyText) : "";

                if ((oData.formName || "") !== sFormName) {
                    await oContext.setProperty("formName", sFormName);
                }
            } catch (oError) {
                // Keep page functional if lookup fails; formName can be recalculated later.
            }
        },

        _loadVisibilityRules: function () {
            var oVisibilityModel = this.getView().getModel("visibility");
            oVisibilityModel.attachRequestCompleted(function () {
                var oContext = this.getView().getBindingContext();
                if (!oContext) {
                    return;
                }

                oContext.requestObject().then(function (oData) {
                    if (oData) {
                        this._applyVisibilityRules(oData);
                    }
                }.bind(this));
            }.bind(this));

            oVisibilityModel.loadData(VISIBILITY_RULES_PATH, null, true);
        },

        _extractFieldPathFromControl: function (oControl) {
            var aProperties = ["value", "selectedKey", "selected", "dateValue", "text"];

            for (var i = 0; i < aProperties.length; i++) {
                var oBindingInfo = oControl.getBindingInfo && oControl.getBindingInfo(aProperties[i]);
                if (!oBindingInfo) {
                    continue;
                }

                var sPath = oBindingInfo.path;
                if (!sPath && oBindingInfo.parts && oBindingInfo.parts.length > 0) {
                    sPath = oBindingInfo.parts[0].path;
                }

                if (sPath) {
                    return sPath.replace(/^\//, "");
                }
            }

            return null;
        },

        _getRuleValue: function (oData, sPath) {
            if (!oData || !sPath) {
                return undefined;
            }

            if (Object.prototype.hasOwnProperty.call(oData, sPath)) {
                return oData[sPath];
            }

            var aParts = sPath.split("/");
            var oCursor = oData;
            for (var i = 0; i < aParts.length; i++) {
                if (!oCursor || !Object.prototype.hasOwnProperty.call(oCursor, aParts[i])) {
                    return undefined;
                }
                oCursor = oCursor[aParts[i]];
            }
            return oCursor;
        },

        _evaluateCondition: function (oCondition, oData) {
            if (!oCondition || !oCondition.path || !oCondition.operator) {
                return true;
            }

            var vActual = this._getRuleValue(oData, oCondition.path);
            var vExpected = oCondition.value;
            var sOperator = String(oCondition.operator).toUpperCase();

            switch (sOperator) {
                case "EQ":
                    return vActual === vExpected;
                case "NE":
                    return vActual !== vExpected;
                case "IN":
                    return Array.isArray(vExpected) && vExpected.indexOf(vActual) !== -1;
                case "NOT_IN":
                    return Array.isArray(vExpected) && vExpected.indexOf(vActual) === -1;
                case "GT":
                    return Number(vActual) > Number(vExpected);
                case "GTE":
                    return Number(vActual) >= Number(vExpected);
                case "LT":
                    return Number(vActual) < Number(vExpected);
                case "LTE":
                    return Number(vActual) <= Number(vExpected);
                case "EMPTY":
                    return vActual === null || vActual === undefined || vActual === "";
                case "NOT_EMPTY":
                    return !(vActual === null || vActual === undefined || vActual === "");
                default:
                    return true;
            }
        },

        _evaluateRuleGroup: function (oGroup, oData) {
            if (!oGroup) {
                return true;
            }

            if (Array.isArray(oGroup.all)) {
                return oGroup.all.every(function (oNode) {
                    return this._evaluateRuleGroup(oNode, oData);
                }.bind(this));
            }

            if (Array.isArray(oGroup.any)) {
                return oGroup.any.some(function (oNode) {
                    return this._evaluateRuleGroup(oNode, oData);
                }.bind(this));
            }

            if (oGroup.not) {
                return !this._evaluateRuleGroup(oGroup.not, oData);
            }

            return this._evaluateCondition(oGroup, oData);
        },

        _buildVisibilityMap: function (oData) {
            var oVisibilityModel = this.getView().getModel("visibility");
            var oRules = oVisibilityModel.getData() || {};
            var mVisibility = {};

            if (!oRules.enabled || !Array.isArray(oRules.fieldRules)) {
                return mVisibility;
            }

            oRules.fieldRules.forEach(function (oRule) {
                if (!oRule || !oRule.field) {
                    return;
                }
                mVisibility[oRule.field] = this._evaluateRuleGroup(oRule.visibleWhen, oData);
            }.bind(this));

            return mVisibility;
        },

        _applyVisibilityRules: function (oData) {
            var oVisibilityModel = this.getView().getModel("visibility");
            var oRules = oVisibilityModel.getData() || {};
            var aFieldRules = Array.isArray(oRules.fieldRules) ? oRules.fieldRules : [];
            var mResolvedVisibility = {};

            aFieldRules.forEach(function (oRule) {
                if (oRule && oRule.field) {
                    mResolvedVisibility[oRule.field] = true;
                }
            });

            if (!oRules.enabled) {
                oVisibilityModel.setProperty("/fields", mResolvedVisibility);
                return;
            }

            var mVisibility = this._buildVisibilityMap(oData);
            var bDefaultVisible = oRules.defaultVisible !== false;

            aFieldRules.forEach(function (oRule) {
                if (!oRule || !oRule.field) {
                    return;
                }

                mResolvedVisibility[oRule.field] = Object.prototype.hasOwnProperty.call(mVisibility, oRule.field)
                    ? mVisibility[oRule.field]
                    : bDefaultVisible;
            });

            oVisibilityModel.setProperty("/fields", mResolvedVisibility);
        },

        _onPopState: function () {
            var bIsEditable = this.getView().getModel("ui").getProperty("/isEditable");
            if (bIsEditable) {
                this._discardPendingChanges();
            }
        },

        onExit: function () {
            this._detachFormNameDependencyBindings();
            this._detachDurationRuleBindings();
            this._stopFormNameLiveWatcher();
            this._stopDurationRuleWatcher();
            window.removeEventListener('popstate', this._boundPopState);

            if (this._oCancelRequestDialog) {
                this._oCancelRequestDialog.destroy();
                this._oCancelRequestDialog = null;
            }
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

        _getDurationRangeForHostCountry: function (vHostCountry) {
            var sCode = (vHostCountry || "").toString().trim().toUpperCase();

            if (
                sCode === "US" || sCode === "USA" || sCode === "UNITED STATES" || sCode === "UNITED STATES OF AMERICA" ||
                sCode === "CH" || sCode === "CHE" || sCode === "SWITZERLAND" ||
                sCode.indexOf("UNITED STATES") !== -1 || sCode.indexOf("SWITZERLAND") !== -1
            ) {
                return { min: 6, max: 18 };
            }

            if (
                sCode === "UK" || sCode === "GB" || sCode === "GBR" || sCode === "UNITED KINGDOM" ||
                sCode.indexOf("UNITED KINGDOM") !== -1 || sCode.indexOf("U.K") !== -1
            ) {
                return { min: 6, max: 12 };
            }

            return { min: 6, max: 24 };
        },

        _resolveHostCountryForRules: function (oData, oContext) {
            if (oData) {
                if (oData.hostCountry_code) {
                    return oData.hostCountry_code;
                }
                if (oData.hostCountry && oData.hostCountry.code) {
                    return oData.hostCountry.code;
                }
                if (oData.hostCountry && oData.hostCountry.name) {
                    return oData.hostCountry.name;
                }
            }

            if (oContext && typeof oContext.getProperty === "function") {
                return (
                    oContext.getProperty("hostCountry_code") ||
                    oContext.getProperty("hostCountry/code") ||
                    oContext.getProperty("hostCountry/name") ||
                    ""
                );
            }

            return "";
        },

        _applyDurationValueState: function (oData) {
            var oDurationInput = this.byId("durationInput");
            if (!oDurationInput) {
                return true;
            }

            var vDuration = oData ? oData.duration : undefined;
            var vHostCountry = oData ? oData.hostCountry_code : undefined;

            if (vDuration === null || vDuration === undefined || vDuration === "") {
                oDurationInput.setValueState("None");
                oDurationInput.setValueStateText("");
                return true;
            }

            var iDuration = Number(vDuration);
            if (Number.isNaN(iDuration)) {
                oDurationInput.setValueState("Error");
                oDurationInput.setValueStateText("Duration must be a valid number of months.");
                return false;
            }

            var oRange = this._getDurationRangeForHostCountry(vHostCountry);
            if (iDuration < oRange.min || iDuration > oRange.max) {
                oDurationInput.setValueState("Error");
                oDurationInput.setValueStateText(
                    "Duration must be between " + oRange.min + " and " + oRange.max +
                    " months for selected Host Country."
                );
                return false;
            }

            oDurationInput.setValueState("None");
            oDurationInput.setValueStateText("");
            return true;
        },

        onDurationLiveChange: async function (oEvent) {
            var oContext = this.getView().getBindingContext();
            var sDuration = oEvent.getParameter("value");
            var oData = oContext && typeof oContext.requestObject === "function"
                ? await oContext.requestObject()
                : null;
            var sHostCountry = this._resolveHostCountryForRules(oData, oContext);

            this._applyDurationValueState({
                duration: sDuration,
                hostCountry_code: sHostCountry
            });
        },

        _validateDurationRule: async function () {
            var oContext = this.getView().getBindingContext();
            if (!oContext) {
                MessageBox.error("No context found.");
                return false;
            }

            var oData = await oContext.requestObject();
            var bValid = this._applyDurationValueState(oData);
            if (!bValid) {
                MessageBox.error("Please correct Duration based on selected Host Country rule.");
            }

            return bValid;
        },

        onNavBack: function () {
            var bIsEditable = this.getView().getModel("ui").getProperty("/isEditable");
            if (bIsEditable) {
                this._discardPendingChangesAndNavigateBack();
            } else {
                window.history.back();
            }
        },

        onCancel: function () {
            this._discardPendingChangesAndNavigateBack();
        },

        _discardPendingChanges: function () {
            var oContext = this.getView().getBindingContext();
            if (!oContext) {
                return;
            }

            var oModel = oContext.getModel();
            var sUpdateGroupId = "$auto";
            var oBinding = oContext.getBinding && oContext.getBinding();
            if (oBinding && typeof oBinding.getUpdateGroupId === "function") {
                sUpdateGroupId = oBinding.getUpdateGroupId() || "$auto";
            }

            if (oModel && typeof oModel.hasPendingChanges === "function" && oModel.hasPendingChanges(sUpdateGroupId)) {
                oModel.resetChanges(sUpdateGroupId);
            } else if (oModel && typeof oModel.resetChanges === "function") {
                oModel.resetChanges();
            }
        },

        _discardPendingChangesAndNavigateBack: function () {
            try {
                this._discardPendingChanges();
                this.getView().getModel("ui").setProperty("/isEditable", false);
                window.history.back();
            } catch (oError) {
                MessageBox.error("Discard failed: " + (oError && oError.message ? oError.message : oError));
            }
        },

        onDependencyFieldChange: async function (oEvent) {
            var oSource = oEvent && oEvent.getSource && oEvent.getSource();
            var oContext = oSource && oSource.getBindingContext && oSource.getBindingContext();

            if (!oContext) {
                oContext = this.getView().getBindingContext();
            }

            if (!oContext) {
                return;
            }

            try {
                var sMovementTypeId = "";
                var sPolicyId = "";

                var oMovementTypeComboBox = this.byId("movementTypeComboBox");
                var oPolicyComboBox = this.byId("policyComboBox");

                if (oMovementTypeComboBox && typeof oMovementTypeComboBox.getSelectedKey === "function") {
                    sMovementTypeId = oMovementTypeComboBox.getSelectedKey() || "";
                }

                if (oPolicyComboBox && typeof oPolicyComboBox.getSelectedKey === "function") {
                    sPolicyId = oPolicyComboBox.getSelectedKey() || "";
                }

                if (sMovementTypeId && sPolicyId) {
                    await this._autoFillFormName(oContext, {
                        movementType_ID: sMovementTypeId,
                        policy_ID: sPolicyId,
                        formName: oContext.getProperty("formName")
                    });
                } else {
                    await oContext.setProperty("formName", "");
                }
            } catch (oError) {
                // Ignore transient refresh timing during value help selection.
            }
        },

        onEdit: async function () {
            var oContext = this.getView().getBindingContext();
            if (!oContext) return;

            try {
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
            var sEmployeeName = (oData.employee || "").trim();
            var sCandidateName = (oData.candidate || "").trim();

            if (!sEmployeeName && !sCandidateName) {
                MessageBox.error("Please provide either Employee Name or Candidate Name before continuing.");
                return false;
            }

            var oVisibilityModel = this.getView().getModel("visibility");
            var oRules = oVisibilityModel ? (oVisibilityModel.getData() || {}) : {};
            var mVisibility = this._buildVisibilityMap(oData);
            var bDefaultVisible = oRules.defaultVisible !== false;

            var aMissingFields = REQUIRED_FIELDS.filter(function (oField) {
                var bFieldVisible = Object.prototype.hasOwnProperty.call(mVisibility, oField.path)
                    ? mVisibility[oField.path]
                    : bDefaultVisible;

                if (!bFieldVisible) {
                    return false;
                }

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

        _toDateValue: function (vDate) {
            if (!vDate) {
                return null;
            }

            if (vDate instanceof Date) {
                return new Date(vDate.getFullYear(), vDate.getMonth(), vDate.getDate());
            }

            if (typeof vDate === "string") {
                var aParts = vDate.split("-");
                if (aParts.length === 3) {
                    var iYear = Number(aParts[0]);
                    var iMonth = Number(aParts[1]) - 1;
                    var iDay = Number(aParts[2]);
                    if (!Number.isNaN(iYear) && !Number.isNaN(iMonth) && !Number.isNaN(iDay)) {
                        return new Date(iYear, iMonth, iDay);
                    }
                }

                var oParsed = new Date(vDate);
                if (!Number.isNaN(oParsed.getTime())) {
                    return new Date(oParsed.getFullYear(), oParsed.getMonth(), oParsed.getDate());
                }
            }

            return null;
        },

        _addMonths: function (oDate, iMonths) {
            var oResult = new Date(oDate.getTime());
            oResult.setMonth(oResult.getMonth() + iMonths);
            return oResult;
        },

        _getLeadTimeMinimumDate: function (oDateSubmitted) {
            if (!oDateSubmitted) {
                return null;
            }

            // Rule: Date Submitted + 2 months, then 1st day of the next month.
            var oAfterTwoMonths = this._addMonths(oDateSubmitted, 2);
            return new Date(oAfterTwoMonths.getFullYear(), oAfterTwoMonths.getMonth() + 1, 1);
        },

        _setDateFieldValidationState: function (oControl, sLabel, oSelectedDate, oMinimumAllowedDate) {
            if (!oControl) {
                return;
            }

            if (!oSelectedDate || !oMinimumAllowedDate) {
                oControl.setValueState("None");
                oControl.setValueStateText("");
                return;
            }

            if (oSelectedDate < oMinimumAllowedDate) {
                oControl.setValueState("Error");
                oControl.setValueStateText(sLabel + " must be at least 2 months after Date Submitted.");
                return;
            }

            oControl.setValueState("None");
            oControl.setValueStateText("");
        },

        _updateDateLeadTimeConstraints: function (oContext, oData) {
            var oEstimatedStartDatePicker = this.byId("estimatedStartDatePicker");
            var oDesiredDepartureDatePicker = this.byId("desiredDepartureDatePicker");

            if (!oEstimatedStartDatePicker && !oDesiredDepartureDatePicker) {
                return;
            }

            var vDateSubmitted = oData && oData.dateSubmitted;
            if (!vDateSubmitted && oContext && typeof oContext.getProperty === "function") {
                vDateSubmitted = oContext.getProperty("dateSubmitted");
            }

            var oDateSubmitted = this._toDateValue(vDateSubmitted);
            var oMinimumAllowedDate = this._getLeadTimeMinimumDate(oDateSubmitted);

            if (oEstimatedStartDatePicker) {
                oEstimatedStartDatePicker.setMinDate(oMinimumAllowedDate);
                this._setDateFieldValidationState(
                    oEstimatedStartDatePicker,
                    "Estimated Start Date",
                    this._toDateValue(oEstimatedStartDatePicker.getDateValue()),
                    oMinimumAllowedDate
                );
            }

            if (oDesiredDepartureDatePicker) {
                oDesiredDepartureDatePicker.setMinDate(oMinimumAllowedDate);
                this._setDateFieldValidationState(
                    oDesiredDepartureDatePicker,
                    "Desired Departure Date",
                    this._toDateValue(oDesiredDepartureDatePicker.getDateValue()),
                    oMinimumAllowedDate
                );
            }
        },

        onLeadTimeDateChange: function () {
            var oContext = this.getView().getBindingContext();
            if (!oContext) {
                return;
            }

            this._updateDateLeadTimeConstraints(oContext, {
                dateSubmitted: oContext.getProperty("dateSubmitted")
            });
        },

        _validateDateLeadTimeRules: async function () {
            var oContext = this.getView().getBindingContext();
            if (!oContext) {
                MessageBox.error("No context found.");
                return false;
            }

            var oData = await oContext.requestObject();
            var oDateSubmitted = this._toDateValue(oData.dateSubmitted);
            var oEstimatedStartDate = this._toDateValue(oData.estimatedStartDate);
            var oDesiredDepartureDate = this._toDateValue(oData.desiredDepartureDate);

            if (!oDateSubmitted) {
                MessageBox.error("Date Submitted is required to validate date rules.");
                return false;
            }

            var oMinimumAllowedDate = this._getLeadTimeMinimumDate(oDateSubmitted);
            var aInvalidFields = [];

            if (oEstimatedStartDate && oEstimatedStartDate < oMinimumAllowedDate) {
                aInvalidFields.push("Estimated Start Date");
            }

            if (oDesiredDepartureDate && oDesiredDepartureDate < oMinimumAllowedDate) {
                aInvalidFields.push("Desired Departure Date");
            }

            if (aInvalidFields.length > 0) {
                MessageBox.error(
                    "These dates must follow this rule: Date Submitted + 2 months, then 1st of next month.\n\n- " + aInvalidFields.join("\n- ")
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

            bIsValid = await this._validateDateLeadTimeRules();
            if (!bIsValid) {
                return;
            }

            bIsValid = await this._validateDurationRule();
            if (!bIsValid) {
                return;
            }

            await oContext.setProperty("attachmentsPayload", JSON.stringify(this._buildAttachmentsPayload()));

            var oModel = oContext.getModel();
            var sUpdateGroupId = "$auto";
            var oBinding = oContext.getBinding && oContext.getBinding();
            if (oBinding && typeof oBinding.getUpdateGroupId === "function") {
                sUpdateGroupId = oBinding.getUpdateGroupId() || "$auto";
            }

            oModel.submitBatch(sUpdateGroupId).then(function () {
                MessageToast.show("Record saved successfully");
                this.getView().getModel("ui").setProperty("/isEditable", false);
            }.bind(this)).catch(function (oError) {
                MessageBox.error("Save failed: " + (oError && oError.message ? oError.message : oError));
            });
        },

        onCancelRequest: function () {
            var oContext = this.getView().getBindingContext();
            if (!oContext) {
                return;
            }

            this.getView().getModel("cancelRequestDialog").setProperty("/reason", "");

            if (!this._oCancelRequestDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "com.syensqo.hr.empmovementform.fragments.CancelRequestDialog",
                    controller: this
                }).then(function (oDialog) {
                    this._oCancelRequestDialog = oDialog;
                    this.getView().addDependent(oDialog);
                    oDialog.open();
                }.bind(this));
                return;
            }

            this._oCancelRequestDialog.open();
        },

        onCancelReasonLiveChange: function (oEvent) {
            var sValue = oEvent.getParameter("value") || "";
            this.getView().getModel("cancelRequestDialog").setProperty("/reason", sValue);
        },

        onCloseCancelRequestDialog: function () {
            if (this._oCancelRequestDialog) {
                this._oCancelRequestDialog.close();
            }
            this.getView().getModel("cancelRequestDialog").setProperty("/reason", "");
        },

        onConfirmCancelRequest: function () {
            var oContext = this.getView().getBindingContext();
            if (!oContext) {
                return;
            }

            var sReason = (this.getView().getModel("cancelRequestDialog").getProperty("/reason") || "").trim();
            if (!sReason) {
                MessageBox.error("Cancellation reason is required.");
                return;
            }

            var oModel = this.getView().getModel();
            var oOperation = oModel.bindContext("/cancelMovement(...)");

            oOperation.setParameter("ID", oContext.getProperty("ID"));
            oOperation.setParameter("cancellationReason", sReason);
            oOperation.execute("$auto").then(function () {
                this.onCloseCancelRequestDialog();
                MessageToast.show("Movement request cancelled");
                this.getView().getBindingContext().refresh();
            }.bind(this)).catch(function (oError) {
                MessageBox.error("Cancel failed: " + (oError.message || oError));
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

                bIsValid = await this._validateDateLeadTimeRules();
                if (!bIsValid) {
                    return;
                }

                bIsValid = await this._validateDurationRule();
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