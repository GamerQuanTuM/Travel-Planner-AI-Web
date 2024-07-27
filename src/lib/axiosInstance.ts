import axios from "axios";
const prodURL = "https://travel-planner-ai-web.onrender.com/api/v1";
const devURL = "http://localhost:3000/api/v1"

const axiosInstance = axios.create({
    baseURL: prodURL
})

export default axiosInstance