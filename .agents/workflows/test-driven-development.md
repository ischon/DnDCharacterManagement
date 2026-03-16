---
description: Enforce Test-Driven Development (TDD) for V2 codebase
---

# Workflow: Test-Driven Development (TDD) Enforcer

This workflow must be run by AI agents whenever writing new code, modifying existing logic, or when explicitly called via `/test-driven-development`.

## 1. Doel
Borg de codekwaliteit van de V2 applicatie door een minimale test dekking van 80% (met een streven naar 100%) op alle bestanden, en voorkom regressie in kritieke integraties.

## 2. Context
- **Framework:** Vitest met `@vue/test-utils` (indien vue components).
- **Scope:** Enkel van toepassing op bestanden in de `V2/src` structuur.
- **Drempel:** >80% coverage per branch/file.

## 3. Workflow Stappen

1. **Beoordeel Gewijzigde Code:**
   Identificeer alle `.ts`, `.js`, en `.vue` bestanden die zijn toegevoegd of gewijzigd in de huidige iteratie/taak.
2. **Identificeer of Creëer Test Bestanden:**
   Zoek naar een corresponderend `__tests__` mapje of een file met `.spec.ts` of `.test.ts`. Als er geen testbestand is, bereid dan voor om er één aan te maken.
3. **Schrijf Tests:**
   Voeg positieve tests (happy flow) en negatieve tests (error handling, boundary values) toe. Zorg ervoor dat de test de functionaliteit isoleert waar dat hoort.
4. **Valideer Lokaal (Optioneel indien actieve sessie):**
   Voer `npm run test` of `npm run test:coverage` uit in de `V2` directory om lokaal te bevestigen dat de testen (a) slagen en (b) de drempel van 80% respecteren.
5. **Rapporteer Status:**
   Vermeld in je output of summary bewust dat Test-Driven Development is toegepast en de code afgedekt is.

## 4. Let Op:
Zonder tests is een feature of bugfix NIET 'Done'. Ga altijd proactief aan de slag met test coverage tenzij de gebruiker je daar expliciet van onthoudt in de actieve prompt.
