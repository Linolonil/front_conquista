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

    // Validação para opção de entrega ou retirada
    if (!(entrega || retirada)) {
      toast.info("Selecione a opção de entrega ou retirada.", {
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
      nota: nota || "N/A", // Preencha com a nota do pedido
      enderecoEntrega: endereco || "N/A", // Preencha com o endereço de entrega, se aplicável
    };

    try {
      // Construa a mensagem para enviar para o WhatsApp
      const mensagem = `Novo pedido!\n\nDetalhes do pedido:\n${cart
        .map((item) =>`- ${item.quantity}x ${item.name} - R$${(item.price * item.quantity).toFixed(2)}`)
        .join("\n")}\n\nForma de pagamento: ${formaPagamento}
        \nTotal: ${calcularTotal().toFixed(2)}
        \nRetirada: ${retirada ? "Sim" : "Não"}\nObservações: ${
          nota || "N/A"
        }
        \nEntrega: ${
          entrega ? "Sim" : "Não"
        }
        \nEndereço de entrega: ${endereco || "N/A"}`;

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
    <Modal show={showModal} onHide={closeModal} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Carrinho</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <ul className="list-group">
            {cart.map((item) => (
              <li key={item.id} className="list-group-item">
                <div className="row align-items-center">
                  <div className="col-md-6 text-center">
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

                  <div className="col-md-3 quantity-controls text-center mt-1 d-flex align-items-center justify-content-center">
                    <Button
                      variant="secondary"
                      onClick={() => decrementQuantity(item)}
                      className="p-1 custom-rounded-button"
                      style={{
                        width: "2rem",
                        marginRight: "10px",
                        borderRadius: "50%",
                      }}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </Button>
                    <span className="mx-2 bg-light p-2 rounded border border-danger">
                      <strong>{item.quantity}</strong>
                    </span>
                    <Button
                      variant="secondary"
                      onClick={() => incrementQuantity(item)}
                      className="p-1 custom-rounded-button"
                      style={{
                        width: "2rem",
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
                style={{ fontFamily: "Roboto, sans-serif", fontSize: "16px" }}
              >
                <option value=""></option>
                <option value="dinheiro">Dinheiro</option>
                <option value="cartao">Cartão Débito/Crédito</option>
                <option value="pix">Pix</option>
              </Form.Control>
            </Form.Group>
            <div className="d-flex justify-content-between mt-3">
              <Form.Group controlId="entrega">
                <Form.Check
                  type="checkbox"
                  label="Entrega"
                  checked={entrega}
                  onChange={() => {
                    setEntrega(!entrega);
                    setRetirada(false);
                    // Se a opção de entrega estiver marcada, salve o endereço no localStorage
                    if (!entrega) {
                      const enderecoSalvo = localStorage.getItem("endereco");
                      if (enderecoSalvo) {
                        // Use a função correta para salvar no localStorage
                        setEndereco(enderecoSalvo);
                      }
                    }
                  }}
                  style={{ fontFamily: "Roboto, sans-serif", fontSize: "16px" }}
                />
              </Form.Group>

              <Form.Group controlId="retirada">
                <Form.Check
                  type="checkbox"
                  label="Retirada no restaurante"
                  checked={retirada}
                  onChange={() => {
                    setRetirada(!retirada);
                    setEntrega(false);
                  }}
                  style={{ fontFamily: "Roboto, sans-serif", fontSize: "16px" }}
                />
              </Form.Group>
            </div>
            {entrega && (
              <Form.Group controlId="endereco" className="mt-3">
                <Form.Label>
                  Endereço de Entrega<strong>*</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  style={{ fontFamily: "Roboto, sans-serif", fontSize: "16px" }}
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
                style={{ fontFamily: "Roboto, sans-serif", fontSize: "16px" }}
              />
            </Form.Group>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
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
