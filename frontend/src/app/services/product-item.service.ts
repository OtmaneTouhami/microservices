import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductItem } from '../models/models';
import { environment } from '../../environments/environment';

export interface ProductItemRequest {
    billId: number;
    productId: string;
    quantity: number;
}

@Injectable({ providedIn: 'root' })
export class ProductItemService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiBaseUrl}/billing-service/productItems`;

    getByBillId(billId: number): Observable<ProductItem[]> {
        return this.http.get<ProductItem[]>(`${this.baseUrl}/bill/${billId}`);
    }

    addItem(request: ProductItemRequest): Observable<ProductItem> {
        return this.http.post<ProductItem>(this.baseUrl, request);
    }

    updateQuantity(itemId: number, quantity: number): Observable<ProductItem> {
        return this.http.patch<ProductItem>(`${this.baseUrl}/${itemId}/quantity?quantity=${quantity}`, {});
    }

    removeItem(itemId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${itemId}`);
    }
}
