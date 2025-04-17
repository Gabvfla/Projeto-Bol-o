import React, { useState, useEffect } from "react";
import axios from "axios"; // ou a instância do axios que você estiver usando
import { useParams } from "react-router-dom";

const Ranking = () => {
  const [ranking, setRanking] = useState([]);
  const { poolId } = useParams(); // Usando o parâmetro poolId para obter o ranking de um bolão específico

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await axios.get(`/ranking/${poolId}`); // Requisitando o ranking do backend
        setRanking(response.data);
      } catch (err) {
        console.error("Erro ao carregar ranking", err);
      }
    };

    fetchRanking();
  }, [poolId]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Ranking de Pontuação</h1>

      <div className="bg-white p-6 rounded shadow">
        {ranking.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">Posição</th>
                <th className="py-2 px-4 text-left">Nome</th>
                <th className="py-2 px-4 text-left">Pontos</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((user, index) => (
                <tr key={user.userId}>
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4">{user.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">Ainda não há resultados.</p>
        )}
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => window.history.back()}
          className="text-blue-600"
        >
          Voltar para o bolão
        </button>
      </div>
    </div>
  );
};

export default Ranking;
