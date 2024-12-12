import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CartState, RemoveFromCart, AddToCart, DecreaseQuantity } from '../../shared/states/cart.state';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css'],
})
export class PanierComponent implements OnInit {
  cartItems$!: Observable<any[]>;
  totalPrice$!: Observable<number>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.cartItems$ = this.store.select(CartState.getCartItems);
    this.totalPrice$ = this.store.select(CartState.getTotalPrice);
  }

  addToCart(item: any): void {
    this.store.dispatch(new AddToCart({ id: item.id, name: item.name, price: item.price }));
  }

  decreaseQuantity(id: number): void {
    this.store.dispatch(new DecreaseQuantity(id));
  }

  removeFromCart(id: number): void {
    this.store.dispatch(new RemoveFromCart(id));
  }
}
