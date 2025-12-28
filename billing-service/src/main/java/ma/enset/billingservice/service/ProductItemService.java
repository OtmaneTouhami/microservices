package ma.enset.billingservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.enset.billingservice.dto.ProductItemRequest;
import ma.enset.billingservice.entities.Bill;
import ma.enset.billingservice.entities.ProductItem;
import ma.enset.billingservice.entities.models.Product;
import ma.enset.billingservice.feign.ProductRestClient;
import ma.enset.billingservice.repositories.BillRepository;
import ma.enset.billingservice.repositories.ProductItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductItemService {

    private final ProductItemRepository productItemRepository;
    private final BillRepository billRepository;
    private final ProductRestClient productRestClient;

    public List<ProductItem> getItemsByBillId(Long billId) {
        return productItemRepository.findAll().stream()
                .filter(item -> item.getBill() != null && item.getBill().getId().equals(billId))
                .toList();
    }

    @Transactional
    public ProductItem addItemToBill(ProductItemRequest request) {
        log.info("Adding item to bill: billId={}, productId={}, quantity={}", 
                request.getBillId(), request.getProductId(), request.getQuantity());
        
        // Check product availability
        try {
            Boolean available = productRestClient.checkAvailability(request.getProductId(), request.getQuantity());
            if (available == null || !available) {
                throw new RuntimeException("Insufficient product quantity available");
            }
        } catch (Exception e) {
            log.error("Error checking availability: {}", e.getMessage());
            throw new RuntimeException("Could not verify product availability: " + e.getMessage());
        }

        // Get the bill
        Bill bill = billRepository.findById(request.getBillId())
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        // Get product details
        Product product;
        try {
            product = productRestClient.getProductById(request.getProductId());
        } catch (Exception e) {
            log.error("Error fetching product: {}", e.getMessage());
            throw new RuntimeException("Could not fetch product details: " + e.getMessage());
        }

        // Create and save item
        ProductItem item = ProductItem.builder()
                .bill(bill)
                .productId(request.getProductId())
                .quantity(request.getQuantity())
                .unitPrice(product.getPrice())
                .build();

        ProductItem savedItem = productItemRepository.save(item);
        log.info("Saved product item with id: {}", savedItem.getId());

        // Decrease inventory
        try {
            productRestClient.updateQuantity(request.getProductId(), -request.getQuantity());
            log.info("Updated inventory for product: {}", request.getProductId());
        } catch (Exception e) {
            log.error("Error updating inventory: {}", e.getMessage());
            // Don't throw here - item was saved, inventory update failed
        }

        return savedItem;
    }

    @Transactional
    public ProductItem updateItemQuantity(Long itemId, int newQuantity) {
        ProductItem item = productItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Product item not found"));

        int quantityDelta = newQuantity - item.getQuantity();

        if (quantityDelta > 0) {
            // Need more quantity - check availability
            try {
                Boolean available = productRestClient.checkAvailability(item.getProductId(), quantityDelta);
                if (available == null || !available) {
                    throw new RuntimeException("Insufficient product quantity available");
                }
            } catch (RuntimeException e) {
                throw e;
            } catch (Exception e) {
                log.error("Error checking availability: {}", e.getMessage());
            }
        }

        // Update inventory
        try {
            productRestClient.updateQuantity(item.getProductId(), -quantityDelta);
        } catch (Exception e) {
            log.error("Error updating inventory: {}", e.getMessage());
        }

        // Update item
        item.setQuantity(newQuantity);
        return productItemRepository.save(item);
    }

    @Transactional
    public void removeItemFromBill(Long itemId) {
        log.info("Removing item from bill: itemId={}", itemId);
        
        ProductItem item = productItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Product item not found"));

        // Return quantity to inventory
        try {
            productRestClient.updateQuantity(item.getProductId(), item.getQuantity());
            log.info("Returned {} units to inventory for product: {}", item.getQuantity(), item.getProductId());
        } catch (Exception e) {
            log.error("Error returning inventory: {}", e.getMessage());
            // Continue with deletion even if inventory update fails
        }

        // Delete item
        productItemRepository.delete(item);
        log.info("Deleted product item: {}", itemId);
    }
}
