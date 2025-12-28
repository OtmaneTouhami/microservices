import { Component, inject, OnInit, signal } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { ProductService } from '../../services/product.service';
import { BillService } from '../../services/bill.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private customerService = inject(CustomerService);
  private productService = inject(ProductService);
  private billService = inject(BillService);

  customers = signal(0);
  products = signal(0);
  bills = signal(0);

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.customerService.getAll().subscribe({
      next: (data) => this.customers.set(data.length),
      error: () => this.customers.set(0)
    });

    this.productService.getAll().subscribe({
      next: (data) => this.products.set(data.length),
      error: () => this.products.set(0)
    });

    this.billService.getAll().subscribe({
      next: (data) => this.bills.set(data.length),
      error: () => this.bills.set(0)
    });
  }
}
