import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import NavBar from "../../src/components/admin/NavBarAdmin.jsx";
import AddNewItemForm from "../../src/components/admin/AddNewItemForm.jsx";
import CategoryList from "../../src/components/admin/CategoryList.jsx";
import ControleDeVendas from "../../src/components/admin/ControleDeVendas.jsx";
import SearchItem from "../../src/components/admin/SearchItem.jsx";
import Footer from "../../src/components/footer/Footer.jsx";
import { Container } from "react-bootstrap";

export default function AdminPanel() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [menuItems, setMenuItems] = useState([]);

  // rotas API
  const getItem = process.env.NEXT_PUBLIC_GET_ITEM_ADMIN;
  const getRota = process.env.NEXT_PUBLIC_GET_ROTA_PROTEGIDA;
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Se não houver um token válido, redirecione para a página de login.
      router.push("/login");
    } else {
      axios
        .get(getRota, {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            const data = response.data;
            setMessage(data.message);
          } else if (response.status === 401) {
            router.push("/login");
          }
        })
        .catch(() => {
          router.push("/login");
        });
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(getItem, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        setMenuItems(response.data);
      });
  }, []);

 

  return (
    <Container>
      <NavBar message={message} />
      <hr className="my-5" />

      <h2 className="mt-5 text-center display-4 fw-bold">Adicionar item</h2>

      <AddNewItemForm
        message={message}
        menuItems={menuItems}
        setMenuItems={setMenuItems}
      />
      <hr className="my-5" />

      <h2 className="mt-5 text-center display-4 fw-bold">Pesquisar Item</h2>

      <SearchItem menuItems={menuItems} setMenuItems={setMenuItems} />

      <hr className="my-5" />

      <h2 className="mt-5 text-center display-4 fw-bold">Cardápio</h2>
      <div className="row">
        <CategoryList
          title={"Lanches"}
          menuItems={menuItems}
          setMenuItems={setMenuItems}
          list={1}
        />
        <CategoryList
          title={"Refeições"}
          menuItems={menuItems}
          setMenuItems={setMenuItems}
          list={2}
        />
        <CategoryList
          title={"Bebidas"}
          menuItems={menuItems}
          setMenuItems={setMenuItems}
          list={3}
        />
        <CategoryList
          title={"Combos"}
          menuItems={menuItems}
          setMenuItems={setMenuItems}
          list={4}
        />
      </div>

     <ControleDeVendas/>

      <hr className="my-5" />

      <Footer />
      <ToastContainer />
    </Container>
  );
}
