import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, TextInput, Button, Text, FlatList, StyleSheet } from 'react-native';
import CupertinoSearchBarBasic from "../components/CupertinoSearchBarBasic";

import { ThemeContext, getColors } from '../assets/Theme';
import SearchedFoodPreview from '../components/SearchedFoodPreview';
import { getFoods } from '../api/backend/Food';
import { getUsers } from '../api/backend/User';
import SearchedUserPreview from '../components/SearchedUserPreview';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getUserToken } from '../storage/UserToken';
import PaginatedFlatList from '../components/PaginatedFlatList';

const Search = () => {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);
  const styles = createStyles(colors);
  // States
  const [query, setQuery] = useState('');
  const [resultCount, setResultCount] = useState(0);
  const [searchTimer, setSearchTimer] = useState(null);

  const flatListRef = useRef(null);

  // What is the search for (Food or User)? Default is for Food
  const route = useRoute();
  const userSearch = route.params?.userSearch;

  const navigation = useNavigation();

  const renderItem = ({ item }) => {
    if (userSearch) {
      return <SearchedUserPreview userData={item} colors={colors} navigation={navigation} />
    }
    return <SearchedFoodPreview foodData={item} colors={colors} navigation={navigation} />
  }

  // Perform the search after a delay
  const delayedSearch = async (page) => {
    if (query.length > 0) {
      // Get search results from API
      let response = undefined;
      const token = (await getUserToken()).token;
      const params = {
        'search': query,
        'page': page
      }
      try {
        if (userSearch) {
          response = await getUsers(token, params);
        }
        else {
          response = await getFoods(token, params);
        }
        setResultCount(response.data.count);
        return response.data; // Returned data will be used in the PaginatedFlatList component
      }
      catch (error) { }
    }
    else {
      setResultCount(0);
    }
  };

  const handleSearch = (text) => {
    setQuery(text);
    setResultCount(0);

    // Clears timer if there already was one
    if (searchTimer && searchTimer !== null) {
      clearTimeout(searchTimer);
    }
    // Set a timeout to trigger the search after 500ms
    setSearchTimer(
      setTimeout(() => {
        if (flatListRef.current && flatListRef.current.resetAndLoadData) {
          flatListRef.current.resetAndLoadData();
        }
      }, 500) // 500ms delay before triggering the search
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <CupertinoSearchBarBasic
          style={styles.searchInput}
          inputStyle={userSearch ? 'Search for user' : 'Search for food'}
          value={query}
          onChangeText={(text) => handleSearch(text)}
          autoFocus={true}
        />
        {query &&
          <Text style={styles.queryText}>
            Searched '{query}' with {resultCount} results
          </Text>
        }
      </View>
      <PaginatedFlatList
        ref={flatListRef}
        colors={colors}
        loadData={delayedSearch}
        loadDataInitially={false}
        renderItem={renderItem}
      />
    </View>
  );
};

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 0,
      backgroundColor: colors.background,
    },
    headerContainer: {
      marginBottom: 10,
      paddingTop: 20,
      paddingHorizontal: 20,
    },
    searchInput: {
      height: 40,
      paddingHorizontal: 10,
      marginBottom: 5,
      backgroundColor: colors.background,
    },
    queryText: {
      marginBottom: 5,
      color: colors.foreground
    },
  });
}

export default Search;
