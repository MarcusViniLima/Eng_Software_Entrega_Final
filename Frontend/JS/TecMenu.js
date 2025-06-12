 // Priority selection for edit form
        document.querySelectorAll('#edit-ticket-form .priority-option').forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all options
                document.querySelectorAll('#edit-ticket-form .priority-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                
                // Add active class to clicked option
                this.classList.add('active');
            });
        });
        
        // File upload for edit form
        const editFileUpload = document.getElementById('edit-file-upload');
        const editFileInput = document.getElementById('edit-file-input');
        const editFileInfo = editFileUpload.querySelector('.file-info');
        
        editFileUpload.addEventListener('click', () => {
            editFileInput.click();
        });
        
        editFileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                editFileInfo.textContent = this.files[0].name;
                editFileUpload.style.borderColor = '#6a11cb';
            }
        });
        
        // Form submission for edit form
        document.getElementById('edit-ticket-form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Chamado atualizado com sucesso!');
        });
        
        // Action buttons in table
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.querySelector('i').className;
                if (action.includes('fa-edit')) {
                    alert('Editar chamado');
                } else if (action.includes('fa-check')) {
                    alert('Chamado resolvido!');
                } else if (action.includes('fa-redo')) {
                    alert('Chamado reaberto!');
                }
            });
        });