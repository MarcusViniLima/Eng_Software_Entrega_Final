# HelpDesk - Projeto Final  
Disciplina: Modelos, Métodos e Técnicas de Engenharia de Software

## 📋 Descrição

Este projeto tem como objetivo simular um sistema de **HelpDesk** com arquitetura baseada em **microserviços**. O sistema permite o cadastro de funcionários, abertura de chamados e envio de arquivos anexos. A comunicação entre os serviços ocorre de forma **assíncrona**, utilizando **RabbitMQ** como message broker.

O projeto foi desenvolvido com **Spring Boot** e inclui recursos como:
- Registro de serviços com **Eureka Server**
- Roteamento via **API Gateway**
- Segurança com **JWT (Spring Security)**
- Comunicação assíncrona com **RabbitMQ**
- Upload de arquivos com armazenamento local
- Docker para orquestração de containers

---

## 📁 Estrutura dos Microserviços

- `apifuncionario`: Gerencia dados dos funcionários
- `apihelpdesk`: Gerencia chamados e anexos
- `apigateway`: Responsável por rotear as requisições
- `apisecurity`: Responsável pela autenticação e geração de tokens JWT
- `eurekaserver`: Serviço de descoberta
- `arquivos/UploadDir`: Pasta onde os arquivos anexados são salvos

---

## 🚀 Como Executar o Projeto


### ✅ Pré-requisitos

- Java 17+ (ou Java 21)
- Maven
- Docker e Docker Compose
- RabbitMQ (será levantado via Docker)

### 🔧 Passos para execução

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/helpdesk.git
   cd helpdesk

2. **Execute com Docker Compose**
- docker-compose up -d

3. **Aguarde até todos os containers subirem**

4. **Acesse:**
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

2. **Arquivos de Configuração:**
   - Configure os `application.properties` de cada microserviço conforme necessário

3. **Ordem de Inicialização:**
   1. `eurekaserver`
   2. `apigateway`
   3. `rabbitmq` (se não estiver usando Docker)
   4. `apisecurity`
   5. `apifuncionario`
   6. `apihelpdesk`

---

## 🔧 Tecnologias Utilizadas

| Categoria         | Tecnologias                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| Backend           | Java 17, Spring Boot, Spring Data JPA, Spring Security                      |
| Mensageria        | RabbitMQ                                                                    |
| Banco de Dados    | MySQL                                                                       |
| Microsserviços    | Spring Cloud, Eureka Server, API Gateway                                    |
| DevOps            | Docker, Docker Compose                                                      |
| Upload de Arquivos| Spring Multipart, armazenamento local em `arquivos/UploadDir`               |

---

## 📎 Upload de Arquivos

O microserviço `apihelpdesk` possui suporte para upload de arquivos (imagens, PDFs, documentos etc.), que são associados aos chamados abertos.

- **Local de Armazenamento:** `helpdesk-project/arquivos/UploadDir/`
- **Tamanho Máximo:** Configurável no `application.properties`

---

## 🔒 Segurança

- Autenticação centralizada no microserviço `apisecurity`
- Tokens JWT são verificados no gateway e em todos os microsserviços
- Rotas protegidas por roles/permissões

---
