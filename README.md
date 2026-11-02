# zguda.com

Pierwszy prototyp osobistej strony Mateusza Zgudy. Vite, JavaScript i CSS; Node.js 24, npm 11. Bez backendu i sekretów.

## Praca lokalna

```sh
npm ci
npm run dev -- --port 5173
```

Budowanie: `npm run build`. Sprawdzenie wydania: `npm run preview -- --port 4173`.

Treść strony: `index.html` i `historie/`; projekty: `src/main.js`; wygląd: `src/style.css`, `src/theme.css` i `src/canvas.css`.

## Stan redakcyjny

Wersja robocza do przeglądu: https://matyszguda.github.io/zguda.com/. Historie i role na podstawie rozmowy z Mateuszem; opisy projektów na podstawie linkowanych case studies KISS digital. Przed wdrożeniem na docelowej domenie sprawdzić chronologię, aktualność danych finansowych Ciepła, nazewnictwo organizacji i podział wkładu przy projektach. Logotypy i fotografia są zapisane lokalnie.

Fonty DM Sans i Instrument Sans pobierane z Google Fonts, z lokalnymi fallbackami. Tryb ozdobny używa Cormorant Garamond i Libre Baskerville. Brak analityki i formularzy. Historia motta zawiera zwykły link do filmu na YouTube; bez osadzonego odtwarzacza. Po zakończeniu researchu ograniczyć dostęp środowiska do niezbędnych domen; sprawdzić fonts.googleapis.com i fonts.gstatic.com oraz domeny źródeł badawczych. Publikacja środowiska Codex nie wdraża strony na zguda.com.

Paleta podstawowa: `src/theme.css`. Główna `#f92700`, podstrony i rozwinięte elementy czarne. Brandowe logotypy wyświetlane monochromatycznie przez CSS. Tło całej strony tworzy powtarzany kafelek płótna wycięty z `public/logos/logo-plotno.png`; oryginalna bitmapa służy jako logo w nagłówku i stopce. Skala splotu tła odpowiada skali bitmapy logo, również na telefonie. Maska CSS wygasza zewnętrzne marginesy płótna wokół znaku, aby nie powstawała prostokątna krawędź. Szczegóły próbki: `public/logos/SOURCES.md`.

Pralka w nagłówku losuje jeden z pięciu stylów: inwersję wszystkich kolorów, fonty szeryfowe i ozdobne, błękit zamiast czerwieni, czerń na bieli lub biel na czerni. Efekty zastępują się i nie powtarzają bezpośrednio po sobie. Przytrzymanie przycisku lub Shift + klik przywraca styl podstawowy. Wybór pozostaje aktywny podczas przechodzenia między podstronami w tej samej karcie (`sessionStorage`). Obsługa: `src/style-washer.js`.

Zdjęcie przy kontakcie: `public/PXL_20231124_165042270.jpg`, oryginalny plik przesłany przez Mateusza. Sekcja `contact.has-photo` pokazuje fotografię obok tekstu na desktopie i pod tekstem na telefonie, zachowując pełne proporcje.

Karty aktualnych przedsięwzięć: płaski układ typograficzny z równymi odstępami i monochromatycznymi logotypami. Ruch ograniczony do 3 px przy najechaniu lub fokusie, z obsługą ograniczonych animacji. Bez skryptów przewijania i głębi 3D.
