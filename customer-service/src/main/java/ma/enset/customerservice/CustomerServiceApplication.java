package ma.enset.customerservice;

import ma.enset.customerservice.config.CustomerConfigParams;
import ma.enset.customerservice.entities.Customer;
import ma.enset.customerservice.repositories.CustomerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableConfigurationProperties(CustomerConfigParams.class)
public class CustomerServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CustomerServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner commandLineRunner(CustomerRepository customerRepository) {
        return args -> {
            customerRepository.save(Customer.builder()
                    .name("Hassan")
                    .email("hassan@gmail.com")
                    .build()
            );
            customerRepository.save(Customer.builder()
                    .name("Fadwa")
                    .email("fadwa@gmail.com")
                    .build()
            );
            customerRepository.save(Customer.builder()
                    .name("Marwan")
                    .email("marwan@gmail.com")
                    .build()
            );
            customerRepository.findAll().forEach(c -> {
                System.out.println("======================");
                System.out.println(c.getId());
                System.out.println(c.getName());
                System.out.println(c.getEmail());
            });
            System.out.println("======================");
        };
    }

}
