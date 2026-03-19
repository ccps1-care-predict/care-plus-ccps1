# ☁️ Arquitetura Cloud — CarePredict (Versão Revisada)

Este documento descreve a arquitetura cloud do **CarePredict**, sistema de medicina preventiva baseado em Machine Learning desenvolvido para a CarePlus.

O sistema integra dados clínicos com dados contínuos de **dispositivos wearables** (Apple HealthKit, Google Fit, Fitbit, Garmin, Oura Ring) para compor uma visão 360° do paciente e elevar a precisão dos modelos preditivos em **15–25%**.

A arquitetura foi projetada utilizando **Microsoft Azure** e segue princípios de:

- escalabilidade
- segurança de dados de saúde
- governança de dados
- MLOps
- integração contínua com dispositivos wearables
- conformidade LGPD com consentimento explícito

---

# 📊 Diagrama da Arquitetura Cloud

```mermaid
flowchart TB

%% USERS

Paciente[Paciente - Portal/App]
Medico[Médico - Dashboard]
Admin[Administrador]

%% FRONTEND

subgraph Frontend

WebApp[Azure App Service - Web Application]

end

%% API LAYER

subgraph API

APIM[Azure API Management]
Backend[Backend CarePredict API]
Auth[Azure Entra ID]

end

%% SECURITY

subgraph Security

KeyVault[Azure Key Vault]

end

%% DATA INGESTION

subgraph Ingestion

EventHub[Azure Event Hub]
DataFactory[Azure Data Factory]
PublicData[Ingestão de Dados Públicos]
WearableConn[Wearable Data Connector]
WearableOAuth[OAuth 2.0 Manager]

end

%% PRIVACY

subgraph Privacy

Anonymization[Data Anonymization Service]

end

%% DATA STORAGE

subgraph Storage

DataLake[Azure Data Lake Storage Gen2]
SQLDB[Azure SQL Database]
WearableDB[Wearable Tables - PostgreSQL]

end

%% DATA PROCESSING

subgraph Processing

Databricks[Azure Databricks]
Synapse[Azure Synapse Analytics]

end

%% FEATURE STORE

subgraph FeatureLayer

FeatureStore[Feature Store]
LifestyleFeatures[Lifestyle Features Engine]

end

%% MACHINE LEARNING

subgraph MachineLearning

MLWorkspace[Azure Machine Learning]
Training[Model Training]
Registry[Model Registry]
Inference[ML Inference Endpoint]

end

%% APPLICATION SERVICES

subgraph Services

RiskEngine[Risk Scoring Engine]
Recommendation[Recommendation Engine]
Scheduling[Scheduling Service]

end

%% MONITORING

subgraph Observability

Monitor[Azure Monitor]
AppInsights[Application Insights]

end

%% USERS

Paciente --> WebApp
Medico --> WebApp
Admin --> WebApp

%% FRONTEND → API

WebApp --> APIM
APIM --> Backend
Backend --> Auth

%% SECURITY

Backend --> KeyVault
Databricks --> KeyVault
MLWorkspace --> KeyVault
WearableOAuth --> KeyVault

%% DATA FLOW

Backend --> SQLDB
Backend --> WearableDB

%% EVENT STREAM

Backend --> EventHub

%% WEARABLE INGESTION

Backend --> WearableConn
WearableConn --> WearableOAuth
WearableOAuth --> WearableDB
WearableConn --> EventHub

%% DATA INGESTION

EventHub --> Anonymization
PublicData --> DataFactory
DataFactory --> Anonymization

Anonymization --> DataLake

%% DATA PROCESSING

DataLake --> Databricks
Databricks --> Synapse

%% FEATURE ENGINEERING

Synapse --> LifestyleFeatures
LifestyleFeatures --> FeatureStore

%% MACHINE LEARNING

FeatureStore --> Training
Training --> Registry
Registry --> Inference

%% APPLICATION LOGIC

Backend --> Inference
Inference --> RiskEngine
RiskEngine --> Recommendation

Recommendation --> Scheduling

Scheduling --> Backend

%% MONITORING

Backend --> AppInsights
Inference --> Monitor
Databricks --> Monitor
WearableConn --> Monitor
````

---

# 🧩 Explicação das Camadas

# 1️⃣ Camada de Aplicação

Usuários acessam o sistema através de:

* portal do paciente
* dashboard médico
* painel administrativo

Hospedagem:

**Azure App Service**

---

# 2️⃣ API Layer

Gerencia comunicação entre frontend e backend.

Componentes:

**Azure API Management**

* gateway de APIs
* controle de acesso
* rate limiting

**Backend CarePredict API**

* lógica de negócio
* integração com serviços de ML
* integração com sistemas externos

**Azure Entra ID**

* autenticação segura
* controle de identidade

---

# 3️⃣ Segurança

Dados de saúde exigem alto nível de segurança.

O sistema utiliza:

**Azure Key Vault**

para armazenar:

* segredos
* credenciais
* tokens de API
* chaves de criptografia

---

# 4️⃣ Ingestão de Dados

Dados entram no sistema por diferentes canais.

**Event Hub**

* ingestão de eventos em tempo real
* streaming de dados clínicos e wearables
* fan-out para múltiplos consumidores

**Azure Data Factory**

* pipelines ETL batch
* ingestão de dados externos e populacionais

**Dados Públicos**

integração com:

* DATASUS
* IBGE
* ANS

**Wearable Data Connector** *(novo)*

Responsável pela ingestão contínua de dados de dispositivos wearables:

* Gerencia fluxo OAuth 2.0 com cada plataforma (Apple HealthKit, Google Fit, Fitbit, Garmin, Oura Ring)
* Coleta dados de atividade, frequência cardíaca, sono e estresse
* Suporta sincronização batch diária e streaming em tempo real
* Tokens de acesso armazenados com segurança no **Azure Key Vault**

**OAuth 2.0 Manager** *(novo)*

* Autorização por plataforma com factory pattern
* Refresh automático de tokens expirados
* Revogação de acesso via painel do paciente (LGPD)
* Auditoria de todas as operações de autorizacão

---

# 5️⃣ Privacidade e LGPD

Antes de armazenar dados no Data Lake, o sistema aplica:

* anonimização
* pseudonimização
* mascaramento de dados sensíveis

Isso garante conformidade com **LGPD**.

**Requisitos adicionais para wearables:**

* Consentimento explícito e granular por plataforma wearable (opt-in)
* Direito ao esquecimento: revogação de acesso remove tokens e agendamento de purge dos dados
* Dados brutos de wearables isolados em zona PHI do Data Lake (criptografia AES-256)
* Pseudonimização antes de qualquer pipeline analítico (patient_id → token_anonimo)
* Logs de acesso a dados wearables auditáveis via Azure Monitor

---

# 6️⃣ Armazenamento

Dois tipos de armazenamento são utilizados.

### Azure SQL Database

dados transacionais:

* pacientes
* consultas
* exames
* recomendações

### Tabelas Wearables (PostgreSQL gerenciado) *(novo)*

dados de dispositivos:

* `wearable_devices` — dispositivos conectados e tokens OAuth
* `wearable_heartrate` — séries de FC, HRV, FC em repouso
* `wearable_activity` — passos, distância, exercícios, calorias
* `wearable_sleep` — duração, sono profundo/REM, qualidade
* `wearable_stress` — nível de estresse, recuperação, burnout

---

### Azure Data Lake Storage

dados analíticos organizados em zonas:

| Zona | Conteúdo |
|---|---|
| PHI Zone | Dados brutos sensíveis — acesso restrito |
| Raw | Dados normalizados (clínicos + wearables) |
| Processed | Dados limpos e enriched |
| Curated | Features de ML e lifestyle features prontas |

---

# 7️⃣ Processamento de Dados

**Azure Databricks**

responsável por:

* processamento de dados clínicos e wearables
* limpeza e validação (detecção de outliers em séries wearable)
* normalização (conversão de unidades, alinhamento de fuso horário)
* enriquecimento (médias móveis, detecção de padrões)
* feature engineering de lifestyle features

**Processamento específico de wearables:**

1. Validação — outliers, dados ausentes, consistência entre fontes
2. Normalização — unidades padronizadas, UTC, formato canônico
3. Enriquecimento — médias de 7/30 dias, scores compostos
4. Feature engineering — 13+ lifestyle features para o Feature Store

**Azure Synapse**

utilizado para:

* analytics sobre dados clínicos + comportamentais
* consultas analíticas para BI e relatórios
* alimentação do Lifestyle Features Engine

---

# 8️⃣ Feature Store

Armazena features utilizadas pelos modelos de Machine Learning.

Benefícios:

* consistência entre treino e produção
* reutilização de features
* melhor governança de ML

**Lifestyle Features Engine** *(novo)*

Calcula 13+ features comportamentais a partir de dados brutos de wearables:

| Feature | Descrição |
|---|---|
| `avg_weekly_steps` | Média de passos nos últimos 7 dias |
| `sleep_quality_score` | Score 0-100 baseado em duração e composição |
| `sleep_consistency` | Regularidade de horários de sono |
| `insomnia_flag` | Média < 6h nos últimos 7 dias |
| `stress_level_avg` | Média de estresse semanal |
| `burnout_risk` | Estresse > 70 E sono < 6h |
| `recovery_days_ratio` | % de dias com boa recuperação |
| `avg_resting_hr` | FC em repouso média |
| `hrv_avg` | Variabilidade da FC média |
| `active_days_ratio` | % de dias com atividade registrada |
| `exercise_consistency` | Regularidade de sessões de exercício |
| `activity_trend` | Tendência de atividade (crescente/decrescente) |
| `lifestyle_compliance_score` | Score composto 0-100 de aderência saudável |

Essas features são combinadas com features clínicas e populacionais para alimentar os modelos de ML, gerando **15–25% de melhoria na precisão preditiva**.

---

# 9️⃣ Plataforma de Machine Learning

Implementada com **Azure Machine Learning**.

Componentes:

### Model Training

Treinamento dos modelos com três categorias de features:

* **Features clínicas** — histórico de exames, diagnósticos, medicamentos
* **Lifestyle features** — 13+ features comportamentais de wearables
* **Features populacionais** — benchmarks DATASUS/IBGE por perfil demográfico

### Model Registry

Controle de versões com rastreamento de:

* versão do modelo
* conjunto de features utilizadas
* métricas de avaliação (com e sem wearables)
* data de corte do dataset de treinamento

### Inference Endpoint

API de predição em produção com suporte a:

* inferência em tempo real (paciente individual)
* inferência batch (cohortes para campanhas preventivas)
* fallback gracioso quando dados wearables estão ausentes (modelo clinico-only)

---

# 🔟 Motor de Recomendação

Transforma previsões de risco em ações preventivas.

Componentes:

**Risk Engine**

Calcula scores de risco consolidados integrando:

* score clínico (histórico médico)
* score comportamental (lifestyle features de wearables)
* score demográfico (dados populacionais)

**Recommendation Engine**

Gera recomendações contextualizadas com dados de estilo de vida:

* exames preventivos sugeridos por risco clínico
* consultas médicas priorizadas
* orientações comportamentais personalizadas (ex: "Seu sono está irregular há 2 semanas")
* metas de atividade física baseadas no baseline do paciente

---

# 11️⃣ Serviço de Agendamento

Responsável por:

* consultar agenda médica
* agendar consultas
* agendar exames

Pode integrar com sistemas externos de agenda.

---

# 12️⃣ Observabilidade

Monitoramento do sistema.

**Azure Monitor**

* métricas de infraestrutura
* logs centralizados
* alertas e dashboards
* métricas de sincronização wearables (taxa de sucesso, latência, features geradas)

**Application Insights**

* monitoramento de APIs (incluindo Wearable Connector)
* performance da aplicação
* rastreamento de requests ponta a ponta

**Monitoramento específico de wearables:**

* taxa de tokens válidos por plataforma
* volume de dados sincronizados por dia
* alertas de degradação de qualidade de dados (ex: menos de 70% dos dias com dados)
* auditoria de consentimentos e revogações (LGPD)

---

# 📊 Arquitetura Simplificada (boa para slides)

```mermaid
flowchart LR

A[Paciente / Médico]
W[Dispositivos Wearables]

A --> B[Azure App Service]
W --> C2[Wearable Connector + OAuth]

B --> C[API Management]
C --> D[Backend CarePredict]
C2 --> D

D --> E[Azure SQL Database]
D --> F[Azure ML Inference]

F --> G[Risk + Recommendation Engine]
G --> H[Agendamento de Consultas]

D --> I[Data Lake]
I --> J[Databricks + Lifestyle Features]
J --> F
```

---

# 📋 Tabela Comparativa — Com e Sem Wearables

| Dimensão | Sem Wearables | Com Wearables |
|---|---|---|
| Frequência de dados | Pontual (consultas) | Contínua (24/7) |
| Granularidade | Diagnósticos e exames | Comportamento diário |
| Precisão dos modelos | Baseline | +15–25% |
| Personalização | Perfil clínico | Perfil clínico + comportamental |
| Detecção precoce | Reativa | Proativa (tendências) |
| Engajamento do paciente | Baixo | Alto (dados próprios visíveis) |