// =====================================================
// CONFIGURAÇÕES DA API - ESSENCIAIS PARA A INTEGRAÇÃO
// =====================================================
const API_BASE_URL = 'http://localhost:8080'; // URL base do backend Java
const TICKETS_ENDPOINT = '/helpdesk';
const TECHNICIANS_ENDPOINT = '/helpdesk/tecnicos'; // Ajuste conforme sua API real
const STATS_ENDPOINT = '/helpdesk/contagem/status';
const COMMENTS_ENDPOINT = '/helpdesk/comentarios';

// Elementos DOM
const ticketsBody = document.getElementById('tickets-table-body');
const editPanel = document.getElementById('edit-panel');
const editForm = document.getElementById('edit-ticket-form');
const assignModal = document.getElementById('assign-modal');
const ticketModal = document.getElementById('ticket-modal');
const commentForm = document.getElementById('comment-form');
const searchBox = document.getElementById('search-box');
const statusFilter = document.getElementById('status-filter');
const priorityFilter = document.getElementById('priority-filter');

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
        const response = await fetch(`${API_BASE_URL}${STATS_ENDPOINT}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        if (!response.ok) throw new Error('Erro ao buscar estatísticas');

        const stats = await response.json();

        // Atualiza os valores no dashboard
        document.getElementById('open-tickets').textContent = stats.abertos || 0;
        document.getElementById('progress-tickets').textContent = stats.em_andamento || 0;
        document.getElementById('resolved-tickets').textContent = stats.resolvidos || 0;
        document.getElementById('overdue-tickets').textContent = stats.atrasados || 0;

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
        const response = await fetch(`${API_BASE_URL}${TECHNICIANS_ENDPOINT}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        if (!response.ok) throw new Error('Erro ao buscar técnicos');

        technicians = await response.json();

        // Preenche os selects com os técnicos
        const editTechnicianSelect = document.getElementById('edit-technician');
        const assignTechnicianSelect = document.getElementById('assign-technician');

        editTechnicianSelect.innerHTML = '<option value="">- Selecionar -</option>';
        assignTechnicianSelect.innerHTML = '<option value="">- Selecionar -</option>';

        technicians.forEach(tech => {
            const option = document.createElement('option');
            option.value = tech.email; // Usando email como identificador
            option.textContent = tech.nome || tech.email;

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
        const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
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
 * @param {string} ticketId - ID do chamado (UUID)
 */
async function fetchTicketDetails(ticketId) {
    try {
        const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}/${ticketId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
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
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
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
 * @param {string} ticketId - ID do chamado (UUID)
 * @param {string} technicianEmail - Email do técnico
 */
async function assignTechnician(ticketId, technicianEmail) {
    try {
        const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}/atribuir/${ticketId}?tecnico=${encodeURIComponent(technicianEmail)}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Erro ao atribuir técnico');
        
        const updatedTicket = await response.json();
        alert('Técnico atribuído com sucesso!');
        await fetchTickets();
        return updatedTicket;
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao atribuir técnico: ' + error.message);
        throw error;
    }
}

/**
 * Adiciona um comentário a um chamado
 * @param {string} ticketId - ID do chamado (UUID)
 * @param {string} comment - Comentário a ser adicionado
 */
async function addComment(ticketId, comment) {
    try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) throw new Error('Usuário não autenticado');

        const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}/${ticketId}/comentario`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                comentario: comment,
                autor: userEmail
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

/**
 * Carrega chamados de um técnico específico
 */
async function loadTechnicianTickets() {
    try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) throw new Error('Usuário não autenticado');

        const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}/tecnico/${userEmail}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (!response.ok) throw new Error('Erro ao carregar chamados');

        const tickets = await response.json();
        renderTickets(tickets);
        setupFilters(tickets);
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar chamados técnicos: ' + error.message);
    }
}

/**
 * Configura os filtros para a tabela de chamados
 * @param {array} allTickets - Lista completa de chamados
 */
function setupFilters(allTickets) {
    const applyFilters = () => {
        const searchTerm = searchBox.value.toLowerCase();
        const statusValue = statusFilter.value;
        const priorityValue = priorityFilter.value;

        const filtered = allTickets.filter(ticket => {
            const matchesSearch = ticket.titulo.toLowerCase().includes(searchTerm) ||
                ticket.descricao.toLowerCase().includes(searchTerm);
            const matchesStatus = statusValue === 'all' || ticket.status === statusValue;
            const matchesPriority = priorityValue === 'all' || ticket.prioridade === priorityValue;

            return matchesSearch && matchesStatus && matchesPriority;
        });

        renderTickets(filtered);
    };

    searchBox.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    priorityFilter.addEventListener('change', applyFilters);
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
        const priorityClass = `priority-${ticket.prioridade.toLowerCase()}`;
        const statusClass = `status-${ticket.status.toLowerCase()}`;

        // Formata a data
        const formattedDate = new Date(ticket.dataAbertura).toLocaleDateString('pt-BR');

        row.innerHTML = `
            <td>#${ticket.id.substring(0, 8)}</td>
            <td>${ticket.titulo}</td>
            <td>${ticket.setor}</td>
            <td><span class="priority-badge ${priorityClass}">${getPriorityLabel(ticket.prioridade)}</span></td>
            <td><span class="status-badge ${statusClass}">${getStatusLabel(ticket.status)}</span></td>
            <td>${ticket.emailSolicitante}</td>
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
 * @param {string} ticketId - ID do chamado (UUID)
 */
async function openTicketModal(ticketId) {
    currentTicketId = ticketId;
    const ticket = await fetchTicketDetails(ticketId);

    if (!ticket) return;

    // Preenche os dados do modal
    document.getElementById('modal-ticket-title').textContent = ticket.titulo;
    document.getElementById('modal-ticket-id').textContent = `#${ticket.id.substring(0, 8)}`;
    document.getElementById('modal-ticket-department').textContent = `Departamento: ${ticket.setor}`;
    document.getElementById('modal-ticket-author').textContent = `Aberto por: ${ticket.emailSolicitante}`;
    document.getElementById('modal-ticket-date').textContent = `Data: ${new Date(ticket.dataAbertura).toLocaleDateString('pt-BR')}`;
    document.getElementById('modal-ticket-description').textContent = ticket.descricao;
    document.getElementById('modal-ticket-priority').textContent = getPriorityLabel(ticket.prioridade);
    document.getElementById('modal-ticket-status').textContent = getStatusLabel(ticket.status);

    // Atualiza classes de status
    document.getElementById('modal-ticket-priority').className = `status-value status-priority priority-${ticket.prioridade.toLowerCase()}`;
    document.getElementById('modal-ticket-status').className = `status-value status-${ticket.status.toLowerCase()}`;

    // Renderiza anexos (se houver)
    if (ticket.fileName) {
        document.getElementById('modal-ticket-attachments').innerHTML = `
            <div class="attachment-item">
                <i class="fas fa-file-download"></i>
                <a href="${API_BASE_URL}${TICKETS_ENDPOINT}/download/${ticket.fileName}" target="_blank">${ticket.fileName}</a>
            </div>
        `;
    } else {
        document.getElementById('modal-ticket-attachments').innerHTML = '<p>Nenhum anexo disponível</p>';
    }

    // Carrega comentários
    await loadComments(ticketId);

    // Exibe o modal
    ticketModal.style.display = 'block';
}

/**
 * Carrega os comentários de um chamado
 * @param {string} ticketId - ID do chamado (UUID)
 */
async function loadComments(ticketId) {
    try {
        const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}/${ticketId}/comentarios`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (!response.ok) throw new Error('Erro ao carregar comentários');
        
        const comments = await response.json();
        renderComments(comments);
    } catch (error) {
        console.error('Erro ao carregar comentários:', error);
        document.getElementById('modal-ticket-history').innerHTML = '<p>Erro ao carregar histórico</p>';
    }
}

/**
 * Renderiza os comentários no modal
 * @param {array} comments - Lista de comentários
 */
function renderComments(comments) {
    const container = document.getElementById('modal-ticket-history');
    container.innerHTML = '';

    if (!comments || comments.length === 0) {
        container.innerHTML = '<p>Nenhum comentário disponível</p>';
        return;
    }

    comments.forEach(comment => {
        const item = document.createElement('div');
        item.className = 'history-item';

        const formattedDate = new Date(comment.dataComentario).toLocaleString('pt-BR');
        const userInitials = comment.autor ? comment.autor.substring(0, 2).toUpperCase() : '??';

        item.innerHTML = `
            <div class="history-avatar">${userInitials}</div>
            <div class="history-content">
                <div class="history-header">
                    <div>
                        <span class="history-user">${comment.autor || 'Anônimo'}</span>
                    </div>
                    <span class="history-date">${formattedDate}</span>
                </div>
                <div class="history-message">
                    ${comment.comentario}
                </div>
            </div>
        `;

        container.appendChild(item);
    });
}

/**
 * Abre o modal de atribuição de técnico
 * @param {string} ticketId - ID do chamado (UUID)
 */
function openAssignModal(ticketId) {
    document.getElementById('assign-ticket-id').textContent = `#${ticketId.substring(0, 8)}`;
    currentTicketId = ticketId;
    assignModal.classList.add('active');
}

/**
 * Abre o painel de edição de chamado
 * @param {string} ticketId - ID do chamado (UUID)
 */
async function openEditPanel(ticketId) {
    const ticket = await fetchTicketDetails(ticketId);

    if (!ticket) return;

    // Preenche o formulário
    document.getElementById('edit-ticket-id').value = ticket.id;
    document.getElementById('edit-title').value = ticket.titulo;
    document.getElementById('edit-priority').value = ticket.prioridade;
    document.getElementById('edit-status').value = ticket.status;
    document.getElementById('edit-technician').value = ticket.emailResponsavelTI || '';
    document.getElementById('edit-department').value = ticket.setor;
    document.getElementById('edit-description').value = ticket.descricao;

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
    switch (priority) {
        case 'ALTA': return 'Alta';
        case 'MEDIA': return 'Média';
        case 'BAIXA': return 'Baixa';
        default: return priority;
    }
}

/**
 * Retorna o texto correspondente ao código de status
 * @param {string} status - Código do status
 * @returns {string} Texto do status
 */
function getStatusLabel(status) {
    switch (status) {
        case 'ABERTO': return 'Aberto';
        case 'EM_ANDAMENTO': return 'Em Andamento';
        case 'RESOLVIDO': return 'Resolvido';
        case 'ATRASO': return 'Atrasado';
        case 'CANCELADO': return 'Cancelado';
        default: return status;
    }
}

// =====================================================
// EVENT LISTENERS E INICIALIZAÇÃO
// =====================================================

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    // Verifica autenticação
    if (!localStorage.getItem('authToken')) {
        window.location.href = 'login.html';
        return;
    }

    // Carrega dados do usuário
    document.getElementById('user-name').textContent = localStorage.getItem('userName') || 'Usuário';
    document.getElementById('user-avatar').textContent = localStorage.getItem('userInitials') || 'US';

    // Carrega dados iniciais
    await fetchTechnicians();
    await loadTechnicianTickets();
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
        const technicianEmail = document.getElementById('assign-technician').value;

        if (!technicianEmail) {
            alert('Por favor, selecione um técnico.');
            return;
        }

        try {
            await assignTechnician(currentTicketId, technicianEmail);
            assignModal.classList.remove('active');
        } catch (error) {
            console.error('Erro ao atribuir técnico:', error);
        }
    });

    // Salvar edição de chamado
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const ticketData = {
            id: document.getElementById('edit-ticket-id').value,
            titulo: document.getElementById('edit-title').value,
            prioridade: document.getElementById('edit-priority').value,
            status: document.getElementById('edit-status').value,
            emailResponsavelTI: document.getElementById('edit-technician').value || null,
            setor: document.getElementById('edit-department').value,
            descricao: document.getElementById('edit-description').value
        };

        await updateTicket(ticketData);
        editPanel.classList.remove('active');
    });

    // Adicionar comentário
    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const comment = document.getElementById('comment-input').value;

        if (!comment.trim()) {
            alert('Por favor, digite um comentário.');
            return;
        }

        await addComment(currentTicketId, comment);
        document.getElementById('comment-input').value = '';

        // Recarrega os comentários
        await loadComments(currentTicketId);
    });

    // Marcar como resolvido
    document.getElementById('resolve-btn').addEventListener('click', async () => {
        const ticketData = {
            id: currentTicketId,
            status: 'RESOLVIDO'
        };

        await updateTicket(ticketData);
        ticketModal.style.display = 'none';
    });
}