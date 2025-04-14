"use strict"

import {range} from "lodash";

export function calculateCoins(coins) {
    /*
    Coin	                CP      SP	    EP	    GP	    PP
    Copper Piece    (cp)    1       1/10    1/50    1/100	1/1,000
    Silver Piece    (sp)    10      1       1/5	    1/10    1/100
    Electrum Piece  (ep)    50      5       1       1/2     1/20
    Gold Piece      (gp)    100     10      2       1       1/10
    Platinum Piece  (pp)    1,000   100     20      10      1
     */
    let cp = coins
    let pp = Math.floor(cp / 1000)
    cp -= pp * 1000
    let gp = Math.floor(cp / 100)
    cp -= gp * 100
    // let ep = Math.floor(cp / 50)
    // cp -= ep * 50
    let sp = Math.floor(cp / 10)
    cp -= sp * 10

    return {
        'Copper Coins': cp,
        'Silver Coins': sp,
        'Electrum Coins': ep,
        'Gold Coins': gp,
        'Platinum Coins': pp
    }
}

export function toCopperCoins(coins, type) {
    switch (type) {
        case "COPPER":
            return coins
        case "SILVER":
            return coins * 10
        case "ELECTRUM":
            return coins * 50
        case "GOLD":
            return coins * 100
        case "PLATINUM":
            return coins * 1000
    }

}

export function calculateAbilityModifier(score) {
    return Math.floor((score - 10) / 2);
}

export function longRest(character) {
    character.statHitPointsCurrent = character.statHitPointMaximumValue
    let maxHitDiceRecovery = Math.floor(character.statMaxHitDice / 2)
    if (maxHitDiceRecovery < 1) {
        maxHitDiceRecovery = 1
    }
    if (character.statCurrentAmountHitDice + maxHitDiceRecovery > character.statMaxHitDice) {
        character.statCurrentAmountHitDice = character.statMaxHitDice
    } else {
        character.statCurrentAmountHitDice += maxHitDiceRecovery
    }

    for (let lvl = 1; lvl <= 9; lvl++) {
        if (character.spellcastingSpellSlotsExpanded_get(lvl) > 0) {
            character.spellcastingSpellSlotsExpanded_set(lvl, 0)
        }
    }
}
