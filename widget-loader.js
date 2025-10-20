// Archivo: widget-loader.js

(() => {
  // Encapsulamos todo en una función anónima para no contaminar el scope global del cliente.

  // 1. Definimos toda la configuración del widget.
  const config = {
    webhook: {
      url: 'https://helpai-mx.app.n8n.cloud/webhook/e9dbc672-34a1-4a3d-8d42-2fb472d73edd/chat',
      route: 'general'
    },
    branding: {
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIUMknxT_CWDkGUKDVYW2WvT6Rt7dDATaS4g&s',
      name: 'Renda Demo',
      welcomeText: 'Renda Demo',
      responseTimeText: ''
    }
  };

  // 2. Todos tus estilos CSS personalizados van aquí, dentro de un string de JavaScript.
  const customCSS = `
    .n8n-chat-widget .brand-header{padding:16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(133,79,255,.1);background-color:#8a26de;position:relative}.n8n-chat-widget .brand-header span{font-size:18px;font-weight:500;color:#f1ecd9!important}.n8n-chat-widget .new-chat-btn{display:none!important;align-items:center;justify-content:center;gap:8px;width:100%;padding:16px 24px;background:linear-gradient(135deg,var(--chat--color-primary) 0%,var(--chat--color-secondary) 100%);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:16px;transition:transform .3s;font-weight:500;font-family:inherit;margin-bottom:12px}.n8n-chat-widget .brand-header img{width:30px;height:30px;border-radius:300%}.n8n-chat-widget .chat-footer{display:none!important}.n8n-chat-widget .close-button{color:#fff!important}.n8n-chat-widget .new-chat-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:16px 24px;background:linear-gradient(135deg,var(--chat--color-primary) 0%,var(--chat--color-secondary) 100%);color:#fff!important;border:none;border-radius:8px;cursor:pointer;font-size:16px;transition:transform .3s;font-weight:500;font-family:inherit;margin-bottom:12px}.n8n-chat-widget .chat-toggle{background-color:transparent!important;background-image:url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIUMknxT_CWDkGUKDVYW2WvT6Rt7dDATaS4g&s)!important;background-repeat:no-repeat!important;background-position:center center!important;background-size:contain!important;border-radius:300%!important}.n8n-chat-widget .chat-toggle svg{display:none!important}.n8n-chat-widget .chat-input button{background:0 0!important;color:#ccc!important;border:none!important;border-radius:0!important;padding:0!important}.n8n-chat-widget .chat-input textarea{flex:1;padding:12px;border:none!important;outline:none}.n8n-chat-widget .chat-message.user{background:rgba(16,81,151,.1)!important;color:#191a30!important}.n8n-chat-widget .user-message-title{font-weight:700;color:gray;font-size:12px;margin:12px 0 4px;padding-right:8px;text-align:right}.n8n-chat-widget .chat-message.bot{background:#f4f6f8!important;border:none!important}.n8n-chat-widget .bot-message-title{font-weight:700;color:gray;font-size:12px;margin:12px 0 4px;text-align:left;padding-left:8px}.brand-header .MuiBox-root{margin-left:auto;margin-right:8px;display:flex;align-items:center}.brand-header .MuiIconButton-root{background:0 0;border:none;cursor:pointer;color:#fff}.mensaje-inicial-btn:hover{background:rgba(0,122,255,.2)!important}#mensajes-iniciales-rapidos{width:100%;justify-content:space-between!important;margin-bottom:15px}.n8n-chat-widget .chat-loading-dots{display:flex;justify-content:center;align-items:flex-end;min-height:30px;margin:10px 0 0;width:100%}.n8n-chat-widget .loading-dot{width:8px;height:8px;background:gray;border-radius:50%;margin:0 4px;animation:loading-bounce 1s infinite}.n8n-chat-widget .loading-dot:nth-child(2){animation-delay:.2s}.n8n-chat-widget .loading-dot:nth-child(3){animation-delay:.4s}@keyframes loading-bounce{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(-14px);opacity:1}}.n8n-chat-widget .chat-input{position:relative;display:flex;align-items:center}
  `;

  // 3. Función para inyectar los estilos en el <head> de la página.
  function injectStyles(css) {
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.innerHTML = css;
    document.head.appendChild(styleElement);
  }

  // 4. Función para cargar un script externo.
  function loadScript(src, onload) {
    const scriptElement = document.createElement('script');
    scriptElement.src = src;
    if (onload) {
      scriptElement.onload = onload;
    }
    document.body.appendChild(scriptElement);
  }

  // 5. Función para cargar una hoja de estilos externa.
  function loadCSS(href) {
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = href;
    document.head.appendChild(linkElement);
  }

  // 6. Toda tu lógica de personalización del widget se ejecutará cuando el widget principal haya cargado.
  function applyCustomizations() {
    
    // Funciones de utilidad y lógica principal
    function triggerNewChatButton() {
        const checkAndClick = () => {
            const button = document.querySelector('.n8n-chat-widget .new-chat-btn');
            if (button) {
                button.click();
                console.log('Botón de nuevo chat ejecutado');
            } else {
                setTimeout(checkAndClick, 500);
            }
        };
        checkAndClick();
    }

    function convertirMarkdownAHTML(texto) {
        return texto
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/__(.*?)__/g, '<u>$1</u>')
            .replace(/\n/g, '<br>');
    }

    function mostrarLoaderChat() {
        const chatMessages = document.querySelector('.chat-interface.active .chat-messages');
        if (chatMessages && !chatMessages.querySelector('.chat-loading-dots')) {
            const loader = document.createElement('div');
            loader.className = 'chat-loading-dots';
            loader.innerHTML = `
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            `;
            chatMessages.appendChild(loader);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    function ocultarLoaderChat() {
        const loader = document.querySelector('.chat-interface.active .chat-messages .chat-loading-dots');
        if (loader) loader.remove();
    }

    let esperaRespuesta = false;

    function conectarEventosLoaderChat() {
        const chatWidget = document.querySelector('.chat-container.open .chat-interface.active');
        if (!chatWidget) return;

        const chatInput = chatWidget.querySelector('.chat-input textarea');
        const sendBtn = chatWidget.querySelector('.chat-input button[type="submit"]');

        if (chatInput && sendBtn) {
            sendBtn.addEventListener('click', function () {
                if (chatInput.value.trim().length > 0 && !esperaRespuesta) {
                    mostrarLoaderChat();
                    esperaRespuesta = true;
                }
            });

            chatInput.addEventListener('keydown', function (e) {
                if (e.key === "Enter" && !e.shiftKey && chatInput.value.trim().length > 0 && !esperaRespuesta) {
                    setTimeout(mostrarLoaderChat, 50);
                    esperaRespuesta = true;
                }
            });
        }
    }
    
    // Ejecución de la lógica de personalización
    triggerNewChatButton();

    const textarea = document.querySelector('.chat-input textarea');
    const button = document.querySelector('.chat-input button');
    if (textarea) {
        textarea.placeholder = '¿Cómo puedo ayudarte hoy?';
    }
    if (button) {
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12L2.01 3L2 10l15 2l-15 2z"></path>
            </svg>
        `;
    }

    const chatContainer = document.querySelector('.n8n-chat-widget');
    if (chatContainer) {
        const titleObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType !== 1 || !node.classList.contains('chat-message')) return;
                    if (node.classList.contains('user') && !node.previousElementSibling?.classList?.contains('user-message-title')) {
                        const userTitle = document.createElement('div');
                        userTitle.className = 'user-message-title';
                        userTitle.innerHTML = 'You';
                        node.parentNode.insertBefore(userTitle, node);
                    }
                    if (node.classList.contains('bot') && !node.previousElementSibling?.classList?.contains('bot-message-title')) {
                        const botTitle = document.createElement('div');
                        botTitle.className = 'bot-message-title';
                        botTitle.innerHTML = 'Asesor';
                        node.parentNode.insertBefore(botTitle, node);
                    }
                });
            });
        });
        titleObserver.observe(chatContainer, { childList: true, subtree: true });

        const messageObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList.contains('chat-message') && node.classList.contains('bot')) {
                        ocultarLoaderChat();
                        esperaRespuesta = false;
                        const textoPlano = node.innerText;
                        node.innerHTML = convertirMarkdownAHTML(textoPlano);
                    }
                });
            });
        });
        messageObserver.observe(chatContainer, { childList: true, subtree: true });
    }

    setInterval(() => {
        const titulos = document.querySelectorAll('.n8n-chat-widget .bot-message-title');
        titulos.forEach(el => {
            if (el.dataset.personalizado === '1') return;
            el.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIUMknxT_CWDkGUKDVYW2WvT6Rt7dDATaS4g&s" alt="Renda AI" style="width:60px;margin-bottom:10px;border-radius:300px;">
                    <div style="font-size:18px;font-weight:bold;color:#242a35;text-align:center;">Renda AI</div>
                    <div style="font-size:14px;color:#6b7280;text-align:center;margin-bottom:7px;">Help AI</div>
                </div>
            `;
            el.dataset.personalizado = '1';
        });
    }, 700);

    setInterval(() => {
        const mensajes = document.querySelectorAll('.n8n-chat-widget .chat-message.bot');
        if (mensajes.length > 0) {
            for (let i = 0; i < mensajes.length; i++) {
                if (mensajes[i].innerHTML.trim() === '') {
                    mensajes[i].style.display = 'none';
                }
            }
        }
    }, 500);

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('mensaje-inicial-btn') && !esperaRespuesta) {
            setTimeout(mostrarLoaderChat, 300);
            esperaRespuesta = true;
        }
    });

    setInterval(conectarEventosLoaderChat, 1000);
  }

  // --- Punto de Entrada: Ejecución Principal ---

  // 1. Inyectamos los estilos (tanto los personalizados como los de la fuente).
  injectStyles(customCSS);
  loadCSS('https://cdnjs.cloudflare.com/ajax/libs/geist-font/1.0.0/fonts/geist-sans/style.min.css');

  // 2. Definimos la configuración en el objeto `window` para que el script del widget pueda encontrarla.
  window.ChatWidgetConfig = config;

  // 3. Cargamos las dependencias.
  loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js');

  // 4. Finalmente, cargamos el script principal del widget.
  //    Cuando termine de cargar (`onload`), ejecutamos todas nuestras personalizaciones.
  loadScript('https://cdn.jsdelivr.net/gh/WayneSimpson/n8n-chatbot-template@ba944c3/chat-widget.js', applyCustomizations);

})();