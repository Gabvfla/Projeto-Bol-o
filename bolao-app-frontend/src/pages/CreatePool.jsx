import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../api/axios"
import { AuthContext } from "../contexts/AuthContext"

const CreatePool = () => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!user?.isAdmin) {
      setError("Acesso negado: você não é um administrador.")
      return
    }

    try {
      await axios.post("/pools", {
        name,
        description
      })
      navigate("/")
    } catch (err) {
      console.error(err)
      setError("Erro ao criar bolão.")
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Criar Bolão</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700">Nome do Bolão</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Descrição</label>
          <textarea
            className="w-full p-2 border rounded"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Criar
        </button>
      </form>
    </div>
  )
}

export default CreatePool
