document.addEventListener('DOMContentLoaded', function() {
    // Dados fictícios para demonstração
    const demoData = {
        stats: {
            total: 142,
            open: 28,
            progress: 19,
            resolved: 92,
            overdue: 12,
            efficiency: '87%'
        },
        statusReport: [
            { category: 'Abertos', count: 28, percentage: '20%' },
            { category: 'Em Andamento', count: 19, percentage: '13%' },
            { category: 'Resolvidos', count: 92, percentage: '65%' },
            { category: 'Atrasados', count: 12, percentage: '8%' }
        ],
        departments: [
            { name: 'TI', open: 8, progress: 5, resolved: 35 },
            { name: 'RH', open: 5, progress: 3, resolved: 12 },
            { name: 'Financeiro', open: 7, progress: 4, resolved: 18 },
            { name: 'Marketing', open: 3, progress: 2, resolved: 8 },
            { name: 'Operações', open: 5, progress: 5, resolved: 19 }
        ],
        technicians: [
            { name: 'Carlos Souza', total: 42, resolved: 38, avgTime: '2h15m', efficiency: '90%' },
            { name: 'Ana Santos', total: 38, resolved: 32, avgTime: '2h45m', efficiency: '84%' },
            { name: 'Pedro Lima', total: 28, resolved: 25, avgTime: '1h50m', efficiency: '89%' },
            { name: 'Mariana Costa', total: 22, resolved: 18, avgTime: '3h10m', efficiency: '82%' },
            { name: 'João Silva', total: 12, resolved: 10, avgTime: '2h30m', efficiency: '83%' }
        ]
    };

    // Atualizar cartões de estatísticas
    document.getElementById('total-tickets').textContent = demoData.stats.total;
    document.getElementById('open-tickets').textContent = demoData.stats.open;
    document.getElementById('progress-tickets').textContent = demoData.stats.progress;
    document.getElementById('resolved-tickets').textContent = demoData.stats.resolved;
    document.getElementById('overdue-tickets').textContent = demoData.stats.overdue;
    document.getElementById('efficiency-rate').textContent = demoData.stats.efficiency;

    // Atualizar tabela de status
    const reportData = document.getElementById('report-data');
    reportData.innerHTML = '';
    demoData.statusReport.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.category}</td>
            <td>${item.count}</td>
            <td>${item.percentage}</td>
            <td><button class="filter-btn"><i class="fas fa-filter"></i> Filtrar</button></td>
        `;
        reportData.appendChild(row);
    });

    // Atualizar tabela de departamentos
    const departmentData = document.getElementById('department-data');
    departmentData.innerHTML = '';
    demoData.departments.forEach(dept => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${dept.name}</td>
            <td>${dept.open}</td>
            <td>${dept.progress}</td>
            <td>${dept.resolved}</td>
            <td><button class="details-btn"><i class="fas fa-search"></i> Detalhes</button></td>
        `;
        departmentData.appendChild(row);
    });

    // Atualizar tabela de técnicos
    const technicianData = document.getElementById('technician-data');
    technicianData.innerHTML = '';
    demoData.technicians.forEach(tech => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tech.name}</td>
            <td>${tech.total}</td>
            <td>${tech.resolved}</td>
            <td>${tech.avgTime}</td>
            <td>${tech.efficiency}</td>
        `;
        technicianData.appendChild(row);
    });

    // Configurar gráfico de departamentos (gráfico de pizza)
    const deptCtx = document.getElementById('department-chart').getContext('2d');
    const departmentChart = new Chart(deptCtx, {
        type: 'pie',
        data: {
            labels: demoData.departments.map(d => d.name),
            datasets: [{
                data: demoData.departments.map(d => d.open + d.progress + d.resolved),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'Chamados por Departamento',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });

    // Configurar gráfico de técnicos (gráfico de barras)
    const techCtx = document.getElementById('technician-chart').getContext('2d');
    const technicianChart = new Chart(techCtx, {
        type: 'bar',
        data: {
            labels: demoData.technicians.map(t => t.name),
            datasets: [
                {
                    label: 'Total de Chamados',
                    data: demoData.technicians.map(t => t.total),
                    backgroundColor: '#36A2EB',
                    borderWidth: 1
                },
                {
                    label: 'Resolvidos',
                    data: demoData.technicians.map(t => t.resolved),
                    backgroundColor: '#4BC0C0',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Desempenho dos Técnicos',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    position: 'top',
                }
            }
        }
    });

    // Mostrar/ocultar seleção de datas personalizadas
    document.getElementById('period').addEventListener('change', function() {
        const customRange = document.getElementById('custom-date-range');
        customRange.style.display = this.value === 'custom' ? 'block' : 'none';
    });

    // Simular geração de relatório
    document.getElementById('generate-report').addEventListener('click', function() {
        alert('Relatório gerado com sucesso! Os gráficos foram atualizados.');
        // Aqui você poderia adicionar lógica para atualizar os gráficos com base nas seleções
    });

    // Adicionar eventos aos botões de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.closest('tr').querySelector('td').textContent;
            alert(`Filtrando por: ${category}`);
        });
    });

    // Adicionar eventos aos botões de detalhes
    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const dept = this.closest('tr').querySelector('td').textContent;
            alert(`Mostrando detalhes do departamento: ${dept}`);
        });
    });
});