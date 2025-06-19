# FleetWise

Sistema de gerenciamento de frota veicular.

## Estrutura do Projeto

```
fleetwise/
├── .env                   # Variáveis de ambiente (não versionado)
├── .env.example           # Modelo para variáveis de ambiente
├── index.js               # Ponto de entrada da aplicação
├── package.json           # Dependências e scripts
├── tests/                 # Testes da aplicação
│   └── teste_conexao_bd.js # Teste de conexão com o banco de dados
├── src/                   # Código fonte da aplicação
│   ├── config/            # Configurações (banco de dados, etc.)
│   │   └── database.js    # Configuração do Sequelize
│   ├── models/            # Modelos do Sequelize
│   │   ├── index.js       # Arquivo para exportação dos modelos
│   │   └── Usuario.js     # Modelo de usuário com autenticação
│   ├── controllers/       # Controladores da aplicação
│   │   └── auth/          # Controladores de autenticação
│   │       └── authController.js # Controlador de autenticação
│   ├── routes/            # Rotas da API
│   │   ├── auth.js        # Rotas de autenticação
│   │   └── index.js       # Arquivo principal de rotas
│   └── middlewares/       # Middlewares da aplicação
│       └── auth/          # Middlewares de autenticação
│           └── authMiddleware.js # Middleware para proteção de rotas
```

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript server-side
- **Express**: Framework web para Node.js
- **Sequelize**: ORM para Node.js que suporta MySQL e outros bancos de dados
- **MySQL**: Sistema de gerenciamento de banco de dados relacional
- **JWT**: JSON Web Tokens para autenticação
- **bcryptjs**: Biblioteca para criptografia de senhas

## Instalação

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Crie um arquivo `.env` baseado no `.env.example` e configure as variáveis de ambiente:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=fleetwise
   DB_DIALECT=mysql
   DB_LOGGING=false
   JWT_SECRET=sua_chave_secreta
   JWT_EXPIRES_IN=24h
   ```
4. Execute o projeto:
   ```
   npm run dev
   ```

## Scripts

- `npm start`: Inicia o servidor em modo produção
- `npm run dev`: Inicia o servidor com nodemon para desenvolvimento
- `npm run test:db`: Testa a conexão com o banco de dados

## API Endpoints

### Autenticação
- **POST /api/auth/register**: Registra um novo usuário
- **POST /api/auth/login**: Faz login e retorna um token JWT
- **GET /api/auth/me**: Retorna os dados do usuário autenticado (requer autenticação)

### Status da API
- **GET /api/status**: Verifica o status da API e o ambiente atual
