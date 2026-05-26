# TODO: Treinamento dos Modelos ML

Pipeline de treinamento dos modelos preditivos do CarePredict, usando dados produzidos
pelo ETL (`data-worker-etl`) e pelo connector-app (wearables → API → PostgreSQL).

## Contexto

Os datasets Kaggle em `modules/ml/smart-triage-health/ml_service/data/raw/` são descartados.
O treinamento usa exclusivamente dados das tabelas **PostgreSQL** do próprio sistema:

| Fonte | Tabelas | Features |
|-------|---------|----------|
| connector-app (wearables) | `health_metrics`, `daily_health_summaries`, `sleep_sessions` | Passos, FC, SpO2, sono |
| API (cadastro) | `patients`, `patient_clinical_profiles` | Idade, sexo, IMC, fatores de risco |
| ETL (populacional) | `public_health.ibge_populacao`, `sinan_agravos`, `sim_mortalidade`, `cnes_estabelecimentos` | Incidência, mortalidade, leitos |

---

## [ ] Etapa 1 — Feature Contract

Criar `modules/ml/smart-triage-health/ml_service/feature_contract.py`
Arquivo único que define o schema tanto para treino quanto para inferência.

```python
FEATURE_CONTRACT = {
    "age": "float",
    "gender": "male|female|other",
    "bmi": "float",
    "avg_daily_steps": "float",
    "avg_resting_hr": "float",
    "avg_spo2": "float",
    "avg_sleep_minutes": "float",
    "avg_sleep_score": "float",
    "risk_factors": "list[str]",
    "family_history": "str",
    "incidencia_dengue_municipio": "float",
    "taxa_mortalidade_cardiovascular": "float",
    "leitos_por_100k": "float",
}
```

**Critério de pronto:** `feature_contract.py` versionado com todas as chaves documentadas.

---

## [ ] Etapa 2 — Script de extração (SQL → CSV)

Criar `modules/ml/smart-triage-health/ml_service/training/extract.py`

Query SQL que junta pacientes + wearables + dados populacionais em 1 linha por paciente:

```sql
SELECT
    p.id AS patient_id,
    EXTRACT(YEAR FROM AGE(p.birth_date)) AS age,
    p.gender,
    p.height_cm / NULLIF(p.weight_kg, 0) AS bmi,
    AVG(CASE WHEN hm.metric_type = 'STEPS' THEN hm.value END) AS avg_daily_steps,
    AVG(CASE WHEN hm.metric_type = 'RESTING_HEART_RATE' THEN hm.value END) AS avg_resting_hr,
    AVG(CASE WHEN hm.metric_type = 'BLOOD_OXYGEN' THEN hm.value END) AS avg_spo2,
    AVG(ss.total_sleep_minutes) AS avg_sleep_minutes,
    AVG(ss.sleep_score) AS avg_sleep_score,
    ph.incidencia_dengue,
    ph.taxa_mortalidade_cardiovascular,
    ph.leitos_por_100k
FROM patients p
JOIN patient_clinical_profiles pcp ON p.id = pcp.patient_id
LEFT JOIN health_metrics hm ON p.id = hm.patient_id AND hm.recorded_at > NOW() - INTERVAL '30 days'
LEFT JOIN sleep_sessions ss ON p.id = ss.patient_id AND ss.date > NOW() - INTERVAL '30 days'
LEFT JOIN vw_patient_public_health ph ON p.municipio_codigo = ph.municipio_codigo
GROUP BY p.id, pcp.id, ph.id
```

**Dependências de sistema:**
- `psycopg2-binary>=2.9`
- `pandas>=2.0`
- `python-dotenv>=1.0`

**Critério de pronto:** `python extract.py` gera `data/training/X.csv` com as mesmas colunas do contract.

---

## [ ] Etapa 3 — Preprocessamento

Criar `modules/ml/smart-triage-health/ml_service/training/preprocess.py`

```python
def preprocess(X: pd.DataFrame) -> tuple[np.ndarray, Pipeline]:
    pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ])
    X_enc = pipeline.fit_transform(X)
    joblib.dump(pipeline, "models/preprocessor.pkl")
    return X_enc, pipeline
```

**Critério de pronto:** `preprocess.py` gera `models/preprocessor.pkl` e `data/training/X_processed.npy`.

---

## [ ] Etapa 4 — Geração de labels (regras clínicas)

Criar `modules/ml/smart-triage-health/ml_service/training/label.py`

Para o MVP, os labels são derivados de regras clínicas (não de diagnósticos reais):

```python
def label_cardio_risk(row: dict) -> int:
    score = 0
    if row.get("bmi", 0) > 30: score += 1
    if row.get("avg_resting_hr", 0) > 90: score += 1
    if row.get("avg_spo2", 100) < 95: score += 1
    if "hipertensao" in str(row.get("risk_factors", "")): score += 2
    if "cardiovascular" in str(row.get("family_history", "")): score += 2
    return 1 if score >= 3 else 0
```

**Estratégia de evolução:**
1. ✅ MVP: regras clínicas heurísticas
2. 🔄 Futuro: labels refinados com feedback médico
3. 🔄 Futuro: semi-supervisionado com dados reais de desfechos

**Critério de pronto:** `label.py` gera `data/training/y.npy`.

---

## [ ] Etapa 5 — Treinamento

Criar `modules/ml/smart-triage-health/ml_service/training/train.py`

```python
def train(X, y):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
    model = LogisticRegression(class_weight="balanced", max_iter=1000)
    model.fit(X_train, y_train)
    joblib.dump(model, "models/cardio_v1.pkl")
    return {"model": model, "auc": roc_auc_score(y_test, model.predict_proba(X_test)[:, 1])}
```

```txt
requirements.txt (adicional para treino):
  scikit-learn>=1.5
  xgboost>=2.0
  imbalanced-learn>=0.12
  shap>=0.44
  joblib>=1.4
  matplotlib>=3.8
```

**Critério de pronto:** `python train.py` gera `models/cardio_v1.pkl` + `metrics.json`.

---

## [ ] Etapa 6 — Avaliação

Criar `modules/ml/smart-triage-health/ml_service/training/evaluate.py`

```python
def evaluate(model, X_test, y_test):
    y_pred = model.predict(X_test)
    report = classification_report(y_test, y_pred, output_dict=True)
    shap_values = shap.Explainer(model, X_test)(X_test)
    with open("models/metrics.json", "w") as f:
        json.dump({"auc": auc, "precision": report["1"]["precision"], "recall": report["1"]["recall"]}, f)
    shap.summary_plot(shap_values, X_test)
    plt.savefig("models/shap_summary.png")
```

**Critério de pronto:** `models/metrics.json` + `models/shap_summary.png` gerados.

---

## [ ] Etapa 7 — Pipeline de treino orquestrado

Criar `modules/ml/smart-triage-health/ml_service/training/run_pipeline.py`

```python
def run():
    X = extract()       # PostgreSQL → DataFrame
    y = label(X)        # Regras → labels
    X, preprocessor = preprocess(X)
    model, metrics = train(X, y)
    evaluate(model, X_test, y_test)
    log_metadata(model, metrics)
```

**Critério de pronto:** `python -m training.run_pipeline` executa o pipeline completo.

---

## [ ] Etapa 8 — Carregar modelo no ML service

Modificar `modules/ml/smart-triage-health/ml_service/src/api.py`:

```python
from fastapi import FastAPI
import joblib

app = FastAPI()
model = joblib.load("models/cardio_v1.pkl")
preprocessor = joblib.load("models/preprocessor.pkl")

@app.post("/predict")
def predict(features: dict):
    X = preprocessor.transform(pd.DataFrame([features]))
    proba = model.predict_proba(X)[0, 1]
    return {"disease": "cardiovascular", "probability": round(proba, 4), "model_version": "cardio_v1"}
```

**Critério de pronto:** `POST /predict` retorna probabilidade real baseada no modelo treinado.

---

## [ ] Etapa 9 — Integrar com risk-scoring-engine

O `risk-scoring-engine` (`modules/services/risk-scoring-engine/app/infrastructure/model_client.py`)
deve parar de retornar stub e passar a chamar o ML service:

```python
async def predict(self, features: dict) -> dict:
    async with httpx.AsyncClient(base_url=self.base_url, timeout=30) as client:
        resp = await client.post("/predict", json=features)
        return resp.json()
```

**Critério de pronto:** `risk-scoring-engine` retorna predições reais do modelo carregado.

---

## [ ] Etapa 10 — Docker + Dependências

- [ ] Adicionar dependências de ML no `requirements.txt` do ML service
- [ ] Criar `Dockerfile` no `modules/ml/smart-triage-health/`
- [ ] Adicionar ML service no `docker-compose.yml` raiz

---

## Resumo de esforço

| Etapa | O que | Arquivos | Esforço |
|-------|-------|----------|---------|
| 1 | Feature Contract | `feature_contract.py` | 30min |
| 2 | Extração SQL | `training/extract.py` | 1h |
| 3 | Preprocess | `training/preprocess.py` | 1h |
| 4 | Labels clínicos | `training/label.py` | 1h |
| 5 | Treinamento | `training/train.py` | 1h |
| 6 | Avaliação | `training/evaluate.py` | 1h |
| 7 | Pipeline orquestrado | `training/run_pipeline.py` | 30min |
| 8 | Load model no API | `src/api.py` | 30min |
| 9 | Integrar engine | `model_client.py` | 30min |
| 10 | Docker + deps | `Dockerfile`, `requirements.txt` | 1h |
| **Total** | | **~10 arquivos** | **~8h** |

---

## Dependências entre módulos

```
extract.py → PostgreSQL (care_plus + public_health)
preprocess.py → extract.py
label.py → extract.py (mesmo X, deriva y)
train.py → preprocess.py + label.py
evaluate.py → train.py

api.py → models/cardio_v1.pkl + models/preprocessor.pkl
model_client.py (engine) → POST /predict (ML service)
```

## Progresso

- [ ] Etapa 1 — Feature Contract
- [ ] Etapa 2 — Extração SQL
- [ ] Etapa 3 — Preprocessamento
- [ ] Etapa 4 — Labels clínicos
- [ ] Etapa 5 — Treinamento
- [ ] Etapa 6 — Avaliação
- [ ] Etapa 7 — Pipeline orquestrado
- [ ] Etapa 8 — Carregar modelo
- [ ] Etapa 9 — Integrar engine
- [ ] Etapa 10 — Docker + deps
