package TAWactch.example.TAWatch.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record SupplierRequest(
        @NotBlank @Size(max = 200) String name,
        @NotBlank @Email @Size(max = 150) String email,
        @NotBlank @Size(max = 20) String phone,
        String address,
        Boolean isActive,
        List<Integer> brandIds
) {}
