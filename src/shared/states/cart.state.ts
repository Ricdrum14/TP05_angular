import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';

// Actions
export class AddToCart {
  static readonly type = '[Cart] Add';
  constructor(public payload: any) {}
}

export class RemoveFromCart {
  static readonly type = '[Cart] Remove';
  constructor(public id: number) {}
}

export class DecreaseQuantity {
  static readonly type = '[Cart] Decrease';
  constructor(public id: number) {}
}

// Modèle du panier
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface CartStateModel {
  items: CartItem[];
}

@State<CartStateModel>({
  name: 'cart',
  defaults: {
    items: [] // Panier initialement vide
  }
})
@Injectable()
export class CartState {
  // Sélecteurs pour récupérer les informations du panier
  @Selector()
  static getCartItems(state: CartStateModel) {
    return state.items;
  }

  @Selector()
  static getTotalItems(state: CartStateModel) {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  }

  @Selector()
  static getTotalPrice(state: CartStateModel) {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  // Action pour ajouter un produit au panier
  @Action(AddToCart)
  add({ getState, patchState }: StateContext<CartStateModel>, { payload }: AddToCart) {
    const state = getState();
    const existingItem = state.items.find((item) => item.id === payload.id);

    if (existingItem) {
      patchState({
        items: state.items.map((item) =>
          item.id === payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      });
    } else {
      patchState({
        items: [...state.items, { ...payload, quantity: 1 }]
      });
    }
  }

  // Action pour diminuer la quantité d'un produit dans le panier
  @Action(DecreaseQuantity)
  decreaseQuantity(
    { getState, patchState }: StateContext<CartStateModel>,
    { id }: DecreaseQuantity
  ) {
    const state = getState();
    const updatedItems = state.items
      .map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
      .filter((item) => item.quantity > 0); // Supprime l'article si la quantité atteint 0

    patchState({
      items: updatedItems
    });
  }

  // Action pour supprimer complètement un produit du panier
  @Action(RemoveFromCart)
  remove({ getState, patchState }: StateContext<CartStateModel>, { id }: RemoveFromCart) {
    const state = getState();
    patchState({
      items: state.items.filter((item) => item.id !== id)
    });
  }
}
