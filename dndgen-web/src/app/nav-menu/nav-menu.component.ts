import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbNavModule, NgbDropdownModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'dndgen-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.css'],
    standalone: true,
    imports: [RouterLink, NgbNavModule, NgbDropdownModule, NgbCollapseModule]
})
export class NavMenuComponent {
    isMenuCollapsed = true;
 }
