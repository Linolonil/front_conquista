import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./menu.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Modal } from "react-bootstrap";
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
  const [timeLeft, setTimeLeft] = useState(60);
  const [isMenuAvailable, setIsMenuAvailable] = useState(false);
  const [progress, setProgress] = useState(100);
  const [selectedJuiceItem, setSelectedJuiceItem] = useState(null);
  const [showJuiceModal, setShowJuiceModal] = useState(false);
  const categorySliderRef = useRef(null);

  const openJuiceModal = () => {
    setShowJuiceModal(true);
  };
  const closeJuiceModal = () => {
    setShowJuiceModal(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft((prevTime) => prevTime - 1);
        setProgress((prevProgress) => prevProgress - 100 / 60);
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

    const isLunchTime = currentHour >= 10 && currentHour < 15;
    const isDinnerTime = currentHour >= 18 && currentHour < 23;

    const isSundayDinner =
      dayOfWeek === 0 && currentHour >= 18 && currentHour < 23;

    const isMenuAvailable =
      dayOfWeek >= 0 &&
      dayOfWeek <= 6 &&
      (isLunchTime || isDinnerTime || isSundayDinner);
    setIsMenuAvailable(isMenuAvailable);
  }, []);

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

  const itemsByCategory =
  menuData && menuData.menu
    ? menuData.menu.reduce((acc, item) => {
        acc[item.categoryId] = [...(acc[item.categoryId] || []), item];
        return acc;
      }, {})
    : {};

  const addToCart = (item) => {
    try {
      if (!isMenuAvailable) {
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

      // Adicionar lógica específica para o suco
      if (
        item.categoryId === 3 &&
        item.description.toLowerCase().includes("suco")
      ) {
        console.log("Suco selecionado:", item);
        console.log("Mostrando modal");
        setSelectedJuiceItem(item);
        setShowJuiceModal(true);
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

  const handleJuiceChoice = (choice) => {
    try {

      const updatedJuiceItem = { ...selectedJuiceItem };

      if (choice === "com-leite") {
        updatedJuiceItem.price = parseFloat(updatedJuiceItem.price) + 2;
        const comLeiteName = `${updatedJuiceItem.name} (com leite)`;

        // Adiciona um identificador único para distinguir cada item com leite
        const itemId = `${updatedJuiceItem.id}_${choice}`;

        // Verifica se o item com leite já está no carrinho
        const itemComLeiteNoCarrinho = cart.find((item) => item.id === itemId);

        if (itemComLeiteNoCarrinho) {
          // Se já está no carrinho, incrementa a quantidade
          const updatedCart = cart.map((cartItem) => {
            if (cartItem.id === itemId) {
              cartItem.quantity++;
            }
            return cartItem;
          });

          setCart(updatedCart);
          setCartCount(cartCount + 1);
        } else {
          // Se não está no carrinho, adiciona um novo item com a marca "(com leite)"
          setCart([
            ...cart,
            {
              id: itemId,
              name: comLeiteName,
              price: updatedJuiceItem.price,
              quantity: 1,
              description: `${updatedJuiceItem.description} (com leite)`,
            },
          ]);
          setCartCount(cartCount + 1);
        }
      } else {
        // Adiciona o item diretamente ao carrinho se não for "com leite"
        const itemSemLeiteNoCarrinho = cart.find(
          (item) =>
            item.id === updatedJuiceItem.id && !item.name.includes("com leite")
        );

        if (itemSemLeiteNoCarrinho) {
          // Se já está no carrinho, incrementa a quantidade
          const updatedCart = cart.map((cartItem) => {
            if (
              cartItem.id === updatedJuiceItem.id &&
              !cartItem.name.includes("com leite")
            ) {
              cartItem.quantity++;
            }
            return cartItem;
          });

          setCart(updatedCart);
          setCartCount(cartCount + 1);
        } else {
          // Se não está no carrinho, adiciona um novo item
          setCart([
            ...cart,
            {
              id: updatedJuiceItem.id,
              name: updatedJuiceItem.name,
              price: updatedJuiceItem.price,
              quantity: 1,
              description: updatedJuiceItem.description,
            },
          ]);
          setCartCount(cartCount + 1);
        }
      }

      toast.success(`${updatedJuiceItem.name} adicionado no carrinho`, {
        autoClose: 1500,
        position: "top-left",
        icon: "🛒",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
        draggable: true,
      });

      setSelectedJuiceItem(null);
      setShowJuiceModal(false);
    } catch (error) {
      console.error("Error handling juice choice:", error);
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
        return "🍟 Combos";
      default:
        return "Categoria Desconhecida";
    }
  };

  const categorySettings = {
    dots: true,
    infinite: false,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 736,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 389,
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
            .sort((a, b) => {
              if (a.isVisible && !b.isVisible) {
                return -1;
              } else if (!a.isVisible && b.isVisible) {
                return 1;
              } else {
                return a.name.localeCompare(b.name);
              }
            })
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

      {showJuiceModal &&
        selectedJuiceItem &&
        (console.log("Renderizando modal"),
        (
          <Modal
            show={openJuiceModal}
            onHide={closeJuiceModal}
            animation={true}
          >
            <div className="modal-content text-center bg-dark text-light">
              <p className="mt-3 mb-4">
                O "{selectedJuiceItem.name}" pode ser pedido com leite por um
                acréscimo de R$2. Gostaria de adicionar leite? 😄
              </p>
              <div className="mb-3 ">
                <button
                  className="btn btn-primary"
                  onClick={() => handleJuiceChoice("com-leite")}
                >
                  Com Leite
                </button>
                <button
                  className="btn btn-secondary ms-5"
                  onClick={() => handleJuiceChoice("sem-leite")}
                >
                  Sem Leite
                </button>
              </div>
            </div>
          </Modal>
        ))}

      <ToastContainer />
    </div>
  );
}

export default ItemMenu;
