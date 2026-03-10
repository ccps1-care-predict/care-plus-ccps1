# 🏥 Diagrama de Caso de Uso — CarePredict (Versão Revisada)

Sistema de medicina preventiva baseado em dados clínicos e epidemiológicos proposto para a **CarePlus**.

O CarePredict utiliza:

- dados clínicos do paciente
- dados populacionais públicos
- modelos de Machine Learning

para prever riscos de saúde e recomendar exames preventivos.

---

# 👥 Atores do Sistema

## Paciente

Interage com a plataforma para:

- visualizar recomendações preventivas
- agendar consultas
- agendar exames
- acompanhar histórico de saúde

---

## Médico

Utiliza o sistema para apoio clínico.

Pode:

- acessar histórico do paciente
- visualizar análises preditivas
- realizar consultas
- registrar diagnósticos

---

## Administrador

Responsável por manter o sistema operacional.

Pode:

- gerenciar usuários
- monitorar desempenho dos modelos
- supervisionar qualidade dos dados

---

## Sistema de Agenda Externo

Sistema responsável por:

- fornecer horários disponíveis de médicos
- permitir agendamento de exames e consultas

---

## Sistemas de Dados Públicos de Saúde

Fontes externas utilizadas para enriquecer o modelo:

- DATASUS
- IBGE
- ANS

Esses dados ajudam a melhorar a análise de risco populacional.

---

# 📊 Diagrama UML de Caso de Uso — CarePredict

```mermaid
flowchart TB

%% ATORES

Paciente((Paciente))
Medico((Médico))
Admin((Administrador))
Agenda((Sistema de Agenda))
DadosPublicos((Dados Públicos de Saúde))

%% SISTEMA

subgraph CarePredict

UC1[Visualizar recomendações preventivas]
UC2[Agendar consulta]
UC3[Agendar exames]
UC4[Visualizar histórico de saúde]

UC5[Consultar histórico do paciente]
UC6[Receber análise preditiva]
UC7[Realizar consulta]

UC8[Analisar dados clínicos]
UC9[Integrar dados epidemiológicos]
UC10[Prever riscos de doenças]
UC11[Gerar recomendações preventivas]

UC12[Atualizar dados clínicos]

UC13[Gerenciar usuários]
UC14[Monitorar desempenho do modelo]

UC15[Consultar disponibilidade de agenda]
UC16[Ingerir dados públicos de saúde]

end

%% INTERAÇÕES PACIENTE

Paciente --> UC1
Paciente --> UC2
Paciente --> UC3
Paciente --> UC4

%% INTERAÇÕES MÉDICO

Medico --> UC5
Medico --> UC6
Medico --> UC7

%% INTERAÇÕES ADMIN

Admin --> UC13
Admin --> UC14

%% SISTEMAS EXTERNOS

Agenda --> UC15
DadosPublicos --> UC16

%% RELAÇÕES INTERNAS DO SISTEMA

UC1 --> UC11
UC11 --> UC10
UC10 --> UC8
UC10 --> UC9

UC2 --> UC15
UC3 --> UC15

UC7 --> UC12
UC5 --> UC4

UC16 --> UC9
````

---

# 🔄 Fluxo Preventivo Principal

Este é o fluxo central do CarePredict.

```
Paciente acessa o sistema
        ↓
CarePredict coleta dados clínicos
        ↓
Sistema integra dados epidemiológicos públicos
        ↓
Modelo de Machine Learning calcula risco de doenças
        ↓
Sistema gera recomendações preventivas
        ↓
Paciente agenda exames ou consultas
```

---

# 🩺 Fluxo de Consulta Médica

```
Paciente agenda consulta
        ↓
Médico acessa histórico clínico consolidado
        ↓
CarePredict apresenta análise preditiva
        ↓
Consulta é realizada
        ↓
Dados clínicos são atualizados no sistema
```

---

# ⚙️ Fluxo de Machine Learning

```
Dados clínicos do paciente
        ↓
Integração com dados populacionais
        ↓
Análise de dados
        ↓
Modelo preditivo
        ↓
Cálculo de risco de doenças
        ↓
Geração de recomendações preventivas
```

---

# 🧠 Objetivo do Sistema

O CarePredict busca **identificar riscos de saúde antes que se tornem problemas clínicos graves**, permitindo:

* diagnóstico precoce
* aumento de exames preventivos
* redução de internações evitáveis
* diminuição de custos assistenciais da operadora