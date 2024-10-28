const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { nome_completo, cpf, email, numero, senha } = req.body;
  try {
    const user = await User.create({ nome_completo, cpf, email, numero, senha });
    res.status(201).json({ message: 'Usuário registrado com sucesso', userId: user.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
    res.json({ message: 'Login bem-sucedido', token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};
