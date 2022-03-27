import { GameBoard } from "../Game/GameBoard";

import { Card } from "../Card/Card";
import { Stack } from "../Card/Stack";
import { Bonus } from "../Card/Bonus";
import { Dwarf } from "../Card/Dwarf";
import { Enemy } from "../Card/Enemy";
import { Treasure } from "../Card/Treasure";

import { SpecialCard } from "./Treasure/SpecialCard";

import { debugValue } from "../Launcher";

export class Picker {
    public isShut: boolean = false;
    private specialCard = new SpecialCard();

    public async pickerAction(card:Card, noMine:number, gameboard:GameBoard, idPlayer:number) {  
        if (debugValue) { console.log('[DEBUG] Begining of the picker action'); }

        for (let i=0; i < (card as Dwarf).first_value; i++) {
            if (debugValue) { console.log('[DEBUG] Begin of the loop'); }

            let mine_card = gameboard.mines[noMine].collection.shift(); 

            if (mine_card instanceof Bonus) {
                this.pickerActionBonus(card, mine_card, noMine, gameboard, idPlayer);
            }
            else if (mine_card instanceof Dwarf) {
                this.pickerActionDwarf(card, mine_card, noMine, gameboard, idPlayer);
            }
            else if (mine_card instanceof Enemy) { 
                if (!this.pickerActionEnemy(card, mine_card, noMine, gameboard, idPlayer)) { 
                    gameboard.recruitCenter.addCard(card); 
                    gameboard.players[idPlayer].mines[noMine].removeCard(card);
                    return 
                }
            }
            else if (mine_card instanceof Treasure) {
                await this.pickerActionTreasure(card, mine_card, noMine, gameboard, idPlayer)
                if (this.isShut) { 
                    gameboard.recruitCenter.addCard(card); 
                    gameboard.players[idPlayer].mines[noMine].removeCard(card); 
                    return; }
            }
            else {
                this.dispNotImplemented(gameboard.unUsedCards, mine_card);
            }        
        }  
        gameboard.recruitCenter.addCard(card); 
        gameboard.players[idPlayer].mines[noMine].removeCard(card);
    }

    private pickerActionBonus(card:Card, mine_card:Card, noMine:number, gameboard:GameBoard, idPlayer:number) {
        if (debugValue) { console.log('[DEBUG] pickerActionBonus'); }
        console.log(`The "${card.name}" has mined a "${mine_card.name}" in the mine ${noMine+1}!`);
        this.cardMinedAction(mine_card, noMine, gameboard, idPlayer);
    }

    private pickerActionEnemy(card:Card, mine_card:Card, noMine:number, gameboard:GameBoard, idPlayer:number) : boolean {
        if (debugValue) { console.log('[DEBUG] pickerActionEnemy'); }
        let type = mine_card.typeName;
        switch (type) {
            case 'Other':
                console.log(`The "${card.name}" has mined a "${mine_card.name}" in the mine ${noMine+1}!`);
                this.cardMinedAction(mine_card, noMine, gameboard, idPlayer);
                break;
            case 'Meetings':
                console.log(`The "${card.name}" has found a "${mine_card.name}" in the mine ${noMine+1}!`);
                return this.cardMinedAction(mine_card, noMine, gameboard, idPlayer);
            default:
                this.dispNotImplemented(gameboard.unUsedCards, mine_card);
        }
        return true;
    }

    private async pickerActionTreasure(card:Card, mine_card:Card, noMine:number, gameboard:GameBoard, idPlayer:number) {
        if (debugValue) { console.log('[DEBUG] pickerActionTreasure'); }
        console.log(`The "${card.name}" has found a "${mine_card.name}" in the mine ${noMine+1}!`);
        await this.cardMineActionTreasure(mine_card, noMine, gameboard, idPlayer);
    }

    private pickerActionDwarf(card: Card, mine_card: Card, noMine: number, gameboard: GameBoard, player: number) {
        if (debugValue) { console.log('[DEBUG] pickerActionDwarf'); }
        console.log(`The "${card.name}" has found a "${mine_card.name}" in the mine ${noMine+1}!`);
        this.cardMinedAction(mine_card, noMine, gameboard, player);
    }

    public combatValue(idPlayer: number, noMine: number, gameboard: GameBoard) : number {
        let combatValue: number = 0;
        for (let card of gameboard.players[idPlayer].mines[noMine].collection) {
            if (debugValue) {
                console.log(`[DEBUG] Name ${card.name}`);
                console.log(`[DEBUG] First ${(card as Dwarf).first_value}`);
                console.log(`[DEBUG] Second ${(card as Dwarf).second_value}`);
            }
            if (card.typeName == 'Warrior') {
                combatValue += (card as Dwarf).first_value;       
            }
            else if (card.typeName == 'Picker') {
                combatValue += (card as Dwarf).second_value;
            }
        }
        return combatValue;
    }

    private cardMinedAction(card: Card, noMine: number, gameboard: GameBoard, idPlayer: number) : boolean {
        if (debugValue) { console.log('[DEBUG] cardMinedAction'); }

        let cardType = card.typeName;
        let cardName = card.name;

        if (debugValue) { console.log(`[DEBUG] cardType ${cardType}`); console.log(`[DEBUG] cardName ${cardName}`); }


        if (card instanceof Bonus || card instanceof Dwarf) {
            if (debugValue) { console.log('[DEBUG] case Bonus or Dwarf'); }

            if (cardType == 'Bonus' || cardType == 'Dwarf') {
                if (gameboard.players[idPlayer].playerHand.collection.length < 6) {
                    console.log(`The card ${cardName} from mine°${noMine+1} has been added to the "Hand" of player ${idPlayer+1}`);
                    gameboard.players[idPlayer].playerHand.addCard(card);
                }
                else {
                    console.log(`You haven\'t enough place to store the card ${cardName}, the card has been discarded`);
                    gameboard.recruitCenter.addCard(card);
                }
            }
            else {
                this.dispNotImplemented(gameboard.unUsedCards, card);
            }
        }
        else if (card instanceof Enemy) {
            if (debugValue) { console.log('[DEBUG] case Enemy'); }
            switch (cardType) {
                case 'Other':
                    console.log(`The card ${cardName} from mine n°${noMine+1} has been added to the "Tresasure collection" of player ${idPlayer+1}`);
                    gameboard.players[idPlayer].treasure.addCard(card);
                    break;
                case 'Meetings':
                case 'End_Mine':
                    let playerCombatValue = this.combatValue(idPlayer, noMine, gameboard);
                    let monsterCombatValue = (card as Enemy).fight_value;
        
                    if (debugValue) { console.log(`[DEBUG] Player combat value ${playerCombatValue}`); console.log(`[DEBUG] Monster combat value ${monsterCombatValue}`); }
        
                    if (playerCombatValue >= monsterCombatValue) {   
                        console.log(`The card ${cardName} from mine n°${noMine+1} has been defeat and added to the "Tresasure collection" of player ${idPlayer+1}`);
                        gameboard.players[idPlayer].treasure.addCard(card);
                    }
                    else {
                        console.log(`The ${cardName} from mine n°${noMine+1} is too strong for the player ${idPlayer+1}`);
                        console.log(`The ${cardName} came back to the mine`);
                        gameboard.mines[noMine].addCardToBegin(card);
                        return false;
                    }
                    break;      
                default:
                    this.dispNotImplemented(gameboard.unUsedCards, card);
            }
        }
        else {
            this.dispNotImplemented(gameboard.unUsedCards, card);  
        }
        return true;
    }

    private async cardMineActionTreasure(card: Card, noMine: number, gameboard: GameBoard, idPlayer: number) {
        if (debugValue) { console.log('[DEBUG] case Treasure'); }

        let cardType = card.typeName;
        let cardName = card.name;
        if (cardType == 'Special_treasure' || cardType == 'End_mine') {
            switch (cardName) {
                case 'Hearth_gold':     // A tester car je suis pas sûr que ça fonctionne
                    this.isShut = await this.specialCard.Hearth_gold(gameboard, idPlayer, noMine, card);
                    break; 
                case 'Unique_rings':
                    await this.specialCard.Unique_ringsAction(gameboard, idPlayer, noMine, card);
                    break;
                case 'Grödur_ghost':
                    await this.specialCard.Grodur_ghost(gameboard, idPlayer, card);
                    break;
                case 'Throne_room':
                    await this.specialCard.Throne_room(gameboard, idPlayer, card);
                    break;
                /*case 'Behind_door':
                    // Comme une envie de mourir car il faut rajouter des conditions de partout ..
                    break;*/
                default:
                    this.dispNotImplemented(gameboard.unUsedCards, card);
            }
        }
        else {
            this.dispNotImplemented(gameboard.unUsedCards, card);
        }
    }

    private dispNotImplemented(stack:Stack, card:Card) : void {
        console.log(`Action for the mine card ${card.name} of type ${card.typeName} not implemented ;(`); 
        console.log('The card has been add to the unUsedCard stack (temporary solution)');
        stack.addCard(card);
    }
}