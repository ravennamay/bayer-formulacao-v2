# Sistema de Health Check do Backend

## 📋 Visão Geral

O aplicativo agora inclui um sistema automático de monitoramento da saúde do servidor (Health Check) que:

- ✅ Verifica a conexão com o backend a cada 30 segundos
- ✅ Mostra mensagens de erro informativas e detalhadas
- ✅ Fornece status em tempo real com tempo de resposta
- ✅ Oferece sugestões de troubleshooting quando o servidor está offline
- ✅ Funciona 24/7 em segundo plano

## 🔧 Como Funciona

### Arquivos Implementados

1. **`src/healthCheck.ts`** - Gerenciador de health check
   - Realiza verificações periódicas
   - Fornece mensagens de erro contextualizadas
   - Sistema de listeners para atualização em tempo real

2. **`src/useHealthCheck.ts`** - Hook React para Health Check
   - Integração fácil com componentes
   - Gerenciamento global automático

3. **`components/ServerStatusIndicator.tsx`** - Componente Visual
   - Indicador de status com animações
   - Modal com detalhes completos
   - Guia de troubleshooting

4. **`app/(tabs)/index.tsx`** - Homepage atualizada
   - Indicador de status visível no header

## 🚀 Como Usar

### Para Desenvolvedores

1. **Use o Hook em Qualquer Componente:**

```tsx
import { useHealthCheck } from '../src/useHealthCheck';
import { ServerStatusIndicator } from '../components/ServerStatusIndicator';

export default function MyComponent() {
  const healthStatus = useHealthCheck();

  return (
    <View>
      <ServerStatusIndicator healthStatus={healthStatus} />
      {!healthStatus.isHealthy && (
        <Text>Servidor offline: {healthStatus.message}</Text>
      )}
    </View>
  );
}
```

2. **Controlar o Monitoramento:**

```tsx
import { startHealthCheck, stopHealthCheck } from '../src/useHealthCheck';

// Iniciar monitoramento
startHealthCheck();

// Parar monitoramento
stopHealthCheck();
```

## 📊 Mensagens de Erro Informativas

O sistema fornece mensagens contextualizadas para cada tipo de erro:

| Erro | Mensagem | O que fazer |
|------|----------|-----------|
| Servidor offline | "Conexão recusada. Certifique-se que o servidor está rodando..." | Inicie o backend |
| Timeout | "Servidor demorando para responder..." | Verifique a rede |
| 404 Not Found | "Endpoint de saúde não encontrado..." | Configure o endpoint `/health` |
| 5xx Server Error | "Erro do servidor (500)..." | Verifique logs do backend |
| Network Error | "Erro de rede. Verifique sua conexão..." | Verifique WiFi/4G |

## 🛠️ Configuração do Backend

### Adicione um Endpoint de Health Check

No seu backend (por exemplo, FastAPI/Python):

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0"
    }
```

Ou em Node.js/Express:

```javascript
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});
```

## 📱 Indicador Visual

O status do servidor aparece:

1. **Na Home Page** - Pequeno indicador com ponto colorido
   - 🟢 Verde = Servidor online
   - 🔴 Vermelho = Servidor offline (com animação de pulsação)

2. **Modal Detalhado** - Clique para mais informações
   - Status completo
   - Tempo de resposta
   - Última verificação
   - Guia de troubleshooting

## ⚙️ Variáveis de Ambiente

Certifique-se que a variável está configurada:

```env
EXPO_PUBLIC_BACKEND_URL=http://seu-servidor.com:8000
```

## 🔄 Fluxo de Funcionamento

```
App Inicia
    ↓
useHealthCheck Hook é chamado
    ↓
HealthCheckManager cria verificação periódica
    ↓
A cada 30 segundos:
  - Envia GET /health ao backend
  - Registra tempo de resposta
  - Notifica listeners com novo status
  ↓
Componentes reagindo ao status:
  - Indicador muda de cor
  - Mensagens são atualizadas
  - Modal mostra detalhes
```

## 🧪 Testando Localmente

1. **Parar o Backend:**
```bash
# O app deve mostrar "Offline" em segundos
# Mensagem: "Conexão recusada..."
```

2. **Reiniciar o Backend:**
```bash
# O app deve voltar ao status "Online"
```

3. **Simular Timeout:**
```bash
# Desativar internet - app mostra "Servidor demorando..."
```

## 📊 Monitoramento em Produção

Para produção (EAS Build):

1. Certifique-se que o backend está sempre rodando
2. Configure um serviço de uptime monitoring (Uptime Robot, etc)
3. O app detectará automaticamente qualquer downtime
4. Usuários receberão feedback claro e acionável

## 🐛 Troubleshooting

### "Servidor offline" mas backend está rodando

Verifique:
- ✅ URL do backend está correta em `.env`
- ✅ Backend tem endpoint `/api/health`
- ✅ Firewall não bloqueia requisições
- ✅ CORS está configurado (se cross-origin)

### Pulsação muito rápida/lenta

Ajuste em `src/useHealthCheck.ts`:

```tsx
manager.startMonitoring(30000); // 30 segundos
// Altere para: manager.startMonitoring(60000); // 60 segundos
```

### Muitas requisições de health check

Isso é normal e esperado. O tráfego é mínimo:
- 1 requisição a cada 30 segundos por usuário
- ~2KB por requisição

## 📝 Próximos Passos

1. Confirme que o backend tem o endpoint `/health`
2. Teste offline/online
3. Configure alerta para downtime (opcional)
4. Documente para seus usuários
