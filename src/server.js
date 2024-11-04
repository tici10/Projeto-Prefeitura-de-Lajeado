const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

const db = require('./database');

db.query('SELECT 1', (err, results) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conexão ao banco de dados bem-sucedida!');
  }
});


dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
