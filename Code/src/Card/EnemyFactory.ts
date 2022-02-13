import { CardFactory } from "./CardFactory";
import { Card } from "./Card";
import { Enemy } from "./Enemy";

export class DwarfFactory extends CardFactory {

    public CreateCard(receipe:JSON, nb:number) : Array<Card> {

        if (!this.verify_receipe(receipe)) {
            throw new TypeError("La recette donnée n'est pas compatible !");
        }
        let cards : Array<Card> = [];
        for (let i = 0; i < nb; i++) {
            cards.push(new Enemy(receipe['name'], receipe['fight_value'], receipe['gold_value'], receipe['end_mine']));
        }
        return cards;
    }

    public verify_receipe(receipe:JSON) : boolean {
        return false;
    }
}