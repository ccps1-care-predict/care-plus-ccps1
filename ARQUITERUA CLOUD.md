# ☁️ Arquitetura Cloud — CarePredict (Versão Revisada)

Este documento descreve a arquitetura cloud do **CarePredict**, sistema de medicina preventiva baseado em Machine Learning desenvolvido para a CarePlus.

A arquitetura foi projetada utilizando **Microsoft Azure** e segue princípios de:

- escalabilidade
- segurança de dados de saúde
- governança de dados
- MLOps

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

end

%% PRIVACY

subgraph Privacy

Anonymization[Data Anonymization Service]

end

%% DATA STORAGE

subgraph Storage

DataLake[Azure Data Lake Storage Gen2]
SQLDB[Azure SQL Database]

end

%% DATA PROCESSING

subgraph Processing

Databricks[Azure Databricks]
Synapse[Azure Synapse Analytics]

end

%% FEATURE STORE

subgraph FeatureLayer

FeatureStore[Feature Store]

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

%% DATA FLOW

Backend --> SQLDB

%% EVENT STREAM

Backend --> EventHub

%% DATA INGESTION

EventHub --> Anonymization
PublicData --> DataFactory
DataFactory --> Anonymization

Anonymization --> DataLake

%% DATA PROCESSING

DataLake --> Databricks
Databricks --> Synapse

%% FEATURE ENGINEERING

Synapse --> FeatureStore

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

* ingestão de eventos
* streaming de dados do sistema

**Azure Data Factory**

* pipelines ETL
* ingestão de dados externos

**Dados Públicos**

integração com:

* DATASUS
* IBGE
* ANS

---

# 5️⃣ Privacidade e LGPD

Antes de armazenar dados no Data Lake, o sistema aplica:

* anonimização
* pseudonimização
* mascaramento de dados sensíveis

Isso garante conformidade com **LGPD**.

---

# 6️⃣ Armazenamento

Dois tipos de armazenamento são utilizados.

### Azure SQL Database

dados transacionais:

* pacientes
* consultas
* exames
* recomendações

---

### Azure Data Lake Storage

dados analíticos:

* históricos clínicos
* dados populacionais
* datasets de ML

---

# 7️⃣ Processamento de Dados

**Azure Databricks**

responsável por:

* processamento de dados
* limpeza
* feature engineering

**Azure Synapse**

utilizado para:

* analytics
* consultas analíticas

---

# 8️⃣ Feature Store

Armazena features utilizadas pelos modelos de Machine Learning.

Benefícios:

* consistência entre treino e produção
* reutilização de features
* melhor governança de ML

---

# 9️⃣ Plataforma de Machine Learning

Implementada com **Azure Machine Learning**.

Componentes:

### Model Training

treinamento dos modelos.

### Model Registry

controle de versões.

### Inference Endpoint

API de predição em produção.

---

# 🔟 Motor de Recomendação

Transforma previsões de risco em ações preventivas.

Componentes:

**Risk Engine**

calcula scores de risco.

**Recommendation Engine**

gera recomendações como:

* exames preventivos
* consultas médicas
* check-ups

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

* métricas
* logs
* alertas

**Application Insights**

* monitoramento de APIs
* performance da aplicação

---

# 📊 Arquitetura Simplificada (boa para slides)

```mermaid
flowchart LR

A[Paciente / Médico]

A --> B[Azure App Service]

B --> C[API Management]

C --> D[Backend CarePredict]

D --> E[Azure SQL Database]

D --> F[Azure ML Inference]

F --> G[Recommendation Engine]

G --> H[Agendamento de Consultas]

D --> I[Data Lake]

I --> J[Databricks]

J --> F
```