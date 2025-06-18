# HelpDesk - Projeto Final  
Disciplina: Modelos, Métodos e Técnicas de Engenharia de Software

## 👥 Participantes
- Glenda Souza Fernandes dos Santos
- Guilherme Ornellas Carvalho
- Isaac Dias
- Jorge Henrique Ramos Gandolfi
- Marcus Vinicius Lameu Lima
- Victor Oliveira Cerqueira

## 📋 Descrição

Este projeto tem como objetivo simular um sistema de **HelpDesk** com arquitetura baseada em **microserviços**. O sistema permite o cadastro de funcionários, abertura de chamados, envio de arquivos anexos e notificações por e-mail. A comunicação entre os serviços ocorre de forma **assíncrona**, utilizando **RabbitMQ** como message broker.

O projeto foi desenvolvido com **Spring Boot** no backend e **JavaScript/HTML/CSS** no frontend, incluindo recursos como:
- Registro de serviços com **Eureka Server**
- Roteamento via **API Gateway**
- Segurança com **JWT (Spring Security)**
- Comunicação assíncrona com **RabbitMQ**
- Upload de arquivos com armazenamento local
- Envio automático de e-mails para criadores de chamados
- Docker para orquestração de containers
- Interface web responsiva

---

## 📁 Estrutura do Projeto

### Backend (Microserviços)
- `apifuncionario`: Gerencia dados dos funcionários
- `apihelpdesk`: Gerencia chamados e anexos
- `apiemail`: Responsável pelo envio de e-mails automáticos
- `apigateway`: Responsável por rotear as requisições
- `apisecurity`: Responsável pela autenticação e geração de tokens JWT
- `eurekaserver`: Serviço de descoberta

### Frontend
- Desenvolvido com JavaScript puro, HTML e CSS
- Interface intuitiva para criação e acompanhamento de chamados
- Integração completa com os microsserviços backend
- Responsivo para diferentes tamanhos de tela

---

## 🚀 Como Executar o Projeto

### ✅ Pré-requisitos

- Java 17+ (ou Java 21)
- Maven
- Docker e Docker Compose
- Navegador web moderno (para o frontend)
- RabbitMQ (será levantado via Docker)

### 🔧 Passos para execução

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/helpdesk.git
   cd helpdesk

2. **Execute o backend com Docker Compose**
    ```bash
    docker-compose up -d

3. **Acesse o frontend**
   - Abra o arquivo `index.html` no navegador

4. **Aguarde até todos os serviços subirem**

5. **Acesse:**
- Frontend: abra o arquivo `index.html` no navegador
- Eureka Server (Service Discovery): http://localhost:8761
- API Gateway: http://localhost:8080
- RabbitMQ Management: http://localhost:15672 (usuário: guest, senha: guest)

---

## 🛠️ Configuração Manual (Sem Docker)

1. **Bancos de Dados:**
   - Certifique-se de ter 3 instâncias MySQL rodando nas portas:
     - 3307 (ms_funcionario)
     - 3308 (ms_helpdesk)
     - 3309 (ms_security)
     - 3310 (ms_email)

2. **Backend:**
   - Configure os `application.properties` de cada microserviço conforme necessário
   - Ordem de Inicialização:
     1. `eurekaserver`
     2. `apigateway`
     3. `rabbitmq` (se não estiver usando Docker)
     4. `apisecurity`
     5. `apiemail`
     6. `apifuncionario`
     7. `apihelpdesk`

3. **Frontend:**
   - Não requer instalação adicional, basta abrir o arquivo HTML no navegador

---

## 🔧 Tecnologias Utilizadas

| Categoria         | Tecnologias                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| Backend           | Java 17, Spring Boot, Spring Data JPA, Spring Security                      |
| Frontend          | JavaScript, HTML5, CSS3                                                     |
| Mensageria        | RabbitMQ                                                                    |
| Banco de Dados    | MySQL                                                                       |
| Microsserviços    | Spring Cloud, Eureka Server, API Gateway                                    |
| E-mail            | JavaMail (integrado no microserviço apiemail)                               |
| DevOps            | Docker, Docker Compose                                                      |
| Upload de Arquivos| Spring Multipart, armazenamento local em `arquivos/UploadDir`               |

---

## ✉️ Funcionalidade de E-mail Automático

O microserviço `apiemail` é responsável por:
- Enviar e-mails automaticamente quando um novo chamado é criado
- Notificar o criador do chamado sobre atualizações
- Configuração de SMTP no `application.properties`
- Integração transparente com o sistema de chamados

---

## 📎 Upload de Arquivos

O microserviço `apihelpdesk` possui suporte para upload de arquivos:
- Formatos suportados: imagens, PDFs, documentos, etc.
- Local de Armazenamento: `helpdesk-project/arquivos/UploadDir/`
- Tamanho Máximo: Configurável no `application.properties`
- Associados automaticamente aos chamados correspondentes

---

## 🔒 Segurança

- Autenticação centralizada no microserviço `apisecurity`
- Tokens JWT são verificados no gateway e em todos os microsserviços
- Rotas protegidas por roles/permissões
- Criptografia de senhas
- Proteção contra CSRF e outros ataques comuns

---

## 🌟 Destaques do Projeto

- Arquitetura de microsserviços bem definida
- Comunicação assíncrona eficiente com RabbitMQ
- Frontend leve e funcional sem frameworks pesados
- Sistema completo de notificações por e-mail
- Fácil deploy com Docker Compose
- Documentação completa
