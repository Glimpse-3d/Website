document.addEventListener('DOMContentLoaded', () => {
    const arrow = document.querySelector('.arrow'); // Alterado para '.arrow' para selecionar qualquer seta
    const bottomLeft = document.querySelector('.bottom-left');
    const gallery = document.querySelector('.gallery');
    const title = document.querySelector('.title');
    const overlay = document.querySelector('.background-overlay'); // Fundo animado
  
    // Inicialmente, esconde a galeria e a parte inferior esquerda
    if (gallery && bottomLeft && title) {
      gallery.style.display = 'none';
      bottomLeft.style.display = 'none';
      title.style.animation = 'fadeInBottom 1s ease-out forwards';
    }
  
    // Variável para controlar o estado de animação do fundo
    let isBackgroundUp = false;
  
    // Evento para alternar a exibição da galeria e iniciar a animação de transição
    if (arrow) {
      arrow.addEventListener('click', () => {
        const isHidden = bottomLeft.style.display === 'none' || bottomLeft.style.display === '';
  
        // Alterna a exibição da galeria
        bottomLeft.style.display = isHidden ? 'block' : 'none';
        gallery.style.display = isHidden ? 'block' : 'none';
  
        // Aplica animação no título para mover para a esquerda
        if (title) {
          title.classList.toggle('move-left');
        }
  
        // Alterna a classe 'active' na seta
        arrow.classList.toggle('active');
  
        // Alterna o estado do fundo (subir ou descer)
        if (overlay) {
          if (isBackgroundUp) {
            overlay.classList.remove('up'); // Remove a classe para descer o fundo
          } else {
            overlay.classList.add('up'); // Adiciona a classe para subir o fundo
          }
          isBackgroundUp = !isBackgroundUp; // Inverte o estado para o próximo clique
        }
  
        // Animação de fechamento da galeria (opcional)
        if (!isHidden) {
          bottomLeft.classList.remove('hidden');
        } else {
          bottomLeft.classList.add('hidden');
        }
      });
    }
  
    // Seleciona os itens da galeria e o modal
    const galleryItems = document.querySelectorAll('.gallery-item img, .gallery-item video');
    const modal = document.querySelector('.modal');
    const modalImg = document.getElementById('img01');
    const modalVideo = document.getElementById('video01');
    const caption = document.getElementById('caption');
    const closeBtn = document.querySelector('.close');
    const prevArrow = document.querySelector('.modal .arrow.left');
    const nextArrow = document.querySelector('.modal .arrow.right');
  
    let currentIndex = 0;
  
    // Função para abrir o modal
    function openModal(index) {
      if (!modal) return;
      modal.style.display = 'flex';
      const item = galleryItems[index];
  
      if (item.tagName === 'IMG') {
        modalImg.src = item.src;
        modalImg.style.display = 'block';
        modalVideo.style.display = 'none';
      } else if (item.tagName === 'VIDEO') {
        const videoSource = item.querySelector('source');
        if (videoSource) {
          modalVideo.src = videoSource.src;
          modalVideo.style.display = 'block';
          modalImg.style.display = 'none';
          modalVideo.play(); // O vídeo começa a tocar quando expandido
        }
      }
  
      caption.textContent = item.alt || '';
      currentIndex = index;
      document.body.classList.add('blur-background'); // Efeito de fundo borrado
    }
  
    // Função para fechar o modal
    function closeModal() {
      if (!modal) return;
      modal.style.display = 'none';
      modalVideo.pause();
      modalVideo.currentTime = 0;
      document.body.classList.remove('blur-background');
    }
  
    // Função de navegação entre os itens da galeria
    function navigate(step) {
      currentIndex = (currentIndex + step + galleryItems.length) % galleryItems.length;
      openModal(currentIndex);
    }
  
    // Adiciona eventos aos itens da galeria
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openModal(index));
    });
  
    // Fecha o modal ao clicar no botão de fechar
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }
  
    // Fecha o modal ao clicar fora da imagem/vídeo
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  
    // Navegação entre os itens ao clicar nas setas
    if (prevArrow) {
      prevArrow.addEventListener('click', () => navigate(-1));
    }
  
    if (nextArrow) {
      nextArrow.addEventListener('click', () => navigate(1));
    }
  
    // Navegação ao clicar na imagem dentro do modal (avançar para o próximo item)
    modalImg.addEventListener('click', () => navigate(1)); // Clicar na imagem para avançar
    modalVideo.addEventListener('click', () => navigate(1)); // Clicar no vídeo para avançar
  });
  