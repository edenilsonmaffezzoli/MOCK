/**
 * Script para gerenciar o formulário de contato
 * Conecta com o backend Django via API
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
});

async function handleContactFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Obter dados do formulário
    const formData = {
        name: form.querySelector('#name').value,
        email: form.querySelector('#email').value,
        subject: form.querySelector('#subject').value,
        service: form.querySelector('#service').value,
        message: form.querySelector('#message').value
    };
    
    // Validar dados
    if (!validateContactForm(formData)) {
        return;
    }
    
    // Mostrar loading
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    try {
        // Enviar para o backend Django
        const response = await apiClient.sendContactForm(formData);
        
        // Mostrar sucesso
        showMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        
        // Limpar formulário
        form.reset();
        
    } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        
        // Mostrar erro
        showMessage('Erro ao enviar mensagem. Tente novamente mais tarde.', 'error');
    } finally {
        // Restaurar botão
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

function validateContactForm(data) {
    const errors = [];
    
    if (!data.name.trim()) {
        errors.push('Nome é obrigatório');
    }
    
    if (!data.email.trim()) {
        errors.push('Email é obrigatório');
    } else if (!isValidEmail(data.email)) {
        errors.push('Email inválido');
    }
    
    if (!data.subject.trim()) {
        errors.push('Assunto é obrigatório');
    }
    
    if (!data.service || data.service === 'Selecione o tipo de serviço') {
        errors.push('Tipo de serviço é obrigatório');
    }
    
    if (!data.message.trim()) {
        errors.push('Mensagem é obrigatória');
    }
    
    if (errors.length > 0) {
        showMessage('Por favor, corrija os seguintes erros:\n' + errors.join('\n'), 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(message, type = 'info') {
    // Remover mensagem anterior se existir
    const existingMessage = document.querySelector('.contact-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Criar nova mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = `contact-message alert alert-${type === 'success' ? 'success' : 'danger'}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        max-width: 400px;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease-out;
    `;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';
    const bgColor = type === 'success' ? '#d4edda' : '#f8d7da';
    const textColor = type === 'success' ? '#155724' : '#721c24';
    const borderColor = type === 'success' ? '#c3e6cb' : '#f5c6cb';
    
    messageDiv.style.backgroundColor = bgColor;
    messageDiv.style.color = textColor;
    messageDiv.style.border = `1px solid ${borderColor}`;
    
    messageDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="${icon}"></i>
            <div style="flex: 1;">${message.replace(/\n/g, '<br>')}</div>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: none;
                border: none;
                color: ${textColor};
                cursor: pointer;
                font-size: 18px;
                padding: 0;
                margin-left: 10px;
            ">&times;</button>
        </div>
    `;
    
    // Adicionar CSS de animação se não existir
    if (!document.querySelector('#contact-message-styles')) {
        const style = document.createElement('style');
        style.id = 'contact-message-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(messageDiv);
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => messageDiv.remove(), 300);
        }
    }, 5000);
}