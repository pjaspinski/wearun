# Wearun

## Uruchamianie testów

`coverage run -m unittest discover -v backend "*_test.py"`

Generowanie raportu tekstowego:
`coverage report --omit="*/unit_tests/*"`

Generowanie raportu html:
`coverage html --omit="*/unit_tests/*"`

## Research

### [Impact of Clothing on Exercise in the Heat](https://link-1springer-1com-1000015cv1368.han.p.lodz.pl/article/10.1007/s40279-013-0047-8)

Na ciepło ciała działają następujące czynniki:

-   metabolizm dodaje ciepła
-   praca (dodaje lub odbiera)
-   +4 sposoby utraty ciepła (evaporation, conduction, convection, radiation)

Jednostka clo (clothing thermal resistance) to ilość 'ubrania' która jest potrzebna żeby nie ruszający się człowiek czuł się komfortowo w temperaturze 21 stopni.

Na izolację, którą dostarczają ubrania, wpływa 6 czynników:

-   prędkość wiatru
-   ruch ciała
-   efekt kominowy (luźne ubrania gorzej izolują)
-   bellows effect (ruchy ciała powodują większą wentylację ubrań) [więcej](https://assets.lakeland.com/catalogs/Australia/FS-Bellows-Effect-Info-sheet_AUS.pdf)
-   ograniczenie parowania - ciuchy ograniczają parowanie, a więc też stratę ciepła
-   pochłanianie potu - ciuchy lepiej chłonące pot są cieplejsze, bo wilgoć na ciele chłodzi

Naturalne materiały (wełna/bawełna) lepiej odprowadzają pot, więc lepiej chłodzą

### [Why is it Harder to Run in Humidity?](https://runningunlocked.com/why-is-it-harder-to-run-in-humidity/)

W wilgotnym otoczeniu pot wolniej odparowuje, więc człowiek gorzej się chłodzi. Przez to organizm produkuje więcej potu, co zostawia mniej energii na bieganie.

Wilgotność poniżej 30% jest uważana za zbyt niską, a powyżej 50% za zbyt wysoką.
Wilgotność poza przedziałem 30-50 wymaga lżejszego ubioru.

## Sposób działania aplikacji

Na podstawie danych o pogodzie (temperatura odczuwalna, wiatr, wilgotność) i typu treningu (rower jest szybszy, więc jest zimniej) wyznaczana jest wymagana wartość clo. Punktem bazowym do wyznaczania będzie 1 clo przy 11 stopniach (bo często mówi się, że do biegania powinno się ubierać tak jakby było 10 stopni więcej). Jak nie będzie się to sprawdzać, to jakoś doprecyzujemy

Dla każdego ciucha jest wyznaczana wartość clo - na podstawie materiału, poziomu ciepła wpisanego przez użytkownika, (?).

Następnie ciuchy dobierane są tak żeby jak najlepiej dopasować wartość clo do wymaganej - osobno dla góry i dołu.

Wpływ treningów na wymagane clo:

-   większa prędkość to więcej clo
    ...

### Sposób szukania dobrych zestawów ubrań

Przeszukiwanie w głąb. Na przykładzie topów:
Są 3 kategorie: koszulki, bluzy i kurtki

Bierzemy pierwszą koszulkę. Jeżeli jej clo jest odległe o mniej niż akceptowalna odległość od potrzebnego clo, to zapisujemy jako dobry zestaw.

Do koszulki dobieramy pierwszą bluzę. Jeżeli clo zestawu jest odległe o ..., to zapisujemy jako dobry zestaw. Jeżeli jest większe od docelowego clo to cofamy się, bo sprawdzanie dalej nie ma sensu.

Spodni trzeba szukać trochę inaczej. Są 3 kategorie: spodenki, getry i dresy. Spodenki można zakładać na getry, można też założyć same spodenki albo same getry. Dresy można założyć na getry, albo same.

Sprawdzamy w następującej kolejności:

-   same spodenki
-   same getry
-   getry i spodenki
-   dresy
-   getry i dresy
