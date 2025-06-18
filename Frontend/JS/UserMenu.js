// =====================================================
// CONFIGURAÇÕES DA API - ATUALIZADAS PARA O JAVA
// =====================================================
const API_BASE_URL = 'http://localhost:8080';
const TICKETS_ENDPOINT = '/helpdesk';
const USER_EMAIL = "usuario@empresa.com"; // Deve vir da autenticação

// Elementos DOM
const ticketsContainer = document.getElementById('tickets-container');
const ticketForm = document.getElementById('ticket-form');
const ticketModal = document.getElementById('ticket-modal');
const commentInput = document.getElementById('comment-input');
const sendCommentBtn = document.getElementById('send-comment');
const addCommentBtn = document.getElementById('add-comment');
const closeTicketBtn = document.getElementById('close-ticket');

// Variáveis globais
let currentTicketId = null;
let tickets = [];

// =====================================================
// FUNÇÕES DE COMUNICAÇÃO COM A API (AJUSTADAS PARA JAVA)
// =====================================================

/**
 * Busca os chamados do usuário logado
 */
async function fetchUserTickets() {
    try {
        // Usa o endpoint por criador com email
        const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}/criador/${encodeURIComponent(USER_EMAIL)}`);
        if (!response.ok) throw new Error('Erro ao buscar chamados');
        
        const ticketsFromServer = await response.json();
        
        // Converte para o formato esperado pelo frontend
        tickets = ticketsFromServer.map(ticket => ({
            id: ticket.id,
            titulo: ticket.titulo,
            setor: ticket.setor,
            prioridade: ticket.prioridade,
            descricao: ticket.descricao,
            dataAbertura: ticket.dataAbertura,
            status: ticket.status,
            criador: ticket.criador,
            fileName: ticket.fileName,
            anexos: ticket.fileName ? [{ name: ticket.fileName }] : []
        }));
        
        renderTickets(tickets);
        
    } catch (error) {
        console.error('Erro ao buscar chamados:', error);
        ticketsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i> Falha ao carregar chamados: ${error.message}
            </div>
        `;
    }
}

/**
 * Busca detalhes de um chamado específico
 * @param {string} ticketId - ID do chamado (UUID)
 */
async function fetchTicketDetails(ticketId) {
    try {
        const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}/${ticketId}`);
        if (!response.ok) throw new Error('Erro ao buscar detalhes do chamado');
        
        const ticket = await response.json();
        
        // Busca comentários associados
        const comentarios = await fetchComments(ticketId);
        
        // Formata para o frontend
        return {
            id: ticket.id,
            titulo: ticket.titulo,
            setor: ticket.setor,
            prioridade: ticket.prioridade,
            descricao: ticket.descricao,
            dataAbertura: ticket.dataAbertura,
            status: ticket.status,
            criador: ticket.criador,
            fileName: ticket.fileName,
            anexos: ticket.fileName ? [{ name: ticket.fileName }] : [],
            comentarios: comentarios.map(c => ({
                id: c.id,
                conteudo: c.conteudo,
                dataComentario: c.dataComentario,
                autor: c.autor || "Anônimo"
            }))
        };
        
    } catch (error) {
        console.error('Erro ao buscar detalhes do chamado:', error);
        alert('Falha ao carregar detalhes do chamado: ' + error.message);
        return null;
    }
}

/**
 * Busca comentários de um chamado
 * @param {string} ticketId - ID do chamado
 */
async function fetchComments(ticketId) {
    try {
        const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}/${ticketId}/comentarios`);
        if (!response.ok) throw new Error('Erro ao buscar comentários');
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar comentários:', error);
        return [];
    }
}

/**
 * Cria um novo chamado
 * @param {object} ticketData - Dados do novo chamado
 * @param {File} [file] - Arquivo anexo (opcional)
 */
async function createNewTicket(ticketData, file) {
    try {
        const formData = new FormData();
        
        // Adiciona dados do chamado
        formData.append('helpdeskModel', new Blob([JSON.stringify(ticketData)], {
            type: 'application/json'
        }));
        
        // Adiciona arquivo se existir
        if (file) {
            formData.append('file', file);
        }
        
        const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Erro ao criar chamado');
        }
        
        const newTicket = await response.json();
        alert('Chamado criado com sucesso!');
        await fetchUserTickets();
        return newTicket;
        
    } catch (error) {
        console.error('Erro ao criar chamado:', error);
        alert('Falha ao criar chamado: ' + error.message);
        return null;
    }
}

/**
 * Adiciona um comentário a um chamado
 * @param {string} ticketId - ID do chamado
 * @param {string} comentario - Comentário a ser adicionado
 */
async function addCommentToTicket(ticketId, comentario) {
    try {
        const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}/${ticketId}/comentario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                conteudo: comentario 
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Erro ao adicionar comentário');
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('Erro ao adicionar comentário:', error);
        alert('Falha ao adicionar comentário: ' + error.message);
        return null;
    }
}

/**
 * Altera o status de um chamado
 * @param {string} ticketId - ID do chamado
 * @param {string} status - Novo status
 */
async function changeTicketStatus(ticketId, status) {
    try {
        const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}/status/${ticketId}?status=${status}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Erro ao alterar status');
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('Erro ao alterar status:', error);
        alert('Falha ao alterar status: ' + error.message);
        return null;
    }
}

/**
 * Cancela um chamado
 * @param {string} ticketId - ID do chamado
 */
async function cancelTicket(ticketId) {
    try {
        const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}/${ticketId}/cancelar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Erro ao cancelar chamado');
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('Erro ao cancelar chamado:', error);
        alert('Falha ao cancelar chamado: ' + error.message);
        return null;
    }
}

// =====================================================
// FUNÇÕES DE RENDERIZAÇÃO DA INTERFACE (ATUALIZADAS)
// =====================================================

/**
 * Renderiza os chamados do usuário
 * @param {array} tickets - Lista de chamados
 */
function renderTickets(tickets) {
    if (tickets.length === 0) {
        ticketsContainer.innerHTML = `
            <div class="no-tickets">
                <i class="fas fa-inbox"></i>
                <p>Você ainda não abriu nenhum chamado</p>
            </div>
        `;
        return;
    }
    
    ticketsContainer.innerHTML = '';
    
    // Filtra por status
    const activeTickets = tickets.filter(t => t.status !== 'RESOLVIDO' && t.status !== 'FECHADO' && t.status !== 'CANCELADO');
    const resolvedTickets = tickets.filter(t => t.status === 'RESOLVIDO' || t.status === 'FECHADO');
    const canceledTickets = tickets.filter(t => t.status === 'CANCELADO');
    
    // Renderiza chamados ativos
    activeTickets.forEach(ticket => {
        renderTicketCard(ticket);
    });
    
    // Renderiza chamados resolvidos
    if (resolvedTickets.length > 0) {
        ticketsContainer.innerHTML += `<h3 class="section-divider">Chamados Concluídos</h3>`;
        resolvedTickets.forEach(ticket => {
            renderTicketCard(ticket);
        });
    }
    
    // Renderiza chamados cancelados
    if (canceledTickets.length > 0) {
        ticketsContainer.innerHTML += `<h3 class="section-divider">Chamados Cancelados</h3>`;
        canceledTickets.forEach(ticket => {
            renderTicketCard(ticket);
        });
    }
}

/**
 * Renderiza um cartão de chamado individual
 * @param {object} ticket - Dados do chamado
 */
function renderTicketCard(ticket) {
    const card = document.createElement('div');
    card.className = `ticket-card ${ticket.prioridade.toLowerCase()}`;
    card.dataset.ticket = ticket.id;
    
    // Formata a data
    const formattedDate = new Date(ticket.dataAbertura).toLocaleDateString('pt-BR');
    
    card.innerHTML = `
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
        <div class="ticket-priority ${ticket.prioridade.toLowerCase()}">${getPriorityLabel(ticket.prioridade)}</div>
        <div class="ticket-status ${ticket.status.toLowerCase()}">${getStatusLabel(ticket.status)}</div>
    `;
    
    ticketsContainer.appendChild(card);
}

/**
 * Abre o modal com detalhes do chamado
 * @param {string} ticketId - ID do chamado
 */
async function openTicketModal(ticketId) {
    currentTicketId = ticketId;
    const ticket = await fetchTicketDetails(ticketId);
    
    if (!ticket) return;
    
    // Preenche os dados do modal
    document.getElementById('modal-title').textContent = ticket.titulo;
    document.getElementById('modal-id').textContent = `#${ticket.id}`;
    document.getElementById('modal-department').textContent = ticket.setor;
    document.getElementById('modal-author').textContent = ticket.criador;
    document.getElementById('modal-date').textContent = new Date(ticket.dataAbertura).toLocaleDateString('pt-BR');
    document.getElementById('modal-description').textContent = ticket.descricao;
    document.getElementById('modal-priority').textContent = getPriorityLabel(ticket.prioridade);
    document.getElementById('modal-status').textContent = getStatusLabel(ticket.status);
    
    // Atualiza classes de prioridade e status
    const priorityEl = document.getElementById('modal-priority');
    priorityEl.className = `ticket-priority ${ticket.prioridade.toLowerCase()}`;
    
    const statusEl = document.getElementById('modal-status');
    statusEl.className = `ticket-status ${ticket.status.toLowerCase()}`;
    
    // Renderiza anexos
    renderAttachments(ticket.anexos);
    
    // Renderiza comentários como histórico
    renderComments(ticket.comentarios);
    
    // Atualiza visibilidade dos botões
    updateActionButtons(ticket.status);
    
    // Exibe o modal
    ticketModal.style.display = 'block';
}

/**
 * Atualiza os botões de ação baseado no status
 * @param {string} status - Status atual do chamado
 */
function updateActionButtons(status) {
    // Esconde todos os botões inicialmente
    document.querySelectorAll('.action-button').forEach(btn => {
        btn.style.display = 'none';
    });
    
    // Mostra botões relevantes
    if (status === 'ABERTO') {
        document.getElementById('cancel-ticket').style.display = 'inline-block';
        document.getElementById('assign-ticket').style.display = 'inline-block';
    }
    else if (status === 'EM_ANDAMENTO') {
        document.getElementById('resolve-ticket').style.display = 'inline-block';
        document.getElementById('cancel-ticket').style.display = 'inline-block';
    }
}

/**
 * Renderiza os anexos no modal
 * @param {array} attachments - Lista de anexos
 */
function renderAttachments(attachments) {
    const container = document.getElementById('modal-attachments');
    container.innerHTML = '';
    
    if (!attachments || attachments.length === 0) {
        container.innerHTML = '<div class="no-attachments">Nenhum anexo disponível</div>';
        return;
    }
    
    attachments.forEach(attachment => {
        const attachmentEl = document.createElement('a');
        attachmentEl.className = 'attachment';
        attachmentEl.href = `${API_BASE_URL}${TICKETS_ENDPOINT}/download/${attachment.name}`;
        attachmentEl.target = '_blank';
        attachmentEl.innerHTML = `
            <i class="fas fa-file-download"></i>
            <span>${attachment.name}</span>
        `;
        container.appendChild(attachmentEl);
    });
}

/**
 * Renderiza os comentários como histórico
 * @param {array} comments - Lista de comentários
 */
function renderComments(comments) {
    const container = document.getElementById('ticket-history');
    container.innerHTML = '';
    
    if (!comments || comments.length === 0) {
        container.innerHTML = `
            <div class="history-item">
                <div class="history-content">Nenhum comentário disponível</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '<h3>Histórico de Comentários</h3>';
    
    comments.forEach(comment => {
        const commentEl = document.createElement('div');
        commentEl.className = 'history-item';
        
        const formattedDate = new Date(comment.dataComentario).toLocaleString('pt-BR');
        
        commentEl.innerHTML = `
            <div class="history-author">${comment.autor}</div>
            <div class="history-time">${formattedDate}</div>
            <div class="history-content">${comment.conteudo}</div>
        `;
        
        container.appendChild(commentEl);
    });
}

// =====================================================
// FUNÇÕES AUXILIARES (ATUALIZADAS)
// =====================================================

/**
 * Retorna o ícone apropriado para o departamento
 * @param {string} department - Departamento do chamado
 * @returns {string} Classe do ícone FontAwesome
 */
function getIconForDepartment(department) {
    switch(department.toLowerCase()) {
        case 'ti': return 'fas fa-laptop';
        case 'rh': return 'fas fa-users';
        case 'financeiro': return 'fas fa-file-invoice-dollar';
        case 'marketing': return 'fas fa-bullhorn';
        default: return 'fas fa-question-circle';
    }
}

/**
 * Retorna o texto correspondente à prioridade
 * @param {string} priority - Prioridade do chamado
 * @returns {string} Texto da prioridade
 */
function getPriorityLabel(priority) {
    switch(priority) {
        case 'ALTA': return 'Alta Prioridade';
        case 'MEDIA': return 'Média Prioridade';
        case 'BAIXA': return 'Baixa Prioridade';
        default: return priority;
    }
}

/**
 * Retorna o texto correspondente ao status
 * @param {string} status - Status do chamado
 * @returns {string} Texto do status
 */
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
// EVENT LISTENERS E INICIALIZAÇÃO (ATUALIZADOS)
// =====================================================

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    // Carrega os chamados do usuário
    await fetchUserTickets();
    
    // Configura os event listeners
    setupEventListeners();
});

function setupEventListeners() {
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
    
    // Abertura de novo chamado
    ticketForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Coleta os dados do formulário
        const ticketData = {
            titulo: document.getElementById('ticket-title').value,
            setor: document.getElementById('department').value,
            prioridade: document.getElementById('priority').value,
            descricao: document.getElementById('description').value,
            criador: USER_EMAIL
        };
        
        // Validação
        if (!ticketData.titulo || !ticketData.setor || !ticketData.prioridade || !ticketData.descricao) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Obtém o arquivo selecionado
        const fileInput = document.getElementById('file-input');
        const file = fileInput.files.length > 0 ? fileInput.files[0] : null;
        
        // Cria o novo chamado
        await createNewTicket(ticketData, file);
        
        // Reseta o formulário
        ticketForm.reset();
        document.querySelectorAll('.priority-option').forEach(opt => {
            opt.classList.remove('active');
        });
        document.querySelector('.file-info').textContent = 'Nenhum arquivo selecionado';
        document.getElementById('priority').value = '';
    });
    
    // Abrir detalhes do chamado
    ticketsContainer.addEventListener('click', (e) => {
        const ticketCard = e.target.closest('.ticket-card');
        if (ticketCard) {
            const ticketId = ticketCard.dataset.ticket;
            openTicketModal(ticketId);
        }
    });
    
    // Fechar modal
    document.querySelector('.close-modal').addEventListener('click', () => {
        ticketModal.style.display = 'none';
    });
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', (event) => {
        if (event.target === ticketModal) {
            ticketModal.style.display = 'none';
        }
    });
    
    // Enviar comentário
    sendCommentBtn.addEventListener('click', async () => {
        const comment = commentInput.value.trim();
        
        if (!comment) {
            alert('Por favor, digite uma mensagem.');
            return;
        }
        
        await addCommentToTicket(currentTicketId, comment);
        commentInput.value = '';
        
        // Recarrega os detalhes do chamado
        await openTicketModal(currentTicketId);
    });
    
    // Botão alternativo para adicionar comentário
    addCommentBtn.addEventListener('click', async () => {
        const comment = commentInput.value.trim();
        
        if (!comment) {
            alert('Por favor, digite uma mensagem.');
            return;
        }
        
        await addCommentToTicket(currentTicketId, comment);
        commentInput.value = '';
        
        // Recarrega os detalhes do chamado
        await openTicketModal(currentTicketId);
    });
    
    // Botões de ação
    document.getElementById('cancel-ticket').addEventListener('click', async () => {
        if (confirm('Tem certeza que deseja cancelar este chamado?')) {
            await cancelTicket(currentTicketId);
            ticketModal.style.display = 'none';
            await fetchUserTickets();
        }
    });
    
    document.getElementById('resolve-ticket').addEventListener('click', async () => {
        if (confirm('Marcar este chamado como resolvido?')) {
            await changeTicketStatus(currentTicketId, 'RESOLVIDO');
            ticketModal.style.display = 'none';
            await fetchUserTickets();
        }
    });
    
    document.getElementById('assign-ticket').addEventListener('click', async () => {
        const tecnico = prompt('Digite o email do técnico responsável:');
        if (tecnico) {
            try {
                const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}/atribuir/${currentTicketId}?tecnico=${encodeURIComponent(tecnico)}`, {
                    method: 'PUT'
                });
                
                if (!response.ok) throw new Error('Falha ao atribuir técnico');
                
                alert('Técnico atribuído com sucesso!');
                await openTicketModal(currentTicketId);
                
            } catch (error) {
                console.error('Erro ao atribuir técnico:', error);
                alert('Erro: ' + error.message);
            }
        }
    });
}