# 🚀 Microservices Architecture - ENSET Mohammadia

[![Java](https://img.shields.io/badge/Java-17+-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> A comprehensive repository for learning and implementing microservices architecture patterns and best practices.
> Course: Systèmes Parallèles et Distribués - ENSET Mohammadia (S3)

## 📚 Table of Contents

- [Overview](#-overview)
- [Repository Structure](#-repository-structure)
- [Microservices](#-microservices)
- [Architecture Patterns](#-architecture-patterns)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Best Practices](#-best-practices)
- [Development Guidelines](#-development-guidelines)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [Resources](#-resources)

## 🎯 Overview

This repository contains all microservices implementations and labs developed during the Microservices Architecture course at ENSET Mohammadia. Each microservice is designed following industry best practices and demonstrates different aspects of microservices architecture.

### Learning Objectives
- ✅ Understand microservices architecture principles
- ✅ Implement REST and GraphQL APIs
- ✅ Apply Domain-Driven Design (DDD) patterns
- ✅ Master inter-service communication
- ✅ Implement service discovery and API Gateway patterns
- ✅ Handle distributed data management
- ✅ Apply resilience and fault tolerance patterns
- ✅ Implement observability and monitoring

## 📁 Repository Structure

```
microservices/
├── README.md                          # This file
├── bank-account-service/              # Bank account management microservice
├── [future-service-1]/                # To be added in future labs
├── [future-service-2]/                # To be added in future labs
├── api-gateway/                       # API Gateway (upcoming)
├── service-discovery/                 # Service Registry (upcoming)
├── config-server/                     # Centralized Configuration (upcoming)
└── docs/                              # Additional documentation
```

### Service Structure Convention

Each microservice follows a standardized structure:

```
service-name/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── ma/enset/[service]/
│   │   │       ├── entities/          # Domain models (JPA entities)
│   │   │       ├── dtos/              # Data Transfer Objects
│   │   │       ├── repositories/      # Data access layer
│   │   │       ├── services/          # Business logic
│   │   │       ├── mappers/           # Entity-DTO converters
│   │   │       ├── web/               # Controllers (REST/GraphQL)
│   │   │       ├── exceptions/        # Custom exceptions & handlers
│   │   │       ├── enums/             # Enumerations
│   │   │       └── config/            # Configuration classes
│   │   └── resources/
│   │       ├── application.properties # Configuration
│   │       ├── graphql/               # GraphQL schemas (if applicable)
│   │       └── db/migration/          # Database migrations (Flyway/Liquibase)
│   └── test/                          # Unit and integration tests
├── pom.xml                            # Maven dependencies
├── Dockerfile                         # Container image definition
├── docker-compose.yml                 # Local deployment setup
└── README.md                          # Service-specific documentation
```

## 🏗️ Microservices

### 1. Bank Account Service
**Status:** ✅ Completed | **Port:** 8081

A microservice for managing bank accounts with REST and GraphQL APIs.

**Features:**
- CRUD operations for bank accounts
- Customer management
- Multiple account types (Current, Savings)
- REST API endpoints
- GraphQL API with queries and mutations
- H2 in-memory database
- OpenAPI/Swagger documentation

**Tech Stack:** Spring Boot, Spring Data JPA, Spring GraphQL, H2, Lombok

[📖 Detailed Documentation](./bank-account-service/README.md)

### 2. [Future Services]
More services will be added as the course progresses...

## 🏛️ Architecture Patterns

This repository demonstrates various microservices patterns:

### Communication Patterns
- **REST API** - Synchronous HTTP communication
- **GraphQL** - Flexible query-based API
- **Event-Driven** - Asynchronous messaging (upcoming)
- **gRPC** - High-performance RPC (upcoming)

### Data Management Patterns
- **Database per Service** - Each service owns its data
- **CQRS** - Command Query Responsibility Segregation (upcoming)
- **Event Sourcing** - Audit trail and state reconstruction (upcoming)
- **Saga Pattern** - Distributed transactions (upcoming)

### Resilience Patterns
- **Circuit Breaker** - Fault tolerance (upcoming)
- **Retry** - Automatic retry with backoff (upcoming)
- **Timeout** - Request timeout handling (upcoming)
- **Bulkhead** - Resource isolation (upcoming)

### Infrastructure Patterns
- **API Gateway** - Single entry point (upcoming)
- **Service Discovery** - Dynamic service location (upcoming)
- **Config Server** - Centralized configuration (upcoming)
- **Load Balancing** - Request distribution (upcoming)

## 💻 Technology Stack

### Core Technologies
- **Java 17** - Programming language
- **Spring Boot 3.5.6** - Application framework
- **Maven** - Build and dependency management

### Spring Ecosystem
- **Spring Data JPA** - Data persistence
- **Spring Web** - REST API development
- **Spring GraphQL** - GraphQL API development
- **Spring Data REST** - HATEOAS REST services
- **Spring Cloud** - Microservices infrastructure (upcoming)

### Databases
- **H2** - In-memory database for development
- **PostgreSQL** - Production database (upcoming)
- **MongoDB** - Document database (upcoming)

### API & Documentation
- **SpringDoc OpenAPI** - API documentation
- **GraphiQL** - GraphQL testing interface

### DevOps & Tools
- **Docker** - Containerization (upcoming)
- **Docker Compose** - Multi-container orchestration (upcoming)
- **Kubernetes** - Container orchestration (upcoming)

### Testing
- **JUnit 5** - Unit testing
- **Mockito** - Mocking framework
- **Spring Boot Test** - Integration testing
- **TestContainers** - Integration testing with containers (upcoming)

## 🚀 Getting Started

### Prerequisites

- **Java 17** or higher
- **Maven 3.8+**
- **Git**
- **IDE** (IntelliJ IDEA, Eclipse, or VS Code recommended)
- **Docker** (for containerized deployment - upcoming)

### Clone the Repository

```bash
git clone https://github.com/OtmaneTouhami/microservices.git
cd microservices
```

### Running Individual Services

Each microservice can be run independently:

```bash
cd bank-account-service
mvn spring-boot:run
```

Or using Maven wrapper:

```bash
cd bank-account-service
./mvnw spring-boot:run
```

### Building Services

```bash
# Build a specific service
cd bank-account-service
mvn clean install

# Skip tests
mvn clean install -DskipTests
```

### Accessing Services

After starting a service, you can access:

- **REST API**: `http://localhost:8081/api`
- **GraphQL**: `http://localhost:8081/graphql`
- **GraphiQL UI**: `http://localhost:8081/graphiql`
- **H2 Console**: `http://localhost:8081/h2-console`
- **OpenAPI Docs**: `http://localhost:8081/swagger-ui.html`

## 📋 Best Practices

### 1. Service Design Principles

#### Single Responsibility
Each microservice should have a single, well-defined purpose.

```java
// ✅ Good - Focused service
public interface BankAccountService {
    BankAccountResponseDTO addAccount(BankAccountRequestDTO dto);
    BankAccountResponseDTO updateAccount(String id, BankAccountRequestDTO dto);
}

// ❌ Avoid - Too many responsibilities
public interface BankService {
    void processPayment();
    void manageLoan();
    void handleInsurance();
    // Too many unrelated responsibilities
}
```

#### Loose Coupling
Services should be independent and minimize dependencies.

```java
// ✅ Good - Interface-based dependency
@Service
public class BankAccountServiceImpl implements BankAccountService {
    private final BankAccountRepository repository;
    private final AccountMapper mapper;
    // Dependencies injected via constructor
}
```

#### High Cohesion
Keep related functionality together.

```
// ✅ Good - Cohesive package structure
bankaccountservice/
├── entities/          # Domain models
├── repositories/      # Data access
├── services/          # Business logic
└── web/              # API endpoints
```

### 2. API Design

#### Use DTOs (Data Transfer Objects)
Never expose entities directly in APIs.

```java
// ✅ Good - Using DTOs
@PostMapping("/api/bankAccounts")
public BankAccountResponseDTO create(@RequestBody BankAccountRequestDTO request) {
    return service.addAccount(request);
}

// ❌ Avoid - Exposing entities
@PostMapping("/api/bankAccounts")
public BankAccount create(@RequestBody BankAccount account) {
    return repository.save(account);
}
```

#### RESTful Conventions
Follow REST principles for resource naming.

```
✅ Good:
GET    /api/bankAccounts           # List all accounts
GET    /api/bankAccounts/{id}      # Get specific account
POST   /api/bankAccounts           # Create account
PUT    /api/bankAccounts/{id}      # Update account
DELETE /api/bankAccounts/{id}      # Delete account

❌ Avoid:
GET  /api/getAllAccounts
POST /api/createAccount
POST /api/updateAccount
```

#### Versioning
Always version your APIs.

```java
@RestController
@RequestMapping("/api/v1/bankAccounts")
public class BankAccountRestController {
    // v1 implementation
}
```

### 3. Data Management

#### Database per Service
Each microservice owns its database.

```yaml
# ✅ Good - Separate databases
bank-account-service:
  datasource.url: jdbc:h2:mem:accounts-db

customer-service:
  datasource.url: jdbc:h2:mem:customers-db
```

#### Use Projections
Limit data exposure with projections.

```java
public interface AccountProjection {
    String getId();
    Double getBalance();
    String getCurrency();
}
```

### 4. Error Handling

#### Centralized Exception Handling

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(ex.getMessage()));
    }
}
```

#### GraphQL Error Handling

```java
@Component
public class GraphQLExceptionHandler extends DataFetcherExceptionResolverAdapter {
    @Override
    protected GraphQLError resolveToSingleError(Throwable ex, DataFetchingEnvironment env) {
        return GraphQLError.newError()
            .message(ex.getMessage())
            .build();
    }
}
```

### 5. Configuration Management

#### Externalize Configuration
Use `application.properties` or `application.yml`.

```properties
# Application
spring.application.name=bank-account-service
server.port=8081

# Database
spring.datasource.url=jdbc:h2:mem:accounts-db

# Features
spring.graphql.graphiql.enabled=true
```

#### Profile-Specific Configuration

```properties
# application-dev.properties
spring.jpa.show-sql=true
spring.h2.console.enabled=true

# application-prod.properties
spring.jpa.show-sql=false
spring.h2.console.enabled=false
```

### 6. Code Quality

#### Use Lombok for Boilerplate Reduction

```java
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankAccount {
    @Id
    private String id;
    private Double balance;
    // Getters, setters, constructors auto-generated
}
```

#### Dependency Injection Best Practices

```java
// ✅ Good - Constructor injection (immutable)
@Service
public class BankAccountServiceImpl implements BankAccountService {
    private final BankAccountRepository repository;
    private final AccountMapper mapper;
    
    public BankAccountServiceImpl(BankAccountRepository repository, 
                                   AccountMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }
}

// ❌ Avoid - Field injection (harder to test)
@Service
public class BankAccountServiceImpl {
    @Autowired
    private BankAccountRepository repository;
}
```

### 7. Testing

#### Write Tests at Multiple Levels

```java
// Unit Test
@Test
void shouldAddAccount() {
    // Arrange
    BankAccountRequestDTO request = new BankAccountRequestDTO();
    when(repository.save(any())).thenReturn(account);
    
    // Act
    BankAccountResponseDTO response = service.addAccount(request);
    
    // Assert
    assertNotNull(response);
}

// Integration Test
@SpringBootTest
@AutoConfigureMockMvc
class BankAccountRestControllerIntegrationTest {
    @Test
    void shouldCreateAccount() throws Exception {
        mockMvc.perform(post("/api/bankAccounts")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk());
    }
}
```

### 8. Documentation

#### Code Documentation

```java
/**
 * Service for managing bank accounts.
 * Provides operations for creating, updating, and retrieving accounts.
 *
 * @author Otmane Touhami
 * @version 1.0
 * @since 2025-10-12
 */
@Service
public class BankAccountServiceImpl implements BankAccountService {
    
    /**
     * Creates a new bank account.
     *
     * @param dto the account creation request
     * @return the created account details
     * @throws IllegalArgumentException if the request is invalid
     */
    public BankAccountResponseDTO addAccount(BankAccountRequestDTO dto) {
        // Implementation
    }
}
```

#### API Documentation with OpenAPI

```java
@RestController
@RequestMapping("/api/v1/bankAccounts")
@Tag(name = "Bank Accounts", description = "Bank account management APIs")
public class BankAccountRestController {
    
    @Operation(summary = "Get all bank accounts")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved list"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    public List<BankAccount> getAllAccounts() {
        return repository.findAll();
    }
}
```

## 🛠️ Development Guidelines

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/service-name

# Commit with meaningful messages
git commit -m "feat(bank-account): add GraphQL mutation for account update"

# Push to remote
git push origin feature/service-name
```

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(service): add new feature
fix(service): bug fix
docs(service): documentation update
refactor(service): code refactoring
test(service): add tests
chore(service): maintenance tasks
```

### Branch Naming

```
feature/service-name       # New features
bugfix/issue-description   # Bug fixes
hotfix/critical-issue      # Critical fixes
docs/documentation-update  # Documentation
refactor/code-improvement  # Refactoring
```

## 📖 API Documentation

### REST API Examples

#### Get All Bank Accounts
```bash
curl -X GET http://localhost:8081/api/bankAccounts
```

#### Create Bank Account
```bash
curl -X POST http://localhost:8081/api/bankAccounts \
  -H "Content-Type: application/json" \
  -d '{
    "balance": 5000.0,
    "currency": "EUR",
    "type": "CURRENT_ACCOUNT"
  }'
```

#### Update Bank Account
```bash
curl -X PUT http://localhost:8081/api/bankAccounts/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "balance": 7500.0,
    "currency": "USD"
  }'
```

### GraphQL Examples

#### Query All Accounts
```graphql
query {
  accountList {
    id
    balance
    currency
    type
    createdAt
    customer {
      name
    }
  }
}
```

#### Create Account Mutation
```graphql
mutation {
  addAccount(bankAccount: {
    balance: 5000.0
    currency: "EUR"
    type: "SAVING_ACCOUNT"
  }) {
    id
    balance
    currency
    type
  }
}
```

#### Update Account Mutation
```graphql
mutation {
  updateAccount(
    id: "account-id-here"
    bankAccount: {
      balance: 7500.0
      currency: "USD"
    }
  ) {
    id
    balance
    currency
  }
}
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
mvn test

# Run tests with coverage
mvn test jacoco:report

# Run specific test class
mvn test -Dtest=BankAccountServiceTest

# Run integration tests
mvn verify
```

### Test Coverage Goals
- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical paths covered
- **E2E Tests**: Happy paths and error scenarios

## 🤝 Contributing

We welcome contributions from students and collaborators!

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Review Checklist

- [ ] Code follows project structure conventions
- [ ] All tests pass
- [ ] New features have tests
- [ ] Documentation is updated
- [ ] Commit messages follow convention
- [ ] No sensitive data committed

## 📚 Resources

### Official Documentation
- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Data JPA](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [Spring GraphQL](https://docs.spring.io/spring-graphql/docs/current/reference/html/)
- [Spring Cloud](https://spring.io/projects/spring-cloud)

### Microservices Patterns
- [Microservices.io](https://microservices.io/)
- [Martin Fowler - Microservices](https://martinfowler.com/articles/microservices.html)
- [12 Factor App](https://12factor.net/)

### Books
- "Building Microservices" by Sam Newman
- "Microservices Patterns" by Chris Richardson
- "Domain-Driven Design" by Eric Evans

### Online Courses
- [Spring Academy](https://spring.academy/)
- [Baeldung Microservices Guides](https://www.baeldung.com/spring-microservices-guide)

## 📧 Contact

**Course Instructor**: ENSET Mohammadia  
**Repository Maintainer**: Otmane Touhami  
**GitHub**: [@OtmaneTouhami](https://github.com/OtmaneTouhami)

## 📝 License

This project is created for educational purposes as part of the Microservices course at ENSET Mohammadia.

---

<p align="center">
  <strong>🎓 Built with ❤️ by ENSET Mohammadia Student Otmane TOUHAMI</strong>
</p>

<p align="center">
  <sub>Last Updated: October 2025</sub>
</p>
