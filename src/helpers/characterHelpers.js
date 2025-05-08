'use strict'

// import { range } from 'lodash'

export function calculateCoins(coins) {
  const result = {}
  const rates = {
    cp: { cp: 1, sp: 0.1, ep: 0.02, gp: 0.01, pp: 0.001 },
    sp: { cp: 10, sp: 1, ep: 0.2, gp: 0.1, pp: 0.01 },
    ep: { cp: 50, sp: 5, ep: 1, gp: 0.5, pp: 0.05 },
    gp: { cp: 100, sp: 10, ep: 2, gp: 1, pp: 0.1 },
    pp: { cp: 1000, sp: 100, ep: 20, gp: 10, pp: 1 }
  }

  for (const [fromType, amount] of Object.entries(coins)) {
    if (amount === 0) continue
    for (const [toType, rate] of Object.entries(rates[fromType])) {
      result[toType] = (result[toType] || 0) + amount * rate
    }
  }

  return result
}

export function toCopperCoins(coins, type) {
  switch (type) {
    case 'COPPER':
      return coins
    case 'SILVER':
      return coins * 10
    case 'ELECTRUM':
      return coins * 50
    case 'GOLD':
      return coins * 100
    case 'PLATINUM':
      return coins * 1000
  }
}

export function calculateAbilityModifier(score) {
  return Math.floor((score - 10) / 2)
}

export function longRest(character, full = false) {
  // Reset hit points
  character.statHitPointsCurrent = character.statHitPointMaximumValue

  // Reset hit dice
  if (full) {
    character.statCurrentAmountHitDice = character.statMaxHitDice
  } else {
    character.statCurrentAmountHitDice = Math.min(
      character.statMaxHitDice,
      character.statCurrentAmountHitDice + Math.floor(character.statMaxHitDice / 2)
    )
  }

  // Reset spell slots
  for (const level in character.spellcastingSpells) {
    character.spellcastingSpells[level].slotsUsed = 0
  }
}

const coinTypes = ['cp', 'sp', 'ep', 'gp', 'pp']
