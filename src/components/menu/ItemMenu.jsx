import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./menu.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

function ItemMenu({ menuData, setCart, setCartCount, cart, cartCount }) {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60); // Tempo inicial em segundos
  const [isMenuAvailable, setIsMenuAvailable] = useState(false);
  const [progress, setProgress] = useState(100);
  const categorySliderRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft((prevTime) => prevTime - 1);
        setProgress((prevProgress) => prevProgress - 100 / 60); // ajuste para o tempo desejado
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    if (menuData?.menu?.length > 0) {
      setSelectedCategory(1);
    }
  }, [menuData]);

  useEffect(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentHour = now.getHours();

    // Almoço de 10:30 até 14:30 e Jantar de 18:30 até 22:30 (segunda a sábado)
    const isLunchTime = currentHour >= 10 && currentHour < 15;
    const isDinnerTime = currentHour >= 18 && currentHour < 23;

    // Jantar de 18:30 até 22:30 no domingo
    const isSundayDinner =
      dayOfWeek === 0 && currentHour >= 18 && currentHour < 23;

    const isMenuAvailable =
      dayOfWeek >= 0 &&
      dayOfWeek <= 6 &&
      (isLunchTime || isDinnerTime || isSundayDinner);
    setIsMenuAvailable(isMenuAvailable);

    console.log(isMenuAvailable);
  }, []);

  //Loading que todo mundo gosta kkkk
  if (!menuData || !menuData.menu || !Array.isArray(menuData.menu)) {
    return (
      <div className={styles.centerImage}>
        <Image
          src="/logo-min.png"
          className={`${styles.logo} img-fluid`}
          alt="Logo"
          width={300}
          height={300}
        />
        <div className={`${styles.timer} text-light text-center`}>
          {timeLeft > 0
            ? `Tempo Restante: ${formatTime(timeLeft)}`
            : "Desculpe a demora. Por favor, atualize a página para visualizar o menu. 😁"}
        </div>
        <progress value={progress} max="100" />
      </div>
    );
  }

  const itemsByCategory = menuData.menu.reduce((acc, item) => {
    acc[item.categoryId] = [...(acc[item.categoryId] || []), item];
    return acc;
  }, {});

  const addToCart = (item) => {
    try {
      if (!isMenuAvailable) {
        // Se não estiver em horário de expediente, exibe um toast informando o usuário
        toast.warning("Não estamos em horário de expediente no momento.", {
          autoClose: 3000,
          position: "top-left",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "dark",
          draggable: true,
        });
        return;
      }

      const cartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      };

      const existingCartItem = cart.find((cartItem) => cartItem.id === item.id);

      if (existingCartItem) {
        existingCartItem.quantity++;
      } else {
        setCart([...cart, cartItem]);
      }

      setCartCount(cartCount + 1);

      toast.success(`${item.name} adicionado no carrinho`, {
        autoClose: 1500,
        position: "top-left",
        icon: "🛒",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
        draggable: true,
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Erro ao adicionar item ao carrinho", {
        autoClose: 2000,
        position: "top-left",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
        draggable: true,
      });
    }
  };

  const category = (id) => {
    switch (id) {
      case 1:
        return "🍔 Lanches";
      case 2:
        return "🍽️ Refeições";
      case 3:
        return "🥤 Bebidas";
      case 4:
        return "🍔🍟🥤 Combos";
      default:
        return "Categoria Desconhecida";
    }
  };

  const categorySettings = {
    dots: true,
    infinite: false,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    afterChange: (current) => {
      setSelectedCategory(parseInt(Object.keys(itemsByCategory)[current]));
    },
  };

  return (
    <div className="container">
      <div className="row mt-0 navbar p-4 sticky-top bg-dark">
        <Slider {...categorySettings} ref={categorySliderRef} className="p-1">
          {Object.keys(itemsByCategory).map((categoryId) => (
            <button
              key={categoryId}
              className={`btn btn-dark border-none ${
                selectedCategory === parseInt(categoryId)
                  ? "bg-danger active"
                  : ""
              }`}
              onClick={() => setSelectedCategory(parseInt(categoryId))}
            >
              <strong>{category(parseInt(categoryId))}</strong>
            </button>
          ))}
        </Slider>
      </div>

      {itemsByCategory[selectedCategory]?.length > 0 ? (
        <div className="row mx-0 mt-3">
          {itemsByCategory[selectedCategory]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((item) => (
              <div key={item.id} className="col-md-4 mb-0">
                <div
                  className={`card ${
                    item.isVisible ? "card-available" : "card-unavailable"
                  } ${styles.bg}`}
                  style={{
                    opacity: item.isVisible ? 1 : 0.6,
                    border: item.isVisible ? "2px solid red" : "none",
                  }}
                >
                  <div className="card-body mx-1">
                    <h5 className="card-title fs-5 fw-bold text-warning">
                      {item.name}
                    </h5>
                    <div style={{ color: "#979797" }}>
                      <p
                        className={`card-text ${
                          item.isVisible ? "btn-available" : "btn-unavailable"
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                      <p className="card-text fs-5 fw-bold text-light lead">
                        R$ {item.price.toFixed(2)}
                      </p>
                      <button
                        className={`btn btn-danger ${
                          item.isVisible ? "btn-available" : "btn-unavailable"
                        }`}
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

      <ToastContainer />
    </div>
  );
}

export default ItemMenu;
