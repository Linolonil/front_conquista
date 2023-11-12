// MenuCardapio.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import Image from "next/image";
import ModalCart from "../components/menu/ModalCart.jsx";
import ItemMenu from "../components/menu/ItemMenu.jsx";
import styles from "../styles/menu.module.css";
import "../styles/menu.module.css"; // Adicione essa linha

export default function MenuCardapio() {
  // Estados do componente
  const [showModal, setShowModal] = useState(false);
  const [menuData, setMenuData] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  // URL para obter itens do menu
  const getItem = process.env.NEXT_PUBLIC_GET_ITEM_MENU;

  // Efeito para carregar os itens do menu ao montar o componente
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

  // Função para abrir o modal do carrinho
  const openModal = () => {
    setShowModal(true);
  };

  // Renderização do componente
  return (
    <div>
      {/* Barra de navegação */}
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
        <div className="menu-header">
      <h6 className="text-light fs-2 custom-font">Cardápio Conquista</h6>
    </div>        {/* Botão do carrinho */}
        <Button
          className={`bg-danger border-danger shadow ${styles.cartButton}`}
          onClick={openModal}
        >
          <FontAwesomeIcon icon={faCartShopping} className={styles.cartIcon} />{" "}
          <span className={styles.cartCount}>{cartCount}</span>{" "}
        </Button>
      </nav>

      {/* Componente que exibe os itens do menu */}
      <ItemMenu
        {...{ loading, menuData, setCart, setCartCount, cart, cartCount }}
      />

      {/* Modal do carrinho */}
      <ModalCart
        {...{
          cart,
          cartCount,
          setCart,
          setCartCount,
          showModal,
          setShowModal,
        }}
      />
    </div>
  );
}
