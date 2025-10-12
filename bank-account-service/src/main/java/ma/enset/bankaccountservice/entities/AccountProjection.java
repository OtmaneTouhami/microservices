package ma.enset.bankaccountservice.entities;

import ma.enset.bankaccountservice.enums.AccountType;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "p1", types = BankAccount.class)
public interface AccountProjection {
    String getId();
    Double getBalance();
    AccountType getType();
}