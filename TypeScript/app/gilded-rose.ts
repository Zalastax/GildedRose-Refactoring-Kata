export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

function defaultItemQualityChange(sellIn: number) {
  if (sellIn < 0) {
    return -2;
  }
  return -1;
}

function updateDefaultItem(item: Item) {
  updateItem(defaultItemQualityChange, item)
}

function doubleItemQualityChange(sellIn: number) {
  return defaultItemQualityChange(sellIn) * 2;
}

function updateConjured(item: Item) {
  updateItem(doubleItemQualityChange, item)
}

function backstageQualityChange(sellIn: number) {
  if (sellIn < 6) {
    return 3;
  }
  if (sellIn < 11) {
    return 2;
  }
  return 1;
}

function updateBackstageItem(item: Item) {
  // It's a bit strange that this item modifies sellIn
  // after updating quality while others update it before...
  item.quality = Math.min(
    50,
    item.quality + backstageQualityChange(item.sellIn)
  );

  item.sellIn = item.sellIn - 1;
  if (item.sellIn < 0) {
    item.quality = 0;
  }
}

function brieItemQualityChange(sellIn: number) {
  if (sellIn < 0) {
    return 2;
  }
  return 1;
}

function updateBrieItem(item: Item) {
  updateItem(brieItemQualityChange, item)
}

type QualityChange = (sellIn: number) => number;

function updateItem(qualityChange: QualityChange, item: Item) {
    item.sellIn = item.sellIn - 1;
    item.quality = Math.max(0, Math.min(50, item.quality + qualityChange(item.sellIn)));
}

function itemNoOp(item: Item) {}

type SideEffect = () => void;

const updatersMapping = new Map([
  ["Aged Brie", updateBrieItem],
  ["Backstage passes to a TAFKAL80ETC concert", updateBackstageItem],
  ["Sulfuras, Hand of Ragnaros", itemNoOp],
  // Looking at other implementations it seems like the only conjured item is
  // Conjured Mana Cake. Would be easy to change from map to a function if more conjured items
  // should be supported.
  ["Conjured Mana Cake", updateConjured]
]);

function getOrDefault<K, V>(map: Map<K, V>, key: K, orDefault: V) {
  if (map.has(key)) {
    return map.get(key);
  }
  return orDefault;
}

export class GildedRose {
  private items: Array<Item>;
  private itemUpdaters: Array<SideEffect>;

  /**
   *
   * @param items Items to update.
   * Passing items to this constructor gives up ownership;
   * do not modify items outside GildedRose!
   */
  constructor(items: Array<Item>) {
    this.items = items;
    this.itemUpdaters = items.map(item => {
      // Select update function via its name
      const updater = getOrDefault(
        updatersMapping,
        item.name,
        updateDefaultItem
      );
      // Bind the item parameter to the update function
      return updater.bind(undefined, item);
    });
  }

  updateQuality() {
    for (const updater of this.itemUpdaters) {
      updater();
    }

    return this.items;
  }
}
