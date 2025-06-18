 // ==============================================
        // CONFIGURAÇÃO DA API
        // ==============================================
        const API_BASE_URL = 'http://localhost:8080/api'; // Altere para sua URL da API Java
        const ENDPOINTS = {
            SUMMARY: '/reports/summary',
            DEPARTMENT: '/reports/department',
            STATUS_BY_DEPT: '/reports/status-by-department'
        };

        // ==============================================
        // FUNÇÕES PRINCIPAIS DE COMUNICAÇÃO COM A API
        // ==============================================

        /**
         * Busca dados da API Java
         * @param {string} endpoint - Endpoint da API
         * @param {Object} params - Parâmetros da requisição
         * @returns {Promise} Promise com os dados da resposta
         */
        async function fetchReportData(endpoint, params = {}) {
            try {
                // Converte parâmetros em query string
                const query = new URLSearchParams(params).toString();
                const url = `${API_BASE_URL}${endpoint}?${query}`;
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Adicione token JWT se necessário:
                        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erro na API: ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                console.error('Falha na requisição:', error);
                showAlert('error', 'Falha ao carregar dados');
                return null;
            }
        }

        /**
         * Carrega dados de resumo (cartões estatísticos)
         */
        async function loadSummary() {
            const data = await fetchReportData(ENDPOINTS.SUMMARY);
            if (!data) return;

            // Atualiza a interface
            document.getElementById('totalTickets').textContent = data.total || 0;
            document.getElementById('inProgressTickets').textContent = data.inProgress || 0;
            document.getElementById('resolvedTickets').textContent = data.resolved || 0;
            document.getElementById('highPriorityTickets').textContent = data.highPriority || 0;
        }

        /**
         * Carrega relatório por departamento
         */
        async function loadDepartmentReport() {
            const period = document.getElementById('period').value;
            const data = await fetchReportData(ENDPOINTS.DEPARTMENT, { period });
            if (!data) return;

            // Atualiza lista de departamentos
            const deptList = document.getElementById('dept-list');
            deptList.innerHTML = '';
            
            data.departments.forEach(dept => {
                const li = document.createElement('li');
                li.innerHTML = `${dept.name} <span class="dept-count">${dept.count} chamados</span>`;
                deptList.appendChild(li);
            });

            // Renderiza gráfico de barras
            renderBarChart(data.departments);
        }

        /**
         * Carrega status por departamento
         */
        async function loadStatusByDepartment() {
            const data = await fetchReportData(ENDPOINTS.STATUS_BY_DEPT);
            if (!data) return;

            renderDepartmentCharts(data);
        }

        // ==============================================
        // FUNÇÕES DE RENDERIZAÇÃO DE GRÁFICOS
        // ==============================================

        /**
         * Renderiza gráfico de barras
         * @param {Array} data - Dados dos departamentos
         */
        function renderBarChart(data) {
            const container = document.getElementById('bar-chart');
            container.innerHTML = '';

            // Encontra o valor máximo para escalonamento
            const maxValue = Math.max(...data.map(item => item.count));
            
            data.forEach(dept => {
                const height = maxValue > 0 ? (dept.count / maxValue) * 100 : 0;
                const bar = document.createElement('div');
                bar.className = 'bar';
                bar.style.height = `${height}%`;
                
                bar.innerHTML = `
                    <span class="bar-value">${dept.count}</span>
                    <span class="bar-label">${dept.name}</span>
                `;
                
                container.appendChild(bar);
            });

            // Aplica animação
            animateBars();
        }

        /**
         * Renderiza gráficos por departamento
         * @param {Array} data - Dados dos departamentos com status
         */
        function renderDepartmentCharts(data) {
            const container = document.getElementById('department-charts');
            container.innerHTML = '';

            data.forEach(dept => {
                const chartCard = document.createElement('div');
                chartCard.className = 'chart-card';
                
                // Encontra valor máximo para escalonamento
                const statuses = ['open', 'inProgress', 'closed'];
                const maxValue = Math.max(...statuses.map(status => dept[status] || 0));
                
                chartCard.innerHTML = `
                    <h3 class="chart-title">${dept.name}</h3>
                    <div class="chart" id="chart-${dept.id}"></div>
                `;
                
                container.appendChild(chartCard);
                
                // Renderiza barras individuais
                const chartContainer = document.getElementById(`chart-${dept.id}`);
                statuses.forEach(status => {
                    const count = dept[status] || 0;
                    const height = maxValue > 0 ? (count / maxValue) * 100 : 0;
                    
                    const bar = document.createElement('div');
                    bar.className = 'bar';
                    bar.style.height = `${height}%`;
                    
                    bar.innerHTML = `
                        <span class="bar-value">${count}</span>
                        <span class="bar-label">${getStatusLabel(status)}</span>
                    `;
                    
                    chartContainer.appendChild(bar);
                });
            });

            // Aplica animação
            animateBars();
        }

        // ==============================================
        // FUNÇÕES AUXILIARES
        // ==============================================

        /** Animação das barras */
        function animateBars() {
            const bars = document.querySelectorAll('.bar');
            bars.forEach(bar => {
                const originalHeight = bar.style.height;
                bar.style.height = '0%';
                
                setTimeout(() => {
                    bar.style.height = originalHeight;
                    bar.style.transition = 'height 1s ease-out';
                }, 300);
            });
        }

        /** Traduz status para português */
        function getStatusLabel(status) {
            const labels = {
                'open': 'Abertos',
                'inProgress': 'Andamento',
                'closed': 'Fechados'
            };
            return labels[status] || status;
        }

        /** Exibe alertas */
        function showAlert(type, message) {
            alert(`[${type.toUpperCase()}] ${message}`);
        }

        // ==============================================
        // INICIALIZAÇÃO E EVENT LISTENERS
        // ==============================================

        document.addEventListener('DOMContentLoaded', async () => {
            // Carrega todos os dados iniciais
            await loadSummary();
            await loadDepartmentReport();
            await loadStatusByDepartment();
            
            // Listeners para mudanças de filtro
            document.getElementById('period').addEventListener('change', loadDepartmentReport);
            document.getElementById('report-type').addEventListener('change', () => {
                // Implementar troca de tipo de relatório conforme necessário
                showAlert('info', 'Recarregando dados...');
                loadDepartmentReport();
            });

            // Listeners para botões de exportação
            document.getElementById('generate-pdf').addEventListener('click', () => {
                // Chamada para API de geração de PDF
                window.open(`${API_BASE_URL}/reports/pdf?period=${document.getElementById('period').value}`);
            });

            document.getElementById('export-excel').addEventListener('click', () => {
                // Chamada para API de exportação Excel
                window.open(`${API_BASE_URL}/reports/excel?period=${document.getElementById('period').value}`);
            });
        });