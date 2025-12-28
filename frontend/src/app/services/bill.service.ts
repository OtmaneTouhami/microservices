import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Bill, PagedResponse } from '../models/models';
import { environment } from '../../environments/environment';

export interface CreateBillRequest {
    billingDate: string;
    customerId: number;
}

@Injectable({ providedIn: 'root' })
export class BillService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiBaseUrl}/billing-service`;

    getAll(): Observable<Bill[]> {
        return this.http.get<PagedResponse<Bill>>(`${this.baseUrl}/api/bills`).pipe(
            map(response => response._embedded?.bills || [])
        );
    }

    getFullBill(id: number): Observable<Bill> {
        return this.http.get<Bill>(`${this.baseUrl}/bills/full/${id}`);
    }

    create(bill: CreateBillRequest): Observable<Bill> {
        return this.http.post<Bill>(`${this.baseUrl}/api/bills`, bill);
    }

    update(id: number, bill: CreateBillRequest): Observable<Bill> {
        return this.http.put<Bill>(`${this.baseUrl}/api/bills/${id}`, bill);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/api/bills/${id}`);
    }
}
