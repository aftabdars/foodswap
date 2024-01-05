import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { TabBar, TabView } from 'react-native-tab-view';

const CustomTabView = (props) => {
    const styles = createStyles(props.colors);
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState(props.routes);

    return (
        <TabView style={[styles.tabbedcontainer, props.style]}
            navigationState={{ index, routes }}
            renderScene={props.renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={(tabProps) => (
                <TabBar
                    {...tabProps}
                    style={styles.tabBar}
                    indicatorStyle={styles.tabBarIndicator}
                />
            )}
        />
    )
}

function createStyles(colors) {
    return StyleSheet.create({
        tabbedcontainer: {
            width: '100%',
            height: 360,
            justifyContent: "space-between",
        },
        tabBar: {
            backgroundColor: colors.highlight1
        },
        tabBarIndicator: {
            backgroundColor: colors.foreground
        }
    })
}

export default CustomTabView;