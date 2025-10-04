document.addEventListener('DOMContentLoaded', () => {
    const arrow = document.querySelector('.arrow');
    const bottomLeftContainer = document.querySelector('.bottom-left-container');
    const gallery = document.querySelector('.gallery');
    const title = document.querySelector('.title');
    const overlay = document.querySelector('.background-overlay');
    const hotspots = document.querySelectorAll('.Hotspot'); // Select all hotspots
  
    let isGalleryOpen = false; // To track if the gallery is open or closed
    let isBottomLeftOpen = false; // To track if the bottom-left container is open or closed
  
    if (gallery && bottomLeftContainer && title) {
      gallery.style.display = 'none';
      bottomLeftContainer.style.bottom = '-100%'; // Initially off-screen
      bottomLeftContainer.style.display = 'none'; // Hide initially
      title.style.animation = 'fadeInBottom 1s ease-out forwards';
    }
  
    // Hide hotspots initially
    hotspots.forEach(hotspot => hotspot.style.display = 'none');
  
    let isBackgroundUp = false;
  
    if (arrow) {
      arrow.addEventListener('click', () => {
        const isHidden = bottomLeftContainer.style.bottom === '-100%' || bottomLeftContainer.style.bottom === '';
  
        // Toggle visibility of elements
        gallery.style.display = isHidden ? 'block' : 'none';
        title.classList.toggle('move-left');
        arrow.classList.toggle('active');
  
        if (overlay) {
          overlay.classList.toggle('up', !isBackgroundUp);
          isBackgroundUp = !isBackgroundUp;
        }
  
        // Toggle bottom-left container animation and state
        if (isBottomLeftOpen) {
          bottomLeftContainer.classList.add('closed');
          bottomLeftContainer.style.display = 'none'; // Hide when closed
        } else {
          bottomLeftContainer.classList.remove('closed');
          bottomLeftContainer.style.display = 'block'; // Show when opened
        }
  
        // Toggle the bottom-left state
        isBottomLeftOpen = !isBottomLeftOpen;
  
        // Handle hotspots visibility with fade effect
        if (isBottomLeftOpen) {
          hotspots.forEach(hotspot => {
            hotspot.style.display = 'block'; // Show hotspots
            setTimeout(() => {
              hotspot.style.opacity = '1'; // Fade in
              hotspot.classList.remove('hidden'); // Remove hidden class after fading in
            }, 100); // Small delay before fading in
          });
        } else {
          hotspots.forEach(hotspot => {
            hotspot.style.opacity = '0'; // Fade out
            // After the fade-out, hide them
            setTimeout(() => {
              hotspot.classList.add('hidden'); // Add hidden class after fade
            }, 100); // Match the fade-out duration
          });
        }
  
        // Handle gallery animation
        if (isGalleryOpen) {
          gallery.classList.add('closed');
        } else {
          gallery.classList.remove('closed');
        }
  
        // Toggle the gallery state
        isGalleryOpen = !isGalleryOpen;
      });
    }
  });
  
  
  
  


  


// --------------------- MODAL GALLERY ------------------------------------------------------------------------------

const galleryItems = document.querySelectorAll('.gallery-item img, .gallery-item video');
const modal = document.querySelector('.modal');
const modalImg = document.getElementById('img01');
const modalVideo = document.getElementById('video01');
const caption = document.getElementById('caption');
const closeBtn = document.querySelector('.close');
const prevArrow = document.querySelector('.modal .arrow.left');
const nextArrow = document.querySelector('.modal .arrow.right');

let currentIndex = 0;

// Function to open the modal and display the selected gallery item
function openModal(index) {
  if (!modal) return;
  
  modal.style.display = 'flex';
  const item = galleryItems[index];

  // If it's an image, show it in the modal
  if (item.tagName === 'IMG') {
    modalImg.src = item.src;
    modalImg.style.display = 'block';
    modalVideo.style.display = 'none';
  } 
  // If it's a video, show it in the modal and play it
  else if (item.tagName === 'VIDEO') {
    const videoSource = item.querySelector('source');
    if (videoSource) {
      modalVideo.src = videoSource.src;
      modalVideo.style.display = 'block';
      modalImg.style.display = 'none';
      modalVideo.play();
    }
  }

  // Update the caption and current index
  caption.textContent = item.alt || '';
  currentIndex = index;

  // Blur the background when the modal is open
  document.body.classList.add('blur-background');
}

// Function to close the modal
function closeModal() {
  if (!modal) return;
  modal.style.display = 'none';

  // Pause and reset the video when closing
  if (!modalVideo.paused) {
    modalVideo.pause();
  }
  modalVideo.currentTime = 0;

  // Remove the blur effect from the background
  document.body.classList.remove('blur-background');
}

// Function to navigate between gallery items
function navigate(step) {
  currentIndex = (currentIndex + step + galleryItems.length) % galleryItems.length;
  openModal(currentIndex);
}

// Add click event listeners to gallery items (images and videos)
galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => openModal(index));
});

// Add click event listener to close button
closeBtn?.addEventListener('click', closeModal);

// Add click event listener to close modal when clicking outside of it
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

// Add event listeners for the navigation arrows
prevArrow?.addEventListener('click', () => navigate(-1));
nextArrow?.addEventListener('click', () => navigate(1));

// Add event listener to navigate on image click (next)
modalImg.addEventListener('click', () => navigate(1));


// --------------------- ALTERAR TEXTURAS ------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const materialContainer = document.getElementById("material-change-container");
  const woodGroup = document.getElementById("wood-textures");
  const leatherGroup = document.getElementById("leather-textures");
  const materialTitle = document.getElementById('material-title');
  const materialName = document.getElementById('material-name');
  let selectedMaterialName = ''; // Keeps track of the selected material name
  let lastSelectedMaterialWood = ''; // Last selected material for wood group
  let lastSelectedMaterialLeather = ''; // Last selected material for leather group
  let hotspotSelected = false; // Track hotspot selection state

  if (materialContainer) {
      materialContainer.style.display = "none";
  }

  // Show material group with title
  function showMaterialGroup(group, titleText, name, lastSelectedMaterial) {
      if (!materialContainer) return;

      materialContainer.style.display = "block"; // Ensure it's visible

      woodGroup.style.display = "none";
      leatherGroup.style.display = "none";

      if (group) {
          group.style.display = "flex";
          const selectedButton = group.querySelector(`.change-texture[data-material-name='${lastSelectedMaterial}']`);
          if (selectedButton) {
              selectedMaterialName = lastSelectedMaterial;
              materialName.textContent = selectedMaterialName;
              selectedButton.classList.add('selected');
          } else {
              materialName.textContent = name || '';
              const firstButton = group.querySelector('.change-texture');
              if (firstButton) {
                  selectedMaterialName = firstButton.getAttribute('data-material-name');
                  materialName.textContent = selectedMaterialName;
                  firstButton.classList.add('selected');
              }
          }
      }


      // Show title and container with smooth transition
      materialContainer.style.opacity = "1";
      materialContainer.style.transform = "translateY(0)";
      materialContainer.style.visibility = "visible";

      setTimeout(() => {
          materialContainer.style.visibility = "visible"; // Ensure visibility after transition
      }, 10);

      hotspotSelected = true; // Set hotspot as selected
  }

  // Handle hotspot selection
  document.querySelector("[slot='hotspot-3']")?.addEventListener("click", (event) => {
      event.stopPropagation();
      hotspotSelected = true; // Hotspot selected
      showMaterialGroup(woodGroup, "WOOD", "OILED WALNUT", lastSelectedMaterialWood);
  });

  document.querySelector("[slot='hotspot-4']")?.addEventListener("click", (event) => {
      event.stopPropagation();
      hotspotSelected = true; // Hotspot selected
      showMaterialGroup(leatherGroup, "LEATHER", "Soft Leather", lastSelectedMaterialLeather);
  });

  // Hide material container when clicking outside
  document.addEventListener("click", function (event) {
      if (materialContainer && !materialContainer.contains(event.target) && !event.target.matches("[slot^='hotspot']")) {
          hideMaterialContainer();
          hotspotSelected = false; // Reset hotspot selection
      }
  });

  // Prevent closing the material container when clicking inside
  materialContainer?.addEventListener("click", function (event) {
      event.stopPropagation();
  });

  const modelViewer = document.querySelector("model-viewer");
  const buttons = document.querySelectorAll(".change-texture");

  // Handle texture changes
  buttons.forEach(button => {
      button.addEventListener("click", async () => {
          const materialIndex = button.getAttribute("data-material");
          const newTextureURL = button.getAttribute("data-texture");
          const buttonMaterialName = button.getAttribute("data-material-name");

          // Only apply the material change if it's different from the last selected one
          if (materialIndex !== null && selectedMaterialName !== buttonMaterialName) {
              const material = modelViewer.model.materials[materialIndex];
              const texture = await modelViewer.createTexture(newTextureURL);
              material.pbrMetallicRoughness.baseColorTexture.setTexture(texture);

              // Update the selected material name
              selectedMaterialName = buttonMaterialName;
              materialName.style.opacity = 0;
              setTimeout(() => {
                  materialName.textContent = selectedMaterialName;
                  materialName.style.opacity = 1;
              }, 150);

              // Update last selected material for the group
              if (woodGroup.contains(button)) {
                  lastSelectedMaterialWood = buttonMaterialName;
              } else if (leatherGroup.contains(button)) {
                  lastSelectedMaterialLeather = buttonMaterialName;
              }

              // Highlight selected button
              buttons.forEach(btn => btn.classList.remove('selected'));
              button.classList.add('selected');
          }
      });

      // Show material name on hover
      button.addEventListener("mouseover", () => {
          materialName.style.opacity = 0;
          setTimeout(() => {
              materialName.textContent = button.getAttribute("data-material-name");
              materialName.style.opacity = 1;
          }, 150);
      });

      // Restore selected material name on mouse out
      button.addEventListener("mouseout", () => {
          materialName.style.opacity = 0;
          setTimeout(() => {
              materialName.textContent = selectedMaterialName;
              materialName.style.opacity = 1;
          }, 150);
      });
  });

  // Hide material change container
  function hideMaterialContainer() {
      if (!materialContainer) return;

      materialContainer.style.opacity = "0";
      materialContainer.style.transform = "translateY(20px)";
      setTimeout(() => {
          materialContainer.style.visibility = "hidden";
      }, 300);
  }
});


// --------------------- MEDIDAS ------------------------------------------------------------------------------
document.querySelector('#viewer').addEventListener('load', () => {

  const modelViewer = document.querySelector('#viewer');
  const toggleButton = document.querySelector('.Hotspot[slot="hotspot-medidas"]'); // Updated to use new button
  const dimElements = [
    ...modelViewer.querySelectorAll('button[slot^="hotspot-dim"]'), // Seleciona apenas os botões das medidas
    modelViewer.querySelector('#dimLines')];
  let dimensionsVisible = false; // Começa com as dimensões escondidas

  function drawLine(svgLine, dotHotspot1, dotHotspot2, dimensionHotspot) {
      if (dotHotspot1 && dotHotspot2) {
          svgLine.setAttribute('x1', dotHotspot1.canvasPosition.x);
          svgLine.setAttribute('y1', dotHotspot1.canvasPosition.y);
          svgLine.setAttribute('x2', dotHotspot2.canvasPosition.x);
          svgLine.setAttribute('y2', dotHotspot2.canvasPosition.y);

          if (dimensionHotspot && !dimensionHotspot.facingCamera) {
              svgLine.classList.add('hide');
          } else {
              svgLine.classList.remove('hide');
          }
      }
  }

  const dimLines = modelViewer.querySelectorAll('line');

  const renderSVG = () => {
      drawLine(dimLines[0], modelViewer.queryHotspot('hotspot-dot+X-Y+Z'), modelViewer.queryHotspot('hotspot-dot+X-Y-Z'), modelViewer.queryHotspot('hotspot-dim+X-Y'));
      drawLine(dimLines[1], modelViewer.queryHotspot('hotspot-dot+X-Y-Z'), modelViewer.queryHotspot('hotspot-dot+X+Y-Z'), modelViewer.queryHotspot('hotspot-dim+X-Z'));
      drawLine(dimLines[2], modelViewer.queryHotspot('hotspot-dot+X+Y-Z'), modelViewer.queryHotspot('hotspot-dot-X+Y-Z'));
      drawLine(dimLines[3], modelViewer.queryHotspot('hotspot-dot-X+Y-Z'), modelViewer.queryHotspot('hotspot-dot-X-Y-Z'), modelViewer.queryHotspot('hotspot-dim-X-Z'));
      drawLine(dimLines[4], modelViewer.queryHotspot('hotspot-dot-X-Y-Z'), modelViewer.queryHotspot('hotspot-dot-X-Y+Z'), modelViewer.queryHotspot('hotspot-dim-X-Y'));
  };

  const center = modelViewer.getBoundingBoxCenter();
  const size = modelViewer.getDimensions();
  const x2 = size.x / 2;
  const y2 = size.y / 2;
  const z2 = size.z / 2;

  modelViewer.updateHotspot({
      name: 'hotspot-dot+X-Y+Z',
      position: `${center.x + x2} ${center.y - y2} ${center.z + z2}`
  });

  modelViewer.updateHotspot({
      name: 'hotspot-dim+X-Y',
      position: `${center.x + x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`
  });
  modelViewer.querySelector('button[slot="hotspot-dim+X-Y"]').textContent = `${(size.z * 100).toFixed(0)} cm`;

  modelViewer.updateHotspot({
      name: 'hotspot-dot+X-Y-Z',
      position: `${center.x + x2} ${center.y - y2} ${center.z - z2}`
  });

  modelViewer.updateHotspot({
      name: 'hotspot-dim+X-Z',
      position: `${center.x + x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
  });
  modelViewer.querySelector('button[slot="hotspot-dim+X-Z"]').textContent = `${(size.y * 100).toFixed(0)} cm`;

  modelViewer.updateHotspot({
      name: 'hotspot-dot+X+Y-Z',
      position: `${center.x + x2} ${center.y + y2} ${center.z - z2}`
  });

  modelViewer.updateHotspot({
      name: 'hotspot-dim+Y-Z',
      position: `${center.x} ${center.y + y2 * 1.1} ${center.z - z2 * 1.1}`
  });
  modelViewer.querySelector('button[slot="hotspot-dim+Y-Z"]').textContent = `${(size.x * 100).toFixed(0)} cm`;

  modelViewer.updateHotspot({
      name: 'hotspot-dot-X+Y-Z',
      position: `${center.x - x2} ${center.y + y2} ${center.z - z2}`
  });

  modelViewer.updateHotspot({
      name: 'hotspot-dim-X-Z',
      position: `${center.x - x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`
  });
  modelViewer.querySelector('button[slot="hotspot-dim-X-Z"]').textContent = `${(size.y * 100).toFixed(0)} cm`;

  modelViewer.updateHotspot({
      name: 'hotspot-dot-X-Y-Z',
      position: `${center.x - x2} ${center.y - y2} ${center.z - z2}`
  });

  modelViewer.updateHotspot({
      name: 'hotspot-dim-X-Y',
      position: `${center.x - x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`
  });
  modelViewer.querySelector('button[slot="hotspot-dim-X-Y"]').textContent = `${(size.z * 100).toFixed(0)} cm`;

  modelViewer.updateHotspot({
      name: 'hotspot-dot-X-Y+Z',
      position: `${center.x - x2} ${center.y - y2} ${center.z + z2}`
  });

  renderSVG();

  modelViewer.addEventListener('camera-change', renderSVG);

  function toggleDimensionsVisibility() {
      dimensionsVisible = !dimensionsVisible;
      dimElements.forEach((element) => {
          if (dimensionsVisible) {
              element.classList.remove('hide');
          } else {
              element.classList.add('hide');
          }
      });

      if (dimensionsVisible) {
          modelViewer.cameraOrbit = "50deg 80deg 50m"; // Muda a camera para uma posição predefinida
      }
  }

  toggleButton.addEventListener('click', toggleDimensionsVisibility);

  // Esconde as medidas no carregamento da página
  dimElements.forEach((element) => {
      element.classList.add('hide');
  });

// Ensure you select the correct button element
const toggleDimensionsButton = document.querySelector('.toggle-dimensions-button'); // Update with the correct class or ID

if (toggleDimensionsButton) {
  // Esconde/mostra a classe 'selected' ao clicar no novo hotspot
  toggleDimensionsButton.addEventListener('click', () => {
    toggleDimensionsButton.classList.toggle('selected');
  });
}
});





// --------------------- BOTÃO GERA QRCODE --------------------------------------------------------------- 
let isQRCodeVisible = false;

function generateQRCode() {
    const qrCodeUrl = "https://paulolopess.github.io/website/projects/model9/model9-viewer.html";
    const qrCodeContainer = document.getElementById("qr-code");

    // Check if the QR code is already generated
    if (!isQRCodeVisible) {
        // Generate the QR code only once
        if (!qrCodeContainer.hasChildNodes()) {
            new QRCode(qrCodeContainer, {
                text: qrCodeUrl,
                width: 128,
                height: 128
            });
        }

        // Show the QR code container
        document.getElementById('qr-code-container').style.display = 'block';
    } else {
        // Hide the QR code container
        document.getElementById('qr-code-container').style.display = 'none';
    }

    // Toggle the visibility flag
    isQRCodeVisible = !isQRCodeVisible;
}

function closeQRCode() {
    // Hide the QR code container when the close button is clicked
    document.getElementById('qr-code-container').style.display = 'none';
    isQRCodeVisible = false;
}

// Close the QR code container if clicking anywhere else on the page
document.addEventListener('click', function(event) {
    if (isQRCodeVisible && !document.getElementById('ar-qr-code').contains(event.target) && !document.getElementById('qr-code-container').contains(event.target)) {
        document.getElementById('qr-code-container').style.display = 'none';
        isQRCodeVisible = false;
    }
});
