import { useState } from "react";
import { Collapse } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

function CategoryList({ title, menuItems, setMenuItems, list }) {
  const [open, setOpen] = useState(false);

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
                    onClick={() => toggleVisibility(item.id, item.isVisible)}
                  >
                    Alternar Visibilidade
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Collapse>
      </div>
    </div>
  );
}

export default CategoryList;
