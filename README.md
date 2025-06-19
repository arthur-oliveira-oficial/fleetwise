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
│   └── db-connection-test.js # Teste de conexão com o banco de dados
├── src/                   # Código fonte da aplicação
│   ├── config/            # Configurações (banco de dados, etc.)
│   │   └── database.js    # Configuração do Sequelize
│   ├── models/            # Modelos do Sequelize
│   │   └── index.js       # Arquivo para exportação dos modelos
│   ├── controllers/       # Controladores (a ser criado)
│   ├── routes/            # Rotas da API (a ser criado)
│   └── middlewares/       # Middlewares (a ser criado)
```

## Instalação

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Crie um arquivo `.env` baseado no `.env.example` e configure as variáveis de ambiente
4. Execute o projeto:
   ```
   npm run dev
   ```

## Scripts

- `npm start`: Inicia o servidor
- `npm run dev`: Inicia o servidor com nodemon para desenvolvimento
- `npm run test:db`: Testa a conexão com o banco de dados
