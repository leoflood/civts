const randomFromArray = (array: any[]) =>
  array[Math.floor(Math.random() * array.length)];

class LivingBeing {
  hp = 0;
  attack = 0;
  dexterity = 0;

  get isDead() {
    return this.hp <= 0;
  }

  attackTo(target: LivingBeing) {
    const rand = Math.random();
    const isHit = (100 + this.dexterity - target.dexterity) * rand >= 50;

    if (isHit) target.hp -= this.attack;
  }
}

class Human extends LivingBeing {
  hp = 100;
  attack = 20;
  dexterity = 20;
}

class Elf extends LivingBeing {
  hp = 75;
  attack = 10;
  dexterity = 40;
}

class Orc extends LivingBeing {
  hp = 150;
  attack = 40;
  dexterity = 10;
}

interface ICivilization {
  name: string;
  soldiers: LivingBeing[];
}

class Game {
  civilizations: ICivilization[] = [
    {
      name: "Humans",
      soldiers: [
        new Human(),
        new Human(),
        new Human(),
        new Human(),
        new Human(),
      ],
    },
    {
      name: "Elves",
      soldiers: [new Elf(), new Elf(), new Elf(), new Elf(), new Elf()],
    },
    {
      name: "Orcs",
      soldiers: [new Orc(), new Orc(), new Orc(), new Orc(), new Orc()],
    },
  ];

  getAliveCivs() {
    return this.civilizations.filter((civ) =>
      civ.soldiers.some((s) => !s.isDead)
    );
  }

  getEnemySoldiers(civ: ICivilization) {
    return this.civilizations
      .filter((c) => c !== civ)
      .map((c) => c.soldiers.filter((s) => !s.isDead))
      .flat(1);
  }

  getCivHp(civ: ICivilization) {
    return civ.soldiers.reduce((prev, cur) => prev + cur.hp, 0);
  }

  loop() {
    const aliveCivs = this.getAliveCivs();

    aliveCivs.forEach((civ) => {
      const soldiers = civ.soldiers.filter((s) => !s.isDead);

      soldiers.forEach((soldier) => {
        const enemySoldiers = this.getEnemySoldiers(civ);

        if (!enemySoldiers.length) return;

        const enemyToAttack = randomFromArray(enemySoldiers);
        soldier.attackTo(enemyToAttack);
      });
    });
  }
}

const game = new Game();

while (game.getAliveCivs().length > 1) {
  game.loop();
}

game.civilizations.forEach((civ) => {
  console.log(civ.name, game.getCivHp(civ));
});
