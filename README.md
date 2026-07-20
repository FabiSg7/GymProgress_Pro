# 💪 GymProgress Pro

**GymProgress Pro** è una **Progressive Web App (PWA)** per il tracciamento degli allenamenti in palestra, pensata per l'uso da smartphone. Ti permette di pianificare la scheda, registrare le serie effettive, seguire i target di progressione settimana per settimana e monitorare l'andamento del volume nel tempo — **tutto offline, senza account e senza server**.

I dati restano **solo sul tuo dispositivo** (nel `localStorage` del browser); non vengono inviati da nessuna parte.

---

## ✨ Funzionalità

- **🏋️ Workout** — Selezioni fase/settimana, giorno ed esercizio; l'app calcola il **target programmato** e registri le serie realmente eseguite (peso × ripetizioni).
  - ⏱️ **Timer di recupero** integrato: **si avvia da solo** dopo il salvataggio di una serie e riparte dal tempo pieno; resta comunque libero di **pausa / riprendi / reset** in qualsiasi momento. Avviso a fine tempo (vibrazione + segnale acustico).
  - ⏭️ **Auto-avanzamento**: al salvataggio di un esercizio passa in automatico al successivo → a giorno completato al giorno dopo → a settimana completata alla settimana dopo → a programma finito ricomincia da Settimana 1 · Giorno 1. La selezione manuale di settimana/giorno/esercizio resta sempre disponibile.
  - 🔗 Supporto **Super Serie** (esercizio A + B in coppia): il secondario viene registrato insieme al primario (niente doppio conteggio del volume).
  - Badge "**Ultimo fatto / Prossimo suggerito**" per non perdere il filo della rotazione dei giorni.
- **📅 Programma** — Crei e modifichi la scheda: giorni, esercizi (serie, ripetizioni, peso, recupero, nota logistica), riordino su/giù degli esercizi e **archivio** di più schede salvate.
- **📊 Analisi** — Grafico a linee del **tonnellaggio totale** (somma di peso × ripetizioni di ogni serie completata) per ciascun esercizio, per visualizzare la progressione del volume.
- **📜 Impostazioni & Storico** — **Backup Esporta/Importa** in JSON (per cambiare telefono senza perdere i dati), pulizia dello storico e reset totale.

### Modelli di progressione

| Modello | Descrizione |
|---------|-------------|
| **Protocollo Brunaccioni** | Ciclo predefinito di **9 settimane** che varia automaticamente serie/ripetizioni/carico (es. S5: carico +5% e −1 rep; S9: reset con +10%). |
| **Personalizzata** | Durata ciclo a piacere, con progressione: incremento lineare del carico (+kg/settimana), incremento lineare delle ripetizioni, tabella settimana‑per‑settimana, o gestione libera. |

---

## 🚀 Come si usa

Essendo una PWA statica, **non richiede installazione né build**: bastano i file della cartella `gymprogress-app/`.

### Uso locale rapido

Apri direttamente `gymprogress-app/index.html` nel browser.

> ⚠️ Il **Service Worker** (funzionamento offline) e alcune funzioni PWA richiedono un contesto servito via `http(s)://`: aprendo il file con `file://` l'app funziona, ma il caching offline potrebbe non attivarsi. Per l'esperienza completa, servila con un piccolo web server locale.

### Con un web server locale

```bash
cd gymprogress-app

# Opzione A — Python 3
python -m http.server 8000

# Opzione B — Node.js
npx serve .
```

Poi apri **http://localhost:8000** nel browser.

### Installazione su smartphone (PWA)

1. Apri l'URL dell'app (servita via HTTPS) nel browser del telefono.
2. Usa **"Aggiungi alla schermata Home"** (Android/Chrome) o **Condividi → Aggiungi alla schermata Home** (iOS/Safari).
3. L'app si avvia a schermo intero come un'app nativa e funziona anche offline.

---

## 🛠️ Stack tecnico

- **Vanilla JavaScript** — nessun framework, nessun passaggio di build.
- **[Tailwind CSS](https://tailwindcss.com/)** — via CDN, per lo stile.
- **[Chart.js](https://www.chartjs.org/)** — via CDN, per i grafici del volume.
- **Service Worker** — strategia *cache-first* con **runtime caching** (le risorse scaricate vengono memorizzate per l'uso offline successivo) e **prompt di aggiornamento** quando è disponibile una nuova versione.
- **`localStorage`** — persistenza dei dati lato client.

---

## 📁 Struttura del progetto

```
GymProgress_Pro/
└── gymprogress-app/
    ├── index.html      # L'intera applicazione (HTML + CSS + JS inline)
    ├── manifest.json   # Manifest PWA (nome, icona, tema, orientamento)
    ├── sw.js           # Service Worker (cache offline)
    └── icon.png        # Icona dell'app (512×512)
```

---

## 💾 Backup dei dati

I dati vivono nel `localStorage` del browser: **cancellare i dati di navigazione o disinstallare l'app li elimina**. Per non perderli:

- **Esporta Backup** (tab *Impostazioni*) scarica un file `gymprogress_backup_AAAA-MM-GG.json` con schede attive, schede archiviate e storico.
- **Importa Backup** ricarica quel file su un altro dispositivo o dopo un reset. ⚠️ L'importazione **sovrascrive** tutti i dati attuali.

---

## 📝 Changelog

### v1.2.1
- **Service Worker resiliente**: gli asset locali sono obbligatori, i CDN (Tailwind, Chart.js) sono best-effort → un CDN irraggiungibile non fa più fallire l'intera cache offline. Aggiunto **runtime caching** (le risorse scaricate a runtime vengono salvate) e un **banner "Nuova versione disponibile → Ricarica"** quando l'app si aggiorna.
- **Protocollo Brunaccioni**: le ripetizioni calcolate non scendono più sotto 1 (le settimane con `-1`/`-2` rep erano potenzialmente ≤ 0 con reps base basse).
- **Coerenza dati**: la settimana viene salvata nello storico come numero; `parseInt` con radix esplicita ovunque.
- **Manifest PWA**: aggiunti `description`, `id`, `lang`, `scope`, `categories` e icona marcata `maskable` per migliorare l'installabilità.
- L'input di importazione backup mantiene volutamente `accept="*/*"`: su mobile il filtro `.json` rendeva il file non selezionabile dalle scorciatoie (la validazione `.json` avviene comunque nel codice).

### v1.2.0
- **Fix doppio conteggio Super Serie**: prima, registrando una super serie da entrambi gli esercizi, il volume veniva contato due volte. Ora il collegamento è **unidirezionale** (primario → secondario) e il secondario è registrato insieme al primario.
- **ID stabili per esercizio**: ogni esercizio ha un identificativo interno univoco. I collegamenti super serie non si rompono più rinominando un esercizio, e nomi uguali in giorni diversi non fanno più confusione. Migrazione automatica e trasparente dei dati esistenti (piano attivo e archivi), anche all'importazione di vecchi backup.
- **Rinomina sicura**: rinominando un esercizio, il nuovo nome viene propagato allo storico (la linea del grafico volume non si spezza).
- **Sicurezza (XSS)**: tutti i campi inseriti dall'utente (nomi, note, archivi, storico) vengono ora "escapati" prima di essere mostrati → un backup importato con contenuti malevoli non può più eseguire codice.
- **Timer di recupero**: si avvia automaticamente dopo il salvataggio di una serie e non prosegue più erroneamente al cambio di esercizio (resta pausabile/resettabile a mano).
- **Auto-avanzamento**: esercizio → giorno → settimana → riavvio del ciclo, con selezione manuale sempre disponibile.

### v1.1.3
- **Fix**: al ricaricamento della pagina, `last_day_index` (badge "Ultimo fatto / Prossimo suggerito") e `customWeeks` (durata del ciclo personalizzato) venivano letti da chiavi `localStorage` errate (suffisso `_fixed` mai scritto), diventando `NaN`. Ora vengono letti dalle chiavi corrette.
- **Fix PWA**: il nome della cache del Service Worker è ora allineato alla versione dell'app, così un aggiornamento invalida correttamente la cache offline invece di continuare a servire la versione precedente.

---

## 📄 Licenza

Progetto personale. _GymProgress Pro • Made with ❤️_
