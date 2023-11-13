import React, { useState, useEffect, useRef } from "react";
import Lottie from "lottie-react";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loadingsvg from "../../public/assets/animation/Animation - 1699081377345.json";
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
      autoClose: 2000,
      position: "top-right",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const category = (id) => {
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
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2.1,
          slidesToScroll: 2,
        },
      },
    ],
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    categorySliderRef.current.slickGoTo(parseInt(categoryId) - 1);
  };
// Function to compare items for sorting
const compareItems = (a, b) => {
  // Sort by availability (unavailable items at the end)
  if (a.isVisible && !b.isVisible) {
    return -1;
  } else if (!a.isVisible && b.isVisible) {
    return 1;
  }

  // If both items are available, sort alphabetically by name
  return a.name.localeCompare(b.name);
};

// Sort items based on the compareItems function
const sortedItems = itemsByCategory[selectedCategory].sort(compareItems);

return (
  <div className="row">
  
      <div>
        <div>
          <Slider {...settings} ref={categorySliderRef} className="mx-3">
            {Object.keys(itemsByCategory).map((categoryId) => (
              <button
                key={categoryId}
                className={`btn btn-dark border-danger ${
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
        {sortedItems.length > 0 ? (
          <div className="row mx-1 mt-5">
            {sortedItems.map((item) => (
              <div key={item.id} className="col-md-4">
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
                      <p
                        className="card-text fs-5 fw-bold"
                        style={{ color: "#fff" }}
                      >
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
      </div>
    <ToastContainer />
  </div>
);
        }

export default ItemMenu;
