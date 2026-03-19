# 📊 Proposta de Projeto

## Sistema de Agendamento Preventivo Inteligente com Machine Learning

---

# 1️⃣ Problema

Planos de saúde enfrentam um problema recorrente:

* Muitos pacientes **procuram atendimento apenas quando a doença já está avançada**.
* Isso resulta em:

  * tratamentos mais complexos
  * maior custo hospitalar
  * maior risco ao paciente

Além disso:

* exames preventivos são **subutilizados**
* consultas preventivas são **mal distribuídas**
* dados clínicos existentes **não são explorados de forma preditiva**

Para empresas como a **Care Plus**, isso gera **aumento significativo nos custos assistenciais**.

---

# 2️⃣ Objetivo do Projeto

Desenvolver um **sistema inteligente de medicina preventiva** que utilize **Machine Learning** para:

* prever possíveis riscos de saúde
* recomendar exames preventivos
* sugerir consultas médicas antecipadamente
* automatizar o agendamento dessas consultas/exames

O sistema tem como objetivo:

* **melhorar a saúde do paciente**
* **reduzir custos com tratamentos tardios**
* **auxiliar médicos com uma anamnese baseada em dados**

---

# 3️⃣ Solução Proposta

A solução consiste em uma plataforma que analisa:

* histórico médico do paciente
* exames anteriores
* idade
* gênero
* histórico familiar
* padrões populacionais de doenças

Utilizando modelos de **Machine Learning**, o sistema poderá:

1️⃣ Identificar **riscos de doenças futuras**
2️⃣ Recomendar **check-ups preventivos**
3️⃣ Sugerir **consultas com especialistas**
4️⃣ Automatizar o **agendamento inteligente**

Isso cria um **ciclo de medicina preventiva orientado por dados**.

---

# 4️⃣ Fluxo da Solução

### Etapa 1 — Coleta de dados

Dados do paciente:

* histórico de consultas
* exames realizados
* diagnósticos anteriores
* idade
* sexo
* hábitos (se disponível)
* **dados contínuos de dispositivos wearables**

📱 **DIFERENCIAL: Integração com Wearables**

O sistema se conecta com dispositivos inteligentes (smartwatches, pulseiras de atividade) do paciente como:

* **Apple Watch** — frequência cardíaca, atividade física
* **Fitbit** — passos, sono, calorias queimadas
* **Google Fit** — atividades, exercícios
* **Garmin Connect** — dados de treino
* **Oura Ring** — biometria avançada

Isso captura **dados contínuos em tempo real** sobre o estilo de vida do paciente:

Dados coletados via wearables:
* Atividade física diária (passos, exercícios)
* Qualidade e duração do sono
* Frequência cardíaca (repouso e exercício)
* Nível de estresse baseado em métricas biométricas
* Padrões de comportamento saudável

**Por que é importante:**

Wearables fornecem uma **visão contínua e não-invasiva** do estilo de vida real do paciente. Isso melhora significativamente a acurácia dos modelos preditivos, pois:

✓ Atividade física muito baixa → risco elevado de doenças cardiovasculares
✓ Sono inconsistente → impacto em metabolismo e imunidade
✓ Frequência cardíaca em repouso elevada → indicador de estresse crônico
✓ Padrões sedentários → preditor de obesidade e diabetes

**Vantagem competitiva:** Poucos planos de saúde no Brasil integram dados de wearables em seus modelos preditivos.

---

### Etapa 2 — Análise por Machine Learning

Modelos preditivos analisam padrões para prever:

* risco cardiovascular
* risco metabólico (diabetes)
* problemas hormonais
* doenças crônicas

---

### Etapa 3 — Recomendações

O sistema gera recomendações como:

* exames preventivos
* consultas com especialistas
* acompanhamento periódico

---

### Etapa 4 — Agendamento automático

O sistema pode:

* sugerir datas disponíveis
* priorizar especialistas relevantes
* integrar com agenda médica

---

### Etapa 5 — Apoio ao médico

Antes da consulta o médico recebe:

* resumo clínico
* histórico relevante
* possíveis riscos detectados
* exames recomendados

Isso ajuda a construir uma **anamnese mais completa e eficiente**.

---

# 5️⃣ Benefícios para a Care Plus

### 💰 Redução de custos

Tratamento preventivo é **muito mais barato** que tratamento tardio.

Exemplo:

| Condição    | Preventivo     | Tardio                         |
| ----------- | -------------- | ------------------------------ |
| Diabetes    | acompanhamento | complicações hospitalares      |
| Hipertensão | controle       | AVC ou infarto                 |
| Câncer      | rastreamento   | tratamento oncológico complexo |

---

### 🧑‍⚕️ Melhor qualidade de atendimento

* médicos mais bem informados
* diagnósticos mais rápidos
* acompanhamento contínuo

---

### 📈 Uso inteligente de dados

Transforma dados clínicos em **insights preditivos**.

---

### ❤️ Melhora na saúde dos segurados

* diagnóstico precoce
* prevenção de doenças
* maior qualidade de vida

---

# 5️⃣ Integração com Dispositivos Wearables — Diferencial Estratégico

A integração com wearables é um **diferencial chave** da solução CarePredict. Enquanto dados clínicos tradicionais são coletados em consultas/exames, wearables fornecem uma **visão contínua do estilo de vida real do paciente**.

## Por que wearables mudam o jogo?

### 📊 Dados mais ricos e contínuos

| Fonte de Dados | Frequência | Cobertura | Custo |
|---|---|---|---|
| **Consulta clínica** | Anual ou quando muito, semestral | Snapshot do dia | Alto (necessita profissional) |
| **Exames laboratoriais** | Anual | Ponto no tempo | Alto |
| **Wearables** | Contínuo (24/7) | Histórico de 6-12 meses | Baixo (paciente já possui) |

### 💡 Insights únicos sobre estilo de vida

Wearables revelam padrões que exames tradicionais não capturam:

**Exemplo 1: Paciente com hipertensão**
- Exame clínico: PA = 140/90 mmHg (elevada)
- Wearable revela: frequência cardíaca em repouso = 95 bpm (acima do normal)
- Interpretação: **estresse crônico**, não apenas hipertensão
- Ação: Encaminhar para cardiologista + psicólogo

**Exemplo 2: Paciente assintomático com risco de diabetes**
- Histórico clínico: sem diagnóstico
- Wearable revela: sedentário (500 passos/dia), sono irregular, estresse elevado
- Combinado com idade +45: **risco elevado de diabetes**
- Ação: Exame de glicose urgente + recomendação de exercício

### 🎯 Melhora na precisão dos modelos

Estudos mostram que adicionar dados de wearables a modelos preditivos:
- ✅ Melhora a precisão em **15-25%**
- ✅ Reduz falsos positivos
- ✅ Identifica riscos **meses antes** de apresentarem sintomas

### 👥 Engajamento do paciente

* Paciente vê seus próprios dados de atividade
* Sente-se participante ativo na prevenção
* Maior adesão às recomendações
* Ciclo positivo de saúde

## Modelo de dados wearables no CarePredict

```
PACIENTE
├── Dados Clínicos (históricos, exames)
├── Dados Demográficos (idade, sexo, local)
└── 📱 DADOS WEARABLES (novo!)
    ├── Atividade Física
    │   ├── Passos diários
    │   ├── Duração de exercício
    │   └── Tipo de atividade
    ├── Frequência Cardíaca
    │   ├── FC em repouso
    │   ├── FC máxima
    │   └── Variabilidade (VFC)
    ├── Sono
    │   ├── Duração
    │   ├── Qualidade (deep/REM)
    │   └── Consistência
    └── Estresse
        ├── Nível de estresse
        ├── Tempo de recuperação
        └── Padrões comportamentais

         ↓ Machine Learning ↓
     
RESULTADO: Predição de risco muito mais precisa!
```

## Plataformas suportadas

Na **Fase 1 (MVP)**, o CarePredict se integra com:
- 🍎 **Apple Health** — Apple Watch, iPhone
- 🔵 **Google Fit** — Android Wear, Smartphones
- 💪 **Fitbit** — Fitbit/Fitbit Sense

Em **Fase 2 (Expansão)**:
- 🟣 **Garmin Connect** — relógios Garmin
- 💍 **Oura Ring** — biometria avançada

## Consentimento e LGPD

✅ **Compliance total:**
- Autenticação segura via OAuth 2.0
- Consentimento explícito do paciente
- Dados sensíveis protegidos (criptografia AES-256)
- Direito de desconectar a qualquer momento
- Conformidade com Lei Geral de Proteção de Dados (LGPD)

---

# 6️⃣ Funcionalidades do Sistema (MVP)

### Paciente

* dashboard de saúde
* recomendações preventivas
* agendamento automático
* lembretes de exames

---

### Médico

* painel clínico do paciente
* resumo preditivo de risco
* histórico organizado

---

### Sistema

* motor de Machine Learning
* recomendação de exames
* priorização de consultas
* integração com agendas

---

# 7️⃣ Tecnologias Possíveis

### Backend

* Python
* FastAPI

### Machine Learning

* Scikit-learn
* TensorFlow / PyTorch

### Banco de dados

* PostgreSQL

### Processamento de dados

* Pandas
* pipelines de dados

### Frontend

* Angular

---

# 8️⃣ Diferencial do Projeto

O diferencial da solução está em:

* **uso proativo de dados clínicos**
* **agendamento automatizado baseado em risco**
* **apoio à decisão médica com IA**

Em vez de reagir à doença, o sistema **atua preventivamente**.

---

# 9️⃣ Impacto Esperado

Para a **Care Plus**:

* redução de custos assistenciais
* maior eficiência operacional
* diferencial competitivo

Para pacientes:

* mais prevenção
* melhor acompanhamento
* melhor qualidade de vida

---

💡 **Uma dica MUITO importante para apresentação:**
Evitem vender como **“IA que diagnostica doenças”**, porque isso gera problemas regulatórios.

Vendam como:

> **Sistema de recomendação preventiva e apoio à decisão médica**

Isso é **muito mais seguro juridicamente**.

---

Se quiser, posso também te ajudar com algo que **vai elevar MUITO o nível da apresentação**:

* 🎯 **Nome profissional para o sistema**
* 🧠 **Arquitetura de IA (como o ML realmente funcionaria)**
* 📊 **Diagrama do sistema**
* 🧩 **Arquitetura técnica**
* 📈 **Slides prontos para apresentação**

Inclusive dá para transformar essa ideia em algo que **parece projeto de startup real**.

Membros do grupo

* Gabriel Drebtchinsky Q. de Carvalho (RM566729)
* Ana Carolina Pereira Lopez (RM568401)
* Danilo Roberto dos Santos (RM566966)
* José Ribeiro dos Santos Neto (RM567692)
* Henrique Fessel Trench (RM567513)
