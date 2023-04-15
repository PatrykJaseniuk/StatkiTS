# cel 🥅 
Pointer ma generować oddziaływanie z elementami

# 6.0 
Rozbudowuje element [Interaction](Interaction.ts)  o tłumienie.

Dodałem tłumienie, które jest prostoliniowo zależne od prędkości.

Pointer [Pointer](Pointer.ts) nie generuje jakiegokolwiek oddziaływania jakby mylnie sugerował [cel 🥅](#cel%20🥅). Pointer jest elementem świata, który zawiera atrybuty  takie jak:
+ pozycja
+ czyPrzyciskKliknięty
Jego atrybuty są aktualizowane przez odpowiedniego updetera.

Jest element świata [InteractionCreator](InteractionCreator.ts) ,on posiada atrybuty takie jak:
+ pointer - referencja na pointer
+ dynamicElements[] - tablica elementów dynamicznych(referencji), które mogą oddziaływać z pointerem
+ interactions[] - tablica utworzonych interakcji, aby móc je zniszczyć w swoim czasie.
Podobnie i ten element świata jest aktualizowany przez swój updater w odpowiednim momencie. Metoda `update`, która jest wywoływana przez updetera, na podstawie aktualnego stanu:
+ pointera, czy np koliduje z obiektem
+ elementów dynamicznych zarejestrowanych do oddziaływania 
Na tej podstawie decyduje, czy utworzyć nowe oddziaływanie. Nowo utworzone oddziaływanie zaczyna "żyć" niezależnie od generatora oddziaływań.  