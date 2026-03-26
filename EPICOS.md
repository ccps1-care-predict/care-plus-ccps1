# Buckets no Planner

Crie os buckets assim:

```text
Backlog
In Progress
Done
```

---

# Estado atual do projeto (2026-03-26)

## Resumo rapido

- Infra local com Docker Compose funcional para nucleo MVP.
- Submodulos existentes: `api`, `spa`, `services`, `data`, `ml`.
- Arquitetura base aplicada:
  - `api`: modular monolith (somente contexto `users` registrado).
  - `services` e `ml`: servicos HTTP com `presentation/application/domain/infrastructure`.
  - `data` e `wearable-sync-worker`: pipeline em estagios.
  - `spa`: organizacao por feature (`dashboard`, `risk`, `recommendations`, `wearables`, `scheduling`).
- Backend funcional ainda parcial: varios componentes continuam com stubs/in-memory para persistencia e inferencia.

---

# DONE

## EPICO 1 - Infraestrutura Docker

Objetivo: ambiente local reproduzivel para desenvolvimento e validacao.

### Card: Estrutura base do repositorio
Story Points: **3**
Status: **Done**

Checklist:
- [x] Monorepo com pastas `modules/spa`, `modules/api`, `modules/services`, `modules/data`, `modules/ml`
- [x] README principal criado
- [x] `.env.example` com variaveis de execucao local

### Card: Docker Compose do MVP local
Story Points: **5**
Status: **Done**

Checklist:
- [x] `docker-compose.yml` na raiz
- [x] Rede interna e volumes persistentes
- [x] Dependencias entre servicos
- [x] Healthchecks basicos

### Card: Persistencia local
Story Points: **3**
Status: **Done**

Checklist:
- [x] Postgres
- [x] Redis
- [x] MinIO
- [x] Init de buckets MinIO (`raw`, `processed`, `curated`, `wearables-raw`, `wearables-features`)

### Card: Servicos de desenvolvimento
Story Points: **2**
Status: **Done**

Checklist:
- [x] PgAdmin por profile opcional
- [x] Console MinIO disponivel

Sprint total entregue: **13 SP**

---

## EPICO 2 - Baseline de arquitetura dos componentes

Objetivo: padronizar arquitetura de codigo conforme recomendacao tecnica.

### Card: API em modular monolith
Story Points: **5**
Status: **Done**

Checklist:
- [x] Registro de modulo em `src/modules/users/module.py`
- [x] Bootstrap da API atualizado para registrar modulos
- [x] README do modulo API atualizado

### Card: Servicos HTTP em camadas
Story Points: **13**
Status: **Done**

Checklist:
- [x] `risk-scoring-engine`
- [x] `clinical-guidelines-validator`
- [x] `recommendation-engine`
- [x] `scheduling-service`
- [x] `population-data-service`
- [x] `wearable-connector`
- [x] `wearable-mock-apis`
- [x] `ml-inference-service`
- [x] Estrutura `presentation/application/domain/infrastructure`

### Card: Workers batch em pipeline
Story Points: **8**
Status: **Done**

Checklist:
- [x] `wearable-sync-worker` com estagios de pipeline
- [x] `data-worker-etl` com `extract -> validate -> transform -> persist`
- [x] Estrutura `pipeline/steps`, `infrastructure`, `observability`

### Card: SPA orientada a feature
Story Points: **8**
Status: **Done**

Checklist:
- [x] `core/layout/app-shell.component.ts`
- [x] Features separadas por rota
- [x] Rotas: `/`, `/risk`, `/recommendations`, `/wearables`, `/scheduling`
- [x] README do SPA atualizado

Sprint total entregue: **34 SP**

---

## EPICO 3 - Documentacao e alinhamento tecnico

Objetivo: manter documentacao alinhada ao estado implementado.

### Card: Atualizacao dos READMEs dos submodulos
Story Points: **5**
Status: **Done**

Checklist:
- [x] `modules/api/README.md`
- [x] `modules/services/README.md`
- [x] `modules/data/README.md`
- [x] `modules/ml/README.md`
- [x] `modules/spa/README.md`
- [x] READMEs dos componentes internos atualizados

### Card: Atualizacao dos ponteiros de submodulo
Story Points: **2**
Status: **Done**

Checklist:
- [x] Commits por submodulo no padrao conventional commits
- [x] Commit da raiz com referencias atualizadas
- [x] Push executado em todos os remotos

Sprint total entregue: **7 SP**

---

# IN PROGRESS

## EPICO 4 - Backend de negocio (MVP funcional)

Objetivo: sair de baseline arquitetural para fluxo funcional real no backend.

### Card: Expandir API alem de usuarios
Story Points: **8**
Status: **In progress**

Checklist:
- [x] Contexto `users` com persistencia em Postgres + cache Redis
- [ ] Contexto `patients` no modular monolith
- [ ] Contexto `recommendations` na API
- [ ] Contexto `scheduling` na API
- [ ] Contratos entre API e servicos internos

### Card: Persistencia real nos servicos
Story Points: **8**
Status: **In progress**

Checklist:
- [ ] `wearable-connector` sair de `InMemoryDeviceRepository`
- [ ] `scheduling-service` sair de `InMemoryScheduleStore`
- [ ] Migrations para tabelas de wearables e recomendacoes
- [ ] Persistencia real no `wearable-sync-worker` (atualmente stub no `persist`)
- [ ] Persistencia real no `data-worker-etl` (atualmente stub no `persist`)
- [ ] Idempotencia de operacoes de agendamento/sync

Pontos planejados no epico: **16 SP**

---

# BACKLOG

## EPICO 5 - Dados e ETL funcional

Objetivo: tornar o pipeline de dados operacional no MinIO/Postgres.

### Card: Integrar ETL com MinIO e metadata
Story Points: **8**
Checklist:
- [ ] Escrita real em `raw`, `processed`, `curated`
- [ ] Metadata de execucao por run
- [ ] Retentativas e falha por etapa

### Card: Lifestyle features completas
Story Points: **8**
Checklist:
- [ ] Implementar conjunto completo de lifestyle features
- [ ] Versionar features por janela temporal
- [ ] Expor para inferencia

---

## EPICO 6 - ML funcional

Objetivo: passar de inferencia baseline para modelo versionado real.

### Card: Carregamento de modelo real
Story Points: **8**
Checklist:
- [ ] Artefato de modelo local versionado
- [ ] `POST /predict` com inferencia real (hoje com resposta fixa)
- [ ] Validacao de payload e fallback clinico-only

### Card: Integracao risk -> validator -> recommendation
Story Points: **8**
Checklist:
- [ ] Encadear chamadas reais entre servicos
- [ ] Persistir saida dual (`PredicaoRisco[]` + `HealthScore`)
- [ ] Auditoria da validacao clinica

---

## EPICO 7 - Frontend E2E

Objetivo: entregar fluxo navegavel com dados reais da API.

### Card: Conectar paginas de feature na API
Story Points: **8**
Checklist:
- [ ] Dashboard com dados reais
- [ ] Tela de risco com retorno de engine
- [ ] Tela de recomendacoes com priorizacao

### Card: Fluxo de wearables e agendamento
Story Points: **8**
Checklist:
- [ ] Conectar/disconectar dispositivos
- [ ] Exibir estado de sincronizacao
- [ ] Agendar a partir de recomendacao

---

## EPICO 8 - Hardening e prontidao cloud

Objetivo: preparar migracao segura do MVP local para cloud.

### Card: Observabilidade e resiliencia
Story Points: **5**
Checklist:
- [ ] Correlation ID fim-a-fim
- [ ] Timeouts/retries/circuit breaker
- [ ] Metricas por endpoint/job

### Card: Preparacao de deploy
Story Points: **5**
Checklist:
- [ ] Parametrizacao por ambiente
- [ ] Mapa `.env` -> secrets gerenciados
- [ ] Checklist de rollout

---

## Totais (visao atual)

- Done: **54 SP**
- In progress: **16 SP**
- Backlog mapeado: **50 SP**