import { GameBoard } from "../Game/GameBoard";
import { Card } from "../Card/Card";
import { Bonus } from "../Card/Bonus";
import { Dwarf } from "../Card/Dwarf";
import { Enemy } from "../Card/Enemy";
import { Treasure } from "../Card/Treasure";

import { debugValue } from "../Launcher";

import { prompt } from "../Module/Question";

export class Picker {
    private isShut: boolean = false;

    public async pickerAction(card:Card, noMine: number, gameboard: GameBoard, player: number) {  
        if (debugValue) { console.log('[DEBUG] Begining of the picker action'); }

        for (let i=0; i < (card as Dwarf).first_value; i++) {
            if (debugValue) { console.log('[DEBUG] Begin of the loop'); }

            let mine_card = gameboard.mines[noMine].collection.shift(); 

            if (mine_card instanceof Bonus) {
                this.pickerActionBonus(card, mine_card, noMine, gameboard, player);
            }
            else if (mine_card instanceof Dwarf) {
                this.pickerActionDwarf(card, mine_card, noMine, gameboard, player);
            }
            else if (mine_card instanceof Enemy) { 
                if (!this.pickerActionEnemy(card, mine_card, noMine, gameboard, player)) { 
                    gameboard.recruitCenter.addCard(card); 
                    gameboard.players[player].mines[noMine].removeCard(card);
                    return 
                }
            }
            else if (mine_card instanceof Treasure) {
                await this.pickerActionTreasure(card, mine_card, noMine, gameboard, player)
                if (this.isShut) { 
                    gameboard.recruitCenter.addCard(card); 
                    gameboard.players[player].mines[noMine].removeCard(card); 
                    return; }
            }
            else {
                this.dispNotImplemented(mine_card.name, mine_card.typeName, gameboard, card);
            }        
        }  
        gameboard.recruitCenter.addCard(card); 
        gameboard.players[player].mines[noMine].removeCard(card);
    }

    private pickerActionBonus(card: Card, mine_card: Card, noMine: number, gameboard: GameBoard, player: number) {    // Manque le test de puissance de combat
        if (debugValue) { console.log('[DEBUG] pickerActionBonus'); }
        console.log(`The "${card.name}" has mined a "${mine_card.name}" in the mine ${noMine+1}!`);
        this.cardMinedAction(mine_card, noMine, gameboard, player);
    }

    private pickerActionEnemy(card: Card, mine_card: Card, noMine: number, gameboard: GameBoard, player: number) : boolean {
        if (debugValue) { console.log('[DEBUG] pickerActionEnemy'); }
        let type = mine_card.typeName;
        switch (type) {
            case 'Other':
                console.log(`The "${card.name}" has mined a "${mine_card.name}" in the mine ${noMine+1}!`);
                this.cardMinedAction(mine_card, noMine, gameboard, player);
                break;
            case 'Meetings':
                console.log(`The "${card.name}" has found a "${mine_card.name}" in the mine ${noMine+1}!`);
                return this.cardMinedAction(mine_card, noMine, gameboard, player);
            default:
                this.dispNotImplemented(mine_card.name, mine_card.typeName, gameboard, card);
        }
        return true;
    }

    private async pickerActionTreasure(card: Card, mine_card: Card, noMine: number, gameboard: GameBoard, player: number) {
        if (debugValue) { console.log('[DEBUG] pickerActionTreasure'); }
        console.log(`The "${card.name}" has found a "${mine_card.name}" in the mine ${noMine+1}!`);
        await this.cardMineActionTreasure(mine_card, noMine, gameboard, player);
    }

    private pickerActionDwarf(card: Card, mine_card: Card, noMine: number, gameboard: GameBoard, player: number) {
        if (debugValue) { console.log('[DEBUG] pickerActionDwarf'); }
        console.log(`The "${card.name}" has found a "${mine_card.name}" in the mine ${noMine+1}!`);
        this.cardMinedAction(mine_card, noMine, gameboard, player);
    }

    public combatValue(player: number, noMine: number, gameboard: GameBoard) : number {
        let combatValue: number = 0;
        for (let card of gameboard.players[player].mines[noMine].collection) {
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

    private cardMinedAction(card: Card, nMine: number, gameboard: GameBoard, player: number) : boolean {
        if (debugValue) { console.log('[DEBUG] cardMinedAction'); }

        let cardType = card.typeName;
        let cardName = card.name;

        if (debugValue) { console.log(`[DEBUG] cardType ${cardType}`); console.log(`[DEBUG] cardName ${cardName}`); }


        if (card instanceof Bonus || card instanceof Dwarf) {
            if (debugValue) { console.log('[DEBUG] case Bonus or Dwarf'); }

            if (cardType == 'Bonus' || cardType == 'Dwarf') {
                if (gameboard.players[player].playerHand.collection.length < 6) {
                    console.log(`The card ${cardName} from mine°${nMine+1} has been added to the "Hand" of player ${player+1}`);
                    gameboard.players[player].playerHand.addCard(card);
                }
                else {
                    console.log(`You haven\'t enough place to store the card ${cardName}, the card has been discarded`);
                    gameboard.recruitCenter.addCard(card);
                }
            }
            else {
                this.dispNotImplemented(cardName, cardType, gameboard, card);
            }
        }
        else if (card instanceof Enemy) {
            if (debugValue) { console.log('[DEBUG] case Enemy'); }
            switch (cardType) {
                case 'Other':
                    console.log(`The card ${cardName} from mine n°${nMine+1} has been added to the "Tresasure collection" of player ${player+1}`);
                    gameboard.players[player].treasure.addCard(card);
                    break;
                case 'Meetings':
                    let playerCombatValue = this.combatValue(player, nMine, gameboard);
                    let monsterCombatValue = (card as Enemy).fight_value;
        
                    if (debugValue) { console.log(`[DEBUG] Player combat value ${playerCombatValue}`); console.log(`[DEBUG] Monster combat value ${monsterCombatValue}`); }
        
                    if (playerCombatValue >= monsterCombatValue) {   
                        console.log(`The card ${cardName} from mine n°${nMine+1} has been defeat and added to the "Tresasure collection" of player ${player+1}`);
                        gameboard.players[player].treasure.addCard(card);
                    }
                    else {
                        console.log(`The ${cardName} from mine n°${nMine+1} is too strong for the player ${player+1}`);
                        console.log(`The ${cardName} came back to the mine`);
                        gameboard.mines[nMine].addCardToBegin(card);
                        return false;
                    }
                    break;         
                default:
                    this.dispNotImplemented(cardName, cardType, gameboard, card);
            }
        }
        else {
            this.dispNotImplemented(cardName, cardType, gameboard, card);  
        }
        return true;
    }

    private async cardMineActionTreasure(card: Card, nMine: number, gameboard: GameBoard, player: number) {
        if (debugValue) { console.log('[DEBUG] case Treasure'); }

        let cardType = card.typeName;
        let cardName = card.name;

        if (cardType == 'Special_treasure') {
            switch (cardName) {
                case 'Unique_rings':
                    if (gameboard.players[player].playerHand.collection.length < 6) {
                        console.log(`The card ${cardName} from mine°${nMine+1} has been added to the "Hand" of player ${player+1}`);
                        gameboard.players[player].playerHand.addCard(card);
                    }
                    else {
                        let array = [];
                        for (let cardPicked of gameboard.players[player].playerHand.collection) {
                            if (cardPicked.name != 'Unique_rings') {    // Rajouter les cartes interdites
                                if (debugValue) { console.log(`[DEBUG] ajout de la carte ${cardPicked.name} au tableau temporaire`) }
                                array.push(cardPicked);
                            }
                        }
                        if (array.length > 0) {
                            console.log('This are yours cards:');
                            for (let i=0; i<array.length; i++) {
                                console.log(`(${i+1}) ${array[i].typeName} - ${array[i].name}\n`);
                            }
                            let noCard = await prompt(`Wich card do you want to peak? (1 to ${array.length}) `);
                            while (noCard <= 0 || noCard > array.length) {
                                noCard = await prompt(`Wich card do you want to peak? (1 to ${array.length}) `);
                                break;
                            }
                            console.log(`You choose to sacrifice the ${array[noCard-1].name}`);
                            gameboard.recruitCenter.addCard(array[noCard-1]);
                            gameboard.players[player].playerHand.removeCard(array[noCard-1]);
                            gameboard.players[player].treasure.addCard(card);
                        }
                        else {
                            console.log(`You haven\'t enough place to store the card ${cardName}, the card has been discarded`);
                            gameboard.recruitCenter.addCard(card);
                        }
                    }
                   break;
                case 'Hearth_gold':
                    let array = [];
                    for (let cardPicked of gameboard.players[player].playerHand.collection) {
                        if (cardPicked.typeName == 'Picker') {
                            if (debugValue) { console.log(`[DEBUG] ajout de la carte ${cardPicked.name} au tableau temporaire`) }
                            array.push(cardPicked);
                        }
                    }
                    if (array.length > 0) {
                        console.log('This are yours "Pickers":');
                        for (let i=0; i<array.length; i++) {
                            console.log(`(${i+1}) ${array[i].typeName} - ${array[i].name}\n`);
                        }
                        let noCard = await prompt(`Wich card do you want to peak? (1 to ${array.length}) `);
                        while (noCard <= 0 || noCard > array.length) {
                            noCard = await prompt(`Wich card do you want to peak? (1 to ${array.length}) `);
                            break;
                        }
                        console.log(`You choose to sacrifice the ${array[noCard-1].name}`);
                        gameboard.recruitCenter.addCard(array[noCard-1]);
                        gameboard.players[player].playerHand.removeCard(array[noCard-1]);
                        gameboard.players[player].treasure.addCard(card);
                    }
                    else {
                        console.log(`You haven\'t any picker to discard, the ${cardName} came back to the mine`);
                        gameboard.mines[nMine].addCardToBegin(card);
                        this.isShut = true;
                    }
                    break; 
                case 'Grödur_ghost':
                    let arr = [];
                    let p:number = 0;
                    let cpt:number = 0;
                    for (let i=1; i<=4; i++) { 
                        p = (player + i)%4;
                        for (let cardP of gameboard.players[player].playerHand.collection) {
                            if (cardP instanceof Dwarf) {
                                if (debugValue) { console.log(`[DEBUG] ajout de la carte ${cardP.name} au tableau temporaire`) }
                                arr.push(cardP);
                            }
                        }
                        if (arr.length > 0) {
                            let r = Math.floor(Math.random() * arr.length);
                            console.log(`The ${arr[r].name} has been removed from the hand of player ${p+1}!`);
                            gameboard.players[p].playerHand.removeCard(arr[r]);
                            gameboard.recruitCenter.addCard(arr[r]);
                            console.log(`The ${card.name} has been added to the Discard.`);
                            gameboard.recruitCenter.addCard(card);
                            break;
                        }
                        else {
                            console.log(`Player ${p+1} haven't any Dwarf in his hand.`);
                            cpt++;
                        }
                        if (cpt == 4) {
                            console.log(`None of the 4 players have a Dwarf in their hands! What a game!\nThe ${card.name} has been added to the Discard.`);
                            gameboard.recruitCenter.addCard(card);
                        }
                    }
                    break;
                default:
                    this.dispNotImplemented(cardName, cardType, gameboard, card);
            }
        }
        else {
            this.dispNotImplemented(cardName, cardType, gameboard, card);
        }
    }

    private dispNotImplemented(cardName: string, cardType: string, gameboard: GameBoard, card: Card) : void {
        console.log(`Action for the mine card ${cardName} of type ${cardType} not implemented ;(`); 
        console.log('The card has been add to the unUsedCard stack (temporary solution)');
        gameboard.unUsedCards.addCard(card);
    }
}