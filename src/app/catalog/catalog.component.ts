import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { Instruments } from '../../shared/models/instrument';
import { Store } from '@ngxs/store';
import { AddToCart, CartState } from '../../shared/states/cart.state'; // Importez l'action et l'état

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  private searchTerm$ = new BehaviorSubject<string>('');
  private selectedCategory$ = new BehaviorSubject<number>(0);

  instruments$!: Observable<Instruments[]>;
  categories = [
    { id: 0, titre: 'Toutes les catégories' },
    { id: 1, titre: 'Instruments à vent' },
    { id: 2, titre: 'Instruments à cordes' },
    { id: 3, titre: 'Instruments à percussion' }
  ];
  messageAucunInstrument = '';
  totalInstruments = 0; // Propriété pour le nombre total d'instruments

  constructor(private apiService: ApiService, private store: Store) {}

  ngOnInit(): void {
    this.instruments$ = combineLatest([
      this.apiService.getInstruments(),
      this.searchTerm$,
      this.selectedCategory$
    ]).pipe(
      map(([instruments, searchTerm, selectedCategory]) => {
        const filteredInstruments = instruments.filter((instrument) => {
          const matchesCategory =
            selectedCategory === 0 || instrument.categorieId === selectedCategory;
          const matchesSearch = instrument.nom
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
          return matchesCategory && matchesSearch;
        });

        // Mettre à jour le nombre total d'instruments
        this.totalInstruments = filteredInstruments.length;

        this.messageAucunInstrument =
          filteredInstruments.length === 0 ? 'Aucun instrument trouvé' : '';

        return filteredInstruments;
      })
    );
  }

  // Méthode pour gérer l'événement de recherche
  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm$.next(input.value);
  }

  // Méthode pour gérer le changement de catégorie
  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCategory$.next(Number(select.value));
  }

  // Méthode pour ajouter un instrument au panier
  addToCart(instrument: Instruments): void {
    this.store.dispatch(
      new AddToCart({
        id: instrument.id,
        name: instrument.nom,
        price: instrument.prix
      })
    );
  }

  // Méthode pour récupérer la quantité d'un instrument dans le panier
  getItemCount(instrumentId?: number): number {
    if (!instrumentId) {
      return 0;
    }
    const item = this.store.selectSnapshot(CartState.getCartItems).find((item) => item.id === instrumentId);
    return item ? item.quantity : 0;
  }
  
}
