# CarePredict - Sistema de Medicina Preventiva com Machine Learning

Projeto acadêmico para a Care Plus com foco em medicina preventiva orientada por dados.

O CarePredict analisa dados clínicos e epidemiológicos para estimar riscos de saúde, gerar recomendações preventivas e apoiar o agendamento de consultas e exames.

## Sumário

- [Visão do Projeto](#visao-do-projeto)
- [Problema e Oportunidade](#problema-e-oportunidade)
- [Pesquisa de Mercado](#pesquisa-de-mercado)
- [Objetivos](#objetivos)
- [Escopo Funcional (MVP)](#escopo-funcional-mvp)
- [Arquitetura da Solução](#arquitetura-da-solucao)
- [Arquitetura MVP Local (Docker)](#arquitetura-mvp-local-docker)
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
- modelos de Machine Learning para risco de doenças
- motor de recomendação preventiva

Resultado esperado:

- mais diagnóstico precoce
- melhor acompanhamento clínico
- redução de custos assistenciais evitáveis

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
- permitir integração com agenda externa para agendamentos

## Escopo Funcional (MVP)

### Paciente

- dashboard de saúde
- visualização de recomendações preventivas
- agendamento de consultas e exames
- acompanhamento de histórico

### Médico

- dashboard clínico do paciente
- acesso a análise preditiva de risco
- suporte à anamnese orientada por dados
- registro de diagnóstico

### Plataforma

- ingestão de dados clínicos e dados públicos
- pipeline de anonimização (LGPD)
- processamento, feature engineering e feature store
- inferência de risco e recommendation engine
- monitoramento de aplicação e modelos

## Arquitetura da Solução

A arquitetura cloud foi desenhada em Azure, com separação de camadas para aplicação, ingestão, armazenamento, processamento, ML e observabilidade.

Principais componentes:

- Azure App Service (portal/dashboard)
- Azure API Management + Backend API
- Azure Entra ID (autenticação)
- Azure Key Vault (segredos e chaves)
- Event Hub + Data Factory (ingestão)
- Data Lake + Azure SQL Database (armazenamento)
- Databricks + Synapse (processamento analítico)
- Azure Machine Learning (treino, registro e inferência)
- Azure Monitor + Application Insights (observabilidade)

Documento completo: [ARQUITERUA CLOUD.md](ARQUITERUA%20CLOUD.md)

## Arquitetura MVP Local (Docker)

Para acelerar validacoes tecnicas e funcionais, o projeto tambem possui uma arquitetura de MVP local baseada em Docker Compose.

Essa versao contempla:

- frontend Angular, backend API e servicos de recomendacao
- inferencia de ML local
- persistencia com Postgres, MinIO e Redis
- fluxo ponta a ponta sem dependencia inicial de cloud publica

Documento completo: [ARQUITETURA CLOUD - MVP LOCAL DOCKER.md](ARQUITETURA%20CLOUD%20-%20MVP%20LOCAL%20DOCKER.md)

## Arquitetura de Dados

A arquitetura de dados contempla:

- fontes clínicas (EHR, laboratório, hospital, sinistro, wearables, app)
- fontes públicas (DATASUS, IBGE, ANS)
- camada de privacidade com anonimização/pseudonimização
- Data Lake por zonas (PHI, Raw, Processed, Curated)
- camada analítica (warehouse/BI)
- feature engineering + feature store
- ciclo de ML com treino, validação, registry e serving
- feedback clínico para melhoria contínua

Documento completo: [ARQUITETURA DE DADOS.md](ARQUITETURA%20DE%20DADOS.md)

## Fluxos do Sistema

Fluxos principais modelados:

- análise de risco e geração de recomendações
- agendamento de consulta
- agendamento de exames
- consulta médica com apoio da IA
- treinamento e atualização de modelo

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

Documento completo: [esboço de epicos.md](esbo%C3%A7o%20de%20epicos.md)

## Tecnologias Propostas

Baseado na proposta técnica do projeto:

- Backend: Python + FastAPI
- ML: Scikit-learn, TensorFlow ou PyTorch
- Dados: PostgreSQL (camada transacional) + Data Lake
- Processamento: Pandas e pipelines de dados
- Frontend: Angular
- Cloud (arquitetura alvo): Microsoft Azure

Documento de referência: [PROPOSTA.md](PROPOSTA.md)

## Segurança, Privacidade e Compliance

- proteção de dados sensíveis com segregação por zonas de dados
- anonimização, pseudonimização e mascaramento antes da análise
- gestão de segredos com Key Vault
- controle de acesso com Entra ID e RBAC
- direcionamento de uso como apoio à decisão médica, não diagnóstico automatizado

## Estrutura do Repositório

Este repositório, neste estágio, concentra documentação de produto e arquitetura:

- [README.md](README.md)
- [PROPOSTA.md](PROPOSTA.md)
- [PESQUISA DE MERCADO.md](PESQUISA%20DE%20MERCADO.md)
- [ARQUITERUA CLOUD.md](ARQUITERUA%20CLOUD.md)
- [ARQUITETURA CLOUD - MVP LOCAL DOCKER.md](ARQUITETURA%20CLOUD%20-%20MVP%20LOCAL%20DOCKER.md)
- [ARQUITETURA DE DADOS.md](ARQUITETURA%20DE%20DADOS.md)
- [DIAGRAMA DE CASO DE USO.md](DIAGRAMA%20DE%20CASO%20DE%20USO.md)
- [DIAGRAMA DE CLASSE.md](DIAGRAMA%20DE%20CLASSE.md)
- [DIAGRAMA DE SEQUENCIA.md](DIAGRAMA%20DE%20SEQUENCIA.md)
- [esboço de epicos.md](esbo%C3%A7o%20de%20epicos.md)

## Status do Projeto

Status atual: Planejamento e definição de arquitetura.

Próximos passos sugeridos:

1. criar estrutura inicial do backend
2. provisionar infraestrutura mínima em cloud
3. implementar pipeline inicial de ingestão e anonimização
4. disponibilizar primeira versão de API de recomendação

## Equipe

- Gabriel Drebtchinsky Q. de Carvalho (RM566729)
- Ana Carolina Pereira Lopez (RM568401)
- Danilo Roberto dos Santos (RM566966)
- José Ribeiro dos Santos Neto (RM567692)
- Henrique Fessel Trench (RM567513)

## Licenca

Distribuído sob a licença definida em [LICENSE](LICENSE).
