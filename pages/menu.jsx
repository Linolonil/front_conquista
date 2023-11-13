// MenuCardapio.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import NavItem from "../components/menu/NavMenu";
import Footer from "../components/footer/Footer.jsx"


import ItemMenu from "../components/menu/ItemMenu.jsx";
import "../styles/menu.module.css"; // Adicione essa linha

export default function MenuCardapio() {
  // Estados do componente
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

 

  // Renderização do componente
  return (
    
  <div className="container-fluid bg-dark">
    <div className="row">
      {/* Navigation Menu */}
      <div className="col-md-12">
    <NavItem {...{cart, cartCount, setCart, setCartCount}}/>
      </div>

      {/* Item Menu */}
      <div className="col-md-12 ">
    <ItemMenu{...{ loading, menuData, setCart, setCartCount, cart, cartCount }}/>
      </div>
      <div className="col-md-12 ">
        <Footer bg="bg-dark" text="text-light" />
      </div>
    </div>
  </div>
);
}