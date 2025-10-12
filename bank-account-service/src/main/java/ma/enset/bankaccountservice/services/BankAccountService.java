package ma.enset.bankaccountservice.services;

import ma.enset.bankaccountservice.dtos.BankAccountRequestDTO;
import ma.enset.bankaccountservice.dtos.BankAccountResponseDTO;

public interface BankAccountService {
    BankAccountResponseDTO addAccount(BankAccountRequestDTO bankAccountDTO);
    BankAccountResponseDTO updateAccount(String id, BankAccountRequestDTO bankAccountDTO);
}
