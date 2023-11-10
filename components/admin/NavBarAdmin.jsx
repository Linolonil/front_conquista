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

  const href = {
    url: "/admin",
    name: "Admin",
  };

  return (
    <nav className="navbar navbar-expand-lg ">
      <div className="container d-flex flex-column align-items-center">
        <Link href={href.url}>
          <Image
            src="/logo-min.png"
            alt="Imagem Responsiva"
            width={150}
            height={150}
          />
        </Link>

        <p className="navbar-text alert alert-primary mt-4 mx-3 text-center fs-4">
          {getWelcomeMessage(message)}
        </p>
        <button className="btn btn-danger" onClick={handleLogout}>
          Encerrar Sessão
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
