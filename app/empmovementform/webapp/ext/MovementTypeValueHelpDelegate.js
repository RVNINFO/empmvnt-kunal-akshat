sap.ui.define([
    "sap/ui/mdc/ValueHelpDelegate",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/mdc/enums/RequestShowContainerReason"
], function (ValueHelpDelegate, Filter, FilterOperator, RequestShowContainerReason) {
    "use strict";

    var GenericValueHelpDelegate = Object.assign({}, ValueHelpDelegate);

    function getPayload(oValueHelp) {
        return oValueHelp && typeof oValueHelp.getPayload === "function" ? oValueHelp.getPayload() : {};
    }

    function getCollectionPath(oValueHelp) {
        var oPayload = getPayload(oValueHelp);
        return oPayload.collectionPath || "/ValueHelp";
    }

    function getKeyPath(oValueHelp) {
        var oPayload = getPayload(oValueHelp);
        return oPayload.keyPath || "ID";
    }

    function getDescriptionPath(oValueHelp) {
        var oPayload = getPayload(oValueHelp);
        return oPayload.descriptionPath || "name";
    }

    GenericValueHelpDelegate.retrieveContent = function (oValueHelp, oContainer) {
        var aContent = oContainer.getContent();
        var oContent = aContent[0];

        if (!oContent || !oContent.isA || !oContent.isA("sap.ui.mdc.valuehelp.content.MTable") || oContent.getTable()) {
            return Promise.resolve();
        }

        return new Promise(function (resolve, reject) {
            sap.ui.require([
                "sap/m/Table",
                "sap/m/Column",
                "sap/m/ColumnListItem",
                "sap/m/Label",
                "sap/m/Text",
                "sap/ui/model/type/String"
            ], function (Table, Column, ColumnListItem, Label, Text, StringType) {
                var oField = oValueHelp.getControl && oValueHelp.getControl();
                var oDomRef = oField && oField.getDomRef && oField.getDomRef();
                var sWidth = oDomRef && oDomRef.clientWidth ? oDomRef.clientWidth + "px" : "100%";
                var sTableId = oContainer.getId() + "-Table";
                var sCollectionPath = getCollectionPath(oValueHelp);
                var sKeyPath = getKeyPath(oValueHelp);
                var sDescriptionPath = getDescriptionPath(oValueHelp);

                var oTable = new Table(sTableId, {
                    width: sWidth,
                    mode: "SingleSelectMaster",
                    columns: [
                        new Column(sTableId + "-col0", {
                            width: "5rem",
                            header: new Label(sTableId + "-col0-header", { text: "Code" })
                        }),
                        new Column(sTableId + "-col1", {
                            width: "12rem",
                            header: new Label(sTableId + "-col1-header", { text: "Name" })
                        })
                    ],
                    items: {
                        path: sCollectionPath,
                        template: new ColumnListItem(sTableId + "-item", {
                            type: "Active",
                            cells: [
                                new Text(sTableId + "-item-code", {
                                    text: { path: sKeyPath, type: new StringType({}, { maxLength: 100 }) }
                                }),
                                new Text(sTableId + "-item-name", {
                                    text: { path: sDescriptionPath, type: new StringType({}, { maxLength: 200 }) }
                                })
                            ]
                        })
                    }
                });

                oContent.setTable(oTable);
                resolve();
            }, reject);
        });
    };

    GenericValueHelpDelegate.updateBindingInfo = function (oValueHelp, oContent, oBindingInfo) {
        ValueHelpDelegate.updateBindingInfo(oValueHelp, oContent, oBindingInfo);

        var oPayload = getPayload(oValueHelp);
        oBindingInfo.filters = oBindingInfo.filters || [];

        if (oPayload.typeFilter) {
            oBindingInfo.filters.push(new Filter("type", FilterOperator.EQ, oPayload.typeFilter));
        }

        if (oPayload.searchKeys) {
            var aFilters = oPayload.searchKeys.map(function (sPath) {
                return new Filter({
                    path: sPath,
                    operator: FilterOperator.Contains,
                    value1: oContent.getSearch(),
                    caseSensitive: oContent.getCaseSensitive()
                });
            });
            var oSearchFilter = aFilters.length ? new Filter(aFilters, false) : null;
            if (oSearchFilter) {
                oBindingInfo.filters.push(oSearchFilter);
            }
        }
    };

    GenericValueHelpDelegate.isSearchSupported = function (oValueHelp) {
        var oPayload = getPayload(oValueHelp);
        return !!(oPayload && oPayload.searchKeys);
    };

    GenericValueHelpDelegate.requestShowContainer = function (oValueHelp, oContainer, sRequestShowContainerReason) {
        var oPayload = getPayload(oValueHelp);
        if (sRequestShowContainerReason === RequestShowContainerReason.Tap) {
            return !!(oPayload && oPayload.openOnClick);
        }
        if (sRequestShowContainerReason === RequestShowContainerReason.Tab) {
            return !!(oPayload && oPayload.openOnTab);
        }
        return ValueHelpDelegate.requestShowContainer.apply(this, arguments);
    };

    return GenericValueHelpDelegate;
});
