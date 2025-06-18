// ==============================================
// CONFIGURAÇÃO DA API
// ==============================================
const API_BASE_URL = 'http://localhost:8080';
const ENDPOINTS = {
    SUMMARY: '/helpdesk/contagem/status',
    BY_STATUS: '/helpdesk/contagem/status',
    BY_DEPARTMENT: '/helpdesk/contagem/setor',
    BY_TECHNICIAN: '/helpdesk/contagem/tecnico',
    RESOLUTION_TIME: '/helpdesk/tempo-resolucao',
    DEPARTMENT_DETAILS: '/helpdesk/status-por-departamento'
};

// Variáveis globais para os gráficos
let mainChart;
let departmentChart;

// ==============================================
// FUNÇÕES PRINCIPAIS
// ==============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticação
    if (!localStorage.getItem('authToken')) {
        window.location.href = 'login.html';
        return;
    }

    // Inicializar gráficos
    initializeCharts();
    
    // Carregar dados iniciais
    await loadInitialData();
    
    // Configurar eventos
    setupEventListeners();
});

async function loadInitialData() {
    // Carregar departamentos para o seletor
    await loadDepartments();
    
    // Carregar primeiro relatório
    await loadReportData();
}

function initializeCharts() {
    const mainCtx = document.getElementById('main-chart').getContext('2d');
    const deptCtx = document.getElementById('department-chart').getContext('2d');

    mainChart = new Chart(mainCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Chamados',
                data: [],
                backgroundColor: '#6a11cb'
            }]
        },
        options: getChartOptions('Quantidade de Chamados')
    });

    departmentChart = new Chart(deptCtx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#6a11cb', '#2575fc', '#2ecc71', '#f39c12', '#e74c3c'
                ]
            }]
        },
        options: getChartOptions('Status por Departamento')
    });
}

function getChartOptions(title) {
    return {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title,
                font: {
                    size: 16
                }
            }
        }
    };
}

async function loadDepartments() {
    try {
        // Mapeamento fixo dos departamentos (poderia vir do backend)
        const departments = [
            { id: 'TI', name: 'Tecnologia da Informação' },
            { id: 'RH', name: 'Recursos Humanos' },
            { id: 'FINANCEIRO', name: 'Financeiro' },
            { id: 'MARKETING', name: 'Marketing' }
        ];
        
        const selector = document.getElementById('department-chart-selector');
        
        selector.innerHTML = departments.map(dept => 
            `<option value="${dept.id}">${dept.name}</option>`
        ).join('');
        
    } catch (error) {
        console.error('Erro:', error);
        showAlert('error', 'Falha ao carregar departamentos');
    }
}

async function loadReportData() {
    const reportType = document.getElementById('report-type').value;
    const period = document.getElementById('period').value;
    const params = new URLSearchParams();

    // Adicionar parâmetro de período
    if (period === 'custom') {
        params.append('startDate', document.getElementById('start-date').value);
        params.append('endDate', document.getElementById('end-date').value);
    } else {
        params.append('period', translatePeriodToBackend(period));
    }

    try {
        let endpoint, response;
        
        switch (reportType) {
            case 'status':
                endpoint = ENDPOINTS.BY_STATUS;
                break;
            case 'department':
                endpoint = ENDPOINTS.BY_DEPARTMENT;
                break;
            case 'technician':
                endpoint = ENDPOINTS.BY_TECHNICIAN;
                break;
            case 'time':
                endpoint = ENDPOINTS.RESOLUTION_TIME;
                break;
            default:
                endpoint = ENDPOINTS.SUMMARY;
        }

        response = await fetch(`${API_BASE_URL}${endpoint}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (!response.ok) throw new Error('Erro na requisição');

        const data = await response.json();
        updateMainReport(data, reportType);
        
    } catch (error) {
        console.error('Erro:', error);
        showAlert('error', 'Falha ao carregar relatório');
    }
}

function updateMainReport(data, reportType) {
    // Converter os dados do backend para o formato esperado pelo frontend
    let labels = [];
    let values = [];
    
    if (reportType === 'status') {
        labels = ['ABERTO', 'EM_ANDAMENTO', 'RESOLVIDO', 'ATRASO'];
        values = labels.map(label => data[label.toLowerCase()] || 0);
    } else if (reportType === 'department') {
        labels = Object.keys(data).map(key => key.toUpperCase());
        values = Object.values(data);
    } else if (reportType === 'technician') {
        labels = Object.keys(data);
        values = Object.values(data);
    } else if (reportType === 'time') {
        labels = Object.keys(data);
        values = Object.values(data).map(hours => parseFloat(hours.toFixed(2)));
    }

    // Atualizar gráfico principal
    mainChart.data.labels = labels.map(label => formatLabel(label, reportType));
    mainChart.data.datasets[0].data = values;
    mainChart.update();

    // Atualizar tabela
    const tableBody = document.getElementById('report-data');
    const total = values.reduce((sum, val) => sum + val, 0);
    
    tableBody.innerHTML = labels.map((label, index) => {
        const percentage = total > 0 ? ((values[index] / total) * 100).toFixed(2) : 0;
        return `
            <tr>
                <td>${formatLabel(label, reportType)}</td>
                <td>${values[index]}</td>
                <td>${percentage}%</td>
            </tr>
        `;
    }).join('');
}

async function loadDepartmentDetails() {
    const deptId = document.getElementById('department-chart-selector').value;
    const period = document.getElementById('period').value;
    
    try {
        const params = new URLSearchParams();
        params.append('department', deptId);
        
        if (period === 'custom') {
            params.append('startDate', document.getElementById('start-date').value);
            params.append('endDate', document.getElementById('end-date').value);
        } else {
            params.append('period', translatePeriodToBackend(period));
        }

        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.DEPARTMENT_DETAILS}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (!response.ok) throw new Error('Erro ao carregar detalhes');
        
        const data = await response.json();
        updateDepartmentReport(data);
        
    } catch (error) {
        console.error('Erro:', error);
        showAlert('error', 'Falha ao carregar detalhes do departamento');
    }
}

function updateDepartmentReport(data) {
    // Mapear os dados do backend para o formato esperado
    const labels = ['ABERTO', 'EM_ANDAMENTO', 'RESOLVIDO', 'ATRASO'];
    const values = labels.map(label => data[label.toLowerCase()] || 0);
    
    // Atualizar gráfico de departamento
    departmentChart.data.labels = labels.map(label => formatLabel(label, 'status'));
    departmentChart.data.datasets[0].data = values;
    departmentChart.update();

    // Atualizar tabela de departamento
    const tableBody = document.getElementById('department-data');
    const total = values.reduce((sum, val) => sum + val, 0);
    
    tableBody.innerHTML = labels.map((label, index) => {
        const percentage = total > 0 ? ((values[index] / total) * 100).toFixed(2) : 0;
        return `
            <tr>
                <td>${formatLabel(label, 'status')}</td>
                <td>${values[index]}</td>
                <td>${percentage}%</td>
            </tr>
        `;
    }).join('');
}

// ==============================================
// FUNÇÕES AUXILIARES
// ==============================================

function formatLabel(label, type) {
    const labels = {
        status: {
            'ABERTO': 'Aberto',
            'EM_ANDAMENTO': 'Em Andamento',
            'RESOLVIDO': 'Resolvido',
            'ATRASO': 'Atrasado',
            'CANCELADO': 'Cancelado'
        },
        department: {
            'TI': 'Tecnologia da Informação',
            'RH': 'Recursos Humanos',
            'FINANCEIRO': 'Financeiro',
            'MARKETING': 'Marketing'
        }
    };
    
    return labels[type]?.[label] || label;
}

function translatePeriodToBackend(period) {
    const periods = {
        'today': 'today',
        'week': 'week',
        'month': 'month',
        'quarter': 'quarter',
        'year': 'year'
    };
    return periods[period] || 'month';
}

function setupEventListeners() {
    // Filtros principais
    document.getElementById('report-type').addEventListener('change', loadReportData);
    document.getElementById('period').addEventListener('change', function() {
        document.getElementById('custom-date-range').style.display = 
            this.value === 'custom' ? 'block' : 'none';
        loadReportData();
    });
    
    document.getElementById('start-date').addEventListener('change', loadReportData);
    document.getElementById('end-date').addEventListener('change', loadReportData);
    
    // Filtro de departamento
    document.getElementById('department-chart-selector').addEventListener('change', loadDepartmentDetails);
    
    // Botões de exportação
    document.getElementById('generate-pdf').addEventListener('click', generatePDF);
    document.getElementById('export-excel').addEventListener('click', exportExcel);
}

function generatePDF() {
    // Implementar geração de PDF
    alert('PDF será gerado aqui');
}

function exportExcel() {
    // Implementar exportação para Excel
    alert('Excel será exportado aqui');
}

function showAlert(type, message) {
    // Implementar um sistema de alerta mais sofisticado
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.body.prepend(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}