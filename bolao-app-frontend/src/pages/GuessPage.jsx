import { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "../api/axios"
import { AuthContext } from "../contexts/AuthContext"

const GuessPage = () => {
  const { id: matchId } = useParams()
  const [match, setMatch] = useState(null)
  const [scoreA, setScoreA] = useState("")
  const [scoreB, setScoreB] = useState("")
  const [goalScorer, setGoalScorer] = useState("")
  const [error, setError] = useState("")
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

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
    try {
      await axios.post(`/guesses`, {
        matchId,
        userId: user._id,
        scoreA: Number(scoreA),
        scoreB: Number(scoreB),
        goalScorer,
      })
      navigate(`/pools/${match.poolId}`)
    } catch (err) {
      console.error(err)
      setError("Erro ao enviar palpite.")
    }
  }

  if (!match) {
    return <div className="p-4">Carregando partida...</div>
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Palpite para {match.teamA} vs {match.teamB}
        </h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">
            Gols do {match.teamA}
          </label>
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
          <label className="block text-gray-700 mb-1">
            Gols do {match.teamB}
          </label>
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
          <label className="block text-gray-700 mb-1">
            Jogador que fará gol (opcional)
          </label>
          <input
            type="text"
            value={goalScorer}
            onChange={(e) => setGoalScorer(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Ex: João, Messi, etc"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Enviar Palpite
        </button>
      </form>
    </div>
  )
}

export default GuessPage
