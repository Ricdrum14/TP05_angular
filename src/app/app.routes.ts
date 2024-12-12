import { Routes } from '@angular/router';
import { CatalogComponent } from './catalog/catalog.component';
import { PanierComponent } from './panier/panier.component';

export const routes: Routes = [
  { path: '', component: CatalogComponent },
  { path: 'panier', component: PanierComponent },
  { path: '**', redirectTo: '' }
];
