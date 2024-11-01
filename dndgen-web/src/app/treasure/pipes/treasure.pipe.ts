import { Pipe, PipeTransform } from '@angular/core';
import { Treasure } from '../models/treasure.model';
import { ItemPipe } from './item.pipe';
import { DecimalPipe } from '@angular/common';

@Pipe({ 
  name: 'treasure',
  standalone: true 
})
export class TreasurePipe implements PipeTransform {
  constructor(
    private itemPipe: ItemPipe,
    private numberPipe: DecimalPipe
  ) { }

  transform(value: Treasure, prefix?: string): string {
    return this.formatTreasure(value, prefix);
  }

  private formatTreasure(treasure: Treasure, prefix?: string): string {
    if (!prefix)
        prefix = '';

    var formattedTreasure = '';

    if (treasure.coin.quantity > 0)
        formattedTreasure += prefix + this.numberPipe.transform(treasure.coin.quantity) + ' ' + treasure.coin.currency + '\r\n';
    else
        formattedTreasure += prefix + 'No coins\r\n';

    if (treasure.goods.length > 0)
        formattedTreasure += prefix + `Goods (x${treasure.goods.length}):\r\n`;
    else
        formattedTreasure += prefix + 'Goods (x0)\r\n';

    for (var i = 0; i < treasure.goods.length; i++) {
      formattedTreasure += prefix + '\t' + treasure.goods[i].description + ' (' + this.numberPipe.transform(treasure.goods[i].valueInGold) + 'gp)\r\n';
    }

    if (treasure.items.length > 0)
        formattedTreasure += prefix + `Items (x${treasure.items.length}):\r\n`;
    else
        formattedTreasure += prefix + 'Items (x0)\r\n';

    for (var j = 0; j < treasure.items.length; j++) {
        formattedTreasure += this.itemPipe.transform(treasure.items[j], prefix + '\t');
    }

    return formattedTreasure;
  }
}
