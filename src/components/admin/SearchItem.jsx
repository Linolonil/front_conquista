import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

function SearchItem({ menuItems, setMenuItems }) {
  const [searchText, setSearchText] = useState("");
  const visibilidadeItem = process.env.NEXT_PUBLIC_PUT_ITEM_VISIBILIDADE;

  const deleteItem = process.env.NEXT_PUBLIC_DELETE_ITEM;

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

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="">
      <div className="input-group mb-3 border rounded p-3 shadow m-2">
        <input
          type="text"
          className="form-control"
          placeholder="Pesquisar por nome"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <ul className="list-group rounded shadow m-2">
        {searchText &&
          filteredItems.length > 0 &&
          filteredItems.map((item) => (
            <li
              key={item.id}
              className={`list-group-item ${
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
              <br />
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
    </div>
  );
}

export default SearchItem;
