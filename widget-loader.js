// Archivo: widget-loader.js
// Contiene toda la lógica del widget de Renda Centauro

(() => {
  // Encapsulamos todo en una función anónima para no contaminar el scope global del cliente.

  // ------------------------------------------------------------------
  // PASO 1: CONFIGURACIÓN DEL WIDGET
  // (Tus datos de window.ChatWidgetConfig)
  // ------------------------------------------------------------------
  const config = {
    webhook: {
      url: 'https://helpai-mx.app.n8n.cloud/webhook/e9dbc672-34a1-4a3d-8d42-2fb472d73edd/chat',
      route: 'general'
    },
    branding: {
      logo: 'https://i.imgur.com/0TqlHuy.jpeg',
      name: 'AGENTE RENDA CENTUARIO',
      welcomeText: 'AGENTE RENDA CENTUARIO',
      responseTimeText: ''
    }
  };

  // ------------------------------------------------------------------
  // PASO 2: ESTILOS CSS
  // (Todo tu CSS de la etiqueta <style> minificado en un string)
  // ------------------------------------------------------------------
  const customCSS = `.n8n-chat-widget .brand-header{padding:16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #E0E0E0;background-color:#fff;position:relative}.n8n-chat-widget .brand-header span{font-size:0!important;color:transparent!important;width:250px;height:25px;display:block;background-image:url(https://i.imgur.com/Ao8zU4e.jpeg);background-repeat:no-repeat;background-position:center left;background-size:contain}.n8n-chat-widget .new-chat-btn{display:none!important;align-items:center;justify-content:center;gap:8px;width:100%;padding:16px 24px;background:linear-gradient(135deg,var(--chat--color-primary) 0,var(--chat--color-secondary) 100%);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:16px;transition:transform .3s;font-weight:500;font-family:inherit;margin-bottom:12px}.n8n-chat-widget .brand-header img{width:30px;height:30px;border-radius:0}.n8n-chat-widget .chat-footer{display:none!important}.n8n-chat-widget .close-button{color:#757575!important}.n8n-chat-widget .new-chat-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:16px 24px;background:linear-gradient(135deg,var(--chat--color-primary) 0,var(--chat--color-secondary) 100%);color:#fff!important;border:none;border-radius:8px;cursor:pointer;font-size:16px;transition:transform .3s;font-weight:500;font-family:inherit;margin-bottom:12px}.n8n-chat-widget .chat-toggle{background-color:transparent!important;background-image:url(https://i.imgur.com/YgVeHUb.jpeg)!important;background-repeat:no-repeat!important;background-position:center center!important;background-size:60%!important;border-radius:300%!important;box-shadow:0 4px 12px rgba(0,0,0,.15)}.n8n-chat-widget .chat-toggle svg{display:none!important}.n8n-chat-widget .chat-input button{background:0 0!important;color:#ccc!important;border:none!important;border-radius:0!important;padding:0!important}.n8n-chat-widget .chat-input textarea{flex:1;padding:12px;border:1px solid #ccc!important;border-radius:8px;outline:none;margin-right:8px;resize:none}.n8n-chat-widget .chat-message.user{background:rgba(16,81,151,.1)!important;color:#191a30!important}.n8n-chat-widget .user-message-title{font-weight:700;color:gray;font-size:12px;margin:12px 0 4px;padding-right:8px;text-align:right}.n8n-chat-widget .chat-message.bot{background:#f4f6f8!important;border:none!important}.n8n-chat-widget .bot-message-title{font-weight:700;color:gray;font-size:12px;margin:12px 0 4px;text-align:left;padding-left:8px}.brand-header .MuiBox-root{margin-left:auto;margin-right:8px;display:flex;align-items:center}.brand-header .MuiIconButton-root{background:0 0;border:none;cursor:pointer;color:#fff}.mensaje-inicial-btn:hover{background:rgba(0,122,255,.2)!important}#mensajes-iniciales-rapidos{width:100%;justify-content:space-between!important;margin-bottom:15px}.n8n-chat-widget .chat-loading-dots{display:flex;justify-content:center;align-items:flex-end;min-height:30px;margin:10px 0 0;width:100%}.n8n-chat-widget .loading-dot{width:8px;height:8px;background:gray;border-radius:50%;margin:0 4px;animation:loading-bounce 1s infinite}.n8n-chat-widget .loading-dot:nth-child(2){animation-delay:.2s}.n8n-chat-widget .loading-dot:nth-child(3){animation-delay:.4s}@keyframes loading-bounce{0%,to{transform:translateY(0);opacity:.5}50%{transform:translateY(-14px);opacity:1}}.n8n-chat-widget .chat-input{position:relative;display:flex;align-items:center}`;

  // ------------------------------------------------------------------
  // PASO 3: LÓGICA DE PERSONALIZACIÓN
  // (Toda tu lógica de los <script> agrupada en una función)
  // ------------------------------------------------------------------
  function applyCustomizations() {
    
    // --- Funciones auxiliares ---
    let esperaRespuesta = false;

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
        loader.innerHTML = `<div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div>`;
        chatMessages.appendChild(loader);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }

    function ocultarLoaderChat() {
      const loader = document.querySelector('.chat-interface.active .chat-messages .chat-loading-dots');
      if (loader) loader.remove();
    }

    function conectarEventosLoaderChat() {
      const chatWidget = document.querySelector('.chat-container.open .chat-interface.active');
      if (!chatWidget) return;
      
      const chatInput = chatWidget.querySelector('.chat-input textarea');
      const sendBtn = chatWidget.querySelector('.chat-input button[type="submit"]');
      
      if (chatInput && sendBtn) {
        // Usamos addEventListener para no sobreescribir eventos existentes
        sendBtn.addEventListener('click', function () {
          if (chatInput.value.trim().length > 0 && !esperaRespuesta) {
            mostrarLoaderChat();
            esperaRespuesta = true;
          }
        });
        
        chatInput.addEventListener('keydown', function(e){
          if (e.key === "Enter" && !e.shiftKey && chatInput.value.trim().length > 0 && !esperaRespuesta) {
            setTimeout(mostrarLoaderChat, 50);
            esperaRespuesta = true;
          }
        });
      }
    }

    // --- Ejecución de la lógica ---
    // (Ya no usamos 'DOMContentLoaded' porque esta función se ejecuta DESPUÉS de que el widget ha cargado)

    triggerNewChatButton();

    // Modificar placeholder y botón de envío
    const textarea = document.querySelector('.chat-input textarea');
    if (textarea) textarea.placeholder = '¿Cómo puedo ayudarte?';
    
    const button = document.querySelector('.chat-input button[type="submit"]');
    if (button) {
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12L2.01 3L2 10l15 2l-15 2z"></path>
        </svg>
      `;
    }

    // Observador unificado para títulos y procesamiento de mensajes
    const chatContainer = document.querySelector('.n8n-chat-widget');
    if (chatContainer) {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType !== 1 || !node.classList.contains('chat-message')) return;

            // Añadir título de usuario
            if (node.classList.contains('user') && !node.previousElementSibling?.classList?.contains('user-message-title')) {
              const userTitle = document.createElement('div');
              userTitle.className = 'user-message-title';
              userTitle.innerHTML = 'Tú';
              node.parentNode.insertBefore(userTitle, node);
            }

            // Lógica para mensajes del bot
            if (node.classList.contains('bot')) {
              // Añadir título de bot
              if (!node.previousElementSibling?.classList?.contains('bot-message-title')) {
                const botTitle = document.createElement('div');
                botTitle.className = 'bot-message-title';
                botTitle.innerHTML = 'Agente Renda';
                node.parentNode.insertBefore(botTitle, node);
              }
              
              // Ocultar loader y procesar respuesta Markdown
              ocultarLoaderChat();
              esperaRespuesta = false;
              const textoPlano = node.innerText; // Usamos innerText como en tu código original
              const htmlConvertido = convertirMarkdownAHTML(textoPlano);
              node.innerHTML = htmlConvertido;
            }
          });
        });
      });
      observer.observe(chatContainer, { childList: true, subtree: true });
    }

    // Cambiar el texto del primer título del bot (Mensaje de bienvenida)
    const cambiarTexto = setInterval(() => {
      const titulos = document.querySelectorAll('.n8n-chat-widget .bot-message-title');
      titulos.forEach(el => {
        if (el.dataset.personalizado === '1') return;
        el.innerHTML = `
            <div style="padding: 10px 5px; color: #757095; text-align: left; font-size: 14px; line-height: 1.5; font-family: inherit;">
                <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 20px;">
                    <img src="https://i.imgur.com/YgVeHUb.jpeg" alt="Agente Centauro" style="height: 70px; width: auto;">
                    <img src="https://i.imgur.com/xVakOFa.png" alt="Renda" style="height: 30px; width: auto;">
                </div>
                <p style="font-weight: bold; font-size: 15px; margin-bottom: 12px; text-align: center;">
                    Soy tu agente Renda Centauro:
                </p>
                <p style="margin-bottom: 12px; font-size: 13px; text-align: center;">
                    Asesoro sobre Renda y leyes (federales/estatales, MX).
                </p>
                <p style="margin-bottom: 12px; font-size: 13px; text-align: center;">
                    Cubro aspectos comerciales y contractuales, y gestiono asuntos civiles de forma práctica: contratos, arrendamiento, responsabilidad civil, sucesiones, propiedad, garantías y copropiedad.
                </p>
                <p style="margin-bottom: 12px; font-size: 13px; text-align: center;">
                    Dime tu asunto en 1 línea. <br>
                    <strong>Modos:</strong><br>
                    Conversación (dudas rápidas)<br>
                    <strong>Activar Modo Caso</strong><br>
                    (análisis profundo, cálculos y estrategia).
                </p>
                <p style="font-size: 11px; color: #777; border-top: 1px solid #eee; padding-top: 10px; margin-top: 10px; text-align: center;">
                    Renda no reemplaza la asesoría legal de un abogado; su uso es responsabilidad del usuario.
                </p>
            </div>
        `;
        el.dataset.personalizado = '1';
      });
      if (titulos.length > 0) clearInterval(cambiarTexto);
    }, 700);

    // Ocultar mensajes en blanco
    const ocultarMensajeBlanco = setInterval(() => {
      const mensajes = document.querySelectorAll('.n8n-chat-widget .chat-message.bot');
      if (mensajes.length > 0) {
        for (let i = 0; i < mensajes.length; i++) {
          const texto = mensajes[i].innerHTML.trim();
          if (texto === '') {
            mensajes[i].style.display = 'none';
            break;
          }
        }
        clearInterval(ocultarMensajeBlanco);
      }
    }, 500);

    // Event listener para botones de mensajes iniciales
    document.addEventListener('click', function(e){
      if(e.target.classList.contains('mensaje-inicial-btn') && !esperaRespuesta){
        setTimeout(mostrarLoaderChat, 300);
        esperaRespuesta = true;
      }
    });
    
    // Reconectar eventos de loader periódicamente
    const reconectar = () => { conectarEventosLoaderChat(); };
    setInterval(reconectar, 1000);
  }

  // ------------------------------------------------------------------
  // PASO 4: FUNCIONES AUXILIARES PARA CARGAR RECURSOS
  // (Estas funciones inyectan los scripts y CSS en la página del cliente)
  // ------------------------------------------------------------------
  function loadScript(src, onload) {
    const script = document.createElement('script');
    script.src = src;
    if (onload) script.onload = onload; // Ejecuta la función callback cuando el script carga
    document.body.appendChild(script);
  }

  function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function injectStyles(css) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    document.head.appendChild(style);
  }

  // ------------------------------------------------------------------
  // PASO 5: PUNTO DE ENTRADA (EJECUCIÓN)
  // (Aquí es donde todo se pone en marcha)
  // ------------------------------------------------------------------

  // 1. Inyecta tus estilos CSS personalizados
  injectStyles(customCSS);
  
  // 2. Carga la fuente externa
  loadCSS('https://cdnjs.cloudflare.com/ajax/libs/geist-font/1.0.0/fonts/geist-sans/style.min.css');
  
  // 3. Define la configuración global que el widget espera encontrar
  window.ChatWidgetConfig = config;
  
  // 4. Carga la librería 'marked' (dependencia para Markdown)
  loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js');
  
  // 5. Carga el script principal del widget.
  //    CUANDO TERMINE (onload), ejecuta toda tu lógica de personalización.
  loadScript(
    'https://cdn.jsdelivr.net/gh/WayneSimpson/n8n-chatbot-template@ba944c3/chat-widget.js',
    applyCustomizations
  );

})(); // Fin de la función autoejecutable