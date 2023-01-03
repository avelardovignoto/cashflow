package com.cashflow.utils;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Messages {
    MESSAGE1("Transação salva com sucesso.");
    private final String DescriptionTransaction;
}
