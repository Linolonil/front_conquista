import React, { useState, useEffect, useRef } from "react";
import Lottie from "lottie-react";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import loadingsvg from "../../public/assets/animation/Animation - 1699081377345.json";
import { toast, ToastContainer } from "react-toastify";

import styles from "./menu.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ItemMenu({
  loading,
  menuData,
  setCart,
  setCartCount,
  cart,
  cartCount,
}) {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const categorySliderRef = useRef(null);

  useEffect(() => {
    const toastId = "greeting-notification";
    if (!toast.isActive(toastId)) {
      const currentHour = new Date().getHours();
      console.log(currentHour);

      let greetingMessage = "";
      let iconActual = "";
      let theme = "dark"; // Padrão para o tema escuro
      let backgroundColor = "#323232"; // Padrão para o tema escuro

      if (currentHour >= 5 && currentHour < 12) {
        greetingMessage = "Bom dia";
        iconActual = "🌞";
        theme = "light"; // Muda para o tema claro
        backgroundColor = "#ffffff"; // Muda para o tema claro
      } else if (currentHour >= 12 && currentHour < 18) {
        greetingMessage = "Boa tarde";
        iconActual = "☀️";
      } else {
        greetingMessage = "Boa noite";
        iconActual = "🌙";
      }

      if (currentHour > 5 && currentHour < 18) {
        toast.warning(greetingMessage, {
          toastId,
          icon: `${iconActual}`,
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "custom-toast", // Pode adicionar estilos personalizados aqui
          theme: "dark",
        });
      } else {
        toast(greetingMessage, {
          toastId,
          icon: `${iconActual}`,
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "custom-toast", // Pode adicionar estilos personalizados aqui
          theme: "dark",
        });
      }
    }
  }, []);

  useEffect(() => {
    if (menuData && menuData.menu && menuData.menu.length > 0) {
      setSelectedCategory(menuData.menu[0].categoryId);
    }
  }, [menuData]);

  if (!menuData || !menuData.menu || !Array.isArray(menuData.menu)) {
    return <div className="text-center">O menu está carregando ...</div>;
  }

  const itemsByCategory = {};
  menuData.menu.forEach((item) => {
    if (!itemsByCategory[item.categoryId]) {
      itemsByCategory[item.categoryId] = [];
    }
    itemsByCategory[item.categoryId].push(item);
  });

  const addToCart = (item) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
    };

    const existingCartItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingCartItem) {
      existingCartItem.quantity++;
      setCart([...cart]);
      setCartCount(cartCount + 1);
    } else {
      setCart([...cart, cartItem]);
      setCartCount(cartCount + 1);
    }
    toast.success(`${item.name} adicionado no carrinho`, {
      icon: "🛒",
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      className: "custom-toast", // Pode adicionar estilos personalizados aqui
      toastId: item.id, // Um ID único para evitar duplicatas
      theme: "dark",
    });
  };

  function category(id) {
    switch (id) {
      case 1:
        return "Lanche";
      case 2:
        return "Refeição";
      case 3:
        return "Bebidas";
      case 4:
        return "Combos";
      default:
        return "Categoria Desconhecida";
    }
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    categorySliderRef.current.slickGoTo(parseInt(categoryId) - 1); // Muda para o slide correspondente à categoria clicada
  };

  return (
    <div className="row mt-4 bg-dark">
      {loading ? (
        <div className="loading-container">
          <div
            style={{
              width: "10%",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Lottie animationData={loadingsvg} loop={true} />
          </div>
        </div>
      ) : (
        <div>
          <div
            className="mb-4 fixed-top bg-dark "
            style={{ marginTop: "72px" }}
          >
            <Slider {...settings} ref={categorySliderRef}>
              {Object.keys(itemsByCategory).map((categoryId) => (
                <button
                  key={categoryId}
                  className={`btn btn-dark border-danger mx-2 ${
                    parseInt(selectedCategory) === parseInt(categoryId)
                      ? "bg-danger active"
                      : ""
                  }`}
                  onClick={() => setSelectedCategory(categoryId)}
                >
                  <strong> {category(parseInt(categoryId))} </strong>
                </button>
              ))}
            </Slider>
          </div>
          {itemsByCategory[selectedCategory].length > 0 ? (
            <div className="row mt-2 mx-1 mt-5 ">
              {itemsByCategory[selectedCategory].map((item) => (
                <div key={item.id} className={`col-md-4 mb-1`}>
                  <div
                    className={`card ${styles.bg} ${
                      item.isVisible ? "" : "item-unavailable"
                    } `}
                  >
                    <div className="card-body mx-1">
                      <h5 className="card-title fs-5 fw-bold text-warning">
                        {item.name}
                      </h5>
                      <div style={{ color: "#979797" }}>
                        <p className="card-text">{item.description}</p>
                      </div>

                      <div className="d-flex justify-content-between mt-4">
                        <p
                          className="card-text fs-5 fw-bold mb-2 "
                          style={{ color: "#fff" }}
                        >
                          R$ {item.price.toFixed(2)}
                        </p>
                        <button
                          className={`btn btn-danger`}
                          onClick={() => addToCart(item)}
                          disabled={!item.isVisible}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center mt-3">
              <p>Itens Indisponíveis no Momento</p>
            </div>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default ItemMenu;
