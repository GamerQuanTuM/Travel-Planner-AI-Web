import axios from "axios";
const prodURL = "https://travel-ai-omega.vercel.app/api/v1";
const devURL = "http://localhost:3000/api/v1"

const axiosInstance = axios.create({
    baseURL: prodURL
})

export default axiosInstance