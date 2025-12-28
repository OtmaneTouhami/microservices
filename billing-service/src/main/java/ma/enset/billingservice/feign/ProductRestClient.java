package ma.enset.billingservice.feign;

import ma.enset.billingservice.entities.models.Product;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.hateoas.PagedModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;


@FeignClient(name = "inventory-service")
public interface ProductRestClient {
    @GetMapping("/api/products/{id}")
    Product getProductById(@PathVariable("id") UUID id);

    @GetMapping("/api/products")
    PagedModel<Product> getProducts();

    @PostMapping("/inventory/products/{id}/update-quantity")
    Product updateQuantity(@PathVariable("id") UUID id, @RequestParam("delta") int delta);

    @GetMapping("/inventory/products/{id}/check-availability")
    Boolean checkAvailability(@PathVariable("id") UUID id, @RequestParam("quantity") int quantity);
}
