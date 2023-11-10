import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    // Cria um id específico para a notificação
    const toastId = "greeting-notification";

    // Verifica se a notificação já está ativa
    if (!toast.isActive(toastId)) {
      const currentHour = new Date().getHours();
      let greetingMessage = "";
      let iconActual = ""

      if (currentHour >= 5 && currentHour < 12) {
        greetingMessage = "Bom dia";
        iconActual = "🌞";
      } else if (currentHour >= 12 && currentHour < 18) {
        greetingMessage = "Boa tarde";
        iconActual = "☀️";
      } else {
        greetingMessage = "Boa noite";
        iconActual = "🌙";
      }

      // Exibe a notificação apenas se não estiver ativa
      toast.success(greetingMessage, {
        toastId,
        icon: `${iconActual}`
      });
    }
  }, []);

  useEffect(() => {
    // Restaurar dados do localStorage
    const savedUsername = localStorage.getItem("savedUsername");
    const savedPassword = localStorage.getItem("savedPassword");
    const savedRememberMe = localStorage.getItem("savedRememberMe");

    if (savedRememberMe === "true" && savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_POST_LOGIN, {
        username,
        password,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);

        // Salvar dados se "Lembrar-me" estiver marcado
        if (rememberMe) {
          localStorage.setItem("savedUsername", username);
          localStorage.setItem("savedPassword", password);
          localStorage.setItem("savedRememberMe", "true");
        } else {
          // Limpar dados do localStorage se "Lembrar-me" não estiver marcado
          localStorage.removeItem("savedUsername");
          localStorage.removeItem("savedPassword");
          localStorage.removeItem("savedRememberMe");
        }

        // Mostra um toast de sucesso
        toast.success("Login bem-sucedido!");
        router.push("/admin");
      } else {
        // Mostra um toast de erro
        toast.error("Senha incorreta. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro de login:", error);

      if (error.response) {
        // O servidor retornou uma resposta com um status diferente de 2xx
        if (error.response.status === 401) {
          // Status 401 indica que a autenticação falhou (usuário ou senha incorretos)
          toast.error("Nome de usuário ou senha incorretos. Tente novamente.");
        } else {
          // Outros códigos de status podem ser tratados conforme necessário
          toast.error(`Erro no servidor: ${error.response.status}`);
        }
      } else if (error.request) {
        // A solicitação foi feita, mas não recebeu resposta
        toast.error("Sem resposta do servidor. Tente novamente mais tarde.");
      } else {
        // Erro durante a configuração da solicitação
        toast.error(
          "Erro durante a configuração da solicitação. Tente novamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body ">
              <div className="text-center m-3">
                <Image
                  src="/logo-min.png"
                  className="img-fluid"
                  alt="Logo"
                  width={120}
                  height={120}
                />
              </div>
              <h2 className="card-title text-center">Login</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Nome de usuário
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="Nome de usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Senha
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Lembrar-me
                  </label>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Carregando..." : "Login"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Adiciona o ToastContainer no final da sua árvore de componentes */}
      <ToastContainer />
    </div>
  );
};

export default Login;
