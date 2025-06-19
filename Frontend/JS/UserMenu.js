    // =====================================================
    // GERENCIAMENTO DE DADOS COM LOCALSTORAGE
    // =====================================================
    const USER_EMAIL = "guiornellas1012@gmail.com";
    const TICKETS_KEY = 'helpdesk_tickets';
    const COMMENTS_KEY = 'helpdesk_comments';
    
    // Elementos DOM
    const ticketsContainer = document.getElementById('tickets-container');
    const ticketForm = document.getElementById('ticket-form');
    const ticketModal = document.getElementById('ticket-modal');
    const commentInput = document.getElementById('comment-input');
    const sendCommentBtn = document.getElementById('send-comment');
    const addCommentBtn = document.getElementById('add-comment');
    const closeTicketBtn = document.getElementById('close-ticket');
    const closeModalBtn = document.querySelector('.close-modal');
    const successPopup = document.getElementById('success-popup');
    const closePopupBtn = document.getElementById('close-popup');
    
    // Variáveis globais
    let currentTicketId = null;
    let tickets = [];
    
    // Inicializar dados
    function initializeData() {
        // Carregar tickets do localStorage ou inicializar array vazio
        const storedTickets = localStorage.getItem(TICKETS_KEY);
        tickets = storedTickets ? JSON.parse(storedTickets) : [];
        
        // Renderizar tickets
        renderTickets(tickets);
    }
    
    // Salvar tickets no localStorage
    function saveTickets() {
        localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
    }
    
    // Gerar ID único
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Formatar data
    function formatDate(date) {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    // Formatar data e hora
    function formatDateTime(date) {
        return new Date(date).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // =====================================================
    // FUNÇÕES DE RENDERIZAÇÃO
    // =====================================================
    
    // Renderizar tickets
    function renderTickets(ticketsList) {
        if (ticketsList.length === 0) {
            ticketsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>Você ainda não abriu nenhum chamado</p>
                </div>
            `;
            return;
        }
        
        // Filtrar tickets por status
        const activeTickets = ticketsList.filter(t => t.status === 'ABERTO' || t.status === 'EM_ANDAMENTO');
        const resolvedTickets = ticketsList.filter(t => t.status === 'RESOLVIDO' || t.status === 'FECHADO');
        const canceledTickets = ticketsList.filter(t => t.status === 'CANCELADO');
        
        // Construir HTML
        let html = '';
        
        // Tickets ativos
        if (activeTickets.length > 0) {
            activeTickets.forEach(ticket => {
                html += renderTicketCard(ticket);
            });
        }
        
        // Tickets resolvidos
        if (resolvedTickets.length > 0) {
            html += `<h3 class="section-divider">Chamados Concluídos</h3>`;
            resolvedTickets.forEach(ticket => {
                html += renderTicketCard(ticket);
            });
        }
        
        // Tickets cancelados
        if (canceledTickets.length > 0) {
            html += `<h3 class="section-divider">Chamados Cancelados</h3>`;
            canceledTickets.forEach(ticket => {
                html += renderTicketCard(ticket);
            });
        }
        
        ticketsContainer.innerHTML = html;
    }
    
    // Renderizar cartão de ticket individual
    function renderTicketCard(ticket) {
        const formattedDate = formatDate(ticket.dataAbertura);
        const priorityClass = ticket.prioridade.toLowerCase();
        
        return `
            <div class="ticket-card ${priorityClass}" data-ticket="${ticket.id}">
                <div class="ticket-icon">
                    <i class="${getIconForDepartment(ticket.setor)}"></i>
                </div>
                <div class="ticket-content">
                    <div class="ticket-title">${ticket.titulo}</div>
                    <div class="ticket-meta">
                        <div class="ticket-department"><i class="fas fa-building"></i> ${ticket.setor}</div>
                        <div class="ticket-date"><i class="far fa-calendar"></i> ${formattedDate}</div>
                    </div>
                </div>
                <div class="ticket-priority ${priorityClass}">${getPriorityLabel(ticket.prioridade)}</div>
                <div class="ticket-status ${ticket.status.toLowerCase()}">${getStatusLabel(ticket.status)}</div>
            </div>
        `;
    }
    
    // Abrir modal de detalhes do ticket
    function openTicketModal(ticketId) {
        currentTicketId = ticketId;
        const ticket = tickets.find(t => t.id === ticketId);
        
        if (!ticket) return;
        
        // Preencher informações do modal
        document.getElementById('modal-title').textContent = ticket.titulo;
        document.getElementById('modal-id').textContent = `#${ticket.id}`;
        document.getElementById('modal-department').textContent = ticket.setor;
        document.getElementById('modal-author').textContent = `${ticket.criador} (${ticket.setor})`;
        document.getElementById('modal-date').textContent = formatDate(ticket.dataAbertura);
        document.getElementById('modal-description').textContent = ticket.descricao;
        document.getElementById('modal-priority').textContent = getPriorityLabel(ticket.prioridade);
        document.getElementById('modal-status').textContent = getStatusLabel(ticket.status);
        
        // Atualizar classes
        const priorityEl = document.getElementById('modal-priority');
        priorityEl.className = `ticket-priority ${ticket.prioridade.toLowerCase()}`;
        
        const statusEl = document.getElementById('modal-status');
        statusEl.className = `ticket-status ${ticket.status.toLowerCase()}`;
        
        // Renderizar histórico
        renderTicketHistory(ticket);
        
        // Exibir modal
        ticketModal.style.display = 'block';
    }
    
    // Renderizar histórico do ticket
    function renderTicketHistory(ticket) {
        const historyContainer = document.getElementById('ticket-history');
        
        let html = `
            <h3>Histórico do Chamado</h3>
            <div class="history-item">
                <div class="history-author">Você</div>
                <div class="history-content">Chamado aberto: ${ticket.titulo}</div>
                <div class="history-time">${formatDateTime(ticket.dataAbertura)}</div>
            </div>
        `;
        
        if (ticket.comentarios && ticket.comentarios.length > 0) {
            ticket.comentarios.forEach(comment => {
                html += `
                    <div class="history-item">
                        <div class="history-author">${comment.autor}</div>
                        <div class="history-content">${comment.conteudo}</div>
                        <div class="history-time">${formatDateTime(comment.dataComentario)}</div>
                    </div>
                `;
            });
        }
        
        historyContainer.innerHTML = html;
    }
    
    // Obter ícone para departamento
    function getIconForDepartment(department) {
        switch(department.toLowerCase()) {
            case 'ti': return 'fas fa-laptop';
            case 'rh': return 'fas fa-users';
            case 'financeiro': return 'fas fa-file-invoice-dollar';
            case 'marketing': return 'fas fa-bullhorn';
            case 'vendas': return 'fas fa-shopping-cart';
            default: return 'fas fa-question-circle';
        }
    }
    
    // Obter rótulo de prioridade
    function getPriorityLabel(priority) {
        switch(priority) {
            case 'ALTA': return 'Alta Prioridade';
            case 'MEDIA': return 'Média Prioridade';
            case 'BAIXA': return 'Baixa Prioridade';
            default: return priority;
        }
    }
    
    // Obter rótulo de status
    function getStatusLabel(status) {
        switch(status) {
            case 'ABERTO': return 'Aberto';
            case 'EM_ANDAMENTO': return 'Em andamento';
            case 'RESOLVIDO': return 'Resolvido';
            case 'FECHADO': return 'Fechado';
            case 'CANCELADO': return 'Cancelado';
            default: return status;
        }
    }
    
    // =====================================================
    // FUNÇÕES DE OPERAÇÃO
    // =====================================================
    
    // Criar novo ticket
    function createNewTicket(ticketData) {
        const newTicket = {
            id: generateId(),
            titulo: ticketData.titulo,
            setor: ticketData.setor,
            prioridade: ticketData.prioridade,
            descricao: ticketData.descricao,
            dataAbertura: new Date().toISOString(),
            status: 'ABERTO',
            criador: USER_EMAIL,
            comentarios: []
        };
        
        tickets.push(newTicket);
        saveTickets();
        
        // Mostrar popup de sucesso
        successPopup.style.display = 'flex';
        
        // Renderizar tickets
        renderTickets(tickets);
        
        return newTicket;
    }
    
    // Adicionar comentário ao ticket
    function addCommentToTicket(ticketId, comment) {
        const ticket = tickets.find(t => t.id === ticketId);
        if (!ticket) return;
        
        const newComment = {
            id: generateId(),
            conteudo: comment,
            dataComentario: new Date().toISOString(),
            autor: 'Você'
        };
        
        if (!ticket.comentarios) {
            ticket.comentarios = [];
        }
        
        ticket.comentarios.push(newComment);
        saveTickets();
        
        // Atualizar histórico no modal
        renderTicketHistory(ticket);
        
        // Limpar campo de comentário
        commentInput.value = '';
    }
    
    // Fechar ticket
    function closeTicket(ticketId) {
        const ticket = tickets.find(t => t.id === ticketId);
        if (!ticket) return;
        
        ticket.status = 'FECHADO';
        saveTickets();
        
        // Fechar modal
        ticketModal.style.display = 'none';
        
        // Atualizar lista de tickets
        renderTickets(tickets);
    }
    
    // =====================================================
    // EVENT LISTENERS
    // =====================================================
    document.addEventListener('DOMContentLoaded', () => {
        initializeData();
        
        // Seleção de prioridade
        document.querySelectorAll('.priority-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.priority-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                this.classList.add('active');
                document.getElementById('priority').value = this.dataset.priority;
            });
        });
        
        // Upload de arquivo
        document.getElementById('file-upload').addEventListener('click', function() {
            document.getElementById('file-input').click();
        });
        
        document.getElementById('file-input').addEventListener('change', function(e) {
            if (this.files.length > 0) {
                document.querySelector('.file-info').textContent = this.files[0].name;
            }
        });
        
        // Formulário de novo ticket
        ticketForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Coletar dados do formulário
            const ticketData = {
                titulo: document.getElementById('ticket-title').value,
                setor: document.getElementById('department').value,
                prioridade: document.getElementById('priority').value.toUpperCase(),
                descricao: document.getElementById('description').value
            };
            
            // Validação
            if (!ticketData.titulo || !ticketData.setor || !ticketData.prioridade || !ticketData.descricao) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Criar novo ticket
            createNewTicket(ticketData);
            
            // Resetar formulário
            ticketForm.reset();
            document.querySelectorAll('.priority-option').forEach(opt => {
                opt.classList.remove('active');
            });
            document.querySelector('.file-info').textContent = 'Nenhum arquivo selecionado';
            document.getElementById('priority').value = '';
        });
        
        // Abrir detalhes do ticket
        ticketsContainer.addEventListener('click', (e) => {
            const ticketCard = e.target.closest('.ticket-card');
            if (ticketCard) {
                const ticketId = ticketCard.dataset.ticket;
                openTicketModal(ticketId);
            }
        });
        
        // Fechar modal
        closeModalBtn.addEventListener('click', () => {
            ticketModal.style.display = 'none';
        });
        
        // Fechar modal ao clicar fora
        window.addEventListener('click', (e) => {
            if (e.target === ticketModal) {
                ticketModal.style.display = 'none';
            }
        });
        
        // Enviar comentário
        sendCommentBtn.addEventListener('click', () => {
            const comment = commentInput.value.trim();
            if (!comment) {
                alert('Por favor, digite uma mensagem.');
                return;
            }
            addCommentToTicket(currentTicketId, comment);
        });
        
        // Adicionar comentário (botão alternativo)
        addCommentBtn.addEventListener('click', () => {
            const comment = commentInput.value.trim();
            if (!comment) {
                alert('Por favor, digite uma mensagem.');
                return;
            }
            addCommentToTicket(currentTicketId, comment);
        });
        
        // Fechar ticket
        closeTicketBtn.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja fechar este chamado?')) {
                closeTicket(currentTicketId);
            }
        });
        
        // Fechar popup de sucesso
        closePopupBtn.addEventListener('click', () => {
            successPopup.style.display = 'none';
        });
    });