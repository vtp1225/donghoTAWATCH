package TAWactch.example.TAWatch.order.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class GhnService {

    @Value("${ghn.token}")
    private String token;

    @Value("${ghn.shop-id}")
    private Integer shopId;

    @Value("${ghn.base-url}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private HttpHeaders headers() {
        HttpHeaders h = new HttpHeaders();
        h.set("Token", token);
        h.set("ShopId", String.valueOf(shopId));
        h.setContentType(MediaType.APPLICATION_JSON);
        return h;
    }

    public List<Map<String, Object>> getProvinces() {
        String raw = restTemplate.exchange(
                baseUrl + "/master-data/province",
                HttpMethod.GET,
                new HttpEntity<>(headers()),
                String.class
        ).getBody();
        return parseDataList(parse(raw), "ProvinceID", "provinceId", "ProvinceName", "provinceName");
    }

    public List<Map<String, Object>> getDistricts(Integer provinceId) {
        String raw = restTemplate.exchange(
                baseUrl + "/master-data/district?province_id=" + provinceId,
                HttpMethod.GET,
                new HttpEntity<>(headers()),
                String.class
        ).getBody();
        return parseDataList(parse(raw), "DistrictID", "districtId", "DistrictName", "districtName");
    }

    public List<Map<String, Object>> getWards(Integer districtId) {
        Map<String, Object> body = Map.of("district_id", districtId);
        String raw = restTemplate.exchange(
                baseUrl + "/master-data/ward",
                HttpMethod.POST,
                new HttpEntity<>(body, headers()),
                String.class
        ).getBody();
        return parseWardList(parse(raw));
    }

    public Integer calculateFee(Integer toDistrictId, String toWardCode, Integer weightGrams, Integer insuranceValue) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("service_type_id", 2);
        body.put("to_district_id", toDistrictId);
        body.put("to_ward_code", toWardCode);
        body.put("weight", weightGrams);
        if (insuranceValue != null && insuranceValue > 0) {
            body.put("insurance_value", Math.min(insuranceValue, 5000000));
        }

        String raw = restTemplate.exchange(
                baseUrl + "/v2/shipping-order/fee",
                HttpMethod.POST,
                new HttpEntity<>(body, headers()),
                String.class
        ).getBody();

        JsonNode root = parse(raw);
        JsonNode data = root != null ? root.get("data") : null;
        if (data == null || data.isNull()) return 0;
        return data.path("total").asInt(0);
    }

    public String createShippingOrder(
            Integer toDistrictId, String toWardCode,
            String toName, String toPhone, String toAddress,
            Integer weightGrams, Integer insuranceValue, Integer codAmount,
            String clientOrderCode, List<Map<String, Object>> items
    ) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("payment_type_id", 1); // 1: Người bán trả phí (hoặc 2 nếu người mua trả)
        body.put("required_note", "CHOXEMHANGKHONGTHU");
        body.put("client_order_code", clientOrderCode);
        body.put("to_name", toName);
        body.put("to_phone", toPhone);
        body.put("to_address", toAddress);
        body.put("to_ward_code", toWardCode);
        body.put("to_district_id", toDistrictId);
        body.put("weight", weightGrams);
        body.put("length", 15); // Kích thước mặc định cho đồng hồ
        body.put("width", 15);
        body.put("height", 10);
        body.put("service_type_id", 2);
        if (insuranceValue != null && insuranceValue > 0) {
            body.put("insurance_value", Math.min(insuranceValue, 5000000));
        }
        if (codAmount != null && codAmount > 0) {
            body.put("cod_amount", codAmount);
        }
        body.put("items", items);

        try {
            String raw = restTemplate.exchange(
                    baseUrl + "/v2/shipping-order/create",
                    HttpMethod.POST,
                    new HttpEntity<>(body, headers()),
                    String.class
            ).getBody();

            JsonNode root = parse(raw);
            JsonNode data = root != null ? root.get("data") : null;
            if (data == null || data.isNull()) return null;
            return data.path("order_code").asText();
        } catch (Exception e) {
            System.err.println("Error creating GHN order: " + e.getMessage());
            return null;
        }
    }

    public Map<String, Object> getOrderTracking(String orderCode) {
        Map<String, Object> body = Map.of("order_code", orderCode);
        try {
            String raw = restTemplate.exchange(
                    baseUrl + "/v2/shipping-order/detail",
                    HttpMethod.POST,
                    new HttpEntity<>(body, headers()),
                    String.class
            ).getBody();

            JsonNode root = parse(raw);
            JsonNode data = root != null ? root.get("data") : null;
            if (data == null || data.isNull()) return null;

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("status", data.path("status").asText());
            
            // Lấy lịch sử log
            JsonNode logNode = data.get("log");
            List<Map<String, Object>> logs = new ArrayList<>();
            if (logNode != null && logNode.isArray()) {
                logNode.forEach(log -> {
                    Map<String, Object> logItem = new LinkedHashMap<>();
                    logItem.put("status", log.path("status").asText());
                    logItem.put("updated_date", log.path("updated_date").asText());
                    logs.add(logItem);
                });
            }
            result.put("log", logs);
            
            return result;
        } catch (Exception e) {
            System.err.println("Error fetching GHN tracking: " + e.getMessage());
            return null;
        }
    }

    private JsonNode parse(String raw) {
        if (raw == null) return null;
        try {
            return objectMapper.readTree(raw);
        } catch (Exception e) {
            return null;
        }
    }

    // ── helpers ──────────────────────────────────────────────

    private List<Map<String, Object>> parseDataList(JsonNode root,
                                                     String idKey, String idOut,
                                                     String nameKey, String nameOut) {
        List<Map<String, Object>> result = new ArrayList<>();
        if (root == null) return result;
        JsonNode data = root.get("data");
        if (data == null || !data.isArray()) return result;
        data.forEach(node -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put(idOut, node.path(idKey).asInt());
            item.put(nameOut, node.path(nameKey).asText());
            result.add(item);
        });
        return result;
    }

    private List<Map<String, Object>> parseWardList(JsonNode root) {
        List<Map<String, Object>> result = new ArrayList<>();
        if (root == null) return result;
        JsonNode data = root.get("data");
        if (data == null || !data.isArray()) return result;
        data.forEach(node -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("wardCode", node.path("WardCode").asText());
            item.put("wardName", node.path("WardName").asText());
            result.add(item);
        });
        return result;
    }
}
