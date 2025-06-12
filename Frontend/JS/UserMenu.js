        // Priority selection
        document.querySelectorAll('.priority-option').forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all options
                document.querySelectorAll('.priority-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                
                // Add active class to clicked option
                this.classList.add('active');
                
                // Set hidden input value
                document.getElementById('priority').value = this.getAttribute('data-priority');
            });
        });
        
        // File upload
        const fileUpload = document.getElementById('file-upload');
        const fileInput = document.getElementById('file-input');
        const fileInfo = document.querySelector('.file-info');
        
        fileUpload.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                fileInfo.textContent = this.files[0].name;
                fileUpload.style.borderColor = '#6a11cb';
            }
        });
        
        // Form submission
        document.getElementById('ticket-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const title = document.getElementById('ticket-title').value;
            const department = document.getElementById('department').value;
            const priority = document.getElementById('priority').value;
            const description = document.getElementById('description').value;
            
            // Simple validation
            if (!title || !department || !priority || !description) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Show success message
            alert('Chamado aberto com sucesso! Obrigado por relatar o problema.');
            
            // Reset form
            this.reset();
            document.querySelectorAll('.priority-option').forEach(opt => {
                opt.classList.remove('active');
            });
            fileInfo.textContent = 'Nenhum arquivo selecionado';
            fileUpload.style.borderColor = '#e0e0e0';
        });
        
        // Add hover effect to file upload area
        fileUpload.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#6a11cb';
            this.style.backgroundColor = '#f0e6ff';
        });
        
        fileUpload.addEventListener('dragleave', function() {
            this.style.borderColor = '#e0e0e0';
            this.style.backgroundColor = '#f8f9fa';
        });
        
        fileUpload.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#e0e0e0';
            this.style.backgroundColor = '#f8f9fa';
            
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                fileInput.files = e.dataTransfer.files;
                fileInfo.textContent = e.dataTransfer.files[0].name;
                this.style.borderColor = '#6a11cb';
            }
        });
        
        // Banner button scroll to form
        document.querySelector('.banner .btn').addEventListener('click', function() {
            document.getElementById('ticket-form').scrollIntoView({
                behavior: 'smooth'
            });
        });