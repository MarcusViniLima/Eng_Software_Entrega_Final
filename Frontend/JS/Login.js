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
    // FUNÇÕES DE AUTENTICAÇÃO (CACHE LOCAL)
    // =====================================================

    // Inicializa o localStorage se necessário
    function initializeLocalStorage() {
        if (!localStorage.getItem('users')) {
            const defaultUsers = [
                {
                    nome: "Guilherme Ornellas",
                    email: "guiornellas1012@gmail.com",
                    departamento: "ti",
                    senha: "12345"
                },
                {
                    nome: "Help Office",
                    email: "helpoffice2025@gmail.com",
                    departamento: "ti",
                    senha: "12345"
                }
            ];
            localStorage.setItem('users', JSON.stringify(defaultUsers));
        }
    }

    /**
     * Realiza o login do usuário via localStorage
     */
    function loginUser(email, senha) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.senha === senha);
        
        if (user) {
            // Armazena o usuário logado
            sessionStorage.setItem('loggedUser', JSON.stringify(user));
            
            // Redireciona conforme o email
            if (email === "guiornellas1012@gmail.com") {
                window.location.href = '../pags/UserMenu.html';
            } else if (email === "helpoffice2025@gmail.com") {
                window.location.href = '../pags/TecMenu.html';
            } else {
                // Redirecionamento padrão
                window.location.href = '../pags/UserMenu.html';
            }
            return true;
        }
        return false;
    }

    /**
     * Registra um novo funcionário no localStorage
     */
    function registerUser(userData) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Verifica se o email já existe
        if (users.some(u => u.email === userData.email)) {
            return false;
        }
        
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }

    // Mostrar popup de sucesso
    function showSuccessPopup() {
        const popup = document.getElementById('success-popup');
        popup.style.display = 'flex';
        
        document.getElementById('close-popup').addEventListener('click', () => {
            popup.style.display = 'none';
            switchTab('login');
        });
    }

    // =====================================================
    // EVENTOS DE SUBMIT DOS FORMULÁRIOS
    // =====================================================

    // Inicializar localStorage
    initializeLocalStorage();

    // Formulário de Login
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Captura dos dados
        const email = document.getElementById('email').value;
        const senha = document.getElementById('password').value;
        
        // Validação básica
        if (!email || !senha) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        // Tentativa de login
        if (!loginUser(email, senha)) {
            alert('Credenciais inválidas. Tente novamente.');
        }
    });

    // Formulário de Cadastro
    document.getElementById('signup-form').addEventListener('submit', (e) => {
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
        
        // Preparar os dados do usuário
        const userData = {
            nome: name,
            email: email,
            departamento: department,
            senha: password
        };
        
        // Chamar a função de cadastro
        if (registerUser(userData)) {
            // Mostrar popup de sucesso para guiornellas1012@gmail.com
            if (email === "guiornellas1012@gmail.com") {
                showSuccessPopup();
            } else {
                alert('Conta criada com sucesso!');
                switchTab('login');
            }
        } else {
            alert('Este email já está cadastrado.');
        }
    });