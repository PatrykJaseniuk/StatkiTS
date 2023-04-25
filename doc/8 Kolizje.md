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
Na początek usunę z projektu wszystkie inne wersje programu. Będzie  tylko jedna bez menu.
