import { Vector2 } from "three";
import { Position } from "./Position";
import { PositionRotation } from "./PositionRotation";
import { WorldElement, WorldElements } from "./Template";
import { ViewLine } from "./View";

export class Triangle implements WorldElement {
    readonly position0: Position;
    readonly position1: Position;
    readonly position2: Position;

    readonly positionRotation: PositionRotation;

    private readonly lines: ViewLine[] = [];


    constructor(position0: Position, position1: Position, position2: Position, positionRotation: PositionRotation) {
        this.position0 = position0;
        this.position1 = position1;
        this.position2 = position2;

        this.positionRotation = positionRotation;

        this.lines.push(new ViewLine(this.position0, this.position1));
        this.lines.push(new ViewLine(this.position1, this.position2));
        this.lines.push(new ViewLine(this.position2, this.position0));

        triangles.addElement(this)
    }
    destroy(): void {
        this.lines.forEach((line) => {
            line.destroy();
        });
        triangles.removeElement(this)
    }

    update(): void {
        const positionRotation = this.getPositionRotation();
        this.positionRotation.position.value = positionRotation.position.value;
        this.positionRotation.rotation = positionRotation.rotation;
    }


    private getPositionRotation(): PositionRotation {
        const botomEdge = this.position0.value.clone().sub(this.position1.value);
        const ortoganalToBotomEdge = new Vector2(-botomEdge.y, botomEdge.x); // rotate 90 degrees, GPT proposition
        const rotationOfTriangle = Math.atan2(ortoganalToBotomEdge.y, ortoganalToBotomEdge.x);

        const centerOfTriangle = this.position0.value.clone().add(this.position1.value).add(this.position2.value).divideScalar(3); // GPT proposition

        const positionRotation = { position: new Position(centerOfTriangle), rotation: rotationOfTriangle };
        return positionRotation;
    }
    setPosition(position: Vector2) {
        const positionRotation = this.getPositionRotation();
        const positionDifference = position.clone().sub(positionRotation.position.value);
        this.position0.value.add(positionDifference);
        this.position1.value.add(positionDifference);
        this.position2.value.add(positionDifference);
    }

    //GPT proposition
    setRotation(rotation: number) {
        const positionRotation = this.getPositionRotation();
        const rotationDifference = rotation - positionRotation.rotation;
        const rotationMatrix = new Vector2(Math.cos(rotationDifference), Math.sin(rotationDifference));
        this.position0.value.sub(positionRotation.position.value);
        this.position1.value.sub(positionRotation.position.value);
        this.position2.value.sub(positionRotation.position.value);

        this.position0.value = new Vector2(this.position0.value.x * rotationMatrix.x - this.position0.value.y * rotationMatrix.y, this.position0.value.x * rotationMatrix.y + this.position0.value.y * rotationMatrix.x);
        this.position1.value = new Vector2(this.position1.value.x * rotationMatrix.x - this.position1.value.y * rotationMatrix.y, this.position1.value.x * rotationMatrix.y + this.position1.value.y * rotationMatrix.x);
        this.position2.value = new Vector2(this.position2.value.x * rotationMatrix.x - this.position2.value.y * rotationMatrix.y, this.position2.value.x * rotationMatrix.y + this.position2.value.y * rotationMatrix.x);

        this.position0.value.add(positionRotation.position.value);
        this.position1.value.add(positionRotation.position.value);
        this.position2.value.add(positionRotation.position.value);
    }

    getNormal(): Vector2 {
        const botomEdge = this.position0.value.clone().sub(this.position1.value);
        const ortoganalToBotomEdge = new Vector2(-botomEdge.y, botomEdge.x); // rotate 90 degrees, GPT proposition
        return ortoganalToBotomEdge.normalize();
    }
}

export const triangles = new WorldElements()