import axios from "axios";
const prodURL = "";
const devURL = "http://localhost:3000"

const axiosInstance = axios.create({
    baseURL: `${devURL}/api/v1`
})

export default axiosInstance