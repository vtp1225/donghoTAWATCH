package TAWactch.example.TAWatch.Enum;

public enum ErrorCode {
    USER_NOT_FOUND(1001, "Khong tim thay user"),
    EMAIl_NOT_FOUND(1002, "Khong tim thay email"),
    USER_EXISTS(1003, "User da ton tai"),
    UNCATEGORIED_EXCEPTION(9999, "Loi khong xac dinh"),
    PASSWORD_VALID(1004, "Mat khau phai co it nhat 6 ky tu"),
    EMAIL_VALID(1005, "Email khong dung dinh dang"),
    INVALID_KEY(99991, "Khong tim thay key"),
    WRONG_PASSWORD(1006, "Sai mat khau"),
    INVALID_TOKEN(1007, "Token khong hop le hoac da het han"),
    WATCH_NOT_FOUND(2001, "Khong tim thay dong ho"),
    WATCH_SKU_EXISTS(2002, "Ma SKU da ton tai"),
    BRAND_NOT_FOUND(2003, "Khong tim thay thuong hieu"),
    CATEGORY_NOT_FOUND(2004, "Khong tim thay danh muc"),
    SEGMENT_NOT_FOUND(2005, "Khong tim thay phan khuc"),
    BRAND_NAME_EXISTS(2006, "Ten thuong hieu da ton tai"),
    WATCH_VARIANT_NOT_FOUND(2008, "Khong tim thay bien the dong ho"),
    CATEGORY_NAME_EXISTS(2009, "Ten danh muc da ton tai"),
    CATEGORY_SLUG_EXISTS(2010, "Slug danh muc da ton tai"),
    CATEGORY_CIRCULAR_REFERENCE(2011, "Danh muc cha khong hop le (tao vong lap)"),
    SEGMENT_NAME_EXISTS(2012, "Ten phan khuc da ton tai"),
    WATCH_VARIANT_IMAGE_NOT_FOUND(2013, "Khong tim thay anh bien the dong ho"),
    ADDRESS_NOT_FOUND(3001, "Khong tim thay dia chi"),
    ADDRESS_NOT_BELONG_TO_USER(3002, "Dia chi khong thuoc ve user nay"),
    CART_NOT_FOUND(4001, "Khong tim thay gio hang"),
    CART_ITEM_NOT_FOUND(4002, "Khong tim thay san pham trong gio hang"),
    CART_ITEM_ALREADY_EXISTS(4003, "San pham da ton tai trong gio hang"),
    WATCH_VARIANT_INACTIVE(4004, "Bien the dong ho khong con hoat dong"),
    QUANTITY_INVALID(4005, "So luong phai lon hon 0"),
    ORDER_NOT_FOUND(5001, "Khong tim thay don hang"),
    ORDER_CANNOT_CANCEL(5002, "Don hang khong the huy o trang thai nay"),
    ORDER_ITEMS_EMPTY(5003, "Don hang phai co it nhat 1 san pham"),
    INSUFFICIENT_STOCK(5004, "So luong ton kho khong du"),
    COUPON_NOT_FOUND(5005, "Khong tim thay coupon"),
    COUPON_ALREADY_USED(5006, "Coupon nay da duoc su dung"),
    COUPON_EXPIRED(5007, "Coupon da het han"),
    COUPON_INACTIVE(5008, "Coupon khong con hoat dong"),
    ORDER_BELOW_MIN_VALUE(5009, "Gia tri don hang chua dat muc toi thieu de ap dung coupon"),
    INVALID_STATUS_TRANSITION(5010, "Chuyen doi trang thai don hang khong hop le"),
    USER_ALREADY_VERIFIED(1008, "Email nay da duoc xac thuc"),
    OTP_NOT_FOUND(6001, "Khong tim thay OTP hop le, vui long yeu cau gui lai"),
    OTP_EXPIRED(6002, "OTP da het han, vui long yeu cau gui lai"),
    OTP_ALREADY_USED(6003, "OTP nay da duoc su dung"),
    OTP_INVALID(6004, "Ma OTP khong chinh xac"),
    OTP_MAX_ATTEMPTS(6005, "Da nhap sai qua 5 lan, vui long yeu cau OTP moi"),
    OTP_SEND_TOO_SOON(6006, "Vui long doi 1 phut truoc khi gui lai OTP"),
    RESET_TOKEN_INVALID(6007, "Token dat lai mat khau khong hop le hoac da het han"),

    // Payment
    PAYMENT_TRANSACTION_NOT_FOUND(7001, "Khong tim thay giao dich thanh toan"),
    PAYMENT_ALREADY_PROCESSED(7002, "Giao dich nay da duoc xu ly"),
    PAYMENT_ORDER_MISMATCH(7003, "Giao dich khong thuoc don hang nay"),
    PAYMENT_INVALID_METHOD(7004, "Phuong thuc thanh toan khong hop le cho hanh dong nay"),

    // Shipper
    SHIPPER_NOT_FOUND(8001, "Khong tim thay shipper"),
    SHIPPER_NAME_EXISTS(8002, "Ten shipper da ton tai"),
    ORDER_TRACKING_REQUIRES_SHIPPING(8003, "Chi cap nhat ma van don khi don hang o trang thai SHIPPING"),
    ORDER_SHIPPER_REQUIRES_CONFIRMED(8004, "Chi gan shipper khi don hang o trang thai CONFIRMED hoac PROCESSING"),

    // Coupon / Promotion
    PROMOTION_NOT_FOUND(9002, "Khong tim thay chuong trinh khuyen mai"),
    COUPON_CODE_EXISTS(9003, "Ma coupon nay da ton tai"),

    // Slug
    WATCH_SLUG_EXISTS(2014, "Slug dong ho da ton tai"),
    BRAND_SLUG_EXISTS(2015, "Slug thuong hieu da ton tai"),
    SEGMENT_SLUG_EXISTS(2016, "Slug phan khuc da ton tai"),

    // Cloudinary
    IMAGE_UPLOAD_FAILED(9001, "Upload anh that bai, vui long thu lai"),
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
