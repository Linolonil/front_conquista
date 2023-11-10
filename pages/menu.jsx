// MenuCardapio.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import Image from "next/image";
import ModalCart from "../components/menu/ModalCart.jsx";
import ItemMenu from "../components/menu/ItemMenu.jsx";
import styles from "../styles/menu.module.css"; // Importe o arquivo CSS

function MenuCardapio() {
  const [showModal, setShowModal] = useState(false);
  const [menuData, setMenuData] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  const getItem = process.env.NEXT_PUBLIC_GET_ITEM_MENU;

  useEffect(() => {
    axios
      .get(getItem)
      .then((response) => {
        setMenuData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar itens do menu:", error);
        setLoading(false);
      });
  }, []);

  const openModal = () => {
    setShowModal(true);
  };

  return (
    <div>
      <nav className={styles.navbar}>
        <Image
          src="/logo-min.png"
          className="img-fluid"
          alt="Logo"
          width={90}
          height={90}
        />
        <h5 className="navbar-brand">Cardápio Conquista</h5>
        <Button
          className={`bg-danger border-danger shadow ${styles.cartButton}`}
          onClick={openModal}
        >
          <FontAwesomeIcon icon={faCartShopping} className={styles.cartIcon} />{" "}
          <span className={styles.cartCount}>{cartCount}</span>{" "}
        </Button>
      </nav>

      <ItemMenu
        {...{ loading, menuData, setCart, setCartCount, cart, cartCount }}
      />
      <ModalCart
        {...{ cart, cartCount, setCart, setCartCount, showModal, setShowModal }}
      />
    </div>
  );
}

export default MenuCardapio;
