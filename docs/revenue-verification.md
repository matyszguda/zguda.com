# Przychody i wyniki KISS Digital / KISS Communications

## Aktualna decyzja redakcyjna

Przy dodawaniu interaktywnych szczegółów Mateusz wybrał: **„Zastąp serię danymi z oficjalnych sprawozdań”**. Ta decyzja zastępuje poprzednie uzgodnienie, które zachowywało jego orientacyjne kwoty za 2012–2021 i pro forma TenderHut za 2022.

Wykres obejmuje teraz **2017–2022**: dostępny wspólny zakres rocznych RZiS obu spółek do roku sprzedaży. Wcześniejsze słupki usunięto, ponieważ nie potwierdzono ich podziału ani wyniku netto. Nie przeliczano kwot USD z prospektu i nie użyto prognozy na 2021 jako wykonania.

Na stronie pozostają tylko krótkie objaśnienia wskaźników; bibliografia jest w repozytorium, zgodnie z wcześniejszym życzeniem Mateusza.

## Spółki i źródła

- KISS Digital, KRS **0000435987**. Tożsamość potwierdza [oficjalny plan połączenia](https://kissdigital.com/theme/kiss/files/plan-polaczenia-sh-kd-publikacja.pdf) oraz [pełny odpis KRS](https://api-krs.ms.gov.pl/api/krs/OdpisPelny/0000435987?rejestr=P&format=json).
- KISS Communications (Human), KRS **0000617465**. [Pełny odpis KRS](https://api-krs.ms.gov.pl/api/krs/OdpisPelny/0000617465?rejestr=P&format=json); marka Human występuje też w raporcie zarządu TenderHut za 2022.
- Szczegółowe RZiS: publiczne odwzorowanie sprawozdań w [BizRaport — Digital](https://www.bizraport.pl/krs/0000435987) i [BizRaport — Communications](https://www.bizraport.pl/krs/0000617465), tabela „Rachunek zysków i strat”, okresy `p17`–`p22`. Odczyt 2026-11-03. Oryginalnych plików RDF XML nie pobrano; źródłem liczb jest publiczna transkrypcja, a nie samodzielnie zbadany oryginalny dokument.

Zapis wykorzystanych wierszy, numerów KRS, adresów i sum kontrolnych pobranych stron: [revenue-source-rows.json](./revenue-source-rows.json). Dane prezentacji: [revenue-data.json](../src/revenue-data.json).

## Definicje i kontrola

Wszystkie kwoty dotyczą pełnego roku kalendarzowego, w PLN z groszami, bez przeliczeń walutowych.

- **Przychody ze sprzedaży** = RZiS **A.I + A.IV**: sprzedaż produktów oraz towarów i materiałów. Nie jest to całe A („przychody netto ze sprzedaży i zrównane z nimi”), ponieważ A zawiera też zmianę stanu produktów i koszt wytworzenia na własne potrzeby. Nie jest to szersza seria „Przychody” z podsumowania agregatora.
- **Wynik netto** = RZiS **L** („Zysk / strata netto”, po podatku).
- **Razem** = arytmetyczna suma danych jednostkowych obu spółek w danym roku. Bez wyłączeń transakcji między spółkami; nie deklarujemy sprawozdania skonsolidowanego grupy KISS.
- Słupki i ich etykiety są w mln PLN, zaokrąglone do dwóch miejsc. Dymki i tabele zawierają dokładne PLN z groszami. Suma jest obliczana przed zaokrągleniem etykiety.

| Rok | Digital: sprzedaż PLN | Communications: sprzedaż PLN | Digital: wynik netto PLN | Communications: wynik netto PLN |
| --- | ---: | ---: | ---: | ---: |
| 2017 | 1 758 181,31 | 1 195 057,68 | −8 513,04 | 48 540,72 |
| 2018 | 2 238 722,93 | 903 470,49 | −7 901,12 | 27 304,15 |
| 2019 | 3 432 068,45 | 798 828,32 | 348 964,13 | 40 275,14 |
| 2020 | 4 315 509,30 | 1 438 696,72 | 365 961,39 | 351 068,40 |
| 2021 | 5 142 453,96 | 1 375 072,60 | −22 680,47 | −269 233,40 |
| 2022 | 4 507 051,37 | 3 808 645,38 | 21 989,90 | −179 989,01 |

Przykłady istotnych różnic definicyjnych: Digital 2021 ma A = 4 927 391,96 PLN, ale sprzedaż A.I = 5 142 453,96 PLN, ze zmianą stanu produktów −215 062 PLN. Communications 2022 ma A.I = 3 775 018,55 PLN i A.IV = 33 626,83 PLN; suma sprzedaży wynosi 3 808 645,38 PLN.

## Poprzednia wartość 2022

[Skonsolidowane sprawozdanie TenderHut za 2022, s. 50–51](https://assets-us-01.kc-usercontent.com/b9dc1b00-78e3-009e-2f3e-e73b815cfbf3/e7f83f92-505b-42c9-a201-7005e78f3d4d/TenderHut_SSF_MSSF_2022.pdf) przedstawia kwoty po przejęciu i pro forma przed przejęciem, zaokrąglone do tys. PLN. Poprzedni wykres sumował je do 8,288 mln PLN. Nie mieszamy tego ujęcia MSSF z jednostkowymi RZiS: aktualna, jednolita seria daje **8 315 696,75 PLN sprzedaży i −157 999,11 PLN wyniku netto w 2022**. Różnicy zakresu raportowania nie przypisujemy konkretnej korekcie bez dodatkowego uzgodnienia.

## Utrzymanie wykresu

`src/revenue-data.json` jest wspólnym wejściem dla dymków oraz generatora statycznego SVG i tabel bez JavaScript. Po edycji danych: `npm run charts:generate`. `npm run build` sprawdza zgodność wygenerowanego HTML z danymi, więc desktop, mobile i tabela nie mogą przypadkowo użyć różnych serii.

Wykres zespołu jest oddzielny: wartości szacowane 2018–2021 i ich oznaczenia pozostają bez zmian. Oba oznaczenia sprzedaży nadal wskazują **1 kw. 2022**.
