sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    'use strict';

    return {
        /**
         * Generated event handler.
         *
         * @param oContext the context of the page on which the event was fired. `undefined` for list report page.
         * @param aSelectedContexts the selected contexts of the table rows.
         */
        handleSubmit: async function (oContext) {
            const oModel = oContext.getModel();
            const ID = oContext.getObject().ID;
            const oAction = oModel.bindContext("/acceptMovement(...)");
            oAction.setParameter("ID", ID);
            await oAction.execute();
            sap.m.MessageToast.show("Status changed to Accepted");
        }
        // handleSubmit: async function (oContext) {
        //     const oModel = oContext.getModel();
        //     // Update status field
        //     oContext.setProperty("status", "Accepted");
        //     // Send PATCH request to backend
        //     await oModel.submitBatch(oModel.getUpdateGroupId());
        //     sap.m.MessageToast.show("Status changed to Accepted");
        // }
    };
});
