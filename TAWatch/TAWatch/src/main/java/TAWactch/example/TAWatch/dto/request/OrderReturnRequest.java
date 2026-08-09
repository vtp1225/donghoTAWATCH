package TAWactch.example.TAWatch.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record OrderReturnRequest(
        @NotNull(message = "userId không được để trống")
        Integer userId,
        
        @NotBlank(message = "Lý do đổi trả không được để trống")
        String reason
) {}
