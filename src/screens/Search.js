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

const Search = () => {
  // Theme
  const theme = useContext(ThemeContext).theme;
  const colors = getColors(theme);
  const styles = createStyles(colors);
  // States
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [searchTimer, setSearchTimer] = useState(null);

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // What is the search for (Food or User)? Default is for Food
  const route = useRoute();
  const userSearch = route.params?.userSearch;

  const navigation = useNavigation();

  const renderItem = ({item}) => {
    if (userSearch) {
      return <SearchedUserPreview userData={item} colors={colors} navigation={navigation}/>
    }
    return <SearchedFoodPreview foodData={item} colors={colors} navigation={navigation}/>
  }

  // Perform the search after a delay
  const delayedSearch = async (text) => {
    if(text.length > 0) {
      // Get search results from API
      let response = undefined;
      const token = (await getUserToken()).token;
      try {
        if(userSearch) {
          response = await getUsers(token, {'search': text, 'page': page});
        }
        else {
          response = await getFoods(token, {'search': text, 'page': page});
        }
        setSearchResults((prevResults) => [
          ...prevResults,
          ...response.data.results,
        ]);
        setResultCount(response.data.count);
        setHasNextPage(response.data.next !== null);
        setPage(response.data.next !== null? page + 1 : 1);
      }
      catch(error) { }
    }
    else {
      setSearchResults(undefined);
      setResultCount(0);
    }
  };

  const handleSearch = (text) => {
    setQuery(text);
    setPage(1);
    setHasNextPage(false);
    setSearchResults([]);

    // Clears timer if there already was one
    if (searchTimer && searchTimer !== null) {
      clearTimeout(searchTimer);
    }
    // Set a timeout to trigger the search after 500ms
    setSearchTimer(
      setTimeout(() => {
        delayedSearch(text);
      }, 500) // 500ms delay before triggering the search
    ); 
  };

  const handleLoadMore = async () => {
    if (loading || !hasNextPage) {
      return;
    }

    setLoading(true);
    await delayedSearch(query);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <CupertinoSearchBarBasic
          style={styles.searchInput}
          inputStyle={userSearch? 'Search for user' : 'Search for food'}
          value={query}
          onChangeText={(text) => handleSearch(text)}
          autoFocus={true}
        />
        {query && searchResults &&
          <Text style={styles.queryText}>
            Searched '{query}' with {resultCount} results
          </Text>
        }
      </View>
      {searchResults && 
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.flatList}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
        />
      }
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
    flatList: {
      padding: 0,
    },
  });
}

export default Search;
