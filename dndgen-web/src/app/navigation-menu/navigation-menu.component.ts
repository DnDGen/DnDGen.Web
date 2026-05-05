import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbNavModule, NgbDropdownModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'dndgen-navigation-menu',
    templateUrl: './navigation-menu.component.html',
    styleUrls: ['./navigation-menu.component.css'],
    standalone: true,
    imports: [RouterLink, NgbNavModule, NgbDropdownModule, NgbCollapseModule]
})
export class NavMenuComponent {
    isMenuCollapsed: boolean = true;
 }
