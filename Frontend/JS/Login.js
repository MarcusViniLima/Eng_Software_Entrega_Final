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
                const tabPane = document.getElementById(`${tabId}-tab`);
                tabPane.classList.add('active');
                
                // Scroll to top of the form
                tabPane.scrollTop = 0;
            });
        });
        
        // Login link in signup form
        document.querySelectorAll('.login-tab').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                switchTab('login');
            });
        });
        
        // Signup link in login form
        document.querySelectorAll('.signup-tab').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                switchTab('cadastro');
            });
        });
        
        // Function to switch tabs
        function switchTab(tabName) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
            
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            const tabPane = document.getElementById(`${tabName}-tab`);
            tabPane.classList.add('active');
            
            // Scroll to top of the form
            tabPane.scrollTop = 0;
        }
        
        // Form submission prevention
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get the active tab
                const activeTab = document.querySelector('.tab.active').getAttribute('data-tab');
                
                let message = '';
                if(activeTab === 'login') {
                    // Validate login form
                    const email = document.getElementById('email').value;
                    const password = document.getElementById('password').value;
                    
                    if(!email || !password) {
                        alert('Por favor, preencha todos os campos.');
                        return;
                    }
                    
                    message = 'Login realizado com sucesso! Redirecionando...';
                } else {
                    // Validate signup form
                    const name = document.getElementById('name').value;
                    const email = document.getElementById('signup-email').value;
                    const department = document.getElementById('department').value;
                    const password = document.getElementById('signup-password').value;
                    const confirmPassword = document.getElementById('confirm-password').value;
                    
                    if(!name || !email || !department || !password || !confirmPassword) {
                        alert('Por favor, preencha todos os campos.');
                        return;
                    }
                    
                    if(password !== confirmPassword) {
                        alert('As senhas não coincidem. Por favor, tente novamente.');
                        return;
                    }
                    
                    message = `Conta criada com sucesso! Bem-vindo(a) ao departamento ${document.querySelector('#department option:checked').textContent}.`;
                }
                
                // Show success message
                alert(message);
                
                // Reset forms
                if(activeTab === 'login') {
                    document.getElementById('login-form').reset();
                } else {
                    document.getElementById('signup-form').reset();
                }
                
                // Switch to login after successful signup
                if(activeTab !== 'login') {
                    setTimeout(() => switchTab('login'), 1000);
                }
            });
        });