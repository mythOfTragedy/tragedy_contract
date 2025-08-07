# NFT Generation Rules

## Overview
This document describes the generation rules for Tragedy NFT metadata, including titles, descriptions, and rarity determination.

## Title Generation

### 1. Normal NFTs
- Format: `[Prefix] [Core Title] #[Token ID]`
- Prefix is determined by background:
  - Ragnarok → "Last"
  - Void → "Void"
  - Corruption → "Corrupted"
  - Bloodmoon → "Crimson"
  - Inferno → "Infernal"
  - Frost → "Frozen"
  - Others → No prefix

- Core Title is determined by monster + item combination:
  - Dragon + Sword → "Wyrm Knight"
  - Dragon + Shield → "Scale Guardian"
  - Dragon + Crown → "Drake Lord"
  - Vampire + Wine → "Blood Noble"
  - Vampire + Crown → "Night King"
  - Skeleton + Scythe → "Bone Reaper"
  - Skeleton + Shield → "Undead Sentinel"
  - And many more combinations...

### 2. Synergy NFTs
- Use completely custom titles WITHOUT token ID
- Examples:
  - Quad Synergy: "Cosmic Sovereign"
  - Trinity Synergy: "Blood Wine Ritual Master"
  - Dual Synergy: "Hellfire Archon"
- Custom descriptions are also provided

### 3. Legendary IDs
- Use the same title generation as normal NFTs
- Only the rarity changes to "Legendary"
- Legendary IDs: 1, 7, 13, 23, 42, 86, 100, 111, 187, 217, 333, 404, 555, 616, 666, 777, 911, 999, 1000, 1111, 1337, 1347, 1408, 1492, 1692, 1776, 2187, 3141, 4077, 5150, 6174, 7777, 8128, 9999

## Description Generation

### 1. Normal NFTs
- Format: `[Realm Prefix] [Monster Action] [Curse Description]`
- Generated from combination of realm, monster+item, and effect

### 2. Synergy NFTs
- Use completely custom descriptions
- Each synergy has its own unique lore

### 3. Legendary IDs
- Use the same description generation as normal NFTs

## Rarity Calculation

### Priority Order:
1. **Legendary ID** → Always "Legendary" (30 specific IDs)
2. **Quad Synergy** → Always "Mythic"
3. **Trinity Synergy** → At least "Epic" (can be upgraded)
4. **Dual Synergy** → Base rarity + 1 level
5. **Normal** → Based on attribute combination

### Base Rarity Levels:
- Level 0: Common
- Level 1: Uncommon  
- Level 2: Rare
- Level 3: Epic
- Level 4: Legendary
- Level 5: Mythic (Quad synergy only)

## Important Notes

1. **Deterministic Generation**: All metadata is deterministically generated from the token's attributes. The same combination always produces the same result.

2. **Synergy Priority**: If a combination qualifies for synergy, the synergy title/description takes precedence over normal generation.

3. **Item Display Swaps**: Some synergies cause visual item swaps:
   - Zombie + Amulet → Displays as "Head"
   - Frankenstein + Shoulder → Displays as "Arm"

4. **Fixed Attributes**: Each token ID has fixed attributes (species, background, item, effect) determined by the ID itself.