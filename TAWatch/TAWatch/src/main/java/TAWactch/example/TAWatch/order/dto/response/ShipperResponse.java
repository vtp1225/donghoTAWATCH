package TAWactch.example.TAWatch.order.dto.response;

public record ShipperResponse(
        Integer id,
        String name,
        String apiEndpoint,
        Boolean isActive
) {}
