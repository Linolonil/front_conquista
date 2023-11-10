import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

const NavBar = ({ message }) => {
  const router = useRouter();

  function getWelcomeMessage(username) {
    if (username === "cleideConquistaLanche!") {
      return "Seja bem-vinda, Maria Cleide!";
    } else if (username === "veronicaConquistaLanche!") {
      return "Seja bem-vinda, Veronica!";
    } else {
      return "Bem-vindo!";
    }
  }

  const handleLogout = () => {
    // Remova o token do localStorage ou cookies
    localStorage.removeItem("token");

    // Redirecione o usuário de volta para a página de login
    router.push("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="d-flex justify-content-center">
            <Link href="/admin" passHref>
              <Image
                src="/logo-min.png"
                alt="Imagem Responsiva"
                width={150}
                height={150}
              />
            </Link>
          </div>

          <p className="navbar-text alert alert-primary mt-4">
            {getWelcomeMessage(message)}
          </p>

          <button className="btn btn-danger" onClick={handleLogout}>
            Encerrar Sessão
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
