// =====================================================
// CONFIGURAÇÕES DA API
// =====================================================
const API_BASE_URL = 'http://localhost:8082';
const TICKETS_ENDPOINT = '/helpdesk';

// Elementos DOM
const ticketsContainer = document.getElementById('tickets-container');
const ticketForm = document.getElementById('ticket-form');
const ticketModal = document.getElementById('ticket-modal');
const commentInput = document.getElementById('comment-input');
const sendCommentBtn = document.getElementById('send-comment');
const addCommentBtn = document.getElementById('add-comment');
const closeTicketBtn = document.getElementById('close-ticket');
const cancelTicketBtn = document.getElementById('cancel-ticket');
const resolveTicketBtn = document.getElementById('resolve-ticket');
const assignTicketBtn = document.getElementById('assign-ticket');

// =====================================================
// FUNÇÕES DE COMUNICAÇÃO COM A API
// =====================================================

/**
 * Busca os chamados do usuário logado
 */
async function loadUserTickets() {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}/criador/${localStorage.getItem('userEmail')}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar chamados');
        }

        const tickets = await response.json();
        renderTickets(tickets);
    } catch (error) {
        console.error('Erro ao carregar chamados:', error);
        showAlert('Erro ao carregar chamados: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Busca detalhes de um chamado específico
 */
async function fetchTicketDetails(ticketId) {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}/${ticketId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (!response.ok) throw new Error('Erro ao buscar detalhes do chamado');

        const ticket = await response.json();
        const comentarios = await fetchComments(ticketId);

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
        showAlert('Falha ao carregar detalhes do chamado: ' + error.message, 'error');
        return null;
    } finally {
        showLoading(false);
    }
}

/**
 * Busca comentários de um chamado
 */
async function fetchComments(ticketId) {
    try {
        const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}/${ticketId}/comentarios`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        if (!response.ok) throw new Error('Erro ao buscar comentários');
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar comentários:', error);
        return [];
    }
}

/**
 * Cria um novo chamado
 */
async function createTicket(ticketData, file) {
    const formData = new FormData();
    const ticketModel = {
        titulo: ticketData.title,
        descricao: ticketData.description,
        prioridade: ticketData.priority,
        setor: ticketData.department,
        criador: localStorage.getItem('userEmail'),
        status: 'ABERTO'
    };

    formData.append('helpdeskModel', new Blob([JSON.stringify(ticketModel)], {
        type: 'application/json'
    }));

    if (file) {
        formData.append('file', file);
    }

    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao criar chamado');
        }

        const newTicket = await response.json();
        showAlert('Chamado criado com sucesso!', 'success');
        return newTicket;
    } catch (error) {
        console.error('Erro ao criar chamado:', error);
        showAlert('Erro ao criar chamado: ' + error.message, 'error');
        throw error;
    } finally {
        showLoading(false);
    }
}

/**
 * Adiciona um comentário a um chamado
 */
async function addCommentToTicket(ticketId, comentario) {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}/${ticketId}/comentario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
                conteudo: comentario,
                autor: localStorage.getItem('userEmail')
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Erro ao adicionar comentário');
        }

        showAlert('Comentário adicionado com sucesso!', 'success');
        return await response.json();
    } catch (error) {
        console.error('Erro ao adicionar comentário:', error);
        showAlert('Falha ao adicionar comentário: ' + error.message, 'error');
        return null;
    } finally {
        showLoading(false);
    }
}

/**
 * Altera o status de um chamado
 */
async function changeTicketStatus(ticketId, status) {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}/status/${ticketId}?status=${status}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Erro ao alterar status');
        }

        showAlert('Status do chamado atualizado com sucesso!', 'success');
        return await response.json();
    } catch (error) {
        console.error('Erro ao alterar status:', error);
        showAlert('Falha ao alterar status: ' + error.message, 'error');
        return null;
    } finally {
        showLoading(false);
    }
}

/**
 * Cancela um chamado
 */
async function cancelTicket(ticketId) {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}/${ticketId}/cancelar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Erro ao cancelar chamado');
        }

        showAlert('Chamado cancelado com sucesso!', 'success');
        return await response.json();
    } catch (error) {
        console.error('Erro ao cancelar chamado:', error);
        showAlert('Falha ao cancelar chamado: ' + error.message, 'error');
        return null;
    } finally {
        showLoading(false);
    }
}

/**
 * Atribui um técnico a um chamado
 */
async function assignTechnician(ticketId, technicianEmail) {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}${TICKETS_ENDPOINT}/atribuir/${ticketId}?tecnico=${encodeURIComponent(technicianEmail)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Falha ao atribuir técnico');
        }

        showAlert('Técnico atribuído com sucesso!', 'success');
        return await response.json();
    } catch (error) {
        console.error('Erro ao atribuir técnico:', error);
        showAlert('Erro ao atribuir técnico: ' + error.message, 'error');
        return null;
    } finally {
        showLoading(false);
    }
}

// =====================================================
// FUNÇÕES DE RENDERIZAÇÃO
// =====================================================

/**
 * Renderiza os chamados do usuário
 */
function renderTickets(tickets) {
    const container = document.getElementById('tickets-container');
    container.innerHTML = '';

    if (!tickets || tickets.length === 0) {
        container.innerHTML = '<div class="no-tickets">Nenhum chamado encontrado</div>';
        return;
    }

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
        container.innerHTML += '<h3 class="section-divider">Chamados Concluídos</h3>';
        resolvedTickets.forEach(ticket => {
            renderTicketCard(ticket);
        });
    }

    // Renderiza chamados cancelados
    if (canceledTickets.length > 0) {
        container.innerHTML += '<h3 class="section-divider">Chamados Cancelados</h3>';
        canceledTickets.forEach(ticket => {
            renderTicketCard(ticket);
        });
    }
}

/**
 * Renderiza um cartão de chamado individual
 */
function renderTicketCard(ticket) {
    const card = document.createElement('div');
    card.className = `ticket-card ${ticket.prioridade.toLowerCase()}`;
    card.dataset.ticketId = ticket.id;

    const formattedDate = new Date(ticket.dataAbertura).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    card.innerHTML = `
        <div class="ticket-icon">
            <i class="${getIconForDepartment(ticket.setor)}"></i>
        </div>
        <div class="ticket-content">
            <div class="ticket-title">${ticket.titulo}</div>
            <div class="ticket-meta">
                <div class="ticket-department">
                    <i class="fas fa-building"></i> ${ticket.setor}
                </div>
                <div class="ticket-date">
                    <i class="far fa-calendar"></i> ${formattedDate}
                </div>
            </div>
        </div>
        <div class="ticket-priority ${ticket.prioridade.toLowerCase()}">
            ${getPriorityLabel(ticket.prioridade)}
        </div>
        <div class="ticket-status ${ticket.status.toLowerCase()}">
            ${getStatusLabel(ticket.status)}
        </div>
    `;

    card.addEventListener('click', () => openTicketModal(ticket.id));
    ticketsContainer.appendChild(card);
}

/**
 * Abre o modal com detalhes do chamado
 */
async function openTicketModal(ticketId) {
    currentTicketId = ticketId;
    const ticket = await fetchTicketDetails(ticketId);

    if (!ticket) return;

    // Preenche os dados do modal
    document.getElementById('modal-title').textContent = ticket.titulo;
    document.getElementById('modal-id').textContent = `#${ticket.id.substring(0, 8)}`;
    document.getElementById('modal-department').textContent = ticket.setor;
    document.getElementById('modal-author').textContent = ticket.criador;
    document.getElementById('modal-date').textContent = new Date(ticket.dataAbertura).toLocaleDateString('pt-BR');
    document.getElementById('modal-description').textContent = ticket.descricao;
    
    // Atualiza prioridade e status
    const priorityEl = document.getElementById('modal-priority');
    priorityEl.textContent = getPriorityLabel(ticket.prioridade);
    priorityEl.className = `ticket-priority ${ticket.prioridade.toLowerCase()}`;

    const statusEl = document.getElementById('modal-status');
    statusEl.textContent = getStatusLabel(ticket.status);
    statusEl.className = `ticket-status ${ticket.status.toLowerCase()}`;

    // Renderiza anexos e comentários
    renderAttachments(ticket.anexos);
    renderComments(ticket.comentarios);

    // Atualiza botões de ação
    updateActionButtons(ticket.status);

    // Exibe o modal
    ticketModal.style.display = 'block';
}

/**
 * Atualiza os botões de ação baseado no status
 */
function updateActionButtons(status) {
    // Esconde todos os botões inicialmente
    document.querySelectorAll('.action-button').forEach(btn => {
        btn.style.display = 'none';
    });

    // Mostra botões relevantes
    if (status === 'ABERTO') {
        cancelTicketBtn.style.display = 'inline-block';
        assignTicketBtn.style.display = 'inline-block';
    } else if (status === 'EM_ANDAMENTO') {
        resolveTicketBtn.style.display = 'inline-block';
        cancelTicketBtn.style.display = 'inline-block';
    }
}

/**
 * Renderiza os anexos no modal
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
 */
function renderComments(comments) {
    const container = document.getElementById('ticket-history');
    container.innerHTML = '';

    if (!comments || comments.length === 0) {
        container.innerHTML = '<div class="no-comments">Nenhum comentário disponível</div>';
        return;
    }

    comments.forEach(comment => {
        const commentEl = document.createElement('div');
        commentEl.className = 'history-item';

        const formattedDate = new Date(comment.dataComentario).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        commentEl.innerHTML = `
            <div class="history-header">
                <span class="history-author">${comment.autor}</span>
                <span class="history-time">${formattedDate}</span>
            </div>
            <div class="history-content">${comment.conteudo}</div>
        `;

        container.appendChild(commentEl);
    });
}

// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

function getIconForDepartment(department) {
    const departmentIcons = {
        'ti': 'fas fa-laptop-code',
        'rh': 'fas fa-users',
        'financeiro': 'fas fa-file-invoice-dollar',
        'marketing': 'fas fa-bullhorn',
        'administrativo': 'fas fa-building',
        'outros': 'fas fa-question-circle'
    };
    
    const normalizedDept = department.toLowerCase().replace(/\s+/g, '');
    return departmentIcons[normalizedDept] || departmentIcons['outros'];
}

function getPriorityLabel(priority) {
    const priorityLabels = {
        'ALTA': 'Alta Prioridade',
        'MEDIA': 'Média Prioridade',
        'BAIXA': 'Baixa Prioridade'
    };
    return priorityLabels[priority] || priority;
}

function getStatusLabel(status) {
    const statusLabels = {
        'ABERTO': 'Aberto',
        'EM_ANDAMENTO': 'Em Andamento',
        'RESOLVIDO': 'Resolvido',
        'FECHADO': 'Fechado',
        'CANCELADO': 'Cancelado'
    };
    return statusLabels[status] || status;
}

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.add('fade-out');
        setTimeout(() => alertDiv.remove(), 500);
    }, 3000);
}

function showLoading(show) {
    const loadingDiv = document.getElementById('loading-overlay') || createLoadingOverlay();
    loadingDiv.style.display = show ? 'flex' : 'none';
}

function createLoadingOverlay() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-overlay';
    loadingDiv.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loadingDiv);
    return loadingDiv;
}

// =====================================================
// EVENT LISTENERS E INICIALIZAÇÃO
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    // Verifica autenticação
    if (!localStorage.getItem('authToken')) {
        window.location.href = 'login.html';
        return;
    }

    // Carrega dados do usuário
    document.getElementById('user-name').textContent = localStorage.getItem('userName') || 'Usuário';
    
    // Configura prioridades
    document.querySelectorAll('.priority-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.priority-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
            document.getElementById('priority').value = this.dataset.priority;
        });
    });

    // Configura upload de arquivo
    document.getElementById('file-upload').addEventListener('click', () => {
        document.getElementById('file-input').click();
    });

    document.getElementById('file-input').addEventListener('change', function() {
        if (this.files.length > 0) {
            document.querySelector('.file-info').textContent = this.files[0].name;
        }
    });

    // Carrega chamados
    loadUserTickets();
});

// Formulário de novo chamado
ticketForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('ticket-title').value;
    const department = document.getElementById('department').value;
    const priority = document.getElementById('priority').value;
    const description = document.getElementById('description').value;
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files.length > 0 ? fileInput.files[0] : null;

    try {
        await createTicket({ title, department, priority, description }, file);
        ticketForm.reset();
        document.querySelector('.file-info').textContent = 'Nenhum arquivo selecionado';
        loadUserTickets();
    } catch (error) {
        console.error('Erro no formulário:', error);
    }
});

// Fechar modal
document.querySelector('.close-modal').addEventListener('click', () => {
    ticketModal.style.display = 'none';
});

// Fechar modal ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target === ticketModal) {
        ticketModal.style.display = 'none';
    }
});

// Enviar comentário
sendCommentBtn.addEventListener('click', async () => {
    const comment = commentInput.value.trim();
    if (!comment) {
        showAlert('Por favor, digite uma mensagem', 'warning');
        return;
    }

    await addCommentToTicket(currentTicketId, comment);
    commentInput.value = '';
    openTicketModal(currentTicketId); // Recarrega
});

// Botões de ação
cancelTicketBtn.addEventListener('click', async () => {
    if (confirm('Tem certeza que deseja cancelar este chamado?')) {
        await cancelTicket(currentTicketId);
        ticketModal.style.display = 'none';
        loadUserTickets();
    }
});

resolveTicketBtn.addEventListener('click', async () => {
    if (confirm('Marcar este chamado como resolvido?')) {
        await changeTicketStatus(currentTicketId, 'RESOLVIDO');
        ticketModal.style.display = 'none';
        loadUserTickets();
    }
});

assignTicketBtn.addEventListener('click', async () => {
    const tecnico = prompt('Digite o email do técnico responsável:');
    if (tecnico) {
        await assignTechnician(currentTicketId, tecnico);
        openTicketModal(currentTicketId); // Recarrega
    }
});