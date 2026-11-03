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

Paleta podstawowa: `src/theme.css`. Jednolite gładkie tło `#EFE8E4`, dobrane do nowego logo `public/logo_zguda.png`; główna `#f92700`, podstrony i rozwinięte elementy czarne. Nagłówek i stopka korzystają z oryginalnej bitmapy 1672 × 941, z maską wygaszającą puste marginesy bez zmiany znaku i cieni. Tło nie zawiera powtarzanej faktury. Pralka dopasowuje tło do przefiltrowanego logo: `#E9E9E9` w jasnej monochromatycznej wersji i `#161616` w ciemnej; kolor paska przeglądarki jest zsynchronizowany z paletą. Poprzednie warianty logo i faktury zachowano jako pliki archiwalne. Szczegóły: `public/logos/SOURCES.md`.

Easter egg: niewidoczny punkt 44 × 44 px w stopkach głównej strony i historii. Pierwsze kliknięcie odsłania animowaną pisankę, drugie otwiera `/nofollow/`. Najechanie nie pokazuje tekstu, ikony ani reakcji lasera; klawiatura ma widoczny fokus. Obsługa: `src/secret-egg.js` i `src/secret-egg.css`. Nagłówek podstrony: „Sekretna lista treści do wprowadzenia później.”; siedem tematów, `meta robots="noindex,nofollow"` i `rel="nofollow"` zachowane. Nie występuje w głównej nawigacji. Treść: `nofollow/index.html`, układ: `src/nofollow.css`.

Przychody: na desktopie pionowe słupki SVG, na mobile poziome słupki w 11 wierszach z widocznym rokiem i wartością, bez przewijania w bok. Układ mobilny pobiera wartości z istniejących `data-mln-pln` i etykiet SVG (`src/income-chart.js`), bez osobnego zbioru danych. Rok 2022 oznacza także sprzedaż do THG (TenderHut). Bez JavaScript pozostaje oryginalny wykres z podpowiedzią przewijania umieszczoną nad nim; tabela danych jest dostępna w obu układach.

Pralka działa naprzemiennie: oryginalny wygląd → losowy wariant → oryginalny wygląd → losowy wariant. Sześć wariantów to inwersja kolorów, fonty szeryfowe i ozdobne, błękit zamiast czerwieni, czerń na bieli, biel na czerni i ciemna strona z latarką. Przytrzymanie przycisku lub Shift + klik przywraca styl podstawowy. Wybór pozostaje aktywny podczas przechodzenia między podstronami w tej samej karcie (`sessionStorage`). Każde odświeżenie strony przywraca styl podstawowy i usuwa zapamiętany wariant. Obsługa: `src/style-washer.js`.

Latarka (`src/flashlight.js`, `src/flashlight.css`) przyciemnia stronę i odsłania fragment przy kursorze, dotknięciu albo elemencie wskazanym klawiaturą. Warstwa jest wyłączona poza tym wariantem i nie przechwytuje kliknięć. Pozycja jest przeliczana tylko przy interakcji, bez ciągłej pętli animacji; laser i iskry pozostają nad warstwą światła.

Laser w kolorze `#FF7F00` zastępuje kursor myszy i rozszerza obręcz nad linkami, przyciskami i pozostałymi kontrolkami. Nad klikalnym elementem emituje drobne iskry z miejsca kontaktu; kliknięcie dodaje krótki rozbłysk odprysków. Cząstki opadają i zanikają, a ich liczba jest ograniczona do 32. Po opuszczeniu elementu emisja ustaje. Kliknięcie zwęża punkt, klawiatura przywraca zwykły kursor. Efekt kursora jest wyłączony na ekranach dotykowych oraz przy ograniczonych animacjach. Obsługa: `src/pointer-light.js`, `src/pointer-light.css`.

Zdjęcie przy kontakcie: `public/PXL_20231124_165042270.jpg`, oryginalny plik przesłany przez Mateusza. Sekcja `contact.has-photo` pokazuje fotografię obok tekstu na desktopie i pod tekstem na telefonie, zachowując pełne proporcje.

Karty aktualnych przedsięwzięć: płaski układ typograficzny z równymi odstępami i monochromatycznymi logotypami. Widoczna lewa krawędź znaków jest wyrównana do tekstu, z kompensacją przezroczystych marginesów Zero Camps i Ciepła. Ruch ograniczony do 3 px przy najechaniu lub fokusie, z obsługą ograniczonych animacji. Bez skryptów przewijania i głębi 3D.
