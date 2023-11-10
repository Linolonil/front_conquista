import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AddNewItemForm = ({ message, setMenuItems, menuItems }) => {
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: 0,
    categoryId: 0,
    isVisible: true,
  });
  const [formCollapsed, setFormCollapsed] = useState(true);

  const postItem = process.env.NEXT_PUBLIC_POST_ITEM;

  const toggleForm = () => {
    setFormCollapsed(!formCollapsed);
  };

  const addItemToMenu = () => {
    const token = localStorage.getItem("token");

    axios
      .post(postItem, newItem, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setMenuItems([...menuItems, response.data]);
          setFormCollapsed(true);
          toast.success("Item adicionado com sucesso");
        }
        setNewItem({
          userId: message, // Se for necessário, ajuste a propriedade userId aqui
          name: "",
          description: "",
          price: 0,
          categoryId: 0,
          isVisible: true,
        });
      })
      .catch((error) => {
        toast.error("Erro ao adicionar o item");
        console.error("Erro ao adicionar o item:", error);
      });
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = parseInt(e.target.value);
    setNewItem({ ...newItem, categoryId: selectedCategoryId });
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-center mb-5">
        <button type="button" className="btn btn-primary" onClick={toggleForm}>
          {formCollapsed ? "Adicionar Novo Item" : "Recolher Formulário"}
        </button>
      </div>
      {!formCollapsed && (
        <form className="border p-3 rounded shadow m-2">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Nome
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              id="name"
              placeholder="Nome"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Descrição
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              id="description"
              placeholder="Descrição"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              Preço
            </label>
            <input
              type="number"
              className="form-control form-control-sm"
              id="price"
              placeholder="Preço"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: parseFloat(e.target.value) })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Categoria
            </label>
            <select
              id="category"
              value={newItem.categoryId}
              onChange={handleCategoryChange}
              className="form-select form-select-sm"
            >
              <option value={0}>Selecione uma opção</option>
              <option value={1}>Lanche</option>
              <option value={2}>Refeição</option>
              <option value={3}>Bebidas</option>
              <option value={4}>Combos</option>
            </select>
          </div>
          <button
            type="button"
            className="btn btn-primary float-right"
            onClick={addItemToMenu}
          >
            Adicionar
          </button>
        </form>
      )}
    </div>
  );
};

export default AddNewItemForm;
