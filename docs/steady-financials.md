# Wykres Steady

KRS 0001078818. Na karcie znajduje się wyłącznie mały wykres rocznych przychodów 2024–2026; zysk jest w dymkach. Bez dużej liczby, osobnego podpisu o kontraktach, etykiety estymacji i sformułowań zależnych od bieżącej daty.

| Rok | Przychody, PLN | Zysk, PLN | Źródło i zakres |
| --- | ---: | ---: | --- |
| 2024 | 1 101 122 | 88 254 | Podsumowanie załączonego raportu BizRaport; zysk netto |
| 2025 | 1 754 675 | 33 959 | Podsumowanie załączonego raportu BizRaport; zysk netto |
| 2026 | 2 150 000 | 80 000 | Dane podane i potwierdzone przez Mateusza, oparte na konkretnych gwarantowanych kontraktach |

Źródło 2024–2025: przesłany przez Mateusza PDF „STEADY SP. Z O.O. _ KRS_ 0001078818 _ BizRaport.pdf”, otrzymany 2026-11-03, sekcja „Podstawowe wyniki finansowe”. Kwoty są w pełnych PLN, z dokładnością taką jak w podsumowaniu PDF. „Przychody” odnoszą się do ogólnych przychodów tego podsumowania, a nie dokładnej pozycji A.I RZiS; nie mieszamy tych miar z wykresem sprzedaży KISS. Plik wejściowy nie jest publikowany na stronie.

Dane 2026 nie pochodzą z zamkniętego sprawozdania. Mateusz potwierdził ich pewność, zgodził się na publikację jako danych i poprosił o sam wykres, bez podpisu „obrót zabezpieczony kontraktami na 2026 rok”. Zachowujemy je jako stałe dane tego roku; nie ma automatycznej zmiany statusu ani tekstu zależnego od czasu. W dymku 2026 etykieta brzmi „Zysk”, ponieważ nie określono, czy kwota jest wynikiem netto. Dla 2024 i 2025 etykieta to „Zysk netto”, zgodnie z PDF.

Jedyne wejście liczbowe: `src/steady-data.json`. Generator `scripts/update-steady-chart.mjs` tworzy statyczny SVG wraz z opisem wszystkich kwot; `src/steady-chart.js` czyta te same dane do dymków. `npm run charts:generate` aktualizuje HTML, a `npm run charts:check` sprawdza zgodność przed buildem. Wspólna obsługa dymków Steady i KISS (`src/chart-tooltip.js`) działa myszą, klawiaturą i dotykiem, utrzymując jeden otwarty panel.
