<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HelpDesk - Projeto Final</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2, h3 {
            color: #2c3e50;
        }
        h1 {
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
            margin-top: 30px;
        }
        code {
            background-color: #f5f5f5;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: 'Courier New', Courier, monospace;
        }
        pre {
            background-color: #f8f8f8;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .emoji {
            font-size: 1.2em;
        }
    </style>
</head>
<body>
    <h1>HelpDesk - Projeto Final</h1>
    <p><strong>Disciplina:</strong> Modelos, Métodos e Técnicas de Engenharia de Software</p>

    <h2><span class="emoji">📋</span> Descrição</h2>
    <p>Este projeto tem como objetivo simular um sistema de <strong>HelpDesk</strong> com arquitetura baseada em <strong>microserviços</strong>. O sistema permite o cadastro de funcionários, abertura de chamados e envio de arquivos anexos. A comunicação entre os serviços ocorre de forma <strong>assíncrona</strong>, utilizando <strong>RabbitMQ</strong> como message broker.</p>
    
    <p>O projeto foi desenvolvido com <strong>Spring Boot</strong> e inclui recursos como:</p>
    <ul>
        <li>Registro de serviços com <strong>Eureka Server</strong></li>
        <li>Roteamento via <strong>API Gateway</strong></li>
        <li>Segurança com <strong>JWT (Spring Security)</strong></li>
        <li>Comunicação assíncrona com <strong>RabbitMQ</strong></li>
        <li>Upload de arquivos com armazenamento local</li>
        <li>Docker para orquestração de containers</li>
    </ul>

    <h2><span class="emoji">📁</span> Estrutura dos Microserviços</h2>
    <ul>
        <li><code>apifuncionario</code>: Gerencia dados dos funcionários</li>
        <li><code>apihelpdesk</code>: Gerencia chamados e anexos</li>
        <li><code>apigateway</code>: Responsável por rotear as requisições</li>
        <li><code>apisecurity</code>: Responsável pela autenticação e geração de tokens JWT</li>
        <li><code>eurekaserver</code>: Serviço de descoberta</li>
        <li><code>arquivos/UploadDir</code>: Pasta onde os arquivos anexados são salvos</li>
    </ul>

    <h2><span class="emoji">🚀</span> Como Executar o Projeto</h2>

    <h3><span class="emoji">✅</span> Pré-requisitos</h3>
    <ul>
        <li>Java 17+ (ou Java 21)</li>
        <li>Maven</li>
        <li>Docker e Docker Compose</li>
        <li>RabbitMQ (será levantado via Docker)</li>
    </ul>

    <h3><span class="emoji">🔧</span> Passos para execução</h3>
    <ol>
        <li>
            <strong>Clone o repositório</strong>
            <pre><code>git clone https://github.com/seu-usuario/helpdesk.git
cd helpdesk</code></pre>
        </li>
        <li>
            <strong>Execute com Docker Compose</strong>
            <pre><code>docker-compose up -d</code></pre>
        </li>
        <li><strong>Aguarde até todos os containers subirem</strong></li>
        <li>
            <strong>Acesse:</strong>
            <ul>
                <li>Eureka Server (Service Discovery): <a href="http://localhost:8761" target="_blank">http://localhost:8761</a></li>
                <li>API Gateway: <a href="http://localhost:8080" target="_blank">http://localhost:8080</a></li>
                <li>RabbitMQ Management: <a href="http://localhost:15672" target="_blank">http://localhost:15672</a> (usuário: <code>guest</code>, senha: <code>guest</code>)</li>
            </ul>
        </li>
    </ol>

    <h2><span class="emoji">🛠️</span> Configuração Manual (Sem Docker)</h2>
    <ol>
        <li>
            <strong>Bancos de Dados:</strong>
            <ul>
                <li>Certifique-se de ter 3 instâncias MySQL rodando nas portas:
                    <ul>
                        <li>3307 (ms_funcionario)</li>
                        <li>3308 (ms_helpdesk)</li>
                        <li>3309 (ms_security)</li>
                    </ul>
                </li>
            </ul>
        </li>
        <li>
            <strong>Arquivos de Configuração:</strong>
            <ul>
                <li>Configure os <code>application.properties</code> de cada microserviço conforme necessário</li>
            </ul>
        </li>
        <li>
            <strong>Ordem de Inicialização:</strong>
            <ol>
                <li><code>eurekaserver</code></li>
                <li><code>apigateway</code></li>
                <li><code>rabbitmq</code> (se não estiver usando Docker)</li>
                <li><code>apisecurity</code></li>
                <li><code>apifuncionario</code></li>
                <li><code>apihelpdesk</code></li>
            </ol>
        </li>
    </ol>

    <h2><span class="emoji">🔧</span> Tecnologias Utilizadas</h2>
    <table>
        <tr>
            <th>Categoria</th>
            <th>Tecnologias</th>
        </tr>
        <tr>
            <td>Backend</td>
            <td>Java 17, Spring Boot, Spring Data JPA, Spring Security</td>
        </tr>
        <tr>
            <td>Mensageria</td>
            <td>RabbitMQ</td>
        </tr>
        <tr>
            <td>Banco de Dados</td>
            <td>MySQL</td>
        </tr>
        <tr>
            <td>Microsserviços</td>
            <td>Spring Cloud, Eureka Server, API Gateway</td>
        </tr>
        <tr>
            <td>DevOps</td>
            <td>Docker, Docker Compose</td>
        </tr>
        <tr>
            <td>Upload de Arquivos</td>
            <td>Spring Multipart, armazenamento local em <code>arquivos/UploadDir</code></td>
        </tr>
    </table>

    <h2><span class="emoji">📎</span> Upload de Arquivos</h2>
    <p>O microserviço <code>apihelpdesk</code> possui suporte para upload de arquivos (imagens, PDFs, documentos etc.), que são associados aos chamados abertos.</p>
    <ul>
        <li><strong>Local de Armazenamento:</strong> <code>helpdesk-project/arquivos/UploadDir/</code></li>
        <li><strong>Tamanho Máximo:</strong> Configurável no <code>application.properties</code></li>
    </ul>

    <h2><span class="emoji">🔒</span> Segurança</h2>
    <ul>
        <li>Autenticação centralizada no microserviço <code>apisecurity</code></li>
        <li>Tokens JWT são verificados no gateway e em todos os microserviços</li>
        <li>Rotas protegidas por roles/permissões</li>
    </ul>
</body>
</html>