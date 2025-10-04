//Funcionalidade do QR Code: Mostrar e Esconder
//Este código JavaScript cria um sistema que permite mostrar e esconder um código QR na sua página. Pense nele como um "interruptor" para o QR Code: um clique mostra, 
// outro clique esconde, e ele também some se você clicar fora.


let isQRCodeVisible = false;

// Esta função agora será exportada para ser usada em outro lugar
export function generateQRCode() {
    const qrCodeUrl = "https://paulolopess.github.io/website/projects/modelsqrcode/modelqrcode-viewer.html";
    const qrCodeContainer = document.getElementById("qr-code");
    const container = document.getElementById("qr-code-container");
    const logo = document.getElementById("ar-logo");

    if (!isQRCodeVisible) {
        if (!qrCodeContainer.hasChildNodes()) {
            // Certifique-se de que a biblioteca 'QRCode' está carregada ANTES deste script.
            // Geralmente, isso é feito por um <script src="qrcode.min.js"></script> no HTML antes de qrcodeGenerator.js
            new QRCode(qrCodeContainer, {
                text: qrCodeUrl,
                width: 128,
                height: 128
            });
        }

        container.style.display = "block";
        setTimeout(() => {
            container.classList.add("visible");
        }, 10);
        logo.classList.add("fade-out");

        setTimeout(() => {
            document.addEventListener("click", handleOutsideClick);
        }, 20);

        isQRCodeVisible = true;
    } else {
        closeQRCode();
    }
}

// Funções internas que não precisam ser acessadas de fora, então não as exportamos
function closeQRCode() {
    const container = document.getElementById("qr-code-container");
    const logo = document.getElementById("ar-logo");

    container.classList.remove("visible");
    setTimeout(() => {
        container.style.display = "none";
    }, 300);
    setTimeout(() => {
        logo.classList.remove("fade-out");
    }, 300);

    document.removeEventListener("click", handleOutsideClick);
    isQRCodeVisible = false;
}

function handleOutsideClick(event) {
    const container = document.getElementById("qr-code-container");
    const qrButton = document.getElementById("qr-code-button");

    if (
        container &&
        !container.contains(event.target) &&
        event.target !== qrButton
    ) {
        closeQRCode();
    }
}

// Esta função também será exportada porque ela configura o ouvinte de clique no botão
export function setupQRCodeToggle() {
    const qrButton = document.getElementById("qr-code-button");
    if (qrButton) {
        qrButton.addEventListener("click", (event) => {
            event.stopPropagation();
            generateQRCode(); // Chama a função exportada
        });
    }
}