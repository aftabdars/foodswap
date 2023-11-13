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
export async function getFoods(params) {
    const url = `/food/`;
    return await makeGetRequest(url, undefined, params);
}

// Gets a food item
export async function getFood(id) {
    const url = `/food/${id}`;
    return await makeGetRequest(url, undefined);
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
