import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../../../styles/menu.module.css";
import Image from "next/image";
import ModalCart from "./ModalCart";

export default function NavMenu({ cartCount, cart, setCart, setCartCount }) {
  const [showModal, setShowModal] = useState(false);
  const [isMenuAvailable, setIsMenuAvailable] = useState(false);

  useEffect(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentHour = now.getHours();

    // Almoço de 10:30 até 14:30 de segunda a sábado
    const isLunchTime =
      currentHour >= 10 && currentHour < 15 && dayOfWeek !== 0;
    // Jantar de 18:30 até 22:30 de segunda a domingo
    const isDinnerTime = currentHour >= 18 && currentHour < 23;

    // Jantar de 18:30 até 22:30 no domingo
    const isSundayDinner =
      dayOfWeek === 0 && currentHour >= 18 && currentHour < 23;

    const isMenuAvailable =
      dayOfWeek >= 0 &&
      dayOfWeek <= 6 &&
      (isLunchTime || isDinnerTime || isSundayDinner);
    setIsMenuAvailable(isMenuAvailable);
  }, []);

  const openModal = () => {
    if (isMenuAvailable) {
      setShowModal(true);
    } else {
      // Utilizando toast para informar ao usuário que o menu não está disponível
      toast.warning("Desculpe, não estamos no horário de expediente.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <div className="row">
      <nav className={`text-center bg-dark ${styles.navbar}`}>
        <div className="text-center">
          <Image
            src="/logo-min.png"
            className={`${styles.logo} img-fluid`}
            alt="Logo"
            width={50}
            height={50}
          />
        </div>
        <h6
          className="text-light fs-2 fw-bold font-weight-normal text-center"
          style={{
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
          }}
        >
          Menu Conquista
        </h6>
        <Button
          className={`bg-danger border-danger shadow ${styles.cartButton}`}
          onClick={openModal}
        >
          <FontAwesomeIcon icon={faCartShopping} className={styles.cartIcon} />{" "}
          <span className={styles.cartCount}>{cartCount}</span>{" "}
        </Button>
      </nav>
      <ModalCart
        cart={cart}
        cartCount={cartCount}
        setCart={setCart}
        setCartCount={setCartCount}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </div>
  );
}
