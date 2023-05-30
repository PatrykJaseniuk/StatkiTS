symulator jest właściwie [automatem skończonym](https://pl.wikipedia.org/wiki/Automat_sko%C5%84czony) , a dokładniej [automatem Moor'a](https://pl.wikipedia.org/wiki/Automat_Moore%E2%80%99a) 

## Definicja Automatu Moor'a
Automat Moore’a jest to rodzaj [deterministycznego automatu skończonego](https://pl.wikipedia.org/wiki/Deterministyczny_automat_sko%C5%84czony "Deterministyczny automat skończony"), reprezentowany przez uporządkowaną szóstkę:

⟨ Z , Q , Y , Φ , Ψ , q 0 ⟩  

[![Moore machine-diagram.svg](https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Moore_machine-diagram.svg/200px-Moore_machine-diagram.svg.png)](https://pl.wikipedia.org/wiki/Plik:Moore_machine-diagram.svg)

gdzie:

Z = { z 1 , z 2 , … , z n }  – zbiór sygnałów wejściowych,
Q = { q 1 , q 2 , … , q n }  – zbiór stanów wewnętrznych,
Y = { y 1 , y 2 , … , y n } – zbiór sygnałów wyjściowych,
Φ – funkcja przejść,  q(t+1) = Φ(q(t),  z(t)),
Ψ – funkcja wyjść, y ( t ) = Ψ(q(t))  zależy tylko od stanu w którym znajduje się automat,
q0 – stan początkowy, należy do zbioru Q.

Bardziej czytelnie można by przedstawić to w kodzie jako:

```ts
interface Stan {}
interface Wejscie {}
interface Wyjscie {}

const automatMoora = (
aktualnyStan: Stan,
funkcjaPrzejscia: (aktualnyStan: Stan, sygnałWejsciowy: Wejscie) => Stan,
funkcjaWyjscia: (aktualnyStan: Stan) => Wyjscie,
getWejscie: () => Wejscie,
setWyjscie: (wyjscie: Wyjscie) => void,
)=>{
//uzyskuje wejscie z zewnątrz np. stan myszy
const sygnalWejsciowy = getWejscie(); 
const nowyStan = funkcjaPrzejscia(aktualnyStan, sygnalWejsciowy);
const wyjscie = funkcjaWyjscia(nowyStan);
setWyjscie(wyjscie); //np. render
return nowyStan;
}
```


## Implementacja w tym symulatorze

Ogólna koncepcja systemu jest taka:

symulator jest zbudowany z obiektów które implementują interfejs `WorldElement`
```ts
export interface WorldElement {
update(): void;
destroy(): void;
}
```

metoda `update` jest wywoływana w każdej iteracji (funkcji przejścia). Definiuje w jaki sposób aktualizować dany element świata. Np. dla klasy `FrictionInteraction`:
```ts
update(): void {
// sila tarcia zalezy od predkosci wzgledem obiektów i jest stała
let velocityDeferace = this.dynamicElement2.velocity.clone().sub(this.dynamicElement1.velocity);
let force: Vector2 = velocityDeferace.clone().normalize().multiplyScalar(this.frictionRate);
let negativeForce: Vector2 = force.clone().multiplyScalar(-1);
this.dynamicElement1.force.add(force);
this.dynamicElement2.force.add(negativeForce);
}
```

Dla każdej klasy implementującej `WorlElement` istnieje 'kontener' tych obiektów, który jest globalnym obiektem klasy  `WorldElements`. ustaliłem że nazwa kontenera będzie jak nazwa klasy z literką 's' na końcu np. dla `DynamicElement` kontener to `DynamicElements`. Każda klasa z int. `WorldElement` w konstruktorze dodaje się do swojego kontenera:
```ts
export class FrictionInteraction implements WorldElement {
    dynamicElement1: DynamicElement;
    dynamicElement2: DynamicElement;
    frictionRate: number;

    constructor(dynamicElement1: DynamicElement, dynamicElement2: DynamicElement, frictionRate: number) {
        this.dynamicElement1 = dynamicElement1;
        this.dynamicElement2 = dynamicElement2;
        this.frictionRate = frictionRate;

        //tutaj dodaje sie do globalnego kontenera
        frictionInteractions.addElement(this); 
    }
    ...
}
```
Dzieki temu że kontener jest globalny mogę w wygodny sposób tworzyć nowe obiekty, które są zagnieżdżone w innych i nie potrzebuje przekazywać przez nie wszystkie referencji do kontenera. W innych językach programowania taki kontener mógłby być atrybutem statycznym, ale w TS niema takiej możliwości.

Tak wygląda klasa `WorldElements`:
```ts
export class WorldElements {
    protected elements: WorldElement[] = [];
    update() {
        this.elements.forEach((element) => {
            element.update();
        })
    }

    removeElement(element: WorldElement) {
        this.elements = this.elements.filter((e) => e != element);
    }

    addElement(element: WorldElement) {
        this.elements.push(element);
    }

    clear() {
        this.elements = [];
    }
}
```

Wywołanie metody `update` na obiekcie `WorldElements` powoduje wywołanie metody `update` na każdym obiekcie w kontenerze.

Końcowa `funkcjaprzejścia` jest wywołaniem metody `update` dla każdego kontenera:


