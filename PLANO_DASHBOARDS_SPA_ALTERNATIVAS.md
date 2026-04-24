# Plano de Implementacao do SPA - Dashboards (Diretrizes Fechadas)

Data: 22/04/2026
Escopo desta rodada: dashboards apenas (sem wearables).

## Decisoes ja aprovadas

- API unica e SPA unico.
- Sem navegacao por botoes de troca de perfil no frontend.
- A diferenciacao de acesso e experiencia sera por perfil no token de autenticacao.
- Considerar perfis de negocio como medico e paciente.
- Ignorar temporariamente nomenclaturas desatualizadas no backend (admin/user).

---

## Regras de arquitetura para esta entrega

1. Roteamento unico no SPA
- Nao existirao rotas duplicadas por perfil.
- As mesmas rotas serao usadas por medico e paciente.
- O conteudo de cada pagina muda por controle de perfil vindo do token.

2. Controle de acesso por token
- O token sera a fonte de verdade do perfil.
- O app deve ler o claim de perfil no login e manter em sessao.
- Guards e facades devem usar o perfil para liberar ou ocultar blocos de tela.

3. Sem dependencia de botao de perfil
- Qualquer botao de alternancia de perfil observado no prototipo e apenas demonstrativo.
- No produto real, a experiencia e definida apos autenticacao.

---

## Mapa de rotas unicas do frontend

Rotas base:
- /
- /dashboard
- /recommendations
- /scheduling
- /patients
- /profile
- /login

Comportamento por perfil:
- /dashboard
  - paciente: foco em proxima acao preventiva, agenda pessoal e recomendacoes.
  - medico: foco em fila de pacientes, prioridades clinicas e agenda consolidada.
- /recommendations
  - paciente: recomendacoes proprias.
  - medico: recomendacoes dos pacientes sob acompanhamento.
- /scheduling
  - paciente: agendar e acompanhar seus compromissos.
  - medico: visualizar agenda consolidada e status.
- /patients
  - paciente: sem acesso (ou redirecionamento para /dashboard).
  - medico: acesso completo a lista e detalhe de pacientes.

---

## Estrategia de implementacao recomendada

### Fase 1 - Fundacao de autenticacao e contexto

- [ ] Criar AuthService para login e armazenamento de token.
- [ ] Criar SessionStore com claims essenciais (sub, email, profile).
- [ ] Criar AppGuard para bloquear rotas sem autenticacao.
- [ ] Criar ProfileGuard para regras por perfil nas rotas criticas.
- [ ] Implementar interceptor para Authorization Bearer em todas as chamadas.

### Fase 2 - Dashboard unico com renderizacao por perfil

- [ ] Implementar DashboardFacadeService.
- [ ] Criar DashboardViewModel unificado com secoes condicionais.
- [ ] Montar cards comuns (status, agenda, recomendacoes).
- [ ] Adicionar blocos exclusivos por perfil sem duplicar rota.
- [ ] Implementar estados loading, vazio e erro.

### Fase 3 - Integracao com API atual

Endpoints-base desta fase:
- POST /api/v1/auth/token
- GET /api/v1/patients
- GET /api/v1/patients/{patient_id}
- GET /api/v1/recommendations
- GET /api/v1/scheduling/appointments
- GET /api/v1/scheduling/slots

- [ ] Adaptar mapeadores frontend para tratar perfil medico/paciente.
- [ ] Tratar fallback enquanto backend estiver com nomenclatura admin/user.
- [ ] Garantir que o frontend opere pela regra de negocio definida neste documento.

### Fase 4 - Qualidade e validacao

- [ ] Testes de componente para dashboard por perfil.
- [ ] Testes de guard (rota permitida/negada por perfil).
- [ ] Teste de fluxo login -> dashboard -> recomendacoes -> agendamento.
- [ ] Validacao de telemetria basica de uso dos blocos de dashboard.

---

## Sugestoes objetivas focadas em dashboards

- [ ] Priorizar primeiro o dashboard do paciente para validar fluxo de ponta a ponta.
- [ ] Reutilizar o mesmo layout base para medico e paciente com blocos condicionais.
- [ ] Evitar logica de negocio pesada no componente; concentrar em facade/mappers.
- [ ] Definir contrato interno de DashboardViewModel antes de construir cards.
- [ ] Usar feature flags simples para liberar blocos por perfil durante evolucao.
- [ ] Incluir pagina de erro de permissao para tentativas de acesso fora do perfil.

---

## Riscos conhecidos e mitigacao

Risco 1: divergencia entre perfis de negocio e nomenclatura atual da API.
- Mitigacao: camada de normalizacao de perfil no frontend (adapter de claims).

Risco 2: tentativa de duplicar paginas por perfil durante a implementacao.
- Mitigacao: regra de PR com validacao de rota unica por feature.

Risco 3: acoplamento excessivo entre UI e contrato atual da API.
- Mitigacao: criar DTOs internos e mappers no SPA.

---

## Criterios de aceite desta diretriz

- [ ] Nao existe botao de troca de perfil em fluxo produtivo.
- [ ] Todas as rotas de dashboard sao unicas (sem duplicacao por perfil).
- [ ] Diferenciacao de experiencia ocorre exclusivamente por perfil no token.
- [ ] Dashboard do paciente e do medico funcionam na mesma rota /dashboard.
- [ ] Escopo sem wearables nesta entrega.

---

## Confirmacao e observacoes

Diretriz validada para seguir implementacao:
- [ ] Confirmo manter rota unica + controle por token

Observacoes adicionais:
- 
- 
- 
