package ma.enset.billingservice.web;

import lombok.AllArgsConstructor;
import ma.enset.billingservice.entities.Bill;
import ma.enset.billingservice.feign.CustomerRestClient;
import ma.enset.billingservice.feign.ProductRestClient;
import ma.enset.billingservice.repositories.BillRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class BillRestController {
    private BillRepository billRepository;
    private CustomerRestClient customerRestClient;
    private ProductRestClient productRestClient;

    @GetMapping("/bills/full/{id}")
    public Bill getBill(@PathVariable("id") Long id) {
        Bill bill = billRepository.findById(id).orElseThrow(
                () -> new RuntimeException(String.format("Bill %s not found", id))
        );
        bill.setCustomer(customerRestClient.getCustomerById(bill.getCustomerId()));
        bill.getProductItems().forEach(p -> p.setProduct(productRestClient.getProductById(p.getProductId())));
        return bill;
    }
}
