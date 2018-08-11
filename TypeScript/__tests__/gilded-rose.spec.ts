import { Item, GildedRose } from "../app/gilded-rose";

describe("Gilded Rose", function() {
  const itemNames = [
    "foo",
    "Aged Brie",
    "Backstage passes to a TAFKAL80ETC concert",
    "Sulfuras, Hand of Ragnaros",
    "Conjured Mana Cake"
  ];
  const sellIns = [0, 1, -1, 6, 11];
  const qualities = [0, 1, 50, 49];

  for (const name of itemNames) {
    for (const sellIn of sellIns) {
      for (const quality of qualities) {
        it(`${name} of quality ${quality} sellsIn ${sellIn}`, function() {
          const gildedRose = new GildedRose([new Item(name, sellIn, quality)]);
          const items = gildedRose.updateQuality();
          expect(items[0]).toMatchSnapshot();
        });
      }
    }
  }
});
