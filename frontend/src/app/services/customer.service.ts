import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Customer, PagedResponse } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CustomerService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiBaseUrl}/customer-service/api/customers`;

    getAll(): Observable<Customer[]> {
        return this.http.get<PagedResponse<Customer>>(this.baseUrl).pipe(
            map(response => response._embedded?.customers || [])
        );
    }

    getById(id: number): Observable<Customer> {
        return this.http.get<Customer>(`${this.baseUrl}/${id}`);
    }

    create(customer: Customer): Observable<Customer> {
        return this.http.post<Customer>(this.baseUrl, customer);
    }

    update(id: number, customer: Customer): Observable<Customer> {
        return this.http.put<Customer>(`${this.baseUrl}/${id}`, customer);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
