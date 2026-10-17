package com.codereel.model;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class CodeRequest {

    @NotBlank(message = "Code cannot be empty")
    @Size(max = 10_000, message = "Code must not exceed 10,000 characters")
    private String code;

    private String language = "java";

    private String stdin = "";
}
