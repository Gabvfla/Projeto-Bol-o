import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Register fom "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreatePool from "./pages/CreatePool";
import Ranking from "./pages/Ranking"; // Importando a página de Ranking
import PrivateRoute from "./routes/PrivateRoute";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute><Home /></PrivateRoute>
          } />
          <Route path="/create" element={
            <PrivateRoute><CreatePool /></PrivateRoute>
          } />
          <Route path="/pool/:poolId/ranking" element={
            <PrivateRoute><Ranking /></PrivateRoute>
          } />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
