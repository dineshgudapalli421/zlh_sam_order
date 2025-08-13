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
                        "PMOrder": "4000120",
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
                        "PMOrder": "4000120",
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
                        "PMOrder": "4000120",
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
                        "PMOrder": "4000652",
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
                        "PMOrder": "4000652",
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
                aFilter.push(new Filter("PMOrder", FilterOperator.EQ, orderId));
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

            // var oModel = oController.getView().getModel("OrderDetailsModel");
            // var aItems = oModel.getProperty("/OrderDetails");
            // var oNewRow = {
            //     "PMOrder": "",
            //     "oPNo": "",
            //     "WorkCenter": "",
            //     "Plant": "",
            //     "ControlKey": "",
            //     "Description": "",
            //     "opCode": "",
            //     "ProfitCenter": "",
            //     "InternalOrder": "",
            //     "Status": "",
            //     "ESA": "",
            //     "startDate": ""
            // };
            // aItems.push(oNewRow);
            // oModel.setProperty("/OrderDetails",aItems);
            // oModel.refresh();

            // var oItem = new sap.m.ColumnListItem({
            //     cells: [new sap.m.Input(), new sap.m.Input(),
            //     new sap.m.Input(), new sap.m.Input(),
            //     new sap.m.Input(), new sap.m.Input(),
            //     new sap.m.Input(), new sap.m.Input(),
            //     new sap.m.Input(), new sap.m.Input(),
            //     new sap.m.Input(), new sap.m.Input()]
            // });

            // var oTable = oController.getView().byId("tblOrderDetails");
            // oTable.addRow(oItem);
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
        },
        onUpdateInternalOrder: async function (oEvent) {
            var that = this;
            var oTable = oController.getView().byId("tblOrderDetails");
            this.onUpdateInternalOrderDialog ??= await this.loadFragment({
                name: "com.sap.lh.mr.zlhsamorder.fragment.internalOrder"
            });
            this.onUpdateInternalOrderDialog.open();
        },
        onSubmitInternalOrder: function (oEvent) {
            oController.onCancelInternalOrder();
            oController.getView().byId("application-ZLH_SEM_MOCKORD-change-component---Main--filterbar-btnGo").firePress();
            return MessageBox.success("Internal Order updated...");
        },
        onCancelInternalOrder: function (oEvent) {
            this.onUpdateInternalOrderDialog.destroy();
            this.onUpdateInternalOrderDialog = undefined;
        },
        onAttachment: async function (oEvent) {
            var that = this;
            var oTable = oController.getView().byId("tblOrderDetails");
            this.onAttachmentDialog ??= await this.loadFragment({
                name: "com.sap.lh.mr.zlhsamorder.fragment.uploadFile"
            });
            this.onAttachmentDialog.open();
        },
        onCancelFileUpload: function (oEvent) {
            this.onAttachmentDialog.destroy();
            this.onAttachmentDialog = undefined;
        },
        handleLinkPress: function (oEvent) {
            var oSource = oEvent.getSource();
            let oOrderNo = oSource.getText();
            if (oOrderNo) {
                var navigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
                var hash = (navigationService && navigationService.hrefForExternal({
                    target: { semanticObject: "MaintenanceOrder", action: "change" },
                    params: {
                        "AUFNR": oOrderNo,
                        "sap-app-origin-hint": '',
                        "sap-ui-tech-hint": "GUI",
                        "sap-ushell-navmode": "inplace"
                    }
                })) || "";

                var url = window.location.href.split('#')[0] + hash;
                sap.m.URLHelper.redirect(url, true);
            }
            console.log(oData);
        },
        handleUploadComplete: function (oEvent) {
            var sResponse = oEvent.getParameter("response"),
                aRegexResult = /\d{4}/.exec(sResponse),
                iHttpStatusCode = aRegexResult && parseInt(aRegexResult[0]),
                sMessage;

            if (sResponse) {
                sMessage = iHttpStatusCode === 200 ? sResponse + " (Upload Success)" : sResponse + " (Upload Error)";
                MessageToast.show(sMessage);
            }
        },

        handleUploadPress: function () {
            var oFileUploader = this.byId("fileUploader");
            oFileUploader.checkFileReadable().then(function () {
                oFileUploader.upload();
            }, function (error) {
                MessageToast.show("The file cannot be read. It may have changed.");
            }).then(function () {
                oFileUploader.clear();
            });
        }
    });
});