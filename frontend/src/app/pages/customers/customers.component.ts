import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer } from '../../models/models';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html'
})
export class CustomersComponent implements OnInit {
  private customerService = inject(CustomerService);

  customers = signal<Customer[]>([]);
  loading = signal(true);
  showModal = signal(false);
  saving = signal(false);
  editingCustomer = signal<Customer | null>(null);
  formData = signal<Customer>({ name: '', email: '' });

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading.set(true);
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading customers:', err);
        this.loading.set(false);
      }
    });
  }

  openModal(customer?: Customer) {
    if (customer) {
      this.editingCustomer.set(customer);
      this.formData.set({ ...customer });
    } else {
      this.editingCustomer.set(null);
      this.formData.set({ name: '', email: '' });
    }
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingCustomer.set(null);
    this.formData.set({ name: '', email: '' });
  }

  updateFormField(field: keyof Customer, value: string) {
    this.formData.update(form => ({ ...form, [field]: value }));
  }

  saveCustomer() {
    const form = this.formData();
    if (!form.name || !form.email) return;

    this.saving.set(true);
    const editing = this.editingCustomer();

    if (editing && editing.id) {
      this.customerService.update(editing.id, form).subscribe({
        next: () => {
          this.loadCustomers();
          this.closeModal();
          this.saving.set(false);
        },
        error: (err) => {
          console.error('Error updating customer:', err);
          this.saving.set(false);
        }
      });
    } else {
      this.customerService.create(form).subscribe({
        next: () => {
          this.loadCustomers();
          this.closeModal();
          this.saving.set(false);
        },
        error: (err) => {
          console.error('Error creating customer:', err);
          this.saving.set(false);
        }
      });
    }
  }

  deleteCustomer(customer: Customer) {
    if (!customer.id) return;
    if (!confirm(`Are you sure you want to delete ${customer.name}?`)) return;

    this.customerService.delete(customer.id).subscribe({
      next: () => this.loadCustomers(),
      error: (err) => console.error('Error deleting customer:', err)
    });
  }
}
