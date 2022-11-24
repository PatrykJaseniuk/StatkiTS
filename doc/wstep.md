# ⛵ Symulator statków wodnych o napędzie żaglowym⛵ 

## 👉 Ω 👈 Cel Projektu 
Projekt ma:
+ symulować zachowanie różnych statków żaglowych.
+ przedstawić użytkownikowi poprzez interakcję z systemem uproszczony model działania rzeczywistych statków żaglowych
+ umożliwić rywalizację miedzy użytkownikami poprzez grę multiplayer

## 👈 Α 👉  Początek/źródło Projektu
Projekt będzie miał trzy początki/ źródła które zmierzają do celu:
+ C++ i podstawowe biblioteki( dużo do zrobienia na początku projekt będzie prostszy)
+ TS i podstawowe biblioteki
+ C++ i Unreal Engine(gotowe podstawowe elementy jak np: silnik fizyki)

Poszczególne iteracja projektu będą realizowane równolegle dla tych trzech ścieżek(chociaż nie wiem czy to będzie do końca możliwe)

## Β 👉 Γ 👉 Δ 👉...  Realizacja
Projekt realizowany w stylu [eXtreme Programming, XP](https://pl.wikipedia.org/wiki/Programowanie_ekstremalne) tzn przede wszystkim: 
+ cel projektu nie jest ściśle określony
+ projekt realizuje się w małych iteracjach 
+ szczegółowo planuje się tylko o jedną iterację w przód   
+ cała struktura projektu jest plastyczna i może się zmieniać
+ testy jednostkowe przed rozpoczęciem pisania kodu

## iteracja

``` TS
let majorVersion =0;
let minorVersion =0;
while(true)
{    
    git.newBrach()
    wyznaczNowyCel();
    while(!czyCelZostałOsiągniety())
    {
        realizacjaCelu();
        git.commit();
        minorVersion++;
    }
    git.merge()
    minorVersion=0;
    majorVersion++;
}
```
