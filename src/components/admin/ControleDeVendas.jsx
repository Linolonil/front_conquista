import React, { useState, useEffect } from "react";
import { Button, Collapse, Modal } from "react-bootstrap";

import axios from "axios";

export default function ControleDeVendas() {
  const [orders, setOrders] = useState([]);
  const [openCollapses, setOpenCollapses] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };
  console.log(orders);

  const getVendas = process.env.NEXT_PUBLIC_GET_VENDAS;

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(getVendas, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        console.log(response.data); // Verifique os dados retornados pela API
        if (Array.isArray(response.data)) {
          // Certifique-se de que os dados são um array
          setOrders(response.data);
        } else {
          setOrders([response.data]); // Se os dados não são um array, coloque-os em um array
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar os dados da API:", error);
      });
  }, []);

  function formatarData(dataString) {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", options);
  }

  function getTipoEntrega(order) {
    if (order.delivery) {
      return "Entrega";
    } else if (order.table) {
      return "Mesa";
    } else {
      return "Retirada";
    }
  }

  const toggleCollapse = (data) => {
    const isOpen = openCollapses.includes(data);
    if (isOpen) {
      setOpenCollapses(openCollapses.filter((item) => item !== data));
    } else {
      setOpenCollapses([...openCollapses, data]);
    }
  };

  // Função para calcular o total de vendas por dia
  const calcularTotalPorDia = (orders, data) => {
    return orders
      .filter((order) => formatarData(order.hour) === data)
      .reduce((total, order) => total + parseFloat(order.total), 0);
  };

  const datasUnicas = Array.from(
    new Set(orders.map((order) => formatarData(order.hour)))
  );

  function formatarHoraMinutoSegundo(dataString) {
    const data = new Date(dataString);
    const hora = data.getHours().toString().padStart(2, "0");
    const minuto = data.getMinutes().toString().padStart(2, "0");
    const segundo = data.getSeconds().toString().padStart(2, "0");
    return `${hora}:${minuto}:${segundo}`;
  }

  return (
    <div className="container">
      <h2 className="mt-5 text-center display-4 fw-bold">Controle de vendas</h2>
      {datasUnicas.map((data) => (
        <div className="border rounded p-1 shadow m-3" key={data}>
          <div
            onClick={() => toggleCollapse(data)}
            style={{ cursor: "pointer" }}
          >
            <h3 className="text-center mt-3">{data}</h3>
          </div>

          <Collapse in={openCollapses.includes(data)}>
            <div>
              <div className="table-responsive overflow-auto">
                <table className="table table-bordered text-center table-responsive">
                  <thead className="thead-light">
                    <tr>
                      <th>Tipo</th>
                      <th>Hora</th>
                      <th>Itens</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter((order) => formatarData(order.hour) === data)
                      .map((order) => (
                        <tr
                          key={order.id}
                          onClick={() => handleItemClick(order)}
                        >
                          <td>{getTipoEntrega(order)}</td>

                          <td>{formatarHoraMinutoSegundo(`${order.hour}`)}</td>
                          <td
                            className="text-truncate"
                            style={{ maxWidth: "150px" }}
                          >
                            {order.items}
                          </td>

                          <td>R$ {order.total}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="text-center">
                <h4 className="mt-4 fw-bold">
                  Total de vendas:{" "}
                  <span className="fs-1">
                    R${calcularTotalPorDia(orders, data)}
                  </span>
                </h4>
              </div>
            </div>
          </Collapse>
        </div>
      ))}

      {/* Modal para exibir o texto completo */}
      <Modal show={selectedItem !== null} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalhes do Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <div>
              <p>
                <strong>Endereço:</strong> {selectedItem.address}
              </p>
              <p>
                <strong>Itens:</strong> {selectedItem.items}
              </p>
              <p>
                <strong>Total da compra:</strong> {selectedItem.total}
              </p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
