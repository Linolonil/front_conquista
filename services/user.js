import jwt from "jsonwebtoken";

let users = [
  {
    name: "Lino Jorge",
    email: "linox999@gmail.com",
    password: "linojorgepain999",
  },
];

const SECRET = process.env.JWT_SECRET;

function createToken(user) {
  return jwt.sign({ email: user.email, name: user.name }, SECRET);
}

function readToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    throw new Error("Token inválido");
  }
}

export function cadastro(body) {
  const user = users.find(({ email }) => email === body.email);
  if (user) throw new Error("Usuário já cadastrado");
  users.push(body);

  const token = createToken(body);

  return token;
}

export function login(body) {
  const user = users.find(({ email }) => email === body.email);
  if (!user) throw new Error("Usuário não encontrado");
  if (user.password !== body.password) throw new Error("Senha incorreta");
  const token = createToken(user);
  return token;
}
