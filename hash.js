class HashMap {
  constructor(initialCapacity = 8) {
    this.length = 0;
    this._slots = [];
    this._capacity = initialCapacity;
    this._deleted = 0;
  }

  get(key) {
    const index = this._findSlot(key);
    if (this._slots[index] === undefined) {
      return;
    }
    return this._slots[index];
  }

  set(key, value) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }

    const index = this._findSlot(key);
    this._slots[index] = {
      key,
      value,
      deleted: false
    };
    this.length++;
  }

  remove(key) {
    const index = this._findSlot(key);
    const slot = this._slots[index];
    if (slot === undefined) {
      throw new Error("Key error");
    }
    slot.deleted = true;
    this.length--;
    this._deleted++;
  }

  _findSlot(key) {
    const hash = HashMap._hashString(key);
    const start = hash % this._capacity;

    for (let i = start; i < start + this._capacity; i++) {
      const index = i % this._capacity;
      const slot = this._slots[index];
      if (slot === undefined || (slot.key == key && !slot.deleted)) {
        return index;
      }
    }
  }

  _resize(size) {
    const oldSlots = this._slots;
    this._capacity = size;
    this.length = 0;
    this._deleted = 0;
    this._slots = [];

    for (const slot of oldSlots) {
      if (slot !== undefined && !slot.deleted) {
        this.set(slot.key, slot.value);
      }
    }
  }

  static _hashString(string) {
    let hash = 5381;
    for (let i = 0; i < string.length; i++) {
      hash = (hash << 5) + hash + string.charCodeAt(i);
      hash = hash & hash;
    }
    return hash >>> 0;
  }
}

HashMap.MAX_LOAD_RATIO = 0.9;
HashMap.SIZE_RATIO = 3;

function main() {
  const lor = new HashMap();

  // let newItems = [
  //   ["Hobbit", "Bilbo"],
  //   ["Hobbit", "Frodo"],
  //   ["Wizard", "Gandolf"],
  //   ["Human", "Aragon"],
  //   ["Elf", "Legolas"],
  //   ["Maiar", "The Necromancer"],
  //   ["Maiar", "Sauron"],
  //   ["RingBearer", "Gollum"],
  //   ["LadyOfLight", "Galadriel"],
  //   ["HalfElven", "Arwen"],
  //   ["Ent", "Treebeard"]
  // ];

  // newItems.forEach(item => lor.set(item[0], item[1]));
  //   console.log(lor.get("Maiar"));

  function hashPalindrome(str) {
    for (let i = 0; i < str.length; i++) {
      let amount = 1;
      if (lor.get(str[i]) !== undefined) {
        amount = lor.get(str[i]).value + 1;
      }
      lor.set(str[i], amount);
    }
    let oddCount = 0;
    for (let i = 0; i < str.length; i++) {
      let num = lor.get(str[i]).value;
      if (num % 2 !== 0) {
        oddCount = oddCount + 1;
      }
    }
    if (oddCount > 1) {
      return false;
    }
    return true;
  }
  //   return hashPalindrome("north");

  function makeAlphabet(str) {
    let arr = str.split("");
    let alpha = arr
      .sort()
      .join("")
      .replace(/\s+/g, "");
    return alpha;
  }

  function anagramGrouping(arr) {
    let arrays = [];
    arr.forEach(item => {
      let sorted = makeAlphabet(item);
      if (lor.get(sorted)) {
        lor.set(sorted, [...lor.get(sorted).value, item.toString()]);
      }
      if (!lor.get(sorted)) {
        lor.set(sorted, [item.toString()]);
        arrays.push(sorted);
      }
    });
    let solution = [];
    arrays.forEach(item => {
      solution.push(lor.get(item).value);
    });
    return solution;
  }
  return anagramGrouping([
    "east",
    "cars",
    "acre",
    "arcs",
    "teas",
    "eats",
    "race"
  ]);
}


console.log(main());
