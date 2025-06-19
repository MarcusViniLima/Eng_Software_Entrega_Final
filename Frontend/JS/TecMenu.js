        // =====================================================
        // DADOS DE EXEMPLO (CACHE LOCAL)
        // =====================================================
        const technicians = [
            { id: 'as', name: 'Ana Silva' },
            { id: 'co', name: 'Carlos Oliveira' },
            { id: 'ps', name: 'Pedro Santos' }
        ];

        let tickets = [
            {
                id: 1025,
                title: 'Problema com impressora no setor RH',
                department: 'RH',
                priority: 'high',
                status: 'progress',
                technicianId: 'as',
                createdAt: '2025-06-19',
                description: 'Impressora não está imprimindo documentos corretamente.',
                openedBy: 'Guilherme Ornellas',
                attachments: [],
                history: [
                    { 
                        userName: 'Guilherme Ornellas', 
                        userRole: 'RH', 
                        userInitials: 'GO', 
                        message: 'Chamado aberto: Problema com impressora no setor RH',
                        timestamp: '2025-06-019 09:15'
                    },
                    { 
                        userName: 'Ana Silva', 
                        userRole: 'Técnico TI', 
                        userInitials: 'AS', 
                        message: 'Verifiquei o problema e substituí o cartucho de toner.',
                        timestamp: '2025-06-019 11:30'
                    }
                ]
            },
            {
                id: 1024,
                title: 'Wi-Fi do Financeiro está lento',
                department: 'TI',
                priority: 'high',
                status: 'open',
                technicianId: null,
                createdAt: '2025-06-02',
                description: 'Desde ontem à tarde, a conexão Wi-Fi no setor financeiro está extremamente lenta, dificultando o acesso aos sistemas.',
                openedBy: 'João Dias',
                attachments: [
                    { name: 'velocidade-teste.png', type: 'image/png' }
                ],
                history: [
                    { 
                        userName: 'João Dias', 
                        userRole: 'RH', 
                        userInitials: 'JD', 
                        message: 'Chamado aberto: Wi-Fi do Financeiro está lento',
                        timestamp: '2025-06-02 09:15'
                    }
                ]
            },
            {
                id: 1022,
                title: 'Problema com acesso ao servidor',
                department: 'TI',
                priority: 'high',
                status: 'resolved',
                technicianId: 'co',
                createdAt: '2025-06-01',
                description: 'Não consigo acessar os arquivos no servidor principal.',
                openedBy: 'Carlos Mendes',
                attachments: [],
                history: [
                    { 
                        userName: 'Carlos Mendes', 
                        userRole: 'Financeiro', 
                        userInitials: 'CM', 
                        message: 'Chamado aberto: Problema com acesso ao servidor',
                        timestamp: '2025-06-01 10:00'
                    },
                    { 
                        userName: 'Carlos Oliveira', 
                        userRole: 'Técnico TI', 
                        userInitials: 'CO', 
                        message: 'Reiniciei o serviço de arquivos e o acesso foi restabelecido.',
                        timestamp: '2025-06-01 11:45'
                    }
                ]
            },
            {
                id: 1019,
                title: 'Teclado não funciona',
                department: 'Operações',
                priority: 'low',
                status: 'resolved',
                technicianId: 'ps',
                createdAt: '2025-05-31',
                description: 'Teclado do computador da estação 12 parou de funcionar.',
                openedBy: 'Fernanda Costa',
                attachments: [],
                history: [
                    { 
                        userName: 'Fernanda Costa', 
                        userRole: 'Operações', 
                        userInitials: 'FC', 
                        message: 'Chamado aberto: Teclado não funciona',
                        timestamp: '2025-05-31 14:20'
                    },
                    { 
                        userName: 'Pedro Santos', 
                        userRole: 'Técnico TI', 
                        userInitials: 'PS', 
                        message: 'Substituí o teclado por um novo.',
                        timestamp: '2025-05-31 15:10'
                    }
                ]
            }
        ];

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
        let currentUser = { id: 'as', name: 'Ana Silva' };

        // =====================================================
        // FUNÇÕES DE SIMULAÇÃO DE API (CACHE LOCAL)
        // =====================================================

        function fetchStats() {
            const stats = {
                open: tickets.filter(t => t.status === 'open').length,
                progress: tickets.filter(t => t.status === 'progress').length,
                resolved: tickets.filter(t => t.status === 'resolved').length,
                overdue: tickets.filter(t => t.status === 'overdue').length
            };
            
            // Atualiza os valores no dashboard
            document.getElementById('open-tickets').textContent = stats.open;
            document.getElementById('progress-tickets').textContent = stats.progress;
            document.getElementById('resolved-tickets').textContent = stats.resolved;
            document.getElementById('overdue-tickets').textContent = stats.overdue;
        }

        function fetchTicketDetails(ticketId) {
            return tickets.find(t => t.id == ticketId);
        }

        function updateTicket(updatedTicket) {
            const index = tickets.findIndex(t => t.id == updatedTicket.id);
            if (index !== -1) {
                tickets[index] = { ...tickets[index], ...updatedTicket };
                
                // Adiciona histórico de atualização
                const historyEntry = {
                    userName: currentUser.name,
                    userRole: 'Técnico TI',
                    userInitials: getInitials(currentUser.name),
                    message: 'Chamado atualizado',
                    timestamp: new Date().toISOString()
                };
                
                tickets[index].history.push(historyEntry);
                
                alert('Chamado atualizado com sucesso!');
                return true;
            }
            return false;
        }

        function assignTechnician(ticketId, technicianId) {
            const ticket = tickets.find(t => t.id == ticketId);
            if (ticket) {
                ticket.technicianId = technicianId;
                
                // Adiciona histórico de atribuição
                const technician = technicians.find(t => t.id === technicianId);
                const historyEntry = {
                    userName: currentUser.name,
                    userRole: 'Técnico TI',
                    userInitials: getInitials(currentUser.name),
                    message: `Atribuído para ${technician ? technician.name : 'técnico'}`,
                    timestamp: new Date().toISOString()
                };
                
                ticket.history.push(historyEntry);
                
                alert('Técnico atribuído com sucesso!');
                return true;
            }
            return false;
        }

        function addComment(ticketId, comment) {
            const ticket = tickets.find(t => t.id == ticketId);
            if (ticket) {
                const historyEntry = {
                    userName: currentUser.name,
                    userRole: 'Técnico TI',
                    userInitials: getInitials(currentUser.name),
                    message: comment,
                    timestamp: new Date().toISOString()
                };
                
                ticket.history.push(historyEntry);
                alert('Comentário adicionado com sucesso!');
                return true;
            }
            return false;
        }

        // =====================================================
        // FUNÇÕES DE RENDERIZAÇÃO
        // =====================================================

        function renderTickets(ticketsToRender) {
            ticketsBody.innerHTML = '';
            
            ticketsToRender.forEach(ticket => {
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

        function openTicketModal(ticketId) {
            currentTicketId = ticketId;
            const ticket = fetchTicketDetails(ticketId);
            
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
                    <div>
                        <span>${attachment.name}</span>
                    </div>
                `;
                
                container.appendChild(item);
            });
        }

        function renderHistory(history) {
            const container = document.getElementById('history-container');
            container.innerHTML = '';
            
            if (!history || history.length === 0) {
                container.innerHTML = '<p>Nenhum histórico disponível</p>';
                return;
            }
            
            // Ordena o histórico do mais recente para o mais antigo
            const sortedHistory = [...history].sort((a, b) => 
                new Date(b.timestamp) - new Date(a.timestamp)
            );
            
            sortedHistory.forEach(event => {
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

        function openAssignModal(ticketId) {
            document.getElementById('assign-ticket-id').textContent = `#${ticketId}`;
            currentTicketId = ticketId;
            assignModal.classList.add('active');
        }

        function openEditPanel(ticketId) {
            const ticket = fetchTicketDetails(ticketId);
            
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

        function getPriorityLabel(priority) {
            switch(priority) {
                case 'high': return 'Alta';
                case 'medium': return 'Média';
                case 'low': return 'Baixa';
                default: return priority;
            }
        }

        function getStatusLabel(status) {
            switch(status) {
                case 'open': return 'Aberto';
                case 'progress': return 'Em Andamento';
                case 'resolved': return 'Resolvido';
                case 'overdue': return 'Atrasado';
                default: return status;
            }
        }

        function getInitials(name) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        }

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
                        ticket.id.toString().includes(searchTerm) ||
                        (ticket.technicianId && technicians.find(t => t.id === ticket.technicianId)?.name.toLowerCase().includes(searchTerm)
                    ));
                }
                
                return true;
            });
            
            renderTickets(filteredTickets);
        }

        // =====================================================
        // INICIALIZAÇÃO E EVENT LISTENERS
        // =====================================================

        document.addEventListener('DOMContentLoaded', () => {
            // Carrega dados iniciais
            fetchStats();
            renderTickets(tickets);
            
            // Configura event listeners
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
            document.getElementById('assign-confirm').addEventListener('click', () => {
                const technicianId = document.getElementById('assign-technician').value;
                
                if (!technicianId) {
                    alert('Por favor, selecione um técnico.');
                    return;
                }
                
                if (assignTechnician(currentTicketId, technicianId)) {
                    renderTickets(tickets);
                    fetchStats();
                    assignModal.classList.remove('active');
                }
            });
            
            // Salvar edição de chamado
            editForm.addEventListener('submit', (e) => {
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
                
                if (updateTicket(ticketData)) {
                    renderTickets(tickets);
                    fetchStats();
                    editPanel.classList.remove('active');
                }
            });
            
            // Adicionar comentário
            commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const comment = document.getElementById('comment-input').value;
                
                if (!comment.trim()) {
                    alert('Por favor, digite um comentário.');
                    return;
                }
                
                if (addComment(currentTicketId, comment)) {
                    document.getElementById('comment-input').value = '';
                    // Atualiza o histórico no modal
                    const ticket = fetchTicketDetails(currentTicketId);
                    renderHistory(ticket.history);
                }
            });
            
            // Marcar como resolvido
            document.getElementById('resolve-btn').addEventListener('click', () => {
                const ticketData = {
                    id: currentTicketId,
                    status: 'resolved'
                };
                
                if (updateTicket(ticketData)) {
                    renderTickets(tickets);
                    fetchStats();
                    ticketModal.style.display = 'none';
                }
            });
            
            // Filtro e busca
            searchBox.addEventListener('input', filterTickets);
            filterSelect.addEventListener('change', filterTickets);
            
            // Botão para abrir painel de edição (exemplo)
            document.querySelector('.user-info').addEventListener('dblclick', () => {
                openEditPanel(1024);
            });
        }