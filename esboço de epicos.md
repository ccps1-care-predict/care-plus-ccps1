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
* Criar pastas `/frontend`, `/backend`, `/services`, `/data`, `/ml`
* Criar `.env.example`
* Criar README do projeto

---

### Card: Criar docker-compose inicial

Story Points: **5**

Checklist:

* Criar docker-compose.yml
* Configurar rede docker interna
* Definir volumes persistentes
* Configurar dependências entre serviços

---

### Card: Subir serviços de persistência

Story Points: **3**

Checklist:

* Configurar container Postgres
* Configurar container MinIO
* Configurar container Redis
* Criar volumes persistentes

---

### Card: Configurar ferramentas de desenvolvimento

Story Points: **2**

Checklist:

* Configurar pgAdmin
* Configurar console MinIO
* Criar scripts de inicialização

---

Sprint total ≈ **13 SP**

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
* Configurar logging

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

Sprint total ≈ **16 SP**

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

---

### Card: Pipeline de ingestão de dados clínicos

Story Points: **5**

Checklist:

* Criar dataset sintético
* Carregar dados no raw
* Processar dados
* Salvar em processed

---

### Card: Gerar features para ML

Story Points: **5**

Checklist:

* Calcular idade
* Calcular IMC
* Criar feature histórico exames
* Criar dataset features

---

Sprint total ≈ **18 SP**

---

# SPRINT 4 — Machine Learning

Objetivo: primeiro modelo funcional.

---

### Card: Criar serviço ML Inference

Story Points: **5**

Checklist:

* Criar serviço `ml-inference-service`
* Criar endpoint `/predict`
* Carregar modelo local

---

### Card: Treinar primeiro modelo de risco

Story Points: **8**

Checklist:

* Criar dataset de treino
* Treinar modelo diabetes
* Avaliar métricas
* Salvar modelo

---

### Card: Integrar API com serviço ML

Story Points: **5**

Checklist:

* API enviar features
* Receber probabilidades
* Persistir resultado

---

Sprint total ≈ **18 SP**

---

# SPRINT 5 — Engines Clínicas

Objetivo: lógica médica do sistema.

---

### Card: Criar Risk Scoring Engine

Story Points: **5**

Checklist:

* Criar serviço `risk-scoring-engine`
* Calcular score por paciente
* Gerar Health Score

---

### Card: Criar Recommendation Engine

Story Points: **5**

Checklist:

* Definir regras clínicas
* Mapear exames preventivos
* Gerar recomendações

---

### Card: Integrar engines com backend

Story Points: **5**

Checklist:

* Backend chamar risk engine
* Backend chamar recommendation engine
* Persistir recomendações

---

Sprint total ≈ **15 SP**

---

# SPRINT 6 — Frontend e Fluxo Completo

Objetivo: validar experiência do usuário.

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

* Mostrar dados do paciente
* Mostrar score de saúde
* Mostrar recomendações

---

### Card: Fluxo de agendamento

Story Points: **5**

Checklist:

* Criar scheduling service
* Listar horários
* Confirmar agendamento

---

### Card: Teste end-to-end do fluxo preventivo

Story Points: **3**

Checklist:

* Criar paciente
* Rodar análise preventiva
* Gerar recomendação
* Agendar exame

---

Sprint total ≈ **18 SP**