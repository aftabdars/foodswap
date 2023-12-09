import { getCachedData, setCachedData, removeCachedData } from "./Storage";
import { getUserToken } from "./UserToken";
import { getClientProfile, getClientStats, getClientSettings } from "../api/backend/User"; // Dependent on API

//==========================User Profile================================//

// Gets user profile
export const getProfile = async () => {
    let profile = await getCachedData('profile');
    profile = JSON.parse(profile);
    if(profile && profile !== null) {
        // Check if the profile is modified at server, if so then update in storage
        const token = await getUserToken();
        getClientProfile(token.token, new Date(profile.timestamp))
        .then(response => {
            if (response.status === 200) { // Data was modified and body is returned
                // Update the stored data with returned modified data and return that data
                setProfile(response.data);
                return response.data;
            }
        })
        .catch(error => {
            if (error.response.status === 304) { // Status 304, Not Modified
                // Same data will be returned in last return statement
                console.log('Data is not modified at backend');
            }
            else {
                console.log(error.response.status);
                console.log(error);
                throw new Error('Error getting client profile from server');
            }
        })
    }
    return JSON.parse(profile.profile);
};

// Sets or updates user profile
export const setProfile = (profile) => {
    return setCachedData('profile', JSON.stringify({
        'profile': JSON.stringify(profile),
        'timestamp': new Date()
    }));
};

// Removes user profile
export const removeProfile = () => {
    return removeCachedData('profile');
};

//==========================User Stats================================//

export const getStats = async () => {
    let stats = await getCachedData('stats');
    stats = JSON.parse(stats);
    if(stats && stats !== null) {
        // Check if the stats is modified at server, if so then update in storage
        const token = await getUserToken();
        getClientStats(token.token, new Date(stats.timestamp))
        .then(response => {
            if (response.status === 200) { // Data was modified and body is returned
                // Update the stored data with returned modified data and return that data
                setStats(response.data);
                return response.data;
            }
        })
        .catch(error => {
            if (response.status === 304) { // Status 304, Not Modified
                console.log('Data is not modified at backend');
            }
            else {
                console.log(error.response.status);
                console.log(error);
                throw new Error('Error getting client stats from server');
            }
        })
    }
    return JSON.parse(stats.stats);
};

// Sets or updates user stats
export const setStats = (stats) => {
    return setCachedData('stats', JSON.stringify({
        'stats': JSON.stringify(stats),
        'timestamp': new Date()
    }));
};

// Removes user stats
export const removeStats = () => {
    return removeCachedData('stats');
};
