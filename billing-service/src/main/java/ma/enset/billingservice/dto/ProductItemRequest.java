package ma.enset.billingservice.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class ProductItemRequest {
    private Long billId;
    private UUID productId;
    private int quantity;
}
