package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.ErrorCode;
import TAWactch.example.TAWatch.dto.request.UserAddressRequest;
import TAWactch.example.TAWatch.dto.respone.UserAddressResponse;
import TAWactch.example.TAWatch.entity.User;
import TAWactch.example.TAWatch.entity.UserAddress;
import TAWactch.example.TAWatch.exception.AppException;
import TAWactch.example.TAWatch.mapper.UserAddressMapper;
import TAWactch.example.TAWatch.repository.UserAddressRepo;
import TAWactch.example.TAWatch.repository.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserAddressService {

    @Autowired private UserAddressRepo addressRepo;
    @Autowired private UserRepo userRepo;
    @Autowired private UserAddressMapper addressMapper;

    public List<UserAddressResponse> getAddressesByUser(Integer userId) {
        requireUserExists(userId);
        return addressRepo.findByUserId(userId).stream()
                .map(addressMapper::toResponse)
                .toList();
    }

    public UserAddressResponse getAddress(Integer userId, Integer addressId) {
        UserAddress address = requireAddressOfUser(userId, addressId);
        return addressMapper.toResponse(address);
    }

    @Transactional
    public UserAddressResponse createAddress(Integer userId, UserAddressRequest request) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (Boolean.TRUE.equals(request.isDefault())) {
            addressRepo.clearDefaultByUserId(userId);
        }

        UserAddress address = addressMapper.toEntity(request);
        address.setUser(user);
        address.setIsDefault(Boolean.TRUE.equals(request.isDefault()));
        addressRepo.save(address);
        return addressMapper.toResponse(address);
    }

    @Transactional
    public UserAddressResponse updateAddress(Integer userId, Integer addressId, UserAddressRequest request) {
        UserAddress address = requireAddressOfUser(userId, addressId);

        if (Boolean.TRUE.equals(request.isDefault())) {
            addressRepo.clearDefaultByUserId(userId);
        }

        addressMapper.partialUpdate(request, address);
        if (request.isDefault() != null) {
            address.setIsDefault(request.isDefault());
        }
        addressRepo.save(address);
        return addressMapper.toResponse(address);
    }

    @Transactional
    public UserAddressResponse setDefault(Integer userId, Integer addressId) {
        requireUserExists(userId);
        UserAddress address = requireAddressOfUser(userId, addressId);
        addressRepo.clearDefaultByUserId(userId);
        address.setIsDefault(true);
        addressRepo.save(address);
        return addressMapper.toResponse(address);
    }

    public void deleteAddress(Integer userId, Integer addressId) {
        UserAddress address = requireAddressOfUser(userId, addressId);
        addressRepo.delete(address);
    }

    private void requireUserExists(Integer userId) {
        if (!userRepo.existsById(userId)) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
    }

    private UserAddress requireAddressOfUser(Integer userId, Integer addressId) {
        return addressRepo.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));
    }
}
