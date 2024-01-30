import React, { useContext } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import { getColors, ThemeContext } from '../../assets/Theme';
import { getUserToken } from "../../storage/UserToken";
import { getBugReports } from "../../api/backend/AppInsight";
import PaginatedFlatList from "../../components/PaginatedFlatList";
import MaterialButtonSuccess from "../../components/MaterialButtonSuccess";
import { formatTimestamp } from "../../utils/Format";


const BugReports = () => {
    // Theme
    const theme = useContext(ThemeContext).theme;
    const colors = getColors(theme);
    const styles = createStyles(colors);

    // Gets bug reports
    const getBugReportsData = async (page) => {
        const token = (await getUserToken()).token;
        let response;
        try {
            response = await getBugReports(token, { 'page': page });
            return response.data;
        }
        catch (error) { }
    }

    // Render bug report component item
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
            </View>
            <Text style={styles.type}>{item.type}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.userinfo}>
                <Image
                    source={item.user_profile_picture ? { uri: item.user_profile_picture } : require("../../assets/images/default_profile.jpg")}
                    style={styles.userPic}
                />
                <Text style={styles.userName}>{item.user_username}</Text>
            </View>
            <View style={styles.footer}>
                <Text style={styles.status}>Status: {item.status}</Text>

                <MaterialButtonSuccess
                    style={styles.updateStatusButton}
                    onPress={() => console.log("updated")}
                >
                    <Text styles={styles.updateStatusButtonText}>Update Status</Text>
                </MaterialButtonSuccess>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <PaginatedFlatList
                colors={colors}
                loadData={getBugReportsData}
                renderItem={renderItem}
                alternativeText={'No bug reports to show'}
            />
        </View>
    )
};

function createStyles(colors) {
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
            backgroundColor: colors.background,
        },
        card: {
            backgroundColor: colors.background2,
            borderRadius: 12,
            padding: 16,
            //width: '80%',
            elevation: 3,
            marginVertical: 5
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
        },
        title: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.foreground,
        },
        type: {
            fontSize: 12,
            fontWeight: 'bold',
            color: colors.highlight2,
            marginBottom: 8,
        },
        timestamp: {
            fontSize: 12,
            color: colors.foreground,
        },
        description: {
            fontSize: 14,
            color: colors.foreground,
            marginBottom: 12,
        },
        userinfo: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
        },
        userPic: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 12,
        },
        userName: {
            fontSize: 14,
            color: colors.foreground,
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        status: {
            fontSize: 14,
            color: colors.foreground,
        },
        updateStatusButton: {
            backgroundColor: colors.highlight1,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            alignItems: "center",
        },
        updateStatusButtonText: {
            color: colors.foreground,
            fontSize: 14,
            fontWeight: "bold",
        },
    });
}

export default BugReports;

