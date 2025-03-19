import {classes, alignments, abilityTypes, abilities, dice, armorTypes} from "@/models/Enums.js";
import {reactive} from "vue";

export class ModelTypes {
    static disabled = new ModelTypes('disabled', 'input')
    // static color = new ModelTypes('color', 'input')
    // static date = new ModelTypes('date', 'input')
    // static file = new ModelTypes('file', 'input')
    // static image = new ModelTypes('image', 'input')
    static number = new ModelTypes('number', 'input')
    static checkbox = new ModelTypes('checkbox', 'input')
    static text = new ModelTypes('text', 'input')
    static textarea = new ModelTypes('textarea', 'textarea')
    static classes = new ModelTypes('classes', 'select', classes)
    static alignments = new ModelTypes('alignments', 'select', alignments)
    static abilityTypes = new ModelTypes('abilityTypes', 'select', abilityTypes)
    // static proficiencyTypes = new ModelTypes('proficiencyTypes', 'select', proficiencyTypes)
    static abilities = new ModelTypes('abilities', 'select', abilities)
    static die = new ModelTypes('dice', 'dice', dice)
    static weapon = new ModelTypes('weapon', 'weapon')
    static coins = new ModelTypes('coins', 'coins')
    static armor = new ModelTypes('armor', 'select', armorTypes)

    constructor(type, element, options = undefined) {
        this.type = type;
        this.element = element;
        this.options = options;
    }
}

export class EditPopup {

    configure(firebaseHandler) {
        this.firebaseHandler = firebaseHandler
    }

    editing = reactive({
        open: false,
        items: []
    })

    atClickEdit = (character, items) => {
        this.editing.open = true
        this.character = character
        items.forEach((item) => {
            this.editing.items.push({
                name: item[0],
                key: item[1],
                value: item[2],
                type: item[3]
            })
        })
    }

    resetModelData = () => {
        this.editing.open = false;
        this.editing.items = []
    }

    saveWithReflect = (base, path, value) => {
        if (path.includes('.')) {
            const [head, ...tail] = path.split('.')
            this.saveWithReflect(base[head], tail.join('.'), value)
        } else {
            Reflect.set(base, path, value)
        }
    }

    atClickSave = async () => {
        if (this.editing.items[0].key.includes('tag-equipment')) {
            const item = {
                key: this.editing.items[0].key.split('.')[1],
                name: undefined,
                count: undefined,
                weight: undefined,
                index: undefined,
                description: undefined
            }
            this.editing.items.forEach((i) => {
                item[i.key.split('.')[2]] = i.value
            });

            this.character.equipmentUpdate(item.key, item.name, item.count, item.weight, item.index, item.description)
        } else if (this.editing.items[0].key.includes('attacks')) {
            Object.entries(this.editing.items[0].value).forEach((attack) => {
                this.character.attackUpdate(attack[0], attack[1])
            });
        } else if (this.editing.items[0].key.includes('features')) {
            const feature = {
                key: this.editing.items[0].key.split('.')[1],
                name: undefined,
                description: undefined
            }

            this.editing.items.forEach((i) => {
                feature[i.key.split('.')[2]] = i.value
            });

            this.character.featureUpdate(feature.key, feature.name, feature.description)
        } else {


            this.editing.items.forEach((item) => {
                if (item.name === "Spell"){
                    const spell_path = item.key.split('.')
                    const current_spell = this.character._character.spellcasting.spells[spell_path[3]].known[spell_path[5]]
                    if (this.character._character.spellcasting.spells[spell_path[3]].prepared.includes(current_spell)) {
                        this.character.spellcastingPreparedRemove(spell_path[3], current_spell)
                        this.character.spellcastingPreparedAdd(spell_path[3], item.value)

                    }

                }
                this.saveWithReflect(this.character, item.key, item.value)
            });
        }

        await this.firebaseHandler.setCharacterData(this.character.objectData)
        this.resetModelData()
    }

    atClickCancel = () => {
        this.resetModelData()
    }



}