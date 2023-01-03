package com.cashflow.services;

import com.cashflow.dto.TransactionDTO;
import com.cashflow.entities.Transaction;
import com.cashflow.repositories.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public void addTransaction(TransactionDTO transactionDTO) {
        Transaction transaction = new Transaction();
        transaction.setDesc(transactionDTO.getDesc());
        transaction.setPrice(transactionDTO.getPrice());
        transaction.setType(transactionDTO.getType());
        transaction.setCreatedAt(LocalDateTime.now());

        transactionRepository.save(transaction);
    }

    public List<Transaction> getTransaction() {
       return transactionRepository.findAll();
    }

    public Optional<Transaction> getId(Long id) {
        return transactionRepository.findById(id);
    }
}
