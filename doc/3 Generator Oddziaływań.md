# Cel 🎯
Stworzyć Element świata, który będzie tworzył i usuwał oddziaływania

# 3.0
Już posiadam stworzony element [InteractionCreator](InteractionCreator.ts). 

# 3.1
Wykończyłem element tak, że tworzy i usuwa oddziaływania. 
Chciałbym zwizualizować te oddziaływania. Mam dwa pomysły:
1) dodać metodę do Elementu [InteractionCreator](InteractionCreator.ts), która będzie zarządzać widokiem oddziaływania.
2) Stworzyć nowy Element Świata, który będzie miał referencję na oddziaływanie i narysuje je. 👌✔️   

## wykonanie
Stworzyłem nowy element `ViewLine` w pliku [View.ts](View.ts)  ,który rysuje linie na postawie referencji na dwa obiekty klasy [Position](Position.ts). Chciałem, aby kolor linii zależał od odległości, ale nie mogę to uzyskać w prosty sposób.