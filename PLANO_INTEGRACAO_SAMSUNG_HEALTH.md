# Plano de Implementação: Integração Samsung Health

## Contexto

A Samsung Health SDK é uma **biblioteca nativa Android** (`com.samsung.android.sdk.healthdata`), não uma REST API. Isso exige **código nativo Android via Platform Channels** no Flutter — um nível de complexidade maior que os adaptadores existentes (Apple Health / Google Health Connect), que usam o pacote `health` do Flutter.

A SDK funciona apenas em dispositivos Samsung com Samsung Health 6.28+.

---

## Camada 1: Connector-App (Flutter) — 80% do esforço

### 1.1 Adicionar dependência da Samsung Health SDK

**Arquivo**: `modules/connector-app/android/app/build.gradle`

Adicionar o repositório Samsung e a dependência:

```groovy
repositories {
    maven { url 'https://developer.samsung.com/repo' }
}

dependencies {
    implementation 'com.samsung.android.sdk.healthdata:health-data:1.5.1'
}
```

### 1.2 Implementar Platform Channel nativo (Android/Kotlin)

**Novo arquivo**: `modules/connector-app/android/app/src/main/kotlin/br/com/careplus/connector/SamsungHealthPlugin.kt`

Este componente implementa `MethodCallHandler` e expõe os seguintes métodos via `MethodChannel("careplus/samsung_health")`:

| Método do Channel | Descrição |
|---|---|
| `connect` | Conecta ao `HealthDataStore` (requer Samsung Health app) |
| `disconnect` | Desconecta do data store |
| `requestPermissions` | Solicita permissões via `HealthPermissionManager` para os tipos de dados |
| `hasPermissions` | Verifica permissões concedidas |
| `revokePermissions` | Revoga permissões |
| `readStepCount` | Lê `HealthConstants.StepCount` + `StepDailyTrend` com `HealthDataResolver.ReadRequest` |
| `readHeartRate` | Lê `HealthConstants.HeartRate` (inclui HRV) |
| `readBloodOxygen` | Lê `HealthConstants.OxygenSaturation` |
| `readSleep` | Lê `HealthConstants.Sleep` + `HealthConstants.SleepStage` |
| `readExercise` | Lê `HealthConstants.Exercise` (workouts, calorias, distância) |
| `readBloodPressure` | Lê `HealthConstants.BloodPressure` |
| `readBloodGlucose` | Lê `HealthConstants.BloodGlucose` |
| `readWeight` | Lê `HealthConstants.Weight` |
| `readHeight` | Lê `HealthConstants.Height` |
| `readBodyFat` | Lê `HealthConstants.BodyFat` |
| `readBodyTemperature` | Lê `HealthConstants.BodyTemperature` |
| `readFloorsClimbed` | Lê `HealthConstants.FloorsClimbed` |
| `readCalories` | Lê calorias via `Exercise` + `SessionMeasurement` |
| `readDistance` | Lê distância via `Exercise` |
| `isSamsungDevice` | Verifica se o dispositivo é Samsung |
| `isSamsungHealthInstalled` | Verifica se Samsung Health está instalado |

**Tipos de permissão a solicitar** (via `HealthPermissionManager.PermissionKey`):
- `StepCount` (READ)
- `HeartRate` (READ)
- `OxygenSaturation` (READ)
- `Sleep` (READ)
- `SleepStage` (READ)
- `Exercise` (READ)
- `BloodPressure` (READ)
- `BloodGlucose` (READ)
- `Weight` (READ)
- `Height` (READ)
- `BodyFat` (READ)
- `BodyTemperature` (READ)
- `AmbientTemperature` (READ)
- `FloorsClimbed` (READ)

**Registro do plugin na MainActivity**:
**Modificar**: `modules/connector-app/android/app/src/main/kotlin/.../MainActivity.kt`

```kotlin
import br.com.careplus.connector.SamsungHealthPlugin

class MainActivity : FlutterActivity() {
    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        flutterEngine.plugins.add(SamsungHealthPlugin())
    }
}
```

### 1.3 Criar o adaptador Flutter

**Novo arquivo**: `modules/connector-app/lib/features/wearables/data/services/samsung_health_adapter.dart`

Implementa as interfaces segregadas existentes:
- `HealthPlatformConfig` — `configure()`, `requestPermissions()`, `hasPermissions()`, `revokePermissions()`
- `ActivityDataProvider` — `getSteps()`, `getActiveCalories()`, `getDistance()`, `getActiveMinutes()`
- `VitalSignsProvider` — `getHeartRate()`, `getBloodOxygen()`, `getRestingHeartRate()`, `getHeartRateVariability()`, `getRespiratoryRate()`, `getBodyTemperature()`
- `SleepDataProvider` — `getSleepMetrics()`
- `BodyMetricsProvider` — `getBloodPressure()`, `getBloodGlucose()`, `getWeight()`, `getHeight()`, `getBodyFat()`
- `WorkoutDataProvider` — `getWorkouts()`

Cada método chama o `MethodChannel` correspondente e faz o mapeamento de dados.

**Mapeamento de dados Samsung Health → modelo interno**:

| Samsung Health Constant | Campo interno |
|---|---|
| `StepCount.STEP_COUNT` + `StepDailyTrend` | `steps` (daily total) |
| `HeartRate.HEART_RATE` | `heartRate` (bpm) |
| `HeartRate.HEART_RATE_VARIABILITY` | `heartRateVariability` (ms) |
| `OxygenSaturation.OXYGEN_SATURATION` | `bloodOxygen` (%) |
| `SleepStage` (40001 awake, 40002 deep, 40003 light, 40004 rem) | `sleepMetrics` (Map<String, int>) |
| `Exercise.EXERCISE_CUSTOM_TYPE` | `workouts` (type, duration, start/end) |
| `Exercise.EXERCISE_CALORIE` | `activeCalories` (kcal) |
| `Exercise.EXERCISE_DISTANCE` | `distance` (m) |
| `BloodPressure.SYSTOLIC` / `DIASTOLIC` | `bloodPressureSystolic` / `bloodPressureDiastolic` (mmHg) |
| `BloodGlucose.GLUCOSE` | `bloodGlucose` (mg/dL) |
| `Weight.WEIGHT` | `weight` (kg) |
| `Height.HEIGHT` | `height` (cm) |
| `BodyFat.BODY_FAT` | `bodyFat` (%) |
| `BodyTemperature.BODY_TEMPERATURE` | `bodyTemperature` (°C) |
| `FloorsClimbed.FLOORS_CLIMBED` | `floorsClimbed` (count) |

**Tratamento de erros**:
- `HealthConnectionErrorResult.OLD_VERSION_PLATFORM` → Instruir usuário a atualizar Samsung Health
- `HealthConnectionErrorResult.CONNECTION_FAILURE` → Tentar reconectar
- Dispositivo não-Samsung ou Samsung Health não instalado → Retornar erro claro

### 1.4 Registrar o adaptador na factory

**Arquivo**: `modules/connector-app/lib/features/wearables/data/services/health_platform_adapter_factory.dart`

Adicionar lógica para instanciar `SamsungHealthAdapter` quando:
- `Platform.isAndroid` E dispositivo é Samsung E usuário selecionou `samsung_health`
- Deve coexistir com `GoogleHealthConnectAdapter` — usar preferência do usuário definida no fluxo de pareamento

### 1.5 Atualizar injeção de dependências

**Arquivo**: `modules/connector-app/lib/app/di/modules/wearables_module.dart`

Registrar `SamsungHealthAdapter` no container DI (`get_it`).

### 1.6 Atualizar permissões Android

**Arquivo**: `modules/connector-app/android/app/src/main/AndroidManifest.xml`

```xml
<queries>
    <package android:name="com.sec.android.app.shealth" />
</queries>
```

---

## Camada 2: SPA (Angular) — 15% do esforço

### 2.1 Adicionar Samsung Health como provider no fluxo de pareamento

**Arquivo**: `modules/spa/src/app/pages/wearable-connect/wearable-connect.ts`

Adicionar ao array de providers:

```typescript
{ 
  id: 'samsung_health', 
  name: 'Samsung Health', 
  icon: '...',
  description: 'Conecte seu Samsung Galaxy Watch ou smartphone Samsung',
  platform: 'android',
  requiresSamsung: true
}
```

### 2.2 Atualizar escopos disponíveis para Samsung Health

**Arquivo**: `modules/spa/src/app/pages/wearable-connect/models/wearable-connect.model.ts`

Garantir que os escopos de permissão incluam os tipos relevantes. Os existentes (`activity`, `heart_rate`, `sleep`, `spo2`, `calories`, `distance`) já cobrem a maioria, considerar adicionar:
- `blood_pressure`
- `blood_glucose`
- `body_composition` (weight, height, body fat)
- `temperature`
- `workouts`

### 2.3 Atualizar o SpaMessageHandler (Flutter)

**Arquivo**: `modules/connector-app/lib/core/bridge/spa_message_handler.dart`

Adicionar tratamento para mensagens com `platform: 'samsung_health'`, delegando para `SamsungHealthAdapter.requestPermissions()`.

### 2.4 Verificar WearableService e NativePermissionService

**Arquivos**:
- `modules/spa/src/app/pages/wearable-connect/services/wearable.service.ts`
- `modules/spa/src/app/core/native-permission.service.ts`

O fluxo existente deve funcionar sem alterações significativas (o backend aceita qualquer string de `platform`). Apenas validar que o bridge/deep link funciona para `samsung_health`.

### 2.5 Atualizar UI — Ícone da Samsung Health

Adicionar ícone/logotipo da Samsung Health no seletor de providers do componente de pareamento.

---

## Camada 3: API (FastAPI) — 5% do esforço

**Nenhuma alteração estrutural necessária.** Os endpoints existentes já são genéricos:

- `POST /api/v1/wearables/connect` — aceita qualquer string `platform`
- `POST /api/v1/health/sync` — aceita `HealthMetricRequest` genérico com `metric_type`, `value`, `unit`, `recorded_at`, `source`, `device_id`
- Tabela `health_metrics` — sem restrição de enum para `metric_type` ou `source`
- Tabela `wearable_oauth_tokens` — Samsung Health SDK **não usa OAuth tradicional** (usa `HealthPermissionManager` nativo). O campo `provider` pode armazenar `samsung_health` se necessário para tracking.

**Opcional**:
- Adicionar mapeamento de `source: 'samsung_health'` em logs/métricas
- Adicionar `samsung_health` à documentação da API de wearables

---

## Camada 4: Background Sync (Flutter)

**Arquivo**: `modules/connector-app/lib/features/wearables/data/services/health_sync_worker.dart`

O `HealthSyncWorker` existente já orquestra a sincronização via `HealthDataService.fetchTodayHealthData()` → `POST /health/sync`. Como o `SamsungHealthAdapter` implementa as mesmas interfaces segregadas, a integração com o worker é automática via a factory.

**Verificar**: O `HealthDataService` combina dados de múltiplos providers (local + Google API). Garantir que o Samsung Health seja incluído na agregação quando ativo.

**Arquivo**: `modules/connector-app/lib/features/wearables/data/services/health_data_service.dart`

---

## Resumo de Arquivos

### A Criar

| Arquivo | Descrição | Linhas estimadas |
|---|---|---|
| `connector-app/android/.../SamsungHealthPlugin.kt` | Platform channel nativo Android | ~500-600 |
| `connector-app/lib/.../samsung_health_adapter.dart` | Adaptador Flutter (implementa interfaces) | ~350-450 |

### A Modificar

| Arquivo | Descrição |
|---|---|
| `connector-app/android/app/build.gradle` | Adicionar dependência Samsung Health SDK |
| `connector-app/android/.../MainActivity.kt` | Registrar SamsungHealthPlugin |
| `connector-app/android/app/src/main/AndroidManifest.xml` | Adicionar `<queries>` para Samsung Health |
| `connector-app/lib/.../health_platform_adapter_factory.dart` | Adicionar case para Samsung |
| `connector-app/lib/.../wearables_module.dart` | Registrar no DI |
| `connector-app/lib/.../spa_message_handler.dart` | Handler para samsung_health |
| `spa/src/app/pages/wearable-connect/wearable-connect.ts` | Adicionar provider Samsung Health |
| `spa/src/app/pages/wearable-connect/models/wearable-connect.model.ts` | Adicionar escopos Samsung |
| `spa/src/app/pages/wearable-connect/services/wearable.service.ts` | Validar compatibilidade |
| `spa/src/app/core/native-permission.service.ts` | Validar compatibilidade |

### Sem Alterações

| Camada | Motivo |
|---|---|
| API (FastAPI) | Endpoints já genéricos, sem restrições de enum |
| Banco de dados (PostgreSQL) | Schema genérico aceita qualquer `source` / `metric_type` |
| Background sync worker | Usa interfaces segregadas, adaptador novo se integra automaticamente |

---

## Fluxo de Pareamento — Samsung Health

```
1. Usuário no SPA → acessa /wearable-connect
2. Seleciona "Samsung Health" como provider
3. Seleciona escopos de dados (activity, heart_rate, sleep, etc.)
4. SPA chama NativePermissionService.requestPermissions('samsung_health', scopes)
5. Opção A (WebView/Flutter): Bridge → FlutterChannel.postMessage → SpaMessageHandler → SamsungHealthAdapter.requestPermissions()
6. Opção B (Browser puro): Deep link → careplus://pair?... (Flutter trata)
7. SamsungHealthAdapter chama MethodChannel → SamsungHealthPlugin.requestPermissions()
8. Plugin nativo chama HealthPermissionManager.requestPermissions() → abre UI nativa da Samsung
9. Usuário concede permissões na UI nativa
10. Resultado volta via MethodChannel → Flutter → Bridge → SPA
11. SPA chama WearableService.connect() → POST /wearables/connect { platform: 'samsung_health', ... }
12. API registra o pareamento na tabela health_metrics (source='samsung_health')
13. Background sync inicia periodicamente (HealthSyncWorker)
```

---

## Riscos e Considerações

1. **Dispositivo Samsung obrigatório**: A SDK só funciona em dispositivos Samsung com Samsung Health 6.28+. Verificar via `isSamsungDevice()` e retornar erro claro.
2. **Coexistência com Health Connect**: Dispositivos Samsung podem ter ambos. A factory decide qual usar com base na preferência do usuário.
3. **Sem OAuth REST**: Samsung Health SDK usa permissões nativas, não OAuth. O fluxo de callback OAuth do SPA não se aplica.
4. **Testes**: Sem dispositivo Samsung físico, o adaptador não pode ser testado end-to-end. Criar mock adapter para testes unitários.
5. **Versão do Samsung Health**: Tratar `OLD_VERSION_PLATFORM` instruindo o usuário a atualizar via `HealthConnectionErrorResult.resolve()`.
6. **Chave de API/Partner**: Verificar se a SDK requer chave de API ou registro de parceria no Samsung Developer Console.
