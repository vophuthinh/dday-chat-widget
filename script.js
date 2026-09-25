// Interactive Chat Widget for n8n
(function () {
    // Initialize widget only once
    if (window.N8nChatWidgetLoaded) return;
    window.N8nChatWidgetLoaded = true;

    // Apply widget styles with completely different design approach
    const widgetStyles = document.createElement('style');
    widgetStyles.textContent = `
        .chat-assist-widget {
            --chat-color-primary: var(--chat-widget-primary, #0073f7);
            --chat-color-secondary: var(--chat-widget-secondary, #009c82);
            --chat-color-tertiary: var(--chat-widget-tertiary, #1e0079);
            --chat-color-light: var(--chat-widget-light, #e6d6ff);
            --chat-color-surface: var(--chat-widget-surface, #ffffff);
            --chat-color-text: var(--chat-widget-text, #1f2937);
            --chat-color-text-light: var(--chat-widget-text-light, #6b7280);
            --chat-color-border: var(--chat-widget-border, #e5e7eb);
            --chat-shadow-sm: 0 1px 3px rgba(51, 0, 207, 0.1);
            --chat-shadow-md: 0 4px 6px rgba(51, 0, 207, 0.15);
            --chat-shadow-lg: 0 10px 15px rgba(0, 115, 247, 0.2);
            --chat-radius-sm: 8px;
            --chat-radius-md: 12px;
            --chat-radius-lg: 20px;
            --chat-radius-full: 9999px;
            --chat-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family:
                -apple-system,
                BlinkMacSystemFont,
                'Segoe UI',
                Roboto,
                Helvetica,
                Arial,
                sans-serif;
        }

        .chat-assist-widget .chat-window {
            position: fixed;
            bottom: 90px;
            z-index: 1000;
            width: 380px;
            height: 580px;
            background: var(--chat-color-surface);
            border-radius: var(--chat-radius-lg);
            box-shadow: var(--chat-shadow-lg);
            border: 1px solid var(--chat-color-light);
            overflow: hidden;
            display: none;
            flex-direction: column;
            transition: var(--chat-transition);
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            max-height: 580px; /* Ensure fixed height */
        }

        .chat-assist-widget .chat-window.right-side {
            right: 20px;
        }

        .chat-assist-widget .chat-window.left-side {
            left: 20px;
        }

        .chat-assist-widget .chat-window.visible {
            display: flex;
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        .chat-assist-widget .chat-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            position: relative;
        }

        .chat-assist-widget .chat-header-logo {
            width: 32px;
            height: 32px;
            border-radius: var(--chat-radius-sm);
            object-fit: contain;
            background: white;
            padding: 4px;
        }

        .chat-assist-widget .chat-header-title {
            font-size: 16px;
            font-weight: 600;
            color: white;
        }

        .chat-assist-widget .chat-close-btn {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--chat-transition);
            font-size: 18px;
            border-radius: var(--chat-radius-full);
            width: 28px;
            height: 28px;
        }

        .chat-assist-widget .chat-close-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-50%) scale(1.1);
        }

        .chat-assist-widget .chat-welcome {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 24px;
            text-align: center;
            width: 100%;
            max-width: 320px;
        }

        .chat-assist-widget .chat-welcome-title {
            font-size: 22px;
            font-weight: 700;
            color: var(--chat-color-text);
            margin-bottom: 24px;
            line-height: 1.3;
        }

        .chat-assist-widget .chat-start-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            padding: 14px 20px;
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            border: none;
            border-radius: var(--chat-radius-md);
            cursor: pointer;
            font-size: 15px;
            transition: var(--chat-transition);
            font-weight: 600;
            font-family: inherit;
            margin-bottom: 16px;
            box-shadow: var(--chat-shadow-md);
        }

        .chat-assist-widget .chat-start-btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--chat-shadow-lg);
        }

        .chat-assist-widget .chat-response-time {
            font-size: 14px;
            color: var(--chat-color-text-light);
            margin: 0;
        }

        .chat-assist-widget .chat-body {
            display: none;
            flex-direction: column;
            height: 100%;
            overflow: hidden;
        }

        .chat-assist-widget .chat-body.active {
            display: flex;
        }

        .chat-assist-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #f9fafb;
            display: flex;
            flex-direction: column;
            gap: 12px;
            min-height: 0; /* Important for flex child to shrink */
        }

        .chat-assist-widget .chat-messages::-webkit-scrollbar {
            width: 6px;
        }

        .chat-assist-widget .chat-messages::-webkit-scrollbar-track {
            background: transparent;
        }

        .chat-assist-widget .chat-messages::-webkit-scrollbar-thumb {
            background-color: rgba(51, 0, 207, 0.3);
            border-radius: var(--chat-radius-full);
        }

        .chat-assist-widget .chat-bubble {
            padding: 14px 18px;
            border-radius: var(--chat-radius-md);
            max-width: 85%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.6;
            position: relative;
            white-space: pre-line; /* This preserves line breaks */
        }

        .chat-assist-widget .chat-bubble.user-bubble {
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
            box-shadow: var(--chat-shadow-sm);
        }

        .chat-assist-widget .chat-bubble.bot-bubble {
            background: white;
            color: var(--chat-color-text);
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            box-shadow: var(--chat-shadow-sm);
            border: 1px solid var(--chat-color-light);
        }

        .chat-assist-widget .msg-line {
            margin: 2px 0;
        }

        .chat-assist-widget .msg-heading {
            margin: 0 0 2px;
            font-weight: 700;
            color: var(--chat-color-primary);
        }

        .chat-assist-widget .msg-list {
            margin: 4px 0;
            padding-left: 20px;
            list-style: disc outside;
        }

        .chat-assist-widget .msg-gap {
            margin-top: 14px;
        }

        .chat-assist-widget .msg-list li {
            display: list-item;
            list-style: disc outside;
            margin: 4px 0;
            line-height: 1.5;
        }

        .chat-assist-widget .msg-list li::marker {
            color: var(--chat-color-primary);
        }

        .chat-assist-widget .msg-line strong,
        .chat-assist-widget .msg-list strong {
            font-weight: 700;
            color: var(--chat-color-tertiary);
        }

        /* Typing animation */
        .chat-assist-widget .typing-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 14px 18px;
            background: white;
            border-radius: var(--chat-radius-md);
            border-bottom-left-radius: 4px;
            max-width: 80px;
            align-self: flex-start;
            box-shadow: var(--chat-shadow-sm);
            border: 1px solid var(--chat-color-light);
        }

        .chat-assist-widget .typing-dot {
            width: 8px;
            height: 8px;
            background: var(--chat-color-primary);
            border-radius: var(--chat-radius-full);
            opacity: 0.7;
            animation: typingAnimation 1.4s infinite ease-in-out;
        }

        .chat-assist-widget .typing-dot:nth-child(1) {
            animation-delay: 0s;
        }

        .chat-assist-widget .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }

        .chat-assist-widget .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes typingAnimation {
            0%, 60%, 100% {
                transform: translateY(0);
            }
            30% {
                transform: translateY(-4px);
            }
        }

        .chat-assist-widget .chat-controls {
            padding: 16px;
            background: var(--chat-color-surface);
            border-top: 1px solid var(--chat-color-light);
            display: flex;
            flex-direction: column;
            flex-shrink: 0; /* Prevent controls from shrinking */
            position: relative;
            z-index: 1;
        }

        .chat-assist-widget .chat-input-row {
            display: flex;
            gap: 10px;
        }

        .chat-assist-widget .chat-char-counter {
            font-size: 11px;
            color: var(--chat-color-text-light);
            text-align: right;
            margin-top: 2px;
        }

        .chat-assist-widget .chat-char-counter.warning {
            color: #f59e0b;
        }

        .chat-assist-widget .chat-char-counter.error {
            color: #ef4444;
        }

        .chat-assist-widget .chat-textarea {
            flex: 1;
            padding: 14px 16px;
            border: 1px solid var(--chat-color-light);
            border-radius: var(--chat-radius-md);
            background: var(--chat-color-surface);
            color: var(--chat-color-text);
            resize: none;
            font-family: inherit;
            font-size: 14px;
            line-height: 1.5;
            max-height: 120px;
            min-height: 48px;
            transition: var(--chat-transition);
        }

        .chat-assist-widget .chat-textarea:focus {
            outline: none;
            border-color: var(--chat-color-primary);
            box-shadow: 0 0 0 3px rgba(0, 115, 247, 0.2);
        }

        .chat-assist-widget .chat-textarea::placeholder {
            color: var(--chat-color-text-light);
        }

        .chat-assist-widget .chat-submit {
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            border: none;
            border-radius: var(--chat-radius-md);
            width: 48px;
            height: 48px;
            cursor: pointer;
            transition: var(--chat-transition);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: var(--chat-shadow-sm);
        }

        .chat-assist-widget .chat-submit:hover {
            transform: scale(1.05);
            box-shadow: var(--chat-shadow-md);
        }

        .chat-assist-widget .chat-submit svg {
            width: 22px;
            height: 22px;
        }

        .chat-assist-widget .chat-launcher {
            position: fixed;
            bottom: 20px;
            height: 56px;
            border-radius: var(--chat-radius-full);
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: var(--chat-shadow-md);
            z-index: 999;
            transition: var(--chat-transition);
            display: flex;
            align-items: center;
            padding: 0 20px 0 16px;
            gap: 8px;
        }

        .chat-assist-widget .chat-launcher.right-side {
            right: 20px;
        }

        .chat-assist-widget .chat-launcher.left-side {
            left: 20px;
        }

        .chat-assist-widget .chat-launcher:hover {
            transform: scale(1.05);
            box-shadow: var(--chat-shadow-lg);
        }

        .chat-assist-widget .chat-launcher svg {
            width: 24px;
            height: 24px;
        }
        
        .chat-assist-widget .chat-launcher-text {
            font-weight: 600;
            font-size: 15px;
            white-space: nowrap;
        }

        .chat-assist-widget .suggested-questions {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin: 12px 0;
            align-self: flex-start;
            max-width: 85%;
        }

        .chat-assist-widget .suggested-question-btn {
            background: #f3f4f6;
            border: 1px solid var(--chat-color-light);
            border-radius: var(--chat-radius-md);
            padding: 10px 14px;
            text-align: left;
            font-size: 13px;
            color: var(--chat-color-text);
            cursor: pointer;
            transition: var(--chat-transition);
            font-family: inherit;
            line-height: 1.4;
        }

        .chat-assist-widget .suggested-question-btn:hover {
            background: var(--chat-color-light);
            border-color: var(--chat-color-primary);
        }

        .chat-assist-widget .chat-link {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            margin: 2px 0;
            padding: 6px 12px;
            background: var(--chat-color-light);
            color: var(--chat-color-primary);
            border-radius: var(--chat-radius-full);
            font-weight: 600;
            font-size: 13px;
            text-decoration: none;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            transition: var(--chat-transition);
        }

        .chat-assist-widget .chat-link:hover {
            background: var(--chat-color-primary);
            color: white;
        }

        .chat-assist-widget .user-registration {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 24px;
            text-align: center;
            width: 100%;
            max-width: 320px;
            display: none;
        }

        .chat-assist-widget .user-registration.active {
            display: block;
        }

        .chat-assist-widget .registration-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--chat-color-text);
            margin-bottom: 16px;
            line-height: 1.3;
        }

        .chat-assist-widget .registration-form {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 16px;
        }

        .chat-assist-widget .form-field {
            display: flex;
            flex-direction: column;
            gap: 4px;
            text-align: left;
        }

        .chat-assist-widget .form-label {
            font-size: 14px;
            font-weight: 500;
            color: var(--chat-color-text);
        }

        .chat-assist-widget .form-input {
            padding: 12px 14px;
            border: 1px solid var(--chat-color-border);
            border-radius: var(--chat-radius-md);
            font-family: inherit;
            font-size: 14px;
            transition: var(--chat-transition);
        }

        .chat-assist-widget .form-input:focus {
            outline: none;
            border-color: var(--chat-color-primary);
            box-shadow: 0 0 0 3px rgba(0, 115, 247, 0.2);
        }

        .chat-assist-widget .form-input.error {
            border-color: #ef4444;
        }

        .chat-assist-widget .error-text {
            font-size: 12px;
            color: #ef4444;
            margin-top: 2px;
        }

        .chat-assist-widget .submit-registration {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 14px 20px;
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            border: none;
            border-radius: var(--chat-radius-md);
            cursor: pointer;
            font-size: 15px;
            transition: var(--chat-transition);
            font-weight: 600;
            font-family: inherit;
            box-shadow: var(--chat-shadow-md);
        }

        .chat-assist-widget .submit-registration:hover {
            transform: translateY(-2px);
            box-shadow: var(--chat-shadow-lg);
        }

        .chat-assist-widget .submit-registration:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }

        .chat-assist-widget .privacy-note {
            font-size: 12px;
            color: #6b7280;
            text-align: center;
            margin-top: 10px;
        }

        .chat-assist-widget .privacy-note a {
            color: var(--chat-color-primary);
            text-decoration: underline;
        }

        @media (max-width: 520px) {
            .chat-assist-widget .chat-window {
                width: auto;
                left: 10px;
                right: 10px;
                bottom: 80px;
                height: min(580px, calc(100vh - 100px));
                max-height: calc(100vh - 100px);
            }

            .chat-assist-widget .chat-launcher-text {
                display: none;
            }
        }
    `;
    document.head.appendChild(widgetStyles);
    // Default configuration
    const defaultSettings = {
        webhook: {
            url: '',
            route: 'general',
        },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
        },
        style: {
            primaryColor: '#3300cf',
            secondaryColor: '#2600a4',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#1f2937',
        },
        suggestedQuestions: [],
    };

    // Merge user settings with defaults
    const settings = window.ChatWidgetConfig
        ? {
              webhook: { ...defaultSettings.webhook, ...window.ChatWidgetConfig.webhook },
              branding: { ...defaultSettings.branding, ...window.ChatWidgetConfig.branding },
              style: { ...defaultSettings.style, ...window.ChatWidgetConfig.style },
              suggestedQuestions: window.ChatWidgetConfig.suggestedQuestions || defaultSettings.suggestedQuestions,
          }
        : defaultSettings;

    // Session persistence (keeps the conversation across page reloads within the same tab)
    const SESSION_STORAGE_KEY = 'hptChatWidgetSession';

    function loadStoredSession() {
        try {
            const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            return null;
        }
    }

    function persistSession() {
        try {
            sessionStorage.setItem(
                SESSION_STORAGE_KEY,
                JSON.stringify({ conversationId, user: sessionUser, messages: sessionMessages })
            );
        } catch (error) {
            // Ignore storage errors (e.g. private browsing with storage disabled)
        }
    }

    // Session tracking
    const storedSession = loadStoredSession();
    let conversationId = storedSession ? storedSession.conversationId : '';
    let sessionUser = storedSession ? storedSession.user : { name: '', email: '' };
    let sessionMessages = storedSession && Array.isArray(storedSession.messages) ? storedSession.messages : [];
    let isWaitingForResponse = false;

    // Create widget DOM structure
    const widgetRoot = document.createElement('div');
    widgetRoot.className = 'chat-assist-widget';

    // Apply custom colors
    widgetRoot.style.setProperty('--chat-widget-primary', settings.style.primaryColor);
    widgetRoot.style.setProperty('--chat-widget-secondary', settings.style.secondaryColor);
    widgetRoot.style.setProperty('--chat-widget-tertiary', settings.style.secondaryColor);
    widgetRoot.style.setProperty('--chat-widget-surface', settings.style.backgroundColor);
    widgetRoot.style.setProperty('--chat-widget-text', settings.style.fontColor);

    // Create chat panel
    const chatWindow = document.createElement('div');
    chatWindow.className = `chat-window ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;

    // Create chat header with safe DOM manipulation
    const chatHeader = document.createElement('div');
    chatHeader.className = 'chat-header';

    const headerLogo = document.createElement('img');
    headerLogo.className = 'chat-header-logo';
    // Sanitize and validate logo URL
    const logoUrl = String(settings.branding.logo || '').trim();
    if (
        logoUrl &&
        (logoUrl.startsWith('http://') || logoUrl.startsWith('https://') || logoUrl.startsWith('data:image/'))
    ) {
        headerLogo.src = logoUrl;
    } else {
        // Use a safe default or data URL
        headerLogo.src =
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3C/svg%3E';
    }
    headerLogo.alt = htmlEncode(String(settings.branding.name || 'Chat'));

    const headerTitle = document.createElement('span');
    headerTitle.className = 'chat-header-title';
    headerTitle.textContent = String(settings.branding.name);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'chat-close-btn';
    closeBtn.textContent = '×';

    chatHeader.appendChild(headerLogo);
    chatHeader.appendChild(headerTitle);
    chatHeader.appendChild(closeBtn);

    // Create welcome section with safe DOM manipulation
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'chat-welcome';

    const welcomeTitle = document.createElement('h2');
    welcomeTitle.className = 'chat-welcome-title';
    welcomeTitle.textContent = String(settings.branding.welcomeText); 

    const startBtn = document.createElement('button');
    startBtn.className = 'chat-start-btn';
    startBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        Bắt đầu trò chuyện
    `;

    const responseTime = document.createElement('p');
    responseTime.className = 'chat-response-time';
    responseTime.textContent = String(settings.branding.responseTimeText);

    welcomeDiv.appendChild(welcomeTitle);
    welcomeDiv.appendChild(startBtn);
    welcomeDiv.appendChild(responseTime);

    // Create registration form (safe static HTML)
    const registrationDiv = document.createElement('div');
    registrationDiv.className = 'user-registration';
    registrationDiv.innerHTML = `
        <h2 class="registration-title">Vui lòng nhập thông tin để bắt đầu trò chuyện</h2>
        <form class="registration-form">
            <div class="form-field">
                <label class="form-label" for="chat-user-name">Họ tên</label>
                <input type="text" id="chat-user-name" class="form-input" placeholder="Họ tên của bạn"
                       required maxlength="50" minlength="2"
                       title="Tên chỉ được chứa chữ cái, khoảng trắng, dấu gạch ngang và dấu chấm">
                <div class="error-text" id="name-error"></div>
            </div>
            <div class="form-field">
                <label class="form-label" for="chat-user-email">Email</label>
                <input type="email" id="chat-user-email" class="form-input" placeholder="Địa chỉ email của bạn"
                       required maxlength="100" minlength="5"
                       pattern="[a-zA-Z0-9][a-zA-Z0-9._#\-]*[a-zA-Z0-9]@[a-zA-Z0-9][a-zA-Z0-9.\-]*\.[a-zA-Z]{2,}"
                       title="Vui lòng nhập địa chỉ email hợp lệ">
                <div class="error-text" id="email-error"></div>
            </div>
            <button type="submit" class="submit-registration">Tiếp tục trò chuyện</button>
        </form>
        <p class="privacy-note">Bằng việc tiếp tục, bạn đồng ý với <a href="https://d-day.hpt.vn/wp-content/uploads/2026/07/HPT-D-DAY_Privacy-policy_Official.pdf" target="_blank" rel="noopener noreferrer">Chính sách quyền riêng tư</a> của chúng tôi.</p>
    `;

    // Create chat interface (safe static HTML)
    const chatBodyElement = document.createElement('div');
    chatBodyElement.className = 'chat-body';
    chatBodyElement.innerHTML = `
        <div class="chat-messages"></div>
        <div class="chat-controls">
            <div class="chat-input-row">
                <textarea class="chat-textarea" placeholder="Nhập tin nhắn của bạn..." rows="1"
                         maxlength="500"
                         title="Tối đa 500 ký tự. Vui lòng chỉ đặt câu hỏi thông thường."></textarea>
                <button class="chat-submit">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 2L11 13"></path>
                        <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                    </svg>
                </button>
            </div>
            <div class="chat-char-counter">0/500</div>
        </div>
    `;

    // Assemble chat window safely using DOM API
    chatWindow.appendChild(chatHeader);
    chatWindow.appendChild(welcomeDiv);
    chatWindow.appendChild(registrationDiv);
    chatWindow.appendChild(chatBodyElement);

    // Create toggle button
    const launchButton = document.createElement('button');
    launchButton.className = `chat-launcher ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;
    launchButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <span class="chat-launcher-text">Explore more</span>`;

    // Add elements to DOM
    widgetRoot.appendChild(chatWindow);
    widgetRoot.appendChild(launchButton);
    document.body.appendChild(widgetRoot);

    // Get DOM elements
    const startChatButton = chatWindow.querySelector('.chat-start-btn');
    const chatBody = chatWindow.querySelector('.chat-body');
    const messagesContainer = chatWindow.querySelector('.chat-messages');
    const messageTextarea = chatWindow.querySelector('.chat-textarea');
    const sendButton = chatWindow.querySelector('.chat-submit');
    const charCounter = chatWindow.querySelector('.chat-char-counter');

    // Registration form elements
    const registrationForm = chatWindow.querySelector('.registration-form');
    const userRegistration = chatWindow.querySelector('.user-registration');
    const chatWelcome = chatWindow.querySelector('.chat-welcome');
    const nameInput = chatWindow.querySelector('#chat-user-name');
    const emailInput = chatWindow.querySelector('#chat-user-email');
    const nameError = chatWindow.querySelector('#name-error');
    const emailError = chatWindow.querySelector('#email-error');

    // Restore a previous conversation from this tab's session storage, if any
    if (storedSession && storedSession.conversationId && sessionUser.email) {
        chatWelcome.style.display = 'none';
        chatBody.classList.add('active');
        sessionMessages.forEach((msg) => {
            const bubble = document.createElement('div');
            bubble.className = `chat-bubble ${msg.sender}-bubble`;
            if (msg.sender === 'user') {
                bubble.textContent = msg.text;
            } else {
                setBotMessageContent(bubble, msg.text);
            }
            messagesContainer.appendChild(bubble);
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Helper function to generate unique session ID
    function createSessionId() {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        // Fallback for browsers without crypto.randomUUID (e.g. older Safari)
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    // Security functions for input sanitization
    function sanitizeInput(input) {
        // Remove all HTML tags and special characters that could be used for XSS
        return input
            .replace(/[<>\"'&]/g, '') // Remove HTML special chars
            .replace(/[^\p{L}\p{N}\s@.:()\-#]/gu, '') // Allow all Unicode letters, numbers, whitespace, @, ., :, (), -, #
            .trim();
    }

    function sanitizeChatMessage(input) {
        // More restrictive sanitization for chat messages but support Vietnamese and URLs (keeps '/')
        return input
            .replace(/[<>\"'&{}[\]\\]/g, '')
            .replace(/[^\p{L}\p{N}\s.,!?@.:;()\-\/]/gu, '')
            .trim();
    }

    function validateChatMessage(message) {
        // Remove any potentially dangerous characters
        const sanitized = sanitizeChatMessage(message);

        // Check length (1-500 characters)
        if (sanitized.length < 1) {
            return { isValid: false, message: 'Tin nhắn không được để trống' };
        }

        if (sanitized.length > 500) {
            return { isValid: false, message: 'Tin nhắn phải ít hơn 500 ký tự' };
        }

        // Check for code-like patterns
        const codePatterns = [
            /\bfunction\s*\(/i,
            /\bvar\s+\w+/i,
            /\blet\s+\w+/i,
            /\bconst\s+\w+/i,
            /\bif\s*\(/i,
            /\bfor\s*\(/i,
            /\bwhile\s*\(/i,
            /\bclass\s+\w+/i,
            /\bimport\s+/i,
            /\bexport\s+/i,
            /\bconsole\./i,
            /\bdocument\./i,
            /\bwindow\./i,
            /\beval\s*\(/i,
            /\<script\>/i,
            /\bonclick\s*=/i,
            /\bonload\s*=/i,
            /javascript:/i,
            /vbscript:/i,
            /<[^>]*>/g,
            /\$\{.*\}/g,
            /<%.*%>/g,
        ];

        for (const pattern of codePatterns) {
            if (pattern.test(sanitized)) {
                return {
                    isValid: false,
                    message: 'Vui lòng chỉ đặt câu hỏi thông thường. Không cho phép mã hoặc script.',
                };
            }
        }

        // Check for excessive special characters (potential obfuscation) - more lenient for Vietnamese
        const specialCharCount = (sanitized.match(/[^\p{L}\p{N}\s.,!?@:;()\-\/]/gu) || []).length;
        const totalLength = sanitized.length;
        if (specialCharCount > totalLength * 0.4) {
            return { isValid: false, message: 'Quá nhiều ký tự đặc biệt. Vui lòng dùng ngôn ngữ thông thường.' };
        }

        return { isValid: true, sanitized };
    }

    function validateName(name) {
        // Remove any potentially dangerous characters
        const sanitized = sanitizeInput(name);

        // Check length (2-50 characters)
        if (sanitized.length < 2 || sanitized.length > 50) {
            return { isValid: false, message: 'Họ tên phải từ 2 đến 50 ký tự' };
        }

        if (!/^[\p{L}\s.()'-]+$/u.test(sanitized)) {
            return { isValid: false, message: 'Họ tên chỉ được chứa chữ cái, khoảng trắng, dấu gạch ngang, dấu chấm và dấu ngoặc đơn' };
        }

        return { isValid: true, sanitized };
    }

    function validateEmail(email) {
        // Remove any potentially dangerous characters
        const sanitized = sanitizeInput(email);

        // Check length (5-100 characters)
        if (sanitized.length < 5 || sanitized.length > 100) {
            return { isValid: false, message: 'Email phải từ 5 đến 100 ký tự' };
        }

        // Strict email validation - allow # for email aliases
        const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._#-]*[a-zA-Z0-9]@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(sanitized)) {
            return { isValid: false, message: 'Vui lòng nhập địa chỉ email hợp lệ' };
        }

        return { isValid: true, sanitized };
    }

    // Create typing indicator element
    function createTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        return indicator;
    }

    function htmlEncode(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Helper function to validate HTTP/HTTPS URLs only - more strict validation
    function isValidHttpUrl(string) {
        // Basic checks first
        if (!string || typeof string !== 'string') {
            return false;
        }

        // Check length to prevent DoS attacks
        if (string.length > 2048) {
            return false;
        }

        // Check for dangerous patterns in URL BEFORE validation
        const dangerousPatterns = [
            /<script/i,
            /javascript:/i,
            /data:/i,
            /vbscript:/i,
            /on\w+=/i,
            /%3C/i, // encoded <
            /%3E/i, // encoded >
            /%3c/i, // lowercase encoded <
            /%3e/i, // lowercase encoded >
        ];

        for (const pattern of dangerousPatterns) {
            if (pattern.test(string)) {
                return false;
            }
        }

        let url;
        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }

        // Only allow http and https protocols - strict comparison
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            return false;
        }

        return true;
    }

    // Turns URLs into short domain-label pills. Operates on text that is ALREADY
    // HTML-encoded (never call this with raw/unescaped text).
    function linkifyEncoded(encodedText) {
        // More restrictive URL pattern - only http/https with strict domain format
        // Only matches proper URLs with domain names (requires at least one dot)
        const urlPattern =
            /\b(https?):\/\/[a-zA-Z0-9][-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_\+.~#?&\/=]*/gi;

        // Convert URLs to HTML links WITHOUT decoding (prevents encoding bypass)
        return encodedText.replace(urlPattern, function (match) {
            // CRITICAL FIX: Don't decode the URL! Work directly with encoded text
            // This prevents XSS through URL encoding bypass attacks

            // Simple protocol check on the already-encoded text
            const lowerMatch = match.toLowerCase();
            const startsWithHttp =
                lowerMatch.startsWith('http://') ||
                lowerMatch.startsWith('https://') ||
                lowerMatch.startsWith('&lt;http://') ||
                lowerMatch.startsWith('&lt;https://');

            // Only create link if it starts with http/https
            if (startsWithHttp && match.length < 500) {
                // Use the already-encoded URL for href, but show a short "domain" label
                // instead of the raw URL so long links don't clutter the chat bubble.
                // match is already HTML-encoded, so slicing it is still safe to reinsert.
                const hostMatch = match.match(/^https?:\/\/([^\/?#]+)/i);
                const label = hostMatch ? `🔗 ${hostMatch[1]}` : '🔗 Mở liên kết';
                return `<a href="${match}" target="_blank" rel="noopener noreferrer" class="chat-link">${label}</a>`;
            } else {
                // Return as plain encoded text if invalid or too long
                return match;
            }
        });
    }

    // Encodes one already-sanitized line, turns **bold** into <strong>, then linkifies.
    function formatInlineLine(line) {
        const encoded = htmlEncode(line).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        return linkifyEncoded(encoded);
    }

    // Renders bot text as spaced paragraphs/bullet lists instead of one flat blob,
    // so long structured answers (agendas, speaker lists, ...) stay readable. Bot
    // text has no reliable markup for "this line is a heading", so this only acts
    // on signals that ARE reliable: blank lines (paragraph breaks) and "* "/"- "
    // bullets - it doesn't try to guess semantic headings from letter casing.
    function formatBotText(text) {
        const lines = String(text).split('\n');
        let html = '';
        let inList = false;
        let newParagraph = false;
        const closeList = () => {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
        };

        for (const rawLine of lines) {
            const line = rawLine.trim();
            if (line === '') {
                closeList();
                newParagraph = true;
                continue;
            }

            const bulletMatch = line.match(/^[*-]\s+(.*)$/);
            if (bulletMatch) {
                if (!inList) {
                    html += `<ul class="msg-list${newParagraph ? ' msg-gap' : ''}">`;
                    inList = true;
                    newParagraph = false;
                }
                html += `<li>${formatInlineLine(bulletMatch[1])}</li>`;
                continue;
            }

            closeList();
            // The first line of a new paragraph (after a blank line) reads as a section
            // title far more reliably than letter-casing does - as long as it's short,
            // so a long topic sentence starting a new paragraph doesn't get bolded whole.
            const isTitleLike = newParagraph && line.length <= 100;
            const cssClass = isTitleLike ? 'msg-heading msg-gap' : `msg-line${newParagraph ? ' msg-gap' : ''}`;
            newParagraph = false;
            html += `<div class="${cssClass}">${formatInlineLine(line)}</div>`;
        }
        closeList();
        return html;
    }

    // Safe function to set bot message content with comprehensive XSS protection
    function setBotMessageContent(messageElement, text) {
        // Validate and sanitize the response text
        if (typeof text !== 'string') {
            text = String(text || '');
        }

        // Comprehensive sanitization - remove ALL potentially dangerous content
        const sanitizedText = text
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
            .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') // Remove object tags
            .replace(/<embed\b[^>]*>/gi, '') // Remove embed tags
            .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '') // Remove form tags
            .replace(/javascript:/gi, '') // Remove javascript: protocols
            .replace(/vbscript:/gi, '') // Remove vbscript: protocols
            .replace(/data:/gi, '') // Remove data: protocols (can be dangerous)
            .replace(/on\w+\s*=/gi, '') // Remove ALL event handlers (onclick, onload, etc)
            .replace(/<link\b[^>]*>/gi, '') // Remove link tags
            .replace(/<meta\b[^>]*>/gi, '') // Remove meta tags
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove style tags
            .replace(/expression\s*\(/gi, '') // Remove CSS expressions
            .replace(/url\s*\(/gi, '') // Remove CSS url() functions
            .replace(/@import/gi, '') // Remove CSS @import
            .replace(/&lt;script/gi, '') // Remove encoded script tags
            .replace(/&lt;iframe/gi, '') // Remove encoded iframe tags
            .replace(/&#x3C;script/gi, '') // Remove hex-encoded script tags
            .replace(/&#60;script/gi, ''); // Remove decimal-encoded script tags

        // Additional validation - check for suspicious JavaScript patterns
        const suspiciousPatterns = [
            /eval\s*\(/gi,
            /function\s*\(/gi,
            /constructor\s*\(/gi,
            /prototype\s*\[/gi,
            /window\s*\[/gi,
            /document\s*\[/gi,
            /alert\s*\(/gi,
            /confirm\s*\(/gi,
            /prompt\s*\(/gi,
        ];

        for (const pattern of suspiciousPatterns) {
            if (pattern.test(sanitizedText)) {
                // If suspicious content detected, return safe fallback message
                messageElement.textContent = '⚠️ Phản hồi chứa nội dung không an toàn và đã bị chặn vì lý do bảo mật.';
                messageElement.style.color = '#ef4444';
                return;
            }
        }

        // Render as headings/paragraphs/bullets instead of one flat blob of text
        messageElement.innerHTML = formatBotText(sanitizedText);
    }

    // Show registration form
    function showRegistrationForm() {
        chatWelcome.style.display = 'none';
        userRegistration.classList.add('active');
    }

    // POST a payload to the configured webhook with a timeout so a hung n8n instance
    // doesn't leave the user staring at the typing indicator forever
    async function postToWebhook(payload, timeoutMs = 45000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(settings.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: controller.signal,
            });
            return await response.json();
        } finally {
            clearTimeout(timeoutId);
        }
    }

    // The webhook's `output` field is either a plain string (legacy) or a structured
    // { answer, suggestedQuestions } object produced by the n8n Structured Output Parser
    function extractBotReply(responseData) {
        const raw = Array.isArray(responseData) ? responseData[0]?.output : responseData?.output;
        if (raw && typeof raw === 'object') {
            return {
                text: raw.answer || '',
                suggestedQuestions: Array.isArray(raw.suggestedQuestions) ? raw.suggestedQuestions : [],
            };
        }
        return { text: raw || '', suggestedQuestions: [] };
    }

    // Render a row of clickable follow-up question buttons; clicking one submits it and clears the row
    function renderSuggestedQuestions(questions) {
        if (!Array.isArray(questions) || questions.length === 0) return;

        const suggestedQuestionsContainer = document.createElement('div');
        suggestedQuestionsContainer.className = 'suggested-questions';

        questions.forEach((question) => {
            const questionButton = document.createElement('button');
            questionButton.className = 'suggested-question-btn';
            questionButton.textContent = question;
            questionButton.addEventListener('click', () => {
                submitMessage(question);
                if (suggestedQuestionsContainer.parentNode) {
                    suggestedQuestionsContainer.parentNode.removeChild(suggestedQuestionsContainer);
                }
            });
            suggestedQuestionsContainer.appendChild(questionButton);
        });

        messagesContainer.appendChild(suggestedQuestionsContainer);
    }

    // Add a message bubble to the chat and persist it so a page reload doesn't lose the conversation
    function addChatBubble(text, sender) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender}-bubble`;
        if (sender === 'user') {
            bubble.textContent = text;
        } else {
            setBotMessageContent(bubble, text);
        }
        messagesContainer.appendChild(bubble);

        sessionMessages.push({ sender, text });
        persistSession();

        return bubble;
    }

    // Handle registration form submission
    async function handleRegistration(event) {
        event.preventDefault();

        // Reset error messages
        nameError.textContent = '';
        emailError.textContent = '';
        nameInput.classList.remove('error');
        emailInput.classList.remove('error');

        // Get and validate name
        const nameResult = validateName(nameInput.value);
        if (!nameResult.isValid) {
            nameError.textContent = nameResult.message;
            nameInput.classList.add('error');
            return;
        }

        // Get and validate email
        const emailResult = validateEmail(emailInput.value);
        if (!emailResult.isValid) {
            emailError.textContent = emailResult.message;
            emailInput.classList.add('error');
            return;
        }

        // Use sanitized values
        const name = nameResult.sanitized;
        const email = emailResult.sanitized;

        // Initialize conversation with user data
        conversationId = createSessionId();
        sessionUser = { name, email };
        persistSession();

        // First, load the session
        const sessionData = [
            {
                action: 'loadPreviousSession',
                sessionId: conversationId,
                route: settings.webhook.route,
                metadata: {
                    userId: email,
                    userName: name,
                },
            },
        ];

        try {
            // Hide registration form, show chat interface
            userRegistration.classList.remove('active');
            chatBody.classList.add('active');

            // Show typing indicator
            const typingIndicator = createTypingIndicator();
            messagesContainer.appendChild(typingIndicator);

            // Load session
            await postToWebhook(sessionData);

            // Send user info as first message
            const userInfoMessage = `Name: ${name}\nEmail: ${email}`;

            const userInfoData = {
                action: 'sendMessage',
                sessionId: conversationId,
                route: settings.webhook.route,
                chatInput: userInfoMessage,
                metadata: {
                    userId: email,
                    userName: name,
                    isUserInfo: true,
                },
            };

            // Send user info
            const userInfoResponseData = await postToWebhook(userInfoData);

            // Remove typing indicator
            messagesContainer.removeChild(typingIndicator);

            // Display initial bot message with clickable links
            const { text: messageText, suggestedQuestions: aiSuggestions } = extractBotReply(userInfoResponseData);
            addChatBubble(messageText || 'Xin lỗi, tôi chưa nhận được phản hồi hợp lệ. Vui lòng thử lại.', 'bot');

            // Prefer AI-generated follow-ups; fall back to the configured starter questions
            const initialSuggestions =
                aiSuggestions.length > 0
                    ? aiSuggestions
                    : Array.isArray(settings.suggestedQuestions)
                      ? settings.suggestedQuestions
                      : [];
            renderSuggestedQuestions(initialSuggestions);

            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Registration error:', error);

            // Remove typing indicator if it exists
            const indicator = messagesContainer.querySelector('.typing-indicator');
            if (indicator) {
                messagesContainer.removeChild(indicator);
            }

            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'chat-bubble bot-bubble';
            errorMessage.textContent = 'Xin lỗi, tôi không thể kết nối tới máy chủ. Vui lòng thử lại sau.';
            messagesContainer.appendChild(errorMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    // Send a message to the webhook
    async function submitMessage(messageText) {
        if (isWaitingForResponse) return;

        // Validate the message text
        const messageResult = validateChatMessage(messageText);
        if (!messageResult.isValid) {
            // Show error message to user
            const errorMessage = document.createElement('div');
            errorMessage.className = 'chat-bubble bot-bubble';
            errorMessage.style.borderColor = '#ef4444';
            errorMessage.style.color = '#ef4444';
            errorMessage.textContent = messageResult.message;
            messagesContainer.appendChild(errorMessage);

            // Scroll to bottom
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 10);
            return;
        }

        const sanitizedMessage = messageResult.sanitized;
        isWaitingForResponse = true;

        // Get user info if available (use sanitized values)
        const email = emailInput && emailInput.value ? validateEmail(emailInput.value).sanitized || '' : '';
        const name = nameInput && nameInput.value ? validateName(nameInput.value).sanitized || '' : '';

        const requestData = {
            action: 'sendMessage',
            sessionId: conversationId,
            route: settings.webhook.route,
            chatInput: sanitizedMessage,
            metadata: {
                userId: email,
                userName: name,
            },
        };

        // Display user message (using sanitized message)
        addChatBubble(sanitizedMessage, 'user');

        // Show typing indicator
        const typingIndicator = createTypingIndicator();
        messagesContainer.appendChild(typingIndicator);

        // Scroll to bottom immediately
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 10);

        try {
            const responseData = await postToWebhook(requestData);

            // Remove typing indicator
            messagesContainer.removeChild(typingIndicator);

            // Display bot response with clickable links
            const { text: responseText, suggestedQuestions } = extractBotReply(responseData);
            addChatBubble(responseText || 'Xin lỗi, tôi chưa nhận được phản hồi hợp lệ. Vui lòng thử lại.', 'bot');
            renderSuggestedQuestions(suggestedQuestions);

            // Scroll to bottom after adding message
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 10);
        } catch (error) {
            console.error('Message submission error:', error);

            // Remove typing indicator
            messagesContainer.removeChild(typingIndicator);

            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'chat-bubble bot-bubble';
            errorMessage.textContent = 'Xin lỗi, tôi không thể gửi tin nhắn của bạn. Vui lòng thử lại.';
            messagesContainer.appendChild(errorMessage);

            // Scroll to bottom
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 10);
        } finally {
            isWaitingForResponse = false;
        }
    }

    // Auto-resize textarea as user types and update character counter
    function autoResizeTextarea() {
        messageTextarea.style.height = 'auto';
        messageTextarea.style.height = (messageTextarea.scrollHeight > 120 ? 120 : messageTextarea.scrollHeight) + 'px';

        // Update character counter
        const currentLength = messageTextarea.value.length;
        const maxLength = 500;
        charCounter.textContent = `${currentLength}/${maxLength}`;

        // Change color based on character count
        charCounter.classList.remove('warning', 'error');
        if (currentLength > maxLength * 0.9) {
            charCounter.classList.add('error');
        } else if (currentLength > maxLength * 0.8) {
            charCounter.classList.add('warning');
        }
    }

    // Event listeners
    startChatButton.addEventListener('click', showRegistrationForm);
    registrationForm.addEventListener('submit', handleRegistration);

    sendButton.addEventListener('click', () => {
        const messageText = messageTextarea.value.trim();
        if (messageText && !isWaitingForResponse) {
            submitMessage(messageText);
            messageTextarea.value = '';
            messageTextarea.style.height = 'auto';
            autoResizeTextarea(); // Update counter
        }
    });

    messageTextarea.addEventListener('input', autoResizeTextarea);

    messageTextarea.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            const messageText = messageTextarea.value.trim();
            if (messageText && !isWaitingForResponse) {
                submitMessage(messageText);
                messageTextarea.value = '';
                messageTextarea.style.height = 'auto';
                autoResizeTextarea(); // Update counter
            }
        }
    });

    launchButton.addEventListener('click', () => {
        chatWindow.classList.toggle('visible');
    });

    // Close button functionality
    const closeButtons = chatWindow.querySelectorAll('.chat-close-btn');
    closeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            chatWindow.classList.remove('visible');
        });
    });
})();
