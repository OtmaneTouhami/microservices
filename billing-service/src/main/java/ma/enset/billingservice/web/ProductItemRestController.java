package ma.enset.billingservice.web;

import lombok.RequiredArgsConstructor;
import ma.enset.billingservice.dto.ProductItemRequest;
import ma.enset.billingservice.entities.ProductItem;
import ma.enset.billingservice.service.ProductItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productItems")
@RequiredArgsConstructor
public class ProductItemRestController {

    private final ProductItemService productItemService;

    @GetMapping("/bill/{billId}")
    public List<ProductItem> getItemsByBill(@PathVariable Long billId) {
        return productItemService.getItemsByBillId(billId);
    }

    @PostMapping
    public ResponseEntity<?> addItem(@RequestBody ProductItemRequest request) {
        try {
            ProductItem item = productItemService.addItemToBill(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(item);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{itemId}/quantity")
    public ResponseEntity<?> updateQuantity(
            @PathVariable Long itemId,
            @RequestParam int quantity
    ) {
        try {
            ProductItem item = productItemService.updateItemQuantity(itemId, quantity);
            return ResponseEntity.ok(item);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<?> removeItem(@PathVariable Long itemId) {
        try {
            productItemService.removeItemFromBill(itemId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
