# CarePredict - Sistema de Medicina Preventiva com Machine Learning

Projeto acadêmico para a Care Plus com foco em medicina preventiva orientada por dados.

O CarePredict analisa dados clínicos e epidemiológicos para estimar riscos de saúde, gerar recomendações preventivas e apoiar o agendamento de consultas e exames.

## Sumário

- [Visão do Projeto](#visao-do-projeto)
- [Problema e Oportunidade](#problema-e-oportunidade)
- [Pesquisa de Mercado](#pesquisa-de-mercado)
- [Objetivos](#objetivos)
- [Escopo Funcional (MVP)](#escopo-funcional-mvp)
- [Integração com Dispositivos Wearables](#integracao-com-dispositivos-wearables)
- [Arquitetura da Solução](#arquitetura-da-solucao)
- [Arquitetura MVP Local (Docker)](#arquitetura-mvp-local-docker)
- [Execução Local](#execucao-local)
- [Arquitetura de Dados](#arquitetura-de-dados)
- [Fluxos do Sistema](#fluxos-do-sistema)
- [Modelo de Domínio (UML)](#modelo-de-dominio-uml)
- [Planejamento por Épicos e Sprints](#planejamento-por-epicos-e-sprints)
- [Tecnologias Propostas](#tecnologias-propostas)
- [Segurança, Privacidade e Compliance](#seguranca-privacidade-e-compliance)
- [Estrutura do Repositório](#estrutura-do-repositorio)
- [Status do Projeto](#status-do-projeto)
- [Equipe](#equipe)
- [Licença](#licenca)

## Visao do Projeto

O CarePredict foi concebido para atuar de forma preventiva na jornada de saúde dos segurados, combinando:

- dados clínicos individuais
- dados populacionais públicos (DATASUS, IBGE e ANS)
- **dados contínuos de dispositivos wearables** (Apple Watch, Fitbit, Google Fit, Garmin)
- modelos de Machine Learning para risco de doenças
- motor de recomendação preventiva

Resultado esperado:

- mais diagnóstico precoce com visão 360° do estilo de vida
- melhor acompanhamento clínico com dados contínuos
- redução de custos assistenciais evitáveis
- maior engajamento do paciente na prevenção

## Problema e Oportunidade

No cenário atual, muitos pacientes procuram atendimento apenas quando a condição de saúde já está avançada. Isso aumenta o custo assistencial e reduz a efetividade da prevenção.

O projeto endereça esse problema com uma abordagem de apoio à decisão médica e recomendação preventiva, evitando posicionamento regulatório de "diagnóstico automatizado".

## Pesquisa de Mercado

A saúde digital é uma área em forte crescimento, impulsionada por fatores como:

- Envelhecimento da população e aumento de doenças crônicas
- Necessidade de redução de custos hospitalares
- Expansão da telemedicina
- Adoção de monitoramento remoto de pacientes

Dados de mercado:

- O mercado global de Digital Health foi estimado em **US$ 288 bilhões em 2022** com expectativa de alcançar **mais de US$ 650 bilhões até 2030** (crescimento de 18% ao ano)
- O mercado de monitoramento remoto deve atingir **US$ 175 bilhões até 2027** (crescimento de 26% ao ano)
- No Brasil, mais de **50 milhões de brasileiros** possuem planos de saúde privados
- Doenças crônicas não transmissíveis (diabetes, hipertensão, doenças cardiovasculares) exigem acompanhamento contínuo e podem ser prevenidas com diagnóstico precoce

Documento completo: [PESQUISA DE MERCADO.md](PESQUISA%20DE%20MERCADO.md)

## Objetivos

- prever riscos de saúde com base em histórico clínico e contexto populacional
- recomendar exames preventivos e consultas com especialistas
- apoiar o médico com visão consolidada e preditiva do paciente
- permitir integração com agenda externa para agendamentos e atualização de conclusão

## Escopo Funcional (MVP)

### Paciente

- dashboard de saúde
- visualização de recomendações preventivas
- agendamento de consultas e exames
- acompanhamento de histórico
- **visualização de dados wearables** (atividade, sono, frequência cardíaca)
- **insights sobre estilo de vida** baseados em comparação com pares

### Médico

- dashboard clínico do paciente
- acesso a análise preditiva de risco
- **visualização de padrões de estilo de vida** (energia do paciente)
- suporte à anamnese orientada por dados
- registro de diagnóstico
- **recomendações de mudanças comportamentais** baseadas em dados wearables

### Plataforma

- ingestão de dados clínicos, dados públicos e **dados de wearables (contínuos)**
- pipeline de anonimização (LGPD) com suporte a dados de saúde sensíveis
- processamento, feature engineering com **lifestyle features** e feature store
- inferência de risco com **modelos enriquecidos por dados wearable**
- recommendation engine com integração de padrões comportamentais
- monitoramento de aplicação, modelos e **qualidade de dados wearable**

## Integração com Dispositivos Wearables

O CarePredict integra dados contínuos de dispositivos wearables para enriquecer os modelos preditivos com informações de **estilo de vida real** do paciente.

### 📱 Plataformas Suportadas

**Fase 1 (MVP):**
- 🍎 **Apple Health** — Apple Watch, iPhone
- 🔵 **Google Fit** — Android Wear, Smartphones
- 💪 **Fitbit** — Fitbit/Fitbit Sense

**Fase 2 (Expansão):**
- 🟣 **Garmin Connect** — relógios Garmin
- 💍 **Oura Ring** — análise biométrica avançada

### 📊 Dados Coletados

| Categoria | Métricas | Importância Clínica |
|-----------|----------|-------------------|
| **Atividade Física** | Passos, exercício, duração, intensidade | Prevenção de obesidade, saúde cardiovascular |
| **Frequência Cardíaca** | FC repouso, FC máxima, variabilidade | Indicador de estresse crônico e saúde cardíaca |
| **Sono** | Duração, qualidade (deep/REM), coerência | Metabolismo, imunidade, saúde mental |
| **Estresse** | Nível de estresse, tempo de recuperação | Prevenção de burnout e doenças psicossomáticas |

### 💡 Vantagem Competitiva

- ✅ **Visão 360°** — Combina dados clínicos com comportamento real
- ✅ **Precisão aumentada** — Modelos 15-25% mais precisos com wearables
- ✅ **Engajamento do paciente** — Dados próprios aumentam aderência
- ✅ **Detecção precoce** — Padrões comportamentais revelam riscos meses antes
- ✅ **LGPD Compliant** — OAuth 2.0, consentimento explícito, dados em Azure Key Vault

### 🔗 Fluxo de Integração

1. **Autenticação** — Paciente conecta dispositivo via OAuth
2. **Sincronização** — Dados coletados diariamente (batch) ou em tempo real (streaming)
3. **Processamento** — Normalização, validação, enriquecimento
4. **Feature Engineering** — Extração de lifestyle features
5. **Modelagem** — Modelos ML enriquecidos com dados comportamentais
6. **Recomendação** — Insights contextualizados com estilo de vida

Documento completo: [INTEGRACAO_WEARABLES.md](INTEGRACAO_WEARABLES.md)

## Arquitetura da Solução

A arquitetura cloud foi desenhada em Azure, com separação de camadas para aplicação, ingestão, armazenamento, processamento, ML e observabilidade.

Principais componentes:

- Azure App Service (portal/dashboard)
- Azure API Management + Backend API com **endpoints wearable**
- Azure Entra ID (autenticação) + **OAuth 2.0 para wearables**
- Azure Key Vault (**armazenamento seguro de tokens de wearables**)
- Event Hub + Data Factory (**ingestão de dados wearable em streaming e batch**)
- Data Lake + Azure SQL Database (armazenamento com **tabelas de wearables**)
- Databricks + Synapse (**processamento de atividade física, sono, frequência cardíaca, estresse**)
- Azure Machine Learning (**modelos preditivos enriquecidos com lifestyle features**)
- Azure Monitor + Application Insights (observabilidade)

Documento completo: [ARQUITERUA CLOUD.md](ARQUITERUA%20CLOUD.md)

## Arquitetura MVP Local (Docker)

Para acelerar validacoes tecnicas e funcionais, o projeto possui uma arquitetura local baseada em Docker Compose.

O estado atual executavel contempla:

- frontend Angular em `modules/spa`
- backend FastAPI em `modules/api`
- migrations Alembic executadas antes da API
- Postgres 16 como banco transacional
- seed de dados mockados opcional, acionado por profile

Os documentos de arquitetura cloud/local continuam servindo como direcao evolutiva para os servicos auxiliares de ML, wearables, data lake, cache e recomendacao.

Documento completo: [ARQUITETURA CLOUD - MVP LOCAL DOCKER.md](ARQUITETURA%20CLOUD%20-%20MVP%20LOCAL%20DOCKER.md)

## Execucao Local

O repositorio possui um [docker-compose.yml](docker-compose.yml) na raiz que inclui o compose da API em `modules/api/docker-compose.yml` e adiciona a SPA Angular.

### Pre-requisitos

- Docker 24+ instalado
- Docker Compose V2 habilitado (`docker compose version`)
- Portas livres no host: `4200`, `5432` e `8080`
- Para desenvolvimento sem Docker, Node/NPM para a SPA e Python 3.12 para a API

### Arquivos utilizados

- [docker-compose.yml](docker-compose.yml) — compose raiz; inclui API e SPA
- [modules/api/docker-compose.yml](modules/api/docker-compose.yml) — API, migrations, Postgres e seed opcional
- [modules/api/.env](modules/api/.env) — variaveis usadas pela API no Docker
- [.env.example](.env.example) — modelo historico de variaveis do projeto
- [ARQUITETURA CLOUD - MVP LOCAL DOCKER.md](ARQUITETURA%20CLOUD%20-%20MVP%20LOCAL%20DOCKER.md) — referência arquitetural do ambiente local

### Configuracao inicial

1. Confirme o arquivo de ambiente da API:

```bash
cat modules/api/.env
```

2. Ajuste os valores se necessario, principalmente:

- `DATABASE_URL`
- `REDIS_URL`, se usado por integrações futuras
- `SECRET_KEY`
- `ACCESS_TOKEN_EXPIRE_MINUTES`

### Subindo o ambiente

Para iniciar os serviços principais:

```bash
docker compose up --build
```

Para subir em modo detached:

```bash
docker compose up --build -d
```

Para executar tambem o seed de dados mockados, use o profile `mockdata`:

```bash
docker compose --profile mockdata up --build
```

O seed roda no servico `mockdata`, depois das migrations, e popula usuarios, medicos, pacientes, recomendacoes, slots e agendamentos de exemplo.

Credenciais criadas pelo seed:

- senha unica: `Demo@123456`
- medico A: `medico.demo@careplus.local`
- medico B: `medico.b@careplus.local`
- paciente A: `paciente.demo@careplus.local`
- paciente B: `paciente.risco@careplus.local`
- paciente C: `paciente.estavel@careplus.local`

### Parando o ambiente

```bash
docker compose down
```

Para remover também os volumes persistentes locais:

```bash
docker compose down -v
```

### Servicos previstos no MVP local

Servicos atuais do modo base (`docker compose up --build`):

| Serviço | Porta no host | Função |
|---|---:|---|
| frontend-angular | 4200 | Portal web Angular |
| api | 8080 | API principal FastAPI |
| migrations | - | Aplica migrations Alembic antes da API |
| db | 5432 | Banco Postgres |

Servico adicional no profile `mockdata`:

| Serviço | Porta no host | Função |
|---|---:|---|
| mockdata | - | Executa `python scripts/seed_mock_data.py` |

### Enderecos locais esperados

- Frontend: `http://localhost:4200`
- Backend API: `http://localhost:8080`
- Swagger/OpenAPI: `http://localhost:8080/docs`
- Health check: `http://localhost:8080/health`
- Postgres: `localhost:5432`

### Logs e diagnostico rapido

Ver logs agregados do ambiente:

```bash
docker compose logs -f
```

Ver logs de um serviço específico:

```bash
docker compose logs -f api
```

Listar status dos containers:

```bash
docker compose ps
```

### Persistencia local

Os seguintes volumes Docker são usados para manter dados entre reinicializações:

- `postgres_data`

### Observacao importante sobre execucao

O [docker-compose.yml](docker-compose.yml) define dois modos principais:

- modo base (sem `profile`): sobe frontend, migrations, API e Postgres
- modo com mock (`mockdata`): executa tambem a carga de dados mockados

Para validar rapidamente o ambiente local, prefira iniciar pelo modo base. Use `--profile mockdata` quando quiser popular uma base local com dados demonstrativos.

## Arquitetura de Dados

A arquitetura de dados contempla:

- **fontes clínicas** (EHR, laboratório, hospital, sinistro, app)
- **fontes de wearables** (Apple Health, Google Fit, Fitbit, Garmin, Oura)
  - Atividade física (passos, exercício, duração)
  - Frequência cardíaca (repouso, máxima, variabilidade)
  - Sono (duração, qualidade, coerência)
  - Estresse (nível, tempo de recuperação)
- fontes públicas (DATASUS, IBGE, ANS)
- camada de privacidade com anonimização/pseudonimização (LGPD compliant)
- Data Lake por zonas (PHI, Raw, Processed, Curated) com **dados wearables isolados**
- camada analítica (warehouse/BI) com **relatórios de estilo de vida**
- feature engineering com **lifestyle features** + feature store
- ciclo de ML com treino, validação, registry e serving com **modelos enriquecidos**
- feedback clínico para melhoria contínua

Documento completo: [ARQUITETURA DE DADOS.md](ARQUITETURA%20DE%20DADOS.md)

## Fluxos do Sistema

Fluxos principais modelados:

- análise de risco e geração de recomendações
- agendamento de consulta
- agendamento de exames
- consulta médica com apoio da IA
- treinamento e atualização de modelo

Regra de responsabilidade (agendamentos):

- A API principal registra e consulta agendamentos e resultados.
- A atualização de conclusão do agendamento (status `CONCLUDED` e resultado) é feita por serviço externo de agenda.

Documento completo: [DIAGRAMA DE SEQUENCIA.md](DIAGRAMA%20DE%20SEQUENCIA.md)

## Modelo de Domínio (UML)

Classes centrais:

- Usuario, Paciente, Medico
- PerfilClinico, Consulta, Exame, Agenda
- PredicaoRisco, HealthScore, Recomendacao
- ModeloML

Documento completo: [DIAGRAMA DE CLASSE.md](DIAGRAMA%20DE%20CLASSE.md)

## Planejamento por Épicos e Sprints

Épicos definidos:

1. Fundação da Plataforma
2. Ingestão de Dados
3. Processamento de Dados
4. Machine Learning
5. Motor de Recomendação
6. Aplicações
7. Observabilidade

Sprints planejadas com estimativas de Story Points:

- Sprint 1: ~18 SP
- Sprint 2: ~18 SP
- Sprint 3: ~21 SP
- Sprint 4: ~26 SP
- Sprint 5: ~18 SP
- Sprint 6: ~19 SP

Documento completo: [EPICOS.md](EPICOS.md)

## Tecnologias Propostas

Baseado na proposta técnica do projeto:

- **Backend:** Python + FastAPI
- **Wearables:** requests-oauthlib (OAuth 2.0), Pydantic (validação)
- **ML:** Scikit-learn, TensorFlow ou PyTorch
- **Dados:** PostgreSQL (camada transacional) + Data Lake
- **Processamento:** Pandas e pipelines de dados
- **Frontend:** Angular
- **Cloud (arquitetura alvo):** Microsoft Azure
- **Segurança:** Azure Key Vault, Azure Entra ID

Documento de referência: [PROPOSTA.md](PROPOSTA.md)

## Segurança, Privacidade e Compliance

- proteção de dados sensíveis com segregação por zonas de dados
- anonimização, pseudonimização e mascaramento antes da análise
- gestão de segredos com Key Vault (**incluindo tokens de wearables**)
- controle de acesso com Entra ID e RBAC
- **autenticação OAuth 2.0 com wearables** (sem armazenar credenciais)
- **conformidade LGPD** com direito ao esquecimento, consentimento explícito
- direcionamento de uso como apoio à decisão médica, não diagnóstico automatizado
- **criptografia AES-256** para dados de saúde em repouso
- **TLS 1.3** para dados em trânsito

## Estrutura do Repositório

Este repositorio combina documentacao de produto/arquitetura com implementacao local do MVP.

- [README.md](README.md)
- [PROPOSTA.md](PROPOSTA.md)
- [INTEGRACAO_WEARABLES.md](INTEGRACAO_WEARABLES.md) — Estratégia de integração com dispositivos wearables
- [PESQUISA DE MERCADO.md](PESQUISA%20DE%20MERCADO.md)
- [ARQUITERUA CLOUD.md](ARQUITERUA%20CLOUD.md)
- [ARQUITETURA CLOUD - MVP LOCAL DOCKER.md](ARQUITETURA%20CLOUD%20-%20MVP%20LOCAL%20DOCKER.md)
- [ARQUITETURA DE DADOS.md](ARQUITETURA%20DE%20DADOS.md)
- [DIAGRAMA DE CASO DE USO.md](DIAGRAMA%20DE%20CASO%20DE%20USO.md)
- [DIAGRAMA DE CLASSE.md](DIAGRAMA%20DE%20CLASSE.md)
- [DIAGRAMA DE SEQUENCIA.md](DIAGRAMA%20DE%20SEQUENCIA.md)
- [EPICOS.md](EPICOS.md)
- [CODEX.md](CODEX.md) — planos de execucao e status operacional das frentes recentes
- [docker-compose.yml](docker-compose.yml) — orquestracao local raiz
- [modules/api](modules/api) — API FastAPI, migrations, seed mock e testes
- [modules/spa](modules/spa) — SPA Angular
- [modules/services](modules/services) — baseline arquitetural dos servicos auxiliares
- [modules/ml](modules/ml) — baseline arquitetural de inferencia/ML
- [modules/data](modules/data) — baseline arquitetural de pipelines de dados

## Status do Projeto

Estado atual do MVP local:

- API FastAPI com contextos de usuarios, autenticacao, pacientes, recomendacoes e agendamentos.
- Persistencia em Postgres com migrations Alembic.
- SPA Angular consumindo a API via `/api/v1`.
- Interceptor de autenticacao na SPA com header Bearer e tratamento de `401`.
- Escopo de dados implementado para paciente: paciente acessa apenas os proprios dados.
- Escopo de dados implementado para medico: medico acessa pacientes associados por `appointments`, seus agendamentos e agendamentos sem medico.
- Seed mock opcional para cenarios com dois medicos, tres pacientes, recomendacoes e agendamentos.
- Testes unitarios da API em evolucao; em ambiente sandbox atual, alguns testes com `TestClient` podem travar, embora `ruff check`, `py_compile` e `npm run build` tenham sido usados nas ultimas validacoes.

Pendencias principais:

- Ampliar cobertura automatizada da SPA conforme plano em [CODEX.md](CODEX.md).
- Reexecutar suites de API com `TestClient` em ambiente local sem bloqueio de sandbox.
- Evoluir os servicos auxiliares de ML, wearables, data e recomendacao hoje documentados como baseline arquitetural.

## Equipe

- Gabriel Drebtchinsky Q. de Carvalho (RM566729)
- Ana Carolina Pereira Lopez (RM568401)
- Danilo Roberto dos Santos (RM566966)
- José Ribeiro dos Santos Neto (RM567692)
- Henrique Fessel Trench (RM567513)

## Licenca

Distribuído sob a licença definida em [LICENSE](LICENSE).
