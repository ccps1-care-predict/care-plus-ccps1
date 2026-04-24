# Plano de Execucao para Agente Copilot - SPA Dashboards

Data: 22/04/2026
Escopo: implementar dashboards no SPA com rota unica e controle por perfil no token.
Fora de escopo: wearables.

## 1) Objetivo do agente

Implementar no SPA:
- autenticacao com token
- sessao com perfil
- rotas unicas
- dashboard unico com renderizacao por perfil medico/paciente
- integracao com endpoints existentes da API

Premissas obrigatorias:
- API unica e SPA unico
- sem botoes de troca de perfil em fluxo real
- diferenca de experiencia definida apenas por perfil no token
- considerar perfil de negocio: medico e paciente

## 2) Entradas que o agente deve considerar

- Diretriz funcional: [PLANO_DASHBOARDS_SPA_ALTERNATIVAS.md](PLANO_DASHBOARDS_SPA_ALTERNATIVAS.md)
- SPA atual: [modules/spa/src/app/app.routes.ts](modules/spa/src/app/app.routes.ts)
- Layout shell: [modules/spa/src/app/core/layout/app-shell.component.ts](modules/spa/src/app/core/layout/app-shell.component.ts)

Endpoints base da API:
- POST /api/v1/auth/token
- GET /api/v1/patients
- GET /api/v1/patients/{patient_id}
- GET /api/v1/recommendations
- GET /api/v1/scheduling/appointments
- GET /api/v1/scheduling/slots

## 3) Plano de execucao por fase (pronto para agente)

### Fase 1 - Fundacao de autenticacao

Tarefas:
- criar AuthService para login e persistencia de token
- criar SessionStore para claims essenciais (sub, email, profile)
- criar HttpInterceptor para Bearer token
- criar Guard de autenticacao
- criar Guard de perfil

Criterios de aceite:
- rota protegida redireciona para login sem token
- token e enviado em todas as chamadas HTTP
- perfil e disponibilizado para a UI via SessionStore

### Fase 2 - Roteamento unico

Tarefas:
- ajustar [modules/spa/src/app/app.routes.ts](modules/spa/src/app/app.routes.ts) para manter rotas unicas
- adicionar rotas /login, /dashboard, /recommendations, /scheduling, /patients, /profile
- aplicar guard por perfil apenas quando necessario (ex.: /patients)

Criterios de aceite:
- nao existem rotas duplicadas por perfil
- /dashboard atende medico e paciente com comportamento condicional

### Fase 3 - Dashboard unico por perfil

Tarefas:
- criar DashboardFacadeService
- definir DashboardViewModel unico
- montar secoes comuns (cards de status, agenda, recomendacoes)
- montar secoes condicionais por perfil
- implementar estados loading, vazio, erro

Criterios de aceite:
- mesmo componente de dashboard para os dois perfis
- blocos corretos exibidos conforme perfil no token

### Fase 4 - Integracao com API

Tarefas:
- criar services de pacientes, recomendacoes e agendamento
- mapear responses da API para DTOs internos do SPA
- implementar fallback de perfil enquanto backend tiver nomenclatura desatualizada

Criterios de aceite:
- dashboard carrega dados reais da API local
- erros de API possuem tratamento visual consistente

### Fase 5 - Qualidade

Tarefas:
- testes de guard
- testes de facade
- testes de componente do dashboard por perfil
- validacao de fluxo login -> dashboard -> recommendations -> scheduling

Criterios de aceite:
- cobertura basica dos fluxos criticos
- sem regressao de navegacao

## 4) Prompt pronto para usar com o agente Copilot

Use este prompt no agente:

"Implemente no SPA Angular deste repositorio o plano de dashboards com rota unica e controle por perfil no token, sem wearables. Regras obrigatorias: API unica e SPA unico; sem troca manual de perfil na UI; diferenciacao por claims do token; considerar perfis medico e paciente. Siga por fases: (1) autenticacao + sessao + interceptor + guards, (2) rotas unicas, (3) dashboard unico com blocos condicionais por perfil, (4) integracao com endpoints atuais da API, (5) testes basicos. Gere mudancas incrementais, valide build/testes ao fim de cada fase e registre no final o que foi implementado e o que ficou pendente." 

## 5) Lista de checkpoints para aprovacao humana

- [ ] Login funcionando com token
- [ ] Sessao expondo perfil
- [ ] Rotas unicas aplicadas
- [ ] Dashboard unico funcionando para paciente
- [ ] Dashboard unico funcionando para medico
- [ ] /patients restrito por perfil
- [ ] Integracao API validada localmente
- [ ] Testes minimos executados

## 6) Definicao de pronto (DoD)

A entrega sera considerada pronta quando:
- nao houver navegacao de alternancia de perfil no fluxo real
- houver apenas um conjunto de rotas no frontend
- o comportamento por perfil depender somente do token
- dashboards de medico e paciente funcionarem com dados reais da API
- wearables nao apareca em nenhuma tela desta entrega

## 7) Observacoes para a proxima iteracao

- evoluir backend para padronizar definitivamente os perfis medico/paciente
- avaliar endpoint consolidado de dashboard para reduzir chamadas no frontend
- revisar telemetria de uso dos blocos do dashboard
