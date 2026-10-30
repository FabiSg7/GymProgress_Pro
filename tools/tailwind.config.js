// Configurazione del CSS Tailwind precompilato (v1.11.0): sostituisce il CDN "Play", che
// compilava le classi nel browser a ogni avvio e ritardava il primo paint (splash lenta).
// Rigenerare gymprogress-app/tailwind.css dopo OGNI classe nuova in index.html:
//   npx tailwindcss@3.4.17 -c tools/tailwind.config.js -i tools/tailwind.input.css -o gymprogress-app/tailwind.css
// (dalla cartella GymProgress_Pro). 3.4.17 è la versione che serviva il CDN: stesse regole.
// SENZA --minify: il minificatore riscrive i colori in hsla() arrotondando le percentuali
// (border-red-400/70 diventava 248,114,114 invece di 248,113,113). Col gzip la differenza
// di peso è minima. Verifica dopo ogni rigenerazione: python scripts/gym_css_check.py
// Il compilatore legge il TESTO del file: una classe composta in JS ('text-' + colore) non
// verrebbe generata. Scrivere sempre i nomi di classe per intero.
module.exports = {
	content: {
		relative: true,
		files: ['../gymprogress-app/index.html'],
	},
	theme: {
		extend: {
			// Banner "Nuova versione": sale di 8 px mentre compare (motion-safe:animate-fade-in).
			// gym_css_check.py passa questa stessa `theme` al CDN, così il confronto resta alla pari.
			keyframes: {
				'fade-in': {
					from: { opacity: '0', transform: 'translateY(8px)' },
					to: { opacity: '1', transform: 'none' },
				},
			},
			animation: { 'fade-in': 'fade-in 250ms ease-out both' },
		},
	},
	plugins: [],
};
