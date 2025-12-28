import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'customers',
                loadComponent: () => import('./pages/customers/customers.component').then(m => m.CustomersComponent)
            },
            {
                path: 'products',
                loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent)
            },
            {
                path: 'bills',
                loadComponent: () => import('./pages/bills/bills.component').then(m => m.BillsComponent)
            }
        ]
    },
    { path: '**', redirectTo: 'dashboard' }
];
