import axios from "axios";

/* export default axios.create({
    baseURL: "http://localhost:3000/api/v1/restaurants"
}); */

export default axios.create({
    baseURL: "https://restaurant-review-pern.herokuapp.com/api/v1/restaurants"
});