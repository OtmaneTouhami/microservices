import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Bill, Customer, Product, ProductItem } from '../../models/models';
import { BillService, CreateBillRequest } from '../../services/bill.service';
import { CustomerService } from '../../services/customer.service';
import { ProductService } from '../../services/product.service';
import { ProductItemService, ProductItemRequest } from '../../services/product-item.service';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bills.component.html'
})
export class BillsComponent implements OnInit {
  private billService = inject(BillService);
  private customerService = inject(CustomerService);
  private productService = inject(ProductService);
  private productItemService = inject(ProductItemService);

  bills = signal<Bill[]>([]);
  customers = signal<Customer[]>([]);
  products = signal<Product[]>([]);
  loading = signal(true);

  // View details modal
  selectedBill = signal<Bill | null>(null);
  loadingDetails = signal(false);

  // Create/Edit bill modal
  showModal = signal(false);
  saving = signal(false);
  editingBill = signal<Bill | null>(null);
  formData = signal<CreateBillRequest>({
    billingDate: new Date().toISOString(),
    customerId: 0
  });

  // Add item modal  
  showAddItemModal = signal(false);
  savingItem = signal(false);
  itemFormData = signal<ProductItemRequest>({
    billId: 0,
    productId: '',
    quantity: 1
  });
  itemError = signal<string | null>(null);

  ngOnInit() {
    this.loadBills();
    this.loadCustomers();
    this.loadProducts();
  }

  loadBills() {
    this.loading.set(true);
    this.billService.getAll().subscribe({
      next: (data) => {
        this.bills.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading bills:', err);
        this.loading.set(false);
      }
    });
  }

  loadCustomers() {
    this.customerService.getAll().subscribe({
      next: (data) => this.customers.set(data),
      error: (err) => console.error('Error loading customers:', err)
    });
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error('Error loading products:', err)
    });
  }

  // Create/Edit Bill Modal
  openModal(bill?: Bill) {
    if (bill) {
      this.editingBill.set(bill);
      this.formData.set({
        billingDate: bill.billingDate,
        customerId: bill.customerId
      });
    } else {
      this.editingBill.set(null);
      this.formData.set({
        billingDate: new Date().toISOString(),
        customerId: 0
      });
    }
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingBill.set(null);
  }

  updateFormField(field: keyof CreateBillRequest, value: string | number) {
    this.formData.update(form => ({ ...form, [field]: value }));
  }

  saveBill() {
    const form = this.formData();
    if (!form.customerId) return;

    this.saving.set(true);
    const editing = this.editingBill();

    if (editing && editing.id) {
      this.billService.update(editing.id, form).subscribe({
        next: () => {
          this.loadBills();
          this.closeModal();
          this.saving.set(false);
        },
        error: (err) => {
          console.error('Error updating bill:', err);
          this.saving.set(false);
        }
      });
    } else {
      this.billService.create(form).subscribe({
        next: () => {
          this.loadBills();
          this.closeModal();
          this.saving.set(false);
        },
        error: (err) => {
          console.error('Error creating bill:', err);
          this.saving.set(false);
        }
      });
    }
  }

  deleteBill(bill: Bill) {
    if (!bill.id) return;
    if (!confirm(`Are you sure you want to delete Bill #${bill.id}?`)) return;

    this.billService.delete(bill.id).subscribe({
      next: () => this.loadBills(),
      error: (err) => console.error('Error deleting bill:', err)
    });
  }

  // View Bill Details Modal
  viewBillDetails(bill: Bill) {
    if (!bill.id) return;

    this.selectedBill.set(bill);
    this.loadingDetails.set(true);

    this.billService.getFullBill(bill.id).subscribe({
      next: (fullBill) => {
        this.selectedBill.set(fullBill);
        this.loadingDetails.set(false);
      },
      error: (err) => {
        console.error('Error loading bill details:', err);
        this.loadingDetails.set(false);
      }
    });
  }

  closeBillDetails() {
    this.selectedBill.set(null);
  }

  // Add Item Modal
  openAddItemModal() {
    const bill = this.selectedBill();
    if (!bill || !bill.id) return;

    this.itemFormData.set({
      billId: bill.id,
      productId: '',
      quantity: 1
    });
    this.itemError.set(null);
    this.showAddItemModal.set(true);
  }

  closeAddItemModal() {
    this.showAddItemModal.set(false);
    this.itemError.set(null);
  }

  updateItemFormField(field: keyof ProductItemRequest, value: string | number) {
    this.itemFormData.update(form => ({ ...form, [field]: value }));
  }

  addItem() {
    const form = this.itemFormData();
    if (!form.productId || form.quantity < 1) return;

    this.savingItem.set(true);
    this.itemError.set(null);

    this.productItemService.addItem(form).subscribe({
      next: () => {
        this.closeAddItemModal();
        this.savingItem.set(false);
        // Refresh bill details
        const bill = this.selectedBill();
        if (bill) this.viewBillDetails(bill);
        // Refresh products to show updated quantities
        this.loadProducts();
      },
      error: (err) => {
        console.error('Error adding item:', err);
        this.itemError.set(err.error || 'Failed to add item. Check product availability.');
        this.savingItem.set(false);
      }
    });
  }

  removeItem(item: ProductItem) {
    if (!item.id) return;
    if (!confirm('Remove this item from the bill?')) return;

    this.productItemService.removeItem(item.id).subscribe({
      next: () => {
        const bill = this.selectedBill();
        if (bill) this.viewBillDetails(bill);
        this.loadProducts();
      },
      error: (err) => console.error('Error removing item:', err)
    });
  }

  calculateTotal(bill: Bill): number {
    if (!bill.productItems) return 0;
    return bill.productItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }

  getCustomerName(customerId: number): string {
    const customer = this.customers().find(c => c.id === customerId);
    return customer ? customer.name : `Customer #${customerId}`;
  }

  getProductName(productId: string): string {
    const product = this.products().find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  }

  getAvailableProducts(): Product[] {
    return this.products().filter(p => p.quantity > 0);
  }
}
