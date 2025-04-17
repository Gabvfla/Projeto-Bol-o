import { useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "../api/axios"
import { AuthContext } from "../contexts/AuthContext"

const CreateMatch = () => {
  const { id: poolId } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [teamA, setTeamA] = useState("")
  const [teamB, setTeamB] = useState("")
  const [date, setDate] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!user?.isAdmin) {
      setError("Apenas administradores podem criar partidas.")
      return
    }

    try {
      await axios.post(`/matches`, {
        poolId,
        teamA,
        teamB,
        date,
      })
      navigate(`/pools/${poolId}`)
    } catch (err) {
      console.error(err)
      setError("Erro ao criar partida.")
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Criar Partida</h2>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700">Time A</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={teamA}
            onChange={(e) => setTeamA(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Time B</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={teamB}
            onChange={(e) => setTeamB(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Data e Hora</label>
          <input
            type="datetime-local"
            className="w-full p-2 border rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Criar Partida
        </button>
      </form>
    </div>
  )
}

export default CreateMatch
