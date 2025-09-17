/**
 * Sistema de Autenticação Local para Serviço em Casa
 * Gerencia login, logout e verificação de sessão
 */

class AuthManager {
    constructor() {
        this.sessionKey = 'userSession';
        this.init();
    }

    init() {
        // Verificar se está na página de login
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            return; // Não fazer verificação automática na página de login
        }
        
        // Verificar autenticação em outras páginas
        this.checkAuthentication();
        this.updateNavigation();
    }

    // Verificar se o usuário está autenticado
    isAuthenticated() {
        const session = localStorage.getItem(this.sessionKey);
        if (!session) return false;
        
        try {
            const userData = JSON.parse(session);
            return userData.isLoggedIn === true;
        } catch (e) {
            return false;
        }
    }

    // Obter dados do usuário logado
    getUserData() {
        const session = localStorage.getItem(this.sessionKey);
        if (!session) return null;
        
        try {
            return JSON.parse(session);
        } catch (e) {
            return null;
        }
    }

    // Verificar autenticação e redirecionar se necessário
    checkAuthentication() {
        if (!this.isAuthenticated()) {
            this.showLoginRequired();
        }
    }

    // Mostrar mensagem de login necessário
    showLoginRequired() {
        // Criar modal de aviso
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            ">
                <div style="
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    text-align: center;
                    max-width: 400px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                ">
                    <i class="fas fa-lock" style="font-size: 48px; color: #667eea; margin-bottom: 20px;"></i>
                    <h3 style="color: #333; margin-bottom: 15px;">Acesso Restrito</h3>
                    <p style="color: #666; margin-bottom: 25px;">
                        Você precisa fazer login para acessar esta página.
                    </p>
                    <button onclick="authManager.redirectToLogin()" style="
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        margin-right: 10px;
                    ">
                        <i class="fas fa-sign-in-alt"></i> Fazer Login
                    </button>
                    <button onclick="authManager.continueAsGuest()" style="
                        background: transparent;
                        color: #667eea;
                        border: 2px solid #667eea;
                        padding: 12px 30px;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                    ">
                        <i class="fas fa-eye"></i> Continuar como Visitante
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Redirecionar para login
    redirectToLogin() {
        window.location.href = 'index.html';
    }

    // Continuar como visitante (sem funcionalidades restritas)
    continueAsGuest() {
        // Remover modal
        const modal = document.querySelector('div[style*="position: fixed"]').parentElement;
        if (modal) modal.remove();
        
        // Marcar como visitante
        localStorage.setItem('guestMode', 'true');
        this.updateNavigation();
    }

    // Fazer logout
    logout() {
        localStorage.removeItem(this.sessionKey);
        localStorage.removeItem('guestMode');
        
        // Mostrar mensagem de logout
        this.showMessage('Logout realizado com sucesso!', 'success');
        
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    // Atualizar navegação baseada no status de login
    updateNavigation() {
        const userData = this.getUserData();
        const isGuest = localStorage.getItem('guestMode') === 'true';
        
        // Encontrar o menu de navegação
        const navbar = document.querySelector('.navbar-nav');
        if (!navbar) return;

        // Remover link de login se estiver logado
        const loginLink = navbar.querySelector('a[href="index.html"]');
        
        if (userData && userData.isLoggedIn) {
            // Usuário logado - mostrar informações do usuário e logout
            if (loginLink) {
                const userTypeIcon = userData.userType === 'prestador' ? 'fas fa-tools' : 
                                   userData.userType === 'admin' ? 'fas fa-crown' : 'fas fa-user';
                const userTypeLabel = userData.userType === 'prestador' ? 'PRESTADOR' : 
                                    userData.userType === 'admin' ? 'ADMIN' : 'CLIENTE';
                
                loginLink.innerHTML = `
                    <i class="${userTypeIcon}"></i> ${userData.username} <small style="color: #667eea;">(${userTypeLabel})</small>
                `;
                loginLink.href = '#';
                loginLink.onclick = (e) => {
                    e.preventDefault();
                    this.showUserMenu();
                };
            }
        } else if (isGuest) {
            // Visitante - manter link de login
            if (loginLink) {
                loginLink.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            }
        }

        // Adicionar indicador visual para funcionalidades restritas
        this.markRestrictedFeatures();
    }

    // Mostrar menu do usuário
    showUserMenu() {
        const userData = this.getUserData();
        
        const menu = document.createElement('div');
        menu.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            " onclick="this.remove()">
                <div style="
                    background: white;
                    padding: 25px;
                    border-radius: 15px;
                    text-align: center;
                    min-width: 300px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                " onclick="event.stopPropagation()">
                    <div style="margin-bottom: 20px;">
                        <i class="${userData.userType === 'prestador' ? 'fas fa-tools' : userData.userType === 'admin' ? 'fas fa-crown' : 'fas fa-user-circle'}" 
                           style="font-size: 48px; color: ${userData.userType === 'prestador' ? '#28a745' : userData.userType === 'admin' ? '#ffc107' : '#667eea'};"></i>
                    </div>
                    <h4 style="color: #333; margin-bottom: 10px;">${userData.username}</h4>
                    <p style="color: ${userData.userType === 'prestador' ? '#28a745' : userData.userType === 'admin' ? '#ffc107' : '#667eea'}; 
                              margin-bottom: 20px; 
                              font-weight: bold; 
                              text-transform: uppercase;
                              background: ${userData.userType === 'prestador' ? '#e8f5e8' : userData.userType === 'admin' ? '#fff3cd' : '#e8f0fe'};
                              padding: 8px 16px;
                              border-radius: 20px;
                              display: inline-block;">
                        <i class="${userData.userType === 'prestador' ? 'fas fa-tools' : userData.userType === 'admin' ? 'fas fa-crown' : 'fas fa-user'}"></i> 
                        ${userData.userType === 'prestador' ? 'PRESTADOR DE SERVIÇOS' : userData.userType === 'admin' ? 'ADMINISTRADOR' : 'CLIENTE'}
                    </p>
                    <p style="color: #999; font-size: 12px; margin-bottom: 25px;">
                        Logado em: ${new Date(userData.loginTime).toLocaleString('pt-BR')}
                    </p>
                    <button onclick="authManager.logout()" style="
                        background: #dc3545;
                        color: white;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        width: 100%;
                    ">
                        <i class="fas fa-sign-out-alt"></i> Sair
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(menu);
    }

    // Marcar funcionalidades que requerem login
    markRestrictedFeatures() {
        const userData = this.getUserData();
        const isGuest = localStorage.getItem('guestMode') === 'true';
        
        if (!userData || !userData.isLoggedIn) {
            // Adicionar indicadores visuais para botões que requerem login
            const restrictedButtons = document.querySelectorAll('a[href="#"], .btn-primary');
            
            restrictedButtons.forEach(button => {
                if (button.textContent.includes('Agendar') || 
                    button.textContent.includes('Contratar') ||
                    button.textContent.includes('Solicitar')) {
                    
                    button.onclick = (e) => {
                        e.preventDefault();
                        this.showLoginRequired();
                    };
                    
                    // Adicionar indicador visual
                    if (!button.querySelector('.login-required')) {
                        const indicator = document.createElement('small');
                        indicator.className = 'login-required';
                        indicator.innerHTML = ' <i class="fas fa-lock" style="font-size: 10px;"></i>';
                        indicator.style.opacity = '0.7';
                        button.appendChild(indicator);
                    }
                }
            });
        }
    }

    // Mostrar mensagem
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10001;
            animation: slideIn 0.3s ease;
        `;
        
        if (type === 'success') {
            messageDiv.style.background = '#28a745';
        } else if (type === 'error') {
            messageDiv.style.background = '#dc3545';
        } else {
            messageDiv.style.background = '#17a2b8';
        }
        
        messageDiv.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
        
        // Adicionar animação CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(messageDiv);
        
        // Remover após 4 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 4000);
    }
}

// Inicializar o gerenciador de autenticação
const authManager = new AuthManager();

// Exportar para uso global
window.authManager = authManager;