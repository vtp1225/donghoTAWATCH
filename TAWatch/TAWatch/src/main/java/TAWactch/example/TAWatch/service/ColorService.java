package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.ErrorCode;
import TAWactch.example.TAWatch.dto.request.ColorRequest;
import TAWactch.example.TAWatch.dto.respone.ColorResponse;
import TAWactch.example.TAWatch.entity.Color;
import TAWactch.example.TAWatch.exception.AppException;
import TAWactch.example.TAWatch.mapper.ColorMapper;
import TAWactch.example.TAWatch.repository.ColorRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ColorService {

    @Autowired
    private ColorRepo colorRepo;

    @Autowired
    private ColorMapper colorMapper;

    public List<ColorResponse> getAll(Boolean isActive) {
        if (Boolean.TRUE.equals(isActive)) {
            return colorRepo.findByIsActiveTrueOrderByNameAsc()
                    .stream().map(colorMapper::toResponse).toList();
        }
        return colorRepo.findAllByOrderByNameAsc()
                .stream().map(colorMapper::toResponse).toList();
    }

    public ColorResponse getById(int id) {
        return colorMapper.toResponse(requireColor(id));
    }

    public ColorResponse create(ColorRequest request) {
        if (colorRepo.existsByNameIgnoreCase(request.name())) {
            throw new AppException(ErrorCode.COLOR_NAME_EXISTS);
        }
        Color color = new Color();
        color.setName(request.name());
        color.setHexCode(request.hexCode());
        color.setIsActive(request.isActive() != null ? request.isActive() : true);
        color.setCreatedAt(Instant.now());
        color.setUpdatedAt(Instant.now());
        return colorMapper.toResponse(colorRepo.save(color));
    }

    public ColorResponse update(int id, ColorRequest request) {
        Color color = requireColor(id);
        if (colorRepo.existsByNameIgnoreCaseAndIdNot(request.name(), id)) {
            throw new AppException(ErrorCode.COLOR_NAME_EXISTS);
        }
        colorMapper.partialUpdate(request, color);
        color.setUpdatedAt(Instant.now());
        return colorMapper.toResponse(colorRepo.save(color));
    }

    public void delete(int id) {
        if (!colorRepo.existsById(id)) {
            throw new AppException(ErrorCode.COLOR_NOT_FOUND);
        }
        colorRepo.deleteById(id);
    }

    private Color requireColor(int id) {
        return colorRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COLOR_NOT_FOUND));
    }
}
