# 🧠 Arquitetura de Dados Completa — CarePredict

```mermaid
flowchart TB

%% ==============================
%% DATA SOURCES
%% ==============================

subgraph DataSources["Fontes de Dados"]
EHR[EHR / Prontuário Eletrônico]
Lab[Laboratórios / Resultados de Exames]
Hosp[Sistemas Hospitalares]
Claims[Dados de Sinistro / Plano de Saúde]
Wearables[Dispositivos de Saúde / Wearables]
App[Aplicativo do Paciente]
end

%% ==============================
%% DATA INGESTION
%% ==============================

subgraph Ingestion["Camada de Ingestão"]
API[APIs Clínicas]
Stream[Streaming de Eventos]
Batch[ETL Batch]
end

%% ==============================
%% RAW DATA STORAGE
%% ==============================

subgraph DataLake["Data Lake"]
Raw[(Raw Data)]
Processed[(Processed Data)]
Curated[(Curated Data)]
end

%% ==============================
%% DATA PROCESSING
%% ==============================

subgraph Processing["Processamento de Dados"]
ETL[ETL / ELT Pipeline]
Cleaning[Data Cleaning]
Enrichment[Data Enrichment]
end

%% ==============================
%% ANALYTICS LAYER
%% ==============================

subgraph Warehouse["Data Warehouse"]
DW[(Clinical Analytics Warehouse)]
BI[BI / Analytics Tools]
end

%% ==============================
%% ML FEATURE LAYER
%% ==============================

subgraph FeatureLayer["Feature Engineering"]
FeaturePipeline[Feature Engineering Pipeline]
FeatureStore[(Feature Store)]
end

%% ==============================
%% MACHINE LEARNING
%% ==============================

subgraph ML["Machine Learning Platform"]
Training[Model Training]
Validation[Model Validation]
Registry[(Model Registry)]
end

%% ==============================
%% MODEL SERVING
%% ==============================

subgraph Serving["ML Serving"]
InferenceAPI[Prediction API]
RecommendationEngine[Recommendation Engine]
end

%% ==============================
%% APPLICATION LAYER
%% ==============================

subgraph Applications["Aplicações CarePredict"]
PatientApp[Portal do Paciente]
DoctorDashboard[Dashboard Médico]
Scheduling[Serviço de Agendamento]
end

%% ==============================
%% MONITORING
%% ==============================

subgraph Monitoring["Monitoramento"]
ModelMonitoring[Model Monitoring]
DataQuality[Data Quality Checks]
Logs[Observability / Logs]
end

%% ==============================
%% FEEDBACK LOOP
%% ==============================

subgraph Feedback["Feedback Clínico"]
MedicalFeedback[Feedback do Médico]
PatientOutcomes[Resultados de Saúde]
end

%% ==============================
%% FLOWS
%% ==============================

EHR --> API
Lab --> API
Hosp --> API
Claims --> Batch
Wearables --> Stream
App --> Stream

API --> Raw
Stream --> Raw
Batch --> Raw

Raw --> ETL
ETL --> Cleaning
Cleaning --> Enrichment

Enrichment --> Processed
Processed --> Curated

Curated --> DW
DW --> BI

Curated --> FeaturePipeline
FeaturePipeline --> FeatureStore

FeatureStore --> Training
Training --> Validation
Validation --> Registry

Registry --> InferenceAPI

InferenceAPI --> RecommendationEngine

RecommendationEngine --> PatientApp
RecommendationEngine --> DoctorDashboard
RecommendationEngine --> Scheduling

InferenceAPI --> ModelMonitoring
Curated --> DataQuality
InferenceAPI --> Logs

MedicalFeedback --> FeaturePipeline
PatientOutcomes --> FeaturePipeline
```

---

# 🧩 Explicação das Camadas

## 1️⃣ Fontes de Dados

Dados vêm de vários sistemas:

* prontuário eletrônico (EHR)
* laboratórios
* sistemas hospitalares
* dados de sinistros
* dispositivos de saúde
* aplicativo do paciente

Esses dados alimentam o sistema de prevenção.

---

# 2️⃣ Ingestão de Dados

Dados entram por três formas:

**APIs**

* integração com sistemas clínicos

**Streaming**

* eventos do app
* dados de wearables

**Batch**

* dados históricos do plano de saúde

---

# 3️⃣ Data Lake

Armazena dados em três níveis:

**Raw**

dados brutos.

**Processed**

dados limpos.

**Curated**

dados preparados para analytics e ML.

---

# 4️⃣ Processamento de Dados

Pipeline responsável por:

* limpeza
* normalização
* enriquecimento clínico

Exemplo:

* cálculo de IMC
* agregação de histórico de exames

---

# 5️⃣ Data Warehouse

Camada usada para:

* analytics
* dashboards
* relatórios médicos

Exemplo:

* análise de população
* incidência de doenças
* custos assistenciais

---

# 6️⃣ Feature Engineering

Transforma dados clínicos em **features para ML**.

Exemplo:

| Feature                     | Descrição         |
| --------------------------- | ----------------- |
| idade                       | idade do paciente |
| média glicemia              | média exames      |
| histórico familiar diabetes | binário           |
| IMC                         | calculado         |

---

# 7️⃣ Feature Store

Armazena features reutilizáveis.

Benefícios:

* consistência entre treino e produção
* alta performance
* reuso entre modelos

---

# 8️⃣ Machine Learning Platform

Pipeline de ML:

1️⃣ treinamento
2️⃣ validação
3️⃣ registro do modelo

O **Model Registry** guarda:

* versões
* métricas
* datasets usados

---

# 9️⃣ Serving / Predição

A **Prediction API** roda o modelo.

Saída:

```text
risco cardiovascular
risco diabetes
risco hipertensão
```

---

# 🔟 Recommendation Engine

Transforma previsões em ações:

* recomendar exames
* recomendar consultas
* priorizar pacientes

---

# 11️⃣ Aplicações

Resultados aparecem em:

**Paciente**

* recomendações
* agendamento

**Médico**

* dashboard clínico
* análise preditiva

---

# 12️⃣ Monitoramento

Sistemas de IA precisam monitorar:

* **model drift**
* qualidade de dados
* erros de predição

---

# 13️⃣ Feedback Loop

Sistema melhora com feedback:

* resultados clínicos reais
* avaliação do médico
* evolução do paciente

Isso permite **re-treinar os modelos continuamente**.

---

# 📊 Versão resumida (boa para slide)

```mermaid
flowchart LR

A[Fontes de Dados Clínicos]
B[Data Lake]
C[Processamento de Dados]
D[Feature Store]
E[Machine Learning]
F[Predição de Riscos]
G[Recomendações Preventivas]
H[Agendamento de Consultas]

A --> B
B --> C
C --> D
D --> E
E --> F
F --> G
G --> H
```