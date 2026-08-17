package TAWactch.example.TAWatch.order.service;

import TAWactch.example.TAWatch.common.enums.ErrorCode;
import TAWactch.example.TAWatch.common.exception.AppException;
import TAWactch.example.TAWatch.order.dto.request.ShipperRequest;
import TAWactch.example.TAWatch.order.dto.response.ShipperResponse;
import TAWactch.example.TAWatch.order.entity.Shipper;
import TAWactch.example.TAWatch.order.repository.ShipperRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShipperService {

    @Autowired private ShipperRepo shipperRepo;

    public List<ShipperResponse> getAll() {
        return shipperRepo.findAll().stream().map(this::toResponse).toList();
    }

    public List<ShipperResponse> getActive() {
        return shipperRepo.findByIsActiveTrue().stream().map(this::toResponse).toList();
    }

    public ShipperResponse getById(Integer id) {
        return toResponse(require(id));
    }

    public ShipperResponse create(ShipperRequest request) {
        if (shipperRepo.existsByName(request.name())) {
            throw new AppException(ErrorCode.SHIPPER_NAME_EXISTS);
        }
        Shipper s = new Shipper();
        s.setName(request.name());
        s.setApiEndpoint(request.apiEndpoint());
        s.setApiKey(request.apiKey());
        s.setIsActive(request.isActive() != null ? request.isActive() : true);
        return toResponse(shipperRepo.save(s));
    }

    public ShipperResponse update(Integer id, ShipperRequest request) {
        Shipper s = require(id);
        if (!s.getName().equals(request.name()) && shipperRepo.existsByName(request.name())) {
            throw new AppException(ErrorCode.SHIPPER_NAME_EXISTS);
        }
        s.setName(request.name());
        s.setApiEndpoint(request.apiEndpoint());
        s.setApiKey(request.apiKey());
        if (request.isActive() != null) s.setIsActive(request.isActive());
        return toResponse(shipperRepo.save(s));
    }

    public void delete(Integer id) {
        require(id);
        shipperRepo.deleteById(id);
    }

    private Shipper require(Integer id) {
        return shipperRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SHIPPER_NOT_FOUND));
    }

    private ShipperResponse toResponse(Shipper s) {
        return new ShipperResponse(s.getId(), s.getName(), s.getApiEndpoint(), s.getIsActive());
    }
}
