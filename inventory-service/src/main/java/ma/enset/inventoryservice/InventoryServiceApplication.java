package ma.enset.inventoryservice;

import ma.enset.inventoryservice.entities.Product;
import ma.enset.inventoryservice.repositories.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.UUID;

@SpringBootApplication
public class InventoryServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(InventoryServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner start(ProductRepository productRepository) {
        return args -> {
            productRepository.save(Product.builder()
                    .name("Computer Desk Top HP")
                    .price(7500)
                    .quantity(12)
                    .build());
            productRepository.save(Product.builder()
                    .name("Printer Epson")
                    .price(1000)
                    .quantity(30)
                    .build());
            productRepository.save(Product.builder()
                    .name("MacBook Pro Lap Top")
                    .price(1800)
                    .quantity(4)
                    .build());
            productRepository.findAll().forEach(p -> {
                System.out.println("=================");
                System.out.println(p.getId());
                System.out.println(p.getName());
                System.out.println(p.getPrice());
            });
            System.out.println("=================");
        };
    }

}
