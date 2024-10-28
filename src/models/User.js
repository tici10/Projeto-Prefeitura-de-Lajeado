const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create({ full_name, cpf, email, phone_number, password }) {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const [result] = await db.query(
      'INSERT INTO usuarios (nome_completo, cpf, email, numero, senha) VALUES (?, ?, ?, ?, ?)',
      [nome_completo, cpf, email, numero, hashedPassword]
    );
    return result;
  }

  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0];
  }
}

module.exports = User;
