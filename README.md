
## Instalação e Configuração

1.  **Clone o repositório:**

    ```bash
    git clone <url-do-repositorio>
    cd fleetwise
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**

    - Crie um arquivo `.env` na raiz do projeto, utilizando o `.env.example` como modelo.
    - Preencha as variáveis com as informações do seu ambiente (banco de dados, segredo JWT, etc.).
    ```env
    PORT=3000
    DB_HOST=localhost
    DB_USER=seu_usuario
    DB_PASSWORD=sua_senha
    DB_NAME=fleetwise
    DB_DIALECT=mysql
    DB_LOGGING=false
    JWT_SECRET=sua_chave_secreta_super_segura
    JWT_EXPIRES_IN=24h
    ADMIN_PASSWORD=uma_senha_forte_para_o_admin
    ```

4.  **Crie o Usuário Administrador:**

    - Após configurar o banco de dados no arquivo `.env`, execute o script para criar o primeiro usuário com perfil de `admin`.

    ```bash
    node scripts/criar_usuario_admin.js
    ```

5.  **Execute a Aplicação:**

    ```bash
    npm run dev
    ```

    O servidor estará rodando em `http://localhost:3000`.

## Scripts Disponíveis

  - `npm start`: Inicia o servidor em modo de produção.
  - `npm run dev`: Inicia o servidor em modo de desenvolvimento com `nodemon`, que reinicia a aplicação automaticamente a cada alteração de arquivo.
  - `npm run test:db`: Executa um script de teste para verificar a conexão com o banco de dados.

## Endpoints da API

A base da URL para todos os endpoints é `http://localhost:3000/api`.

### Documentação da API (Swagger)

Para uma visualização interativa e detalhada de todos os endpoints, acesse a documentação do Swagger após iniciar o servidor:

  - **GET /api/docs**: Abre a interface do Swagger UI.

### Status da API

  - **GET /api/status**: Verifica a saúde da aplicação.
      - **Resposta:** Retorna o status `online`, o `timestamp` e o ambiente (`development` ou `production`).

### Autenticação

  - **POST /api/login**: Realiza a autenticação de um usuário no sistema.
      - **Corpo da Requisição:** `email`, `senha`.
      - **Resposta:** Retorna os dados do usuário e um token JWT em caso de sucesso.

### Usuários

*As rotas de usuários exigem autenticação e autorização de administrador.*

  - **POST /api/usuarios**: Cadastra um novo usuário (perfis: `admin`, `gestor`, `motorista`).
      - **Corpo da Requisição:** `nome`, `email`, `senha`, `tipo` (opcional, padrão `motorista`).
  - **GET /api/usuarios**: Lista todos os usuários cadastrados.
  - **GET /api/usuarios/{id}**: Busca um usuário específico pelo seu ID.
  - **PUT /api/usuarios/{id}**: Atualiza os dados de um usuário.
  - **DELETE /api/usuarios/{id}**: Desativa um usuário (exclusão lógica).

### Veículos

*As rotas de veículos exigem autenticação.*

  - **POST /api/veiculos**: Cadastra um novo veículo.
      - **Corpo da Requisição:** `placa`, `chassi`, `marca`, `modelo`, `ano`, `cor`, `tipo`.
  - **GET /api/veiculos**: Lista todos os veículos.
  - **GET /api/veiculos/{id}**: Busca um veículo específico pelo seu ID.
  - **PUT /api/veiculos/{id}**: Atualiza os dados de um veículo.
  - **DELETE /api/veiculos/{id}**: Desativa um veículo (exclusão lógica, altera o status para `inativo`).

### Motoristas

*As rotas de motoristas exigem autenticação.*

  - **POST /api/motoristas**: Cadastra um novo motorista.
      - **Corpo da Requisição:** `nome_completo`, `cpf`, `cnh_numero`, `cnh_data_vencimento`, e outros campos opcionais.
  - **GET /api/motoristas**: Lista todos os motoristas.
  - **GET /api/motoristas/{id}**: Busca um motorista específico pelo seu ID.
  - **PUT /api/motoristas/{id}**: Atualiza os dados de um motorista.
  - **DELETE /api/motoristas/{id}**: Desativa um motorista (exclusão lógica, altera o status para `Inativo`).
