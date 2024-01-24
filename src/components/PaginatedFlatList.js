import React, { useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import MaterialSpinner from "./MaterialSpinner";

// A FlatList with on scroll to bottom pagination functionality, 
// Page will be incremented on scroll end, and passed to props.loadData function, 
// props.loadData is expected to return a backend API request's response.data object which contains results, next(page) etc
// Also, reference(ref) can be used to reset and load data fresh

const PaginatedFlatList = React.forwardRef((props, ref) => {
    const colors = props.colors;
    const styles = createStyles(colors);

    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [refreshCount, setRefreshCount] = useState(0);

    // By default data will be loaded automatically initially
    const loadDataInitially = props.loadDataInitially !== undefined ? props.loadDataInitially : true;

    // Load data initially if required, by default it will load
    useEffect(() => {
        if ((loadDataInitially && (!data || data.length === 0)) || refresh) {
            (async () => {
                await resetAndLoadData();
            })();
        }
        if (refresh) setRefresh(false);
    }, [refreshCount]);

    // Requests and loads data by providing a page number
    const loadData = async (page = 1, reset = false) => {
        // responsedata can either be a backend API response.data object or undefied or []
        const responseData = props.loadData && await props.loadData(page);

        if (responseData) {
            setData((prevResults) => [
                ...(reset ? [] : prevResults), // Resetting previous data after API request is successfull will not make same food item retrived vanish for a second 
                ...responseData.results,
            ]);
            setHasNextPage(responseData.next !== null);
            setPage(responseData.next !== null ? page + 1 : 1);
        }
        else {
            setData([]);
        }
    }

    // May be called via ref
    const resetAndLoadData = async () => {
        setPage(1); // This may take some time (pov CPU), that's why Page is passed to LoadData() hardcoded way
        setHasNextPage(false);

        setLoading(true);
        await loadData(1, true); // Page = 1, Reset = true
        setLoading(false);
    }

    // Loads more data on scroll to bottom if there's more
    const handleLoadMore = async () => {
        if (loading || !hasNextPage) {
            return;
        }
        setLoading(true);
        await loadData(page);
        setLoading(false);
    };

    const onRefresh = () => {
        setRefreshCount(refreshCount + 1);
        setRefresh(true);
    };

    // Expose through ref
    React.useImperativeHandle(ref, () => ({
        resetAndLoadData,
        getData: () => data,
        setDataFromExternal: (newData) => setData(newData),
    }));

    return (
        <View style={styles.container}>
            {data && data.length > 0 &&
                <FlatList
                    ref={ref}
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={props.renderItem}
                    style={[styles.flatList, props.style]}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={props.onEndReachedThreshold || 0.3}
                    inverted={props.inverted}
                    horizontal={props.horizontal}
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={onRefresh}
                            colors={[colors.highlight1, colors.highlight2]}
                            tintColor={colors.highlight2}
                        />
                    }
                >
                    {props.children}
                </FlatList>
                ||
                <Text style={[styles.alternativeText, props.alternativeTextStyle]}>
                    {props.alternativeText && props.alternativeText}
                </Text>
            }
            {loading && (
                <MaterialSpinner colors={colors} style={styles.loadingContainer} />
            )}
        </View>
    );
});

function createStyles(colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
        },
        flatList: {
            padding: 0,
        },
        loadingContainer: {
            alignItems: 'center',
            padding: 8,
        },
        alternativeText: {
            color: colors.foreground,
            textAlign: 'center',
            justifyContent: 'center',
            margin: 10
        },
    });
}

export default PaginatedFlatList;