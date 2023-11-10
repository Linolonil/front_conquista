import { Button, Modal, Container, Form } from "react-bootstrap";
import { useState } from "react";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ModalCart({
  cart,
  cartCount,
  setCart,
  setCartCount,
  showModal,
  setShowModal,
}) {
  const [formaPagamento, setFormaPagamento] = useState("");
  const [entrega, setEntrega] = useState("");
  const [endereco, setEndereco] = useState("");
  const [retirada, setRetirada] = useState("");
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

  const todasPerguntasRespondidas = () => {
    // Verifica se todas as perguntas foram respondidas
    return formaPagamento && (entrega || retirada);
  };

  const finalizarPedido = async () => {
    if (!todasPerguntasRespondidas() || cartCount === 0) {
      alert(
        "Por favor, responda todas as perguntas e adicione itens ao carrinho antes de finalizar o pedido."
      );
      return;
    }

    const respostas = {
      items: [], // Preencha com os itens do pedido
      formaPagamento: "dinheiro", // Preencha com a forma de pagamento escolhida
      entrega: true, // Preencha com a escolha de entrega
      retirada: false, // Preencha com a escolha de retirada
      nota: "Alguma observação", // Preencha com a nota do pedido
      enderecoEntrega: "Endereço de entrega", // Preencha com o endereço de entrega, se aplicável
    };

    try {
      // Construa a mensagem para enviar para o WhatsApp
      const mensagem = `Novo pedido!\n\nDetalhes do pedido:\n${cart
        .map(
          (item) =>
            `- ${item.quantity}x ${item.name} - R$${(
              item.price * item.quantity
            ).toFixed(2)}`
        )
        .join("\n")}\n\nForma de pagamento: ${formaPagamento}\nEntrega: ${
        entrega ? "Sim" : "Não"
      }\nRetirada: ${retirada ? "Sim" : "Não"}\nObservações: ${
        nota || "N/A"
      }\nEndereço de entrega: ${endereco || "N/A"}`;

      // Substitua 'SEU-NUMERO-DE-TELEFONE' pelo número de telefone para o qual você deseja receber a mensagem
      const numeroWhatsApp = process.env.NEXT_PUBLIC_NUMERO_WPP;

      // Construa o link do WhatsApp
      const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
        mensagem
      )}`;

      // Redirecione o cliente para o WhatsApp
      window.open(linkWhatsApp, "_blank");

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
                <div className="d-flex justify-content-between align-items-center">
                  <span>{item.name}</span>
                  <span>R${item.price.toFixed(2)}</span>
                  <div className="quantity-controls">
                    <Button
                      variant="secondary"
                      onClick={() => decrementQuantity(item)}
                      className="p-1 custom-rounded-button"
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button
                      variant="secondary"
                      onClick={() => incrementQuantity(item)}
                      className="p-1 custom-rounded-button"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="total-carrinho mt-3">
            <strong>Total: R${calcularTotal().toFixed(2)}</strong>
          </div>

          {/* Formulário para as perguntas adicionais */}
          <Form className="mt-3">
            <Form.Group controlId="formaPagamento">
              <Form.Label>Forma de Pagamento</Form.Label>
              <Form.Control
                as="select"
                value={formaPagamento}
                onChange={(e) => setFormaPagamento(e.target.value)}
              >
                <option value="">Escolha uma forma de pagamento</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="cartao">Cartão de Crédito</option>
                <option value="pix">Pix</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="entrega">
              <Form.Check
                type="checkbox"
                label="Entrega"
                checked={entrega}
                onChange={() => {
                  setEntrega(!entrega);
                  setRetirada(false);
                }}
              />
            </Form.Group>

            <Form.Group controlId="retirada">
              <Form.Check
                type="checkbox"
                label="Retirada no Local"
                checked={retirada}
                onChange={() => {
                  setRetirada(!retirada);
                  setEntrega(false);
                }}
              />
            </Form.Group>

            {entrega && (
              <Form.Group controlId="endereco">
                <Form.Label>Endereço de Entrega</Form.Label>
                <Form.Control
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                />
              </Form.Group>
            )}

            <Form.Group controlId="nota">
              <Form.Label>Observações</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={nota}
                onChange={(e) => setNota(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={finalizarPedido}>
          Finalizar Pedido
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalCart;
