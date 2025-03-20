import axios from "axios";

console.log('BASE URL', process.env.NEXT_PUBLIC_BASE_URL)

export default axios.create({ baseURL: process.env.NEXT_PUBLIC_BASE_URL })