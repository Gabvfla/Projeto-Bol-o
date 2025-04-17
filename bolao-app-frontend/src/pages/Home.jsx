import { useContext, useEffect, useState } from "react"
import axios from "../api/axios"
import { AuthContext } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

const Home = () => {
  const [pools, setPools] = useState([])
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const res = await axios.get("/pools")
        setPools(res.data)
      } catch (err) {
        console.error("Erro ao buscar bolões", err)
      }
    }
    fetchPools()
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bolões disponíveis</h1>
        <div className="flex gap-4 items-center">
          {user?.isAdmin && (
            <button
              onClick={() => navigate("/create")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Criar Bolão
            </button>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pools.map(pool => (
          <div key={pool._id} className="bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
               onClick={() => navigate(`/pools/${pool._id}`)}>
            <h2 className="text-xl font-semibold">{pool.name}</h2>
            <p className="text-gray-600">{pool.description}</p>
            <p className="text-sm mt-2 text-gray-500">Criado por: {pool.createdBy?.name || 'Desconhecido'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
