import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import styles from "../../../styles/menu.module.css";
import Image from "next/image";
import ModalCart from "./ModalCart"; // Import the correct path

export default function NavMenu({ cartCount, cart, setCart, setCartCount }) {
  const [showModal, setShowModal] = useState(false);

  // Função para abrir o modal do carrinho
  const openModal = () => {
    setShowModal(true);
  };

  return (
    <div className="row">
    <nav className={`text-center bg-dark ${styles.navbar}`} style={{ boxShadow: '0px 5px 5px -5px rgba(0, 0, 0, 0.75)' }}>
      <div className="text-center">
        <Image
          src="/logo-min.png"
          className={`${styles.logo} img-fluid`}
          alt="Logo"
          width={50}
          height={50}
        />
      </div>
      <h6 className="text-light fs-2 custom-font">Cardápio Conquista</h6>
      <Button
        className={`bg-danger border-danger shadow ${styles.cartButton}`}
        onClick={openModal}
      >
        <FontAwesomeIcon icon={faCartShopping} className={styles.cartIcon} />{" "}
        <span className={styles.cartCount}>{cartCount}</span>{" "}
      </Button>
    </nav>
    {/* Modal do carrinho */}
    <ModalCart
      cart={cart}
      cartCount={cartCount}
      setCart={setCart}
      setCartCount={setCartCount}
      showModal={showModal}
      setShowModal={setShowModal}
    />
  </div>
  )  
}
