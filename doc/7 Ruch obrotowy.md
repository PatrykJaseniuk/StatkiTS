# Cel 🥅
Sprawić, aby Obiekty mogły się obracać

# 7.0
## Rozwiązanie 1
Standardowe wykonanie polegałoby na rozbudowie modelu dynamiki o wartości opisujące ruch w przestrzeni obrotu, tzn.:
+ kąt 
+ prędkość kątowa
+ przyspieszenie kątowe
+ moment bezwładności (czemu to się nazywa moment? Nie lepiej by było : bezwładność kątowa)
+ moment siły (też wolałbym określenie siła kątowa)
Model oddziaływań musiałby być rozbudowany o generowanie sił kątowych.
Oddziaływanie musiałoby być rozbudowane o punk przyczepienia i z punktu przyczepienia i wektora siły wyznaczyłbym siłę kątową. 

## Rozwiązanie 2
Za pomocą oddziaływań mogę połączyć ze sobą dwa punkty.
Te dwa punkty będą stanowiły bryłę obrotową. I tyle.
Takie rozwiązanie jest bliższe rzeczywistości. Ponieważ każda bryła obrotowa jest zbiorem punktów, które nie mają kierunku (kąta obrotu). Pomiędzy tymi punktami istnieją oddziaływania. Zbiór punktów, pomiędzy którymi istnieją oddziaływania, można nazwać bryłą. Bryła obraza się, jeżeli punktu poruszają się z różną prędkością. Bryła jest sztywna, jeżeli odległości pomiędzy punktami pozostają stałe.      

W tym przypadku model bryły obrotowej będzie się składał z trzech, a nie z dwóch punktów, ponieważ łatwiej będzie zasymulować oddziaływania tej bryły z inną.  

## Realizacja

Skorzystałem z rozwiązania 2

# 7.1 
Stworzę element świata, który będzie rozszerzeniem dotychczasowego elementu dynamicznego o wymiar obrotu [DynamicElement](DynamicElement.ts) .
