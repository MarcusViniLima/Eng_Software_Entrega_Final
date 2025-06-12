
        // Adicionando efeito de onda ao botão
        document.querySelector('.arrow-btn').addEventListener('click', function(e) {
            e.preventDefault();
            
            // Criando efeito visual antes de redirecionar
            this.classList.add('clicked');
            
            // Adicionando onda de clique
            const wave = document.createElement('div');
            wave.style.position = 'absolute';
            wave.style.borderRadius = '50%';
            wave.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            wave.style.width = '0';
            wave.style.height = '0';
            wave.style.top = '50%';
            wave.style.left = '50%';
            wave.style.transform = 'translate(-50%, -50%)';
            wave.style.zIndex = '1';
            wave.style.transition = 'width 0.5s, height 0.5s, opacity 0.5s';
            this.appendChild(wave);
            
            // Animando a onda
            setTimeout(() => {
                wave.style.width = '150px';
                wave.style.height = '150px';
                wave.style.opacity = '0';
            }, 10);
            
            // Redirecionando após o efeito
            setTimeout(() => {
                window.location.href = this.getAttribute('href');
            }, 500);
        });
