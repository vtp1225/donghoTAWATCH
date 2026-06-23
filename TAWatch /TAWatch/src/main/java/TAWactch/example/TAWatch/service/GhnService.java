package TAWactch.example.TAWatch.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

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
