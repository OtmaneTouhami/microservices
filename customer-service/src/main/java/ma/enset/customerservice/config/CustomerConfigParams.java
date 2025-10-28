package ma.enset.customerservice.config;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;

@ConfigurationProperties(prefix = "customer.params")
@Getter
@Setter
@AllArgsConstructor
@RefreshScope
@JsonSerialize(as = CustomerConfigParams.class)
public class CustomerConfigParams {
    private int x;
    private int y;
}
