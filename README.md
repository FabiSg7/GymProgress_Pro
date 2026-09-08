# 💪 GymProgress Pro

**GymProgress Pro** è una **Progressive Web App (PWA)** per il tracciamento degli allenamenti in palestra, pensata per l'uso da smartphone. Ti permette di pianificare la scheda, registrare le serie effettive, seguire i target di progressione settimana per settimana e monitorare l'andamento del volume nel tempo — **tutto offline, senza account e senza server**.

I dati restano **solo sul tuo dispositivo** (nel `localStorage` del browser); non vengono inviati da nessuna parte.

---

## ✨ Funzionalità

- **🏋️ Workout** — Selezioni fase/settimana, giorno ed esercizio; l'app calcola il **target programmato** e registri le serie realmente eseguite (peso × ripetizioni).
  - ⏱️ **Timer di recupero** integrato: **si avvia da solo** dopo il salvataggio di una serie e riparte dal tempo pieno; resta comunque libero di **pausa / riprendi / reset** in qualsiasi momento. Avviso a fine tempo (vibrazione + segnale acustico).
  - ⏭️ **Auto-avanzamento**: al salvataggio di un esercizio passa in automatico al successivo → a giorno completato al giorno dopo → a settimana completata alla settimana dopo → a programma finito ricomincia da Settimana 1 · Giorno 1. La selezione manuale di settimana/giorno/esercizio resta sempre disponibile.
  - 🔗 Supporto **Super Serie** (esercizio A + B in coppia): il secondario viene registrato insieme al primario (niente doppio conteggio del volume).
  - 🔄 Supporto **Circuito** (N esercizi in fila senza pausa, poi un recupero, ripetuto per più giri): registrazione un giro alla volta, peso opzionale, ogni esercizio ha la sua linea di volume.
  - ⏱️ Supporto **esercizi a tempo** (plank, wall sit, farmer's carry…): misurati in secondi con un **cronometro** integrato, sia standalone sia dentro circuiti/super serie.
  - Badge "**Ultimo fatto / Prossimo suggerito**" per non perdere il filo della rotazione dei giorni.
- **📅 Programma** — Crei e modifichi la scheda: giorni, esercizi (serie, ripetizioni, peso, recupero, nota logistica), riordino su/giù degli esercizi e **archivio** di più schede salvate.
- **📊 Analisi** — Grafico a linee del **tonnellaggio totale** (somma di peso × ripetizioni di ogni serie completata) per ciascun esercizio, per visualizzare la progressione del volume.
- **📜 Impostazioni & Storico** — **Backup Esporta/Importa** in JSON (per cambiare telefono senza perdere i dati), pulizia dello storico e reset totale.

### Modelli di progressione

| Modello | Descrizione |
|---------|-------------|
| **Protocollo Brunaccioni** | Mesociclo di **7 settimane**: 3 di accumulo del volume (serie crescenti a carico fisso), 3 di intensificazione (+5% di carico, una rep in meno, serie che riaccumulano) e **1 di scarico**. Porta anche il **RIR** (ripetizioni in riserva) settimana per settimana, differenziato tra fondamentali, complementari e isolamento. A fine ciclo propone il **consolidamento dei carichi**. |
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

### v1.9.2
- **"Crea Nuovo Programma Vuoto" non ti porta più via lo storico senza dirtelo.** Il pulsante chiedeva *«Vuoi svuotare la scheda attuale per progettarne una nuova da zero?»* — parlava della **scheda**, ma cancellava **anche tutte le serie registrate** e con esse i grafici: mesi di allenamenti persi a un clic, senza che il messaggio lo lasciasse sospettare. Ora la richiesta è esplicita e offre **tre strade**: *conserva lo storico*, *elimina anche lo storico* (il vecchio comportamento, per chi lo vuole) e *annulla*. Il riquadro dice anche quante registrazioni sono in gioco. Se non c'è nulla nello storico, la domanda non viene posta.
- **I grafici degli esercizi che non sono più in scheda restano consultabili.** Il menu di *Analisi* elencava solo gli esercizi del programma attivo, quindi i dati di un esercizio rimosso (o di tutta una scheda svuotata) diventavano invisibili pur essendo ancora salvati. Ora il menu include anche gli esercizi presenti nel solo storico — indispensabile per poter davvero *conservare* lo storico di cui sopra.
- **Fix etichetta del modello di progressione**: il menu diceva ancora «Protocollo Brunaccioni (**9 Sett.**)» dopo che la v1.9.0 aveva portato il mesociclo a **7 settimane**. Ora la durata è scritta a partire dalla costante del protocollo, così non può più divergere.

### v1.9.1
- **Nel blocco di intensificazione ora vedi due strade, non una.** Il protocollo propone +5% di carico su *tutti* gli esercizi target nella stessa settimana, ma è normale non riuscire a salire su tutti contemporaneamente — e prima l'app non diceva cosa fare in quel caso. Ora accanto al target compare l'**alternativa a pari sforzo**: restare al peso di sempre aggiungendo una ripetizione (es. `4×5 @≈22 kg` **oppure** `4×7 @21 kg`). È la doppia progressione classica: se non puoi aggiungere peso, aggiungi ripetizioni. Chi sceglie l'alternativa semplicemente non consolida il carico a fine ciclo e ritenta il salto al giro successivo — così ogni esercizio progredisce alla sua velocità. L'alternativa **non** viene mostrata nella settimana di scarico, dove aggiungere ripetizioni sarebbe controproducente.

### v1.9.0
- **Il carico guadagnato non si perde più a fine ciclo.** Era il difetto più costoso: completate le settimane, l'app tornava alla prima e **ricalcolava tutto dal peso di partenza**, buttando via il +5% conquistato nel blocco di intensificazione. Risultato: settimane di lavoro per ritrovarsi esattamente al punto di partenza, e nessuna progressione possibile nel medio periodo. Ora alla fine del mesociclo compare un **riepilogo**: per ogni esercizio target vedi se hai centrato il picco, con quale carico e quante serie, e **decidi tu quali carichi consolidare** (chi non consolidi ripete il ciclo sugli stessi pesi). La nuova base è il peso che hai **davvero registrato**, non un calcolo teorico.
- **Basta pesi che non esistono.** Il target del blocco di intensificazione era mostrato come numero secco — e con un +5% secco uscivano carichi **impossibili da caricare**: 94,5 kg alla pressa, 19 kg con i manubri, 21 kg al bilanciere. Finivano nello storico come se fossero stati eseguiti. Ora il carico è dichiarato per quello che è, una **stima** (`≈ 94,5 kg`), con l'indicazione di caricare il peso disponibile più vicino e registrare quello usato realmente.
- **Ciclo riportato a 7 settimane con una settimana di scarico.** Prima erano 9 senza alcuno scarico. Le settimane sono anche state riscritte: le serie ora **accumulano davvero** (4 → 5 → 6) invece di oscillare avanti e indietro, e il blocco di intensificazione non è più un plateau di 4 settimane allo stesso carico. È sparita la vecchia settimana 9 (−2 reps e +10%), che era più dura della prima e non apparteneva a nessun blocco.
- **Intensità percepita (RIR) su ogni settimana**, differenziata per tipo di esercizio: i **fondamentali pesanti** restano sempre a buffer (mai a cedimento, per non sporcare la tecnica), i **complementari** partono con 1-2 ripetizioni di margine e arrivano a cedimento nell'ultima settimana del blocco, gli esercizi di **isolamento** lavorano a cedimento su tutte le serie — che è la loro unica via di progressione, dato che su carico e volume restano fissi per scelta.

### v1.8.0
- **Timer di recupero e cronometro: l'avviso ora scatta puntuale anche a schermo fermo** — prima, se lo schermo si spegneva da solo per inattività, vibrazione/suono/notifica **non partivano finché non si sbloccava il telefono** (allo sblocco partivano tutti insieme). Non era un problema del telefono: a schermo spento il browser **congela i timer JavaScript** della pagina. Ora, mentre il recupero **o** il cronometro di un esercizio a tempo sono in corso, l'app tiene lo schermo acceso con lo **Screen Wake Lock**, così il conteggio resta vivo e l'avviso suona in tempo — utile soprattutto durante plank/wall sit/dead hang, quando hai le mani occupate e non tocchi lo schermo. Il lock si rilascia quando nessuno dei due sta più contando (e se blocchi lo schermo **a mano** resta valido il vecchio comportamento — avviso allo sblocco). Dove l'API non è disponibile, l'app funziona come prima senza errori.
- **Fix perdita dei giri del Circuito (e delle serie in corso) al blocco schermo** — i giri/serie registrati durante una sessione **prima** di premere "✅ Completato" vivevano solo in memoria: se il telefono restava bloccato a lungo e il sistema **scartava la scheda** dalla memoria, alla riapertura la sessione ripartiva **vuota** e i dati inseriti erano persi (più evidente nel Circuito, dove si accumulano molti giri prima di completare). Ora la sessione in corso viene **salvata sul dispositivo a ogni serie/giro** e **ripristinata** alla riapertura se corrisponde all'esercizio attivo; viene rimossa al completamento e quando azzeri/cambi/importi la scheda. Nessun dato lascia il telefono.

### v1.7.0
- **La posizione nel workout ora è persistente (settimana + giorno + esercizio)**: prima, cambiando tab e tornando su *Workout*, la **settimana ripartiva da 1** e — se avevi salvato anche solo un esercizio — l'app **saltava al giorno successivo** anche a giorno non finito. Ora un *cursore* salvato ricorda esattamente dove sei (fase/settimana, giorno ed esercizio) e lo ripristina al rientro. L'auto-avanzamento (esercizio → giorno → settimana → riavvio) e la selezione manuale restano invariati; il badge "Ultimo fatto" continua a indicare l'ultimo giorno completato.
- **Esercizi a tempo — avviso al raggiungimento del target**: quando il cronometro raggiunge i secondi target dell'esercizio, parte **la stessa vibrazione + suono** del timer di recupero (una sola volta) e il display diventa **ambra**, **senza fermare il cronometro** — così puoi anche superare il target restando avvisato del traguardo.
- **Fix layout cronometro su schermi stretti**: nel Workout, per gli esercizi a tempo, il pulsante **"Azzera" non si sovrappone più al campo "Carico"**. Il cronometro ora occupa tutta la larghezza e il "Carico" va sotto (prima erano affiancati e si accavallavano su telefoni stretti).

### v1.6.2
- **Cronometro esercizi a tempo più chiaro**: rimossa la casella dei secondi modificabile a mano, che affiancata al cronometro mostrava lo stesso numero due volte e confondeva. Ora c'è **solo il cronometro** (display in m:ss + Avvia/Stop + Azzera); il valore registrato è quello del cronometro. Il target resta come riferimento accanto all'etichetta.

### v1.6.1
- **Fix cronometro esercizi a tempo**: il campo dei secondi partiva pre-compilato con il valore *target* (es. 10) invece che da 0, quindi il cronometro contava da 10 in su. Ora il campo parte da **0** (il target resta mostrato come semplice riferimento accanto all'etichetta) e, dopo aver salvato una serie/giro, i campi a tempo si **azzerano automaticamente** per la ripetizione successiva.

### v1.6.0
- **Esercizi a tempo (tempo sotto tensione)**: nuova **misura** per gli esercizi isometrici/a tempo — plank, wall sit, hollow hold, dead hang, farmer's carry, ecc. Ogni esercizio (singolo, dentro un circuito o in super serie) può ora essere misurato in **secondi** invece che in ripetizioni.
  - In **Pianificazione** un selettore *Misura* (Ripetizioni / Tempo) sull'esercizio singolo, e un selettore per **ogni riga** del circuito (così un circuito può mischiare reps e tempo, es. *Plank 40s + Crunch 15 rep*). Il **peso resta opzionale** (0 per il corpo libero, ma sono supportate le varianti zavorrate).
  - In **Workout** gli esercizi a tempo mostrano un **cronometro** (Avvia/Stop/Azzera) che conta i secondi mentre esegui e **compila da solo il campo** (correggibile a mano). È separato dal timer di recupero, che parte come sempre a fine serie/giro.
  - In **Analisi** la metrica si adatta da sola: per gli esercizi a tempo traccia i **secondi totali** tenuti (o **carico × secondi** se usi una zavorra), invece del tonnellaggio.

### v1.5.0
- **Nuova modalità Circuito**: oltre all'esercizio singolo e alla super serie, ora puoi creare un **Circuito** — più esercizi eseguiti in fila **senza pausa tra loro**, con **un solo recupero a fine giro**, ripetuto per il numero di giri scelto. Esempio: *Circuito x3 → Curl addome 15 rep, Curl addome basso 10 rep, 60s di recupero*, il tutto per 3 volte.
  - In **Pianificazione** un selettore *Tipo* (Esercizio Singolo / Circuito) mostra il form dedicato: numero giri, recupero di fine giro e una **lista dinamica di esercizi** (aggiungi/rimuovi/**riordina con ▲▼**). Il **peso è opzionale** (lascialo a 0 per gli esercizi a corpo libero).
  - In **Workout** il circuito si registra **un giro alla volta** (tutti gli esercizi insieme); al salvataggio del giro parte in automatico il recupero, con l'indicatore *"(ultima)"* sull'ultimo giro previsto.
  - In **Analisi** ogni esercizio del circuito ottiene la **propria linea di volume** individuale (non un blocco aggregato).

### v1.4.0
- **Avviso di fine recupero anche a schermo spento / app in background** (Android): oltre a vibrazione + beep, l'app mostra ora una **notifica di sistema** al termine del timer. È l'unico canale che il telefono fa vibrare e suonare quando la pagina non è in primo piano — la Vibration API del browser, in quel caso, viene *ignorata dal sistema* (limite di piattaforma, non un bug). Il permesso Notifiche viene chiesto una sola volta, all'avvio di un timer. Toccando la notifica si riapre l'app.
- **Timer di recupero immune al congelamento in background**: il conteggio ora si basa sull'**orario di fine assoluto** invece che sul semplice decremento al secondo. I browser mobili rallentano o congelano i timer JavaScript delle pagine non visibili; con questo cambiamento, riaprendo l'app il tempo mostrato è sempre corretto e l'avviso scatta immediatamente se il recupero è già scaduto.

### v1.3.0
- **Sessione persistente al cambio tab**: cambiando tab durante un esercizio (per errore o per consultare altro) e tornando su *Workout*, le serie già registrate e il timer di recupero **non vengono più azzerati** — la sessione riprende esattamente da dov'era (il timer continua a scorrere anche mentre si è su un altro tab). La reinizializzazione avviene solo quando non c'è una sessione in corso.
- **Avviso di fine recupero più forte**: suono più squillante e udibile (onda *square*, volume più alto, 3 beep, risveglio dell'AudioContext su mobile) e vibrazione dal pattern più lungo e insistente. *Nota*: l'API di vibrazione del browser non consente di regolare l'intensità fisica (fissata dall'hardware del telefono), solo la durata/ripetizione del pattern.
- **Indicatore ultima serie**: accanto a "Registra Serie N" compare **"(ultima)"** quando la prossima serie da registrare è l'ultima prevista dal target; una volta salvata, quella serie viene **evidenziata in rosso chiaro** nella lista. La scelta se proseguire con altre serie o completare l'esercizio resta sempre libera.
- **Layout input Workout**: nel tab *Workout* le caselle sono ora **Ripetizioni a sinistra / Carico (kg) a destra** (invertite rispetto a prima); coerente anche nelle super serie e nella lista delle serie registrate (mostrata come "rep x kg").

### v1.2.2
- **Fix icona**: rimosso il bordo bianco attorno all'icona dell'app. Era causato dal `purpose: "any maskable"` introdotto nella 1.2.1: trattata come *maskable*, l'icona (che riempie tutto il canvas, senza "safe zone") veniva rimpicciolita e circondata da un margine. Riportato a `purpose: "any"`. Il supporto *maskable* corretto richiede un'icona dedicata (tracciato come attività futura).

### v1.2.1
- **Service Worker resiliente**: gli asset locali sono obbligatori, i CDN (Tailwind, Chart.js) sono best-effort → un CDN irraggiungibile non fa più fallire l'intera cache offline. Aggiunto **runtime caching** (le risorse scaricate a runtime vengono salvate) e un **banner "Nuova versione disponibile → Ricarica"** quando l'app si aggiorna.
- **Protocollo Brunaccioni**: le ripetizioni calcolate non scendono più sotto 1 (le settimane con `-1`/`-2` rep erano potenzialmente ≤ 0 con reps base basse).
- **Coerenza dati**: la settimana viene salvata nello storico come numero; `parseInt` con radix esplicita ovunque.
- **Manifest PWA**: aggiunti `description`, `id`, `lang`, `scope`, `categories` per migliorare l'installabilità.
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
