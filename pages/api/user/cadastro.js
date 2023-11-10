// http://localhost:3000/api/user/cadastro

import { cadastro } from "../../../services/user";

export default function handler(req, res) {
  try {
    const newUser = cadastro(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ msg: `${error.message}` });
  }
}
