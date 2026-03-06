# 🏥 Diagrama de Caso de Uso Completo — CarePredict

Sistema de medicina preventiva com Machine Learning proposto para a **Care Plus**.

---

# 👥 Atores do Sistema

### Paciente

Interage com a plataforma para:

* visualizar recomendações de saúde
* agendar consultas
* agendar exames
* acompanhar histórico clínico

---

### Médico

* consulta histórico do paciente
* recebe análises preditivas
* realiza consulta
* atualiza dados clínicos

---

### Administrador

* gerencia usuários
* monitora modelos de ML
* supervisiona dados

---

### Sistema de Agenda Externo

* fornece disponibilidade de médicos
* permite agendamento de exames e consultas

---

# 📊 Diagrama UML de Caso de Uso — CarePredict

```mermaid
flowchart TB

%% Atores
Paciente((Paciente))
Medico((Médico))
Admin((Administrador))
Agenda((Sistema de Agenda))

%% Sistema
subgraph CarePredict

UC1[Visualizar recomendações preventivas]
UC2[Agendar consulta]
UC3[Agendar exames]
UC4[Visualizar histórico de saúde]

UC5[Consultar histórico do paciente]
UC6[Receber análise preditiva]
UC7[Realizar consulta]

UC8[Analisar dados clínicos]
UC9[Prever riscos de doenças]
UC10[Gerar recomendações preventivas]

UC11[Atualizar dados clínicos]

UC12[Gerenciar usuários]
UC13[Monitorar desempenho do modelo]

UC14[Consultar disponibilidade de agenda]

end

%% Interações Paciente
Paciente --> UC1
Paciente --> UC2
Paciente --> UC3
Paciente --> UC4

%% Interações Médico
Medico --> UC5
Medico --> UC6
Medico --> UC7

%% Interações Admin
Admin --> UC12
Admin --> UC13

%% Sistema externo
Agenda --> UC14

%% Relações internas
UC1 --> UC10
UC10 --> UC9
UC9 --> UC8

UC2 --> UC14
UC3 --> UC14

UC7 --> UC11
UC5 --> UC4
```

---

# 🔄 Fluxo Principal do Sistema

### Fluxo preventivo

```
Paciente entra no sistema
        ↓
CarePredict analisa dados clínicos
        ↓
Modelo de ML calcula risco de doenças
        ↓
Sistema gera recomendações preventivas
        ↓
Paciente agenda exame ou consulta
```

---

# 🩺 Fluxo de Consulta Médica

```
Paciente agenda consulta
        ↓
Médico acessa histórico consolidado
        ↓
CarePredict mostra análise preditiva
        ↓
Consulta é realizada
        ↓
Dados clínicos são atualizados
```

---

# ⚙️ Fluxo de Machine Learning

```
Dados clínicos do paciente
        ↓
Análise de dados
        ↓
Modelo preditivo
        ↓
Cálculo de risco de doenças
        ↓
Recomendação de exames e consultas
```
