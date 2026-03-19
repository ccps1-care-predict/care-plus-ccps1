# 🧠 Diagrama de Sequência — CarePredict (Versão Revisada)

Este documento descreve os principais fluxos de interação do sistema **CarePredict**, incluindo:

1. Integração com Dispositivos Wearables
2. Sincronização de dados wearables
3. Análise preventiva com dados clínicos, epidemiológicos e wearables
4. Agendamento de consulta
5. Agendamento de exames
6. Consulta médica com apoio da IA
7. Pipeline de treinamento do modelo de Machine Learning

---

# 1️⃣ Conexão com Dispositivo Wearable (OAuth 2.0)

Fluxo de autenticação e autorização para conectar um dispositivo wearable (Apple Watch, Fitbit, Google Fit) ao sistema.

```mermaid
sequenceDiagram

participant Paciente
participant Frontend
participant API
participant PlatformaWearable as Plataforma Wearable<br/>(Apple/Google/Fitbit)
participant KeyVault
participant WearableDB

Paciente->>Frontend: Clica em "Conectar Dispositivo"
Frontend->>Frontend: Mostra opções de plataforma
Paciente->>Frontend: Seleciona plataforma (ex: Apple Health)

Frontend->>API: Inicia OAuth flow para Apple Health
API->>API: Gera estado aleatório (CSRF protection)

API-->>Frontend: Retorna URL de autenticação

Frontend->>PlatformaWearable: Redireciona para tela de login Apple
PlatformaWearable->>Paciente: Solicita login + consentimento

Paciente->>PlatformaWearable: Autoriza acesso aos dados
PlatformaWearable->>PlatformaWearable: Valida consentimento

PlatformaWearable-->>Frontend: Redireciona com auth code

Frontend->>API: Envia authorization code + estado

API->>API: Valida estado (segurança)
API->>PlatformaWearable: Troca authorization code por access token

PlatformaWearable-->>API: Retorna access_token e refresh_token

API->>KeyVault: Armazena tokens de forma segura
KeyVault-->>API: Confirmação

API->>WearableDB: Registra dispositivo conectado

WearableDB-->>API: Dispositivo registrado

API-->>Frontend: Conexão bem sucedida
Frontend-->>Paciente: ✅ Dispositivo conectado com sucesso!
```

---

# 2️⃣ Sincronização de Dados Wearables

Fluxo de coleta e sincronização de dados contínuos do dispositivo wearable.

```mermaid
sequenceDiagram

participant WearableDevice as Dispositivo<br/>Wearable
participant PlatformaWearable as Plataforma Wearable<br/>API
participant DataConnector as Wearable<br/>Data Connector
participant KeyVault
participant EventHub
participant AnonymizationService
participant WearableDB
participant DataLake

loop Sincronização Diária (Batch)
    DataConnector->>KeyVault: Recuperar access token
    KeyVault-->>DataConnector: Token
    
    DataConnector->>PlatformaWearable: Solicita dados dos últimos 24h
    PlatformaWearable->>PlatformaWearable: Agrega dados do dispositivo
    PlatformaWearable-->>DataConnector: Retorna atividade, sono, frequência cardíaca, estresse
    
    DataConnector->>DataConnector: Valida integridade dos dados
    DataConnector->>DataConnector: Normaliza unidades (milhas → km, etc)
    
    DataConnector->>EventHub: Emite evento de dados wearable
    
    EventHub->>AnonymizationService: Processa dados com mascaramento de PII
    AnonymizationService->>AnonymizationService: Remove identificadores diretos
    AnonymizationService->>AnonymizationService: Aplica pseudonimização
    
    AnonymizationService->>WearableDB: Armazena dados anonimizados
    WearableDB-->>AnonymizationService: Confirmação
    
    AnonymizationService->>DataLake: Armazena dados processados (zona Raw/Processed)
    DataLake-->>AnonymizationService: Confirmação
    
    DataConnector->>DataConnector: Atualiza last_sync timestamp
end

loop Sincronização em Tempo Real (Streaming - opcional)
    WearableDevice->>PlatformaWearable: Envia evento de frequência cardíaca
    PlatformaWearable-->>DataConnector: Notifica novo evento
    
    DataConnector->>EventHub: Emite evento em tempo real
    EventHub->>AnonymizationService: Processa imediatamente
    AnonymizationService->>WearableDB: Armazena ponto de dados
end
```

---

# 3️⃣ Análise de Risco com Integração de Wearables

Fluxo central do sistema.  
O modelo utiliza **dados clínicos do paciente + dados epidemiológicos populacionais + dados contínuos de wearables** para prever riscos e gerar recomendações preventivas.

```mermaid
sequenceDiagram

participant Paciente
participant Frontend
participant API
participant ClinicalDB
participant WearableDB
participant PopulationData
participant FeatureEngineer
participant MLService
participant RiskEngine
participant ClinicalGuidelines
participant RecommendationEngine

Paciente->>Frontend: Acessa dashboard de saúde
Frontend->>API: Solicita análise preventiva

API->>ClinicalDB: Buscar histórico clínico do paciente
ClinicalDB-->>API: Retorna diagnósticos, exames, consultas

API->>WearableDB: Buscar dados de estilo de vida (últimas 4 semanas)
WearableDB-->>API: Retorna atividade, sono, FC, estresse

API->>PopulationData: Buscar dados epidemiológicos
PopulationData-->>API: Retorna indicadores populacionais

API->>FeatureEngineer: Enviar dados clínicos + wearables + populacionais
FeatureEngineer->>FeatureEngineer: Calcular lifestyle features
FeatureEngineer->>FeatureEngineer: Atividade média semanal
FeatureEngineer->>FeatureEngineer: Qualidade de sono
FeatureEngineer->>FeatureEngineer: Variabilidade de FC
FeatureEngineer->>FeatureEngineer: Nível de estresse
FeatureEngineer-->>API: Features engenheirizadas

API->>MLService: Enviar feature vector completo (clínico + comportamental + populacional)
MLService->>MLService: Executar modelo preditivo enriquecido

MLService-->>RiskEngine: Retorna probabilidades de risco (com confiança aumentada)

RiskEngine->>ClinicalGuidelines: Consultar protocolos médicos
ClinicalGuidelines-->>RiskEngine: Regras clínicas

RiskEngine->>RecommendationEngine: Gerar recomendações preventivas contextualizadas
RecommendationEngine->>RecommendationEngine: Considerar padrões de atividade do paciente
RecommendationEngine->>RecommendationEngine: Adaptar recomendações ao estilo de vida
RecommendationEngine-->>API: Lista de exames, consultas e ações de lifestyle sugeridas

API-->>Frontend: Retorna recomendações + insights de wearables
Frontend-->>Paciente: Exibe recomendações preventivas + gráficos de estilo de vida
```

---

# 4️⃣ Agendamento de consulta

Fluxo onde o paciente agenda uma consulta médica com base em recomendações do sistema ou iniciativa própria.

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

API-->>Frontend: Exibir horários disponíveis

Paciente->>Frontend: Seleciona horário
Frontend->>API: Confirmar agendamento

API->>SchedulingService: Criar agendamento
SchedulingService->>AgendaExterna: Registrar consulta

AgendaExterna-->>SchedulingService: Confirma agendamento
SchedulingService-->>API: Agendamento confirmado

API-->>Frontend: Confirmação
Frontend-->>Paciente: Consulta agendada
```

---

# 5️⃣ Agendamento de exames preventivos

Fluxo semelhante ao agendamento de consulta, porém voltado para exames recomendados pelo CarePredict.

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

Laboratorio-->>ExamService: Retorna horários disponíveis
ExamService-->>API: Lista de horários

API-->>Frontend: Exibe horários disponíveis

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

# 6️⃣ Consulta médica com apoio da IA

Fluxo onde o médico recebe suporte analítico durante a consulta, incluindo riscos preditivos calculados pelo sistema.

```mermaid
sequenceDiagram

participant Medico
participant DashboardMedico
participant API
participant ClinicalDB
participant WearableDB
participant MLService

Medico->>DashboardMedico: Abrir ficha do paciente
DashboardMedico->>API: Solicitar histórico clínico e dados de estilo de vida

API->>ClinicalDB: Buscar histórico médico
ClinicalDB-->>API: Retorna dados clínicos

API->>WearableDB: Buscar dados de estilo de vida (últimas 4 semanas)
WearableDB-->>API: Retorna gráficos de atividade, sono, FC, estresse

API->>MLService: Solicitar análise preditiva
MLService-->>API: Retorna riscos de saúde

API-->>DashboardMedico: Enviar resumo clínico + análise preditiva + visualizações de wearables

DashboardMedico-->>Medico: Exibir:
DashboardMedico-->>Medico: • Histórico médico
DashboardMedico-->>Medico: • Gráficos de atividade física
DashboardMedico-->>Medico: • Qualidade de sono
DashboardMedico-->>Medico: • Frequência cardíaca em repouso
DashboardMedico-->>Medico: • Indicadores de estresse
DashboardMedico-->>Medico: • Riscos preditivos
DashboardMedico-->>Medico: • Recomendações contextualizadas

Medico->>DashboardMedico: Conversa com paciente considerando dados de estilo de vida
Medico->>DashboardMedico: Registra diagnóstico + orientações de mudanças comportamentais
DashboardMedico->>API: Atualizar dados clínicos

API->>ClinicalDB: Salvar consulta e feedback do médico
```

---

# 7️⃣ Treinamento e atualização do modelo de Machine Learning

Fluxo interno responsável por atualizar continuamente os modelos preditivos com dados clínicos, comportamentais e epidemiológicos.

```mermaid
sequenceDiagram

participant DataPipeline
participant DataLake
participant WearableProcessor as Wearable Data<br/>Processor
participant ClinicalProcessor as Clinical Data<br/>Processor
participant PopulationProcessor as Population Data<br/>Processor
participant FeatureStore
participant MLTraining
participant ModelEvaluation
participant ModelRegistry
participant PredictionAPI

DataPipeline->>DataLake: Coletar dados clínicos históricos
DataPipeline->>DataLake: Coletar dados de wearables históricos
DataPipeline->>DataLake: Coletar dados epidemiológicos públicos

DataLake-->>DataPipeline: Dados consolidados

DataPipeline->>WearableProcessor: Processar dados wearables
WearableProcessor->>WearableProcessor: Normalizar unidades
WearableProcessor->>WearableProcessor: Detectar anomalias
WearableProcessor->>WearableProcessor: Imputar valores faltantes
WearableProcessor-->>FeatureStore: Lifestyle features enriquecidas

DataPipeline->>ClinicalProcessor: Processar dados clínicos
ClinicalProcessor->>ClinicalProcessor: Validar dados
ClinicalProcessor-->>FeatureStore: Features clínicas

DataPipeline->>PopulationProcessor: Processar dados epidemiológicos
PopulationProcessor-->>FeatureStore: Features populacionais

FeatureStore->>FeatureStore: Consolidar features:
FeatureStore->>FeatureStore: • Clínicas (histório, exames, diagnósticos)
FeatureStore->>FeatureStore: • Comportamentais (atividade, sono, FC, estresse)
FeatureStore->>FeatureStore: • Populacionais (indicadores epidemiológicos)

FeatureStore-->>MLTraining: Dataset preparado e balanceado

MLTraining->>MLTraining: Dividir treino/validação/teste
MLTraining->>MLTraining: Treinar modelo preditivo com feature vector rico
MLTraining->>MLTraining: Validação cruzada

MLTraining->>ModelEvaluation: Avaliar performance
ModelEvaluation->>ModelEvaluation: Calcular AUC, precisão, recall
ModelEvaluation->>ModelEvaluation: Comparar com modelo anterior
ModelEvaluation->>ModelEvaluation: Análise de feature importance

ModelEvaluation-->>MLTraining: Métricas de qualidade

MLTraining->>ModelRegistry: Registrar nova versão do modelo
ModelRegistry->>ModelRegistry: Versionar modelo
ModelRegistry->>ModelRegistry: Documentar performance
ModelRegistry->>ModelRegistry: Rastrear features utilizadas

ModelRegistry->>PredictionAPI: Atualizar modelo em produção (candidato)
ModelRegistry->>PredictionAPI: Canary deployment (5% tráfego)

PredictionAPI->>PredictionAPI: Monitorar performance em tempo real
PredictionAPI->>ModelRegistry: Feedback de performance

note over ModelRegistry: Validacao: 24-48h antes de 100% trafego

ModelRegistry->>PredictionAPI: Promover para producao completa
```

---

# 🧠 Observação importante

O CarePredict utiliza **três tipos de dados para análise preditiva**:

### Dados clínicos individuais

* histórico médico
* exames
* consultas
* diagnósticos

### Dados comportamentais (Wearables)

* atividade física (passos, exercício)
* frequência cardíaca (repouso, máxima, variabilidade)
* qualidade de sono (duração, composição, coerência)
* nível de estresse e padrões de recuperação

**Importância:** Wearables fornecem uma **visão contínua e não-invasiva** do estilo de vida real do paciente, permitindo detecção de riscos **meses antes** de apresentarem sintomas clínicos.

### Dados populacionais públicos

* indicadores epidemiológicos
* incidência de doenças
* fatores demográficos

Essas informações combinadas permitem gerar **modelos muito mais robustos de medicina preventiva** com **precisão 15-25% superior** em relação a modelos que usam apenas dados clínicos.