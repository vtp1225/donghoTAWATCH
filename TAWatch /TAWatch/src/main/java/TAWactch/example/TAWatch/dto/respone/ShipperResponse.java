package TAWactch.example.TAWatch.dto.respone;

public record ShipperResponse(
        Integer id,
        String name,
        String apiEndpoint,
        Boolean isActive
) {}
