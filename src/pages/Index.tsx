
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona para o login ou dashboard
    navigate("/login");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cowork-50 to-cowork-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-cowork-800">CoWork Flow</h1>
        <p className="text-xl text-cowork-600">Sistema de Gestão para Coworking</p>
        <p className="mt-8">Carregando...</p>
      </div>
    </div>
  );
};

export default Index;
