import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  public logError(message: string) {
    console.error(message);
  }
}
