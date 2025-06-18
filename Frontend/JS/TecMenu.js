 // =====================================================
        // CONFIGURAÇÕES DA API - ESSENCIAIS PARA A INTEGRAÇÃO
        // =====================================================
        const API_BASE_URL = 'http://localhost:8080'; // URL base do backend Java
        const TICKETS_ENDPOINT = '/api/tickets';
        const TECHNICIANS_ENDPOINT = '/api/technicians';
        const STATS_ENDPOINT = '/api/stats';
        const COMMENTS_ENDPOINT = '/api/comments';

        // Elementos DOM
        const ticketsBody = document.getElementById('tickets-body');
        const editPanel = document.getElementById('edit-panel');
        const editForm = document.getElementById('edit-ticket-form');
        const assignModal = document.getElementById('assign-modal');
        const ticketModal = document.getElementById('ticket-modal');
        const commentForm = document.getElementById('comment-form');
        const searchBox = document.getElementById('search-box');
        const filterSelect = document.getElementById('filter-select');
        
        // Variáveis globais
        let currentTicketId = null;
        let tickets = [];
        let technicians = [];

        // =====================================================
        // FUNÇÕES DE COMUNICAÇÃO COM A API (BACKEND JAVA)
        // =====================================================

        /**
         * Busca dados de estatísticas do backend
         */
        async function fetchStats() {
            try {
                const response = await fetch(`${API_BASE_URL}${STATS_ENDPOINT}`);
                if (!response.ok) throw new Error('Erro ao buscar estatísticas');
                
                const stats = await response.json();
                
                // Atualiza os valores no dashboard
                document.getElementById('open-tickets').textContent = stats.open || 0;
                document.getElementById('progress-tickets').textContent = stats.progress || 0;
                document.getElementById('resolved-tickets').textContent = stats.resolved || 0;
                document.getElementById('overdue-tickets').textContent = stats.overdue || 0;
                
            } catch (error) {
                console.error('Erro ao buscar estatísticas:', error);
                alert('Falha ao carregar dados do dashboard: ' + error.message);
            }
        }

        /**
         * Busca lista de técnicos do backend
         */
        async function fetchTechnicians() {
            try {
                const response = await fetch(`${API_BASE_URL}${TECHNICIANS_ENDPOINT}`);
                if (!response.ok) throw new Error('Erro ao buscar técnicos');
                
                technicians = await response.json();
                
                // Preenche os selects com os técnicos
                const editTechnicianSelect = document.getElementById('edit-technician');
                const assignTechnicianSelect = document.getElementById('assign-technician');
                
                editTechnicianSelect.innerHTML = '<option value="">- Selecionar -</option>';
                assignTechnicianSelect.innerHTML = '<option value="">- Selecionar -</option>';
                
                technicians.forEach(tech => {
                    const option = document.createElement('option');
                    option.value = tech.id;
                    option.textContent = tech.name;
                    
                    editTechnicianSelect.appendChild(option.cloneNode(true));
                    assignTechnicianSelect.appendChild(option);
                });
                
            } catch (error) {
                console.error('Erro ao buscar técnicos:', error);
                alert('Falha ao carregar lista de técnicos: ' + error.message);
            }
        }

        /**
         * Busca lista de chamados do backend
         */
        async function fetchTickets() {
            try {
                const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}`);
                if (!response.ok) throw new Error('Erro ao buscar chamados');
                
                tickets = await response.json();
                renderTickets(tickets);
                
            } catch (error) {
                console.error('Erro ao buscar chamados:', error);
                alert('Falha ao carregar lista de chamados: ' + error.message);
            }
        }

        /**
         * Busca detalhes de um chamado específico
         * @param {number} ticketId - ID do chamado
         */
        async function fetchTicketDetails(ticketId) {
            try {
                const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}/${ticketId}`);
                if (!response.ok) throw new Error('Erro ao buscar detalhes do chamado');
                
                return await response.json();
                
            } catch (error) {
                console.error('Erro ao buscar detalhes do chamado:', error);
                alert('Falha ao carregar detalhes do chamado: ' + error.message);
                return null;
            }
        }

        /**
         * Atualiza um chamado no backend
         * @param {object} ticketData - Dados do chamado
         */
        async function updateTicket(ticketData) {
            try {
                const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}/${ticketData.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(ticketData)
                });
                
                if (!response.ok) throw new Error('Erro ao atualizar chamado');
                
                const updatedTicket = await response.json();
                alert('Chamado atualizado com sucesso!');
                
                // Atualiza a lista de chamados
                await fetchTickets();
                await fetchStats();
                
                return updatedTicket;
                
            } catch (error) {
                console.error('Erro ao atualizar chamado:', error);
                alert('Falha ao atualizar chamado: ' + error.message);
                return null;
            }
        }

        /**
         * Atribui um técnico a um chamado
         * @param {number} ticketId - ID do chamado
         * @param {number} technicianId - ID do técnico
         */
        async function assignTechnician(ticketId, technicianId) {
            try {
                const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}/${ticketId}/assign`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ technicianId })
                });
                
                if (!response.ok) throw new Error('Erro ao atribuir técnico');
                
                const result = await response.json();
                alert('Técnico atribuído com sucesso!');
                
                // Atualiza a lista de chamados
                await fetchTickets();
                
                return result;
                
            } catch (error) {
                console.error('Erro ao atribuir técnico:', error);
                alert('Falha ao atribuir técnico: ' + error.message);
                return null;
            }
        }

        /**
         * Adiciona um comentário a um chamado
         * @param {number} ticketId - ID do chamado
         * @param {string} comment - Comentário a ser adicionado
         * @param {number} userId - ID do usuário que está comentando
         */
        async function addComment(ticketId, comment, userId) {
            try {
                const response = await fetch(`${API_BASE_URL}${COMMENTS_ENDPOINT}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        ticketId, 
                        comment, 
                        userId 
                    })
                });
                
                if (!response.ok) throw new Error('Erro ao adicionar comentário');
                
                const newComment = await response.json();
                alert('Comentário adicionado com sucesso!');
                
                return newComment;
                
            } catch (error) {
                console.error('Erro ao adicionar comentário:', error);
                alert('Falha ao adicionar comentário: ' + error.message);
                return null;
            }
        }

        // =====================================================
        // FUNÇÕES DE RENDERIZAÇÃO DA INTERFACE
        // =====================================================

        /**
         * Renderiza a lista de chamados na tabela
         * @param {array} tickets - Lista de chamados
         */
        function renderTickets(tickets) {
            ticketsBody.innerHTML = '';
            
            tickets.forEach(ticket => {
                const row = document.createElement('tr');
                
                // Determina as classes CSS para prioridade e status
                const priorityClass = `priority-${ticket.priority}`;
                const statusClass = `status-${ticket.status}`;
                
                // Formata a data
                const formattedDate = new Date(ticket.createdAt).toLocaleDateString('pt-BR');
                
                // Encontra o nome do técnico
                const technician = technicians.find(t => t.id === ticket.technicianId);
                const technicianName = technician ? technician.name : 'Sem técnico';
                const technicianIcon = technician ? '<i class="fas fa-user"></i>' : '<i class="fas fa-plus-circle"></i>';
                
                row.innerHTML = `
                    <td>#${ticket.id}</td>
                    <td>${ticket.title}</td>
                    <td>${ticket.department}</td>
                    <td><span class="priority-badge ${priorityClass}">${getPriorityLabel(ticket.priority)}</span></td>
                    <td><span class="status-badge ${statusClass}">${getStatusLabel(ticket.status)}</span></td>
                    <td>
                        <div class="tech-info">
                            <span class="tech-badge">${technicianIcon} ${technicianName}</span>
                        </div>
                    </td>
                    <td>${formattedDate}</td>
                    <td>
                        <div class="actions-container">
                            <button class="action-btn assign-btn" title="Atribuir técnico" data-id="${ticket.id}">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="action-btn view-btn" title="Visualizar" data-id="${ticket.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </td>
                `;
                
                ticketsBody.appendChild(row);
            });
            
            // Adiciona event listeners aos botões
            document.querySelectorAll('.assign-btn').forEach(btn => {
                btn.addEventListener('click', () => openAssignModal(btn.dataset.id));
            });
            
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.addEventListener('click', () => openTicketModal(btn.dataset.id));
            });
        }

        /**
         * Abre o modal de detalhes do chamado
         * @param {number} ticketId - ID do chamado
         */
        async function openTicketModal(ticketId) {
            currentTicketId = ticketId;
            const ticket = await fetchTicketDetails(ticketId);
            
            if (!ticket) return;
            
            // Preenche os dados do modal
            document.getElementById('modal-title').textContent = ticket.title;
            document.getElementById('modal-id').textContent = `#${ticket.id}`;
            document.getElementById('modal-department').textContent = `Departamento: ${ticket.department}`;
            document.getElementById('modal-opened-by').textContent = `Aberto por: ${ticket.openedBy}`;
            document.getElementById('modal-date').textContent = `Data: ${new Date(ticket.createdAt).toLocaleDateString('pt-BR')}`;
            document.getElementById('modal-description').textContent = ticket.description;
            document.getElementById('modal-priority').textContent = getPriorityLabel(ticket.priority);
            document.getElementById('modal-status').textContent = getStatusLabel(ticket.status);
            
            // Atualiza classes de status
            document.getElementById('modal-priority').className = `status-value status-priority priority-${ticket.priority}`;
            document.getElementById('modal-status').className = `status-value status-${ticket.status}`;
            
            // Renderiza anexos
            renderAttachments(ticket.attachments);
            
            // Renderiza histórico
            renderHistory(ticket.history);
            
            // Exibe o modal
            ticketModal.style.display = 'block';
        }

        /**
         * Renderiza os anexos no modal
         * @param {array} attachments - Lista de anexos
         */
        function renderAttachments(attachments) {
            const container = document.getElementById('modal-attachments');
            container.innerHTML = '';
            
            if (!attachments || attachments.length === 0) {
                container.innerHTML = '<p>Nenhum anexo disponível</p>';
                return;
            }
            
            attachments.forEach(attachment => {
                const item = document.createElement('div');
                item.className = 'attachment-item';
                
                // Determina o ícone com base no tipo de arquivo
                let iconClass = 'fas fa-file';
                if (attachment.type.includes('image')) iconClass = 'fas fa-file-image';
                else if (attachment.type.includes('pdf')) iconClass = 'fas fa-file-pdf';
                else if (attachment.type.includes('word')) iconClass = 'fas fa-file-word';
                
                item.innerHTML = `
                    <i class="${iconClass} fa-3x" style="color: #6c757d;"></i>
                    <div class="attachment-item">
                        <span>${attachment.name}</span>
                    </div>
                `;
                
                container.appendChild(item);
            });
        }

        /**
         * Renderiza o histórico do chamado
         * @param {array} history - Lista de eventos no histórico
         */
        function renderHistory(history) {
            const container = document.getElementById('history-container');
            container.innerHTML = '';
            
            if (!history || history.length === 0) {
                container.innerHTML = '<p>Nenhum histórico disponível</p>';
                return;
            }
            
            history.forEach(event => {
                const item = document.createElement('div');
                item.className = 'history-item';
                
                const formattedDate = new Date(event.timestamp).toLocaleString('pt-BR');
                
                item.innerHTML = `
                    <div class="history-avatar">${event.userInitials}</div>
                    <div class="history-content">
                        <div class="history-header">
                            <div>
                                <span class="history-user">${event.userName}</span>
                                <span class="history-role">(${event.userRole})</span>
                            </div>
                            <span class="history-date">${formattedDate}</span>
                        </div>
                        <div class="history-message">
                            ${event.message}
                        </div>
                    </div>
                `;
                
                container.appendChild(item);
            });
        }

        /**
         * Abre o modal de atribuição de técnico
         * @param {number} ticketId - ID do chamado
         */
        function openAssignModal(ticketId) {
            document.getElementById('assign-ticket-id').textContent = `#${ticketId}`;
            currentTicketId = ticketId;
            assignModal.classList.add('active');
        }

        /**
         * Abre o painel de edição de chamado
         * @param {number} ticketId - ID do chamado
         */
        async function openEditPanel(ticketId) {
            const ticket = await fetchTicketDetails(ticketId);
            
            if (!ticket) return;
            
            // Preenche o formulário
            document.getElementById('edit-ticket-id').value = ticket.id;
            document.getElementById('edit-title').value = ticket.title;
            document.getElementById('edit-priority').value = ticket.priority;
            document.getElementById('edit-status').value = ticket.status;
            document.getElementById('edit-technician').value = ticket.technicianId || '';
            document.getElementById('edit-department').value = ticket.department;
            document.getElementById('edit-description').value = ticket.description;
            
            // Exibe o painel
            editPanel.classList.add('active');
        }

        // =====================================================
        // FUNÇÕES AUXILIARES
        // =====================================================

        /**
         * Retorna o texto correspondente ao código de prioridade
         * @param {string} priority - Código da prioridade
         * @returns {string} Texto da prioridade
         */
        function getPriorityLabel(priority) {
            switch(priority) {
                case 'high': return 'Alta';
                case 'medium': return 'Média';
                case 'low': return 'Baixa';
                default: return priority;
            }
        }

        /**
         * Retorna o texto correspondente ao código de status
         * @param {string} status - Código do status
         * @returns {string} Texto do status
         */
        function getStatusLabel(status) {
            switch(status) {
                case 'open': return 'Aberto';
                case 'progress': return 'Em Andamento';
                case 'resolved': return 'Resolvido';
                case 'overdue': return 'Atrasado';
                default: return status;
            }
        }

        // =====================================================
        // EVENT LISTENERS E INICIALIZAÇÃO
        // =====================================================

        // Inicialização
        document.addEventListener('DOMContentLoaded', async () => {
            // Carrega dados iniciais
            await fetchTechnicians();
            await fetchTickets();
            await fetchStats();
            
            // Event listeners
            setupEventListeners();
        });

        function setupEventListeners() {
            // Fechar modais
            document.querySelector('.close-modal').addEventListener('click', () => {
                ticketModal.style.display = 'none';
            });
            
            document.querySelector('.close-assign').addEventListener('click', () => {
                assignModal.classList.remove('active');
            });
            
            document.getElementById('assign-cancel').addEventListener('click', () => {
                assignModal.classList.remove('active');
            });
            
            document.querySelector('.close-edit').addEventListener('click', () => {
                editPanel.classList.remove('active');
            });
            
            document.getElementById('cancel-edit').addEventListener('click', () => {
                editPanel.classList.remove('active');
            });
            
            // Fechar modal ao clicar fora
            window.addEventListener('click', (event) => {
                if (event.target === assignModal) {
                    assignModal.classList.remove('active');
                }
                if (event.target === ticketModal) {
                    ticketModal.style.display = 'none';
                }
            });
            
            // Atribuir técnico
            document.getElementById('assign-confirm').addEventListener('click', async () => {
                const technicianId = document.getElementById('assign-technician').value;
                
                if (!technicianId) {
                    alert('Por favor, selecione um técnico.');
                    return;
                }
                
                await assignTechnician(currentTicketId, technicianId);
                assignModal.classList.remove('active');
            });
            
            // Salvar edição de chamado
            editForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const ticketData = {
                    id: document.getElementById('edit-ticket-id').value,
                    title: document.getElementById('edit-title').value,
                    priority: document.getElementById('edit-priority').value,
                    status: document.getElementById('edit-status').value,
                    technicianId: document.getElementById('edit-technician').value,
                    department: document.getElementById('edit-department').value,
                    description: document.getElementById('edit-description').value
                };
                
                await updateTicket(ticketData);
                editPanel.classList.remove('active');
            });
            
            // Adicionar comentário
            commentForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const comment = document.getElementById('comment-input').value;
                // ID do usuário logado (deve vir da autenticação)
                const userId = 1; 
                
                if (!comment.trim()) {
                    alert('Por favor, digite um comentário.');
                    return;
                }
                
                await addComment(currentTicketId, comment, userId);
                document.getElementById('comment-input').value = '';
                
                // Recarrega os detalhes do chamado para atualizar o histórico
                await openTicketModal(currentTicketId);
            });
            
            // Marcar como resolvido
            document.getElementById('resolve-btn').addEventListener('click', async () => {
                const ticketData = {
                    id: currentTicketId,
                    status: 'resolved'
                };
                
                await updateTicket(ticketData);
                ticketModal.style.display = 'none';
            });
            
            // Filtro e busca
            searchBox.addEventListener('input', filterTickets);
            filterSelect.addEventListener('change', filterTickets);
        }

        /**
         * Filtra os chamados com base na busca e filtro
         */
        function filterTickets() {
            const searchTerm = searchBox.value.toLowerCase();
            const filterValue = filterSelect.value;
            
            const filteredTickets = tickets.filter(ticket => {
                // Filtro por status
                if (filterValue !== 'all' && ticket.status !== filterValue) {
                    return false;
                }
                
                // Busca por termo
                if (searchTerm) {
                    return (
                        ticket.title.toLowerCase().includes(searchTerm) ||
                        ticket.description.toLowerCase().includes(searchTerm) ||
                        ticket.id.toString().includes(searchTerm)
                    );
                }
                
                return true;
            });
            
            renderTickets(filteredTickets);
        }