// =====================================================
// CONFIGURAÇÕES DA API - ATUALIZADAS
// =====================================================
const API_BASE_URL = 'http://apigateway:8080'; // URL base do backend Java
const LOGIN_ENDPOINT = '/auth/login';          // Endpoint para autenticação
const REGISTER_ENDPOINT = '/funcionario';      // Endpoint para cadastro de funcionários

// =====================================================
// GERENCIAMENTO DAS TABS (LOGIN/CADASTRO)
// =====================================================
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove classe ativa de todas as tabs
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        // Adiciona classe ativa na tab clicada
        tab.classList.add('active');
        
        // Esconde todos os painéis
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        
        // Mostra o painel correspondente à tab
        const tabId = tab.getAttribute('data-tab');
        const tabPane = document.getElementById(`${tabId}-tab`);
        tabPane.classList.add('active');
        
        // Rolagem para o topo do formulário
        tabPane.scrollTop = 0;
    });
});

// Links para alternar entre as tabs
document.querySelectorAll('.login-tab').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('login');
    });
});

document.querySelectorAll('.signup-tab').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('cadastro');
    });
});

// Função para alternar entre as tabs
function switchTab(tabName) {
    // Atualiza a tab ativa
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
    
    // Atualiza o painel visível
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    const tabPane = document.getElementById(`${tabName}-tab`);
    tabPane.classList.add('active');
    
    // Rolagem para o topo do formulário
    tabPane.scrollTop = 0;
}

// =====================================================
// FUNÇÕES DE COMUNICAÇÃO COM A API (BACKEND JAVA)
// =====================================================

/**
 * Realiza o login do usuário via API
 * @param {string} email - Email do usuário
 * @param {string} senha - Senha do usuário
 */
async function loginUser(email, senha) {
    try {
        // URL completa corrigida
        const url = API_BASE_URL + LOGIN_ENDPOINT;
        
        // Executa a requisição com os campos corretos
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: email, 
                senha: senha
            })
        });

        // Tratamento de erros
        if (!response.ok) {
            // Tenta extrair mensagem de erro
            let errorMsg = 'Erro na autenticação';
            try {
                const errorText = await response.text();
                errorMsg = errorText || errorMsg;
            } catch (e) {
                console.warn('Não foi possível ler corpo do erro', e);
            }
            throw new Error(errorMsg);
        }

        // Extrai o token da resposta (é texto, não JSON)
        const token = await response.text();
        
        // Armazena o token
        localStorage.setItem('authToken', token);
        
        // Feedback e redirecionamento
        alert('Autenticação realizada com sucesso! Redirecionando...');
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        console.error('Erro na autenticação:', error);
        alert('Falha na autenticação: ' + error.message);
    }
}

/**
 * Registra um novo funcionário via API
 * @param {Object} userData - Dados do funcionário para cadastro
 */
async function registerUser(userData) {
    try {
        // URL completa para cadastro
        const url = API_BASE_URL + REGISTER_ENDPOINT;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        // Verifica se a resposta não foi bem sucedida
        if (!response.ok) {
            let errorMsg = 'Erro ao criar conta';
            try {
                const errorText = await response.text();
                errorMsg = errorText || errorMsg;
            } catch (e) {
                console.warn('Não foi possível ler corpo do erro', e);
            }
            throw new Error(errorMsg);
        }

        // Processa a resposta JSON
        const data = await response.json();
        console.log('Funcionário cadastrado:', data);
        
        alert('Conta criada com sucesso! Faça login para continuar.');
        switchTab('login');
        
    } catch (error) {
        console.error('Erro no cadastro:', error);
        alert('Falha no cadastro: ' + error.message);
    }
}

// =====================================================
// EVENTOS DE SUBMIT DOS FORMULÁRIOS
// =====================================================

// Formulário de Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Captura dos dados
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;
    
    // Validação básica
    if (!email || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    // Chamada ao login
    await loginUser(email, senha);
});

// Formulário de Cadastro
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('signup-email').value;
    const department = document.getElementById('department').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (!name || !email || !department || !password || !confirmPassword) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('As senhas não coincidem. Por favor, tente novamente.');
        return;
    }
    
    // Preparar os dados no formato esperado pelo Java (FuncionarioModel)
    const userData = {
        nome: name,
        email: email,
        departamento: department,
        senha: password
    };
    
    // Chamar a função de cadastro
    await registerUser(userData);
    
    // Limpar o formulário
    document.getElementById('signup-form').reset();
});