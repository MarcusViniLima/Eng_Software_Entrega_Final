// =====================================================
// CONFIGURAÇÕES DA API - ATUALIZADAS
// =====================================================
const API_BASE_URL = 'http://localhost:8080'; // URL base do backend Java
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
// FUNÇÕES DE COMUNICAÇÃO COM A API (BACKEND JAVA) - ATUALIZADAS
// =====================================================

/**
 * Realiza o login do usuário via API
 * @param {string} email - Email do usuário
 * @param {string} senha - Senha do usuário
 */
async function loginUser(email, senha) {
    try {
        const response = await fetch(API_BASE_URL + LOGIN_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: email, 
                senha: senha
            })
        });

        // Verifica se a resposta não foi bem sucedida
        if (!response.ok) {
            // Tenta extrair mensagem de erro
            let errorMsg = 'Erro na autenticação';
            try {
                const errorData = await response.json();
                errorMsg = errorData.error || errorData.message || errorMsg;
            } catch (e) {
                const errorText = await response.text();
                errorMsg = errorText || errorMsg;
            }
            throw new Error(errorMsg);
        }

        // Extrai o token da resposta (agora em JSON)
        const data = await response.json();
        const token = data.token;
        
        if (!token) {
            throw new Error('Token não recebido na resposta');
        }
        
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
        const response = await fetch(API_BASE_URL + REGISTER_ENDPOINT, {
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
                const errorData = await response.json();
                errorMsg = errorData.error || errorData.message || errorMsg;
            } catch (e) {
                const errorText = await response.text();
                errorMsg = errorText || errorMsg;
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
// EVENTOS DE SUBMIT DOS FORMULÁRIOS - ATUALIZADOS
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
    
    // Mapeamento dos departamentos para valores esperados pelo backend
    const departmentMapping = {
        'ti': 'TI',
        'rh': 'RH',
        'financeiro': 'FINANCEIRO',
        'vendas': 'VENDAS',
        'marketing': 'MARKETING',
        'operacoes': 'OPERACOES'
    };

    // Obtém o valor mapeado ou usa o valor original se não estiver no mapeamento
    const mappedDepartment = departmentMapping[department.toLowerCase()] || department.toUpperCase();
    
    // Preparar os dados no formato esperado pelo Java (FuncionarioModel)
    const userData = {
        nome: name,
        email: email,
        departamento: mappedDepartment, // Usa o valor mapeado
        senha: password
    };
    
    // Chamar a função de cadastro
    await registerUser(userData);
    
    // Limpar o formulário
    document.getElementById('signup-form').reset();
});