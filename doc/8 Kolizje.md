# Cel 🥅
Elementy świata, które będą 'wiedzieć' kiedy kolidują ze sobą.

# 8.0
Skorzystam z biblioteki https://github.com/Prozi/detect-collisions, która umożliwi detekcję kolizji.

Rozbudowuję strukturę świata(danych) :
![Untitled](Diagram%20Klas-obiektów.canvas)
Podstawowe nowe elementy umożliwiające kolizje to:
+ CollidingPoint
+ CollidingTriangle

ColidingPoint i CollidingTriangle będą się znajdować w jednym Obiekcie (System) z biblioteki `detect-collisions`. Funkcja Realizująca kolizję będzie zaczynać od tego obiektu. Interesują mnie tylko kolizje punktów z trójkątami. Kiedy funkcja znajdzie kolizje pomiędzy punktem a trójkątem, zapisuje referencje na ten punkt w trójkącie. Punkt posiada referencję na inny obiekt, który będzie potrzebny do zrobienia czegoś z tym właśnie obiektem, który koliduje z trójkątem.  

# 8.1 🚿
Sprzątanie

### 8.1.1
Na początek usunę z projektu wszystkie inne wersje programu. Będzie  tylko jedna. Nie będzie menu.

### 8.1.2
Zmienię nazewnictwo. Kontenery Elementów świata `WorldElement` będą się nazywać :  [nazwaElementuSwiata]s. Ponadto klasa `WorldElements` nie będzie szablonem, bo nie ma takiej potrzeby.

# 8.2
Dodałem klasę [Triangle](Triangle.ts) 

# 8.3 
Testy

# 8.4
Debugowanie.
### Problem 
Trójkąt, który koliduje z punktem, po wywołaniu metody `update` na `colisionSystem` powinien mieć w sobie pary wszystkich punktów, które z nim kolidują, oraz `overlapV` dla tego punktu.    
Podczas debugowania zauważyłem, że `collisionSystem` właściwie znajduje punkty overlapV i trójkąty, wywołuje dla tych kolizji funkcje, które zapisują tę informację w odpowiednim `CollidingTriangle`. Jednak po metodzie `update` w obiekcie `CollidingTriangle` znajduje się inny overlapV. 
### Rozwiązanie
Problem wynikał z referencji na ten sam obiekt overlapV, który później był modyfikowany. Wystarczyło wykonać kopię wartości. Jednak nie wiem, gdzie dokładnie następuje nadpisanie. 
