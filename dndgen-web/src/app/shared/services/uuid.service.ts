import { Injectable } from '@angular/core';
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class UuidService {
  public generate(): string {
    return uuid.v4();
  }
}
