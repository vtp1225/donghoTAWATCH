package TAWactch.example.TAWatch.Enum;

public enum ErrorCode {
    USER_NOT_FOUND(1001, "Không tìm thấy user"),
    EMAIl_NOT_FOUND(1002, "Không tìm thấy email"),
    USER_EXISTS(1003, "User đã tồn tại"),
    UNCATEGORIED_EXCEPTION(9999, "Lỗi không xác định"),
    PASSWORD_VALID(1004, "Mật khẩu phải có ít nhất 6 ký tự"),
    EMAIL_VALID(1005, "Email không đúng định dạng"),
    INVALID_KEY(99991, "Không tìm thấy key"),
    WRONG_PASSWORD(1006, "Sai mật khẩu"),
    INVALID_TOKEN(1007, "Token không hợp lệ hoặc đã hết hạn"),
    WATCH_NOT_FOUND(2001, "Không tìm thấy đồng hồ"),
    WATCH_SKU_EXISTS(2002, "Mã SKU đã tồn tại"),
    BRAND_NOT_FOUND(2003, "Không tìm thấy thương hiệu"),
    CATEGORY_NOT_FOUND(2004, "Không tìm thấy danh mục"),
    SEGMENT_NOT_FOUND(2005, "Không tìm thấy phân khúc"),
    BRAND_NAME_EXISTS(2006, "Tên thương hiệu đã tồn tại"),
    WATCH_VARIANT_NOT_FOUND(2008, "Không tìm thấy biến thể đồng hồ"),
    CATEGORY_NAME_EXISTS(2009, "Tên danh mục đã tồn tại"),
    CATEGORY_SLUG_EXISTS(2010, "Slug danh mục đã tồn tại"),
    CATEGORY_CIRCULAR_REFERENCE(2011, "Danh mục cha không hợp lệ (tạo vòng lặp)"),
    SEGMENT_NAME_EXISTS(2012, "Tên phân khúc đã tồn tại"),
    WATCH_VARIANT_IMAGE_NOT_FOUND(2013, "Không tìm thấy ảnh biến thể đồng hồ"),
    ADDRESS_NOT_FOUND(3001, "Không tìm thấy địa chỉ"),
    ADDRESS_NOT_BELONG_TO_USER(3002, "Địa chỉ không thuộc về user này"),
    CART_NOT_FOUND(4001, "Không tìm thấy giỏ hàng"),
    CART_ITEM_NOT_FOUND(4002, "Không tìm thấy sản phẩm trong giỏ hàng"),
    CART_ITEM_ALREADY_EXISTS(4003, "Sản phẩm đã tồn tại trong giỏ hàng"),
    WATCH_VARIANT_INACTIVE(4004, "Biến thể đồng hồ không còn hoạt động"),
    QUANTITY_INVALID(4005, "Số lượng phải lớn hơn 0"),
    ORDER_NOT_FOUND(5001, "Không tìm thấy đơn hàng"),
    ORDER_CANNOT_CANCEL(5002, "Đơn hàng không thể hủy ở trạng thái này"),
    ORDER_ITEMS_EMPTY(5003, "Đơn hàng phải có ít nhất 1 sản phẩm"),
    INSUFFICIENT_STOCK(5004, "Số lượng tồn kho không đủ"),
    COUPON_NOT_FOUND(5005, "Không tìm thấy coupon"),
    COUPON_ALREADY_USED(5006, "Coupon này đã được sử dụng"),
    COUPON_EXPIRED(5007, "Coupon đã hết hạn"),
    COUPON_INACTIVE(5008, "Coupon không còn hoạt động"),
    ORDER_BELOW_MIN_VALUE(5009, "Giá trị đơn hàng chưa đạt mức tối thiểu để áp dụng coupon"),
    INVALID_STATUS_TRANSITION(5010, "Chuyển đổi trạng thái đơn hàng không hợp lệ"),
    INVALID_QUANTITY(5011, "Số lượng không hợp lệ"),
    COUPON_ALREADY_USED_BY_USER(5012, "Bạn đã sử dụng mã giảm giá này cho đơn hàng trước đó"),

    USER_ALREADY_VERIFIED(1008, "Email này đã được xác thực"),
    OTP_NOT_FOUND(6001, "Không tìm thấy OTP hợp lệ, vui lòng yêu cầu gửi lại"),
    OTP_EXPIRED(6002, "OTP đã hết hạn, vui lòng yêu cầu gửi lại"),
    OTP_ALREADY_USED(6003, "OTP này đã được sử dụng"),
    OTP_INVALID(6004, "Mã OTP không chính xác"),
    OTP_MAX_ATTEMPTS(6005, "Đã nhập sai quá 5 lần, vui lòng yêu cầu OTP mới"),
    OTP_SEND_TOO_SOON(6006, "Vui lòng đợi 1 phút trước khi gửi lại OTP"),
    RESET_TOKEN_INVALID(6007, "Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"),
    GOOGLE_TOKEN_INVALID(1009, "Token Google không hợp lệ hoặc đã hết hạn"),

    // Payment
    PAYMENT_TRANSACTION_NOT_FOUND(7001, "Không tìm thấy giao dịch thanh toán"),
    PAYMENT_ALREADY_PROCESSED(7002, "Giao dịch này đã được xử lý"),
    PAYMENT_ORDER_MISMATCH(7003, "Giao dịch không thuộc đơn hàng này"),
    PAYMENT_INVALID_METHOD(7004, "Phương thức thanh toán không hợp lệ cho hành động này"),
    PAYMENT_INVALID_SIGNATURE(7005, "Chữ ký VNPay không hợp lệ"),

    // Shipper
    SHIPPER_NOT_FOUND(8001, "Không tìm thấy shipper"),
    SHIPPER_NAME_EXISTS(8002, "Tên shipper đã tồn tại"),
    ORDER_TRACKING_REQUIRES_SHIPPING(8003, "Chỉ cập nhật mã vận đơn khi đơn hàng ở trạng thái SHIPPING"),
    ORDER_SHIPPER_REQUIRES_CONFIRMED(8004, "Chỉ gán shipper khi đơn hàng ở trạng thái CONFIRMED hoặc PROCESSING"),

    // Coupon / Promotion
    PROMOTION_NOT_FOUND(9002, "Không tìm thấy chương trình khuyến mãi"),
    COUPON_CODE_EXISTS(9003, "Mã coupon này đã tồn tại"),
    INVALID_DATE_RANGE(9004,"Ngay thang khong hop le"),
    PROMOTION_CAUSES_LOSS(9005, "Mức giảm giá này sẽ làm một số sản phẩm có giá bán thấp hơn giá vốn (bán lỗ). Vui lòng điều chỉnh lại!"),
    // Slug
    WATCH_SLUG_EXISTS(2014, "Slug đồng hồ đã tồn tại"),
    BRAND_SLUG_EXISTS(2015, "Slug thương hiệu đã tồn tại"),
    SEGMENT_SLUG_EXISTS(2016, "Slug phân khúc đã tồn tại"),

    // Cloudinary
    IMAGE_UPLOAD_FAILED(9001, "Upload ảnh thất bại, vui lòng thử lại"),

    // Color
    COLOR_NOT_FOUND(11001, "Không tìm thấy màu sắc"),
    COLOR_NAME_EXISTS(11002, "Tên màu sắc đã tồn tại"),

    // Import Receipt
    IMPORT_RECEIPT_NOT_FOUND(13001, "Không tìm thấy phiếu nhập kho"),
    IMPORT_RECEIPT_ALREADY_CONFIRMED(13002, "Phiếu nhập kho này đã được xác nhận"),
    IMPORT_RECEIPT_CANNOT_DELETE(13003, "Chỉ có thể xóa phiếu ở trạng thái DRAFT"),
    IMPORT_RECEIPT_ITEMS_EMPTY(13004, "Phiếu nhập phải có ít nhất 1 sản phẩm"),

    // Wishlist
    WISHLIST_ALREADY_EXISTS(12001, "Sản phẩm đã có trong danh sách yêu thích"),
    WISHLIST_NOT_FOUND(12002, "Không tìm thấy sản phẩm trong danh sách yêu thích"),

    // Review
    REVIEW_NOT_FOUND(10001, "Không tìm thấy đánh giá"),
    REVIEW_ALREADY_EXISTS(10002, "Bạn đã đánh giá sản phẩm này cho đơn hàng này"),
    ORDER_NOT_DELIVERED(10003, "Chỉ có thể đánh giá khi đơn hàng đã giao thành công"),
    ORDER_NOT_BELONG_TO_USER(10004, "Đơn hàng này không thuộc về bạn"),
    WATCH_NOT_IN_ORDER(10005, "Sản phẩm này không có trong đơn hàng"),
    RATING_INVALID(10006, "Điểm đánh giá phải từ 1 đến 5"),
    REVIEW_CONTAINS_PROFANITY(10007, "Đánh giá chứa nội dung không phù hợp. Vui lòng chỉnh sửa trước khi gửi."),

    // Watch delete
    WATCH_HAS_ORDERS(2017, "Không thể xóa sản phẩm đã có đơn hàng. Hãy tạm dừng bán thay thế."),
    ;

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() { return code; }
    public String getMessage() { return message; }
}
