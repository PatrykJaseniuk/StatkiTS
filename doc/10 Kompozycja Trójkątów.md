# Cel 🎯
Stworzyć kompozycje trójkątów i poszerzyć metody pochodnych trójkąta (np. `DynamicTriangle` o dodawanie oddziaływania pomiędzy nim a `DynamicElement`). 

# 10.1 
System kolizji nie może być stworzony z trójkątów kolidujących, ponieważ `DynamicElements` będą mogły wnikać w kompozycje trójkątów na krawędziach trójkątów. Zamiast trójkąta kolidującego potrzebuje wielokąt kolidujący, który razem z trójkątem dynamicznym będzie tworzył dynamiczno-kolidujący obiekt.  

### Rozwiązanie 
W ogóle zrezygnowałem z kompozycji trójkątów. Stworzyłem nowe elementy świata: 
+ `CollidingPolygon`
+ [DynamicCollidingPolygon](DynamicCollidingPolygon.ts)
