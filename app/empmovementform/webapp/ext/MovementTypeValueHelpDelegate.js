sap.ui.define([
    "sap/ui/mdc/ValueHelpDelegate",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/mdc/enums/RequestShowContainerReason"
], function (ValueHelpDelegate, Filter, FilterOperator, RequestShowContainerReason) {
    "use strict";

    var MovementTypeValueHelpDelegate = Object.assign({}, ValueHelpDelegate);

    MovementTypeValueHelpDelegate.retrieveContent = function (oValueHelp, oContainer) {
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
                        path: "/ValueHelp",
                        filters: [new Filter("type", FilterOperator.EQ, "1")],
                        template: new ColumnListItem(sTableId + "-item", {
                            type: "Active",
                            cells: [
                                new Text(sTableId + "-item-code", {
                                    text: { path: "code", type: new StringType({}, { maxLength: 100 }) }
                                }),
                                new Text(sTableId + "-item-name", {
                                    text: { path: "name", type: new StringType({}, { maxLength: 200 }) }
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

    MovementTypeValueHelpDelegate.updateBindingInfo = function (oValueHelp, oContent, oBindingInfo) {
        ValueHelpDelegate.updateBindingInfo(oValueHelp, oContent, oBindingInfo);

        var oPayload = oValueHelp.getPayload && oValueHelp.getPayload();
        if (oPayload && oPayload.typeFilter) {
            oBindingInfo.filters = oBindingInfo.filters || [];
            oBindingInfo.filters.push(new Filter("type", FilterOperator.EQ, oPayload.typeFilter));
        }

        if (oPayload && oPayload.searchKeys) {
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
                oBindingInfo.filters = oBindingInfo.filters || [];
                oBindingInfo.filters.push(oSearchFilter);
            }
        }
    };

    MovementTypeValueHelpDelegate.isSearchSupported = function (oValueHelp) {
        var oPayload = oValueHelp.getPayload && oValueHelp.getPayload();
        return !!(oPayload && oPayload.searchKeys);
    };

    MovementTypeValueHelpDelegate.requestShowContainer = function (oValueHelp, oContainer, sRequestShowContainerReason) {
        var oPayload = oValueHelp.getPayload && oValueHelp.getPayload();
        if (sRequestShowContainerReason === RequestShowContainerReason.Tap) {
            return !!(oPayload && oPayload.openOnClick);
        }
        if (sRequestShowContainerReason === RequestShowContainerReason.Tab) {
            return !!(oPayload && oPayload.openOnTab);
        }
        return ValueHelpDelegate.requestShowContainer.apply(this, arguments);
    };

    return MovementTypeValueHelpDelegate;
});
