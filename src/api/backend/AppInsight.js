import {
    makeGetRequest, 
    makePostRequest,
    makePutRequest,
    makeDeleteRequest
} 
from "./Api";

// Get bug reports matching params
export async function getBugReports(token, params) {
    const url = `/insight/bug-reports/`;
    return await makeGetRequest(url, token, params);
}

// Posts a bug report
export async function postBugReport(token, body) {
    const url = `/insight/bug-reports/`;
    return await makePostRequest(url, token, body);
}

// Get bug report type choices
export async function getBugReportTypeChoices(token, params) {
    const url = `/insight/bug-reports/bug-type-choices/`;
    return await makeGetRequest(url, token, params);
}

// Posts a user in-app feedback
export async function postUserAppFeedback(token, body) {
    const url = `/insight/user-feedbacks/`;
    return await makePostRequest(url, token, body);
}
