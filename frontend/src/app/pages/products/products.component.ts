import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/models';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  loading = signal(true);
  showModal = signal(false);
  saving = signal(false);
  editingProduct = signal<Product | null>(null);
  formData = signal<Product>({ name: '', price: 0, quantity: 0 });

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loading.set(false);
      }
    });
  }

  openModal(product?: Product) {
    if (product) {
      this.editingProduct.set(product);
      this.formData.set({ ...product });
    } else {
      this.editingProduct.set(null);
      this.formData.set({ name: '', price: 0, quantity: 0 });
    }
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingProduct.set(null);
    this.formData.set({ name: '', price: 0, quantity: 0 });
  }

  updateFormField(field: keyof Product, value: string | number) {
    this.formData.update(form => ({ ...form, [field]: value }));
  }

  saveProduct() {
    const form = this.formData();
    if (!form.name) return;

    this.saving.set(true);
    const editing = this.editingProduct();

    if (editing && editing.id) {
      this.productService.update(editing.id, form).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
          this.saving.set(false);
        },
        error: (err) => {
          console.error('Error updating product:', err);
          this.saving.set(false);
        }
      });
    } else {
      this.productService.create(form).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
          this.saving.set(false);
        },
        error: (err) => {
          console.error('Error creating product:', err);
          this.saving.set(false);
        }
      });
    }
  }

  deleteProduct(product: Product) {
    if (!product.id) return;
    if (!confirm(`Are you sure you want to delete ${product.name}?`)) return;

    this.productService.delete(product.id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error('Error deleting product:', err)
    });
  }
}
