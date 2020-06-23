import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  public authChange = new Subject<boolean>();
  public loading = new Subject<void>();

  constructor(private _snackBar: MatSnackBar) { }
  
  openSnackBar(message: string) {
    this._snackBar.open(message, 'close', {
      duration: 5000,
      verticalPosition: 'top'
    });
  }
}
