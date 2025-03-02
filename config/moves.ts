export interface AttackType {
  name: string
  description: string
  category: string
  damagePercent?: number
  selfDamagePercent?: number
  canBeCharged?: boolean
  maximumTurnsCanBeCharged?: number
  criticalHitEligible?: boolean
  criticalHitDamageIncrease?: number
  criticalHitDamageChance?: number
  isCombatMove?: boolean
  extraMoveChance?: number
  extraMoveCount?: number
  stunChance?: number
  stunDuration?: number
  isBlock?: boolean
  blockSuccessChance?: number
  affectSelfBlockChance?: number
  oneArmBlockChance?: number
  twoArmBlockChance?: number
  oneArmDamageReduction?: number
  twoArmDamageReduction?: number
  affectOneArmDamageReduction?: number
  affectTwoArmDamageReduction?: number
  isDodge?: boolean
  affectSelfDodgeChance?: number
  minimumDodgeChance?: number
  isToggle?: boolean
  usesKi?: boolean
  healPercent?: number
  isHealingMove?: boolean
  showInDefensePopup?: boolean
  unblockableMove?: boolean
  undodgeableMove?: boolean
  isKiAbsorb?: boolean
  baseAbsorptionChance?: number
  maxAbsorptionChance?: number
  absorptionPercent?: number
  staticDamage?: number
  magazineCapacity?: number
  remainingAmmo?: number
  movesAffected?: string[]
  damageBoostMin?: number
  damageBoostMax?: number
  healAmountMin?: number
  healAmountMax?: number
  healChance?: number
  affectSelfDodgeChance?: number
  affectOpponentDodgeChance?: number
  extraCombatLogNote?: string
  currentArmorHealth?: number
  maximumArmorHealth?: number
  selfDamageReduction?: number
  isArmor?: boolean
  piercing?: boolean
  multihit?: boolean
  blastCount?: number
  powerlevelMultiplier?: number
  deathPenaltyChance?: number
  grantedMoves?: {
    moveName: string
    uses: number
  }[]
  cooldown?: number
  longPressDuration?: number
  kiChannelingDuration?: number
  isKiChanneling?: boolean
  kiChannelingEffect?: (
    currentPowerLevel: number,
    maxPowerLevel: number,
  ) => {
    initialPowerLevel: number
    boostedPowerLevel: number
    afterEffectPowerLevel: number
  }
  isReflect?: boolean
  reflectSuccessChance?: number
  totalDamageAdjust?: number
}

export const ATTACK_TYPES: AttackType[] = [
  // Basic Attacks /////////////////////
  {
    name: "Punch",
    description: "A basic punch attack",
    category: "Basic",
    damagePercent: 0.03,
    criticalHitEligible: true,
    extraMoveChance: 0.15,
    extraMoveCount: 1,
  },
  {
    name: "Punch (High Combo Chance)",
    description: "Experimental. A basic punch attack, but has a high combo chance(55%).  Ref, use this as you see fit.",
    category: "Basic",
    damagePercent: 0.03,
    criticalHitEligible: true,
    extraMoveChance: 0.55,
    extraMoveCount: 1,
  },
  {
    name: "Kick",
    description: "A powerful kick attack",
    category: "Basic",
    damagePercent: 0.05,
    criticalHitEligible: true,
    extraMoveChance: 0.1,
    extraMoveCount: 1,
  },
  {
    name: "Kick (High Combo Chance)",
    description: "Experimental. A basic kick attack, but has a high combo chance(45%).  Ref, use this as you see fit.",
    category: "Basic",
    damagePercent: 0.05,
    criticalHitEligible: true,
    extraMoveChance: 0.45,
    extraMoveCount: 1,
  },
  {
    name: "Elbow",
    description: "A quick elbow strike with a chance to stun",
    category: "Basic",
    damagePercent: 0.04,
    criticalHitEligible: true,
    extraMoveChance: 0.07,
    extraMoveCount: 1,
    stunChance: 0.2,
    stunDuration: 1,
  },
  {
    name: "Knee",
    description: "Strike your opponent with a Knee. Has a chance to stun for longer.",
    category: "Basic",
    damagePercent: 0.04,
    criticalHitEligible: true,
    extraMoveChance: 0.05,
    extraMoveCount: 1,
    stunChance: 0.12,
    stunDuration: 2,
  },
  {
    name: "Shoulder Ram",
    description: "Dash at your opponent, and ram into them with your shoulder.  Has a chance to stun.",
    category: "Basic",
    damagePercent: 0.06,
    criticalHitEligible: true,
    extraMoveChance: 0.02,
    extraMoveCount: 1,
    stunChance: 0.08,
    stunDuration: 1,
  },
  {
    name: "Shin Kick",
    description: "Dishonor your opponent with your weakest attack, by kicking them in the shin!",
    category: "Basic",
    damagePercent: 0.01,
    extraMoveChance: 0.1,
    extraMoveCount: 1,
  },
  {
    name: "Uppercut",
    description: "Go for the jaw!  Fill this whole fight up with Uppercut, ya heard?",
    category: "Basic",
    damagePercent: 0.06,
    criticalHitEligible: true,
    extraMoveChance: 0.02,
    extraMoveCount: 1,
  },
  {
    name: "Duugo Tail Whip",
    description: "Slam your Duugo tail into your opponent!  Crash!  Teach those monkeys a lesson.",
    category: "Basic",
    damagePercent: 0.1,
    criticalHitEligible: true,
    extraMoveChance: 0.05,
    extraMoveCount: 1,
  },
  // Special Attacks /////////////////////
  {
    name: "Ki Blast",
    description: "Blast your opponent with some of your Ki Energy!",
    category: "Special",
    damagePercent: 0.06,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    usesKi: true,
  },
  {
    name: "Ki Blast(High Combo Chance)",
    description:
      "Blast your opponent with some of your Ki Energy!  Experimental, this variant has a 50% combo rate, for special cases.  Does 1% self damage.",
    category: "Special",
    damagePercent: 0.06,
    selfDamagePercent: 0.01,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    extraMoveChance: 0.5,
    extraMoveCount: 1,
    usesKi: true,
  },
  {
    name: "Controllable Ki Blast",
    description:
      '10% damage each turn charged; To do this move, just yell "Controllable Ki Blasts!". You can control where these ki blasts go, meaning they are non-dodgeable. Say what you want them to do. This move takes 3% of your powerlevel each turn you charge it.',
    category: "Special",
    damagePercent: 0.1,
    selfDamagePercent: 0.03,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    undodgeableMove: true,
    usesKi: true,
  },
  {
    name: "Bakuha",
    description: "27% dmg, 5% to self.  Reduces opponent block ability by all.",
    category: "Special",
    damagePercent: 0.27,
    selfDamagePercent: 0.05,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    unblockableMove: true,
    usesKi: true,
  },
  {
    name: "Burning Attack",
    description:
      "15% damage; To do this move, you hold both hands forward, do some strange arm moves, and then put both hands forward again, index fingers and thumbs touching. This move confuses your opponent, giving you one extra turn. Then release the blast. This move takes 2% of your powerlevel everytime you use it.",
    category: "Special",
    damagePercent: 0.15,
    selfDamagePercent: 0.02,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    extraMoveChance: 0.99,
    extraMoveCount: 1,
    usesKi: true,
  },
  {
    name: "Signature Technique lvl1",
    description: "A generic lvl1 signature move.  Just does 10% dmg, and 1% to self.",
    category: "Special",
    damagePercent: 0.1,
    selfDamagePercent: 0.01,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    usesKi: true,
  },
  {
    name: "Signature Technique lvl2",
    description: "A generic lvl2 signature move.  Just does 11% dmg, and 2% to self.",
    category: "Special",
    damagePercent: 0.11,
    selfDamagePercent: 0.02,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    usesKi: true,
  },
  {
    name: "lvl 3 Guaranteed Hit",
    description: "Generic special Technique(Level3) Guaranteed Hit example.  Does 2% damage, and 3% damage to self.",
    category: "Special",
    damagePercent: 0.02,
    selfDamagePercent: 0.03,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    undodgeableMove: true,
    usesKi: true,
  },
  {
    name: "lvl 3 Guard Crush",
    description: "Generic special Technique(Level3) Guard Crush example.  Does 12% damage, and 7% damage to self.",
    category: "Special",
    damagePercent: 0.12,
    selfDamagePercent: 0.07,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    unblockableMove: true,
    usesKi: true,
  },
  {
    name: "lvl 3 Piercing",
    description: "Generic special Technique(Level3) Piercing example.  Does 12% damage, and 7% damage to self.",
    category: "Special",
    damagePercent: 0.12,
    selfDamagePercent: 0.07,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    piercing: true,
    usesKi: true,
  },
  {
    name: "lvl 3 Multi-Hit",
    description: "Generic special Technique(Level3) Multi-Hit example.  Does 12% damage, and 8% damage to self.",
    category: "Special",
    damagePercent: 0.12,
    selfDamagePercent: 0.08,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    multihit: true,
    blastCount: 3,
    usesKi: true,
  },
  {
    name: "lvl 3 Damage Vanila",
    description: "Generic special Technique(Level3) Damage example.  Does 12% damage, and 3% damage to self.",
    category: "Special",
    damagePercent: 0.12,
    selfDamagePercent: 0.03,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    usesKi: true,
  },
  {
    name: "lvl 4 Damage Vanila",
    description: "Generic special Technique(Level4) Damage example.  Does 14% damage, and 4% damage to self.",
    category: "Special",
    damagePercent: 0.14,
    selfDamagePercent: 0.04,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    usesKi: true,
  },
  {
    name: "lvl 5 Damage Vanila",
    description: "Generic special Technique(Level5) Damage example.  Does 16% damage, and 5% damage to self.",
    category: "Special",
    damagePercent: 0.16,
    selfDamagePercent: 0.05,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    usesKi: true,
  },
  {
    name: "Death Ball",
    description:
      "75% damage each turn charged; To do this move, put one hand over your head, pointing one finger up, and say you want to do Death Ball. It’s a spectacular attack, growing from a singular point into a ball the size of a small moon. Unfortunately, it also moves with the speed of a small moon. Anyone may dodge this (adds 30% to their dodge rate), however, if it hits the planet…It easily has enough energy to obliterate a planet. This move takes away 30% of your powerlevel each turn you charge it.",
    category: "Special",
    damagePercent: 0.75,
    selfDamagePercent: 0.3,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 3,
    usesKi: true,
  },
  {
    name: "Dodonpa",
    description:
      "30% damage each turn charged; The user shoots a little blast from his/her finger and makes a big impact on contact with anything, this is more powerful than kamehameha. This move takes 5% of your powerlevel each turn you charge it.",
    category: "Special",
    damagePercent: 0.3,
    selfDamagePercent: 0.05,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    usesKi: true,
  },
  {
    name: "Final Flash",
    description:
      "45% damage each turn charged; To do this move, fly up in the air, spread your arms and legs out gathering energy, and bring your hands together and yell “Final Flash!!”. This move takes 7% of your powerlevel each turn you charge it.",
    category: "Special",
    damagePercent: 0.45,
    selfDamagePercent: 0.07,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    usesKi: true,
  },
  {
    name: "Gallic Gun",
    description:
      "37% damage each turn charged; To do this move, put your hands to your side and cup them, then bring them forward, yelling “Galic Gun!!”. This move takes 6% of your powerlevel each turn charged.",
    category: "Special",
    damagePercent: 0.37,
    selfDamagePercent: 0.06,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    usesKi: true,
  },
  {
    name: "Kame Hame Ha",
    description:
      "25% damage each turn charged; Bring both hands forward as if firing a blast and say Kame, then bring both hands to your side, cupped, and say Hame, then bring both hands forward yelling Ha while firing the blast. This move takes 3% of your powerlevel each turn charged.",
    category: "Special",
    damagePercent: 0.25,
    selfDamagePercent: 0.03,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    usesKi: true,
  },
  {
    name: "Laser Eyes",
    description:
      "9% damage each turn charged; Just look directly at a person and where you’d like to hit them and yell “Laser Eyes” and a ki beam will shoot out of your eyes. This move takes 1% of your powerlevel each turn you use it.",
    category: "Special",
    damagePercent: 0.09,
    selfDamagePercent: 0.01,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    usesKi: true,
  },
  {
    name: "Masenko",
    description:
      "27% damage each turn charged; To do Masenko, power up a blast over your head with both hands, one palm behind the other, then bring your hands down in front of yourself to fire the blast, the yell, “Masenko!!”. This move takes 4% powerlevel every turn you charge it.",
    category: "Special",
    damagePercent: 0.27,
    selfDamagePercent: 0.04,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    usesKi: true,
  },
  {
    name: "Mouth Blast",
    description:
      "21% damage each turn charged; To do this move, open your mouth as wide as you can, and point your mouth towars the target, and fire the blast. This move takes away 2% each turn you charge this move.",
    category: "Special",
    damagePercent: 0.21,
    selfDamagePercent: 0.02,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    usesKi: true,
  },
  {
    name: "Renzoku Energy Dan",
    description:
      "60% damage; To do this move, shoot ki bolts continuously from your hands, resulting in somewhat of a “machine-gun ki blast” effect. This move takes away 20% of your powerlevel each time you use it.",
    category: "Special",
    damagePercent: 0.6,
    selfDamagePercent: 0.2,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    multihit: true,
    blastCount: 3,
    usesKi: true,
  },
  {
    name: "Special Beam Cannon",
    description:
      "29% damage each turn charged; To do this move, put your index and middle finger to your forehead, charging the shot. Then bring your two fingers forward, aimed at the target yelling, “Special Beam Cannon!!”. Doing this, you shoot a penetrating blast from two fingers. It is actually two blasts, one going straight ahead and the other coiling around the first for drilling power. This attack drills through everything it hits, and eventually blows up when it hits something big enough. This move takes away 4% of your powerlevel each turn you charge it.",
    category: "Special",
    damagePercent: 0.29,
    selfDamagePercent: 0.04,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    usesKi: true,
  },
  {
    name: "Tri Beam",
    description:
      "55% damage each turn charged; To do Tri Beam, bring your hands together and make a triangle, then center your opponent in the triangle and yell “Tri Beam!!”. If you use this move, it takes away 10% of your powerlevel each turn you charge it.",
    category: "Special",
    damagePercent: 0.55,
    selfDamagePercent: 0.1,
    canBeCharged: true,
    maximumTurnsCanBeCharged: 10,
    usesKi: true,
  },
  {
    name: "Dragon Rage",
    description: "Granted by Heavy Dragon armor.  You may rage like a dragon and deal some serious damage.",
    category: "Special",
    damagePercent: 0.5,
    selfDamagePercent: 0,
    usesKi: true,
  },
  {
    name: "Ki Channeling",
    description:
      "Channel your Ki energy to temporarily boost your power level. Restores your power level to full, but after 5 attacks, it will return to half of your original power level.",
    category: "Special",
    usesKi: true,
    isKiChanneling: true,
    kiChannelingDuration: 5,
    kiChannelingEffect: (currentPowerLevel: number, maxPowerLevel: number) => ({
      initialPowerLevel: currentPowerLevel,
      boostedPowerLevel: maxPowerLevel,
      afterEffectPowerLevel: Math.floor(currentPowerLevel / 2),
    }),
  },
  {
    name: "Heal",
    description: "A heal move to restore some lost power level.",
    category: "Special",
    healAmountMin: 0.3,
    healAmountMax: 0.3,
    healChance: 0.99,
    isHealingMove: true,
    usesKi: true,
  },
  // Defense Moves ///////////////////////
  {
    name: "Dodge",
    description: "Attempt to dodge the incoming attack",
    category: "Defense",
    isCombatMove: true,
    preventAction: true,
    showInDefensePopup: true,
    isDodge: true,
  },
  {
    name: "Reflect",
    description: "Attempt to reflect the incoming attack back at the attacker",
    category: "Defense",
    isCombatMove: true,
    preventAction: true,
    showInDefensePopup: true,
    isReflect: true,
    reflectSuccessChance: 0.99, // 99% chance to successfully reflect
  },
  {
    name: "Block",
    description: "Attempt to block the incoming attack",
    category: "Defense",
    isCombatMove: true,
    preventAction: true,
    isBlock: true,
    showInDefensePopup: true,
    blockSuccessChance: 0.55,
    oneArmBlockChance: 0.9,
    twoArmBlockChance: 0.1,
    oneArmDamageReduction: 0.25,
    twoArmDamageReduction: 0.5,
  },
  {
    name: "Ki Absorb",
    description:
      "Attempt to absorb the incoming ki-based attack. 15% base chance, increasing by 10% for every two times your power level exceeds your opponent's, up to 90%. When successful, absorb 50% of the attack's energy.",
    category: "Defense",
    isCombatMove: true,
    preventAction: true,
    showInDefensePopup: true,
    isKiAbsorb: true,
    baseAbsorptionChance: 0.15,
    maxAbsorptionChance: 0.9,
    absorptionPercent: 0.5,
  },
  {
    name: "Disarm",
    description:
      "Every attack used on an enemy (that hits and causes damage) with a weapon equipped has a 25% chance of disarming that opponent.",
    category: "Defense",
    isCombatMove: false,
    preventAction: false,
    showInDefensePopup: false,
    isDodge: false,
  },
  {
    name: "Nothing",
    description: "Take the attack without any defensive action",
    category: "Defense",
    isCombatMove: true,
    preventAction: true,
    showInDefensePopup: true,
  },
  // Items ///////////////////////////
  {
    name: "Saiyan Sword",
    description: "Slash the enemy with your sword!",
    damagePercent: 0.1,
    category: "Item",
    extraMoveChance: 0.08,
    extraMoveCount: 1,
  },
  {
    name: "Shotgun",
    description: "Shoot your opponent with your shotgun.",
    staticDamage: 65,
    magazineCapacity: 30,
    remainingAmmo: 30,
    category: "Item",
  },
  {
    name: "DB Shotgun",
    description: "Shoot your opponent with your Double Barrel Shotgun!",
    staticDamage: 130,
    magazineCapacity: 30,
    remainingAmmo: 30,
    category: "Item",
  },
  {
    name: "9mm Pistol",
    description: "Shoot your opponent with your Tech9!",
    staticDamage: 40,
    magazineCapacity: 30,
    remainingAmmo: 30,
    category: "Item",
  },
  {
    name: "Sniper Rifle",
    description: "Snipe your opponents down with your rifle.",
    staticDamage: 300,
    magazineCapacity: 30,
    remainingAmmo: 30,
    category: "Item",
  },
  {
    name: "Brass Knuckles",
    description: "Increase the effectiveness of your Basic Attacks. Toggle on/off.",
    category: "Item",
    isToggle: true,
    movesAffected: ["Punch", "Uppercut"],
    damageBoostMin: 0.03,
    damageBoostMax: 0.03,
  },
  {
    name: "Space Ki Gun",
    description: "Use your Space Gun to shoot a bit of your Ki Energy at your target.",
    category: "Item",
    damagePercent: 0.05,
    selfDamagePercent: 0.01,
    magazineCapacity: 30,
    remainingAmmo: 30,
    usesKi: true,
  },
  {
    name: "Sensu Bean",
    description: "A magical bean that fully restores your power level.",
    category: "Item",
    healAmountMin: 1,
    healAmountMax: 1,
    healChance: 1,
    isHealingMove: true,
  },
  {
    name: "Food",
    description: "Eat food to restore some health.",
    category: "Item",
    healAmountMin: 0.05,
    healAmountMax: 0.15,
    healChance: 0.15,
    isHealingMove: true,
  },
  {
    name: "Light Weight Shirt",
    description:
      "6% bonus to power level gains after a Spar/Fight/Train (after 50,000 power level, no extra gain is provided). -6% penalty to wearer's dodge. +6% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.06,
    affectOpponentDodgeChance: 0.06,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Light Weight Pants",
    description:
      "8% bonus to power level gains after a Spar/Fight/Train (after 50,000 power level, no extra gain is provided). -8% penalty to wearer's dodge. +8% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.08,
    affectOpponentDodgeChance: 0.08,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Light Weight Shoes",
    description:
      "4% bonus to power level gains after a Spar/Fight/Train (after 50,000 power level, no extra gain is provided). -4% penalty to wearer's dodge. +4% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.04,
    affectOpponentDodgeChance: 0.04,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Light Weight Belt",
    description:
      "4% bonus to power level gains after a Spar/Fight/Train (after 50,000 power level, no extra gain is provided). -4% penalty to wearer's dodge. +4% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.04,
    affectOpponentDodgeChance: 0.04,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Light Weight Hat",
    description:
      "5% bonus to power level gains after a Spar/Fight/Train (after 50,000 power level, no extra gain is provided). -5% penalty to wearer's dodge. +5% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.05,
    affectOpponentDodgeChance: 0.05,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Light Weight Wrist Bands",
    description:
      "4% bonus to power level gains after a Spar/Fight/Train (after 50,000 power level, no extra gain is provided). -4% penalty to wearer's dodge. +4% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.04,
    affectOpponentDodgeChance: 0.04,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Light Weight Socks",
    description:
      "3% bonus to power level gains after a Spar/Fight/Train (after 50,000 power level, no extra gain is provided). -3% penalty to wearer's dodge. +3% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.03,
    affectOpponentDodgeChance: 0.03,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Light Weight Cape",
    description:
      "6% bonus to power level gains after a Spar/Fight/Train (after 50,000 power level, no extra gain is provided). -6% penalty to wearer's dodge. +6% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.06,
    affectOpponentDodgeChance: 0.06,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Medium Weight Shirt",
    description:
      "4.5% bonus to power level gains after a Spar/Fight/Train (after 2,000,000 power level, no extra gain is provided). -5% penalty to wearer's dodge. +5% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.05,
    affectOpponentDodgeChance: 0.05,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Medium Weight Pants",
    description:
      "6% bonus to power level gains after a Spar/Fight/Train (after 2,000,000 power level, no extra gain is provided). -6% penalty to wearer's dodge. +6% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.06,
    affectOpponentDodgeChance: 0.06,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Medium Weight Shoes",
    description:
      "3% bonus to power level gains after a Spar/Fight/Train (after 2,000,000 power level, no extra gain is provided). -3% penalty to wearer's dodge. +3% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.03,
    affectOpponentDodgeChance: 0.03,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Medium Weight Belt",
    description:
      "3% bonus to power level gains after a Spar/Fight/Train (after 2,000,000 power level, no extra gain is provided). -3% penalty to wearer's dodge. +3% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.03,
    affectOpponentDodgeChance: 0.03,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Medium Weight Hat",
    description:
      "3.75% bonus to power level gains after a Spar/Fight/Train (after 2,000,000 power level, no extra gain is provided). -4% penalty to wearer's dodge. +4% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.04,
    affectOpponentDodgeChance: 0.04,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Medium Weight Wrist Bands",
    description:
      "3% bonus to power level gains after a Spar/Fight/Train (after 2,000,000 power level, no extra gain is provided). -3% penalty to wearer's dodge. +3% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.03,
    affectOpponentDodgeChance: 0.03,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Medium Weight Socks",
    description:
      "2.25% bonus to power level gains after a Spar/Fight/Train (after 2,000,000 power level, no extra gain is provided). -2% penalty to wearer's dodge. +2% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.02,
    affectOpponentDodgeChance: 0.02,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Medium Weight Cape",
    description:
      "4.5% bonus to power level gains after a Spar/Fight/Train (after 2,000,000 power level, no extra gain is provided). -5% penalty to wearer's dodge. +5% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.05,
    affectOpponentDodgeChance: 0.05,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Heavy Weight Shirt",
    description:
      "3% bonus to power level gains after a Spar/Fight/Train (after 100,000,000 power level, no extra gain is provided). -3% penalty to wearer's dodge. +3% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.03,
    affectOpponentDodgeChance: 0.03,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Heavy Weight Pants",
    description:
      "4% bonus to power level gains after a Spar/Fight/Train (after 100,000,000 power level, no extra gain is provided). -4% penalty to wearer's dodge. +4% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.04,
    affectOpponentDodgeChance: 0.04,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Heavy Weight Shoes",
    description:
      "2% bonus to power level gains after a Spar/Fight/Train (after 100,000,000 power level, no extra gain is provided). -2% penalty to wearer's dodge. +2% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.02,
    affectOpponentDodgeChance: 0.02,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Heavy Weight Belt",
    description:
      "2% bonus to power level gains after a Spar/Fight/Train (after 100,000,000 power level, no extra gain is provided). -2% penalty to wearer's dodge. +2% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.02,
    affectOpponentDodgeChance: 0.02,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Heavy Weight Hat",
    description:
      "2.5% bonus to power level gains after a Spar/Fight/Train (after 100,000,000 power level, no extra gain is provided). -2.5% penalty to wearer's dodge. +2.5% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.025,
    affectOpponentDodgeChance: 0.025,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Heavy Weight Wrist Bands",
    description:
      "2% bonus to power level gains after a Spar/Fight/Train (after 100,000,000 power level, no extra gain is provided). -2% penalty to wearer's dodge. +2% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.02,
    affectOpponentDodgeChance: 0.02,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Heavy Weight Socks",
    description:
      "1.5% bonus to power level gains after a Spar/Fight/Train (after 100,000,000 power level, no extra gain is provided). -1.5% penalty to wearer's dodge. +1.5% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.015,
    affectOpponentDodgeChance: 0.015,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Heavy Weight Cape",
    description:
      "3% bonus to power level gains after a Spar/Fight/Train (after 100,000,000 power level, no extra gain is provided). -3% penalty to wearer's dodge. +3% bonus to opponent's dodge.",
    category: "Item",
    isToggle: true,
    affectSelfDodgeChance: -0.03,
    affectOpponentDodgeChance: 0.03,
    extraCombatLogNote:
      "Must activate at the start of a battle to ensure you get the benefit of increased power level gain at the conclusion of the fight.",
  },
  {
    name: "Light Saiyan Armor",
    description: "10% off of damage done. Can take 4,500 damage.",
    category: "Item",
    isToggle: true,
    isArmor: true,
    currentArmorHealth: 4500,
    maximumArmorHealth: 4500,
    selfDamageReduction: 0.1,
  },
  {
    name: "Medium Saiyan Armor",
    description: "15% off of damage done. Can take 18,500 damage.",
    category: "Item",
    isToggle: true,
    isArmor: true,
    currentArmorHealth: 18500,
    maximumArmorHealth: 18500,
    selfDamageReduction: 0.15,
  },
  {
    name: "Heavy Saiyan Armor",
    description: "20% off of damage done. Can take 115,00 damage.",
    category: "Item",
    isToggle: true,
    isArmor: true,
    currentArmorHealth: 115000,
    maximumArmorHealth: 115000,
    selfDamageReduction: 0.2,
  },
  {
    name: "Light Dragon Armor",
    description: "15% off of damage done. Can take 19,000 damage. Grants 1 free of Reflect.",
    category: "Item",
    isToggle: true,
    isArmor: true,
    currentArmorHealth: 19000,
    maximumArmorHealth: 19000,
    selfDamageReduction: 0.15,
    grantedMoves: [
      {
        moveName: "Reflect",
        uses: 1,
      },
    ],
  },
  {
    name: "Medium Dragon Armor",
    description: "20% off of damage done. Can take 130,000 damage.",
    category: "Item",
    isToggle: true,
    isArmor: true,
    currentArmorHealth: 130000,
    maximumArmorHealth: 130000,
    selfDamageReduction: 0.2,
    grantedMoves: [
      {
        moveName: "Heal",
        uses: 1,
      },
    ],
  },
  {
    name: "Heavy Dragon Armor",
    description: "30% off of damage done. Industructable.",
    category: "Item",
    isToggle: true,
    isArmor: true,
    currentArmorHealth: 9999999999999999999999999999999999999999999,
    maximumArmorHealth: 9999999999999999999999999999999999999999999,
    selfDamageReduction: 0.3,
    grantedMoves: [
      {
        moveName: "Dragon Rage",
        uses: 1,
      },
    ],
  },
  // Other Moves /////////////////////
  {
    name: "Detect Powerlevel",
    description: "You have a precise reading of what your opponents powerlevels are.",
    category: "Other",
    isCombatMove: false,
  },
  {
    name: "Flight",
    description: "Take this flight to the sky.  Added bonus of improving your basic attacks damages. Toggle on/off.",
    category: "Other",
    isToggle: true,
    movesAffected: [
      "Punch",
      "Kick",
      "Elbow",
      "Knee",
      "Shoulder Ram",
      "Shin Kick",
      "Uppercut",
      "Duugo Tail Whip",
      "Saiyan Sword",
    ],
    damageBoostMin: 0.03,
    damageBoostMax: 0.03,
    usesKi: true,
  },
  {
    name: "Hikou Flight",
    description:
      "Take this flight to the sky, Andriod Style!  Added bonus of improving your basic attacks damages. Toggle on/off.",
    category: "Other",
    isToggle: true,
    movesAffected: [
      "Punch",
      "Kick",
      "Elbow",
      "Knee",
      "Shoulder Ram",
      "Shin Kick",
      "Uppercut",
      "Duugo Tail Whip",
      "Saiyan Sword",
    ],
    damageBoostMin: 0.03,
    damageBoostMax: 0.03,
    usesKi: true,
  },
  {
    name: "Karate (White Belt)",
    description:
      "When using this form all physical attacks done by the user are increased by 3% (does not stack with weapon damages).",
    category: "Other",
    isToggle: true,
    movesAffected: ["Punch", "Kick", "Elbow", "Knee", "Shoulder Ram", "Shin Kick", "Uppercut", "Duugo Tail Whip"],
    damageBoostMin: 0.05,
    damageBoostMax: 0.05,
    usesKi: false,
  },
  {
    name: "Karate (Blue Belt)",
    description:
      "When using this form all physical attacks done by the user are increased by 5% (does not stack with weapon damages).",
    category: "Other",
    isToggle: true,
    movesAffected: ["Punch", "Kick", "Elbow", "Knee", "Shoulder Ram", "Shin Kick", "Uppercut", "Duugo Tail Whip"],
    damageBoostMin: 0.05,
    damageBoostMax: 0.05,
    usesKi: false,
  },
  {
    name: "Karate (Brown Belt)",
    description:
      "When using this form all physical attacks done by the user are increased by 7% (does not stack with weapon damages)",
    category: "Other",
    isToggle: true,
    movesAffected: ["Punch", "Kick", "Elbow", "Knee", "Shoulder Ram", "Shin Kick", "Uppercut", "Duugo Tail Whip"],
    damageBoostMin: 0.07,
    damageBoostMax: 0.07,
    usesKi: false,
  },
  {
    name: "Karate (Black Belt)",
    description:
      "When using this form all physical attacks done by the user are increased by 10% (does not stack with weapon damages)",
    category: "Other",
    isToggle: true,
    movesAffected: ["Punch", "Kick", "Elbow", "Knee", "Shoulder Ram", "Shin Kick", "Uppercut", "Duugo Tail Whip"],
    damageBoostMin: 0.1,
    damageBoostMax: 0.1,
    usesKi: false,
  },
  {
    name: "Karate (Mastery)",
    description:
      "When using this form all physical attacks done by the user are increased by 10% (does not stack with weapon damages). you may combine this form with any other form (up to the other form’s Brown Belt)",
    category: "Other",
    isToggle: true,
    movesAffected: ["Punch", "Kick", "Elbow", "Knee", "Shoulder Ram", "Shin Kick", "Uppercut", "Duugo Tail Whip"],
    damageBoostMin: 0.1,
    damageBoostMax: 0.1,
    usesKi: false,
  },
  {
    name: "JiuJitsu (White Belt)",
    description:
      "When using this form all physical attacks done by the user are increased by 10% (does not stack with weapon damages). The downside to this form is that you are stripped of the chance to dodge and the most you can block from any incoming attack is 25% (the same chance of rolling a six sided di still apply).",
    category: "Other",
    isToggle: true,
    movesAffected: ["Punch", "Kick", "Elbow", "Knee", "Shoulder Ram", "Shin Kick", "Uppercut", "Duugo Tail Whip"],
    damageBoostMin: 0.1,
    damageBoostMax: 0.1,
    affectSelfDodgeChance: -1,
    affectTwoArmDamageReduction: -0.25,
    usesKi: false,
  },
  {
    name: "JiuJitsu (Blue Belt)",
    description:
      "When using this form all physical attacks done by the user are increased by 12% (does not stack with weapon damages). The downside to this form is that you are stripped of the chance to dodge and the most you can block from any incoming attack is 25% (the same chance of rolling a six sided di still apply).",
    category: "Other",
    isToggle: true,
    movesAffected: ["Punch", "Kick", "Elbow", "Knee", "Shoulder Ram", "Shin Kick", "Uppercut", "Duugo Tail Whip"],
    damageBoostMin: 0.12,
    damageBoostMax: 0.12,
    affectSelfDodgeChance: -1,
    affectTwoArmDamageReduction: -0.25,
    usesKi: false,
  },
  {
    name: "JiuJitsu (Brown Belt)",
    description:
      "When using this form all physical attacks done by the user are increased by 15% (does not stack with weapon damages). The downside to this form is that you are stripped of the chance to dodge and the most you can block from any incoming attack is 25% (the same chance of rolling a six sided di still apply).",
    category: "Other",
    isToggle: true,
    movesAffected: ["Punch", "Kick", "Elbow", "Knee", "Shoulder Ram", "Shin Kick", "Uppercut", "Duugo Tail Whip"],
    damageBoostMin: 0.15,
    damageBoostMax: 0.15,
    affectSelfDodgeChance: -1,
    affectTwoArmDamageReduction: -0.25,
    usesKi: false,
  },
  {
    name: "JiuJitsu (Black Belt)",
    description:
      "When using this form all physical attacks done by the user are increased by 17% (does not stack with weapon damages). The downside to this form is that you are stripped of the chance to dodge and the most you can block from any incoming attack is 25% (the same chance of rolling a six sided di still apply).",
    category: "Other",
    isToggle: true,
    movesAffected: ["Punch", "Kick", "Elbow", "Knee", "Shoulder Ram", "Shin Kick", "Uppercut", "Duugo Tail Whip"],
    damageBoostMin: 0.17,
    damageBoostMax: 0.17,
    affectSelfDodgeChance: -1,
    affectTwoArmDamageReduction: -0.25,
    usesKi: false,
  },
  {
    name: "JiuJitsu (Master Belt)",
    description:
      "When using this form all physical attacks done by the user are increased by 18% (does not stack with weapon damages). The downside to this form is that you are stripped of the chance to dodge and the most you can block from any incoming attack is 25% (the same chance of rolling a six sided di still apply).",
    category: "Other",
    isToggle: true,
    movesAffected: ["Punch", "Kick", "Elbow", "Knee", "Shoulder Ram", "Shin Kick", "Uppercut", "Duugo Tail Whip"],
    damageBoostMin: 0.18,
    damageBoostMax: 0.18,
    affectSelfDodgeChance: -1,
    affectTwoArmDamageReduction: -0.3,
    usesKi: false,
  },
  {
    name: "Aikido (White Belt)",
    description:
      "White Belt–When using this form you always have a chance to dodge and block any incoming attack (unless it is an unblockable or undodgeable attack). This form gives you a 5% bonus to dodging and guarantees you will block any incoming attack (although you still either block 25% or 50% of the damage). The downside to this form is that all damage done by the user is cut down by 25%.",
    category: "Other",
    isToggle: true,
    totalDamageAdjust: -0.25,
    affectSelfDodgeChance: 0.05,
    minimumDodgeChance: 0.15,
    affectSelfBlockChance: 0.45,
    usesKi: false,
  },
  {
    name: "Aikido (Blue Belt)",
    description:
      "Blue Belt–When using this form you always have a chance to dodge and block any incoming attack (unless it is an unblockable or undodgeable attack). This form gives you a 10% bonus to dodging and guarantees you will block any incoming attack (although you still either block 25% or 50% of the damage). The downside to this form is that all damage done by the user is cut down by 20%.",
    category: "Other",
    isToggle: true,
    totalDamageAdjust: -0.2,
    affectSelfDodgeChance: 0.1,
    minimumDodgeChance: 0.15,
    affectSelfBlockChance: 0.45,
    usesKi: false,
  },
  {
    name: "Aikido (Brown Belt)",
    description:
      "Brown Belt–When using this form you always have a chance to dodge and block any incoming attack (unless it is an unblockable or undodgeable attack). This form gives you a 15% bonus to dodging and guarantees you will block any incoming attack (although you still either block 25% or 50% of the damage). The downside to this form is that all damage done by the user is cut down by 15%.",
    category: "Other",
    isToggle: true,
    totalDamageAdjust: -0.15,
    affectSelfDodgeChance: 0.15,
    minimumDodgeChance: 0.15,
    affectSelfBlockChance: 0.45,
    usesKi: false,
  },
  {
    name: "Aikido (Black Belt)",
    description:
      "Black Belt–When using this form you always have a chance to dodge and block any incoming attack (unless it is an unblockable or undodgeable attack). This form gives you a 20% bonus to dodging and guarantees you will block any incoming attack (although you still either block 25% or 50% of the damage). The downside to this form is that all damage done by the user is cut down by 10%.",
    category: "Other",
    isToggle: true,
    totalDamageAdjust: -0.1,
    affectSelfDodgeChance: 0.2,
    minimumDodgeChance: 0.15,
    affectSelfBlockChance: 0.45,
    usesKi: false,
  },
  {
    name: "Aikido (Master Belt)",
    description:
      "Master Belt–When using this form you always have a chance to dodge and block any incoming attack (unless it is an unblockable or undodgeable attack). This form gives you a 50% bonus to dodging and guarantees you will block any incoming attack (although you still either block 25% or 50% of the damage). The downside to this form is that all damage done by the user is cut down by 10%.",
    category: "Other",
    isToggle: true,
    totalDamageAdjust: -0.05,
    affectSelfDodgeChance: 0.5,
    minimumDodgeChance: 0.15,
    affectSelfBlockChance: 0.45,
    usesKi: false,
  },
  {
    name: "Skip My Turn",
    description: "Skip your turn without taking any action.",
    category: "Other",
    damagePercent: 0,
  },
  {
    name: "Surrender",
    description: "Give up the fight, declaring your opponent the winner",
    category: "Other",
    cooldown: 2,
    longPressDuration: 2500,
  },
  // Transformations /////////////////////
  {
    name: "Draconic Ascension",
    description:
      "A risky move that has a 10% chance to reduce your power level to 0, but if successful, multiplies your current power level by 8.",
    category: "Transformations",
    damagePercent: 0,
    usesKi: true,
    isCombatMove: true,
    deathPenaltyChance: 0.1,
    powerlevelMultiplier: 8,
    cooldown: 5,
  },
  {
    name: "Devil Star Power Boost",
    description:
      "When the Devil’s Star comes close to a planet where a Devil is present, it multiplies the powerlevel of all Devils on that planet by 12. This event occurs on the 5th and 18th of every month, during which Devils remain fully in control of their characters.",
    category: "Transformations",
    damagePercent: 0,
    usesKi: true,
    isCombatMove: true,
    deathPenaltyChance: 0,
    powerlevelMultiplier: 12,
    cooldown: 5,
  },
  {
    name: "Oozaru Ape",
    description:
      "Be cautious: For the untrained Saiyan, Oozaru is a state of uncontrollable rage. While transformed, they lose all memory of their actions and cannot control themselves.",
    category: "Transformations",
    damagePercent: 0,
    usesKi: true,
    isCombatMove: true,
    deathPenaltyChance: 0,
    powerlevelMultiplier: 10,
    cooldown: 5,
  },
  {
    name: "Super Saiyan",
    description:
      "Activating Super Saiyan multiplies the character's current power level by 10x, dramatically increasing attack power, speed, and energy regeneration. While transformed, the character's hair turns golden, and their aura intensifies, signaling their enhanced state.",
    category: "Transformations",
    damagePercent: 0,
    usesKi: true,
    isCombatMove: true,
    deathPenaltyChance: 0,
    powerlevelMultiplier: 10,
    cooldown: 5,
  },
].map((attack) => ({
  ...attack,
  usesKi: attack.usesKi ?? false,
  longPressDuration: attack.longPressDuration ?? 0,
  cooldown: attack.cooldown ?? 0,
  extraMoveChance: attack.extraMoveChance ?? 0,
  extraMoveCount: attack.extraMoveCount ?? 0,
  isBlock: attack.isBlock ?? false,
  canBeCharged: attack.canBeCharged ?? false,
  maximumTurnsCanBeCharged: attack.maximumTurnsCanBeCharged ?? 0,
  criticalHitEligible: attack.criticalHitEligible ?? false,
  criticalHitDamageIncrease: attack.criticalHitDamageIncrease ?? 0.5,
  criticalHitDamageChance: attack.criticalHitDamageChance ?? 0.15,
  isCombatMove: attack.isCombatMove ?? true,
  damagePercent: attack.damagePercent ?? 0,
  selfDamagePercent: attack.selfDamagePercent ?? 0,
  isToggle: attack.isToggle ?? false,
  usesKi: attack.usesKi ?? false,
  healPercent: attack.healPercent ?? 0,
  isHealingMove: attack.isHealingMove ?? false,
  showInDefensePopup: attack.showInDefensePopup ?? false,
  unblockableMove: attack.unblockableMove ?? false,
  undodgeableMove: attack.undodgeableMove ?? false,
  isKiAbsorb: attack.isKiAbsorb ?? false,
  baseAbsorptionChance: attack.baseAbsorptionChance ?? 0,
  maxAbsorptionChance: attack.maxAbsorptionChance ?? 0,
  absorptionPercent: attack.absorptionPercent ?? 0,
  currentArmorHealth: attack.currentArmorHealth ?? 0,
  maximumArmorHealth: attack.maximumArmorHealth ?? 0,
  selfDamageReduction: attack.selfDamageReduction ?? 0,
  isArmor: attack.isArmor ?? false,
  grantedMoves: attack.grantedMoves ?? [],
  isReflect: attack.isReflect ?? false,
  multihit: attack.multihit ?? false,
  blastCount: attack.blastCount ?? 0,
  deathPenaltyChance: attack.deathPenaltyChance ?? 0,
  powerlevelMultiplier: attack.powerlevelMultiplier ?? 0,
}))

export const MOVE_CATEGORIES = ["Basic", "Defense", "Special", "Item", "Transformations", "Other"]

export const getGrantedMoves = (fighter: "fighter1" | "fighter2", gameState: any): string[] => {
  const activeToggles = gameState[`${fighter}ActiveToggles`]
  const grantedMoves: string[] = []

  activeToggles.forEach((toggleName: string) => {
    const toggleAttack = ATTACK_TYPES.find((attack) => attack.name === toggleName)
    if (toggleAttack && toggleAttack.grantedMoves) {
      toggleAttack.grantedMoves.forEach((grantedMove) => {
        if (grantedMove.uses > 0) {
          grantedMoves.push(grantedMove.moveName)
        }
      })
    }
  })

  return grantedMoves
}

