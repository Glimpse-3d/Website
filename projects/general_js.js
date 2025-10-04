// ----------------- ESCOLHE O PROJECTO --------------------------------------------------------------------------------------------------
let globalProjectData = null;

function getModelFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const model = urlParams.get('model');
  return model;
}

// ----------------- CARREGAR O JSON E AS PROPRIEDADES DE CADA MODELO --------------------------------------------------------------------------------------------------
async function loadProjectData() {
    try {
        const projectFolder = getModelFromURL();
        console.log('Selected project folder:', projectFolder);

        if (!projectFolder || projectFolder === 'default_project_folder') {
            console.warn('No specific project selected in URL, loading default or handling accordingly.');
        }

        const response = await fetch(`./${projectFolder}/data.json`);
        console.log('Fetch response:', response);

        if (!response.ok) {
            throw new Error(`Failed to load JSON: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('JSON data loaded:', data);
        globalProjectData = data; // Store data globally for other functions to access

        const modelViewer = document.getElementById('model-viewer');
        if (!modelViewer) {
            console.error('Error: model-viewer element not found!');
            return null;
        }

        // Assign attributes to model-viewer
        if (data.modelSrc) modelViewer.setAttribute('src', `./${projectFolder}/${data.modelSrc}`);
        if (data.environmentImage) modelViewer.setAttribute('environment-image', `./${projectFolder}/${data.environmentImage}`);
        if (data.cameraOrbit) modelViewer.setAttribute('camera-orbit', data.cameraOrbit);
        if (data['min-camera-orbit']) modelViewer.setAttribute('min-camera-orbit', data['min-camera-orbit']);
        if (data['max-camera-orbit']) modelViewer.setAttribute('max-camera-orbit', data['max-camera-orbit']);
        if (data['min-field-of-view']) modelViewer.setAttribute('min-field-of-view', data['min-field-of-view']);
        if (data['max-field-of-view']) modelViewer.setAttribute('max-field-of-view', data['max-field-of-view']);
        if (data['disable-zoom'] !== undefined) modelViewer.disableZoom = data['disable-zoom'];
        if (data['disable-pan'] !== undefined) modelViewer.disablePan = data['disable-pan'];
        if (!modelViewer.hasAttribute('camera-controls')) modelViewer.setAttribute('camera-controls', '');

        // Update project texts
            document.getElementById('model-title').textContent = data.title || 'Untitled Model';

            const backgroundOverlay = document.querySelector('.background-overlay');
            const bottomColor = "#ffffffff"; // fallback caso não haja cor no JSON

            if (data.backgroundTopColor && backgroundOverlay) {
                const topColor = data.backgroundTopColor;

                // Converte HEX para RGB para criar versão transparente
                const r = parseInt(topColor.slice(1,3),16);
                const g = parseInt(topColor.slice(3,5),16);
                const b = parseInt(topColor.slice(5,7),16);

                backgroundOverlay.style.background = `
                    linear-gradient(
                        to bottom,
                        ${topColor} 0%,
                        ${topColor} 0%,
                        rgba(${r}, ${g}, ${b}, 0) 100%
                    )
                `;
            } else if (backgroundOverlay) {
                backgroundOverlay.style.background = `
                    linear-gradient(
                        to bottom,
                        ${bottomColor} 0%,
                        ${bottomColor} 100%
                    )
                `;
}

        document.getElementById('project-name').innerHTML = data.name ? data.name.replace(/\n/g, '<br>') : 'Project Name';
        document.getElementById('project-designer').textContent = data.designer || '';
        document.getElementById('project-location').textContent = data.location || '';
        document.getElementById('project-description').innerHTML = data.description || '';

const galleryItemsContainer = document.querySelector('.gallery-items');
const modal = document.querySelector('.modal');
const modalImg = document.getElementById('img01');
const modalCaption = document.getElementById('modal-caption');
const closeBtn = document.querySelector('.modal .close');

if (galleryItemsContainer && data.galleryImages && Array.isArray(data.galleryImages)) {
    galleryItemsContainer.innerHTML = '';

    data.galleryImages.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'gallery-item';

        const img = document.createElement('img');
        img.src = `./${projectFolder}/IMG/${item.src}`;
        img.alt = item.caption || `Image ${index + 1}`;
        img.style.cursor = 'pointer';

        // Abrir modal ao clicar na imagem
        img.addEventListener('click', () => {
            modal.style.display = 'block';
            modalImg.style.display = 'block';
            modalImg.src = img.src;
            modalCaption.textContent = item.caption || '';
            // Se quiser trabalhar com vídeos, trate aqui para exibir vídeo ao invés de img
        });

        div.appendChild(img);
        galleryItemsContainer.appendChild(div);
    });
}

if (closeBtn && modal) { // ✅ Verifica se closeBtn (e modal) existem antes de tentar adicionar o listener
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        modalImg.style.display = 'none';
        modalCaption.textContent = '';
    });
}

        // Remove old hotspots before adding new ones
        const oldHotspots = modelViewer.querySelectorAll('[slot^="hotspot-"]');
        oldHotspots.forEach(h => h.remove());

        // Add hotspots based on JSON data
if (data.hotspots && Array.isArray(data.hotspots)) {
    data.hotspots.forEach(hotspot => {
        const hotspotElement = document.createElement('button');
        hotspotElement.className = 'hotspot';
        hotspotElement.slot = 'hotspot-' + hotspot.id;
        hotspotElement.setAttribute('data-position', hotspot.position);
        if (hotspot.normal) {
            hotspotElement.setAttribute('data-normal', hotspot.normal);
        }
        hotspotElement.title = hotspot.text || '';

        if (hotspot.action) {
            hotspotElement.setAttribute('data-action', hotspot.action);
        }
        // Store material group for "ChangeMaterials" action
        if (hotspot.materialGroup) {
            hotspotElement.setAttribute('data-material-group', hotspot.materialGroup);
        }
        // Store initialName for direct use in hotspot action
        if (hotspot.initialName) {
            hotspotElement.setAttribute('data-initial-name', hotspot.initialName);
        }
        // Store URL for openUrl action
        if (hotspot.url) {
            hotspotElement.setAttribute('data-url', hotspot.url);
        }

        // --- ADD THESE LINES FOR ChangeView ACTION ---
        if (hotspot.cameraOrbit) {
            hotspotElement.setAttribute('data-camera-orbit', hotspot.cameraOrbit);
        }
        if (hotspot.cameraTargetPosition) {
            hotspotElement.setAttribute('data-camera-target-position', hotspot.cameraTargetPosition);
        }
        // This is optional, only if you want fieldOfView to be dynamic from JSON
        if (hotspot.fieldOfView) {
            hotspotElement.setAttribute('data-field-of-view', hotspot.fieldOfView);
        }
        // --- END OF ADDITIONS ---

        if (hotspot.image) {
            const img = document.createElement('img');
            img.src = `./projects/${hotspot.image.replace('../', '')}`;
            console.log(`Hotspot icon src set to: ${img.src}`);
            img.alt = hotspot.text || '';
            img.classList.add('hotspot-icon');
            hotspotElement.appendChild(img);
        } else {
            hotspotElement.textContent = '●';
        }

        modelViewer.appendChild(hotspotElement);
    });
}

        // --- NEW SECTION: Dynamically Generate Material Change Buttons ---
        const materialChangeContainer = document.getElementById('material-change-container');
        if (materialChangeContainer && data.materials) {
            // Remove any old dynamically generated texture groups
            const existingTextureGroups = materialChangeContainer.querySelectorAll('.texture-group');
            existingTextureGroups.forEach(group => group.remove());

            for (const groupKey in data.materials) {
                if (data.materials.hasOwnProperty(groupKey)) {
                    const materialGroupData = data.materials[groupKey];

                    const textureGroupDiv = document.createElement('div');
                    textureGroupDiv.className = 'texture-group';
                    textureGroupDiv.id = `${groupKey}-textures`; 

                    materialGroupData.textures.forEach(texture => {
                        const button = document.createElement('button');
                        button.className = 'change-texture';
                        button.setAttribute('data-material', materialGroupData.materialIndex);
                        button.setAttribute('data-texture', `./${projectFolder}/${texture.textureFile}`);
                        button.setAttribute('data-material-name', texture.name);

                        const img = document.createElement('img');
                        // Texture thumbnail paths are relative to project folder
                        img.src = `./${projectFolder}/${texture.thumbnail}`;
                        img.className = 'texture-preview';
                        img.alt = texture.name;

                        button.appendChild(img);
                        textureGroupDiv.appendChild(button);
                    });
                    materialChangeContainer.appendChild(textureGroupDiv);
                }
            }
        }
        return modelViewer;
    } catch (error) {
        console.error('Error loading project:', error);
        return null;
    }
}



//-----------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
    const modelViewer = await loadProjectData();

    if (!modelViewer) {
        console.error("ModelViewer não disponível. Algumas funcionalidades podem não funcionar.");
        return;
    }

    // --- FUNÇÃO: toggleMaterialAlpha --- (No changes needed here)
    function toggleMaterialAlpha(hotspotData, projectData) {
        const targetMaterialName = hotspotData.targetMaterial;
        const alphaOn = hotspotData.alphaValueOn;
        const alphaOff = hotspotData.alphaValueOff;

        if (!projectData || !projectData.materials || !projectData.materials[targetMaterialName]) {
            console.error(`Erro: Dados do material '${targetMaterialName}' não encontrados.`);
            return;
        }

        const materialConfig = projectData.materials[targetMaterialName];
        const materialIndex = materialConfig.materialIndex;

        if (!modelViewer.model || !modelViewer.model.materials || !modelViewer.model.materials[materialIndex]) {
            console.error(`ERRO: Modelo ou material no índice ${materialIndex} não encontrado.`);
            return;
        }

        const actual3DMaterial = modelViewer.model.materials[materialIndex];
        const currentOpacity = actual3DMaterial.opacity;

        if (Math.abs(currentOpacity - alphaOn) < 0.001) {
            actual3DMaterial.opacity = alphaOff;
            actual3DMaterial.transparent = (alphaOff < 1.0);
            console.log(`Material '${targetMaterialName}' -> opacidade OFF (${alphaOff})`);
        } else {
            actual3DMaterial.opacity = alphaOn;
            actual3DMaterial.transparent = true;
            console.log(`Material '${targetMaterialName}' -> opacidade ON (${alphaOn})`);
        }
    }

    // --- BOTÃO DE ALTERNÂNCIA DE HOTSPOTS --- (Adjusted to remove dimension toggle)
    const toggleButton = document.getElementById('toggle-hotspots-button');
    if (toggleButton) {
        modelViewer.classList.remove('hotspots-visible'); // Estado inicial
        toggleButton.addEventListener('click', () => {
            modelViewer.classList.toggle('hotspots-visible');
            // No longer calling toggleDimensionsVisibility here
        });
    }

    // --- ELEMENTOS E VARIÁVEIS PARA TROCA DE MATERIAL --- (No changes needed here)
    const materialContainer = document.getElementById("material-change-container");
    const materialName = document.getElementById('material-name');
    let selectedMaterialName = '';
    let lastSelectedMaterialWood = '';
    let lastSelectedMaterialLeather = '';

    if (materialContainer) {
        materialContainer.style.opacity = "0";
        materialContainer.style.visibility = "hidden";
        materialContainer.style.transform = "translateY(20px)";
        materialContainer.style.display = "flex";
    }

    function showMaterialGroup(groupElement, titleText, initialMaterialName, lastSelectedMaterial) {
        if (!materialContainer || !groupElement) return;

        materialContainer.querySelectorAll('.texture-group').forEach(group => group.style.display = "none");
        groupElement.style.display = "flex";

        const lastSelectedButton = groupElement.querySelector(`.change-texture[data-material-name='${lastSelectedMaterial}']`);
        const allButtons = groupElement.querySelectorAll('.change-texture');
        allButtons.forEach(btn => btn.classList.remove('selected'));
        
        if (lastSelectedButton) {
            selectedMaterialName = lastSelectedMaterial;
            lastSelectedButton.classList.add('selected');
        } else {
            const firstButton = groupElement.querySelector('.change-texture');
            if (firstButton) {
                selectedMaterialName = firstButton.getAttribute('data-material-name');
                firstButton.classList.add('selected');
            }
        }
        if (materialName) materialName.textContent = selectedMaterialName;

        materialContainer.style.opacity = "1";
        materialContainer.style.transform = "translateY(0)";
        materialContainer.style.visibility = "visible";
    }

    function hideMaterialContainer() {
        if (!materialContainer) return;
        materialContainer.style.opacity = "0";
        materialContainer.style.transform = "translateY(20px)";
        setTimeout(() => {
            materialContainer.style.visibility = "hidden";
        }, 300);
    }

    document.addEventListener("click", (event) => {
        if (materialContainer && !materialContainer.contains(event.target) && !event.target.closest('.hotspot')) {
            hideMaterialContainer();
        }
    });

    materialContainer?.addEventListener("click", (event) => {
        event.stopPropagation();
    });


        // Initialize materials
        if (window.globalProjectData && window.globalProjectData.materials) {
            for (const key in window.globalProjectData.materials) {
                const materialConfig = window.globalProjectData.materials[key];
                if (materialConfig.textures && materialConfig.textures.length > 0) {
                    const materialIndex = materialConfig.materialIndex;
                    const initialAlpha = materialConfig.textures[0].initialAlpha;

                    if (modelViewer.model && modelViewer.model.materials[materialIndex]) {
                        const material = modelViewer.model.materials[materialIndex];
                        material.opacity = initialAlpha;
                        material.transparent = (initialAlpha < 1.0);
                    }
                }
            }
        }


        // ----------------- MANIPULA O QUE OS HOTSPOTS FAZEM --------------------------------------------------------------------------------------------------
        modelViewer.addEventListener('click', (event) => {
        const clickedElement = event.target;
        const hotspotElement = clickedElement.closest('.hotspot');

        if (hotspotElement) {
        event.stopPropagation(); // Impede a propagação do evento para hotspots tratados
        console.log('Hotspot clicado:', hotspotElement.id);

        const hotspotId = hotspotElement.dataset.id;
        const actionType = hotspotElement.dataset.action;
        const url = hotspotElement.dataset.url;

        console.log('Ação do hotspot detectada:', actionType);

        switch (actionType) {
            case 'ChangeMaterials':
                const materialGroupKey = hotspotElement.dataset.materialGroup;
                const materialData = globalProjectData.materials[materialGroupKey];

                if (materialData) {
                    const currentMaterialGroupElement = document.getElementById(`${materialGroupKey}-textures`);
                    showMaterialGroup(
                        currentMaterialGroupElement,
                        materialData.groupTitle,
                        materialData.initialName,
                        materialGroupKey === 'wood' ? lastSelectedMaterialWood : lastSelectedMaterialLeather
                    );
                    console.log(`[Hotspot - ChangeMaterials] Acionada ação para o grupo: ${materialGroupKey}`);
                } else {
                    console.warn(`[Hotspot - ChangeMaterials] Dados do grupo de material não encontrados para a chave: ${materialGroupKey}`);
                }
                break;

            case 'ChangeView':
                // --- CONSOLE LOGS ESPECÍFICOS PARA 'ChangeView' ---
                console.log(`[Hotspot - ChangeView] Hotspot de vista clicado: ${hotspotId}`);

                const cameraOrbit = hotspotElement.dataset.cameraOrbit;
                const cameraTarget = hotspotElement.dataset.cameraTargetPosition;
                const fieldOfView = hotspotElement.dataset.fieldOfView || '45deg';

                console.log(`[Hotspot - ChangeView] Tentando mudar a câmera para:`);
                console.log(`[Hotspot - ChangeView]   - cameraOrbit: ${cameraOrbit}`);
                console.log(`[Hotspot - ChangeView]   - cameraTarget: ${cameraTarget}`);
                console.log(`[Hotspot - ChangeView]   - fieldOfView: ${fieldOfView}`);


                if (modelViewer) {
                    modelViewer.cameraOrbit = cameraOrbit;
                    modelViewer.cameraTarget = cameraTarget;
                    modelViewer.fieldOfView = fieldOfView;
                    console.log(`[Hotspot - ChangeView] Câmera do ModelViewer atualizada com sucesso.`);
                } else {
                    console.error("[Hotspot - ChangeView] Erro: Elemento 'modelViewer' não encontrado para alterar a câmera.");
                }
                break;

            default:
                console.warn(`[Hotspot] Ação de hotspot desconhecida ou não implementada: ${actionType}`);
                break;
        }
    }
});




  // ----------------- ALTRERA MATERIAIS USANDO HOTSPOT --------------------------------------------------------------------------------------------------
  materialContainer.addEventListener('click', async (event) => {
      const button = event.target.closest('.change-texture');
      if (button && modelViewer.model) { // Ensure model exists before attempting material changes
          const materialIndex = parseInt(button.getAttribute("data-material")); // Parse as integer
          const newTextureURL = button.getAttribute("data-texture");
          const buttonMaterialName = button.getAttribute("data-material-name");

          // Only change if a different material is selected
          if (selectedMaterialName !== buttonMaterialName) {
              try {
                  const material = modelViewer.model.materials[materialIndex];
                  if (!material) {
                      console.error(`Material at index ${materialIndex} not found in model.`);
                      return;
                  }

                  const texture = await modelViewer.createTexture(newTextureURL);
                  material.pbrMetallicRoughness.baseColorTexture.setTexture(texture);

                  selectedMaterialName = buttonMaterialName;
                  if (materialName) materialName.style.opacity = 0;
                  setTimeout(() => {
                      if (materialName) materialName.textContent = selectedMaterialName;
                      if (materialName) materialName.style.opacity = 1;
                  }, 150);

                  // Determine which last selected variable to update
                  const parentGroup = button.closest('.texture-group');
                  if (parentGroup) {
                      if (parentGroup.id === 'wood-textures') {
                          lastSelectedMaterialWood = buttonMaterialName;
                      } else if (parentGroup.id === 'leather-textures') {
                          lastSelectedMaterialLeather = buttonMaterialName;
                      }
                  }

                  // Remove 'selected' from all buttons in the current group and add to clicked one
                  if (parentGroup) {
                      parentGroup.querySelectorAll('.change-texture').forEach(btn => btn.classList.remove('selected'));
                  }
                  button.classList.add('selected');

              } catch (error) {
                  console.error('Error changing texture:', error);
              }
          }
      }
  });
});



// ----------------- ESCONDE/MOSTRA AO CLICAR NA SETA --------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const arrowHitbox = document.querySelector('.arrow-hitbox');
  const arrow = document.querySelector('.arrow');
  const bottomLeftContainer = document.querySelector('.bottom-left-container');
  const gallery = document.querySelector('.gallery');
  const title = document.querySelector('.title');
  const overlay = document.querySelector('.background-overlay');

  let isGalleryOpen = false;
  let isBottomLeftOpen = false;
  let isBackgroundUp = false;

  if (gallery && bottomLeftContainer && title) {
    gallery.style.display = 'none';
    bottomLeftContainer.style.bottom = '-100%';
    bottomLeftContainer.style.display = 'none';
    title.style.animation = 'fadeInBottom 1s ease-out forwards';
  }

  if (arrowHitbox) {
    arrowHitbox.addEventListener('click', () => {
      const isHidden = bottomLeftContainer.style.bottom === '-100%' || bottomLeftContainer.style.bottom === '';

      gallery.style.display = isHidden ? 'block' : 'none';
      title.classList.toggle('move-left');
      arrow.classList.toggle('active'); // ← Toggle the rotation here

      if (overlay) {
        overlay.classList.toggle('up', !isBackgroundUp);
        isBackgroundUp = !isBackgroundUp;
      }

      if (isBottomLeftOpen) {
        bottomLeftContainer.classList.add('closed');
        setTimeout(() => {
          bottomLeftContainer.style.display = 'none';
        }, 500);
      } else {
        bottomLeftContainer.classList.remove('closed');
        bottomLeftContainer.style.display = 'block';
      }
      isBottomLeftOpen = !isBottomLeftOpen;

      if (isGalleryOpen) {
        gallery.classList.add('closed');
      } else {
        gallery.classList.remove('closed');
      }
      isGalleryOpen = !isGalleryOpen;
    });
  }
});



// ----------------- MODAL GALERIA --------------------------------------------------------------------------------------------------
const galleryContainer = document.querySelector('.gallery-items');
const modal = document.querySelector('.modal');
const modalImg = document.getElementById('img01');
const modalVideo = document.getElementById('video01');
const videoSource = document.getElementById('videoSource');
const closeBtn = document.querySelector('.close');
const prevArrow = document.querySelector('.modal .arrow.left');
const nextArrow = document.querySelector('.modal .arrow.right');
const modalCaption = document.getElementById('modal-caption');

let currentIndex = 0;
let galleryItems = [];
let galleryData = null; // JSON do projeto carregado

function updateGalleryItems() {
  galleryItems = Array.from(galleryContainer.querySelectorAll('img, video'));
}

function closeModal() {
  modal.style.display = 'none';
  modalVideo.pause();
  modalVideo.currentTime = 0;
  document.body.classList.remove('blur-background');
}

function navigate(step) {
  currentIndex = (currentIndex + step + galleryItems.length) % galleryItems.length;
  openModal(currentIndex);
}

function openModal(index) {
  if (!modal) return;
  if (!galleryItems.length) updateGalleryItems();

  modal.style.display = 'flex';
  const item = galleryItems[index];

  if (item.tagName === 'IMG') {
    modalImg.src = item.src;
    modalImg.style.display = 'block';
    modalVideo.style.display = 'none';

    if (globalProjectData && globalProjectData.galleryImages) {
      const imgFileName = item.src.split('/').pop();
      const imgData = globalProjectData.galleryImages.find(img => img.src === imgFileName);
      modalCaption.textContent = imgData ? imgData.caption : '';
    } else {
      modalCaption.textContent = '';
    }
  } else if (item.tagName === 'VIDEO') {
    modalCaption.textContent = ''; // ou legenda de vídeo, se quiser
    modalVideo.style.display = 'block';
    modalImg.style.display = 'none';
    videoSource.src = item.querySelector('source').src;
    modalVideo.load();
    modalVideo.play();
  }

  currentIndex = index;
  document.body.classList.add('blur-background');
}

// Event listeners fora da função openModal, para evitar múltiplas adições de listeners
galleryContainer?.addEventListener('click', (event) => {
  const target = event.target;
  if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
    updateGalleryItems();
    const index = galleryItems.indexOf(target);
    if (index !== -1) openModal(index);
  }
});

closeBtn?.addEventListener('click', closeModal);

window.addEventListener('click', (event) => {
  // Fecha modal se clicar fora da imagem/vídeo (no background do modal)
  if (event.target === modal) closeModal();
});

prevArrow?.addEventListener('click', () => navigate(-1));
nextArrow?.addEventListener('click', () => navigate(1));
modalImg?.addEventListener('click', () => navigate(1));
modalVideo?.addEventListener('click', () => navigate(1));



// ----------------- BOTAO AR PARA QR CODE E FUNCIONALIDADES --------------------------------------------------------------------------------------------------

let isQRCodeVisible = false;
let qrCodeInstance = null;

function getProjectFolderFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectFromQuery = urlParams.get('project');
    if (projectFromQuery) return projectFromQuery;

    const pathSegments = window.location.pathname.split('/');
    const projectsIndex = pathSegments.indexOf('projects');
    if (projectsIndex > -1 && pathSegments.length > projectsIndex + 1) {
        return pathSegments[projectsIndex + 1];
    }
    return null;
}

function generateQRCode(buttonElement) {
    const introOverlay = document.getElementById("qr-intro-overlay");
    const introMessage = introOverlay?.querySelector('.qr-intro-message');
    const container = document.getElementById("qr-code-container");
    const logo = document.getElementById("ar-logo");

    if (!introOverlay || !introMessage || !container) {
        console.error("❌ Elementos essenciais do QR code não foram encontrados.");
        return;
    }

    // Close QR code if clicked outside (no buttonElement)
    if (!buttonElement) {
        if (isQRCodeVisible) closeQRCode();
        return;
    }

    if (!isQRCodeVisible) {
        // Abre QR code e troca cor dos ícones
        openQROverlay();

        // Open QR code with intro message
        introOverlay.classList.add("show");
        introMessage.style.display = 'block';
        container.style.display = "none";
        container.classList.remove("visible");
        logo?.classList.remove("fade-out");

        // Reset animation
        introMessage.style.animation = 'none';
        introMessage.offsetHeight; // trigger reflow
        introMessage.style.animation = null;

        setTimeout(() => {
            introMessage.style.display = 'none';
            showQRCodeInstructions(buttonElement);
        }, 3000);
    } else {
        closeQRCode();
    }
}

function closeQRCode() {
    if (!isQRCodeVisible) return; // no need if already closed

    const introOverlay = document.getElementById("qr-intro-overlay");
    const introMessage = introOverlay?.querySelector('.qr-intro-message');
    const container = document.getElementById("qr-code-container");
    const logo = document.getElementById("ar-logo");

    if (!introOverlay || !introMessage || !container) return;

    container.classList.remove("visible");
    setTimeout(() => {
        container.style.display = "none";
        // Clear preview media inside container
        const previewContainer = document.getElementById("ar-preview-container");
        if (previewContainer) previewContainer.innerHTML = '';
    }, 300);

    introOverlay.classList.remove("show");
    logo?.classList.remove("fade-out");

    introMessage.style.display = 'block';
    isQRCodeVisible = false;

    // Aqui chama para voltar ao estado normal (sem filtro branco)
    closeQROverlay();
}

function showQRCodeInstructions(buttonElement) {
    const projectFolder = getProjectFolderFromURL();
    if (!projectFolder) {
        console.error("❌ Não foi possível determinar a pasta do projeto.");
        return;
    }

    const mediaType = buttonElement?.dataset?.mediaType;
    if (!mediaType) {
        console.error("❌ O botão está sem o atributo 'data-media-type'.");
        return;
    }

    const qrCodeUrl = `https://paulolopess.github.io/website/projects/${projectFolder}/${projectFolder}-viewer.html`;

    const container = document.getElementById("qr-code-container");
    const previewContainer = document.getElementById("ar-preview-container");
    const qrCodeDiv = document.getElementById("qr-code");

    if (!container || !previewContainer || !qrCodeDiv) return;

    previewContainer.innerHTML = ''; // Clear before inserting new content

    const video = document.createElement("video");
    video.src = `./${projectFolder}/IMG/preview.mov`;
    video.controls = false;
    video.autoplay = false;
    video.loop = true;
    video.muted = true;
    video.classList.add('qr-preview-media');

    // Append the video element immediately
    previewContainer.appendChild(video);

    // After the container is visible, start playing the video with a delay
    container.style.display = 'flex';
    setTimeout(() => {
        container.classList.add('visible');

        // Delay video playback by 1 second after the container becomes visible
        setTimeout(() => {
            // Check if video is loaded and ready to play
            if (video.readyState >= 3) { // HAVE_FUTURE_DATA or HAVE_ENOUGH_DATA
                video.play().catch(error => {
                    console.warn("Autoplay was prevented, trying to play manually later:", error);
                    // Fallback to image if video can't play (e.g., autoplay policy)
                    showImageFallback(projectFolder, previewContainer);
                });
            } else {
                video.addEventListener('loadeddata', () => {
                    video.play().catch(error => {
                        console.warn("Autoplay prevented after loadeddata, trying to play manually later:", error);
                        showImageFallback(projectFolder, previewContainer);
                    });
                }, { once: true }); // Use { once: true } to remove the listener after it fires
                video.addEventListener('error', () => {
                    console.error("Error loading video, falling back to image.");
                    showImageFallback(projectFolder, previewContainer);
                }, { once: true });
            }
        }, 300); // 1000ms = 1 second delay
    }, 10); // Small delay to allow display:flex to apply before transition

    // Function to handle image fallback
    function showImageFallback(folder, container) {
        container.innerHTML = ''; // Clear video if it was appended
        const img = document.createElement("img");
        img.src = `./${folder}/IMG/preview.jpg`;
        img.alt = "Preview AR";
        img.classList.add('qr-preview-media');
        container.appendChild(img);
    }

    // Existing QR code generation logic
    if (qrCodeInstance) {
        qrCodeInstance.clear();
        qrCodeInstance.makeCode(qrCodeUrl);
    } else {
        qrCodeInstance = new QRCode(qrCodeDiv, {
            text: qrCodeUrl,
            width: 150,
            height: 150,
        });
    }

    isQRCodeVisible = true;
}

document.addEventListener("DOMContentLoaded", () => {
    const qrButton = document.getElementById("ar-qr-code");
    const introOverlay = document.getElementById("qr-intro-overlay");
    const qrContainer = document.getElementById("qr-code-container");
    const blurBackground = document.getElementById("qr-blur-background");

    qrButton?.addEventListener("click", () => generateQRCode(qrButton));

    introOverlay?.addEventListener("click", (e) => {
        if (e.target === introOverlay) {
            closeQRCode();
        }
    });

    blurBackground?.addEventListener("click", () => {
        closeQRCode();
    });

    qrContainer?.addEventListener("click", (e) => e.stopPropagation());
});




// ----------------- MUDA ICONES PARA BRANCO BOTAO AR --------------------------------------------------------------------------------------------------

function openQROverlay() {
  const logo = document.getElementById("back-logo");
  const arIcon = document.getElementById("ar-logo");

  logo?.classList.add("white-icon");
  arIcon?.classList.add("white-icon");
  
  // your existing code to show overlay
}

function closeQROverlay() {
  const logo = document.getElementById("back-logo");
  const arIcon = document.getElementById("ar-logo");

  logo?.classList.remove("white-icon");
  arIcon?.classList.remove("white-icon");

  // your existing code to hide overlay
}
