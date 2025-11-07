import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useEffect, useState } from "react";
import Home from "./pages/home/Home";
import List from "./pages/list/List";
import New from "./pages/new/New";
import axios from "axios";

// Páginas específicas para cada rota
import Dashboard from "./pages/dashboard/Dashboard";
import Users from "./pages/users/Users";
import Clients from "./pages/clients/Clients";
import Status from "./pages/status/Status";
import Notifications from "./pages/notifications/Notifications";
import RegisterClient from "./pages/register-client/RegisterClient";
import Address from "./pages/address/Address";
import Contacts from "./pages/contacts/Contacts";
import License from "./pages/license/License";
import Responsible from "./pages/responsible/Responsible";
import SystemHealth from "./pages/system-health/SystemHealth";
import Settings from "./pages/settings/Settings";
import Profile from "./pages/profile/Profile";

import Company from "./pages/company/Company";
import EditUser from "./pages/users/EditUser";
import CreateUser from "./pages/users/CreateUser";
import ViewUser from "./pages/users/ViewUser";
import CreateClient from "./pages/clients/CreateClient";
import EditClient from "./pages/clients/EditClient";
import ViewClient from "./pages/clients/ViewClient";
import ViewContact from "./pages/contacts/ViewContact";
import EditContact from "./pages/contacts/EditContact";
import ViewAddress from "./pages/address/ViewAddress";
import EditAddress from "./pages/address/EditAddress";
import ViewLicense from "./pages/license/ViewLicense";
import EditLicense from "./pages/license/EditLicense";
import ViewAccountable from "./pages/responsible/ViewAccountable";
import EditAccountable from "./pages/responsible/EditAccountable";

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Configurar o token como header padrão para todas as requisições
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Chamada real à API para verificar o token e obter dados do usuário
          const res = await axios.get("http://localhost:3000/api/v1/auth/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUser(res.data.user);
        } catch (err) {
          console.error("Erro ao buscar dados do usuário:", err);
          setError("Falha ao carregar dados do usuário");
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        }
      } else {
        // Se não há token, garantir que o header de autorização seja removido
        delete axios.defaults.headers.common["Authorization"];
      }

      setIsLoading(false);
    };

    fetchUser();
  }, []);

  // Interceptor para atualizar automaticamente o header de autorização
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [user]);

  // Layout para páginas que precisam do sidebar
  const LayoutWithSidebar = ({ children }) => {
    return (
      <div className="flex min-h-screen pt-16">
        {" "}
        {/* pt-16 para compensar o navbar fixo */}
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-50">{children}</div>
      </div>
    );
  };

  // Componente de proteção de rotas
  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando...</p>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-16">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Acesso Restrito
            </h2>
            <p className="text-gray-600 mb-4">
              Você precisa estar logado para acessar esta página.
            </p>
            <a
              href="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Fazer Login
            </a>
          </div>
        </div>
      );
    }

    return children;
  };

  // Se estiver carregando, mostrar loading global
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage setUser={setUser} />} />

        {/* Rota inicial - redireciona baseado no estado de autenticação */}
        <Route
          path="/"
          element={
            user ? (
              <LayoutWithSidebar>
                <Dashboard />
              </LayoutWithSidebar>
            ) : (
              <Home user={user} error={error} />
            )
          }
        />

        {/* Rotas protegidas com sidebar */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <Dashboard />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />

        {/* Gestão de Usuários */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <Users />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/new"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <CreateUser />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/update/:id"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <EditUser />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <ViewUser />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />

        {/* Gestão de Clientes */}
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <Clients />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/new"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <CreateClient />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/update/:client_id"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <EditClient />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/getById/:client_id"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <ViewClient />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />

        {/* Sistema */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <Notifications />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />

        {/* Registro */}
        <Route
          path="/register-client"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <RegisterClient />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/address"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <Address />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <Contacts />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/license"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <License />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/responsible"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <Responsible />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />

        {/* Serviço */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <Settings />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />

        {/* Utilizador */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <Profile />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/company"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <Company />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />
  
        <Route
          path="/contacts/:contact_id"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <EditContact />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-address/:address_id"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <EditAddress />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/licenses/update/:license_id"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <EditLicense />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-accountable/:accountable_id"
          element={
            <ProtectedRoute>
              <LayoutWithSidebar>
                <EditAccountable />
              </LayoutWithSidebar>
            </ProtectedRoute>
          }
        />

        {/* Página 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-16">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-600">Página não encontrada</p>
                <a
                  href="/"
                  className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Voltar ao Início
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
