package ma.enset.gatewayservice.config;

import org.springdoc.core.properties.AbstractSwaggerUiConfigProperties.SwaggerUrl;
import org.springdoc.core.properties.SwaggerUiConfigProperties;
import org.springframework.cloud.gateway.route.RouteDefinitionLocator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Configuration
public class SwaggerConfig {

    @Bean
    @Lazy(false)
    public Set<SwaggerUrl> swaggerUrls(RouteDefinitionLocator locator, SwaggerUiConfigProperties swaggerUiConfigProperties) {
        Set<SwaggerUrl> urls = new HashSet<>();
        
        // Define the services to aggregate
        List<String> services = List.of(
            "customer-service",
            "inventory-service",
            "billing-service"
        );
        
        services.forEach(service -> {
            SwaggerUrl swaggerUrl = new SwaggerUrl();
            swaggerUrl.setName(service);
            swaggerUrl.setUrl("/" + service + "/v3/api-docs");
            urls.add(swaggerUrl);
        });
        
        swaggerUiConfigProperties.setUrls(urls);
        return urls;
    }
}
