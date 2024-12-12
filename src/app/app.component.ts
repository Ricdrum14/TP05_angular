import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Ajoutez ceci
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CartState } from '../shared/states/cart.state';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule], // Ajoutez CommonModule ici
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  totalItems$: Observable<number>;

  constructor(private store: Store) {
    this.totalItems$ = this.store.select(CartState.getTotalItems);
  }
}
