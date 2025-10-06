// backend/src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js'; // Certifique-se de que o caminho está correto

dotenv.config(); // Carrega as variáveis de ambiente do .env

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de CORS ajustado para funcionar com portas dinâmicas do Vite
app.use(cors({
  origin: (origin, callback) => {
    // Permite requisições sem origem (como de ferramentas ou testes)
    if (!origin) return callback(null, true);
    
    // Permite qualquer porta em localhost
    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    // Para produção, adicione a URL exata do seu domínio aqui.
    callback(new Error('Not allowed by CORS'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json()); // Para parsear JSON no corpo das requisições

// Rotas da API
app.use('/api', apiRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('CUMARU Backend API is running!');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`CUMARU Backend server running on port ${PORT}`);
  console.log(`Access at http://localhost:${PORT}`);
});
