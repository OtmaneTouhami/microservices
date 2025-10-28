# 🚀 Microservices Architecture - ENSET Mohammadia

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2025.0.0-blue.svg)](https://spring.io/projects/spring-cloud)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> A comprehensive microservices architecture project implementing industry-standard patterns and best practices.
> Course: Systèmes Parallèles et Distribués - ENSET Mohammadia

## 📚 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Microservices](#-microservices)
- [Infrastructure Services](#-infrastructure-services)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Architecture Patterns](#-architecture-patterns)
- [Configuration Management](#-configuration-management)
- [API Documentation](#-api-documentation)
- [Best Practices](#-best-practices)
- [Resources](#-resources)

## 🎯 Overview

This repository contains a complete microservices ecosystem built with Spring Boot and Spring Cloud. The project demonstrates enterprise-grade microservices architecture with service discovery, centralized configuration, API gateway, and inter-service communication using REST APIs and OpenFeign.

### Learning Objectives
- ✅ Understand microservices architecture principles
- ✅ Implement service discovery with Eureka
- ✅ Centralized configuration management with Config Server
- ✅ API Gateway pattern with Spring Cloud Gateway
- ✅ Inter-service communication with OpenFeign
- ✅ Database per service pattern
- ✅ REST API development with Spring Data REST
- ✅ HATEOAS implementation
- ✅ Monitoring and health checks with Actuator

## 🏗️ Architecture

The project follows a microservices architecture pattern with the following components:

```
┌─────────────┐
│   Clients   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│   Gateway Service (Port 8888)   │ ◄── API Gateway Pattern
└────────┬────────────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌──────────────────────────────────────────────────┐
│    Discovery Service - Eureka (Port 8761)        │ ◄── Service Registry
└──────────────────────────────────────────────────┘
         ▲         ▲         ▲         ▲
         │         │         │         │
    ┌────┴───┬─────┴────┬────┴────┬────┴─────┐
    │        │          │         │          │
┌───┴───┐ ┌──┴──┐ ┌─────┴────┐ ┌──┴──────┐ ┌┴────────┐
│Customer│ │Inven│ │ Billing  │ │ Config  │ │  Config │
│Service │ │tory │ │ Service  │ │ Service │ │  Repo   │
│  8082  │ │8083 │ │   8084   │ │  9999   │ │ (GitHub)│
└────────┘ └─────┘ └──────────┘ └─────────┘ └─────────┘
     │        │          │
     ▼        ▼          ▼
  [H2 DB]  [H2 DB]   [H2 DB]      ◄── Database per Service
```

## 📁 Repository Structure

```
microservices/
├── README.md                          # This file
├── pom.xml                            # Parent POM
├── config-repo/                       # Configuration repository
│   ├── application.properties         # Global configuration
│   ├── customer-service.properties    # Customer service config
│   ├── inventory-service.properties   # Inventory service config
│   ├── billing-service.properties     # Billing service config
│   ├── gateway-service.properties     # Gateway service config
│   ├── *-dev.properties              # Dev environment configs
│   └── *-prod.properties             # Prod environment configs
├── discovery-service/                 # Eureka Server (Port 8761)
├── config-service/                    # Config Server (Port 9999)
├── gateway-service/                   # API Gateway (Port 8888)
├── customer-service/                  # Customer microservice (Port 8082)
├── inventory-service/                 # Product inventory (Port 8083)
└── billing-service/                   # Billing & invoicing (Port 8084)
```

## 🔧 Infrastructure Services

### 1. Discovery Service (Eureka Server)
**Port:** 8761 | **Status:** ✅ Running

Netflix Eureka service registry for dynamic service discovery.

**Features:**
- Service registration and discovery
- Health monitoring
- Load balancing support
- Self-preservation mode
- Dashboard UI

**Key Dependencies:**
- `spring-cloud-starter-netflix-eureka-server`

**Configuration:**
```properties
spring.application.name=discovery-service
server.port=8761
eureka.client.fetch-registry=false
eureka.client.register-with-eureka=false
```

**Access:** http://localhost:8761

---

### 2. Config Service (Spring Cloud Config Server)
**Port:** 9999 | **Status:** ✅ Running

Centralized configuration management server.

**Features:**
- Externalized configuration
- Environment-specific configs (dev, prod)
- Git-based configuration repository
- Dynamic configuration refresh
- Encryption/Decryption support

**Key Dependencies:**
- `spring-cloud-config-server`
- `spring-cloud-starter-netflix-eureka-client`

**Configuration:**
```properties
spring.application.name=config-service
server.port=9999
spring.cloud.config.server.git.uri=https://github.com/OtmaneTouhami/microservices-config-repo
```

**Config Repository:** https://github.com/OtmaneTouhami/microservices-config-repo

---

### 3. Gateway Service (Spring Cloud Gateway)
**Port:** 8888 | **Status:** ✅ Running

API Gateway for routing and cross-cutting concerns.

**Features:**
- Request routing
- Load balancing
- Circuit breaker integration (future)
- Rate limiting (future)
- Authentication/Authorization (future)
- Request/Response transformation

**Key Dependencies:**
- `spring-cloud-starter-gateway-server-webflux`
- `spring-cloud-starter-netflix-eureka-client`
- `spring-cloud-starter-config`

**Configuration:**
```properties
spring.application.name=gateway-service
server.port=8888
spring.config.import=optional:configserver:http://localhost:9999
```

---

## 📦 Microservices

### 1. Customer Service
**Port:** 8082 | **Status:** ✅ Running

Manages customer information and profiles.

**Features:**
- CRUD operations for customers
- REST API with Spring Data REST
- HATEOAS support
- H2 in-memory database
- Data projections
- Actuator endpoints

**Key Dependencies:**
- `spring-boot-starter-data-jpa`
- `spring-boot-starter-data-rest`
- `spring-boot-starter-web`
- `spring-cloud-starter-eureka-client`
- `spring-cloud-starter-config`

**Domain Model:**
```java
@Entity
public class Customer {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
}
```

**Endpoints:**
- `GET /customers` - List all customers
- `GET /customers/{id}` - Get customer by ID
- `POST /customers` - Create customer
- `PUT /customers/{id}` - Update customer
- `DELETE /customers/{id}` - Delete customer

---

### 2. Inventory Service
**Port:** 8083 | **Status:** ✅ Running

Manages product inventory and stock.

**Features:**
- Product catalog management
- Stock quantity tracking
- REST API with Spring Data REST
- UUID-based product IDs
- H2 in-memory database
- Actuator endpoints

**Key Dependencies:**
- `spring-boot-starter-data-jpa`
- `spring-boot-starter-data-rest`
- `spring-boot-starter-web`
- `spring-cloud-starter-eureka-client`
- `spring-cloud-starter-config`

**Domain Model:**
```java
@Entity
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String name;
    private double price;
    private int quantity;
}
```

**Endpoints:**
- `GET /products` - List all products
- `GET /products/{id}` - Get product by ID
- `POST /products` - Create product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

---

### 3. Billing Service
**Port:** 8084 | **Status:** ✅ Running

Manages bills and invoices with inter-service communication.

**Features:**
- Bill generation and management
- Product items per bill
- Integration with Customer Service (via OpenFeign)
- Integration with Inventory Service (via OpenFeign)
- HATEOAS support
- H2 in-memory database
- Actuator endpoints

**Key Dependencies:**
- `spring-boot-starter-data-jpa`
- `spring-boot-starter-data-rest`
- `spring-boot-starter-hateoas`
- `spring-cloud-starter-openfeign`
- `spring-cloud-starter-eureka-client`
- `spring-cloud-starter-config`

**Domain Model:**
```java
@Entity
public class Bill {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date billingDate;
    private Long customerId;
    @OneToMany(mappedBy = "bill")
    private List<ProductItem> productItems;
    @Transient
    private Customer customer;
}

@Entity
public class ProductItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private UUID productId;
    private int quantity;
    private double price;
    @ManyToOne
    private Bill bill;
    @Transient
    private Product product;
}
```

**Feign Clients:**
```java
@FeignClient(name = "customer-service")
public interface CustomerRestClient {
    @GetMapping("/customers/{id}")
    Customer findCustomerById(@PathVariable Long id);
}

@FeignClient(name = "inventory-service")
public interface ProductRestClient {
    @GetMapping("/products/{id}")
    Product findProductById(@PathVariable UUID id);
}
```

**Endpoints:**
- `GET /bills` - List all bills
- `GET /bills/{id}` - Get bill by ID with customer and product details
- `POST /bills` - Create bill
- `PUT /bills/{id}` - Update bill
- `DELETE /bills/{id}` - Delete bill

---

## 💻 Technology Stack

### Core Technologies
- **Java 21** - Programming language
- **Spring Boot 3.5.6** - Application framework
- **Spring Cloud 2025.0.0** - Microservices infrastructure
- **Maven** - Build and dependency management

### Spring Cloud Components
- **Eureka Server/Client** - Service discovery
- **Spring Cloud Config** - Centralized configuration
- **Spring Cloud Gateway** - API Gateway (WebFlux)
- **OpenFeign** - Declarative REST clients

### Spring Boot Starters
- **Spring Data JPA** - Data persistence
- **Spring Data REST** - REST repository exposition
- **Spring HATEOAS** - Hypermedia-driven APIs
- **Spring Boot Actuator** - Monitoring and management
- **Spring Boot DevTools** - Development utilities

### Databases
- **H2** - In-memory database for all services

### Development Tools
- **Lombok** - Boilerplate code reduction
- **Spring Boot DevTools** - Hot reload

---

## 🚀 Getting Started

### Prerequisites

- **Java 21** or higher
- **Maven 3.8+**
- **Git**
- **IDE** (IntelliJ IDEA, Eclipse, or VS Code recommended)

### Clone the Repository

```bash
git clone https://github.com/OtmaneTouhami/microservices.git
cd microservices
```

### Running the Services

The services must be started in the following order:

#### 1. Start Discovery Service (Eureka)
```bash
cd discovery-service
mvn spring-boot:run
```
Wait until Eureka is fully started (http://localhost:8761)

#### 2. Start Config Service
```bash
cd config-service
mvn spring-boot:run
```
Verify at http://localhost:9999/actuator/health

#### 3. Start Business Services

In separate terminals:

```bash
# Customer Service
cd customer-service
mvn spring-boot:run

# Inventory Service
cd inventory-service
mvn spring-boot:run

# Billing Service
cd billing-service
mvn spring-boot:run
```

#### 4. Start Gateway Service
```bash
cd gateway-service
mvn spring-boot:run
```

### Verify Services

1. **Eureka Dashboard:** http://localhost:8761
   - All services should be registered

2. **Actuator Health Checks:**
   - Customer: http://localhost:8082/actuator/health
   - Inventory: http://localhost:8083/actuator/health
   - Billing: http://localhost:8084/actuator/health
   - Gateway: http://localhost:8888/actuator/health

### Building Services

```bash
# Build all services from root
mvn clean install

# Build specific service
cd customer-service
mvn clean package

# Skip tests
mvn clean install -DskipTests
```

---

## 🏛️ Architecture Patterns

### 1. Service Discovery Pattern
**Implementation:** Netflix Eureka

All microservices register themselves with Eureka Server, enabling:
- Dynamic service discovery
- Load balancing
- Health monitoring
- Fault tolerance

### 2. API Gateway Pattern
**Implementation:** Spring Cloud Gateway

Single entry point for all client requests:
- Request routing
- Load balancing across service instances
- Cross-cutting concerns (auth, logging, rate limiting)
- Protocol translation

### 3. Externalized Configuration
**Implementation:** Spring Cloud Config

Centralized configuration management:
- Environment-specific configurations (dev, prod)
- Git-based version control
- Dynamic refresh without restart
- Encrypted sensitive data

### 4. Database per Service
**Implementation:** H2 per service

Each microservice has its own database:
- Data isolation
- Independent scaling
- Technology diversity
- Loose coupling

### 5. Inter-Service Communication
**Implementation:** OpenFeign + REST

Declarative REST clients for synchronous communication:
- Load balancing via Ribbon
- Service discovery integration
- Circuit breaker ready (Resilience4j future)

### 6. HATEOAS
**Implementation:** Spring HATEOAS

Hypermedia-driven APIs:
- Self-documenting APIs
- Discoverability
- Loose coupling between client and server

---

## ⚙️ Configuration Management

### Local Configuration Files

Each service has its `application.properties`:

**Customer Service:**
```properties
spring.application.name=customer-service
server.port=8082
spring.config.import=optional:configserver:http://localhost:9999
```

### Centralized Configuration (config-repo/)

**application.properties** (Global):
```properties
eureka.client.service-url.defaultZone=http://localhost:8761/eureka
eureka.instance.prefer-ip-address=true
management.endpoints.web.exposure.include=*
spring.cloud.discovery.enabled=true
global.params.p1=12
global.params.p2=14
```

**Service-specific configs:**
- `customer-service.properties`
- `customer-service-dev.properties`
- `customer-service-prod.properties`
- `inventory-service.properties`
- `billing-service.properties`
- `gateway-service.properties`

### Configuration Refresh

Refresh configuration without restart:
```bash
POST http://localhost:8082/actuator/refresh
```

---

## 📖 API Documentation

### Customer Service (Port 8082)

#### Get All Customers
```bash
curl http://localhost:8082/customers
```

#### Create Customer
```bash
curl -X POST http://localhost:8082/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com"
  }'
```

#### Get Customer by ID
```bash
curl http://localhost:8082/customers/1
```

---

### Inventory Service (Port 8083)

#### Get All Products
```bash
curl http://localhost:8083/products
```

#### Create Product
```bash
curl -X POST http://localhost:8083/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 999.99,
    "quantity": 50
  }'
```

---

### Billing Service (Port 8084)

#### Get All Bills
```bash
curl http://localhost:8084/bills
```

#### Get Bill with Customer & Product Details
```bash
curl http://localhost:8084/bills/1
```
*Returns bill with embedded customer and product information via Feign clients*

---

### Via Gateway (Port 8888)

All services can be accessed through the gateway:

```bash
# Customer Service
curl http://localhost:8888/customer-service/customers

# Inventory Service
curl http://localhost:8888/inventory-service/products

# Billing Service
curl http://localhost:8888/billing-service/bills
```

---

## 📋 Best Practices Implemented

### 1. Service Independence
✅ Each service has its own database
✅ Services can be deployed independently
✅ No direct database coupling

### 2. Externalized Configuration
✅ Configuration in Config Server
✅ Environment-specific configs
✅ No hardcoded values

### 3. Service Discovery
✅ Dynamic service registration
✅ No hardcoded URLs
✅ Automatic load balancing

### 4. API Design
✅ RESTful conventions
✅ HATEOAS for discoverability
✅ Proper HTTP methods and status codes
✅ Data projections

### 5. Inter-Service Communication
✅ OpenFeign for declarative clients
✅ Service discovery integration
✅ Loose coupling

### 6. Monitoring & Observability
✅ Actuator endpoints enabled
✅ Health checks
✅ Metrics exposure
✅ Eureka dashboard

### 7. Code Quality
✅ Lombok for cleaner code
✅ JPA entities with proper relationships
✅ Transient fields for external data
✅ Proper package structure

---

## 🛠️ Development Guidelines

### Code Structure Convention

```
service-name/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── ma/enset/[service]/
│   │   │       ├── entities/          # JPA entities
│   │   │       ├── repositories/      # Spring Data repositories
│   │   │       ├── feign/             # Feign clients (if needed)
│   │   │       ├── entities/models/   # External models
│   │   │       ├── config/            # Configuration classes
│   │   │       └── [Service]Application.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
└── README.md
```

### Naming Conventions

- **Entities:** `Customer`, `Product`, `Bill`
- **Repositories:** `CustomerRepository`, `ProductRepository`
- **Feign Clients:** `CustomerRestClient`, `ProductRestClient`
- **Services:** `customer-service`, `inventory-service`

### Git Workflow

```bash
# Feature branch
git checkout -b feature/service-name

# Commit with meaningful messages
git commit -m "feat(customer-service): add email validation"

# Push and create PR
git push origin feature/service-name
```

---

## 🧪 Testing

### Running Tests

```bash
# All services
mvn test

# Specific service
cd customer-service
mvn test

# With coverage
mvn test jacoco:report
```

### Test Categories
- **Unit Tests:** Business logic testing
- **Integration Tests:** Repository and REST endpoint testing
- **Contract Tests:** Inter-service communication (future)

---

## 📚 Resources

### Official Documentation
- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Cloud Documentation](https://spring.io/projects/spring-cloud)
- [Spring Data JPA](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [Spring Cloud Netflix](https://spring.io/projects/spring-cloud-netflix)
- [Spring Cloud Config](https://spring.io/projects/spring-cloud-config)
- [Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway)
- [OpenFeign](https://spring.io/projects/spring-cloud-openfeign)

### Microservices Patterns
- [Microservices.io](https://microservices.io/) - Pattern catalog
- [12 Factor App](https://12factor.net/) - Best practices
- [Martin Fowler - Microservices](https://martinfowler.com/articles/microservices.html)

### Books
- "Building Microservices" by Sam Newman
- "Microservices Patterns" by Chris Richardson
- "Spring Microservices in Action" by John Carnell

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Contact

**Repository Maintainer:** Otmane Touhami  
**GitHub:** [@OtmaneTouhami](https://github.com/OtmaneTouhami)  
**Course:** Systèmes Parallèles et Distribués - ENSET Mohammadia

---

## 📝 License

This project is created for educational purposes as part of the Microservices course at ENSET Mohammadia.

---

<p align="center">
  <strong>🎓 Built with ❤️ at ENSET Mohammadia by Otmane TOUHAMI</strong>
</p>

<p align="center">
  <sub>Last Updated: October 28, 2025</sub>
</p>
