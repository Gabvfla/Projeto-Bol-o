import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  max-width: 400px;
  margin: 100px auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Title = styled.h2`
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.8rem;
  margin-top: 1rem;
  background: teal;
  color: white;
  border: none;
  cursor: pointer;
`;

const Error = styled.p`
  color: red;
`;

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/api/auth/register", {
        name,
        email,
        password,
        isAdmin,
      });

      alert("Registrado com sucesso!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao registrar.");
    }
  };

  return (
    <Container>
      <Title>Registrar</Title>
      {error && <Error>{error}</Error>}
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Registrar</Button>
      </form>
    </Container>
  );
}
