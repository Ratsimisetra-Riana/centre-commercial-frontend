import { Routes } from '@angular/router';
import { ArticleListComponent } from './components/article-list/article-list.component';
import { MainLayout } from './components/layout/main-layout/main-layout';
import { ProductPage } from './components/product-page/product-page';
import { ProductDetailsPage } from './components/product-details-page/product-details-page';

export const routes: Routes = [
{ path: 'articles', component: ArticleListComponent }, // Route pourarticle-list
//{ path: '', redirectTo: 'articles', pathMatch: 'full' } // Redirection par défaut
{
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' }, // default
      { path: 'products', component: ProductPage },
      { path: 'products/:id', component: ProductDetailsPage }
    ]
  }
];