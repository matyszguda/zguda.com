# zguda.com

Pierwszy prototyp osobistej strony Mateusza Zgudy. Vite, JavaScript i CSS; Node.js 24, npm 11. Bez backendu i sekretów.

## Praca lokalna

```sh
npm ci
npm run dev -- --port 5173
```

Budowanie: `npm run build`. Sprawdzenie wydania: `npm run preview -- --port 4173`.

Treść strony: `index.html`; projekty i historie: `src/main.js`; wygląd: `src/style.css`.

## Stan redakcyjny

Prototyp do przeglądu, nie opublikowana strona. Historie i role na podstawie rozmowy z Mateuszem; opisy projektów na podstawie linkowanych case studies KISS digital. Przed publikacją sprawdzić chronologię i liczby fundacji, aktualność danych finansowych Ciepła, nazewnictwo organizacji i podział wkładu przy projektach. Dodać zatwierdzone fotografie i ewentualnie adres kontaktowy. Kompozycje typograficzne przedsięwzięć są koncepcją, nie oficjalnymi znakami.

Fonty DM Sans i Manrope pobierane z Google Fonts, z lokalnymi fallbackami. Brak analityki i formularzy. Historia motta zawiera niewielki odtwarzacz YouTube (youtube-nocookie.com), bez automatycznego odtwarzania. Przed publikacją ograniczyć dostęp środowiska do niezbędnych domen; sprawdzić fonts.googleapis.com i fonts.gstatic.com oraz domeny źródeł badawczych. Publikacja środowiska Codex nie wdraża strony na zguda.com.

Paleta kontekstowa: `src/theme.css`. Białe tło; główna `#f92700`, podstrony i rozwinięte elementy `#0d6ee7`, czerń jako uzupełnienie. Brandowe logotypy wyświetlane monochromatycznie przez CSS.

Zdjęcie przy kontakcie: `public/PXL_20231124_165042270.jpg`, oryginalny plik przesłany przez Mateusza. Sekcja `contact.has-photo` pokazuje fotografię obok tekstu na desktopie i pod tekstem na telefonie, zachowując pełne proporcje.
