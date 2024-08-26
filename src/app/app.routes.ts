import { Routes } from '@angular/router';
import { ProductsViewComponent } from './pages/products-view/products-view.component';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';

export const routes: Routes = [
{path:'products',component:ProductsViewComponent},
{path:'add',component:AddProductComponent},
{path:'edit',component:EditProductComponent},

{ path: '', redirectTo: '/products', pathMatch: 'full' }

];
