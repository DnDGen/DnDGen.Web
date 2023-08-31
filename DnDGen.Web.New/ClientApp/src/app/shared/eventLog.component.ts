import { Input, Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { EventService } from './event.service';
import { GenEvent } from './genEvent.model';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'dndgen-event-log',
  templateUrl: './eventLog.component.html',
  providers: [
    EventService
  ]
})

export class EventLogComponent implements OnInit, OnChanges {
  constructor(private eventService: EventService) { }

  @Input() clientId: string = '';
  @Input() isLogging: boolean = false;

  public events: GenEvent[] = [];

  private pollInterval: number = 1000;
  private quantityOfEventsToShow: number = 10;
  private timer = timer(this.pollInterval, this.pollInterval);
  private subject = new Subject<void>();

  private start() {
    this.events = [];
    this.timer
      .pipe(takeUntil(this.subject))
      .subscribe(this.getEvents);
  }

  private stop() {
    this.subject.next();
    this.eventService.clearEvents(this.clientId);
  }

  private getEvents() {
    this.eventService.getEvents(this.clientId)
      .subscribe(data => {
        this.setEvents(data);
      });
  }

  private setEvents(data: { events: GenEvent[] }) {
    var newestEvents = data.events.reverse();

    for (var i = 0; i < this.quantityOfEventsToShow && i < newestEvents.length; i++) {
      this.events.splice(i, 0, newestEvents[i]);

      while (this.events.length > this.quantityOfEventsToShow)
        this.events.pop();
    }
  }

  ngOnInit(): void {
    if (!this.clientId)
      return;

    if (this.isLogging) {
      this.start();
    } else {
      this.stop();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.clientId)
      return;

    if (changes.isLogging.currentValue) {
      this.start();
    } else {
      this.stop();
    }
  }
}
