// =====================================================
// CONFIGURAÇÕES DA API - ATUALIZADAS
// =====================================================
const API_BASE_URL = 'http://localhost:8080';
const LOGIN_ENDPOINT = '/auth/login';
const REGISTER_ENDPOINT = '/auth/register'; // Novo endpoint sugerido
const FUNCIONARIO_ENDPOINT = '/funcionario'; // Endpoint existente

// =====================================================
// GERENCIAMENTO DAS TABS (LOGIN/CADASTRO) - MANTIDO
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

// Links para alternar entre as tabs - MANTIDO
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

// Função para alternar entre as tabs - MANTIDO
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
// FUNÇÕES DE COMUNICAÇÃO COM A API - ATUALIZADAS
// =====================================================

async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}${LOGIN_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro na autenticação');
        }

        // Backend retorna apenas o token como string
        const token = await response.text();
        
        // Armazena o token e informações do usuário
        localStorage.setItem('authToken', token);
        localStorage.setItem('userEmail', email);
        
        // Busca informações adicionais do usuário
        await fetchUserDetails(email);

        return { token };
    } catch (error) {
        console.error('Erro no login:', error);
        throw error;
    }
}

async function fetchUserDetails(email) {
    try {
        const response = await fetch(`${API_BASE_URL}${FUNCIONARIO_ENDPOINT}/email/${encodeURIComponent(email)}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            localStorage.setItem('userName', userData.name);
            localStorage.setItem('userDepartment', userData.setor);
        }
    } catch (error) {
        console.error('Erro ao buscar detalhes do usuário:', error);
    }
}

async function registerUser(userData) {
    try {
        // Validação básica dos dados
        if (!userData.name || !userData.cpf || !userData.email || !userData.password || !userData.department) {
            throw new Error('Todos os campos são obrigatórios');
        }

        // Formata o CPF (remove pontuação)
        const cpfLimpo = userData.cpf.replace(/\D/g, '');

        // Formata o departamento (maiúsculas)
        const departamentoFormatado = userData.department.toUpperCase();

        // Cadastro de funcionário
        const response = await fetch(`${API_BASE_URL}${FUNCIONARIO_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: userData.name.trim(),
                email: userData.email.trim(),
                setor: departamentoFormatado,
                password: userData.password,
                cpf: cpfLimpo
            })
        });

        const responseData = await response.json();

        if (!response.ok) {
            // Tenta obter a mensagem de erro do backend
            const errorMsg = responseData.message || 
                            responseData.error || 
                            'Erro ao criar conta de funcionário';
            throw new Error(errorMsg);
        }

        // Faz login automaticamente após cadastro
        await loginUser(userData.email, userData.password);
        return true;
    } catch (error) {
        console.error('Erro detalhado no cadastro:', error);
        throw new Error(error.message || 'Erro ao processar cadastro');
    }
}

// =====================================================
// EVENTOS DE SUBMIT ATUALIZADOS
// =====================================================

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await loginUser(email, password);
        
        // Redireciona com base no departamento
        const department = localStorage.getItem('userDepartment');
        if (department === 'TI') {
            window.location.href = 'dashboard-tecnico.html';
        } else {
            window.location.href = 'dashboard-usuario.html';
        }
    } catch (error) {
        showError('Falha no login: ' + error.message);
    }
});

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('name').value,
        cpf: document.getElementById('cpf').value,
        email: document.getElementById('signup-email').value,
        password: document.getElementById('signup-password').value,
        department: document.getElementById('department').value
    };

    // Validação de senha
    if (userData.password !== document.getElementById('confirm-password').value) {
        showError('As senhas não coincidem!');
        return;
    }

    try {
        await registerUser(userData);
        showSuccess('Cadastro realizado com sucesso! Redirecionando...');
    } catch (error) {
        showError('Erro no cadastro: ' + error.message);
    }
});

// =====================================================
// FUNÇÕES AUXILIARES - MANTIDAS
// =====================================================

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert error';
    errorDiv.innerHTML = `<strong>Erro:</strong> ${message}<br>
                         <small>Verifique os dados e tente novamente</small>`;
    document.querySelector('.tab-pane.active').prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 8000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert success';
    successDiv.textContent = message;
    document.querySelector('.tab-pane.active').prepend(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
}