"use strict";
window.isense = {};
var baseUrl = 'http://rsense-dev.cs.uml.edu/api/v1/projects/';

var isense = {

    projectGetRequest: function(projectID) {

        var urlProject = baseUrl+projectID+'?recur=true';
        var responseProject = $.ajax({ type: "GET",
                            url: urlProject,
                            async: false,
                            dataType: "JSON"
        }).responseText;

        var parsedResponseProject = JSON.parse(responseProject); 

        return parsedResponseProject;  
    },

    getDatasetLocation: function(datasetName,parsedResponseProject) {

        for (var j = 0; j < parsedResponseProject.dataSetCount; j++) { 

            if (parsedResponseProject.dataSets[j].name == datasetName) {

                var datasetLocation = j;
                var datasetID = parsedResponseProject.dataSets[j].id;
            }
        }

        if (datasetID == null) {

            return "Dataset Not Found"
        }
        return datasetLocation;
    },

    getFieldID: function(fieldName,parsedResponseProject) {

        for (var i = 0; i < parsedResponseProject.fieldCount; i++) {    // Parsing through fields looking for field id

            if (parsedResponseProject.fields[i].name == fieldName) {     // If field names match then this is the id

                var fieldID = parsedResponseProject.fields[i].id;       // This is the field ID
            }
        }

        if (fieldID == null) {

            return "Field Not Found"
        }
        return fieldID;
    },

    getDatasetFieldData: function(projectID,datasetName,fieldName) {

        var values = [];
        var parsedResponseProject = isense.projectGetRequest(projectID);
        var datasetLocation = isense.getDatasetLocation(datasetName,parsedResponseProject);
        var fieldID = isense.getFieldID(fieldName,parsedResponseProject);

        for (var k = 0; k < parsedResponseProject.dataSets[datasetLocation].datapointCount; k++) {

            values.push(parsedResponseProject.dataSets[datasetLocation].data[k][fieldID])   
        }

        return values;
    },

    postDataset: function(projectID,contributorKey,fieldName,title,contributorName,data) {

        var currentTime = new Date();
        var timestamp = JSON.stringify(currentTime);
        var parsedResponseProject = isense.projectGetRequest(projectID);
        var fieldID = isense.getFieldID(fieldName,parsedResponseProject);
        var fieldIDString = fieldID.toString();
        var dataForPost = {};
        dataForPost[fieldIDString] = data;
        var apiUrl = baseUrl+projectID+'/jsonDataUpload';
        var upload = {

            'title': title + ' ' + timestamp,
            'contribution_key': contributorKey,
            'contributor_name': contributorName,
            'data': dataForPost
        }
        $.post(apiUrl, upload);
        alert("Post Successful");
    },

    postMultipleDataset: function(projectID,contributorKey,fieldNameArray,title,contributorName,ArrayofDataArrays) {

        var currentTime = new Date();
        var timestamp = JSON.stringify(currentTime);
        var parsedResponseProject = isense.projectGetRequest(projectID);

        var fieldID = [];

        for (var i = fieldNameArray.length - 1; i >= 0; i--) {

            fieldID[i] = isense.getFieldID(fieldNameArray[i],parsedResponseProject);
        };

        console.log(fieldID);

        var fieldIDStringArray = [];

        for (var i = 0 ; i <= fieldID.length - 1; i++) {

            fieldIDStringArray.push(fieldID[i].toString());
        };

        console.log(fieldIDStringArray);

        var dataForPost = {};
        for (var i = fieldIDStringArray.length - 1; i >= 0; i--) {

            dataForPost[fieldIDStringArray[i]] = ArrayofDataArrays[i];
        };

        console.log(dataForPost['645']);

        var apiUrl = baseUrl+projectID+'/jsonDataUpload';
        var upload = {

            'title': title + ' ' + timestamp,
            'contribution_key': contributorKey,
            'contributor_name': contributorName,
            'data': {
                        '644': [5,4],
                        '645': [1,2,4,8,4,2,2,5,5,6]
                    }
        }
        $.post(apiUrl, upload);
        alert("Post Successful");
    }
};
