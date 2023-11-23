const jsonData = `
{
    "food": {
        "id": 6,
        "name": "Danis Pizza",
        "description": "Very tasty cheesy pizza",
        "image": "https://backend-foodswap.koyeb.app/media/food/Danis-Pizza.jpeg",
        "category": 12,
        "owner": 12,
        "date_added": "2023-11-15T22:29:54.356114Z",
        "status": "up",
        "up_for": "swap",
        "feedback_count": 0,
        "rating_count": 0,
        "average_rating": "0.0",
        "is_being_shared": false,
        "is_being_swapped": false
    },
    
    "feedback": {
        "id": 1,
        "message": "Very yummy",
        "timestamp": "2023-09-22T12:56:01.976344Z",
        "user": 1,
        "food": 1
    }
}
`

export const foodData = JSON.parse(jsonData)
export default foodData