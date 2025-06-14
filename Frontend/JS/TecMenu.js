
               // Função para abrir o popup de visualização
        function setupViewPopup() {
            // Selecionar elementos necessários
            const modal = document.getElementById('ticket-modal');
            const closeBtn = document.querySelector('.close-modal');
            const viewBtns = document.querySelectorAll('.view-btn');
            
            // Função para abrir o modal
            function openModal(ticketId) {
                // Atualizar o ID do chamado no modal
                const ticketIdElement = modal.querySelector('.ticket-id');
                if (ticketIdElement) {
                    ticketIdElement.textContent = `#${ticketId}`;
                }
                
                // Exibir o modal
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
            
            // Função para fechar o modal
            function closeModal() {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
            
            // Adicionar event listeners para os botões de visualização
            viewBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const ticketId = this.getAttribute('data-id');
                    openModal(ticketId);
                });
            });
            
            // Adicionar event listener para o botão de fechar
            closeBtn.addEventListener('click', closeModal);
            
            // Fechar o modal ao clicar fora do conteúdo
            window.addEventListener('click', function(event) {
                if (event.target === modal) {
                    closeModal();
                }
            });
        }
        
        // Chamar a função de configuração quando o DOM estiver carregado
        document.addEventListener('DOMContentLoaded', setupViewPopup);

        
        // Edit panel functionality
        const editPanel = document.getElementById('edit-panel');
        const closeEditBtn = document.querySelector('.close-edit');
        const cancelEditBtn = document.getElementById('cancel-edit');
        const editForm = document.getElementById('edit-ticket-form');
        const resolveBtn = document.getElementById('resolve-btn');
        
        // Report buttons
        const reportBtns = document.querySelectorAll('.report-btn');
        
        // Open edit panel when clicking on a row
        const tableRows = document.querySelectorAll('tbody tr');
        tableRows.forEach(row => {
            row.addEventListener('click', function(e) {
                // Only open if not clicking on action buttons
                if (!e.target.closest('.action-btn') && !e.target.closest('.report-btn')) {
                    editPanel.classList.add('active');
                    
                    // Populate form with data from the row
                    const cells = this.querySelectorAll('td');
                    document.getElementById('edit-title').value = cells[1].textContent;
                    document.getElementById('edit-department').value = cells[2].textContent.toLowerCase();
                    document.getElementById('edit-priority').value = cells[3].querySelector('.priority-badge').textContent.toLowerCase();
                    document.getElementById('edit-status').value = cells[4].querySelector('.status-badge').textContent.toLowerCase().replace(' ', '_');
                    document.getElementById('edit-technician').value = cells[5].textContent === '-' ? '' : 'as';
                }
            });
        });
        
        // Close edit panel
        closeEditBtn.addEventListener('click', function() {
            editPanel.classList.remove('active');
        });
        
        // Cancel edit
        cancelEditBtn.addEventListener('click', function() {
            editPanel.classList.remove('active');
        });
        
        // Submit edit form
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Alterações salvas com sucesso!');
            editPanel.classList.remove('active');
        });
        
        // Mark as resolved
        resolveBtn.addEventListener('click', function() {
            if (confirm('Deseja marcar este chamado como resolvido?')) {
                alert('Chamado marcado como resolvido!');
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Form submission
        document.querySelector('.comment-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const comment = this.querySelector('.comment-input').value;
            if (comment.trim() !== '') {
                alert('Comentário enviado com sucesso!');
                this.querySelector('.comment-input').value = '';
            }
        });
        
        // Report button functionality
        reportBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const technicianName = this.closest('td').querySelector('span').textContent;
                alert(`Gerando relatório para o técnico: ${technicianName}`);
            });
        });


        

