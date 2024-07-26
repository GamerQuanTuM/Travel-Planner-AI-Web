import axios from "axios";
const prodURL = "";
const devURL = "http://localhost:3000/api/v1"

const axiosInstance = axios.create({
    baseURL: devURL
})

export default axiosInstance