sap.ui.define(
    ["sap/fe/core/AppComponent"],
    function (Component) {
        "use strict";

        return Component.extend("com.syensqo.hr.empmovementform.Component", {
            metadata: {
                manifest: "json"
            },

            init: function () {
                Component.prototype.init.apply(this, arguments);

                var oModel = this.getModel();
                if (oModel) {
                    sap.ui.getCore().setModel(oModel, "empmovement");
                }
            }
        });
    }
);