     // Função para abrir o modal com os dados do chamado
        function openTicketModal(ticketId) {
            const modal = document.getElementById('ticket-modal');
            
            // Aqui normalmente você buscaria os dados do chamado em um banco de dados
            // Para este exemplo, vamos definir manualmente os dados com base no ID
            if (ticketId === '1024') {
                document.getElementById('modal-title').textContent = 'Wi-Fi do Financeiro está lento';
                document.getElementById('modal-id').textContent = '#1024';
                document.getElementById('modal-department').textContent = 'TI';
                document.getElementById('modal-author').textContent = 'João Dias (RH)';
                document.getElementById('modal-date').textContent = '02/06/2025';
                document.getElementById('modal-description').textContent = 'Desde ontem à tarde, a conexão Wi-Fi no setor financeiro está extremamente lenta, dificultando o acesso aos sistemas. Vários computadores apresentam o mesmo problema. Já tentei reiniciar o roteador, mas o problema persiste.';
                document.getElementById('modal-priority').textContent = 'Alta Prioridade';
                document.getElementById('modal-status').textContent = 'Aberto';
                document.getElementById('modal-status').className = 'ticket-status open';
            } else if (ticketId === '1025') {
                document.getElementById('modal-title').textContent = 'Problema com impressora no setor RH';
                document.getElementById('modal-id').textContent = '#1025';
                document.getElementById('modal-department').textContent = 'RH';
                document.getElementById('modal-author').textContent = 'Maria Oliveira (RH)';
                document.getElementById('modal-date').textContent = '02/06/2025';
                document.getElementById('modal-description').textContent = 'A impressora do setor de RH parou de funcionar repentinamente. Já verifiquei as conexões e o papel, mas o problema persiste. Mensagem de erro: "Falha de comunicação".';
                document.getElementById('modal-priority').textContent = 'Alta Prioridade';
                document.getElementById('modal-status').textContent = 'Em andamento';
                document.getElementById('modal-status').className = 'ticket-status in-progress';
            } else if (ticketId === '1023') {
                document.getElementById('modal-title').textContent = 'Computador não liga';
                document.getElementById('modal-id').textContent = '#1023';
                document.getElementById('modal-department').textContent = 'TI';
                document.getElementById('modal-author').textContent = 'Carlos Santos (Marketing)';
                document.getElementById('modal-date').textContent = '01/06/2025';
                document.getElementById('modal-description').textContent = 'O computador da estação 3 no setor de Marketing não liga. Ao pressionar o botão power, nenhuma luz acende. Já verifiquei a tomada e o cabo de energia.';
                document.getElementById('modal-priority').textContent = 'Média Prioridade';
                document.getElementById('modal-status').textContent = 'Resolvido';
                document.getElementById('modal-status').className = 'ticket-status resolved';
            }
            
            modal.style.display = 'block';
        }
        
        // Fechar modal quando clicar no X
        document.querySelector('.close-modal').addEventListener('click', function() {
            document.getElementById('ticket-modal').style.display = 'none';
        });
        
        // Fechar modal quando clicar fora da área de conteúdo
        window.addEventListener('click', function(event) {
            const modal = document.getElementById('ticket-modal');
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Adicionar evento de clique aos tickets
        document.querySelectorAll('.ticket-card').forEach(ticket => {
            ticket.addEventListener('click', function() {
                const ticketId = this.getAttribute('data-ticket');
                openTicketModal(ticketId);
            });
        });
        
        // Seleção de prioridade
        document.querySelectorAll('.priority-option').forEach(option => {
            option.addEventListener('click', function() {
                // Remover classe ativa de todos
                document.querySelectorAll('.priority-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                
                // Adicionar classe ativa ao selecionado
                this.classList.add('active');
                
                // Atualizar campo oculto
                document.getElementById('priority').value = this.getAttribute('data-priority');
            });
        });
        
        // Simulação de upload de arquivo
        document.getElementById('file-upload').addEventListener('click', function() {
            document.getElementById('file-input').click();
        });
        
        document.getElementById('file-input').addEventListener('change', function(e) {
            if (this.files.length > 0) {
                document.querySelector('.file-info').textContent = this.files[0].name;
            }
        });
        
        // Prevenir envio do formulário para demonstração
        document.getElementById('ticket-form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Chamado aberto com sucesso!');
            this.reset();
            document.querySelectorAll('.priority-option').forEach(opt => {
                opt.classList.remove('active');
            });
            document.querySelector('.file-info').textContent = 'Nenhum arquivo selecionado';
        });