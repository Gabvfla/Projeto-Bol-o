import { createContext, useEffect, useState } from "react"
import axios from "../api/axios"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      axios.get("/auth/me").then(res => setUser(res.data)).catch(() => logout())
    }
  }, [])

  const login = async (email, password) => {
    const res = await axios.post("/auth/login", { email, password })
    localStorage.setItem("token", res.data.token)
    axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
    const me = await axios.get("/auth/me")
    setUser(me.data)
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
