# 1️⃣ Análise de risco e geração de recomendações

Esse é o **fluxo central do CarePredict**, onde o ML analisa os dados do paciente.

```mermaid
sequenceDiagram
participant Paciente
participant Frontend
participant API
participant ClinicalDB
participant MLService
participant RecommendationEngine

Paciente->>Frontend: Acessa dashboard de saúde
Frontend->>API: Solicita análise preventiva
API->>ClinicalDB: Buscar histórico clínico
ClinicalDB-->>API: Retorna dados do paciente

API->>MLService: Enviar dados clínicos
MLService->>MLService: Processar modelo preditivo
MLService-->>API: Retorna riscos de saúde

API->>RecommendationEngine: Gerar recomendações
RecommendationEngine-->>API: Lista de exames e consultas

API-->>Frontend: Retorna recomendações
Frontend-->>Paciente: Exibe recomendações preventivas
```

---

# 2️⃣ Agendamento de consulta

Fluxo onde o paciente agenda consulta recomendada.

```mermaid
sequenceDiagram
participant Paciente
participant Frontend
participant API
participant SchedulingService
participant AgendaExterna

Paciente->>Frontend: Solicita agendar consulta
Frontend->>API: Enviar pedido de agendamento

API->>SchedulingService: Solicitar horários disponíveis
SchedulingService->>AgendaExterna: Consultar agenda médica
AgendaExterna-->>SchedulingService: Retorna horários disponíveis

SchedulingService-->>API: Lista de horários
API-->>Frontend: Mostrar horários disponíveis

Paciente->>Frontend: Escolhe horário
Frontend->>API: Confirmar agendamento

API->>SchedulingService: Criar agendamento
SchedulingService->>AgendaExterna: Registrar consulta

AgendaExterna-->>SchedulingService: Confirma agendamento
SchedulingService-->>API: Agendamento confirmado
API-->>Frontend: Confirmação
Frontend-->>Paciente: Consulta agendada
```

---

# 3️⃣ Agendamento de exames preventivos

Fluxo semelhante ao anterior, mas com exames.

```mermaid
sequenceDiagram
participant Paciente
participant Frontend
participant API
participant ExamService
participant Laboratorio

Paciente->>Frontend: Solicita agendar exame
Frontend->>API: Enviar solicitação

API->>ExamService: Consultar exames recomendados
ExamService->>Laboratorio: Consultar disponibilidade

Laboratorio-->>ExamService: Retorna horários
ExamService-->>API: Lista de horários

API-->>Frontend: Exibe horários

Paciente->>Frontend: Seleciona horário
Frontend->>API: Confirmar exame

API->>ExamService: Registrar exame
ExamService->>Laboratorio: Criar agendamento

Laboratorio-->>ExamService: Confirmação
ExamService-->>API: Exame agendado

API-->>Frontend: Confirmação
Frontend-->>Paciente: Exame agendado
```

---

# 4️⃣ Consulta médica com apoio da IA

Fluxo que ajuda na **anamnese do médico**.

```mermaid
sequenceDiagram
participant Medico
participant DashboardMedico
participant API
participant ClinicalDB
participant MLService

Medico->>DashboardMedico: Abrir ficha do paciente
DashboardMedico->>API: Solicitar dados clínicos

API->>ClinicalDB: Buscar histórico
ClinicalDB-->>API: Retorna dados

API->>MLService: Solicitar análise preditiva
MLService-->>API: Retorna riscos e recomendações

API-->>DashboardMedico: Enviar resumo clínico

DashboardMedico-->>Medico: Exibir histórico + riscos
Medico->>DashboardMedico: Registrar diagnóstico

DashboardMedico->>API: Atualizar dados clínicos
API->>ClinicalDB: Salvar consulta
```

---

# 5️⃣ Treinamento e atualização do modelo de Machine Learning

Fluxo interno de **treinamento do modelo**.

```mermaid
sequenceDiagram
participant DataPipeline
participant DataLake
participant FeatureStore
participant MLTraining
participant ModelRegistry
participant PredictionAPI

DataPipeline->>DataLake: Coletar dados clínicos históricos
DataLake-->>DataPipeline: Dados brutos

DataPipeline->>FeatureStore: Criar features
FeatureStore-->>MLTraining: Dataset preparado

MLTraining->>MLTraining: Treinar modelo

MLTraining->>ModelRegistry: Registrar modelo

ModelRegistry->>PredictionAPI: Atualizar modelo em produção
```

