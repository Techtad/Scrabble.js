# Opis projektu:
Projekt jest klonem gry planszowej Scrabble zaimplementowanym w technologiach Node.js oraz Three.js
W tej wersji możliwa jest rozgrywka dla dwóch graczy.

# Instalacja i uruchamianie:
Projekt wymaga zainstalowanego pakietu [node.js](https://nodejs.org/en/)

1. Pobrać [projekt](https://github.com/Techtad/scrabble) jako [.zip](https://github.com/Techtad/scrabble/archive/master.zip) i wypakować, lub użyć `git clone https://github.com/Techtad/scrabble.git`<br>
2. Uruchomić wiersz poleceń w głównym katalogu aplikacji<br>
3. Zainstalować moduły za pomocą `npm i` (tylko przy pierwszym uruchomieniu)<br>
4. Uruchomić serwer za pomocą `node server.js`<br>
5. Wejść w przeglądarce na adres ip komputera na którym został uruchomiony serwer (port 3000)<br>

# Rozgrywka:
1. Każdy gracz wchodzi do gry otwierając w przeglądarcie adres serwera hostującego grę na porcie 3000 (np: http://localhost:3000)
2. Kiedy jest jego tura, gracz może z klocków dostępnych na jego tacce ułożyć na planszy słowo. Jeśli to słowo jest poprawne, ten gracz otrzyma punkty równe ilości liter ułożonego słowa.
4. Pierwsze słowo położone na planszy musi znajdować się na żółtym polu na środku planszy.
5. Gracz może też zdecydować się wymienić dowolną liczbę klocków ze swojej tacki.
6. Ułożenie słowa lub wymiana klocków kończy turę gracza.
7. Gra kończy się, kiedy każdy z graczy dwa razy pod rząd nie ułoży słowa(wymienia 0 lub więcej klocków).
8. Wygrywa gracz, który ma najwięcej punktów. Możliwy jest remis.

#Autorzy
 - [Tadeusz Kantor](https://github.com/Techtad)
 - [Jakub Szwast](https://github.com/Shwastoo)