import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product, PagedResponse } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiBaseUrl}/inventory-service/api/products`;

    getAll(): Observable<Product[]> {
        return this.http.get<PagedResponse<Product>>(this.baseUrl).pipe(
            map(response => response._embedded?.products || [])
        );
    }

    getById(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.baseUrl}/${id}`);
    }

    create(product: Product): Observable<Product> {
        return this.http.post<Product>(this.baseUrl, product);
    }

    update(id: string, product: Product): Observable<Product> {
        return this.http.put<Product>(`${this.baseUrl}/${id}`, product);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
