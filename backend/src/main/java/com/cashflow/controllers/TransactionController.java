package com.cashflow.controllers;

import com.cashflow.dto.TransactionDTO;
import com.cashflow.entities.Transaction;
import com.cashflow.services.TransactionService;
import com.cashflow.utils.Messages;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "api/v1/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<String> addTransaction(@RequestBody TransactionDTO transactionDTO) {
        transactionService.addTransaction(transactionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(Messages.MESSAGE1.getDescriptionTransaction());
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getTransaction() {
        return ResponseEntity.status(HttpStatus.OK).body(transactionService.getTransaction());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getId(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(transactionService.getId(id));
    }



}
