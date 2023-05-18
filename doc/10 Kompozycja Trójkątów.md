# Cel 🎯
Stworzyć kompozycje trójkątów i poszerzyć metody pochodnych trójkąta (np. `DynamicTriangle` o dodawanie oddziaływania pomiędzy nim a `DynamicElement`). 

# 10.1 
System kolizji nie może być stworzony z trójkątów kolidujących, ponieważ `DynamicElements` będą mogły wnikać w kompozycje trójkątów na krawędziach trójkątów. Zamiast trójkąta kolidującego potrzebuje wielokąt kolidujący, który razem z trójkątem dynamicznym będzie tworzył dynamiczno-kolidujący obiekt.  

### Rozwiązanie 
W ogóle zrezygnowałem z kompozycji trójkątów. Stworzyłem nowe elementy świata: 
+ `CollidingPolygon`
+ [DynamicCollidingPolygon](DynamicCollidingPolygon.ts)

# 10.2 
Zauważyłem błędy w działaniu modelu:
+ kolizje nie zachowują się właściwie (siła nie działa zgodnie z wektorem overlapV)
+ widoczny brak zachowania pędu, kiedy ustawie sprężystość pomiędzy dynamicznymiElementami wielokąta na małą wartość. 

### Rozwiązanie
sprawdzę zachowanie pędu dla układu.
System zachowuje pęd. Wskaźnik jest obiektem dynamicznym o bardzo dużej masie, w którym był ukryty pozornie brakujący pęd.
Poruszanie myszką 'teleportuje' wskaźnik do określonej pozycji, jednak prędkość pozostaje taka sama. 