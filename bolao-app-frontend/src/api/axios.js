import axios from "axios"

const instance = axios.create({
  baseURL: "http://localhost:5000/bolao" // ou o IP do seu back
})

export default instance
