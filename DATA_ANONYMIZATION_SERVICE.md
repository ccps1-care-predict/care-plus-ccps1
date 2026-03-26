# 🔐 Data Anonymization Service — Design & Implementação

## 📋 Visão Geral

O **Data Anonymization Service** é um microserviço crítico para LGPD que processa e anonimiza dados ensíveis antes de persistência no Data Lake ou banco transacional.

**Status**: Cloud Production ✅ | MVP Local ❌ (intencionalmente ausente)

---

## 🎯 Objetivos

1. ✅ Garantir conformidade LGPD ("anonimização de facto")
2. ✅ Pseudonimizar dados pessoais (patient_id → token)
3. ✅ Mascarar informações sensíveis
4. ✅ Manter auditoria completa
5. ✅ Processar com latência <100ms
6. ✅ Ser reversível internamente (auditoria)
7. ✅ Falhar seguro (Dead Letter Queue se houver erro)

---

## 🏗️ Arquitetura

```
┌──────────────────────────────┐
│   Event Sources              │
│ (EventHub, APIs, Batch ETL)  │
└────────────┬─────────────────┘
             │
             ↓
    ┌────────────────────────┐
    │ Azure Event Hub        │
    │ (Buffering/Queue)      │
    └────────┬───────────────┘
             │
      ┌──────┴──────────────┐
      │                     │
      ↓                     ↓
┌─────────────────┐  ┌──────────────────┐
│   Anonymizer    │  │   Anonymizer     │
│   Instance 1    │  │   Instance N     │
└────────┬────────┘  └────────┬─────────┘
         │                    │
         └────────┬───────────┘
                  ↓
        ┌─────────────────────┐
        │ Azure Key Vault     │
        │ (Cipher Keys)       │
        └─────────────────────┘
                  
         ┌────────┴────────┐
         │                 │
         ↓                 ↓
    ┌──────────┐    ┌─────────────┐
    │ Output:  │    │ Audit Log:  │
    │ Azure DB │    │ Application │
    │ or       │    │ Insights    │
    │ DataLake │    └─────────────┘
    └──────────┘
```

---

## 📊 Tipos de Dados e Regras de Anonimização

### 1. Identificadores Diretos

| Campo | Tipo | Regra | Exemplo |
|-------|------|-------|---------|
| **patient_id** | UUID | Pseudonimização + Hash | `12345` → `anon_a7f3` |
| **name** | String | Remoção | `João Silva` → `[REMOVED]` |
| **cpf** | String | Mascaramento parcial | `123.456.789-00` → `***-***-789-00` |
| **email** | String | Hash | `john@example.com` → `f7d3e1a9...` |
| **phone** | String | Mascaramento parcial | `(11) 98765-4321` → `(11) ****-4321` |
| **birthdate** | Date | Conversão para idade faixa | `1970-03-15` → `age_50_60` |
| **address** | String | Remoção de rua/número | `Rua X, 123` → `[UF: SP, Zona: Centro]` |
| **ip_address** | String | Remoção | `192.168.1.1` → `[REMOVED]` |

### 2. Identificadores Quasi-Diretos

| Campo | Tipo | Regra | Detalhes |
|-------|------|-------|----------|
| **age** | Int | Binning | Converter em faixa (40-49, 50-59, etc) |
| **gender** | String | Mantém | Necessário para análise. Risco baixo. |
| **zip_code** | String | Truncação | Manter apenas 2 primeiros dígitos |
| **timestamp** | DateTime | Data apenas | Remover hora (privacidade temporal) |

### 3. Dados de Wearables

| Campo | Tipo | Regra | Razão |
|-------|------|-------|-------|
| **patient_id** | UUID | Pseudonimizar | Vinculação ao indivíduo |
| **device_id** | UUID | Pseudonimizar | Identifica usuário |
| **heart_rate** | Int | Manter | Dado clínico anônimo |
| **steps** | Int | Manter | Dado comportamental anônimo |
| **sleep_duration** | Float | Manter | Dado clínico anônimo |
| **timestamp** | DateTime | Data apenas | Privacidade temporal |

### 4. Dados Clínicos

| Campo | Tipo | Regra | Razão |
|-------|------|-------|-------|
| **diagnosis** | String | Manter | Necessário para análise. HIPAA protege contexto. |
| **medication** | String | Manter | Necessário para análise. |
| **exam_result** | Float | Manter | Dado clínico anônimo. |
| **clinic_id** | UUID | Manter | Não identifica paciente |

---

## 🔄 Fluxos de Dados

### Fluxo 1: Sincronização de Wearables

```
Wearable Connector outputs evento:
{
  "patient_id": "12345",
  "device_id": "fitbit_abc123",
  "steps": 8920,
  "heart_rate": 62,
  "sleep_hours": 7.2,
  "timestamp": "2026-03-25T14:32:15Z"
}
         ↓
   AnonymizationService
         ↓
Outputs:
{
  "pseudonym": "anon_a7f3",
  "device_pseudonym": "dev_b2e2",
  "steps": 8920,
  "heart_rate": 62,
  "sleep_hours": 7.2,
  "date": "2026-03-25",
  "audit_id": "audit_20260325143215_xx"
}
         ↓
[Persiste em Azure SQL + DataLake]
[Registro de auditoria em Application Insights]
```

### Fluxo 2: Dados Clínicos via API

```
API submits:
{
  "patient_id": "12345",
  "name": "João Silva",
  "cpf": "123.456.789-00",
  "email": "john@hospital.com",
  "age": 47,
  "diagnosis": "Diabetes Type 2",
  "timestamp": "2026-03-25T10:15:00Z"
}
         ↓
   AnonymizationService
         ↓
Outputs:
{
  "pseudonym": "anon_a7f3",
  "name": "[REMOVED]",
  "cpf": "***-***-789-00",
  "email": "f7d3e1a9c4d6...",
  "age_group": "40_50",
  "diagnosis": "Diabetes Type 2",
  "date": "2026-03-25",
  "audit_id": "audit_20260325101500_yy"
}
         ↓
[Persiste em Azure SQL + DataLake]
```

### Fluxo 3: Fallback (Falha Segura)

```
Se AnonymizationService não responder em 5s:
         ↓
Evento é enviado para Dead Letter Queue
         ↓
Alerta é disparado (Azure Monitor)
         ↓
Operador revisa manualmente após escalação
         ↓
NUNCA persiste dados sensíveis não-anonimizados
```

---

## 🔑 Gerenciamento de Chaves

### Armazenamento

Todas as chaves de pseudônimo são armazenadas em **Tabela de Mapeamento Protegida** (segmentada por tenant):

```
┌─────────────────────────────────────┐
│   Mapping Table (Azure SQL)          │
├─────────────────────────────────────┤
│ real_id | pseudonym | date_created  │
├─────────────────────────────────────┤
│ 12345   | anon_a7f3 | 2026-03-01    │
│ 12346   | anon_b4g2 | 2026-03-01    │
│ ...     | ...       | ...           │
└─────────────────────────────────────┘

Access Control:
- ✅ Equipe de auditoria interna
- ✅ Compliance officer
- ❌ Analistas de dados (não veem real_id)
- ❌ Científicos de dados (não veem real_id)
- ❌ Qualquer acesso externo
```

### Criptografia das Chaves

Utilizando **Azure Key Vault**:
- Chaves de cipher são geradas via HSM (Hardware Security Module)
- Rotação automática a cada 90 dias
- Auditoria completa de acesso a chaves

---

## 📈 Performance & Escalabilidade

### Targets

| Métrica | Target |
|---------|--------|
| Latência (P95) | <100ms por evento |
| Taxa máxima | 10,000 eventos/seg por instância |
| Throughput desejado | 50,000 eventos/seg (5 instâncias em produção) |
| Disponibilidade | 99.9% |
| RTO (Recovery Time Objective) | <5 minutos |
| RPO (Recovery Point Objective) | <1 minuto |

### Autoscaling

```yaml
# Exemplo Kubernetes HPA
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: anonymization-service-hpa
spec:
  scaleTargetRef:
    apiVersion: v1
    kind: Deployment
    name: anonymization-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

## 🛡️ Segurança

### Autenticação

- Service-to-service: Azure Managed Identity
- Nenhuma credencial em código
- Token refresh automático

### Criptografia

- **Em trânsito**: TLS 1.3 obrigatório
- **Em repouso**: AES-256 (chaves em Key Vault)
- **Logs**: Sem dados sensíveis, apenas audit_id

### Auditoria

```
Log Entry:
{
  "timestamp": "2026-03-25T14:35:22.123Z",
  "event": "anonymization_applied",
  "real_id": "<masked, internamente trackable>",
  "pseudonym": "anon_a7f3",
  "fields_masked": ["name", "email", "cpf"],
  "source": "wearable_connector",
  "operator": null,
  "status": "success",
  "processing_time_ms": 47
}
```

---

## 🚀 Implementação

### Tech Stack Recomendado

- **Linguagem**: Python 3.11+ ou Go 1.20+
- **Framework**: FastAPI (Python) ou Gin (Go)
- **Database**: Azure SQL Database
- **Storage**: Azure Data Lake (ADLS Gen2)
- **Key Management**: Azure Key Vault
- **Orchestration**: Azure Service Bus ou Event Hub Consumer Group

### Pseudocódigo Principal

```python
class AnonymizationService:
    
    def __init__(self, keyvault_client, sql_client):
        self.kv = keyvault_client
        self.db = sql_client
    
    async def anonymize(self, event: Dict) -> Dict:
        """
        Processa um evento e retorna versão anonimizada
        """
        try:
            # 1. Extrair patient_id
            real_id = event.get('patient_id')
            
            # 2. Consultar ou gerar pseudônimo
            pseudonym = await self._get_or_create_pseudonym(real_id)
            
            # 3. Aplicar regras de masking
            masked_event = self._apply_masking_rules(event)
            
            # 4. Substituir IDs
            masked_event['pseudonym'] = pseudonym
            masked_event.pop('patient_id', None)
            masked_event.pop('name', None)
            
            # 5. Registrar auditoria
            await self._audit_log(real_id, pseudonym, event.keys())
            
            # 6. Retornar
            return masked_event
            
        except Exception as e:
            await self._send_to_dlq(event, str(e))
            raise
    
    async def _get_or_create_pseudonym(self, real_id: str) -> str:
        """Consulta mapeamento ou cria novo pseudônimo"""
        existing = await self.db.query(
            "SELECT pseudonym FROM patient_mapping WHERE real_id = ?", 
            real_id
        )
        if existing:
            return existing['pseudonym']
        
        # Gerar novo
        pseudonym = f"anon_{self._generate_token()}"
        await self.db.insert("patient_mapping", {
            "real_id": real_id,
            "pseudonym": pseudonym,
            "date_created": datetime.now()
        })
        return pseudonym
    
    def _apply_masking_rules(self, event: Dict) -> Dict:
        """Aplica regras de masking conforme schema"""
        masked = event.copy()
        
        # Remove diretos
        for field in ['name', 'cpf', 'email', 'phone', 'address', 'ip']:
            if field in masked:
                masked[field] = '[REMOVED]'
        
        # Mascaramento parcial
        if 'cpf' in event:
            cpf = event['cpf']
            masked['cpf'] = f"***-***-{cpf[-5:]}"
        
        # Timestamp → Data apenas
        if 'timestamp' in masked:
            ts = datetime.fromisoformat(masked['timestamp'])
            masked['date'] = ts.date().isoformat()
            masked.pop('timestamp')
        
        return masked
```

---

## 📋 Checklist de Deployment

- [ ] Chaves em Azure Key Vault
- [ ] Database migrações aplicadas
- [ ] Dead Letter Queue configurada
- [ ] Alertas do Azure Monitor ativados
- [ ] Testes de carga (50k msg/sec)
- [ ] Teste de falha (simular KeyVault down)
- [ ] Auditoria log integrado com SIEM
- [ ] Documentação de runbook atualizada
- [ ] Treinamento de SRE/Ops concluído

---

## 🔗 Referências

- [LGPD Lei 13.709](http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm) — Artigo 5° (definições de anonimização)
- [HIPAA Omnibus Rule](https://www.hhs.gov/hipaa/) — Safe Harbor Anonymization
- [Azure Data Protection Best Practices](https://learn.microsoft.com/en-us/azure/security/)

---

## ❓ FAQ

**P: E se o AnonymizationService falhar?**
R: Evento vai para Dead Letter Queue, nenhum dado sensível é persistido sem anonimização.

**P: Posso reverter a anonimização?**
R: Internamente sim (tabela de mapeamento), mas nunca exponha essa capacidade ao usuário final.

**P: Dados públicos também são anonimizados?**
R: Não, já vêm anonimizados na origem. Anonimização valida apenas.

**P: MVP local precisa?**
R: Não. Dados no MVP são sintéticos. Ausência é intencional.

---
