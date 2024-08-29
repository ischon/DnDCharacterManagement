export class Attack {
    constructor(name, bonus, damage, type) {
        this.name = name;
        this.bonus = bonus;
        this.damage = damage;
        this.type = type;
    }
}

export class Item {
    constructor(index, name, count, weight) {
        this.index = index
        this.name = name;
        this.count = count;
        this.weight = weight;
    }
}
