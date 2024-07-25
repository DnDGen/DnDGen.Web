import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class FileSaverService {
  public save(content: string, fileNameWithoutExtension: string) {
    var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, fileNameWithoutExtension + ".txt");
  }
}
