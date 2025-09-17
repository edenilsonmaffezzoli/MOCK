# Guia de Deployment - Home Services

## 📋 Resumo das Configurações Implementadas

### ✅ Configurações Concluídas

1. **Settings.py para Produção**
   - ✅ DEBUG configurado via variável de ambiente
   - ✅ ALLOWED_HOSTS incluindo Railway e GitHub Pages
   - ✅ Configuração de banco PostgreSQL para produção
   - ✅ WhiteNoise para arquivos estáticos
   - ✅ CORS configurado para GitHub Pages

2. **API Endpoints Criados**
   - ✅ `/api/contact/` - Formulário de contato
   - ✅ `/api/services/` - Lista de serviços
   - ✅ `/api/services/categories/` - Categorias de serviços
   - ✅ `/api/workers/` - Lista de trabalhadores
   - ✅ `/api/health/` - Verificação de saúde da API
   - ✅ `/api/login/` - Autenticação (já existia)

3. **Frontend Configurado**
   - ✅ URL da API atualizada para Railway
   - ✅ Scripts de conexão com backend
   - ✅ Formulário de contato funcional
   - ✅ Página de teste de conexão

4. **Arquivos de Deployment**
   - ✅ `requirements.txt` com todas as dependências
   - ✅ `Procfile` para Railway
   - ✅ `railway.json` com configurações de build

## 🚀 Instruções de Deployment

### Railway (Backend)

1. **Variáveis de Ambiente no Railway:**
   ```
   DEBUG=False
   SECRET_KEY=seu-secret-key-aqui
   DATABASE_URL=postgresql://... (será configurado automaticamente)
   EMAIL_HOST_USER=home30801@gmail.com
   EMAIL_HOST_PASSWORD=niuttorjgugzjued
   ```

2. **Deploy:**
   - Conecte seu repositório GitHub ao Railway
   - O Railway detectará automaticamente o `Procfile`
   - O build será executado conforme `railway.json`

### GitHub Pages (Frontend)

1. **Configuração:**
   - O site já está configurado em `github-pages-site/`
   - URL da API já atualizada para Railway
   - Workflows do GitHub Actions configurados

2. **Deploy:**
   - Faça push das alterações para o repositório
   - O GitHub Pages será atualizado automaticamente

## 🔧 URLs Importantes

- **Backend (Railway):** https://mock-production-0129.up.railway.app
- **Frontend (GitHub Pages):** https://edenilsonmaffezzoli.github.io
- **Teste de Conexão:** https://edenilsonmaffezzoli.github.io/test-connection.html

## 📝 Endpoints da API

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/health/` | GET | Verificação de saúde |
| `/api/contact/` | POST | Envio de formulário de contato |
| `/api/services/` | GET | Lista de serviços |
| `/api/services/categories/` | GET | Categorias de serviços |
| `/api/workers/` | GET | Lista de trabalhadores |
| `/api/login/` | POST | Autenticação |

## 🧪 Testando a Conexão

1. Acesse: `test-connection.html` no seu site
2. Clique em "Teste Básico" para verificar conectividade
3. Teste os endpoints específicos com os outros botões
4. Verifique se não há erros de CORS no console

## 🔍 Troubleshooting

### Problemas Comuns:

1. **Erro de CORS:**
   - Verifique se o domínio está em `CORS_ALLOWED_ORIGINS`
   - Confirme se `CORS_ALLOW_ALL_ORIGINS = True`

2. **Erro 500 no Railway:**
   - Verifique as variáveis de ambiente
   - Execute `python manage.py migrate` no Railway

3. **Arquivos estáticos não carregam:**
   - Execute `python manage.py collectstatic`
   - Verifique configuração do WhiteNoise

## 📊 Monitoramento

- Use a página de teste para verificar status da API
- Monitore logs no Railway Dashboard
- Verifique métricas de performance no Railway

## 🔄 Próximos Passos

1. Configurar domínio customizado (opcional)
2. Implementar sistema de cache
3. Configurar monitoramento de erros
4. Otimizar performance da API
5. Implementar testes automatizados

---

**Status:** ✅ Pronto para produção
**Última atualização:** $(date)