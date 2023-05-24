# Cel 🥅
Stworzyć elementy świata, które będą symulowały oddziaływania z płynami (żagiel z powietrzem, miecz z wodą).
🌊 🌬️

# 11.1
Stworzę dwa elementy świata:
+ `Fluid`
+ `FluidInteractor`??? czy jakoś inaczej (np. żagiel, czy statecznik)
### Problem (memory leak)

w elemencie świata `Viewline` w metodzie `update` występował wyciek pamięci. (tworzone były obiekty, które po pewnym czasie przestawały być potrzebne, jednak jakiś obiekt wciąż posiadał do nich referencje). 

### Rozwiązanie 
Zamienię obiekt `THREE.Line` na `THREE.box`

Ok mam dwa żagle przymocowane "linami" do kadłuba statku.

Teraz dodam miecz.