# Buckets no Planner

Crie os buckets assim:

```
Backlog
Sprint 1 – Infra Docker
Sprint 2 – Backend Core
Sprint 3 – Dados e ETL
Sprint 4 – Machine Learning
Sprint 5 – Engines Clínicas
Sprint 6 – Frontend + Fluxo E2E
Sprint 7 – Integração Wearables
Done
```

---

# SPRINT 1 — Infraestrutura Docker

Objetivo: ambiente rodando local.

---

### Card: Criar estrutura base do repositório

Story Points: **3**

Checklist:

* Criar monorepo do projeto
* Criar pastas `/modules/spa`, `/modules/api`, `/modules/services`, `/modules/data`, `/modules/ml`
* Criar `.env.example` (incluindo variáveis `OAUTH_MOCK_MODE`, `WEARABLE_MOCK_URL`)
* Criar README do projeto

---

### Card: Criar docker-compose inicial

Story Points: **5**

Checklist:

* Criar docker-compose.yml
* Configurar rede docker interna
* Definir volumes persistentes
* Configurar dependências entre serviços
* Adicionar entrypoints de healthcheck para todos os serviços

---

### Card: Subir serviços de persistência

Story Points: **3**

Checklist:

* Configurar container Postgres
* Configurar container MinIO
* Configurar container Redis
* Criar volumes persistentes
* Criar bucket MinIO separado para dados wearables

---

### Card: Configurar serviços de desenvolvimento

Story Points: **2**

Checklist:

* Configurar pgAdmin
* Configurar console MinIO
* Criar scripts de inicialização

---

### Card: Subir Wearable Connector e Mock APIs

Story Points: **3**

Checklist:

* Criar container `wearable-connector` (porta 8002)
* Criar container `wearable-mock-apis` (porta 8003)
* Configurar `OAUTH_MOCK_MODE=true` via `.env`
* Criar container `wearable-sync-worker` com cron configurável
* Verificar comunicação entre containers via rede interna

---

Sprint total ≈ **16 SP**

---

# SPRINT 2 — Backend API

Objetivo: criar API central do sistema.

---

### Card: Criar backend API base

Story Points: **5**

Checklist:

* Criar projeto FastAPI
* Configurar rotas básicas
* Implementar `/health`
* Configurar logging estruturado (JSON) com request-id

---

### Card: Implementar modelo de dados principal

Story Points: **5**

Checklist:

Criar tabelas:

* pacientes
* consultas
* exames
* recomendacoes
* agendamentos

---

### Card: CRUD de pacientes

Story Points: **3**

Checklist:

* Criar endpoint `POST /patients`
* Criar endpoint `GET /patients`
* Criar endpoint `GET /patients/{id}`

---

### Card: Integração com banco Postgres

Story Points: **3**

Checklist:

* Configurar ORM
* Criar migrations
* Testar conexão

---

### Card: Criar endpoints de gerenciamento de wearables

Story Points: **5**

Checklist:

* Criar endpoint `POST /wearables/connect` (inicia fluxo OAuth mock)
* Criar endpoint `GET /wearables/devices` (lista dispositivos do paciente)
* Criar endpoint `DELETE /wearables/devices/{id}` (revoga acesso)
* Criar endpoint `GET /wearables/summary/{patient_id}` (retorna lifestyle features)
* Criar endpoint `GET /wearables/sync/{device_id}` (dispara sync manual)
* Criar endpoint `GET /wearables/consent/{patient_id}` (situação de consentimento LGPD)

---

### Card: Criar migrations para tabelas wearables

Story Points: **3**

Checklist:

* Criar migration `wearable_devices`
* Criar migration `wearable_heartrate`
* Criar migration `wearable_activity`
* Criar migration `wearable_sleep`
* Criar migration `wearable_stress`

---

Sprint total ≈ **24 SP**

---

# SPRINT 3 — Ingestão e ETL

Objetivo: pipeline de dados do MVP.

---

### Card: Criar Data Worker ETL

Story Points: **5**

Checklist:

* Criar serviço `data-worker-etl`
* Implementar job batch
* Conectar MinIO

---

### Card: Criar estrutura de data lake local

Story Points: **3**

Checklist:

Criar buckets MinIO:

* raw
* processed
* curated
* wearables-raw (dados brutos de dispositivos)
* wearables-features (lifestyle features calculadas)

---

### Card: Pipeline de ingestão de dados clínicos

Story Points: **5**

Checklist:

* Criar dataset sintético
* Carregar dados no raw
* Processar dados
* Salvar em processed

---

### Card: Gerar features clínicas para ML

Story Points: **5**

Checklist:

* Calcular idade
* Calcular IMC
* Criar feature histórico exames
* Criar dataset features

---

### Card: Criar Wearable Sync Worker

Story Points: **5**

Checklist:

* Criar serviço `wearable-sync-worker`
* Implementar loop periódico (configurável via `SYNC_INTERVAL_SECONDS`)
* Buscar tokens válidos no Postgres
* Chamar Wearable Mock APIs para cada dispositivo conectado
* Gravar dados brutos em `wearables-raw` no MinIO

---

### Card: Criar pipeline de dados sintéticos de wearables

Story Points: **5**

Checklist:

* Criar gerador de dados sintéticos (atividade, sono, FC, estresse)
* Criar dataset representativo com variações temporais
* Configurar Wearable Mock APIs para servir dados sintéticos
* Cobrir ao menos 30 dias de histórico por paciente

---

### Card: Implementar feature engineering de Lifestyle Features

Story Points: **8**

Checklist:

Calcular as 13 lifestyle features:

* `avg_weekly_steps` — média de passos dos últimos 7 dias
* `sleep_quality_score` — score 0-100 baseado em duração e composição
* `sleep_consistency` — regularidade de horários de sono
* `insomnia_flag` — média < 6h nos últimos 7 dias
* `stress_level_avg` — média de estresse semanal
* `burnout_risk` — estresse > 70 E sono < 6h
* `recovery_days_ratio` — % de dias com boa recuperação
* `avg_resting_hr` — FC em repouso média
* `hrv_avg` — variabilidade da FC média
* `active_days_ratio` — % de dias com atividade registrada
* `exercise_consistency` — regularidade de sessões
* `activity_trend` — tendência crescente/decrescente
* `lifestyle_compliance_score` — score composto 0-100

Persistir features calculadas em `wearables-features` e no Postgres

---

Sprint total ≈ **36 SP**

---

# SPRINT 4 — Machine Learning

Objetivo: primeiro modelo funcional com dados clínicos + wearables.

---

### Card: Criar serviço ML Inference

Story Points: **5**

Checklist:

* Criar serviço `ml-inference-service`
* Criar endpoint `/predict`
* Carregar modelo local
* Implementar fallback quando lifestyle features estão ausentes (modelo clínico-only)

---

### Card: Treinar primeiro modelo de risco (clínico)

Story Points: **8**

Checklist:

* Criar dataset de treino com features clínicas
* Treinar modelo diabetes
* Avaliar métricas (AUC, precisão, recall)
* Salvar modelo como artefato versionado

---

### Card: Treinar modelo enriquecido com Lifestyle Features

Story Points: **8**

Checklist:

* Combinar features clínicas + 13 lifestyle features
* Retreinar modelo com feature set completo
* Comparar métricas entre modelo clínico-only e clínico+wearable
* Documentar ganho de precisão obtido (target: 15–25%)
* Salvar ambas as versões no model registry local

---

### Card: Integrar API com serviço ML

Story Points: **5**

Checklist:

* API montar feature vector (clínico + lifestyle)
* Enviar para ML Inference
* Receber probabilidades
* Persistir resultado com versão do modelo utilizado

---

Sprint total ≈ **26 SP**

---

# SPRINT 5 — Engines Clínicas

Objetivo: lógica médica do sistema com contexto comportamental.

---

### Card: Criar Risk Scoring Engine

Story Points: **5**

Checklist:

* Criar serviço `risk-scoring-engine`
* Calcular score clínico por paciente
* Calcular score comportamental a partir de lifestyle features
* Gerar Health Score consolidado (clínico + comportamental)

---

### Card: Criar Recommendation Engine

Story Points: **5**

Checklist:

* Definir regras clínicas
* Mapear exames preventivos por perfil de risco
* Gerar recomendações contextualizadas com dados de estilo de vida
* Gerar orientações comportamentais quando `burnout_risk=true` ou `insomnia_flag=true`
* Gerar metas de atividade baseadas em `avg_weekly_steps` e `active_days_ratio`

---

### Card: Integrar engines com backend

Story Points: **5**

Checklist:

* Backend chamar risk engine
* Backend chamar recommendation engine
* Persistir recomendações (clínicas e comportamentais)
* Associar recomendação à fonte de dados (clínica vs. wearable)

---

Sprint total ≈ **15 SP**

---

# SPRINT 6 — Frontend e Fluxo Completo

Objetivo: validar experiência do usuário com dados clínicos e wearables.

---

### Card: Criar frontend Angular base

Story Points: **5**

Checklist:

* Criar projeto Angular
* Criar layout básico
* Integrar API

---

### Card: Dashboard do paciente

Story Points: **5**

Checklist:

* Mostrar dados clínicos do paciente
* Mostrar score de saúde (clínico + comportamental)
* Mostrar recomendações clínicas e comportamentais

---

### Card: Painel de dispositivos wearables

Story Points: **5**

Checklist:

* Tela de conexão de dispositivo (fluxo OAuth mock)
* Tela de consentimento com checkbox LGPD
* Lista de dispositivos conectados com status de sync
* Botão de revogar acesso por dispositivo

---

### Card: Visualização de dados de estilo de vida

Story Points: **8**

Checklist:

* Gráfico de passos por dia (últimos 7 dias)
* Gráfico de qualidade do sono
* Indicador de FC em repouso e HRV
* Indicador de nível de estresse
* Badge de alerts: burnout_risk, insomnia_flag
* Exibir `lifestyle_compliance_score` com interpretação textual

---

### Card: Dashboard do médico — padrões de estilo de vida

Story Points: **5**

Checklist:

* Nova aba no dashboard médico: "Estilo de Vida"
* Exibir tendências de atividade, sono e estresse do paciente
* Destacar alertas comportamentais ativos
* Exibir recomendações comportamentais geradas

---

### Card: Fluxo de agendamento

Story Points: **5**

Checklist:

* Criar scheduling service
* Listar horários
* Confirmar agendamento

---

### Card: Teste end-to-end do fluxo preventivo com wearables

Story Points: **5**

Checklist:

* Criar paciente
* Conectar dispositivo wearable (mock)
* Aguardar sync e geração de lifestyle features
* Rodar análise preventiva com feature set completo
* Gerar recomendações clínicas e comportamentais
* Agendar exame a partir de recomendação

---

Sprint total ≈ **38 SP**

---

# SPRINT 7 — Integração Wearables (Hardening)

Objetivo: solidificar a integração wearable, cobrir edge cases e preparar para cloud.

---

### Card: Implementar OAuth 2.0 completo (Apple HealthKit)

Story Points: **8**

Checklist:

* Implementar `AppleHealthAuthManager` com OAuth real
* Registrar app no Apple Developer Account
* Implementar refresh automático de token
* Implementar revogação via painel do paciente
* Testar fluxo ponta a ponta com conta de teste

---

### Card: Implementar OAuth 2.0 completo (Google Fit)

Story Points: **8**

Checklist:

* Implementar `GoogleFitAuthManager` com OAuth real
* Registrar app no Google Cloud Console
* Configurar escopos de acesso fitness
* Implementar refresh e revogação
* Testar fluxo ponta a ponta

---

### Card: Implementar OAuth 2.0 completo (Fitbit)

Story Points: **8**

Checklist:

* Implementar `FitbitAuthManager` com OAuth real
* Registrar app no Fitbit Developer Portal
* Cobrir endpoints de atividade, sono, FC e estresse
* Implementar refresh e revogação
* Testar fluxo ponta a ponta

---

### Card: Implementar validação e qualidade de dados wearables

Story Points: **5**

Checklist:

* Detectar e descartar outliers (ex: FC > 220 bpm)
* Alertar quando `data_completeness < 70%` para o paciente
* Tratar dias com dados ausentes (interpolação ou flag)
* Monitorar taxa de sucesso de sync por plataforma

---

### Card: Implementar fluxo de consentimento LGPD completo

Story Points: **5**

Checklist:

* Registrar consentimento com timestamp e versão do termo
* Implementar revogação com purge agendado dos dados
* Garantir que dados wearables não aparecem em analytics após revogação
* Exportar relatório de consentimentos por paciente

---

### Card: Testes de integração — Wearable Connector

Story Points: **5**

Checklist:

* Testes de contrato para cada plataforma (Apple, Google, Fitbit)
* Testes de tolerância a falhas (timeout, token expirado, API indisponível)
* Testes do Sync Worker com dados sintéticos
* Testes das 13 lifestyle features com cenários conhecidos

---

### Card: Preparar configuração para deploy em Azure

Story Points: **3**

Checklist:

* Mapear variáveis de ambiente do `.env` para Azure Key Vault
* Desligar `OAUTH_MOCK_MODE` e apontar para OAuth real
* Configurar conexão com Azure Event Hub
* Documentar checklist de migração do MVP local para Azure

---

Sprint total ≈ **42 SP**