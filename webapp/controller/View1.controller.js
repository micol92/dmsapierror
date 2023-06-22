// @ts-nocheck
sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/json/JSONModel",
        "sap/ui/core/Fragment",
        "sap/ui/export/Spreadsheet",
        "sap/m/MessageBox",
        "sap/m/upload/Uploader",
    ],
    function (
        Controller,
        Filter,
        FilterOperator,
        JSONModel,
        Fragment,
        Spreadsheet,
        MessageBox,
        Uploader
    )
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    {
        "use strict";

        return Controller.extend("project1x1.controller.View1", {
            onInit: function () {
            },
            pressCreate: function (oEvent) {

                this.fileselector().then(file => {
                    var myHeaders = new Headers();
                    var formdata = new FormData();
                    formdata.append("cmisaction", "createDocument");
                    formdata.append("propertyId[0]", "cmis:name");
                    formdata.append("propertyValue[0]", file.name);
                    formdata.append("propertyId[1]", "cmis:objectTypeId");
                    formdata.append("propertyValue[1]", "cmis:document");
                    formdata.append("filename", file.name);
                    formdata.append("_charset", "UTF-8");
                    formdata.append("includeAllowableActions", "False");
                    formdata.append("succinct", "true");
                    formdata.append("media", file, file.name);

                    var requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body: formdata,
                        redirect: 'follow'
                    };
debugger;
                    fetch("/sdi/browser/4a5658f1-5890-4a84-8203-289284e2329c/root", requestOptions)
                        .then(response => response.text())
                        .then(result => {
                            MessageBox.information("File uploaded successfully!");
                            console.log(result);
                            this.pressQuery();
debugger;
                        }).catch(error => {
                            MessageBox.information(JSON.stringify(error));
debugger;
                            console.log('error', error)
                        });

                });

            },

            pressQuery: function () {
                var querystate = "";
                var filename = this.byId("filename").getValue();
                if (filename) {
                    querystate = "select * from cmis:document".concat(" where cmis:name = \'").concat(filename).concat("\'");
                } else { querystate = "select * from cmis:document"; }
debugger;
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
                var urlencoded = new URLSearchParams();
                urlencoded.append("cmisaction", "query");
                urlencoded.append("succinct", "true");
                urlencoded.append("statement", querystate);
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: urlencoded,
                    redirect: 'follow'
                };
debugger;
                fetch("/sdi/browser/4a5658f1-5890-4a84-8203-289284e2329c", requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        debugger;
                        this.byId("table1").setModel(new JSONModel(result));
                    })
                    .catch(error => {
                        debugger;
                        console.log('error', error)});
                       
            },
            pressDelete: function (oEvent) {
                var oModel = this.byId("table1").getModel();
                // console.log(oModel);
                var filePath = oEvent.getSource().getBindingContext().getPath();

                var objId = oModel.getProperty(filePath).succinctProperties['cmis:objectId'];
                console.log(objId);
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
                var urlencoded = new URLSearchParams();
                urlencoded.append("cmisaction", "delete");
                urlencoded.append("objectId", objId);
                urlencoded.append("allVersions", "true");

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: urlencoded,
                    redirect: 'follow'
                };

                fetch("/sdi/browser/4a5658f1-5890-4a84-8203-289284e2329c/root", requestOptions)
                    .then(response => response.text())
                    .then(result => {
                        MessageBox.information("Object ".concat(result.trim()).concat(" deleted"));
                        console.log(typeof (result));

                    })
                    .catch(error => console.log('error', error));

            },
            fileselector: function popFileSelector() {
                return new Promise((resolve, reject) => {
                    let input = document.createElement('input');
                    input.value = 'Please select file';
                    input.type = 'file';
                    input.onchange = event => {
                        let file = event.target.files[0];
                        resolve(file);
                    };
                    input.click();
                });
            }
        });
    }
);
