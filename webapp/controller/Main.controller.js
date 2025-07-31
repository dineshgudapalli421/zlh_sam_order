sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    "sap/ui/model/json/JSONModel",
    'sap/m/MessageBox',
    "sap/ui/core/Fragment",
    "sap/m/Dialog",
    "sap/m/Button"
], (Controller, ODataModel, Filter, FilterOperator, JSONModel, MessageBox, Fragment, Dialog, Button) => {
    "use strict";
    var oRouter, oController, oPDFModel, UIComponent
    return Controller.extend("com.sap.lh.mr.zlhsamorder.controller.Main", {
        onInit() {
            debugger;
            oController = this;
            UIComponent = oController.getOwnerComponent();
            oRouter = UIComponent.getRouter();
            var oOrderDetailsModel = new JSONModel({
                OrderDetails: [
                    {
                        "oPNo": "10",
                        "WorkCenter": "ELE",
                        "Plant": "1000",
                        "ControlKey": "SM01",
                        "Description": "Digital Sign",
                        "opCode": "OP01",
                        "ProfitCenter": "10",
                        "InternalOrder": "12000101",
                        "Status": "Assigned",
                        "ESA": "N",
                        "startDate": ""
                    },
                    {
                        "oPNo": "20",
                        "WorkCenter": "ELECENG",
                        "Plant": "1000",
                        "ControlKey": "SM01",
                        "Description": "Digital Sign",
                        "opCode": "OP02",
                        "ProfitCenter": "10",
                        "InternalOrder": "12000000",
                        "Status": "Assigned",
                        "ESA": "N",
                        "startDate": ""
                    },
                    {
                        "oPNo": "30",
                        "WorkCenter": "EUS",
                        "Plant": "1000",
                        "ControlKey": "SM01",
                        "Description": "COORDINATE",
                        "opCode": "O049",
                        "ProfitCenter": "10",
                        "InternalOrder": "12000000",
                        "Status": "Ready for Dispatch",
                        "ESA": "N",
                        "startDate": ""
                    },
                    {
                        "oPNo": "40",
                        "WorkCenter": "CONSTRUCT",
                        "Plant": "1000",
                        "ControlKey": "SM01",
                        "Description": "COORDINATE",
                        "opCode": "O049",
                        "ProfitCenter": "10",
                        "InternalOrder": "12000102",
                        "Status": "Ready for Dispatch",
                        "ESA": "N",
                        "startDate": ""
                    },
                    {
                        "oPNo": "50",
                        "WorkCenter": "ELECMTR",
                        "Plant": "1000",
                        "ControlKey": "SM01",
                        "Description": "COORDINATE",
                        "opCode": "O039",
                        "ProfitCenter": "10",
                        "InternalOrder": "12000000",
                        "Status": "Ready for Dispatch",
                        "ESA": "N",
                        "startDate": ""
                    }
                ]
            });
            oController.getView().setModel(oOrderDetailsModel, "OrderDetailsModel");
        },
        onSearch: function () {
            debugger;
            const oView = this.getView();
            var oTable = oController.getView().byId("tblOrderDetails");
            var oJsonModel = new sap.ui.model.json.JSONModel();
            var oOrderDetailsModel = oController.getView().getModel("OrderDetailsModel");
            var aFilter = [];
            const orderId = this.getView().byId("idOrderID").getValue();
            if (orderId !== "") {
                aFilter.push(new Filter("InternalOrder", FilterOperator.EQ, orderId));
            }
            var oBinding = oTable.getBinding("rows");
            oBinding.filter(aFilter);
        },
        onAdd: async function (oEvent) {
            var that = this;
            this.oCreateDialog ??= await this.loadFragment({
                name: "com.sap.lh.mr.zlhsamorder.fragment.newRecord"
            });
            this.oCreateDialog.open();
        },
        onSubmitDialog: function (oEvent) {
            oController.onCancelCreateDialog();
            oController.getView().byId("application-ZLH_SEM_MOCKORD-change-component---Main--filterbar-btnGo").firePress();
            return MessageBox.success("New record added successfully...");
        },
        onCancelCreateDialog: function (oEvent) {
            this.oCreateDialog.destroy();
            this.oCreateDialog = undefined;
        },
        onDispatch: async function (oEvent) {
            var that = this;
            var oTable = oController.getView().byId("tblOrderDetails");
            if (oTable.getSelectedIndices().length === 0) {
                return MessageBox.error("Please select minimum one row");
            }
            //var rowID = oEvent.getSource().getSelectedIndices();
            this.oDispatchDialog ??= await this.loadFragment({
                name: "com.sap.lh.mr.zlhsamorder.fragment.dispatch"
            });
            this.oDispatchDialog.open();
        },
        onDSubmitDialog: function (oEvent) {
            oController.onDCancelDialog();
            oController.getView().byId("application-ZLH_SEM_MOCKORD-change-component---Main--filterbar-btnGo").firePress();
            return MessageBox.success("Status changed successfully...");
        },
        onDCancelDialog: function (oEvent) {
            this.oDispatchDialog.destroy();
            this.oDispatchDialog = undefined;
        },
        onChangeWorkCenter: async function (oEvent) {
            var that = this;
            var oTable = oController.getView().byId("tblOrderDetails");
            if (oTable.getSelectedIndices().length === 0) {
                return MessageBox.error("Please select minimum one row");
            }
            this.oChangeWCDialog ??= await this.loadFragment({
                name: "com.sap.lh.mr.zlhsamorder.fragment.workCenter"
            });
            this.oChangeWCDialog.open();
        },
        onWSubmitDialog: function (oEvent) {
            oController.onWCancelDialog();
            oController.getView().byId("application-ZLH_SEM_MOCKORD-change-component---Main--filterbar-btnGo").firePress();
            return MessageBox.success("Work Center changed...");
        },
        onWCancelDialog: function (oEvent) {
            this.oChangeWCDialog.destroy();
            this.oChangeWCDialog = undefined;
        },
        onUpdateStartDate: async function (oEvent) {
            var that = this;
            var oTable = oController.getView().byId("tblOrderDetails");
            if (oTable.getSelectedIndices().length === 0) {
                return MessageBox.error("Please select minimum one row");
            }
            this.onUpdateDateDialog ??= await this.loadFragment({
                name: "com.sap.lh.mr.zlhsamorder.fragment.updateDate"
            });
            this.onUpdateDateDialog.open();
        },
         onUpdateDialog: function (oEvent) {
            oController.onUCancelDialog();
            oController.getView().byId("application-ZLH_SEM_MOCKORD-change-component---Main--filterbar-btnGo").firePress();
            return MessageBox.success("Start Date updated...");
        },
        onUCancelDialog: function (oEvent) {
            this.onUpdateDateDialog.destroy();
            this.onUpdateDateDialog = undefined;
        }

    });
});