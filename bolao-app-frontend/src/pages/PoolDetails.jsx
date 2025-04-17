import { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "../api/axios"
import { AuthContext } from "../contexts/AuthContext"

const PoolDetails = () => {
  const { id } = useParams()
  const [pool, setPool] = useState(null)
  const [matches, setMatches] = useState([])
  const [error, setError] = useState("")
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resPool = await axios.get(`/pools/${id}`)
        setPool(resPool.data)

        const resMatches = await axios.get(`/matches/pool/${id}`)
        setMatches(resMatches.data)
      } catch (err) {
        setError("Erro ao buscar detalhes do bolão.")
      }
    }

    fetchData()
  }, [id])

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  if (!pool) {
    return <div className="p-4">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{pool.name}</h1>
          <p className="text-gray-600">{pool.description}</p>
        </div>
        {user?.isAdmin && (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => navigate(`/pools/${id}/create-match`)}
          >
            Criar Partida
          </button>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4">Partidas</h2>

      {matches.length === 0 ? (
        <p>Nenhuma partida cadastrada.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {matches.map(match => (
            <div
              key={match._id}
              className="bg-white p-4 rounded shadow flex flex-col justify-between"
            >
              <div>
                <p className="text-lg font-semibold">
                  {match.teamA} vs {match.teamB}
                </p>
                <p className="text-gray-600">Data: {new Date(match.date).toLocaleString()}</p>
              </div>

              <button
                onClick={() => navigate(`/matches/${match._id}`)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {user?.isAdmin ? "Ver / Editar Resultados" : "Fazer Palpite"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PoolDetails
