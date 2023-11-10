import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
import Image from 'next/image';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
       process.env.NEXT_PUBLIC_POST_LOGIN,
        {
          username,
          password,
        }
      );

      const { token } = response.data;

      // Verifica se o token foi retornado
      if (token) {
        // Armazene o token em localStorage ou cookies
        localStorage.setItem("token", token);

        // Redirecione o usuário para a área de administração
        router.push("/admin");
      } else {
        // Exiba uma mensagem de erro se o token estiver ausente
        alert("Senha incorreta. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro de login:", error);
      // Exiba uma mensagem de erro genérica se ocorrer um erro
      alert("Ocorreu um erro durante o login. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body ">
              <div className="text-center m-3">
              <Image src="/logo-min.png" className="img-fluid" alt="Logo" width={120} height={120} />
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
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Lembrar-me
                  </label>
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
