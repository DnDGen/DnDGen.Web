import { Observable } from 'rxjs';
import { CharacterGenViewModel } from '../models/charactergen-view-model.model';

const delay = 10;

export function getViewModel(): CharacterGenViewModel {
  return new CharacterGenViewModel(
    ['alignment randomizer 1', 'alignment randomizer 2'],
    ['alignment 1', 'alignment 2'],
    ['class name randomizer 1', 'class name randomizer 2'],
    ['class name 1', 'class name 2'],
    ['level randomizer 1', 'level randomizer 2'],
    ['base race randomizer 1', 'base race randomizer 2'],
    ['base race 1', 'base race 2'],
    ['metarace randomizer 1', 'metarace randomizer 2'],
    ['metarace 1', 'metarace 2'],
    ['abilities randomizer 1', 'abilities randomizer 2'],
  );
}

export function getFakeDelay<T>(response: T): Observable<T> {
  return new Observable((observer) => {
    setTimeout(() => {
      observer.next(response);
      observer.complete();
    }, delay);
  });
}

export function getFakeError<T>(message: string): Observable<T> {
  return new Observable((observer) => {
    setTimeout(() => {
      observer.error(new Error(message));
    }, delay);
  });
}

export { delay };
