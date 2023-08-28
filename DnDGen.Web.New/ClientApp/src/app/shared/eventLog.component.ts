import { Input, Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { EventService } from './event.service';
import { GenEvent } from './genEvent.model';

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

  private events: object[] = [];
  private pollInterval: number = 1000;
  private quantityOfEventsToShow: number = 10;
  private timer: string | number | NodeJS.Timer | undefined;

  private start() {
    this.events = [];
    this.timer = setInterval(this.getEvents, this.pollInterval);
  }

  private stop() {
    clearInterval(this.timer);
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
