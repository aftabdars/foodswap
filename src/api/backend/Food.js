import {
    makeGetRequest, 
    makePostRequest,
    makePutRequest,
    makeDeleteRequest
} 
from "./Api";

// Posts a food item
export async function postFood(token, body) {
    const url = `/food/`;
    const contentType = 'multipart/form-data';
    return await makePostRequest(url, token, body, contentType);
}

// Gets all food items matching params
export async function getFoods(token, params) {
    const url = `/food/`;
    return await makeGetRequest(url, token, params);
}

// Gets a food item
export async function getFood(id, token) {
    const url = `/food/${id}`;
    return await makeGetRequest(url, token);
}

// Deletes a food item
export async function deleteFood(id, token) {
    const url = `/food/${id}`;
    return await makeDeleteRequest(url, token);
}

// Updates a food item
export async function updateFood(id, token, body) {
    const url = `/food/${id}`;
    const contentType = 'multipart/form-data';
    return await makePutRequest(url, token, body, contentType);
}

export async function postFoodCategory(token, body) {
    const url = `/food/categories/`;
    return await makePostRequest(url, token, body);
}

// Gets all food categories matching params
export async function getFoodCategories(params) {
    const url = `/food/categories/`;
    return await makeGetRequest(url, undefined, params);
}

// Gets a food category
export async function getFoodCategory(id) {
    const url = `/food/categories/${id}`;
    return await makeGetRequest(url);
}

// Deletes a food category
export async function deleteFoodCategory(id, token) {
    const url = `/food/categories/${id}`;
    return await makeDeleteRequest(url, token);
}

// Updates a food category
export async function updateFoodCategory(id, token, body) {
    const url = `/food/categories/${id}`;
    const contentType = 'multipart/form-data';
    return await makePutRequest(url, token, body, contentType);
}

// Posts foodswap
export async function postFoodSwap(token, body) {
    const url = `/food/foodswap/`;
    return await makePostRequest(url, token, body);
}

// Updates the foodswap
export async function updateFoodSwap(id, token, body) {
    const url = `/food/foodswap/${id}`;
    return await makePutRequest(url, token, body);
}

// Get foodswaps
export async function getFoodSwaps(token, params) {
    const url = `/food/foodswap/`;
    return await makeGetRequest(url, token, params);
}

// Gets Foodswap
export async function getFoodSwap(id, token) {
    const url = `/food/foodswap/${id}`;
    return await makeGetRequest(url, token);
}

// Posts foodswap request
export async function postFoodSwapRequest(token, body) {
    const url = `/food/foodswap-requests/`;
    return await makePostRequest(url, token, body);
}

// Updates the foodswap request
export async function updateFoodSwapRequest(id, token, body) {
    const url = `/food/foodswap-requests/${id}`;
    return await makePutRequest(url, token, body);
}

// Deletes the foodswap request
export async function deleteFoodSwapRequest(id, token, body) {
    const url = `/food/foodswap-requests/${id}`;
    return await makeDeleteRequest(url, token, body);
}
