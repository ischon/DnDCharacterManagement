import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ModelTypes, EditPopup } from '@/helpers/editPopupHelper.js'

describe('ModelTypes', () => {
  it('should instantiate with correct properties', () => {
    const t = new ModelTypes('test', 'input', ['a', 'b'])
    expect(t.type).toBe('test')
    expect(t.element).toBe('input')
    expect(t.options).toEqual(['a', 'b'])
  })

  it('should have static properties', () => {
    expect(ModelTypes.text.type).toBe('text')
    expect(ModelTypes.number.type).toBe('number')
    expect(ModelTypes.textarea.type).toBe('textarea')
    expect(ModelTypes.classes.type).toBe('classes')
  })
})

describe('EditPopup', () => {
  let popup
  beforeEach(() => {
    popup = new EditPopup()
    popup.editing.open = false
    popup.editing.items = []
  })

  it('should configure firebaseHandler', () => {
    const handler = { foo: 'bar' }
    popup.configure(handler)
    expect(popup.firebaseHandler).toBe(handler)
  })

  it('should open edit popup and add items', () => {
    const character = { foo: 'bar' }
    const items = [
      ['Name', 'key', 'value', ModelTypes.text],
      ['Level', 'level', 1, ModelTypes.number]
    ]
    popup.atClickEdit(character, items)
    expect(popup.editing.open).toBe(true)
    expect(popup.character).toBe(character)
    expect(popup.editing.items.length).toBe(2)
    expect(popup.editing.items[0]).toMatchObject({
      name: 'Name',
      key: 'key',
      value: 'value',
      type: ModelTypes.text
    })
  })

  it('should reset model data', () => {
    popup.editing.open = true
    popup.editing.items = [{ name: 'a' }]
    popup.resetModelData()
    expect(popup.editing.open).toBe(false)
    expect(popup.editing.items).toEqual([])
  })

  it('should set value with saveWithReflect (no dot)', () => {
    const obj = { foo: 1 }
    popup.saveWithReflect(obj, 'foo', 42)
    expect(obj.foo).toBe(42)
  })

  it('should set value with saveWithReflect (with dot)', () => {
    const obj = { foo: { bar: 1 } }
    popup.saveWithReflect(obj, 'foo.bar', 99)
    expect(obj.foo.bar).toBe(99)
  })

  it('should call resetModelData on atClickCancel', () => {
    const spy = vi.spyOn(popup, 'resetModelData')
    popup.atClickCancel()
    expect(spy).toHaveBeenCalled()
  })

  it('should handle equipment update in atClickSave', async () => {
    const mockCharacter = {
      equipmentUpdate: vi.fn()
    }
    const mockFirebaseHandler = {
      setCharacterData: vi.fn().mockResolvedValue(undefined)
    }
    popup.configure(mockFirebaseHandler)
    popup.character = mockCharacter
    popup.editing.items = [
      { key: 'tag-equipment.item1.name', value: 'Sword' },
      { key: 'tag-equipment.item1.count', value: 1 },
      { key: 'tag-equipment.item1.weight', value: 5 },
      { key: 'tag-equipment.item1.index', value: 0 },
      { key: 'tag-equipment.item1.description', value: 'A sharp sword' }
    ]
    await popup.atClickSave()
    expect(mockCharacter.equipmentUpdate).toHaveBeenCalledWith(
      'item1',
      'Sword',
      1,
      5,
      0,
      'A sharp sword'
    )
    expect(mockFirebaseHandler.setCharacterData).toHaveBeenCalled()
  })

  it('should handle attack update in atClickSave', async () => {
    const mockCharacter = {
      attackUpdate: vi.fn()
    }
    const mockFirebaseHandler = {
      setCharacterData: vi.fn().mockResolvedValue(undefined)
    }
    popup.configure(mockFirebaseHandler)
    popup.character = mockCharacter
    popup.editing.items = [
      {
        key: 'attacks',
        value: { attack1: { name: 'Slash', bonus: 5, damage: '1d8', type: 'slashing' } }
      }
    ]
    await popup.atClickSave()
    expect(mockCharacter.attackUpdate).toHaveBeenCalledWith('attack1', {
      name: 'Slash',
      bonus: 5,
      damage: '1d8',
      type: 'slashing'
    })
    expect(mockFirebaseHandler.setCharacterData).toHaveBeenCalled()
  })

  it('should handle feature update in atClickSave', async () => {
    const mockCharacter = {
      featureUpdate: vi.fn()
    }
    const mockFirebaseHandler = {
      setCharacterData: vi.fn().mockResolvedValue(undefined)
    }
    popup.configure(mockFirebaseHandler)
    popup.character = mockCharacter
    popup.editing.items = [
      { key: 'features.feature1.name', value: 'Feature Name' },
      { key: 'features.feature1.description', value: 'Feature Description' }
    ]
    await popup.atClickSave()
    expect(mockCharacter.featureUpdate).toHaveBeenCalledWith(
      'feature1',
      'Feature Name',
      'Feature Description'
    )
    expect(mockFirebaseHandler.setCharacterData).toHaveBeenCalled()
  })

  it('should handle spell update in atClickSave', async () => {
    const mockCharacter = {
      _character: {
        spellcasting: {
          spells: {
            1: {
              known: ['Fireball'],
              prepared: ['Fireball']
            }
          }
        }
      },
      spellcastingPreparedRemove: vi.fn(),
      spellcastingPreparedAdd: vi.fn()
    }
    const mockFirebaseHandler = {
      setCharacterData: vi.fn().mockResolvedValue(undefined)
    }
    popup.configure(mockFirebaseHandler)
    popup.character = mockCharacter
    popup.editing.items = [
      { name: 'Spell', key: '_character.spellcasting.spells.1.known.0', value: 'Lightning Bolt' }
    ]
    await popup.atClickSave()
    expect(mockCharacter.spellcastingPreparedRemove).toHaveBeenCalledWith('1', 'Fireball')
    expect(mockCharacter.spellcastingPreparedAdd).toHaveBeenCalledWith('1', 'Lightning Bolt')
    expect(mockFirebaseHandler.setCharacterData).toHaveBeenCalled()
  })
})
