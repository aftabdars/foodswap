import {
    makeGetRequest, 
    makePostRequest,
    makePutRequest,
    makeDeleteRequest
} 
from "./Api";


// Gets all levels matching params
export async function getLevels(params) {
    const url = `/gamification/levels/`;
    return await makeGetRequest(url, undefined, params);
}

// Gets a level
export async function getLevel(id) {
    const url = `/gamification/levels/${id}`;
    return await makeGetRequest(url, undefined);
}

// Posts client's Foodiez Transfer Transaction
export async function postClientFoodiezTransferTransactions(token, body) {
    const url = `/gamification/foodieztransactions/transfer/`;
    return await makePostRequest(url, token, body);
}

// Gets client's all Foodiez Transfer Transactions matching params
export async function getClientFoodiezTransferTransactions(token, params) {
    const url = `/gamification/foodieztransactions/transfer/`;
    return await makeGetRequest(url, token, params);
}

// Gets all Foodiez Transactions matching params
export async function getFoodiezTransactions(token, params) {
    const url = `/gamification/foodieztransactions/`;
    return await makeGetRequest(url, token, params);
}

// Gets all XP Transactions matching params
export async function getXPTransactions(token, params) {
    const url = `/gamification/xptransactions/`;
    return await makeGetRequest(url, token, params);
}