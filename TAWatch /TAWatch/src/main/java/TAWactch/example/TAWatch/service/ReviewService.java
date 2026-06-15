package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.ErrorCode;
import TAWactch.example.TAWatch.Enum.OrderStatusType;
import TAWactch.example.TAWatch.dto.request.ReviewRequest;
import TAWactch.example.TAWatch.dto.respone.ReviewResponse;
import TAWactch.example.TAWatch.entity.Order;
import TAWactch.example.TAWatch.entity.Review;
import TAWactch.example.TAWatch.entity.User;
import TAWactch.example.TAWatch.entity.Watch;
import TAWactch.example.TAWatch.exception.AppException;
import TAWactch.example.TAWatch.mapper.ReviewMapper;
import TAWactch.example.TAWatch.repository.OrderItemRepo;
import TAWactch.example.TAWatch.repository.OrderRepo;
import TAWactch.example.TAWatch.repository.ReviewRepo;
import TAWactch.example.TAWatch.repository.UserRepo;
import TAWactch.example.TAWatch.repository.WatchRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepo reviewRepo;

    @Autowired
    private ReviewMapper reviewMapper;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private WatchRepo watchRepo;

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private OrderItemRepo orderItemRepo;

    // Admin: lấy tất cả hoặc lọc theo isApproved
    public List<ReviewResponse> getAll(Boolean isApproved) {
        if (isApproved != null) {
            return reviewRepo.findByIsApprovedOrderByCreatedAtDesc(isApproved)
                    .stream().map(reviewMapper::toResponse).toList();
        }
        return reviewRepo.findAllByOrderByCreatedAtDesc()
                .stream().map(reviewMapper::toResponse).toList();
    }

    // Public: lấy review của 1 đồng hồ (mặc định chỉ trả về đã duyệt)
    public List<ReviewResponse> getByWatch(Integer watchId, Boolean isApproved) {
        if (!watchRepo.existsById(watchId)) {
            throw new AppException(ErrorCode.WATCH_NOT_FOUND);
        }
        boolean approved = isApproved == null || isApproved;
        return reviewRepo.findByWatchIdAndIsApprovedOrderByCreatedAtDesc(watchId, approved)
                .stream().map(reviewMapper::toResponse).toList();
    }

    // User: lấy review của chính mình
    public List<ReviewResponse> getByUser(Integer userId) {
        if (!userRepo.existsById(userId)) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        return reviewRepo.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(reviewMapper::toResponse).toList();
    }

    public ReviewResponse getById(int id) {
        return reviewMapper.toResponse(requireReview(id));
    }

    public ReviewResponse create(ReviewRequest request) {
        User user = userRepo.findById(request.userId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Watch watch = watchRepo.findById(request.watchId())
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_NOT_FOUND));
        Order order = orderRepo.findById(request.orderId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // Chỉ review được khi đơn hàng đã giao
        if (order.getOrderStatus() != OrderStatusType.DELIVERED) {
            throw new AppException(ErrorCode.ORDER_NOT_DELIVERED);
        }

        // Đơn hàng phải thuộc về user
        if (order.getUser() == null || !order.getUser().getId().equals(request.userId())) {
            throw new AppException(ErrorCode.ORDER_NOT_BELONG_TO_USER);
        }

        // Đồng hồ phải có trong đơn hàng
        boolean watchInOrder = orderItemRepo.findByOrderId(order.getId()).stream()
                .anyMatch(item -> item.getWatchVariant().getWatch().getId().equals(request.watchId()));
        if (!watchInOrder) {
            throw new AppException(ErrorCode.WATCH_NOT_IN_ORDER);
        }

        // Không được review trùng
        if (reviewRepo.existsByUserIdAndWatchIdAndOrderId(request.userId(), request.watchId(), request.orderId())) {
            throw new AppException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }

        Review review = new Review();
        review.setUser(user);
        review.setWatch(watch);
        review.setOrder(order);
        review.setRating(request.rating().byteValue());
        review.setComment(request.comment());
        review.setIsApproved(false);
        review.setCreatedAt(Instant.now());

        return reviewMapper.toResponse(reviewRepo.save(review));
    }

    // Admin duyệt review
    public ReviewResponse approve(int id) {
        Review review = requireReview(id);
        review.setIsApproved(true);
        return reviewMapper.toResponse(reviewRepo.save(review));
    }

    // Admin xóa review
    public void delete(int id) {
        if (!reviewRepo.existsById(id)) {
            throw new AppException(ErrorCode.REVIEW_NOT_FOUND);
        }
        reviewRepo.deleteById(id);
    }

    private Review requireReview(int id) {
        return reviewRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));
    }
}
