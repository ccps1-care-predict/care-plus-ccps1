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

---

# Quebra operacional para Planner (copiar e colar)

Formato sugerido por card:

`[Bucket] Titulo curto - SP`

`Criterio de aceite: ...`

## EPICO 4 - Backend de negocio

`[In Progress] API: criar contexto patients (estrutura + modulo) - 3 SP`

`Criterio de aceite: modulo patients registrado em main, rotas versionadas ativas, teste de smoke do contexto passando.`

`[In Progress] API: criar contexto recommendations (contratos + endpoint base) - 2 SP`

`Criterio de aceite: endpoint do contexto responde 200/422 conforme schema e dependencia injetada.`

`[In Progress] API: criar contexto scheduling (contratos + endpoint base) - 2 SP`

`Criterio de aceite: endpoint do contexto responde 200/422 conforme schema e dependencia injetada.`

`[In Progress] API: contratos internos entre API e engines (DTO + adapter HTTP) - 1 SP`

`Criterio de aceite: chamadas tipadas para risk/validator/recommendation com tratamento de timeout e erro 5xx.`

`[Backlog] Wearable connector: trocar InMemory por repositorio Postgres - 3 SP`

`Criterio de aceite: connect/list/revoke persistem em banco e sobrevivem a restart do servico.`

`[Backlog] Scheduling service: trocar InMemory por repositorio Postgres - 3 SP`

`Criterio de aceite: slots/booking/cancel persistem em banco com lock de concorrencia basico.`

`[Backlog] API: migrations wearables + recommendations - 1 SP`

`Criterio de aceite: alembic upgrade head cria tabelas e indices previstos sem erro.`

`[Backlog] Idempotencia de sync/agendamento - 1 SP`

`Criterio de aceite: mesma requisicao repetida nao duplica registros e retorna status consistente.`

## EPICO 5 - Dados e ETL funcional

`[Backlog] ETL: persist raw no MinIO - 2 SP`

`Criterio de aceite: arquivo bruto por run gravado em raw com naming padrao.`

`[Backlog] ETL: persist processed no MinIO - 2 SP`

`Criterio de aceite: dataset validado/transformado gravado em processed por particao de data.`

`[Backlog] ETL: persist curated no MinIO/Postgres - 2 SP`

`Criterio de aceite: output final disponivel para consumo por inferencia e consulta de auditoria.`

`[Backlog] ETL: metadata por run - 1 SP`

`Criterio de aceite: tabela/arquivo de metadados com status, contagem de linhas e duracao.`

`[Backlog] ETL: retries + falha por etapa - 1 SP`

`Criterio de aceite: retries configuraveis e falha marcada por step sem interromper rastreabilidade.`

`[Backlog] Lifestyle features: lote minimo operacional - 3 SP`

`Criterio de aceite: features principais (passos, sono, FC, estresse) calculadas para janela de 7 dias.`

`[Backlog] Lifestyle features: versionamento temporal - 3 SP`

`Criterio de aceite: features armazenadas com versao e janela (inicio/fim).`

`[Backlog] Lifestyle features: exposicao para inferencia - 2 SP`

`Criterio de aceite: endpoint/adapter entrega vetor de features esperado pelo ML.`

## EPICO 6 - ML funcional

`[Backlog] ML: carregar artefato versionado local - 3 SP`

`Criterio de aceite: versao ativa do modelo consultavel e logada no predict.`

`[Backlog] ML: substituir resposta fixa por inferencia real - 3 SP`

`Criterio de aceite: POST /predict usa modelo carregado e retorna probabilidades calculadas.`

`[Backlog] ML: validacao de payload + fallback clinico-only - 2 SP`

`Criterio de aceite: payload invalido retorna 422 e ausencia de wearable ativa fallback controlado.`

`[Backlog] Orquestracao risk -> validator -> recommendation - 3 SP`

`Criterio de aceite: fluxo sequencial completo com trace id e tratamento de erro entre servicos.`

`[Backlog] Persistencia de saida dual (predicoes + health score) - 3 SP`

`Criterio de aceite: resultado salvo com model_version e timestamp de execucao.`

`[Backlog] Auditoria da validacao clinica - 2 SP`

`Criterio de aceite: predicoes rejeitadas e motivos ficam registrados para rastreio.`

## EPICO 7 - Frontend E2E

`[Backlog] Dashboard: integrar dados reais da API - 3 SP`

`Criterio de aceite: dashboard consome endpoint real com estado loading/erro/sucesso.`

`[Backlog] Risco: tela conectada ao retorno da engine - 2 SP`

`Criterio de aceite: tela apresenta predicoes e health score de chamada real.`

`[Backlog] Recomendacoes: priorizacao por risco - 3 SP`

`Criterio de aceite: lista ordenada por prioridade clinica com fonte de recomendacao.`

`[Backlog] Wearables: conectar/desconectar dispositivo - 3 SP`

`Criterio de aceite: fluxo de vinculo e revogacao funcional com refletor visual de status.`

`[Backlog] Wearables: status de sincronizacao - 2 SP`

`Criterio de aceite: ultimo sync, situacao e erros exibidos para o usuario.`

`[Backlog] Scheduling: agendar via recomendacao - 3 SP`

`Criterio de aceite: recomendacao acionavel cria agendamento e confirma no frontend.`

## EPICO 8 - Hardening e prontidao cloud

`[Backlog] Correlation ID fim-a-fim - 2 SP`

`Criterio de aceite: request id propagado entre API, engines e workers nos logs.`

`[Backlog] Timeouts/retries/circuit breaker entre servicos - 2 SP`

`Criterio de aceite: politicas configuradas por cliente HTTP com fallback previsivel.`

`[Backlog] Metricas por endpoint/job - 1 SP`

`Criterio de aceite: latencia, erro e throughput exportados por servico e worker.`

`[Backlog] Parametrizacao por ambiente - 2 SP`

`Criterio de aceite: desenvolvimento/staging/producao com configs separadas e sem hardcode.`

`[Backlog] Mapa .env -> secrets gerenciados - 2 SP`

`Criterio de aceite: inventario de segredos com destino (Key Vault ou equivalente) definido.`

`[Backlog] Checklist de rollout - 1 SP`

`Criterio de aceite: roteiro de deploy com pre-check, smoke test e rollback documentado.`
