---
description: knowledge-guardian: Verplichting om V2/Knowledge MD files actueel te houden. Start dit als een project een logische shift krijgt.
---

# **Workflow: The Knowledge Guardian**

Deze workflow herinnert AI agenten eraan om systeemwijzigingen proactief vast te leggen in de Documentatie / Knowledge Base.

## Context
Binnen `p:\DnDCharacterManagement\V2\Knowledge\Contexts\` bevinden zich tientallen kleine context Markdown bestanden. Het op peil houden van deze bestanden is cruciaal om toekomstige code-crashes (door gebrekkig context-begrip over interfaces of architectuur) te voorkomen bij latere implementaties door AI agents.

## Triggers
Roep het gedrag van deze workflow expliciet of impliciet aan na:
1. Het succesvol herstructureren van een database-schema of type interface in `dnd_types.ts`.
2. Het toevoegen van een nieuwe complexe klasse of logica engine.
3. Het wijzigen van hoe routering of authenticatie in de applicatie werkt.

## Stappenplan voor de AI Agent:

1. **Lees Huidige Context:** Zoek en lees via `list_dir` de context the in de `/Knowledge/Contexts` map ligt om te bepalen welk bestand de wijziging het beste raakt. Ligt het thema er nog niet? Maak dan een nieuw `.md` bestand.
2. **Reflecteer:** Wat is oud? Welke velden in het document representeren het vorige model dat nu veranderd is?
3. **Update Markdown:** Update het betreffende bestand met `replace_file_content`. Wees specifiek in de velden die veranderd zijn ten opzichte van de omschrijving.
4. **Bevestig:** Geef de gebruiker de zekerheid dat je als Knowledge Guardian de project files up to date hebt gebracht en licht toe welke `.md` bestanden gewijzigd/toegevoegd zijn.
