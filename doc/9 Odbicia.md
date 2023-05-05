# Cel 🎯
Poprawić aktualną reakcję na kolizje.

# 9.1 
Aktualizuje system kolizji w tym samym momencie co cały model molekularny. Spowodowało to:
+ +odbicia są prawidłowe (zachowanie pryncypiów ruchu)
+ - znaczny spadek liczby klatek w czasie. 

# 9.2
Poprawa wydajności

#### Obserwacje
+ Firefox doświadcza spadku FPS poniżej 60 
+ Chrome utrzymuje 60 FPS

#### Rozwiązanie 
Rozszerzę testy ElementówSwiata o test złożoności obliczeniowej. (zmierzę czas potrzebny na aktualizację elementu). 

Jest wyświetla czas wykonania każdego z testów. 

#### Obserwacje
Każde kolejne wywołanie funkcji `colisionSystem.update` jest bardziej złożone obliczeniowo (trawa dłużej). Tak jakby były dodawane nowe obiekty do systemu. 🤔

#### Rozwiązanie problemu 
problem był spowodowany wyciekiem pamięci (memory leaking) w obiektach klasy `DynamicCollidingTriangle`.  Poprawiłem metodę update tej klasy. Dodałem jedną linijkę, która opróżnia kontener. 

```ts
update(): void {
this.springInteractions.forEach((e) => e.destroy());
this.springInteractions.length = 0; // dodałem tą linijke 

this.collidingTriangle.collidingPointsOverlapVectors.forEach((e) => {
!this.isPointFromThisTriangle(e.collidingPoint) && this.handleCollision(e);
});

}
```
