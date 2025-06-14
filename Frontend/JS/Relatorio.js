  document.addEventListener('DOMContentLoaded', function() {
            // Animação das barras
            const bars = document.querySelectorAll('.bar');
            bars.forEach(bar => {
                const originalHeight = bar.style.height;
                bar.style.height = '0%';
                
                setTimeout(() => {
                    bar.style.height = originalHeight;
                    bar.style.transition = 'height 1s ease-out';
                }, 300);
            });
            
            // Interação com os botões
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Efeito visual
                    this.style.transform = 'scale(0.95)';
                    
                    setTimeout(() => {
                        this.style.transform = '';
                        alert('Operação realizada com sucesso!');
                    }, 200);
                });
            });
            
            // Interação com os itens da lista
            const listItems = document.querySelectorAll('.dept-list li');
            listItems.forEach(item => {
                item.addEventListener('click', function() {
                    listItems.forEach(li => li.style.background = '#f8f9fa');
                    this.style.background = '#e0f7ff';
                });
            });
        });