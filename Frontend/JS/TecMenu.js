   document.addEventListener('DOMContentLoaded', function() {
            // Botões de atribuir técnico
            const assignButtons = document.querySelectorAll('.assign-btn');
            const assignModal = document.getElementById('assign-modal');
            const assignTicketId = document.getElementById('assign-ticket-id');
            const assignTechnician = document.getElementById('assign-technician');
            const assignCancel = document.getElementById('assign-cancel');
            const assignConfirm = document.getElementById('assign-confirm');
            
            // Função para abrir o modal de atribuição
            assignButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const ticketId = this.getAttribute('data-id');
                    assignTicketId.textContent = `#${ticketId}`;
                    assignModal.classList.add('active');
                });
            });
            
            // Fechar modal de atribuição
            document.querySelector('.close-assign').addEventListener('click', function() {
                assignModal.classList.remove('active');
            });
            
            assignCancel.addEventListener('click', function() {
                assignModal.classList.remove('active');
            });
            
            // Confirmar atribuição
            assignConfirm.addEventListener('click', function() {
                const technicianId = assignTechnician.value;
                const ticketId = assignTicketId.textContent.replace('#', '');
                
                if (!technicianId) {
                    alert('Por favor, selecione um técnico.');
                    return;
                }
                
                // Encontrar a linha correspondente na tabela
                const rows = document.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const rowId = row.querySelector('td:first-child').textContent.replace('#', '');
                    if (rowId === ticketId) {
                        const techCell = row.querySelector('td:nth-child(6)');
                        
                        // Atualizar a célula com o nome do técnico
                        let techName;
                        switch(technicianId) {
                            case 'as': techName = 'Ana Silva'; break;
                            case 'co': techName = 'Carlos Oliveira'; break;
                            case 'ps': techName = 'Pedro Santos'; break;
                        }
                        
                        // Atualizar a célula do técnico
                        techCell.innerHTML = `
                            <div class="tech-info">
                                <span class="tech-badge"><i class="fas fa-user"></i> ${techName}</span>
                            </div>
                        `;
                    }
                });
                
                // Fechar o modal
                assignModal.classList.remove('active');
                
                // Resetar o select
                assignTechnician.value = '';
                
                // Mostrar confirmação
                alert(`Técnico atribuído ao chamado #${ticketId} com sucesso!`);
            });
            
            // Fechar o painel de edição
            document.querySelector('.close-edit').addEventListener('click', function() {
                document.getElementById('edit-panel').classList.remove('active');
            });
            
            // Cancelar edição
            document.getElementById('cancel-edit').addEventListener('click', function() {
                document.getElementById('edit-panel').classList.remove('active');
            });
            
            // Botões de visualizar
            document.querySelectorAll('.view-btn').forEach(button => {
                button.addEventListener('click', function() {
                    document.getElementById('ticket-modal').style.display = 'block';
                });
            });
            
            // Fechar modal de visualização
            document.querySelector('.close-modal').addEventListener('click', function() {
                document.getElementById('ticket-modal').style.display = 'none';
            });
            
            // Fechar modal ao clicar fora do conteúdo
            window.addEventListener('click', function(event) {
                if (event.target === assignModal) {
                    assignModal.classList.remove('active');
                }
            });
        });