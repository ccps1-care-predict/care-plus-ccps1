# Arquitetura Cloud - MVP Local com Docker (CarePredict)

Este documento define uma arquitetura simplificada para o MVP do CarePredict executando 100% localmente com Docker.

Objetivo: validar fluxo funcional de medicina preventiva integrando dados clinicos e dados continuos de dispositivos wearables (ingestao -> processamento -> inferencia -> recomendacao -> agendamento) sem dependencia inicial de cloud publica.

---

## 1. Objetivos do MVP

- Entregar um ambiente reproduzivel em maquina de desenvolvimento.
- Permitir testes ponta a ponta com dados sinteticos e dados simulados de wearables.
- Validar o fluxo de integracao OAuth 2.0 mockado com plataformas wearables (Apple, Google, Fitbit).
- Demonstrar a composicao de lifestyle features com dados de atividade, sono, FC e estresse.
- Reduzir custo de infraestrutura na fase inicial.
- Preparar base para migracao futura para Azure.

---

## 2. Principios de Arquitetura

- Simplicidade primeiro: menos servicos, mais foco em fluxo de negocio.
- Isolamento por containers: cada responsabilidade em um servico.
- Persistencia local: dados mantidos em volumes Docker.
- Observabilidade minima: logs centralizados por servico.
- Seguranca basica desde o inicio: secrets por env vars e segregacao de dados sensiveis.
- Wearables como fonte contínua: dados de estilo de vida coletados via connectors mockados para simular integracoes reais no MVP.
- Consentimento explícito: fluxo LGPD de autorizacao de wearables simulado desde o inicio.

---

## 3. Visao Geral da Arquitetura

```mermaid
flowchart LR

Paciente[Paciente - App Web Angular]
Medico[Medico - Dashboard Angular]
WearableMock[Wearable Mock APIs]

subgraph DockerHost[Docker Local - Docker Compose]
  Frontend[frontend-angular]
  API[backend-api]
  Auth[auth-local]
  Scheduler[scheduling-service]
  RecEngine[recommendation-engine]
  RiskEngine[risk-scoring-engine]
  MLPredict[ml-inference-service]
  Worker[data-worker-etl]
  WearableConn[wearable-connector]
  WearableSync[wearable-sync-worker]
  Postgres[(postgres)]
  MinIO[(minio data lake local)]
  Redis[(redis)]
  PgAdmin[pgadmin opcional]
end

Paciente --> Frontend
Medico --> Frontend
WearableMock --> WearableConn

Frontend --> API
API --> Auth
API --> Scheduler
API --> RecEngine
RecEngine --> RiskEngine
RiskEngine --> MLPredict

API --> WearableConn
WearableConn --> Postgres
WearableConn --> Redis

WearableSync --> WearableConn
WearableSync --> MinIO
WearableSync --> Postgres

API --> Postgres
Worker --> MinIO
Worker --> Postgres
Worker --> MLPredict

Scheduler --> Postgres
RecEngine --> Postgres
MLPredict --> MinIO

API --> Redis
MLPredict --> Redis
```

---

## 4. Componentes do MVP

### 4.1 Frontend Angular

- Portal do paciente e dashboard medico.
- Consome apenas o backend API.
- Build e execucao via container Node/Nginx.

### 4.2 Backend API

- Orquestra casos de uso de paciente, medico e recomendacao.
- Expone endpoints REST para frontend.
- Integracao com banco, motor de recomendacao e agendamento.
- Consulta status e resultado de conclusão; não executa a conclusão do agendamento.

### 4.3 Servico de Inferencia ML

- Recebe features e retorna probabilidades de risco.
- Inicialmente com modelo versionado em arquivo local.
- Interface HTTP simples para integracao rapida.

### 4.4 Risk Scoring Engine

- Traduz probabilidades em score de risco por paciente.
- Consolida sinais clinicos e gera Health Score.

### 4.5 Recommendation Engine

- Aplica regras clinicas sobre score e fatores de risco.
- Retorna recomendacoes de exames e consultas.

### 4.6 Scheduling Service

- Simula integracao com agenda externa.
- Permite criar e consultar horarios para consultas/exames.
- Atualiza conclusão de agendamentos e resultados pós-atendimento.

### 4.7 Wearable Connector

- Gerencia autorizacao OAuth 2.0 simulada com plataformas wearables (Apple, Google Fit, Fitbit).
- Expoe endpoints REST para conectar/desconectar dispositivos e consultar dados de atividade, sono, FC e estresse.
- Persiste tokens OAuth mockados no Postgres (sem chamadas reais a APIs externas no MVP).
- Valida e normaliza dados recebidos do Wearable Mock APIs ou dados sinteticos locais.

### 4.8 Wearable Sync Worker

- Executa sincronizacao periodica (batch diario simulado por cron local).
- Busca dados dos conectores, realiza feature engineering e grava lifecycle features no MinIO.
- Calcula 13+ lifestyle features: avg_weekly_steps, sleep_quality_score, burnout_risk, lifestyle_compliance_score, entre outros.
- Disponibiliza features consolidadas para o ML Inference Service.

### 4.9 Data Worker (ETL)

- Ingestao batch de dados clinicos e dados publicos.
- Normalizacao e escrita em camadas locais (raw/processed/curated).
- Atualiza features clinicas para inferencia.

### 4.10 Persistencia

- Postgres: dados transacionais (pacientes, consultas, recomendacoes, dispositivos wearables, tokens OAuth).
- MinIO: data lake local (raw, processed, curated — incluindo dados brutos de wearables e lifestyle features).
- Redis: cache de tokens OAuth, filas leves de sync e cache de features recentes.

---

## 5. Fluxos Principais

### 5.1 Fluxo preventivo (com wearables)

1. Frontend solicita analise preventiva para paciente.
2. API consulta historico clinico no Postgres.
3. API busca lifestyle features do paciente (geradas pelo Wearable Sync Worker).
4. API combina features clinicas + lifestyle features e envia para ML Inference Service.
5. Risk Scoring Engine calcula score consolidado (clinico + comportamental).
6. Recommendation Engine gera recomendacoes contextualizadas com padrao de estilo de vida.
7. API persiste resultado e responde ao frontend (incluindo graficos de atividade, sono, FC, estresse).

### 5.2 Fluxo OAuth / Conexao de Wearable (simulado)

1. Paciente solicita conexao de dispositivo no frontend.
2. API repassa solicitacao ao Wearable Connector.
3. Wearable Connector gera URL de autorizacao mockada.
4. Frontend exibe tela de consentimento simulada.
5. Apos consentimento, token OAuth mockado e salvo no Postgres.
6. Dispositivo aparece como conectado no perfil do paciente.

### 5.3 Fluxo de sincronizacao de wearables

1. Wearable Sync Worker executa periodicamente (ex: a cada hora em dev).
2. Busca tokens validos no Postgres para cada paciente com wearable conectado.
3. Chama Wearable Connector para obter dados sinteticos de atividade, sono, FC e estresse.
4. Valida e normaliza os dados recebidos.
5. Grava dados brutos no MinIO (camada raw).
6. Calcula lifestyle features e grava em curated.
7. Atualiza feature store local para uso pelo ML Inference Service.

### 5.4 Fluxo de agendamento

1. Paciente seleciona recomendacao.
2. API consulta Scheduling Service.
3. Horarios disponiveis sao retornados.
4. Agendamento e confirmado e salvo no Postgres.
5. Após atendimento, a conclusão e o resultado são atualizados no serviço de agenda externo.
6. A API principal apenas consulta e exibe esse status atualizado.

### 5.5 Fluxo de atualizacao de dados clinicos

1. Data Worker processa lotes de entrada clinica.
2. Dados sao gravados no MinIO por camada.
3. Features clinicas derivadas sao atualizadas.
4. Novo artefato de modelo pode ser publicado localmente.

---

## 6. Topologia de Rede e Dados

- Rede unica Docker Compose para comunicacao interna.
- Apenas frontend e API expostos ao host.
- Banco e servicos internos acessiveis apenas por rede interna.
- Volumes persistentes para Postgres e MinIO.

Exemplo de portas locais:

- Frontend Angular: 4200
- Backend API: 8080
- ML Inference: 8001
- Wearable Connector: 8002
- Wearable Mock APIs: 8003
- Postgres: 5432
- MinIO API: 9000
- MinIO Console: 9001
- PgAdmin (opcional): 5050
- Redis: 6379

---

## 7. Estrutura Sugerida de Servicos no Docker Compose

```yaml
services:
  frontend-angular:
    build: ./modules/spa
    ports: ["4200:4200"]
    depends_on: [backend-api]

  backend-api:
    build: ./modules/api
    ports: ["8080:8080"]
    depends_on: [postgres, redis, ml-inference-service, wearable-connector]
    environment:
      - DATABASE_URL=postgresql://carepredict:carepredict@postgres:5432/carepredict
      - REDIS_URL=redis://redis:6379
      - ML_SERVICE_URL=http://ml-inference-service:8001
      - WEARABLE_CONNECTOR_URL=http://wearable-connector:8002

  ml-inference-service:
    build: ./modules/ml
    ports: ["8001:8001"]
    depends_on: [minio, redis]
    environment:
      - MINIO_URL=http://minio:9000
      - REDIS_URL=redis://redis:6379

  wearable-connector:
    build: ./modules/services/wearable
    ports: ["8002:8002"]
    depends_on: [postgres, redis]
    environment:
      - DATABASE_URL=postgresql://carepredict:carepredict@postgres:5432/carepredict
      - REDIS_URL=redis://redis:6379
      - WEARABLE_MOCK_URL=http://wearable-mock-apis:8003
      - OAUTH_MOCK_MODE=true

  wearable-mock-apis:
    build: ./modules/services/wearable/mock
    ports: ["8003:8003"]
    # Simula respostas das APIs Apple HealthKit, Google Fit e Fitbit
    # com dados sinteticos de atividade, sono, FC e estresse

  wearable-sync-worker:
    build: ./modules/services/wearable/sync
    depends_on: [wearable-connector, minio, postgres]
    environment:
      - DATABASE_URL=postgresql://carepredict:carepredict@postgres:5432/carepredict
      - WEARABLE_CONNECTOR_URL=http://wearable-connector:8002
      - MINIO_URL=http://minio:9000
      - SYNC_INTERVAL_SECONDS=3600

  recommendation-engine:
    build: ./modules/services/recommendation
    depends_on: [ml-inference-service, postgres]

  risk-scoring-engine:
    build: ./modules/services/risk
    depends_on: [ml-inference-service]

  scheduling-service:
    build: ./modules/services/scheduling
    depends_on: [postgres]

  data-worker-etl:
    build: ./modules/data/worker
    depends_on: [minio, postgres]

  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: carepredict
      POSTGRES_USER: carepredict
      POSTGRES_PASSWORD: carepredict
    volumes:
      - pg_data:/var/lib/postgresql/data
    ports: ["5432:5432"]

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minio
      MINIO_ROOT_PASSWORD: minio123
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

volumes:
  pg_data:
  minio_data:
```

---

## 8. Seguranca e LGPD no Ambiente Local

### Anonimização no MVP: Intencionalmente Ausente ⚠️

O MVP **NÃO inclui Data Anonymization Service** por deliberação:

**Razões:**

1. **Dados Sintéticos**: Todos os dados do MVP são sintéticos/fake
   - Nomes são `Paciente Test 001`, `Paciente Test 002`
   - CPFs são `000.000.000-00`, `111.111.111-11`
   - Emails são `patient001@test.local`
   - Wearables dados aleatoriamente gerados

2. **Escopo de Desenvolvimento**: MVP é ambiente dev/test
   - Sem dados de pacientes reais
   - Sem violação de privacidade possível
   - Objetivo é validar fluxo, não segurança

3. **Simplificação Arquitetural**: Menos componentes = prototipagem mais rápida
   - MVP em 1 máquina (Docker Compose)
   - Cloud tem 5-10 serviços; MVP tem 8-10

4. **Não há benefício Funcional**: Anônimização não afeta lógica de negócio
   - Feature engineering não muda
   - Modelos não mudam
   - Apenas a "embalagem" dos dados

**O que fazer para testar LGPD no MVP:**

Se quiser adicionar anonimização como teste:

```yaml
# Adicionar ao docker-compose.yml:
anonymization-service:
  build: ./modules/services/anonymization
  ports: ["8010:8010"]
  depends_on: [redis]
  environment:
    - REDIS_URL=redis://redis:6379
    - ENABLE_MASKING=true
    - CIPHER_KEY=${CIPHER_KEY}
```

Mas isso é **opcional** e **não obrigatório** para o MVP funcionar.

**Foco absoluto:** Validar fluxo preventivo (paciente → wearable → sync → análise → recomendação).

---

## 8A. Seguranca Basica (que está presente)

- Dados sensiveis apenas para desenvolvimento e testes.
- Preferir dados sinteticos ou anonimizados (especialmente dados de wearables).
- Segredos via arquivo .env (nao versionar — incluindo tokens OAuth e chaves de API mockadas).
- Controle de acesso por perfil na aplicacao (paciente, medico, admin).
- Logs sem dados pessoais identificaveis.
- Fluxo de consentimento LGPD simulado: paciente deve autorizar explicitamente conexao de cada dispositivo wearable.
- Tokens OAuth armazenados com TTL no Redis (simulando rotacao automatica).
- Dados de wearables em bucket separado no MinIO (isolamento logico equivalente ao PHI Zone).

---

## 9. Observabilidade Minima do MVP

- Logs estruturados por servico (JSON quando possivel).
- Correlacao por request-id entre frontend, API e servicos internos.
- Healthcheck por endpoint /health em cada servico.
- Monitoramento inicial por docker compose logs e dashboards simples.
- Metricas de wearable sync: total de sincronizacoes, erros, latencia, features geradas por paciente.
- Rastreamento de consentimento: log de todas as autorizacoes e revogacoes de acesso a wearables.

---

## 10. Limites do MVP Local

- Sem alta disponibilidade real.
- Escalabilidade limitada ao host local.
- Sem IAM corporativo completo.
- Sem governanca de dados de nivel produtivo.
- Wearable Connector usa modo mock (OAUTH_MOCK_MODE=true): sem chamadas reais a Apple, Google ou Fitbit.
- Dados de wearables sao sinteticos (gerados via Wearable Mock APIs) — nao representam dados reais de pacientes.
- Wearable Sync Worker opera com intervalo configuravel (padrao: 1 hora em dev, equivale ao batch diario de producao).

Este desenho e proposital para acelerar validacao funcional e tecnica.

---

## 11. Caminho de Evolucao para Cloud

Quando o MVP estiver validado, migrar gradualmente:

- Docker local -> Kubernetes/Container Apps.
- MinIO local -> Data Lake em Azure (ADLS Gen2).
- Postgres local -> Azure SQL/PostgreSQL gerenciado.
- Logs locais -> Azure Monitor/Application Insights.
- Segredos em .env -> Azure Key Vault (incluindo tokens OAuth de wearables).
- Wearable Mock APIs -> Integracao real com Apple HealthKit, Google Fit e Fitbit via OAuth 2.0 producao.
- OAUTH_MOCK_MODE=false -> clientes OAuth registrados com ID de aplicacao real em cada plataforma.
- Wearable Sync Worker local -> Azure Functions ou Azure Databricks para processamento distribuido.

Assim, o time preserva a arquitetura logica e troca apenas a camada de infraestrutura. O modulo de wearables foi projetado com factory pattern para suportar essa transicao sem reescrita de logica de negocio.

---

## 12. 🎯 Notas sobre Alinhamento Cloud

Este MVP **segue intencionalmente uma arquitetura simplificada** da Cloud, com as seguintes simplificações:

### Armazenamento de Dados

| Aspecto | Cloud | MVP |
|--------|-------|-----|
| Banco Transacional | Azure SQL Database | PostgreSQL (container) |
| Data Lake | Azure Data Lake Storage Gen2 | MinIO (bucket local) |
| Cache | Azure Cache for Redis | Redis (container) |
| Schema | Idêntico | Idêntico (facilita migração) |

✅ **Decisão**: PostgreSQL no MVP permite prototipagem rápida. Schema é idêntico ao Azure SQL, facilitando transição.

### Processamento de Dados

| Aspecto | Cloud | MVP |
|--------|-------|-----|
| Feature Engineering | Azure Databricks | Wearable Sync Worker (Python) |
| Anonimização | Data Anonymization Service | Ausente (dados não sensíveis) |
| Dados Públicos | PopulationDataService (On-Demand + cache 24h) | Ausente (não no escopo MVP) |
| Modo de Sync | Batch Only (cron diário) | Batch apenas (cron diário) |

✅ **Decisão**: MVP simplificado, Cloud robusto. Lógica de features é identica.

### Modelos de ML

| Aspecto | Cloud | MVP |
|--------|-------|-----|
| Feature Store | Databricks Feature Store | MinIO/curated (Parquet) |
| Registry | Azure ML Model Registry | Arquivo local versionado |
| Inference | Azure ML Inference Endpoint | Serviço HTTP simples |

✅ **Decisão**: MVP usa modelos locais (sem retrainamento), Cloud gerencia ciclo de vida completo.

### Mapeamento de Componentes

```
Cloud                              MVP (Simplificado)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Azure App Service       →         frontend-angular
Azure API Management    →         (integrado na API)
Backend API             →         backend-api
Azure SQL Database      →         postgres (container)
Azure Data Lake         →         minio (container)
Wearable Connector      →         wearable-connector
Wearable Sync Worker    →         wearable-sync-worker
Databricks/Synapse      →         data-worker-etl
Lifestyle Features      →         Cálculo no sync-worker
Feature Store           →         MinIO curated layer
Azure ML Training       →         Offline (script Python)
Azure ML Inference      →         ml-inference-service
Risk Engine             →         risk-scoring-engine
Recommendation Engine   →         recommendation-engine
Scheduler               →         scheduling-service
Azure Monitor           →         Docker logs + healthcheck
```

### Decisão Crítica: PostgreSQL vs Azure SQL

✅ **Por que PostgreSQL no MVP?**
1. **Zero custo**: Pode rodar localmente sem infraestrutura
2. **Open-source**: Sem dependência de licenças
3. **Mesma lógica SQL**: Schema é portable para Azure SQL
4. **Facilita testes**: Ambiente reproduzível em qualquer máquina
5. **Preparação para migração**: Dados migram facilmente via dump/restore

⚠️ **Mudanças necessárias ao migrar para Azure SQL:**
- T-SQL vs PL/pgSQL: Funções e triggers requerem ajuste (esperado)
- Tipos de dados: Geralmente 1:1 compatíveis
- Índices: Mesmo padrão, alguns hints específicos de plataforma

✅ **Schema permanece idêntico em ambos**, apenas o motor muda.

### Feature Store MVP vs Cloud

| Aspecto | Cloud | MVP |
|--------|-------|-----|
| **Implementação** | Databricks Feature Store | MinIO curated layer |
| **Versionamento** | Automático | Manual (v1/, v2/folders) |
| **Lineage** | Interface web integrada | Documentado em código |
| **Quality Checks** | Integrados | Script Python |
| **Access Control** | RBAC + Auditoria | Arquivo .env |
| **Reutilização** | SDK nativo | Leitura Parquet manual |

✅ **15 lifestyle features são idênticas em ambos** — lógica, não implementação.

**Como lidar com Feature Store no MVP:**

Wearable Sync Worker escreve features no MinIO:

```
MinIO bucket: analytics-features
├─ lifestyle_features/
│  ├─ v1/
│  │  └─ 2026-03-25.parquet
│  │     (schema: avg_weekly_steps, sleep_quality_score, [...])
│  └─ current → v1/  # Symlink para versão ativa
├─ clinical_features/
│  └─ current
└─ [...]
```

API lê features assim:

```python
# em Python

import pandas as pd
from minio import Minio

client = Minio("minio:9000")
response = client.get_object("analytics-features", "lifestyle_features/current/2026-03-25.parquet")

features_df = pd.read_parquet(response)
# DataFrame com colunas: patient_id, avg_weekly_steps, sleep_quality_score, ...
```

ML Inference Service usa como entrada:

```python
# Fetch features para um paciente
features = features_df[features_df["patient_id"] == patient_id].iloc[0]

# Forward ao modelo
prediction = model.predict([
    features["avg_weekly_steps"],
    features["sleep_quality_score"],
    features["stress_level_avg"],
    # [...] + features clínicas
])
```

---
