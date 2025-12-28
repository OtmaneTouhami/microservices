package ma.enset.inventoryservice.web;

import lombok.RequiredArgsConstructor;
import ma.enset.inventoryservice.entities.Product;
import ma.enset.inventoryservice.repositories.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/inventory")
@RequiredArgsConstructor
public class ProductRestController {

    private final ProductRepository productRepository;

    @PostMapping("/products/{id}/update-quantity")
    public ResponseEntity<Product> updateQuantity(
            @PathVariable UUID id,
            @RequestParam int delta
    ) {
        return productRepository.findById(id)
                .map(product -> {
                    int newQuantity = product.getQuantity() + delta;
                    if (newQuantity < 0) {
                        return ResponseEntity.badRequest().<Product>build();
                    }
                    product.setQuantity(newQuantity);
                    return ResponseEntity.ok(productRepository.save(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/products/{id}/check-availability")
    public ResponseEntity<Boolean> checkAvailability(
            @PathVariable UUID id,
            @RequestParam int quantity
    ) {
        return productRepository.findById(id)
                .map(product -> ResponseEntity.ok(product.getQuantity() >= quantity))
                .orElse(ResponseEntity.notFound().build());
    }
}
