import { Polyline } from 'react-native-maps';

export const animateToNewCoordinates = (mapReference, latitude, longitude, withDelta = false) => {
    const DEFAULT_DELTA = 0.003;
    
    if (mapReference && mapReference.current) {
        mapReference.current.animateToRegion(
            {
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: withDelta && DEFAULT_DELTA,
                longitudeDelta: withDelta && DEFAULT_DELTA,
            },
            1000 // Duration in milliseconds for the animation
        );
    }
};

// Calculates distance between two points and returns distance in kilometers
export const calculateDistance = (point1, point2) => {
    if (!point1 || !point2) return;
    
    const lat1 = point1["latitude"];
    const lon1 = point1["longitude"];
    const lat2 = point2["latitude"];
    const lon2 = point2["longitude"];

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
};

// Function to render polyline
export const renderPolyline = (loc1, loc2, color = "blue") => {
    if (loc1 && loc2) {
        // Assuming you want to draw a line between the first two markers
        const coordinates = [
            loc1,
            loc2,
        ];
        return (
            <Polyline
                coordinates={coordinates}
                strokeWidth={2}
                strokeColor={color}
            />
        );
    }
    return;
};
