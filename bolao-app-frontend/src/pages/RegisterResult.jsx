import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "../api/axios"
import { AuthContext } from "../contexts/AuthContext"

const RegisterResult = () => {
  const { id: matchId } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [match, setMatch] = useState(null)
  const [scoreA, setScoreA] = useState("")
  const [scoreB, setScoreB] = useState("")
  const [scorers, setScorers] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await axios.get(`/matches/${matchId}`)
        setMatch(res.data)
      } catch (err) {
        setError("Erro ao carregar partida.")
      }
    }

    fetchMatch()
  }, [matchId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user?.isAdmin) {
      setError("Apenas administradores podem registrar resultados.")
      return
    }

    try {
      await axios.put(`/matches/${matchId}/result`, {
        scoreA: Number(scoreA),
        scoreB: Number(scoreB),
        scorers: scorers.split(",").map(s => s.trim()), // transforma em array
      })
      setSuccess("Resultado registrado com sucesso!")
      setTimeout(() => navigate(`/pools/${match?.poolId}`), 1500)
    } catch (err) {
      setError("Erro ao registrar resultado.")
    }
  }

  if (!match) return <div className="p-4">Carregando partida...</div>

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Resultado: {match.teamA} x {match.teamB}
        </h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}

        <div className="mb-4">
          <label className="block text-gray-700">Gols do {match.teamA}</label>
          <input
            type="number"
            value={scoreA}
            onChange={(e) => setScoreA(e.target.value)}
            className="w-full p-2 border rounded"
            required
            min={0}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Gols do {match.teamB}</label>
          <input
            type="number"
            value={scoreB}
            onChange={(e) => setScoreB(e.target.value)}
            className="w-full p-2 border rounded"
            required
            min={0}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">
            Jogadores que marcaram (separados por vírgula)
          </label>
          <input
            type="text"
            value={scorers}
            onChange={(e) => setScorers(e.target.value)}
            placeholder="Ex: João, Maria, Pedro"
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Registrar Resultado
        </button>
      </form>
    </div>
  )
}

export default RegisterResult
