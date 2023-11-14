import { Button, Modal, Container, Form } from "react-bootstrap";
import { useState } from "react";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ModalCart({
  cart,
  cartCount,
  setCart,
  setCartCount,
  showModal,
  setShowModal,
}) {
  const [formaPagamento, setFormaPagamento] = useState("");
  const [entrega, setEntrega] = useState(false);
  const [mesa, setMesa] = useState(false);
  const [endereco, setEndereco] = useState("");
  const [retirada, setRetirada] = useState(false);
  const [nota, setNota] = useState("");
  const closeModal = () => {
    setShowModal(false);
  };

  const calcularTotal = () => {
    const total = cart.reduce((acc, item) => {
      if (typeof item.price === "number" && typeof item.quantity === "number") {
        return acc + item.price * item.quantity;
      } else {
        console.log("Item com valor inválido:", item);
        return acc;
      }
    }, 0);

    return total;
  };

  const incrementQuantity = (item) => {
    const updatedCart = cart.map((cartItem) => {
      if (cartItem.id === item.id) {
        cartItem.quantity++;
      }
      return cartItem;
    });

    setCart(updatedCart);
    setCartCount(cartCount + 1);
  };

  const decrementQuantity = (item) => {
    const updatedCart = cart.map((cartItem) => {
      if (cartItem.id === item.id) {
        if (cartItem.quantity > 1) {
          cartItem.quantity--;
        } else {
          // Se a quantidade se tornar 0, remova o item do carrinho
          return null;
        }
      }
      return cartItem;
    });

    const filteredCart = updatedCart.filter((item) => item !== null);

    setCartCount(cartCount - 1);
    setCart(filteredCart);
  };

  const clearCart = () => {
    setCart([]);
    setCartCount(0);
  };

  const finalizarPedido = async () => {
    // Validação específica para quantidade de itens no carrinho
    if (cartCount === 0) {
      toast.info("Adicione pelo menos 1 item ao carrinho antes de finalizar.", {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }

    // Validação específica para forma de pagamento
    if (!formaPagamento) {
      toast.info("Escolha uma forma de pagamento.", {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }

    // Validação para opção de entrega, retirada ou mesa
    if (!(entrega || retirada || mesa)) {
      toast.info("Selecione a opção de entrega, retirada ou pedir para mesa.", {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }

    // Validação específica para entrega com endereço
    if (entrega && (!endereco || endereco.trim() === "")) {
      toast.info("Preencha o campo de endereço para entrega.", {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }

    // Restante do código para finalizar o pedido
    const respostas = {
      items: [], // Preencha com os itens do pedido
      formaPagamento, // Preencha com a forma de pagamento escolhida
      entrega, // Preencha com a escolha de entrega
      retirada, // Preencha com a escolha de retirada
      mesa, // Preencha com a escolha de pedir para mesa
      nota: nota || "N/A", // Preencha com a nota do pedido
      enderecoEntrega: endereco || "N/A", // Preencha com o endereço de entrega, se aplicável
    };

    try {
      // Construa a mensagem para enviar para o WhatsApp
      const mensagem = `Novo pedido!\n\nDetalhes do pedido:\n${cart
        .map(
          (item) =>
            `- ${item.quantity} ${item.name} - R$${(
              item.price * item.quantity
            ).toFixed(2)}`
        )
        .join("\n")}\n\nTotal: R$${calcularTotal().toFixed(
        2
      )}\n\nForma de pagamento: ${formaPagamento}\n\n${
        entrega ? `Entrega: sim\nEndereço de entrega: ${endereco || ""}` : ""
      }${retirada ? `\nRetirada no lanche: Sim` : ""}${
        mesa ? `\nPedido para comer na mesa: Sim` : ""
      }\n\nObservações: ${nota || ""}
  `;

      console.log(mensagem);
      // Substitua 'SEU-NUMERO-DE-TELEFONE' pelo número de telefone para o qual você deseja receber a mensagem
      const numeroWhatsApp = process.env.NEXT_PUBLIC_NUMERO_WPP;

      // Construa o link do WhatsApp
      const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
        mensagem
      )}`;

      // Redirecione o cliente para o WhatsApp
      window.open(linkWhatsApp, "_blank");

      // Salve o endereço no localStorage apenas se a opção de entrega estiver marcada
      if (entrega) {
        localStorage.setItem("endereco", endereco);
      }

      // Limpe os campos e o carrinho após o pedido ser finalizado
      setFormaPagamento("");
      setEntrega(false);
      setRetirada(false);
      setMesa(false);
      setEndereco("");
      setNota("");
      clearCart();

      // Feche o modal
      closeModal();
    } catch (error) {
      console.error("Erro ao finalizar o pedido:", error);
      alert("Erro ao finalizar o pedido. Por favor, tente novamente.");
    }
  };

  return (
    <Modal show={showModal} onHide={closeModal} animation={true}>
      <Modal.Header className="bg-dark text-light" closeButton>
        <Modal.Title>Carrinho de pedidos </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light">
        <Container>
          <ul className="list-group">
            {cart.map((item) => (
              <li
                key={item.id}
                className="list-group-item"
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "16px",
                  backgroundColor: "#212529",
                  color: "#fff",
                }}
              >
                <div className="row align-items-center">
                  <div className="col-md-8 text-center">
                    <div className="d-flex justify-content-between align-items-center">
                      <span
                        style={{
                          fontFamily: "Roboto, sans-serif",
                          fontSize: "16px",
                          marginRight: "10px",
                        }}
                      >
                        {item.name}
                      </span>
                      <span className="d-block">
                        R$<strong>{item.price.toFixed(2)}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="col-md-4 quantity-controls text-center mt-1 d-flex align-items-center justify-content-center">
                    <Button
                      variant="danger"
                      onClick={() => decrementQuantity(item)}
                      className="p-1 custom-rounded-button"
                      style={{
                        width: "2rem",
                        height: "2rem",
                        marginRight: "10px",
                        borderRadius: "50%",
                      }}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </Button>
                    <span className="mx-2 bg-light p-2 px-3 rounded border border-danger bg-dark ">
                      <strong>{item.quantity}</strong>
                    </span>
                    <Button
                      variant="success"
                      onClick={() => incrementQuantity(item)}
                      className="p-1 custom-rounded-button"
                      style={{
                        width: "2rem",
                        height: "2rem",
                        marginLeft: "10px",
                        borderRadius: "50%",
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="total-carrinho mt-3 d-flex justify-content-end">
            <strong className="fs-5">
              Total: R${calcularTotal().toFixed(2)}
            </strong>
          </div>

          {/* Formulário para as perguntas adicionais */}
          <Form className="mt-3">
            <Form.Group controlId="formaPagamento">
              <Form.Label>
                Forma de Pagamento<strong>*</strong>
              </Form.Label>
              <Form.Control
                as="select"
                value={formaPagamento}
                onChange={(e) => setFormaPagamento(e.target.value)}
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "16px",
                  backgroundColor: "#212529",
                  color: "#fff",
                }}
              >
                <option value=""></option>
                <option value="dinheiro">Dinheiro</option>
                <option value="cartao">Cartão Débito/Crédito</option>
                <option value="pix">Pix</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formaEntrega" className="mt-3">
              <Form.Label>
                O pedido é para?<strong>*</strong>
              </Form.Label>
              <div className="d-flex p-2  justify-content-between">
                <Form.Group controlId="entrega">
                  <Form.Check
                    type="checkbox"
                    label="Entrega"
                    checked={entrega}
                    onChange={() => {
                      setEntrega(!entrega);
                      setRetirada(false);
                      setMesa(false);
                      // Se a opção de entrega estiver marcada, salve o endereço no localStorage
                      if (!entrega) {
                        const enderecoSalvo = localStorage.getItem("endereco");
                        if (enderecoSalvo) {
                          // Use a função correta para salvar no localStorage
                          setEndereco(enderecoSalvo);
                        }
                      }
                    }}
                    style={{
                      fontFamily: "Roboto, sans-serif",
                      fontSize: "16px",
                    }}
                  />
                </Form.Group>

                <Form.Group controlId="retirada">
                  <Form.Check
                    type="checkbox"
                    label="Retirada"
                    checked={retirada}
                    onChange={() => {
                      setRetirada(!retirada);
                      setEntrega(false);
                      setMesa(false);
                    }}
                    style={{
                      fontFamily: "Roboto, sans-serif",
                      fontSize: "16px",
                    }}
                  />
                </Form.Group>

                <Form.Group controlId="pedirMesa">
                  <Form.Check
                    type="checkbox"
                    label="Mesa"
                    checked={mesa}
                    onChange={() => {
                      setMesa(!mesa);
                      setEntrega(false);
                      setRetirada(false);
                    }}
                    style={{
                      fontFamily: "Roboto, sans-serif",
                      fontSize: "16px",
                    }}
                  />
                </Form.Group>
              </div>
            </Form.Group>

            {entrega && (
              <Form.Group controlId="endereco" className="mt-3">
                <Form.Label>
                  Endereço de Entrega<strong>*</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontSize: "16px",
                    backgroundColor: "#212529",
                    color: "#fff",
                  }}
                  required
                />
                <div className="text-muted" style={{ fontSize: "12px" }}>
                  Entregamos apenas para o bairro Ouro Verde e redondezas.
                </div>
              </Form.Group>
            )}

            <Form.Group controlId="nota" className="mt-3">
              <Form.Label>Observações do pedido (opcional)</Form.Label>
              <Form.Control
                as="input"
                rows={3}
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "16px",
                  backgroundColor: "#212529",
                  color: "#fff",
                }}
              />
            </Form.Group>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer className="bg-dark">
        <Button
          variant="primary"
          onClick={finalizarPedido}
          style={{ fontFamily: "Roboto, sans-serif", fontSize: "16px" }}
        >
          Finalizar Pedido
        </Button>
      </Modal.Footer>
      <ToastContainer />
    </Modal>
  );
}

export default ModalCart;
