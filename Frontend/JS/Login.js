   // Tab switching functionality
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Hide all tab panes
                document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
                
                // Show the corresponding tab pane
                const tabId = tab.getAttribute('data-tab');
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
        
        // Login link in signup form
        document.querySelectorAll('.login-tab').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelector('.tab[data-tab="login"]').classList.add('active');
                
                document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
                document.getElementById('login-tab').classList.add('active');
            });
        });
        
        // Signup link in login form
        document.querySelectorAll('.signup-tab').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelector('.tab[data-tab="cadastro"]').classList.add('active');
                
                document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
                document.getElementById('cadastro-tab').classList.add('active');
            });
        });
        
        // Recovery link in login form
        document.querySelectorAll('.recovery-tab').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelector('.tab[data-tab="recuperar"]').classList.add('active');
                
                document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
                document.getElementById('recuperar-tab').classList.add('active');
            });
        });
        
        // Form submission prevention
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // Get the active tab
                const activeTab = document.querySelector('.tab.active').getAttribute('data-tab');
                
                let message = '';
                if(activeTab === 'login') {
                    message = 'Login realizado com sucesso! Redirecionando...';
                } else if(activeTab === 'cadastro') {
                    message = 'Conta criada com sucesso! Verifique seu email.';
                } else {
                    message = 'Link de recuperação enviado para seu email!';
                }
                
                // Show success message
                alert(message);
            });
        });