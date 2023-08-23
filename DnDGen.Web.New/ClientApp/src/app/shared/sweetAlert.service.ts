import { Injectable } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Injectable({
  providedIn: 'root',
})
export class SweetAlertService {
  public showError() {
    Swal.fire(
      "Critical Miss",
      "Well, this is embarassing.  DnDGen rolled a Nat 1.  We've complained loudly to the DM (the development team), and they will fix this problem as soon as they can.",
      "error");
  }
}
