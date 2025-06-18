// =====================================================
// CONFIGURAÇÕES DA API
// =====================================================
const API_BASE_URL = 'http://localhost:8082';
const LOGIN_ENDPOINT = '/auth/login';
const FUNCIONARIO_ENDPOINT = '/funcionario';
const TOKEN_KEY = 'authToken';
const USER_EMAIL_KEY = 'userEmail';
const USER_NAME_KEY = 'userName';
const USER_DEPARTMENT_KEY = 'userDepartment';

// =====================================================
// GERENCIAMENTO DAS TABS (LOGIN/CADASTRO)
// =====================================================
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        const tabId = tab.getAttribute('data-tab');
        const tabPane = document.getElementById(`${tabId}-tab`);
        tabPane.classList.add('active');
        tabPane.scrollTop = 0;
    });
});

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

function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');

    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    const tabPane = document.getElementById(`${tabName}-tab`);
    tabPane.classList.add('active');
    tabPane.scrollTop = 0;
}

// =====================================================
// FUNÇÕES DE AUTENTICAÇÃO (ATUALIZADAS)
// =====================================================

/**
 * Realiza o login do usuário com tratamento completo de erros
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<{token: string, user: object}>}
 */
async function loginUser(email, password) {
    try {
        // Validação básica
        if (!email || !password) {
            throw new Error('Email e senha são obrigatórios');
        }

        console.log('[AUTH] Tentando login para:', email);

        // Configuração simplificada da requisição
        const response = await fetch(`${API_BASE_URL}${LOGIN_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                email: email.trim(),
                password: password
            })
            // Removido credentials e signal para teste inicial
        });

        console.log('[AUTH] Status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('[AUTH] Erro detalhado:', errorData);
            throw new Error(errorData.message || `Erro HTTP ${response.status}`);
        }

        const data = await response.json();
        if (!data.token) {
            throw new Error('Token não recebido na resposta');
        }

        localStorage.setItem('authToken', data.token);
        console.log('[AUTH] Login bem-sucedido');
        return data;

    } catch (error) {
        console.error('[AUTH] Falha completa:', error);
        throw new Error(error.message || 'Falha no login. Tente novamente.');
    }
}
// Função auxiliar para parsear erros
async function parseErrorResponse(response) {
    try {
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch {
            return { message: text };
        }
    } catch {
        return { message: `Erro HTTP ${response.status}` };
    }
}

// Funções auxiliares:

/**
 * Parseia a resposta de autenticação
 */
async function parseAuthResponse(response) {
    const contentType = response.headers.get('content-type');
    
    try {
        if (contentType?.includes('application/json')) {
            return await response.json();
        }
        return { token: await response.text() };
    } catch (e) {
        console.error('[AUTH] Erro ao parsear resposta:', e);
        throw new Error('Formato de resposta inválido');
    }
}

/**
 * Parseia erros da resposta
 */
async function parseErrorResponse(response) {
    try {
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch {
            return { message: text };
        }
    } catch {
        return { message: `Erro HTTP ${response.status}` };
    }
}

/**
 * Limpa os dados de autenticação
 */
function clearAuthData() {
    [TOKEN_KEY, USER_EMAIL_KEY, USER_NAME_KEY, USER_DEPARTMENT_KEY].forEach(key => {
        localStorage.removeItem(key);
    });
}

/**
 * Busca detalhes do usuário após login
 * @param {string} email 
 * @param {string} token 
 * @returns {Promise<object>}
 */
async function fetchUserDetails(email, token) {
    try {
        console.log('[USER] Buscando detalhes para:', email);
        const response = await fetch(`${API_BASE_URL}${FUNCIONARIO_ENDPOINT}/email/${encodeURIComponent(email)}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            credentials: 'include'
        });

        console.log('[USER] Resposta detalhes:', response.status);
        
        if (!response.ok) {
            const errorData = await tryParseResponse(response);
            throw new Error(errorData.message || 'Erro ao buscar detalhes do usuário');
        }

        const userData = await response.json();
        localStorage.setItem(USER_NAME_KEY, userData.name);
        localStorage.setItem(USER_DEPARTMENT_KEY, userData.setor);
        
        return userData;
    } catch (error) {
        console.error('[USER] Erro ao buscar detalhes:', error);
        throw error;
    }
}

/**
 * Registra um novo usuário
 * @param {object} userData 
 * @returns {Promise<boolean>}
 */
async function registerUser(userData) {
    try {
        // Validação dos campos
        const requiredFields = ['name', 'cpf', 'email', 'password', 'department'];
        const missingFields = requiredFields.filter(field => !userData[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
        }

        // Formatação dos dados
        const cleanedData = {
            ...userData,
            cpf: userData.cpf.replace(/\D/g, ''),
            setor: userData.department.toUpperCase(),
            name: userData.name.trim(),
            email: userData.email.trim()
        };

        console.log('[REGISTER] Registrando novo usuário:', cleanedData);
        const response = await fetch(`${API_BASE_URL}${FUNCIONARIO_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(cleanedData)
        });

        console.log('[REGISTER] Resposta recebida:', response.status);
        
        if (!response.ok) {
            const errorData = await tryParseResponse(response);
            throw new Error(errorData.message || 'Erro ao registrar usuário');
        }

        // Login automático após registro
        const { email, password } = userData;
        await loginUser(email, password);
        
        return true;
    } catch (error) {
        console.error('[REGISTER] Erro no cadastro:', error);
        throw error;
    }
}

// =====================================================
// FUNÇÕES AUXILIARES (ATUALIZADAS)
// =====================================================

/**
 * Tenta parsear a resposta como JSON, ou retorna texto
 * @param {Response} response 
 * @returns {Promise<object|string>}
 */
async function tryParseResponse(response) {
    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch {
        return { message: text };
    }
}

/**
 * Processa a resposta de autenticação
 * @param {Response} response 
 * @returns {Promise<{token: string}>}
 */
async function parseAuthResponse(response) {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
        return await response.json();
    }
    
    return { token: await response.text() };
}

/**
 * Limpa os dados de autenticação
 */
function clearAuthData() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(USER_NAME_KEY);
    localStorage.removeItem(USER_DEPARTMENT_KEY);
}

/**
 * Verifica se há um usuário autenticado
 * @returns {boolean}
 */
function isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
}

/**
 * Mostra mensagem de erro
 * @param {string} message 
 */
function showError(message) {
    const activePane = document.querySelector('.tab-pane.active');
    if (!activePane) return;

    // Remove mensagens anteriores
    document.querySelectorAll('.alert.error').forEach(el => el.remove());

    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert error';
    errorDiv.innerHTML = `
        <strong>Erro:</strong> ${message}<br>
        <small>Verifique os dados e tente novamente</small>
    `;
    activePane.prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 8000);
}

/**
 * Mostra mensagem de sucesso
 * @param {string} message 
 */
function showSuccess(message) {
    const activePane = document.querySelector('.tab-pane.active');
    if (!activePane) return;

    // Remove mensagens anteriores
    document.querySelectorAll('.alert.success').forEach(el => el.remove());

    const successDiv = document.createElement('div');
    successDiv.className = 'alert success';
    successDiv.textContent = message;
    activePane.prepend(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
}

// =====================================================
// EVENT HANDLERS (ATUALIZADOS)
// =====================================================

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Mostra loading (opcional)
        showLoading(true);
        
        const { user } = await loginUser(email, password);
        
        // Feedback visual
        showSuccess('Login realizado! Redirecionando...');
        
        // Redireciona com base no departamento
        setTimeout(() => {
            window.location.href = user.setor === 'TI' 
                ? 'TecMenu.html' 
                : 'UserMenu.html';
        }, 1500);
        
    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
});

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('name').value.trim(),
        cpf: document.getElementById('cpf').value,
        email: document.getElementById('signup-email').value.trim(),
        password: document.getElementById('signup-password').value,
        department: document.getElementById('department').value
    };

    // Validação de senha
    if (userData.password !== document.getElementById('confirm-password').value) {
        showError('As senhas não coincidem!');
        return;
    }

    try {
        showLoading(true);
        await registerUser(userData);
        showSuccess('Cadastro realizado com sucesso! Redirecionando...');
    } catch (error) {
        showError(error.message || 'Erro no cadastro. Tente novamente.');
    } finally {
        showLoading(false);
    }
});

/**
 * Mostra/oculta indicador de carregamento
 * @param {boolean} isLoading 
 */
function showLoading(isLoading) {
    const buttons = document.querySelectorAll('.tab-pane.active button[type="submit"]');
    buttons.forEach(button => {
        button.disabled = isLoading;
        button.innerHTML = isLoading 
            ? '<i class="fa fa-spinner fa-spin"></i> Processando...' 
            : button.dataset.originalText || button.textContent;
        
        if (isLoading) {
            button.dataset.originalText = button.textContent;
        }
    });
}

// =====================================================
// INICIALIZAÇÃO
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se já está autenticado
    if (isAuthenticated()) {
        const department = localStorage.getItem(USER_DEPARTMENT_KEY);
        const redirectUrl = department === 'TI' 
            ? 'dashboard-tecnico.html' 
            : 'dashboard-usuario.html';
        
        console.log('[INIT] Usuário já autenticado, redirecionando...');
        window.location.href = redirectUrl;
    }
});