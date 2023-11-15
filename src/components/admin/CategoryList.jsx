import { useState } from "react";
import { Collapse } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

function CategoryList({ title, menuItems, setMenuItems, list }) {
  const [open, setOpen] = useState(false);
  const [editedItem, setEditedItem] = useState({
    id: null,
    name: "",
    description: "",
    price: 0,
  });

  const editItemEndpoint = process.env.NEXT_PUBLIC_PUT_EDITAR;
  const visibilidadeItem = process.env.NEXT_PUBLIC_PUT_ITEM_VISIBILIDADE;
  const deleteItem = process.env.NEXT_PUBLIC_DELETE_ITEM;

  const filterItemsByCategory = (category) => {
    return menuItems.filter((item) => item.categoryId === category);
  };

  const removeItem = (itemId) => {
    axios
      .delete(`${deleteItem}${itemId}`)
      .then((response) => {
        if (response.status === 200) {
          const updatedItemList = menuItems.filter(
            (item) => item.id !== itemId
          );
          setMenuItems(updatedItemList);
          toast.success("Item excluído com sucesso");
        }
      })
      .catch((error) => {
        toast.error("Erro ao excluir o item");
        console.error("Erro ao excluir o item:", error);
      });
  };

  const toggleVisibility = (itemId, currentVisibility) => {
    axios
      .put(`${visibilidadeItem}${itemId}`, {
        isVisible: !currentVisibility,
      })
      .then((response) => {
        const updatedItems = menuItems.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              isVisible: !currentVisibility,
            };
          }
          return item;
        });
        setMenuItems(updatedItems);
      })
      .catch((error) => {
        toast.error("Erro ao alternar visibilidade");
        console.error("Erro ao alternar visibilidade:", error);
      });
  };

  const handleEditClick = (item) => {
    setEditedItem({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
    });
  };

  const handleSaveClick = () => {
    // Converta a string para um número usando parseFloat
    const numericPrice = parseFloat(editedItem.price);

    axios
      .put(`${editItemEndpoint}/${editedItem.id}`, {
        ...editedItem,
        price: numericPrice,
      })
      .then((response) => {
        const updatedItems = menuItems.map((item) => {
          if (item.id === editedItem.id) {
            return {
              ...item,
              name: editedItem.name,
              description: editedItem.description,
              price: numericPrice, // Use o valor convertido
            };
          }
          return item;
        });
        setMenuItems(updatedItems);
        toast.success("Item editado com sucesso");
        setEditedItem({ id: null, name: "", description: "", price: 0 });
      })
      .catch((error) => {
        toast.error("Erro ao editar o item");
        console.error("Erro ao editar o item:", error);
      });
  };

  const handleInputChange = (e) => {
    setEditedItem({
      ...editedItem,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="col-md-6">
      <div className="border rounded p-3 shadow m-2">
        <h3 onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
          {title}
        </h3>
        <Collapse in={open}>
          <ul className="list-group">
            {filterItemsByCategory(parseInt(list, 10)).map((item) => (
              <li
                key={item.id}
                className={`m-1 list-group-item ${
                  item.isVisible
                    ? "list-group-item-success"
                    : "list-group-item-danger"
                }`}
              >
                {editedItem.id === item.id ? (
                  // Modo de edição
                  <div>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Nome
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={editedItem.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        Descrição
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="description"
                        name="description"
                        value={editedItem.description}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="price" className="form-label">
                        Preço
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        value={editedItem.price}
                        onChange={handleInputChange}
                      />
                    </div>

                    <button
                      className="btn btn-primary"
                      onClick={handleSaveClick}
                    >
                      Salvar
                    </button>
                  </div>
                ) : (
                  // Modo de visualização
                  <div>
                    <span>
                      <strong className="fs-5" style={{ fontWeight: "bold" }}>
                        {item.name}
                      </strong>
                    </span>
                    <br />
                    <span>
                      <strong>Preço: </strong>R${item.price}
                    </span>
                    <br />
                    <span>
                      <strong>Ingredientes: </strong>: {item.description}
                    </span>
                    {item.isVisible ? " (Visível)" : " (Oculto)"}
                    <div className="d-flex justify-content-around">
                      <button
                        className="btn btn-danger btn-sm ml-2 m-1"
                        onClick={() => removeItem(item.id)}
                      >
                        Excluir
                      </button>
                      <button
                        className="btn btn-secondary btn-sm ml-2 m-1 "
                        onClick={() =>
                          toggleVisibility(item.id, item.isVisible)
                        }
                      >
                        Alternar Visibilidade
                      </button>
                      <button
                        className="btn btn-primary btn-sm ml-2 m-1"
                        onClick={() => handleEditClick(item)}
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Collapse>
      </div>
    </div>
  );
}

export default CategoryList;
