import axios from "axios";
import { createHandler } from "next-connect";

const handler = createHandler();

// Middleware para CORS
handler.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Rota POST para processar pedidos
handler.post(async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).end(); // Método não permitido
    }

    // Extrai os dados do corpo da solicitação
    const {
      items,
      formaPagamento,
      entrega,
      retirada,
      nota,
      enderecoEntrega,
    } = req.body;

    // Construa a mensagem para enviar para o WhatsApp
    const mensagem = `Novo pedido!\n\nItens: ${JSON.stringify(
      items
    )}\n\nForma de pagamento: ${formaPagamento}\nEntrega: ${entrega}\nRetirada: ${retirada}\nObservações: ${nota}\nEndereço de entrega: ${
      enderecoEntrega || "N/A"
    }`;

    // Substitua 'SEU-NUMERO-DE-TELEFONE' pelo número de telefone desejado (formato internacional, por exemplo: 5511987654321)
    const numeroWhatsApp = "5592985515439";

    // Use a API do WhatsApp para enviar a mensagem
    await axios.post(
      `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(
        mensagem
      )}`
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro ao processar o pedido:", error);
    res.status(500).json({ success: false, error: "Erro interno do servidor" });
  }
});

export default handler;
