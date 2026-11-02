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

Paleta podstawowa: `src/theme.css`. Główna `#f92700`, podstrony i rozwinięte elementy czarne. Brandowe logotypy wyświetlane monochromatycznie przez CSS. Tło całej strony tworzy delikatne, wstępnie wygładzone ziarno `public/logos/canvas-soft.webp` (128 × 128 px), wyświetlane w stałych 128 × 128 CSS px. Skala tła jest niezależna od rozmiaru logo: ostry splot pomniejszany do włókien węższych niż piksel powodował morę przy różnych DPR i poziomach zoomu. Lanczos i rozmycie z uwzględnieniem sąsiednich powtórzeń usuwają podpikselowy rytm i ostre łączenia. Oryginalna bitmapa służy jako logo w nagłówku i stopce. Maska CSS wygasza zewnętrzne marginesy płótna wokół znaku. Szczegóły materiału: `public/logos/SOURCES.md`.

Ponowny eksport faktury: `python scripts/build-canvas-texture.py` (Pillow, tylko narzędzie autorskie; zwykły build strony nie wymaga Pythona). Przy zmianach tła sprawdzać także DPR 1 i skalowanie 80–125%, nie tylko Retina.

Pralka w nagłówku losuje jeden z pięciu stylów: inwersję wszystkich kolorów, fonty szeryfowe i ozdobne, błękit zamiast czerwieni, czerń na bieli lub biel na czerni. Efekty zastępują się i nie powtarzają bezpośrednio po sobie. Przytrzymanie przycisku lub Shift + klik przywraca styl podstawowy. Wybór pozostaje aktywny podczas przechodzenia między podstronami w tej samej karcie (`sessionStorage`). Każde odświeżenie strony przywraca styl podstawowy i usuwa zapamiętany wariant. Obsługa: `src/style-washer.js`.

Laser w kolorze `#FF7F00` zastępuje kursor myszy i rozszerza obręcz nad linkami, przyciskami i pozostałymi kontrolkami. Nad klikalnym elementem emituje drobne iskry z miejsca kontaktu; kliknięcie dodaje krótki rozbłysk odprysków. Cząstki opadają i zanikają, a ich liczba jest ograniczona do 32. Po opuszczeniu elementu emisja ustaje. Kliknięcie zwęża punkt, klawiatura przywraca zwykły kursor. Efekt kursora jest wyłączony na ekranach dotykowych oraz przy ograniczonych animacjach. Obsługa: `src/pointer-light.js`, `src/pointer-light.css`.

Zdjęcie przy kontakcie: `public/PXL_20231124_165042270.jpg`, oryginalny plik przesłany przez Mateusza. Sekcja `contact.has-photo` pokazuje fotografię obok tekstu na desktopie i pod tekstem na telefonie, zachowując pełne proporcje.

Karty aktualnych przedsięwzięć: płaski układ typograficzny z równymi odstępami i monochromatycznymi logotypami. Widoczna lewa krawędź znaków jest wyrównana do tekstu, z kompensacją przezroczystych marginesów Zero Camps i Ciepła. Ruch ograniczony do 3 px przy najechaniu lub fokusie, z obsługą ograniczonych animacji. Bez skryptów przewijania i głębi 3D.
