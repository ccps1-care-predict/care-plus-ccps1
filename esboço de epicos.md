
ÉPICO 1 — Fundação da Plataforma

Card: Provisionar infraestrutura Azure

Story Points: 8

Checklist:

Criar Resource Group

Provisionar Azure App Service

Provisionar Azure SQL Database

Provisionar Azure Data Lake Storage

Provisionar Azure Machine Learning Workspace

Configurar Azure Key Vault

Configurar RBAC de acesso

---

Card: Criar estrutura inicial do backend

Story Points: 5

Checklist:

Criar repositório Git

Criar projeto backend (FastAPI ou Node)

Definir arquitetura de pastas

Implementar endpoint healthcheck

Configurar variáveis de ambiente

Integrar Key Vault

---

Card: Criar estrutura do Data Lake

Story Points: 5

Checklist:

Criar zonas Raw

Criar zona Processed

Criar zona Curated

Definir naming convention

Documentar estrutura de dados

---

ÉPICO 2 — Ingestão de Dados

Card: Ingestão de dados clínicos CarePlus

Story Points: 8

Checklist:

Mapear schema de dados clínicos

Criar pipeline ETL

Implementar ingestão batch

Salvar dados na camada Raw

Validar integridade de dados

---

Card: Ingestão de dados públicos de saúde

Story Points: 5

Checklist:

Integrar API DATASUS

Integrar datasets IBGE

Integrar dados ANS

Criar pipeline ETL público

Armazenar dados no Data Lake

---

Card: Pipeline de anonimização LGPD

Story Points: 5

Checklist:

Implementar pseudonimização

Implementar mascaramento de dados

Criar política de dados sensíveis

Validar conformidade LGPD

---

ÉPICO 3 — Processamento de Dados

Card: Pipeline de limpeza e transformação

Story Points: 8

Checklist:

Criar jobs Databricks

Limpeza de dados clínicos

Normalizar formatos

Validar qualidade de dados

Criar logs de pipeline

---

Card: Criação de features clínicas

Story Points: 8

Checklist:

Calcular IMC

Criar feature histórico de exames

Criar feature frequência médica

Criar feature fatores de risco

Criar dataset para ML

---

Card: Implementar Feature Store

Story Points: 5

Checklist:

Criar estrutura Feature Store

Versionar features

Integrar pipeline de features

Testar recuperação de features

---

ÉPICO 4 — Machine Learning

Card: Construção do dataset de treinamento

Story Points: 5

Checklist:

Selecionar features

Criar dataset treinamento

Dividir treino / teste

Balancear dataset

---

Card: Treinar modelos de risco de doenças

Story Points: 13

Checklist:

Treinar modelo diabetes

Treinar modelo hipertensão

Treinar modelo cardiovascular

Avaliar métricas (AUC / recall)

Ajustar hiperparâmetros

---

Card: Deploy de modelo em produção

Story Points: 8

Checklist:

Registrar modelo no Model Registry

Criar endpoint de inferência

Integrar modelo com API

Testar predição em produção

---

ÉPICO 5 — Motor de Recomendação

Card: Implementar Risk Scoring Engine

Story Points: 5

Checklist:

Criar cálculo de score de risco

Agregar predições por paciente

Criar Health Score

Persistir score no banco

---

Card: Implementar Recommendation Engine

Story Points: 8

Checklist:

Definir regras clínicas

Mapear exames recomendados

Criar lógica de priorização

Gerar recomendações por paciente

---

Card: Criar API de recomendações

Story Points: 5

Checklist:

Criar endpoint de recomendação

Integrar modelo ML

Criar endpoint consulta por paciente

Documentar API

---

ÉPICO 6 — Aplicações

Card: Desenvolver portal do paciente

Story Points: 8

Checklist:

Criar dashboard de saúde

Exibir recomendações preventivas

Exibir histórico de exames

Integrar com API

---

Card: Desenvolver dashboard médico

Story Points: 8

Checklist:

Exibir ficha clínica do paciente

Mostrar análise preditiva

Exibir histórico médico

Registrar diagnóstico

---

Card: Sistema de agendamento

Story Points: 5

Checklist:

Integrar agenda externa

Criar endpoint de agendamento

Confirmar consultas

Confirmar exames

---

ÉPICO 7 — Observabilidade

Card: Monitoramento da plataforma

Story Points: 3

Checklist:

Configurar Azure Monitor

Criar logs de aplicação

Criar alertas

---

Card: Monitoramento de modelos ML

Story Points: 5

Checklist:

Monitorar model drift

Monitorar acurácia

Criar dashboard de métricas

---

Card: Auditoria e governança de dados

Story Points: 5

Checklist:

Criar logs de decisões do modelo

Registrar versão do modelo

Criar trilha de auditoria

---

Planejamento de Sprints

Sprint 1

Infraestrutura e backend

Total ≈ 18 SP

---

Sprint 2

Ingestão de dados

Total ≈ 18 SP

---

Sprint 3

Processamento e features

Total ≈ 21 SP

---

Sprint 4

Machine Learning

Total ≈ 26 SP

---

Sprint 5

Recommendation Engine

Total ≈ 18 SP

---

Sprint 6

Produto e observabilidade

Total ≈ 19 SP

---

Exemplo de Card no Planner

Título:

Treinar modelos de risco de doenças

Descrição:

Desenvolver modelos de machine learning capazes de prever risco de doenças crônicas utilizando dados clínicos e epidemiológicos.

Story Points:

13

Checklist:

Treinar modelo diabetes

Treinar modelo hipertensão

Treinar modelo cardiovascular

Avaliar métricas

Ajustar hiperparâmetros.
