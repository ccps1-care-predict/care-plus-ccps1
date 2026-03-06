# ☁️ Arquitetura Cloud — CarePredict (Azure)

```mermaid
flowchart TB

%% USERS
Paciente[Paciente App / Portal]
Medico[Médico Dashboard]
Admin[Administração]

%% FRONTEND
subgraph Frontend
WebApp[Azure App Service - Web App]
end

%% API LAYER
subgraph API
APIM[Azure API Management]
Backend[Backend API - Azure App Service]
Auth[Azure Entra ID - Authentication]
end

%% DATA INGESTION
subgraph Ingestion
EventHub[Azure Event Hub]
DataFactory[Azure Data Factory]
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
subgraph MLFeatures
FeatureStore[Feature Store]
end

%% MACHINE LEARNING
subgraph MachineLearning
MLWorkspace[Azure Machine Learning Workspace]
Training[Model Training]
Registry[Model Registry]
Inference[ML Inference Endpoint]
end

%% APPLICATION SERVICES
subgraph Services
Recommendation[Recommendation Engine]
Scheduling[Scheduling Service]
end

%% MONITORING
subgraph Observability
Monitor[Azure Monitor]
AppInsights[Application Insights]
end

%% FLOWS

Paciente --> WebApp
Medico --> WebApp
Admin --> WebApp

WebApp --> APIM
APIM --> Backend
Backend --> Auth

Backend --> SQLDB
Backend --> Inference

%% DATA INGESTION

Backend --> EventHub
EventHub --> DataLake
DataFactory --> DataLake

%% DATA PROCESSING

DataLake --> Databricks
Databricks --> Synapse

Synapse --> FeatureStore

%% ML PIPELINE

FeatureStore --> Training
Training --> Registry
Registry --> Inference

%% APPLICATION LOGIC

Inference --> Recommendation
Recommendation --> Scheduling

Scheduling --> Backend

%% MONITORING

Backend --> AppInsights
Inference --> Monitor
Databricks --> Monitor
```

---

# 🧩 Explicação da Arquitetura

## 1️⃣ Camada de Aplicação

Usuários acessam:

* portal do paciente
* dashboard do médico
* painel administrativo

Hospedagem:

* **Azure App Service**

---

# 2️⃣ API Layer

Gerencia acesso aos serviços.

Componentes:

**Azure API Management**

* gateway de APIs
* segurança
* controle de acesso

**Backend API**

* lógica do CarePredict
* integração com ML

**Azure Entra ID**

* autenticação segura

---

# 3️⃣ Ingestão de Dados

Entrada de dados clínicos.

**Azure Event Hub**

* streaming de eventos

**Azure Data Factory**

* pipelines ETL

Exemplos de dados:

* exames
* consultas
* histórico clínico

---

# 4️⃣ Armazenamento

**Azure Data Lake Storage Gen2**

armazenamento de dados clínicos e históricos.

**Azure SQL Database**

dados transacionais:

* pacientes
* consultas
* exames
* recomendações

---

# 5️⃣ Processamento de Dados

**Azure Databricks**

* processamento de dados
* feature engineering

**Azure Synapse**

* analytics
* consultas analíticas

---

# 6️⃣ Machine Learning

Pipeline de ML usando **Azure Machine Learning**.

Componentes:

**Training**

treinamento dos modelos.

**Model Registry**

controle de versões.

**Inference Endpoint**

API de predição em produção.

---

# 7️⃣ Recommendation Engine

Transforma previsões em ações:

* sugerir exames
* recomendar consultas
* priorizar pacientes

---

# 8️⃣ Scheduling Service

Responsável por:

* consultar agenda médica
* agendar exames
* agendar consultas

---

# 9️⃣ Observabilidade

Monitoramento do sistema.

**Azure Monitor**

* métricas
* logs

**Application Insights**

* performance das APIs
* erros

---

# 🔐 Segurança (Essencial em Saúde)

Arquitetura deve incluir:

* **Azure Key Vault** → segredos e chaves
* **criptografia de dados**
* **controle de acesso por RBAC**
* **compliance LGPD**

---

# 📊 Arquitetura Simplificada (boa para slide)

```mermaid
flowchart LR

A[Paciente / Médico] --> B[Azure App Service]

B --> C[API Management]

C --> D[Backend CarePredict]

D --> E[Azure SQL Database]

D --> F[Azure ML - Prediction API]

F --> G[Recommendation Engine]

G --> H[Agendamento de Consultas]

D --> I[Data Lake]

I --> J[Databricks]

J --> F
```
