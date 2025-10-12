# Bank Account Service — Lab Report

## Introduction
In this lab I implemented a Spring Boot microservice for managing bank accounts with both REST and GraphQL APIs. My main objectives were to model the domain with JPA entities, expose CRUD operations through REST endpoints, add a GraphQL schema with queries and mutations, and use DTO mapping to keep the API contracts clean. I also configured an in‑memory H2 database, initialized sample data at startup, and enabled GraphiQL to explore the GraphQL API quickly.

## Table of Contents
- [Introduction](#introduction)
- [How to Run](#how-to-run)
- [Architecture Overview](#architecture-overview)
- [Application Entry Point and Data Seeding](#application-entry-point-and-data-seeding)
- [Domain Model: Entities](#domain-model-entities)
- [Repositories](#repositories)
- [DTOs and Mapping](#dtos-and-mapping)
- [Service Layer](#service-layer)
- [REST API](#rest-api)
- [GraphQL API](#graphql-api)
- [GraphQL Error Handling](#graphql-error-handling)
- [Configuration](#configuration)
- [Conclusion](#conclusion)

## How to Run
To run the service I used Java 17 and Maven. I launched it with mvn spring-boot:run and then accessed REST endpoints under http://localhost:8081/api and opened GraphiQL at http://localhost:8081/graphiql to try queries and mutations. The H2 console was available at http://localhost:8081/h2-console using the configured JDBC URL.

## Architecture Overview
I organized the code into packages for entities, repositories, services, mappers, and web controllers. The service exposes the same core operations via REST and GraphQL so I can compare the two styles. I used a simple AccountMapper to convert between JPA entities and DTOs and I kept the business logic in the service layer while controllers focused on I/O.

## Application Entry Point and Data Seeding
```java
// src/main/java/ma/enset/bankaccountservice/BankAccountServiceApplication.java
@SpringBootApplication
public class BankAccountServiceApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(BankAccountServiceApplication.class, args);
    }
    
    @Bean
    CommandLineRunner start(BankAccountRepository bankAccountRepository, 
                          CustomerRepository customerRepository) {
        return args -> {
            Stream.of("Hassan", "Imane", "Mohamed").forEach(name -> {
                Customer customer = Customer.builder()
                    .name(name)
                    .build();
                customerRepository.save(customer);
            });
            
            customerRepository.findAll().forEach(customer -> {
                for (int i = 0; i < 10; i++) {
                    BankAccount bankAccount = BankAccount.builder()
                        .id(UUID.randomUUID().toString())
                        .type(Math.random() > 0.5 ? AccountType.CURRENT_ACCOUNT : AccountType.SAVING_ACCOUNT)
                        .balance(1000 + Math.random() * 90000)
                        .createdAt(new Date())
                        .currency("EUR")
                        .customer(customer)
                        .build();
                    bankAccountRepository.save(bankAccount);
                }
            });
        };
    }
}
```
I used a CommandLineRunner bean to seed example customers and random accounts at startup. This helped me have data to test both REST and GraphQL immediately without manual inserts.

## Domain Model: Entities
```java
// src/main/java/ma/enset/bankaccountservice/entities/Customer.java
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @OneToMany(mappedBy = "customer")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private List<BankAccount> bankAccounts;
}

// src/main/java/ma/enset/bankaccountservice/entities/BankAccount.java
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankAccount {
    @Id
    private String id;
    private Date createdAt;
    private Double balance;
    private String currency;
    @Enumerated(EnumType.STRING)
    private AccountType type;
    @ManyToOne
    private Customer customer;
}
```
I modeled a one‑to‑many relationship where a customer owns multiple bank accounts. I stored the account type as an enum string for readability and hid the accounts list during JSON serialization on reads to avoid cyclic serialization issues.

## Repositories
```java
// src/main/java/ma/enset/bankaccountservice/repositories/BankAccountRepository.java
@RepositoryRestResource
public interface BankAccountRepository extends JpaRepository<BankAccount, String> {
    
    @RestResource(path = "/byCurrency")
    List<BankAccount> findByCurrency(@Param("c") String currency);
}
```
I extended JpaRepository to get CRUD for free and demonstrated a derived query with a custom Spring Data REST path for filtering by currency which can be useful for quick explorations.

## DTOs and Mapping
```java
// src/main/java/ma/enset/bankaccountservice/dtos/BankAccountRequestDTO.java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankAccountRequestDTO {
    private Double balance;
    private String currency;
    private AccountType type;
}

// src/main/java/ma/enset/bankaccountservice/dtos/BankAccountResponseDTO.java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankAccountResponseDTO {
    private String id;
    private Date createdAt;
    private Double balance;
    private String currency;
    private AccountType type;
}

// src/main/java/ma/enset/bankaccountservice/mappers/AccountMapper.java
@Component
public class AccountMapper {
    
    public BankAccountResponseDTO fromBankAccount(BankAccount bankAccount) {
        BankAccountResponseDTO dto = new BankAccountResponseDTO();
        BeanUtils.copyProperties(bankAccount, dto);
        return dto;
    }
}
```
I created separate request and response DTOs to decouple the API from the JPA entity and used Spring BeanUtils in a small mapper to copy properties which kept the service layer concise.

## Service Layer
```java
// src/main/java/ma/enset/bankaccountservice/services/BankAccountService.java
public interface BankAccountService {
    BankAccountResponseDTO addAccount(BankAccountRequestDTO bankAccountDTO);
    BankAccountResponseDTO updateAccount(String id, BankAccountRequestDTO bankAccountDTO);
}

// src/main/java/ma/enset/bankaccountservice/services/impl/BankAccountServiceImpl.java
@Service
@Transactional
public class BankAccountServiceImpl implements BankAccountService {
    
    private final BankAccountRepository bankAccountRepository;
    private final AccountMapper accountMapper;
    
    public BankAccountServiceImpl(BankAccountRepository repo, AccountMapper mapper) {
        this.bankAccountRepository = repo;
        this.accountMapper = mapper;
    }
    
    public BankAccountResponseDTO addAccount(BankAccountRequestDTO dto) {
        BankAccount bankAccount = BankAccount.builder()
            .id(UUID.randomUUID().toString())
            .createdAt(new Date())
            .balance(dto.getBalance())
            .type(dto.getType())
            .currency(dto.getCurrency())
            .build();
        return accountMapper.fromBankAccount(bankAccountRepository.save(bankAccount));
    }
    
    public BankAccountResponseDTO updateAccount(String id, BankAccountRequestDTO dto) {
        BankAccount bankAccount = bankAccountRepository.findById(id)
            .orElseThrow(() -> new RuntimeException(String.format("Account %s not found", id)));
        if (dto.getBalance() != null) bankAccount.setBalance(dto.getBalance());
        if (dto.getType() != null) bankAccount.setType(dto.getType());
        if (dto.getCurrency() != null) bankAccount.setCurrency(dto.getCurrency());
        return accountMapper.fromBankAccount(bankAccountRepository.save(bankAccount));
    }
}
```
I kept the business logic here by generating a new account with a UUID and current date and by performing partial updates only for fields provided which makes the update operation flexible for clients.

## REST API
```java
// src/main/java/ma/enset/bankaccountservice/web/BankAccountRestController.java
@RestController
@RequestMapping("/api")
public class BankAccountRestController {
    
    private final BankAccountRepository bankAccountRepository;
    private final BankAccountService bankAccountService;
    
    @GetMapping("/bankAccounts")
    public List<BankAccount> bankAccounts() {
        return bankAccountRepository.findAll();
    }
    
    @GetMapping("/bankAccounts/{id}")
    public BankAccount bankAccount(@PathVariable String id) {
        return bankAccountRepository.findById(id)
            .orElseThrow(() -> new RuntimeException(String.format("Account %s not found", id)));
    }
    
    @PostMapping("/bankAccounts")
    public BankAccountResponseDTO save(@RequestBody BankAccountRequestDTO requestDTO) {
        return bankAccountService.addAccount(requestDTO);
    }
    
    @PutMapping("/bankAccounts/{id}")
    public BankAccount update(@PathVariable String id, @RequestBody BankAccount bankAccount) {
        BankAccount account = bankAccountRepository.findById(id).orElseThrow();
        if (bankAccount.getBalance() != null) account.setBalance(bankAccount.getBalance());
        if (bankAccount.getCreatedAt() != null) account.setCreatedAt(new Date());
        if (bankAccount.getType() != null) account.setType(bankAccount.getType());
        if (bankAccount.getCurrency() != null) account.setCurrency(bankAccount.getCurrency());
        return bankAccountRepository.save(account);
    }
    
    @DeleteMapping("/bankAccounts/{id}")
    public void deleteAccount(@PathVariable String id) {
        bankAccountRepository.deleteById(id);
    }
}
```
I exposed standard CRUD operations, returning entities for reads and a DTO for the create path. This controller makes it simple to test with curl or Postman and it demonstrates both direct repository usage and service delegation where it makes sense.

## GraphQL API
```graphql
# src/main/resources/graphql/schema.graphqls
type Query {
    accountList: [BankAccount]
    bankAccountById(id: String!): BankAccount
    customers: [Customer]
}

type Mutation {
    addAccount(bankAccount: BankAccountRequestDTO!): BankAccountResponseDTO
    updateAccount(id: String!, bankAccount: BankAccountRequestDTO!): BankAccountResponseDTO
    deleteAccount(id: String!): Boolean
}

input BankAccountRequestDTO {
    balance: Float
    currency: String
    type: String
}
```
```java
// src/main/java/ma/enset/bankaccountservice/web/BankAccountGraphQLController.java
@Controller
public class BankAccountGraphQLController {
    
    private final BankAccountRepository bankAccountRepository;
    private final BankAccountService bankAccountService;
    private final CustomerRepository customerRepository;
    
    @QueryMapping
    public List<BankAccount> accountList() {
        return bankAccountRepository.findAll();
    }
    
    @QueryMapping
    public BankAccount bankAccountById(@Argument String id) {
        return bankAccountRepository.findById(id)
            .orElseThrow(() -> new RuntimeException(String.format("Account %s not found", id)));
    }
    
    @QueryMapping
    public List<Customer> customers() {
        return customerRepository.findAll();
    }
    
    @MutationMapping
    public BankAccountResponseDTO addAccount(@Argument BankAccountRequestDTO bankAccount) {
        return bankAccountService.addAccount(bankAccount);
    }
    
    @MutationMapping
    public BankAccountResponseDTO updateAccount(@Argument String id, 
                                                 @Argument BankAccountRequestDTO bankAccount) {
        return bankAccountService.updateAccount(id, bankAccount);
    }
    
    @MutationMapping
    public Boolean deleteAccount(@Argument String id) {
        bankAccountRepository.deleteById(id);
        return true;
    }
}
```
I defined a small schema with queries to list accounts and fetch by id plus mutations to add, update, and delete accounts. The controller uses Spring GraphQL annotations to map methods to schema fields and delegates creation and updates to the service to keep behavior consistent between REST and GraphQL.

## GraphQL Error Handling
```java
// src/main/java/ma/enset/bankaccountservice/exceptions/GraphQLExceptionHandler.java
@Component
public class GraphQLExceptionHandler extends DataFetcherExceptionResolverAdapter {
    
    @Override
    protected GraphQLError resolveToSingleError(Throwable ex, DataFetchingEnvironment env) {
        return new GraphQLError() {
            @Override
            public String getMessage() {
                return ex.getMessage();
            }
            
            @Override
            public List<SourceLocation> getLocations() {
                return null;
            }
            
            @Override
            public ErrorClassification getErrorType() {
                return null;
            }
        };
    }
}
```
I added a simple resolver to transform exceptions thrown inside data fetchers into GraphQL errors so that clients see clean messages when entities are not found or validation fails during queries or mutations.

## Configuration
```properties
# src/main/resources/application.properties
server.port=8081
spring.datasource.url=jdbc:h2:mem:accounts-db
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.graphql.graphiql.enabled=true
```
I configured the service to run on port 8081 with an in‑memory H2 database and enabled the H2 console for easy inspection. I also enabled GraphiQL so I could test GraphQL operations from the browser without external tools.

## Conclusion
This lab helped me practice building a clean layered Spring Boot microservice that exposes the same core features through REST and GraphQL. I modeled the domain with JPA, initialized the database with sample data, and used DTOs with a mapper to keep the API boundaries clear. With the configuration in place I could iterate fast and verify the endpoints using both Postman and GraphiQL, and the simple exception handler improved the developer experience when errors occurred.