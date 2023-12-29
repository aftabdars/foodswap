
export function extractErrorMessage(errorMessages) {
    temp = errorMessages[Object.keys(errorMessages)[0]];

    while(Array.isArray(temp)) {
        temp = temp[0]
    }
    
    return temp;
}