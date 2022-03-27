import { GameBoard } from "../../Game/GameBoard";

import { Card } from "../../Card/Card";
import { Dwarf } from "../../Card/Dwarf";

import { debugValue } from "../../Launcher";

import { prompt } from "../../Module/Question";

export class SpecialCard {
    public async Hearth_gold(gameboard:GameBoard, player:number, noMine:number, card:Card) {
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
            console.log(`You haven\'t any picker to discard, the ${card.name} came back to the mine`);
            gameboard.mines[noMine].addCardToBegin(card);
            return true;
        }
        return false;
    }

    public async Unique_ringsAction(gameboard:GameBoard, player:number, noMine:number, card:Card) {
        if (gameboard.players[player].playerHand.collection.length < 6) {
            console.log(`The card ${card.name} from mine°${noMine+1} has been added to the "Hand" of player ${player+1}`);
            gameboard.players[player].playerHand.addCard(card);
        }
        else {
            let array = [];
            for (let cardPicked of gameboard.players[player].playerHand.collection) {
                if (cardPicked.name != 'Unique_rings') {    // Rajouter les cartes interdites si besoin
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
                console.log(`You haven\'t enough place to store the card ${card.name}, the card has been discarded`);
                gameboard.recruitCenter.addCard(card);
            }
        }
    }

    public async Grodur_ghost(gameboard:GameBoard, player:number, card:Card) {
        let array = [];
        let p:number = 0;
        let cpt:number = 0;
        for (let i=1; i<=4; i++) { 
            p = (player + i)%4;
            for (let cardP of gameboard.players[player].playerHand.collection) {
                if (cardP instanceof Dwarf) {
                    if (debugValue) { console.log(`[DEBUG] ajout de la carte ${cardP.name} au tableau temporaire`) }
                    array.push(cardP);
                }
            }
            if (array.length > 0) {
                let r = Math.floor(Math.random() * array.length);
                console.log(`The ${array[r].name} has been removed from the hand of player ${p+1}!`);
                gameboard.players[p].playerHand.removeCard(array[r]);
                gameboard.recruitCenter.addCard(array[r]);
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
    }

    public async Throne_room(gameboard:GameBoard, player:number, card:Card) {
        console.log('The curse has struck, all your cards went away!!');
        for (let cardPicked of gameboard.players[player].playerHand.collection) {
            console.log(`Your ${cardPicked.name} has been added to the discard!`);
            gameboard.recruitCenter.addCard(cardPicked);
            gameboard.players[player].playerHand.removeCard(cardPicked);
        }
        console.log(`But, you won the ${card.name}?!`);
        gameboard.players[player].playerHand.addCard(card);

    }
}