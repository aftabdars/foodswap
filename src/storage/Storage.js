import AsyncStorage from '@react-native-async-storage/async-storage';
import { MAX_CACHE_SIZE, CACHE_EXPIRATION_TIME } from './config';

const cache = new Map();

// Gets data from cache, if it is not in cache, takes from storage and also adds it to cache
export const getCachedData = async (key) => {
    console.log('Getting ' + key);
    removeExpiredCachedData();
  if (cache.has(key)) {
    console.log('Here it is from cache ' + key + ': ' + cache.get(key).data);
    return cache.get(key).data;
  } else {
    const data = await AsyncStorage.getItem(key);
    const item = { data, timestamp: Date.now() };
    cache.set(key, item);
    if (cache.size > MAX_CACHE_SIZE) {
      cache.delete(cache.keys().next().value);
    }
    console.log('Here it is from storage ' + key + ': ' + data);
    return data;
  }
};

// Sets or updates(if data already exists) data in cache and storage
export const setCachedData = async (key, data) => {
  console.log('Setting ' + key + ': ' + data)
  await AsyncStorage.setItem(key, data);
  const item = { data, timestamp: Date.now() };
  cache.set(key, item);
  if (cache.size > MAX_CACHE_SIZE) {
    cache.delete(cache.keys().next().value);
  }
  console.log('Data is set');
};

// Removes data from cache and storage
export const removeCachedData = (key) => {
  AsyncStorage.removeItem(key);
  cache.delete(key);
};


// Iterate over all cache data and remove elements whose expiration time is reached or exceeded
const removeExpiredCachedData = () => {
    const now = Date.now();
    for (const [key, { timestamp }] of cache.entries()) {
      if (now - timestamp > CACHE_EXPIRATION_TIME) {
        cache.delete(key);
      }
    }
};
