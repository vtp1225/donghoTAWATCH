# TAWatch API Documentation

**Base URL:** `http://localhost:8080/tawatch`

---

## Cấu trúc Response chung

```json
{
  "code": 200,
  "message": "Success",
  "data": { }
}
```

**Khi lỗi:**
```json
{
  "code": 1001,
  "message": "Khong tim thay user"
}
```

---

## 1. Auth

### POST `/auth/register` — Đăng ký

**Request Body:**
```json
{
  "username": "nguyenvana",
  "email": "vana@gmail.com",
  "password": "123456",
  "fullName": "Nguyen Van A",
  "phone": "0901234567",
  "birthday": "2000-01-15"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Dang ky thanh cong",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "user": {
      "id": 1,
      "username": "nguyenvana",
      "email": "vana@gmail.com",
      "fullName": "Nguyen Van A",
      "phone": "0901234567",
      "birthday": "2000-01-15",
      "authProvider": "LOCAL",
      "role": "CUSTOMER",
      "loyaltyPoints": 0,
      "isActive": true,
      "isVerified": false,
      "createdAt": "2026-05-25T07:00:00Z",
      "updatedAt": "2026-05-25T07:00:00Z"
    }
  }
}
```

---

### POST `/auth/login` — Đăng nhập

**Request Body:**
```json
{
  "email": "vana@gmail.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Dang nhap thanh cong",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "user": {
      "id": 1,
      "username": "nguyenvana",
      "email": "vana@gmail.com",
      "fullName": "Nguyen Van A",
      "role": "CUSTOMER",
      "isActive": true,
      "createdAt": "2026-05-25T07:00:00Z",
      "updatedAt": "2026-05-25T07:00:00Z"
    }
  }
}
```

---

## 2. Users

### GET `/users` — Lấy tất cả user

**Auth:** ADMIN

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "username": "nguyenvana",
      "email": "vana@gmail.com",
      "fullName": "Nguyen Van A",
      "phone": "0901234567",
      "role": "CUSTOMER",
      "loyaltyPoints": 0,
      "isActive": true,
      "isVerified": false,
      "createdAt": "2026-05-25T07:00:00Z",
      "updatedAt": "2026-05-25T07:00:00Z"
    }
  ]
}
```

---

### GET `/users/{id}` — Lấy user theo ID

**Auth:** ADMIN / Authenticated (chỉ xem được thông tin của chính mình)

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "username": "nguyenvana",
    "email": "vana@gmail.com",
    "fullName": "Nguyen Van A",
    "phone": "0901234567",
    "role": "CUSTOMER",
    "loyaltyPoints": 150,
    "isActive": true,
    "isVerified": true,
    "createdAt": "2026-05-25T07:00:00Z",
    "updatedAt": "2026-05-25T07:00:00Z"
  }
}
```

**Lỗi (không tìm thấy):**
```json
{
  "code": 1001,
  "message": "Khong tim thay user"
}
```

---

### POST `/users` — Tạo user mới (Admin)

**Auth:** ADMIN

**Request Body:**
```json
{
  "username": "tranthib",
  "email": "thib@gmail.com",
  "passwordHash": "123456",
  "fullName": "Tran Thi B",
  "phone": "0909876543",
  "authProvider": "LOCAL"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Tao user thanh cong",
  "data": {
    "id": 2,
    "username": "tranthib",
    "email": "thib@gmail.com",
    "fullName": "Tran Thi B",
    "role": "CUSTOMER",
    "loyaltyPoints": 0,
    "isActive": true,
    "isVerified": false,
    "createdAt": "2026-05-25T08:00:00Z",
    "updatedAt": "2026-05-25T08:00:00Z"
  }
}
```

---

### DELETE `/users/{id}` — Xóa user (Admin)

**Auth:** ADMIN

**Response:**
```json
{
  "code": 200,
  "message": "Xoa user thanh cong"
}
```

---

## 3. Watches

> **Enum values:**
> - `movementType`: `AUTOMATIC` | `MANUAL` | `QUARTZ` | `SOLAR` | `SMART`
> - `glassMaterial`: `SAPPHIRE` | `MINERAL` | `HARDLEX` | `ACRYLIC` | `SAPPHIRE_COATED`

### GET `/watches` — Lấy tất cả đồng hồ

**Auth:** Public

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "sku": "RLX-SUB-001",
      "name": "Rolex Submariner",
      "segmentId": 1,
      "segmentName": "Luxury",
      "description": "Dong ho the thao cao cap chong nuoc",
      "movementType": "AUTOMATIC",
      "glassMaterial": "SAPPHIRE",
      "thicknessMm": 12.50,
      "waterResistanceAtm": 30.0,
      "powerReserveHours": 48,
      "batteryType": null,
      "features": "Chronograph, Date display",
      "isActive": true,
      "createdAt": "2026-05-25T07:00:00Z",
      "updatedAt": "2026-05-25T07:00:00Z",
      "brandId": 1,
      "brandName": "Rolex",
      "categoryId": 2,
      "categoryName": "The Thao"
    }
  ]
}
```

---

### GET `/watches/slug/{slug}` — Lấy đồng hồ theo slug

**Auth:** Public

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "sku": "RLX-SUB-001",
    "name": "Rolex Submariner",
    "slug": "rolex-submariner",
    "segmentId": 1,
    "segmentName": "Luxury",
    "description": "Dong ho the thao cao cap chong nuoc",
    "movementType": "AUTOMATIC",
    "glassMaterial": "SAPPHIRE",
    "thicknessMm": 12.50,
    "waterResistanceAtm": 30.0,
    "powerReserveHours": 48,
    "batteryType": null,
    "features": "Chronograph, Date display",
    "isActive": true,
    "createdAt": "2026-05-25T07:00:00Z",
    "updatedAt": "2026-05-25T07:00:00Z",
    "brandId": 1,
    "brandName": "Rolex",
    "categoryId": 2,
    "categoryName": "The Thao"
  }
}
```

**Lỗi (không tìm thấy):**
```json
{
  "code": 2001,
  "message": "Khong tim thay dong ho"
}
```

---

### GET `/watches/{id}` — Lấy đồng hồ theo ID

**Auth:** Public

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "sku": "RLX-SUB-001",
    "name": "Rolex Submariner",
    "segmentId": 1,
    "segmentName": "Luxury",
    "description": "Dong ho the thao cao cap chong nuoc",
    "movementType": "AUTOMATIC",
    "glassMaterial": "SAPPHIRE",
    "thicknessMm": 12.50,
    "waterResistanceAtm": 30.0,
    "powerReserveHours": 48,
    "batteryType": null,
    "features": "Chronograph, Date display",
    "isActive": true,
    "createdAt": "2026-05-25T07:00:00Z",
    "updatedAt": "2026-05-25T07:00:00Z",
    "brandId": 1,
    "brandName": "Rolex",
    "categoryId": 2,
    "categoryName": "The Thao"
  }
}
```

**Lỗi (không tìm thấy):**
```json
{
  "code": 2001,
  "message": "Khong tim thay dong ho"
}
```

---

### POST `/watches` — Tạo đồng hồ mới

**Auth:** ADMIN

**Request Body:**
```json
{
  "sku": "RLX-SUB-001",
  "name": "Rolex Submariner",
  "segmentId": 1,
  "brandId": 1,
  "categoryId": 2,
  "movementType": "AUTOMATIC",
  "description": "Dong ho the thao cao cap chong nuoc",
  "glassMaterial": "SAPPHIRE",
  "thicknessMm": 12.50,
  "waterResistanceAtm": 30.0,
  "powerReserveHours": 48,
  "features": "Chronograph, Date display",
  "isActive": true
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Tao dong ho thanh cong",
  "data": {
    "id": 1,
    "sku": "RLX-SUB-001",
    "name": "Rolex Submariner",
    "brandId": 1,
    "brandName": "Rolex",
    "categoryId": 2,
    "categoryName": "The Thao",
    "segmentId": 1,
    "segmentName": "Luxury",
    "movementType": "AUTOMATIC",
    "isActive": true,
    "createdAt": "2026-05-25T07:00:00Z",
    "updatedAt": "2026-05-25T07:00:00Z"
  }
}
```

**Lỗi (SKU trùng):**
```json
{
  "code": 2002,
  "message": "Ma SKU da ton tai"
}
```

---

### PUT `/watches/{id}` — Cập nhật đồng hồ

**Auth:** ADMIN

**Request Body** _(giống POST, chỉ cần gửi các field muốn cập nhật)_:
```json
{
  "sku": "RLX-SUB-001",
  "name": "Rolex Submariner Black",
  "segmentId": 1,
  "brandId": 1,
  "categoryId": 2,
  "movementType": "AUTOMATIC",
  "waterResistanceAtm": 50.0,
  "isActive": true
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Cap nhat dong ho thanh cong",
  "data": {
    "id": 1,
    "sku": "RLX-SUB-001",
    "name": "Rolex Submariner Black",
    "brandId": 1,
    "brandName": "Rolex",
    "categoryId": 2,
    "categoryName": "The Thao",
    "segmentId": 1,
    "segmentName": "Luxury",
    "movementType": "AUTOMATIC",
    "waterResistanceAtm": 50.0,
    "isActive": true,
    "createdAt": "2026-05-25T07:00:00Z",
    "updatedAt": "2026-05-25T09:00:00Z"
  }
}
```

---

### DELETE `/watches/{id}` — Xóa đồng hồ

**Auth:** ADMIN

**Response:**
```json
{
  "code": 200,
  "message": "Xoa dong ho thanh cong"
}
```

---

## 4. Brands

### GET `/brands` — Lấy tất cả thương hiệu

**Auth:** Public

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Rolex",
      "country": "Switzerland",
      "description": "Thuong hieu dong ho cao cap hang dau the gioi",
      "logoUrl": "https://example.com/rolex-logo.png",
      "isActive": true,
      "createdAt": "2026-05-25T07:00:00Z",
      "updatedAt": "2026-05-25T07:00:00Z"
    }
  ]
}
```

---

### GET `/brands/slug/{slug}` — Lấy thương hiệu theo slug

**Auth:** Public

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Rolex",
    "country": "Switzerland",
    "description": "Thuong hieu dong ho cao cap hang dau the gioi",
    "logoUrl": "https://example.com/rolex-logo.png",
    "isActive": true,
    "createdAt": "2026-05-25T07:00:00Z",
    "updatedAt": "2026-05-25T07:00:00Z"
  }
}
```

**Lỗi (không tìm thấy):**
```json
{
  "code": 2003,
  "message": "Khong tim thay thuong hieu"
}
```

---

### GET `/brands/{id}` — Lấy thương hiệu theo ID

**Auth:** Public

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Rolex",
    "country": "Switzerland",
    "description": "Thuong hieu dong ho cao cap hang dau the gioi",
    "logoUrl": "https://example.com/rolex-logo.png",
    "isActive": true,
    "createdAt": "2026-05-25T07:00:00Z",
    "updatedAt": "2026-05-25T07:00:00Z"
  }
}
```

**Lỗi (không tìm thấy):**
```json
{
  "code": 2003,
  "message": "Khong tim thay thuong hieu"
}
```

---

### POST `/brands` — Tạo thương hiệu mới

**Auth:** ADMIN

**Request Body:**
```json
{
  "name": "Rolex",
  "country": "Switzerland",
  "description": "Thuong hieu dong ho cao cap hang dau the gioi",
  "logoUrl": "https://example.com/rolex-logo.png",
  "isActive": true
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Tao thuong hieu thanh cong",
  "data": {
    "id": 1,
    "name": "Rolex",
    "country": "Switzerland",
    "description": "Thuong hieu dong ho cao cap hang dau the gioi",
    "logoUrl": "https://example.com/rolex-logo.png",
    "isActive": true,
    "createdAt": "2026-05-25T07:00:00Z",
    "updatedAt": "2026-05-25T07:00:00Z"
  }
}
```

**Lỗi (tên trùng):**
```json
{
  "code": 2006,
  "message": "Ten thuong hieu da ton tai"
}
```

---

### PUT `/brands/{id}` — Cập nhật thương hiệu

**Auth:** ADMIN

**Request Body:**
```json
{
  "name": "Rolex",
  "country": "Switzerland",
  "description": "Mo ta moi",
  "logoUrl": "https://example.com/rolex-logo-v2.png",
  "isActive": true
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Cap nhat thuong hieu thanh cong",
  "data": {
    "id": 1,
    "name": "Rolex",
    "country": "Switzerland",
    "description": "Mo ta moi",
    "logoUrl": "https://example.com/rolex-logo-v2.png",
    "isActive": true,
    "createdAt": "2026-05-25T07:00:00Z",
    "updatedAt": "2026-05-25T09:00:00Z"
  }
}
```

---

### DELETE `/brands/{id}` — Xóa thương hiệu

**Auth:** ADMIN

**Response:**
```json
{
  "code": 200,
  "message": "Xoa thuong hieu thanh cong"
}
```

---

## 5. Watch Variant Images

> **Quy ước hai field ảnh:**
> - `isPrimary` — ảnh chính của **biến thể** đó (ví dụ: mặt trước của biến thể màu đen). Mỗi biến thể chỉ có 1 ảnh `isPrimary = true`.
> - `isMainImage` — ảnh đại diện hiển thị chung cho **toàn sản phẩm** (dùng ở trang danh sách, thumbnail, chia sẻ mạng xã hội). Mỗi sản phẩm (`watch`) chỉ nên có đúng 1 bản ghi `isMainImage = true` trong toàn bộ các biến thể của nó.

### GET `/watch-variant-images?variantId={id}` — Lấy tất cả ảnh theo biến thể

**Auth:** Public

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "variantId": 1,
      "dialColor": "Black",
      "strapColor": "Black",
      "url": "https://example.com/rolex-sub-black-1.jpg",
      "altText": "Rolex Submariner Black mat truoc",
      "isPrimary": true,
      "isMainImage": true,
      "sortOrder": 0
    },
    {
      "id": 2,
      "variantId": 1,
      "dialColor": "Black",
      "strapColor": "Black",
      "url": "https://example.com/rolex-sub-black-2.jpg",
      "altText": "Rolex Submariner Black mat nghieng",
      "isPrimary": false,
      "isMainImage": false,
      "sortOrder": 1
    }
  ]
}
```

---

### GET `/watch-variant-images/main?watchId={id}` — Lấy ảnh đại diện của sản phẩm

**Auth:** Public

> Trả về ảnh có `isMainImage = true` thuộc bất kỳ biến thể nào của sản phẩm. Dùng để hiển thị thumbnail ở trang danh sách.

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "variantId": 1,
    "dialColor": "Black",
    "strapColor": "Black",
    "url": "https://example.com/rolex-sub-black-1.jpg",
    "altText": "Rolex Submariner Black mat truoc",
    "isPrimary": true,
    "isMainImage": true,
    "sortOrder": 0
  }
}
```

**Lỗi (không tìm thấy):**
```json
{
  "code": 2001,
  "message": "Khong tim thay dong ho"
}
```

---

### GET `/watch-variant-images/{id}` — Lấy ảnh theo ID

**Auth:** Public

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "variantId": 1,
    "dialColor": "Black",
    "strapColor": "Black",
    "url": "https://example.com/rolex-sub-black-1.jpg",
    "altText": "Rolex Submariner Black mat truoc",
    "isPrimary": true,
    "isMainImage": true,
    "sortOrder": 0
  }
}
```

**Lỗi (không tìm thấy):**
```json
{
  "code": 2013,
  "message": "Khong tim thay anh bien the dong ho"
}
```

---

### POST `/watch-variant-images/upload` — Upload ảnh lên Cloudinary

**Auth:** ADMIN

**Content-Type:** `multipart/form-data`

| Field | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| `file` | file | ✅ | File ảnh (tối đa 5MB) |
| `variantId` | integer | ✅ | ID biến thể |
| `altText` | string | ❌ | Mô tả ảnh |
| `isPrimary` | boolean | ❌ | Ảnh chính của biến thể |
| `isMainImage` | boolean | ❌ | Ảnh đại diện sản phẩm |
| `sortOrder` | integer | ❌ | Thứ tự hiển thị |

**Response:**
```json
{
  "code": 200,
  "message": "Upload anh bien the thanh cong",
  "data": {
    "id": 1,
    "variantId": 1,
    "dialColor": "Black",
    "strapColor": "Black",
    "url": "https://res.cloudinary.com/your_cloud/image/upload/v1234/tawatch/watches/abc.jpg",
    "publicId": "tawatch/watches/abc",
    "altText": "Rolex Submariner Black mat truoc",
    "isPrimary": true,
    "isMainImage": true,
    "sortOrder": 0
  }
}
```

**Lỗi (upload thất bại):**
```json
{ "code": 9001, "message": "Upload anh that bai, vui long thu lai" }
```

---

### POST `/watch-variant-images` — Thêm ảnh cho biến thể (bằng URL có sẵn)

**Auth:** ADMIN

**Request Body:**
```json
{
  "variantId": 1,
  "url": "https://example.com/rolex-sub-black-1.jpg",
  "altText": "Rolex Submariner Black mat truoc",
  "isPrimary": true,
  "isMainImage": true,
  "sortOrder": 0
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Tao anh bien the thanh cong",
  "data": {
    "id": 1,
    "variantId": 1,
    "dialColor": "Black",
    "strapColor": "Black",
    "url": "https://example.com/rolex-sub-black-1.jpg",
    "publicId": null,
    "altText": "Rolex Submariner Black mat truoc",
    "isPrimary": true,
    "isMainImage": true,
    "sortOrder": 0
  }
}
```

---

### PUT `/watch-variant-images/{id}` — Cập nhật ảnh

**Auth:** ADMIN

**Request Body:**
```json
{
  "variantId": 1,
  "url": "https://example.com/rolex-sub-black-new.jpg",
  "altText": "Rolex Submariner Black anh moi",
  "isPrimary": false,
  "isMainImage": false,
  "sortOrder": 2
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Cap nhat anh bien the thanh cong",
  "data": {
    "id": 1,
    "variantId": 1,
    "dialColor": "Black",
    "strapColor": "Black",
    "url": "https://example.com/rolex-sub-black-new.jpg",
    "altText": "Rolex Submariner Black anh moi",
    "isPrimary": false,
    "isMainImage": false,
    "sortOrder": 2
  }
}
```

---

### DELETE `/watch-variant-images/{id}` — Xóa ảnh

**Auth:** ADMIN

**Response:**
```json
{
  "code": 200,
  "message": "Xoa anh bien the thanh cong"
}
```

---

### PATCH `/watch-variant-images/{id}/set-primary` — Đặt ảnh chính của biến thể

**Auth:** ADMIN

> Tự động bỏ `isPrimary` của ảnh cũ trong cùng biến thể, set `isPrimary = true` cho ảnh được chọn.

**Response:**
```json
{
  "code": 200,
  "message": "Dat anh chinh bien the thanh cong",
  "data": {
    "id": 2,
    "variantId": 1,
    "dialColor": "Black",
    "strapColor": "Black",
    "url": "https://example.com/rolex-sub-black-2.jpg",
    "altText": "Rolex Submariner Black mat nghieng",
    "isPrimary": true,
    "isMainImage": false,
    "sortOrder": 1
  }
}
```

**Lỗi (không tìm thấy):**
```json
{
  "code": 2013,
  "message": "Khong tim thay anh bien the dong ho"
}
```

---

### PATCH `/watch-variant-images/{id}/set-main-image` — Đặt ảnh đại diện sản phẩm

**Auth:** ADMIN

> Tự động bỏ `isMainImage` của ảnh cũ trong toàn bộ biến thể của **cùng sản phẩm**, set `isMainImage = true` cho ảnh được chọn.

**Response:**
```json
{
  "code": 200,
  "message": "Dat anh dai dien san pham thanh cong",
  "data": {
    "id": 1,
    "variantId": 1,
    "dialColor": "Black",
    "strapColor": "Black",
    "url": "https://example.com/rolex-sub-black-1.jpg",
    "altText": "Rolex Submariner Black mat truoc",
    "isPrimary": true,
    "isMainImage": true,
    "sortOrder": 0
  }
}
```

**Lỗi (không tìm thấy):**
```json
{
  "code": 2013,
  "message": "Khong tim thay anh bien the dong ho"
}
```

---

### POST `/watch-variant-images/batch` — Tạo nhiều ảnh cùng lúc

**Auth:** ADMIN

**Request Body:**
```json
{
  "variantId": 1,
  "images": [
    {
      "url": "https://example.com/rolex-sub-black-1.jpg",
      "altText": "Rolex Submariner Black mat truoc",
      "isPrimary": true,
      "isMainImage": true,
      "sortOrder": 0
    },
    {
      "url": "https://example.com/rolex-sub-black-2.jpg",
      "altText": "Rolex Submariner Black mat nghieng",
      "isPrimary": false,
      "isMainImage": false,
      "sortOrder": 1
    }
  ]
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Tao nhieu anh bien the thanh cong",
  "data": [
    {
      "id": 1,
      "variantId": 1,
      "dialColor": "Black",
      "strapColor": "Black",
      "url": "https://example.com/rolex-sub-black-1.jpg",
      "altText": "Rolex Submariner Black mat truoc",
      "isPrimary": true,
      "isMainImage": true,
      "sortOrder": 0
    },
    {
      "id": 2,
      "variantId": 1,
      "dialColor": "Black",
      "strapColor": "Black",
      "url": "https://example.com/rolex-sub-black-2.jpg",
      "altText": "Rolex Submariner Black mat nghieng",
      "isPrimary": false,
      "isMainImage": false,
      "sortOrder": 1
    }
  ]
}
```

---

### PATCH `/watch-variant-images/reorder` — Sắp xếp lại thứ tự ảnh

**Auth:** ADMIN

**Request Body:**
```json
{
  "orders": [
    { "id": 2, "sortOrder": 0 },
    { "id": 1, "sortOrder": 1 }
  ]
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Cap nhat thu tu anh bien the thanh cong",
  "data": [
    {
      "id": 2,
      "variantId": 1,
      "dialColor": "Black",
      "strapColor": "Black",
      "url": "https://example.com/rolex-sub-black-2.jpg",
      "altText": "Rolex Submariner Black mat nghieng",
      "isPrimary": false,
      "isMainImage": false,
      "sortOrder": 0
    },
    {
      "id": 1,
      "variantId": 1,
      "dialColor": "Black",
      "strapColor": "Black",
      "url": "https://example.com/rolex-sub-black-1.jpg",
      "altText": "Rolex Submariner Black mat truoc",
      "isPrimary": true,
      "isMainImage": true,
      "sortOrder": 1
    }
  ]
}
```

---

### DELETE `/watch-variant-images/variant/{variantId}` — Xóa tất cả ảnh của một biến thể

**Auth:** ADMIN

**Response:**
```json
{
  "code": 200,
  "message": "Xoa tat ca anh bien the thanh cong"
}
```

**Lỗi (không tìm thấy biến thể):**
```json
{
  "code": 2008,
  "message": "Khong tim thay bien the dong ho"
}
```

---

## 6. Watch Variants

> **Enum values:**
> - `strapMaterial`: `STAINLESS_STEEL` | `LEATHER` | `RUBBER` | `NYLON` | `GOLD` | `TITANIUM` | `CERAMIC` | `MESH`
>
> `dialColorId` / `strapColorId` là ID lấy từ API `/colors`. Response trả về đầy đủ id + tên + mã hex của màu.

### GET `/watch-variants?watchId={id}` — Lấy tất cả biến thể theo đồng hồ

**Auth:** Public

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "watchId": 1,
      "watchName": "Rolex Submariner",
      "dialColorId": 1,
      "dialColorName": "Black",
      "dialColorHex": "#000000",
      "strapColorId": 1,
      "strapColorName": "Black",
      "strapColorHex": "#000000",
      "strapMaterial": "STAINLESS_STEEL",
      "caseSizeMm": 41.00,
      "price": 250000000,
      "stockQuantity": 10,
      "isActive": true
    }
  ]
}
```

---

### GET `/watch-variants/{id}` — Lấy biến thể theo ID

**Auth:** Public

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "watchId": 1,
    "watchName": "Rolex Submariner",
    "dialColorId": 1,
    "dialColorName": "Black",
    "dialColorHex": "#000000",
    "strapColorId": 1,
    "strapColorName": "Black",
    "strapColorHex": "#000000",
    "strapMaterial": "STAINLESS_STEEL",
    "caseSizeMm": 41.00,
    "price": 250000000,
    "stockQuantity": 10,
    "isActive": true
  }
}
```

**Lỗi (không tìm thấy):**
```json
{
  "code": 2008,
  "message": "Khong tim thay bien the dong ho"
}
```

---

### POST `/watch-variants` — Tạo biến thể mới

**Auth:** ADMIN

**Request Body:**
```json
{
  "watchId": 1,
  "dialColorId": 1,
  "strapColorId": 1,
  "strapMaterial": "STAINLESS_STEEL",
  "caseSizeMm": 41.00,
  "price": 250000000,
  "stockQuantity": 10,
  "isActive": true
}
```

> `dialColorId`, `strapColorId`, `strapMaterial` là optional.

**Response:**
```json
{
  "code": 200,
  "message": "Tao bien the dong ho thanh cong",
  "data": {
    "id": 1,
    "watchId": 1,
    "watchName": "Rolex Submariner",
    "dialColorId": 1,
    "dialColorName": "Black",
    "dialColorHex": "#000000",
    "strapColorId": 1,
    "strapColorName": "Black",
    "strapColorHex": "#000000",
    "strapMaterial": "STAINLESS_STEEL",
    "caseSizeMm": 41.00,
    "price": 250000000,
    "stockQuantity": 10,
    "isActive": true
  }
}
```

**Lỗi (không tìm thấy màu):**
```json
{ "code": 11001, "message": "Khong tim thay mau sac" }
```

---

### PUT `/watch-variants/{id}` — Cập nhật biến thể

**Auth:** ADMIN

**Request Body:**
```json
{
  "watchId": 1,
  "dialColorId": 3,
  "strapColorId": 3,
  "strapMaterial": "LEATHER",
  "caseSizeMm": 41.00,
  "price": 260000000,
  "stockQuantity": 5,
  "isActive": true
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Cap nhat bien the dong ho thanh cong",
  "data": {
    "id": 1,
    "watchId": 1,
    "watchName": "Rolex Submariner",
    "dialColorId": 3,
    "dialColorName": "Blue",
    "dialColorHex": "#0000FF",
    "strapColorId": 3,
    "strapColorName": "Blue",
    "strapColorHex": "#0000FF",
    "strapMaterial": "LEATHER",
    "caseSizeMm": 41.00,
    "price": 260000000,
    "stockQuantity": 5,
    "isActive": true
  }
}
```

---

### DELETE `/watch-variants/{id}` — Xóa biến thể

**Auth:** ADMIN

**Response:**
```json
{
  "code": 200,
  "message": "Xoa bien the dong ho thanh cong"
}
```

---

## 7. Categories

### GET `/categories` — Lấy tất cả danh mục (flat list)

**Auth:** Public

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Dong Ho",
      "slug": "dong-ho",
      "parentId": null,
      "parentName": null,
      "children": []
    },
    {
      "id": 2,
      "name": "The Thao",
      "slug": "the-thao",
      "parentId": 1,
      "parentName": "Dong Ho",
      "children": []
    }
  ]
}
```

---

### GET `/categories/tree` — Lấy danh mục dạng cây

**Auth:** Public

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Dong Ho",
      "slug": "dong-ho",
      "parentId": null,
      "parentName": null,
      "children": [
        {
          "id": 2,
          "name": "The Thao",
          "slug": "the-thao",
          "parentId": 1,
          "parentName": "Dong Ho",
          "children": []
        },
        {
          "id": 3,
          "name": "Co Dien",
          "slug": "co-dien",
          "parentId": 1,
          "parentName": "Dong Ho",
          "children": []
        }
      ]
    }
  ]
}
```

---

### GET `/categories/{id}` — Lấy danh mục theo ID

**Auth:** Public

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 2,
    "name": "The Thao",
    "slug": "the-thao",
    "parentId": 1,
    "parentName": "Dong Ho",
    "children": []
  }
}
```

**Lỗi (không tìm thấy):**
```json
{
  "code": 2004,
  "message": "Khong tim thay danh muc"
}
```

---

### POST `/categories` — Tạo danh mục mới

**Auth:** ADMIN

**Request Body:**
```json
{
  "name": "The Thao",
  "slug": "the-thao",
  "parentId": 1
}
```
> `parentId` là optional. Nếu null thì tạo danh mục gốc.

**Response:**
```json
{
  "code": 200,
  "message": "Tao danh muc thanh cong",
  "data": {
    "id": 2,
    "name": "The Thao",
    "slug": "the-thao",
    "parentId": 1,
    "parentName": "Dong Ho",
    "children": []
  }
}
```

**Lỗi (tên trùng):**
```json
{
  "code": 2009,
  "message": "Ten danh muc da ton tai"
}
```

**Lỗi (slug trùng):**
```json
{
  "code": 2010,
  "message": "Slug danh muc da ton tai"
}
```

---

### GET `/categories/slug/{slug}` — Lấy danh mục theo slug

**Auth:** Public

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 2,
    "name": "The Thao",
    "slug": "the-thao",
    "parentId": 1,
    "parentName": "Dong Ho",
    "children": []
  }
}
```

**Lỗi (không tìm thấy):**
```json
{
  "code": 2004,
  "message": "Khong tim thay danh muc"
}
```

---

### PUT `/categories/{id}` — Cập nhật danh mục

**Auth:** ADMIN

**Request Body:**
```json
{
  "name": "The Thao & Ngoai Troi",
  "slug": "the-thao-ngoai-troi",
  "parentId": 1
}
```
> Gửi `parentId: null` để chuyển thành danh mục gốc.

**Response:**
```json
{
  "code": 200,
  "message": "Cap nhat danh muc thanh cong",
  "data": {
    "id": 2,
    "name": "The Thao & Ngoai Troi",
    "slug": "the-thao-ngoai-troi",
    "parentId": 1,
    "parentName": "Dong Ho",
    "children": []
  }
}
```

**Lỗi (vòng lặp cha-con):**
```json
{
  "code": 2011,
  "message": "Danh muc cha khong hop le (tao vong lap)"
}
```

---

### DELETE `/categories/{id}` — Xóa danh mục

**Auth:** ADMIN

**Response:**
```json
{
  "code": 200,
  "message": "Xoa danh muc thanh cong"
}
```

---

## 8. Segments

### GET `/segments` — Lấy tất cả phân khúc

**Auth:** Public

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Binh dan",
      "deliveryMethod": "EXTERNAL_SHIPPER"
    },
    {
      "id": 2,
      "name": "Trung cap",
      "deliveryMethod": "EXTERNAL_SHIPPER"
    },
    {
      "id": 3,
      "name": "Luxury",
      "deliveryMethod": "DIRECT_SHOP"
    }
  ]
}
```

---

### GET `/segments/slug/{slug}` — Lấy phân khúc theo slug

**Auth:** Public

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 3,
    "name": "Luxury",
    "deliveryMethod": "DIRECT_SHOP"
  }
}
```

**Lỗi (không tìm thấy):**
```json
{
  "code": 2005,
  "message": "Khong tim thay phan khuc"
}
```

---

### GET `/segments/{id}` — Lấy phân khúc theo ID

**Auth:** Public

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 3,
    "name": "Luxury",
    "deliveryMethod": "DIRECT_SHOP"
  }
}
```

**Lỗi (không tìm thấy):**
```json
{
  "code": 2005,
  "message": "Khong tim thay phan khuc"
}
```

---

### POST `/segments` — Tạo phân khúc mới

**Auth:** ADMIN

**Request Body:**
```json
{
  "name": "Sieu Luxury",
  "deliveryMethod": "DIRECT_SHOP"
}
```
> `deliveryMethod` chỉ nhận: `EXTERNAL_SHIPPER` hoặc `DIRECT_SHOP`

**Response:**
```json
{
  "code": 200,
  "message": "Tao phan khuc thanh cong",
  "data": {
    "id": 4,
    "name": "Sieu Luxury",
    "deliveryMethod": "DIRECT_SHOP"
  }
}
```

**Lỗi (tên trùng):**
```json
{
  "code": 2012,
  "message": "Ten phan khuc da ton tai"
}
```

---

### PUT `/segments/{id}` — Cập nhật phân khúc

**Auth:** ADMIN

**Request Body:**
```json
{
  "name": "Sieu Cap",
  "deliveryMethod": "DIRECT_SHOP"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Cap nhat phan khuc thanh cong",
  "data": {
    "id": 4,
    "name": "Sieu Cap",
    "deliveryMethod": "DIRECT_SHOP"
  }
}
```

---

### DELETE `/segments/{id}` — Xóa phân khúc

**Auth:** ADMIN

**Response:**
```json
{
  "code": 200,
  "message": "Xoa phan khuc thanh cong"
}
```

---

## 9. User Addresses

### GET `/users/{userId}/addresses` — Lấy tất cả địa chỉ của user

**Auth:** Authenticated

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "userId": 1,
      "recipientName": "Nguyen Van A",
      "phone": "0901234567",
      "addressDetail": "123 Nguyen Trai",
      "province": "Ho Chi Minh",
      "district": "Quan 1",
      "ward": "Phuong Ben Nghe",
      "isDefault": true
    },
    {
      "id": 2,
      "userId": 1,
      "recipientName": "Nguyen Van A",
      "phone": "0901234567",
      "addressDetail": "456 Le Van Sy",
      "province": "Ho Chi Minh",
      "district": "Quan 3",
      "ward": "Phuong 14",
      "isDefault": false
    }
  ]
}
```

---

### GET `/users/{userId}/addresses/{id}` — Lấy địa chỉ theo ID

**Auth:** Authenticated

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "userId": 1,
    "recipientName": "Nguyen Van A",
    "phone": "0901234567",
    "addressDetail": "123 Nguyen Trai",
    "province": "Ho Chi Minh",
    "district": "Quan 1",
    "ward": "Phuong Ben Nghe",
    "isDefault": true
  }
}
```

**Lỗi (không tìm thấy):**
```json
{
  "code": 3001,
  "message": "Khong tim thay dia chi"
}
```

---

### POST `/users/{userId}/addresses` — Tạo địa chỉ mới

**Auth:** Authenticated

**Request Body:**
```json
{
  "recipientName": "Nguyen Van A",
  "phone": "0901234567",
  "addressDetail": "123 Nguyen Trai",
  "province": "Ho Chi Minh",
  "district": "Quan 1",
  "ward": "Phuong Ben Nghe",
  "isDefault": true
}
```
> Nếu `isDefault: true`, tất cả địa chỉ cũ của user sẽ tự động bỏ `isDefault`.

**Response:**
```json
{
  "code": 201,
  "message": "Tao dia chi thanh cong",
  "data": {
    "id": 3,
    "userId": 1,
    "recipientName": "Nguyen Van A",
    "phone": "0901234567",
    "addressDetail": "123 Nguyen Trai",
    "province": "Ho Chi Minh",
    "district": "Quan 1",
    "ward": "Phuong Ben Nghe",
    "isDefault": true
  }
}
```

---

### PUT `/users/{userId}/addresses/{id}` — Cập nhật địa chỉ

**Auth:** Authenticated

**Request Body:**
```json
{
  "recipientName": "Nguyen Van A",
  "phone": "0909999999",
  "addressDetail": "789 CMT8",
  "province": "Ho Chi Minh",
  "district": "Quan 10",
  "ward": "Phuong 5",
  "isDefault": false
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Cap nhat dia chi thanh cong",
  "data": {
    "id": 1,
    "userId": 1,
    "recipientName": "Nguyen Van A",
    "phone": "0909999999",
    "addressDetail": "789 CMT8",
    "province": "Ho Chi Minh",
    "district": "Quan 10",
    "ward": "Phuong 5",
    "isDefault": false
  }
}
```

---

### PATCH `/users/{userId}/addresses/{id}/default` — Đặt làm địa chỉ mặc định

**Auth:** Authenticated

> Tự động bỏ `isDefault` của địa chỉ cũ, set `isDefault = true` cho địa chỉ được chọn.

**Response:**
```json
{
  "code": 200,
  "message": "Da dat lam dia chi mac dinh",
  "data": {
    "id": 2,
    "userId": 1,
    "recipientName": "Nguyen Van A",
    "phone": "0901234567",
    "addressDetail": "456 Le Van Sy",
    "province": "Ho Chi Minh",
    "district": "Quan 3",
    "ward": "Phuong 14",
    "isDefault": true
  }
}
```

---

### DELETE `/users/{userId}/addresses/{id}` — Xóa địa chỉ

**Auth:** Authenticated

**Response:**
```json
{
  "code": 200,
  "message": "Xoa dia chi thanh cong"
}
```

---

## 10. Cart

> **Lưu ý:**
> - User đã đăng nhập: dùng `GET /cart/user/{userId}` để lấy hoặc tạo cart.
> - Khách chưa đăng nhập (guest): dùng `GET /cart/session/{sessionId}` với sessionId từ client.
> - Mỗi lần thêm/sửa/xóa item đều trả về toàn bộ cart cập nhật.

### GET `/cart/{cartId}` — Lấy chi tiết cart

**Auth:** Public

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "userId": 1,
    "sessionId": null,
    "items": [
      {
        "id": 1,
        "cartId": 1,
        "watchVariantId": 3,
        "watchName": "Rolex Submariner",
        "dialColor": "Black",
        "strapColor": "Black",
        "imageUrl": "https://example.com/rolex-sub-black.jpg",
        "quantity": 2,
        "unitPrice": 250000000,
        "subtotal": 500000000
      }
    ],
    "totalAmount": 500000000,
    "createdAt": "2026-05-27T08:00:00Z",
    "updatedAt": "2026-05-27T09:00:00Z"
  }
}
```

---

### GET `/cart/user/{userId}` — Lấy hoặc tạo cart cho user đăng nhập

**Auth:** Authenticated

> Nếu user chưa có cart thì tự động tạo mới.

**Response:** _(giống GET `/cart/{cartId}`)_

---

### GET `/cart/session/{sessionId}` — Lấy hoặc tạo cart cho khách (guest)

**Auth:** Public

> Nếu chưa có cart với sessionId này thì tự động tạo mới.

**Response:** _(giống GET `/cart/{cartId}` nhưng `userId: null`, `sessionId: "abc123"`)_

---

### POST `/cart/{cartId}/items` — Thêm sản phẩm vào cart

**Auth:** Public

**Request Body:**
```json
{
  "watchVariantId": 3,
  "quantity": 2
}
```

**Response:**
```json
{
  "code": 201,
  "message": "Them san pham vao gio hang thanh cong",
  "data": {
    "id": 1,
    "userId": 1,
    "sessionId": null,
    "items": [
      {
        "id": 1,
        "cartId": 1,
        "watchVariantId": 3,
        "watchName": "Rolex Submariner",
        "dialColor": "Black",
        "strapColor": "Black",
        "imageUrl": "https://example.com/rolex-sub-black.jpg",
        "quantity": 2,
        "unitPrice": 250000000,
        "subtotal": 500000000
      }
    ],
    "totalAmount": 500000000,
    "createdAt": "2026-05-27T08:00:00Z",
    "updatedAt": "2026-05-27T09:00:00Z"
  }
}
```

**Lỗi (sản phẩm đã có trong giỏ):**
```json
{
  "code": 4003,
  "message": "San pham da ton tai trong gio hang"
}
```

**Lỗi (biến thể không hoạt động):**
```json
{
  "code": 4004,
  "message": "Bien the dong ho khong con hoat dong"
}
```

---

### PUT `/cart/{cartId}/items/{itemId}` — Cập nhật số lượng

**Auth:** Public

**Request Body:**
```json
{
  "watchVariantId": 3,
  "quantity": 5
}
```

**Response:** _(trả về cart đã cập nhật, giống POST items)_

---

### DELETE `/cart/{cartId}/items/{itemId}` — Xóa một sản phẩm

**Auth:** Public

**Response:**
```json
{
  "code": 200,
  "message": "Xoa san pham khoi gio hang thanh cong",
  "data": {
    "id": 1,
    "userId": 1,
    "sessionId": null,
    "items": [],
    "totalAmount": 0,
    "createdAt": "2026-05-27T08:00:00Z",
    "updatedAt": "2026-05-27T09:30:00Z"
  }
}
```

---

### DELETE `/cart/{cartId}/items` — Xóa toàn bộ sản phẩm (clear cart)

**Auth:** Public

**Response:**
```json
{
  "code": 200,
  "message": "Lam trong gio hang thanh cong",
  "data": {
    "id": 1,
    "userId": 1,
    "sessionId": null,
    "items": [],
    "totalAmount": 0,
    "createdAt": "2026-05-27T08:00:00Z",
    "updatedAt": "2026-05-27T09:30:00Z"
  }
}
```

---

### DELETE `/cart/{cartId}` — Xóa cart

**Auth:** Public

**Response:**
```json
{
  "code": 200,
  "message": "Xoa gio hang thanh cong"
}
```

**Lỗi (không tìm thấy):**
```json
{
  "code": 4001,
  "message": "Khong tim thay gio hang"
}
```

---

## 11. OTP

> **Luồng sử dụng:**
> ```
> [Xác thực email]   POST /otp/send (VERIFY_EMAIL) → POST /otp/verify (VERIFY_EMAIL)
> [Quên mật khẩu]   POST /otp/send (RESET_PASSWORD) → POST /otp/verify (RESET_PASSWORD) → POST /auth/reset-password
> ```
> - OTP hết hạn sau **5 phút**
> - Tối đa **5 lần** nhập sai → OTP bị khoá, phải gửi lại
> - Cooldown **1 phút** giữa các lần gửi
> - OTP là chuỗi **6 chữ số**

---

### POST `/otp/send` — Gửi mã OTP

**Auth:** Public

**Request Body:**
```json
{
  "email": "vana@gmail.com",
  "purpose": "VERIFY_EMAIL"
}
```

> `purpose`: `VERIFY_EMAIL` | `RESET_PASSWORD` | `CHANGE_EMAIL`

**Response:**
```json
{
  "code": 200,
  "message": "Gui OTP thanh cong",
  "data": {
    "email": "vana@gmail.com",
    "purpose": "VERIFY_EMAIL",
    "expiresAt": "2026-05-27T09:05:00Z",
    "otpCode": "482931"
  }
}
```

> ⚠️ **`otpCode` chỉ trả về khi `SHOW_OTP_IN_RESPONSE=true`** (môi trường dev/test). Set `SHOW_OTP_IN_RESPONSE=false` trên production để ẩn field này — OTP sẽ chỉ gửi qua email.

**Lỗi (gửi quá nhanh):**
```json
{ "code": 6006, "message": "Vui long doi 1 phut truoc khi gui lai OTP" }
```

**Lỗi (email đã verified — với purpose VERIFY_EMAIL):**
```json
{ "code": 1008, "message": "Email nay da duoc xac thuc" }
```

---

### POST `/otp/verify` — Xác thực mã OTP

**Auth:** Public

**Request Body:**
```json
{
  "email": "vana@gmail.com",
  "otpCode": "482931",
  "purpose": "VERIFY_EMAIL"
}
```

**Response (VERIFY_EMAIL):**
```json
{
  "code": 200,
  "message": "Xac thuc OTP thanh cong",
  "data": {
    "verified": true,
    "purpose": "VERIFY_EMAIL",
    "resetToken": null
  }
}
```

**Response (RESET_PASSWORD):**
```json
{
  "code": 200,
  "message": "Xac thuc OTP thanh cong",
  "data": {
    "verified": true,
    "purpose": "RESET_PASSWORD",
    "resetToken": "eyJhbGciOiJIUzI1NiJ9..."
  }
}
```

> `resetToken` có hiệu lực **15 phút** — dùng để gọi `POST /auth/reset-password`.

**Lỗi (không tìm thấy OTP):**
```json
{ "code": 6001, "message": "Khong tim thay OTP hop le, vui long yeu cau gui lai" }
```

**Lỗi (sai mã):**
```json
{ "code": 6004, "message": "Ma OTP khong chinh xac" }
```

**Lỗi (quá 5 lần sai):**
```json
{ "code": 6005, "message": "Da nhap sai qua 5 lan, vui long yeu cau OTP moi" }
```
    
---

### POST `/auth/reset-password` — Đặt lại mật khẩu

**Auth:** Public (dùng `resetToken` từ bước verify OTP)

**Request Body:**
```json
{
  "resetToken": "eyJhbGciOiJIUzI1NiJ9...",
  "newPassword": "newpass123"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Dat lai mat khau thanh cong"
}
```

**Lỗi (token không hợp lệ hoặc hết hạn):**
```json
{ "code": 6007, "message": "Token dat lai mat khau khong hop le hoac da het han" }
```

---

## 12. Orders

> **Luồng trạng thái hợp lệ:**
> ```
> PENDING → CONFIRMED → PROCESSING → SHIPPING → DELIVERED → REFUNDED
> PENDING → CANCELLED
> CONFIRMED → CANCELLED
> ```

### POST `/orders` — Đặt hàng mới

**Auth:** Public (user đăng nhập hoặc khách vãng lai)

**Request Body (user đăng nhập):**
```json
{
  "userId": 1,
  "addressId": 2,
  "paymentMethod": "COD",
  "deliveryMethod": "EXTERNAL_SHIPPER",
  "couponId": null,
  "note": "Giao gio hanh chinh",
  "items": [
    { "watchVariantId": 3, "quantity": 1 },
    { "watchVariantId": 7, "quantity": 2 }
  ]
}
```

**Request Body (khách vãng lai):**
```json
{
  "userId": null,
  "guestName": "Tran Thi B",
  "guestEmail": "thib@gmail.com",
  "guestPhone": "0909876543",
  "guestAddressDetail": "456 Le Van Sy, Q.3, TP.HCM",
  "paymentMethod": "VNPAY",
  "deliveryMethod": "EXTERNAL_SHIPPER",
  "couponId": null,
  "note": null,
  "items": [
    { "watchVariantId": 3, "quantity": 1 }
  ]
}
```

> `paymentMethod`: `COD` | `VNPAY` | `BANK_TRANSFER`
> `deliveryMethod`: `EXTERNAL_SHIPPER` | `DIRECT_SHOP`

**Response:**
```json
{
  "code": 201,
  "message": "Dat hang thanh cong",
  "data": {
    "id": 1,
    "orderCode": "ORD-20260527-7654321",
    "userId": 1,
    "guestName": null,
    "guestEmail": null,
    "guestPhone": null,
    "shippingAddressSnapshot": "{\"recipientName\":\"Nguyen Van A\",\"phone\":\"0901234567\",\"addressDetail\":\"123 Nguyen Trai\",\"ward\":\"Phuong Ben Nghe\",\"district\":\"Quan 1\",\"province\":\"Ho Chi Minh\"}",
    "subtotal": 250000000,
    "discountAmount": 0,
    "shippingFee": 0,
    "totalAmount": 250000000,
    "paymentMethod": "COD",
    "paymentStatus": "UNPAID",
    "orderStatus": "PENDING",
    "deliveryMethod": "EXTERNAL_SHIPPER",
    "trackingCode": null,
    "note": "Giao gio hanh chinh",
    "items": [
      {
        "id": 1,
        "watchVariantId": 3,
        "watchName": "Rolex Submariner",
        "dialColor": "Black",
        "strapColor": "Black",
        "imageUrl": "https://example.com/rolex-sub-black.jpg",
        "productSnapshot": {
          "watchId": 1,
          "variantId": 3,
          "sku": "RLX-SUB-001",
          "name": "Rolex Submariner",
          "brand": "Rolex",
          "dialColor": "Black",
          "strapColor": "Black",
          "strapMaterial": "STAINLESS_STEEL",
          "caseSizeMm": 41.00,
          "imageUrl": "https://example.com/rolex-sub-black.jpg",
          "price": 250000000
        },
        "quantity": 1,
        "unitPrice": 250000000,
        "totalPrice": 250000000
      }
    ],
    "createdAt": "2026-05-27T09:00:00Z",
    "updatedAt": "2026-05-27T09:00:00Z"
  }
}
```

**Lỗi (hết hàng):**
```json
{ "code": 5004, "message": "So luong ton kho khong du" }
```

**Lỗi (giỏ trống):**
```json
{ "code": 5003, "message": "Don hang phai co it nhat 1 san pham" }
```

---

### GET `/orders/{orderId}` — Xem chi tiết đơn hàng

**Auth:** Public

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "orderCode": "ORD-20260527-7654321",
    "userId": 1,
    "guestName": null,
    "guestEmail": null,
    "guestPhone": null,
    "shippingAddressSnapshot": "{...}",
    "subtotal": 250000000,
    "discountAmount": 0,
    "shippingFee": 0,
    "totalAmount": 250000000,
    "paymentMethod": "COD",
    "paymentStatus": "UNPAID",
    "orderStatus": "PENDING",
    "deliveryMethod": "EXTERNAL_SHIPPER",
    "trackingCode": null,
    "note": "Giao gio hanh chinh",
    "items": [ { "..." } ],
    "createdAt": "2026-05-27T09:00:00Z",
    "updatedAt": "2026-05-27T09:00:00Z"
  }
}
```

**Lỗi (không tìm thấy):**
```json
{ "code": 5001, "message": "Khong tim thay don hang" }
```

---

### GET `/orders/my/{userId}` — Lịch sử đơn hàng của user

**Auth:**        Authenticated

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "orderCode": "ORD-20260527-7654321",
      "userId": 1,
      "orderStatus": "DELIVERED",
      "paymentStatus": "PAID",
      "totalAmount": 250000000,
      "items": [ { "..." } ],
      "createdAt": "2026-05-27T09:00:00Z",
      "updatedAt": "2026-05-27T14:00:00Z"
    }
  ]
}
```

---

### GET `/orders?status=PENDING` — Lấy tất cả đơn hàng (Admin)

**Auth:** ADMIN / STAFF

> `status` là optional. Nếu không truyền thì trả về tất cả đơn.
> Giá trị hợp lệ: `PENDING` | `CONFIRMED` | `PROCESSING` | `SHIPPING` | `DELIVERED` | `CANCELLED` | `REFUNDED`

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "orderCode": "ORD-20260527-7654321",
      "userId": 1,
      "orderStatus": "PENDING",
      "paymentStatus": "UNPAID",
      "totalAmount": 250000000,
      "items": [ { "..." } ],
      "createdAt": "2026-05-27T09:00:00Z",
      "updatedAt": "2026-05-27T09:00:00Z"
    }
  ]
}
```

---

### PATCH `/orders/{orderId}/cancel` — Huỷ đơn hàng

**Auth:** Authenticated

> Chỉ huỷ được khi `orderStatus = PENDING`. Kho sẽ được hoàn lại tự động.

**Request Body:**
```json
{
  "userId": 1,
  "reason": "Toi muon doi san pham khac"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Huy don hang thanh cong",
  "data": {
    "id": 1,
    "orderCode": "ORD-20260527-7654321",
    "orderStatus": "CANCELLED",
    "updatedAt": "2026-05-27T10:00:00Z"
  }
}
```

**Lỗi (không thể huỷ):**
```json
{ "code": 5002, "message": "Don hang khong the huy o trang thai nay" }
```

---

### PATCH `/orders/{orderId}/status` — Cập nhật trạng thái đơn (Admin/Staff)

**Auth:** ADMIN / STAFF

**Request Body:**
```json
{
  "newStatus": "CONFIRMED",
  "changedByUserId": 5,
  "note": "Da xac nhan don hang"
}
```

> Luồng hợp lệ: `PENDING→CONFIRMED→PROCESSING→SHIPPING→DELIVERED→REFUNDED`
> Huỷ được từ: `PENDING` hoặc `CONFIRMED`

**Response:**
```json
{
  "code": 200,
  "message": "Cap nhat trang thai thanh cong",
  "data": {
    "id": 1,
    "orderCode": "ORD-20260527-7654321",
    "orderStatus": "CONFIRMED",
    "updatedAt": "2026-05-27T10:30:00Z"
  }
}
```

**Lỗi (chuyển trạng thái không hợp lệ):**
```json
{ "code": 5010, "message": "Chuyen doi trang thai don hang khong hop le" }
```

---

### PATCH `/orders/{orderId}/tracking` — Cập nhật mã vận đơn

**Auth:** ADMIN / STAFF

> Chỉ cập nhật được khi `orderStatus = SHIPPING`.

**Request Body:**
```json
{ "trackingCode": "VN123456789" }
```

**Response:**
```json
{
  "code": 200,
  "message": "Cap nhat ma van don thanh cong",
  "data": { "id": 1, "orderCode": "ORD-20260527-7654321", "trackingCode": "VN123456789", "orderStatus": "SHIPPING" }
}
```

**Lỗi:**
```json
{ "code": 8003, "message": "Chi cap nhat ma van don khi don hang o trang thai SHIPPING" }
```

---

### PATCH `/orders/{orderId}/assign-shipper` — Gán shipper cho đơn hàng

**Auth:** ADMIN / STAFF

> Chỉ gán được khi `orderStatus = CONFIRMED` hoặc `PROCESSING`.

**Request Body:**
```json
{ "shipperId": 2 }
```

**Response:**
```json
{
  "code": 200,
  "message": "Gan shipper thanh cong",
  "data": { "id": 1, "orderCode": "ORD-20260527-7654321", "orderStatus": "CONFIRMED" }
}
```

**Lỗi:**
```json
{ "code": 8004, "message": "Chi gan shipper khi don hang o trang thai CONFIRMED hoac PROCESSING" }
```

---

## 13. Payments

> **Luồng thanh toán:**
> ```
> [COD]           Đặt hàng → Giao hàng → Admin xác nhận → paymentStatus = PAID
> [VNPAY]         POST /payments/vnpay/initiate → redirect paymentUrl → VNPay callback → paymentStatus = PAID/FAILED
> [BANK_TRANSFER] POST /payments/bank-transfer/initiate → user chuyển khoản → Admin xác nhận → paymentStatus = PAID
> ```

### GET `/payments/order/{orderId}` — Lấy lịch sử giao dịch của đơn hàng

**Auth:** ADMIN / STAFF

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "orderId": 1,
      "orderCode": "ORD-20260527-7654321",
      "transactionCode": "VNPAY-ABC123DEF456GHI7",
      "gateway": "VNPAY",
      "amount": 250000000,
      "status": "COMPLETED",
      "responseData": { "resultCode": "0", "message": "Success" },
      "createdAt": "2026-05-27T09:05:00Z",
      "updatedAt": "2026-05-27T09:06:00Z"
    }
  ]
}
```

---

### POST `/payments/vnpay/initiate` — Khởi tạo thanh toán VNPay

**Auth:** Public

**Request Body:**
```json
{ "orderId": 1 }
```

> Chỉ dùng được khi `paymentMethod = VNPAY` và `paymentStatus != PAID`.

**Response:**
```json
{
  "code": 200,
  "message": "Khoi tao thanh toan VNPay thanh cong",
  "data": {
    "transactionId": 1,
    "orderCode": "ORD-20260527-7654321",
    "amount": 250000000,
    "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?txCode=VNPAY-ABC123",
    "status": "PENDING"
  }
}
```

**Lỗi (sai phương thức):**
```json
{ "code": 7004, "message": "Phuong thuc thanh toan khong hop le cho hanh dong nay" }
```

**Lỗi (đã thanh toán):**
```json
{ "code": 7002, "message": "Giao dich nay da duoc xu ly" }
```

---

### POST `/payments/vnpay/callback` — VNPay callback (gateway gọi vào)

**Auth:** Public (VNPay server gọi)

**Request Body** _(do VNPay gửi)_:
```json
{
  "transactionCode": "VNPAY-ABC123DEF456GHI7",
  "resultCode": "0",
  "message": "Success",
  "amount": 250000000
}
```

> `resultCode = "0"` → thanh toán thành công, các giá trị khác → thất bại.

**Response:**
```json
{
  "code": 200,
  "message": "Xu ly callback VNPay thanh cong",
  "data": {
    "id": 1,
    "orderId": 1,
    "orderCode": "ORD-20260527-7654321",
    "transactionCode": "VNPAY-ABC123DEF456GHI7",
    "gateway": "VNPAY",
    "amount": 250000000,
    "status": "COMPLETED",
    "createdAt": "2026-05-27T09:05:00Z",
    "updatedAt": "2026-05-27T09:06:00Z"
  }
}
```

---

### POST `/payments/bank-transfer/initiate` — Lấy thông tin chuyển khoản

**Auth:** Public

**Request Body:**
```json
{ "orderId": 1 }
```

> Chỉ dùng được khi `paymentMethod = BANK_TRANSFER` và `paymentStatus != PAID`.

**Response:**
```json
{
  "code": 200,
  "message": "Lay thong tin chuyen khoan thanh cong",
  "data": {
    "transactionId": 2,
    "orderCode": "ORD-20260527-7654321",
    "amount": 250000000,
    "bankName": "Vietcombank",
    "accountNumber": "1234567890",
    "accountName": "CONG TY TAWATCH",
    "transferContent": "TAWATCH ORD-20260527-7654321",
    "status": "PENDING"
  }
}
```

---

### PATCH `/payments/{transactionId}/confirm` — Admin xác nhận đã nhận tiền

**Auth:** ADMIN / STAFF

> Dùng cho đơn `BANK_TRANSFER`. Sau khi xác nhận, `paymentStatus` của đơn hàng chuyển sang `PAID`.

**Request Body:**
```json
{
  "transactionCode": "FT26148123456789",
  "note": "Da nhan chuyen khoan luc 10:30"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Xac nhan thanh toan thanh cong",
  "data": {
    "id": 2,
    "orderId": 1,
    "orderCode": "ORD-20260527-7654321",
    "transactionCode": "BT-ABC123DEF456",
    "gateway": "BANK_TRANSFER",
    "amount": 250000000,
    "status": "COMPLETED",
    "createdAt": "2026-05-27T09:10:00Z",
    "updatedAt": "2026-05-27T10:00:00Z"
  }
}
```

**Lỗi (không phải BANK_TRANSFER):**
```json
{ "code": 7004, "message": "Phuong thuc thanh toan khong hop le cho hanh dong nay" }
```

**Lỗi (đã xử lý rồi):**
```json
{ "code": 7002, "message": "Giao dich nay da duoc xu ly" }
```

---

## 14. Shippers

> Quản lý danh sách đơn vị vận chuyển. Dùng để gán shipper vào đơn hàng `DIRECT_SHOP`.

### GET `/shippers` — Lấy tất cả shipper

**Auth:** ADMIN / STAFF

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    { "id": 1, "name": "GHN", "apiEndpoint": "https://api.ghn.vn", "isActive": true },
    { "id": 2, "name": "GHTK", "apiEndpoint": "https://api.ghtk.vn", "isActive": true }
  ]
}
```

---

### GET `/shippers/active` — Lấy shipper đang hoạt động

**Auth:** ADMIN / STAFF

**Response:** _(giống GET /shippers nhưng chỉ có `isActive: true`)_

---

### GET `/shippers/{id}` — Lấy shipper theo ID

**Auth:** ADMIN / STAFF

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": { "id": 1, "name": "GHN", "apiEndpoint": "https://api.ghn.vn", "isActive": true }
}
```

**Lỗi:**
```json
{ "code": 8001, "message": "Khong tim thay shipper" }
```

---

### POST `/shippers` — Tạo shipper mới

**Auth:** ADMIN

**Request Body:**
```json
{ "name": "GHN", "apiEndpoint": "https://api.ghn.vn", "apiKey": "secret-key", "isActive": true }
```

**Response:**
```json
{
  "code": 200,
  "message": "Tao shipper thanh cong",
  "data": { "id": 1, "name": "GHN", "apiEndpoint": "https://api.ghn.vn", "isActive": true }
}
```

**Lỗi (tên trùng):**
```json
{ "code": 8002, "message": "Ten shipper da ton tai" }
```

---

### PUT `/shippers/{id}` — Cập nhật shipper

**Auth:** ADMIN

**Request Body:** _(giống POST)_

**Response:**
```json
{
  "code": 200,
  "message": "Cap nhat shipper thanh cong",
  "data": { "id": 1, "name": "GHN Express", "apiEndpoint": "https://api.ghn.vn/v2", "isActive": true }
}
```

---

### DELETE `/shippers/{id}` — Xóa shipper

**Auth:** ADMIN

**Response:**
```json
{ "code": 200, "message": "Xoa shipper thanh cong" }
```

---

## 15. Colors

> Danh sách màu sắc chuẩn dùng để tham chiếu khi tạo `WatchVariant` (dialColor, strapColor). Mỗi màu có mã hex để frontend render color swatch.

### GET `/colors` — Lấy tất cả màu sắc

**Auth:** Public

**Query Params:** `isActive` (optional, boolean) — `true` chỉ trả màu đang dùng

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Black",
      "hexCode": "#000000",
      "isActive": true,
      "createdAt": "2026-06-01T07:00:00Z",
      "updatedAt": "2026-06-01T07:00:00Z"
    },
    {
      "id": 2,
      "name": "Silver",
      "hexCode": "#C0C0C0",
      "isActive": true,
      "createdAt": "2026-06-01T07:00:00Z",
      "updatedAt": "2026-06-01T07:00:00Z"
    }
  ]
}
```

---

### GET `/colors/{id}` — Lấy màu theo ID

**Auth:** Public

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Black",
    "hexCode": "#000000",
    "isActive": true,
    "createdAt": "2026-06-01T07:00:00Z",
    "updatedAt": "2026-06-01T07:00:00Z"
  }
}
```

**Lỗi (không tìm thấy):**
```json
{ "code": 11001, "message": "Khong tim thay mau sac" }
```

---

### POST `/colors` — Tạo màu mới

**Auth:** ADMIN

**Request Body:**
```json
{
  "name": "Rose Gold",
  "hexCode": "#B76E79",
  "isActive": true
}
```

> `hexCode` phải có định dạng `#RRGGBB` hoặc `#RGB`. `hexCode` và `isActive` là optional.

**Response:**
```json
{
  "code": 200,
  "message": "Tao mau thanh cong",
  "data": {
    "id": 3,
    "name": "Rose Gold",
    "hexCode": "#B76E79",
    "isActive": true,
    "createdAt": "2026-06-13T08:00:00Z",
    "updatedAt": "2026-06-13T08:00:00Z"
  }
}
```

**Lỗi (tên trùng):**
```json
{ "code": 11002, "message": "Ten mau sac da ton tai" }
```

---

### PUT `/colors/{id}` — Cập nhật màu

**Auth:** ADMIN

**Request Body:** _(giống POST)_

**Response:**
```json
{
  "code": 200,
  "message": "Cap nhat mau thanh cong",
  "data": {
    "id": 3,
    "name": "Rose Gold",
    "hexCode": "#C07B83",
    "isActive": true,
    "createdAt": "2026-06-13T08:00:00Z",
    "updatedAt": "2026-06-13T09:00:00Z"
  }
}
```

---

### DELETE `/colors/{id}` — Xóa màu

**Auth:** ADMIN

**Response:**
```json
{ "code": 200, "message": "Xoa mau thanh cong" }
```

---

## 16. Promotions

> Quản lý chương trình khuyến mãi. Mỗi promotion có thể sinh ra nhiều coupon code.
> - `promoType`: `PRODUCT` | `ORDER` | `CATEGORY` | `BRAND`
> - `discountType`: `PERCENTAGE` | `FIXED_AMOUNT`

### GET `/promotions` — Lấy tất cả chương trình khuyến mãi

**Auth:** ADMIN

**Query Params:** `isActive` (optional, boolean)

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Khuyen mai Tet 2026",
      "promoType": "ORDER",
      "discountType": "PERCENTAGE",
      "discountValue": 10.00,
      "minOrderValue": 5000000,
      "maxDiscountAmount": 2000000,
      "maxUses": 100,
      "usedCount": 15,
      "startDate": "2026-01-25T00:00:00Z",
      "endDate": "2026-02-10T23:59:59Z",
      "isActive": true,
      "createdAt": "2026-01-20T07:00:00Z"
    }
  ]
}
```

---

### GET `/promotions/{id}` — Lấy chương trình khuyến mãi theo ID

**Auth:** ADMIN

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Khuyen mai Tet 2026",
    "promoType": "ORDER",
    "discountType": "PERCENTAGE",
    "discountValue": 10.00,
    "minOrderValue": 5000000,
    "maxDiscountAmount": 2000000,
    "maxUses": 100,
    "usedCount": 15,
    "startDate": "2026-01-25T00:00:00Z",
    "endDate": "2026-02-10T23:59:59Z",
    "isActive": true,
    "createdAt": "2026-01-20T07:00:00Z"
  }
}
```

---

### POST `/promotions` — Tạo chương trình khuyến mãi mới

**Auth:** ADMIN

**Request Body:**
```json
{
  "name": "Khuyen mai Tet 2026",
  "promoType": "ORDER",
  "discountType": "PERCENTAGE",
  "discountValue": 10.00,
  "minOrderValue": 5000000,
  "maxDiscountAmount": 2000000,
  "maxUses": 100,
  "startDate": "2026-01-25T00:00:00Z",
  "endDate": "2026-02-10T23:59:59Z",
  "isActive": true
}
```

> `minOrderValue`, `maxDiscountAmount`, `maxUses` là optional.

**Response:**
```json
{
  "code": 200,
  "message": "Tao chuong trinh khuyen mai thanh cong",
  "data": {
    "id": 1,
    "name": "Khuyen mai Tet 2026",
    "promoType": "ORDER",
    "discountType": "PERCENTAGE",
    "discountValue": 10.00,
    "minOrderValue": 5000000,
    "maxDiscountAmount": 2000000,
    "maxUses": 100,
    "usedCount": 0,
    "startDate": "2026-01-25T00:00:00Z",
    "endDate": "2026-02-10T23:59:59Z",
    "isActive": true,
    "createdAt": "2026-01-20T07:00:00Z"
  }
}
```

---

### PUT `/promotions/{id}` — Cập nhật chương trình khuyến mãi

**Auth:** ADMIN

**Request Body:** _(giống POST)_

**Response:**
```json
{
  "code": 200,
  "message": "Cap nhat chuong trinh khuyen mai thanh cong",
  "data": { "...promotion object..." }
}
```

---

### DELETE `/promotions/{id}` — Xóa chương trình khuyến mãi

**Auth:** ADMIN

**Response:**
```json
{
  "code": 200,
  "message": "Xoa chuong trinh khuyen mai thanh cong"
}
```

---

## 16. Coupons

> Mỗi coupon thuộc về 1 promotion. User dùng `code` để áp dụng khi đặt hàng.

### GET `/coupons` — Lấy tất cả coupon

**Auth:** ADMIN

**Query Params:**
- `promotionId` (optional, integer) — lọc theo promotion
- `isUsed` (optional, boolean) — lọc theo trạng thái đã dùng

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "code": "TET2026-ABCD",
      "promotionId": 1,
      "promotionName": "Khuyen mai Tet 2026",
      "userId": null,
      "isUsed": false,
      "usedAt": null,
      "expiresAt": "2026-02-10T23:59:59Z"
    }
  ]
}
```

---

### GET `/coupons/{id}` — Lấy coupon theo ID

**Auth:** ADMIN

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "code": "TET2026-ABCD",
    "promotionId": 1,
    "promotionName": "Khuyen mai Tet 2026",
    "userId": null,
    "isUsed": false,
    "usedAt": null,
    "expiresAt": "2026-02-10T23:59:59Z"
  }
}
```

---

### POST `/coupons` — Tạo coupon mới

**Auth:** ADMIN

**Request Body:**
```json
{
  "promotionId": 1,
  "code": "TET2026-ABCD",
  "userId": null,
  "expiresAt": "2026-02-10T23:59:59Z"
}
```

> `userId` để gán coupon cho 1 user cụ thể (optional). `expiresAt` là optional (mặc định theo promotion).

**Response:**
```json
{
  "code": 200,
  "message": "Tao coupon thanh cong",
  "data": {
    "id": 1,
    "code": "TET2026-ABCD",
    "promotionId": 1,
    "promotionName": "Khuyen mai Tet 2026",
    "userId": null,
    "isUsed": false,
    "usedAt": null,
    "expiresAt": "2026-02-10T23:59:59Z"
  }
}
```

---

### DELETE `/coupons/{id}` — Xóa coupon

**Auth:** ADMIN

**Response:**
```json
{
  "code": 200,
  "message": "Xoa coupon thanh cong"
}
```

---

### POST `/coupons/validate` — Kiểm tra coupon hợp lệ

**Auth:** Public

> Dùng trước khi đặt hàng để kiểm tra coupon và tính số tiền giảm.

**Request Body:**
```json
{
  "code": "TET2026-ABCD",
  "subtotal": 10000000
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Coupon hop le",
  "data": {
    "couponId": 1,
    "code": "TET2026-ABCD",
    "promotionName": "Khuyen mai Tet 2026",
    "discountAmount": 1000000,
    "finalAmount": 9000000
  }
}
```

**Lỗi (không tìm thấy):**
```json
{ "code": 5005, "message": "Khong tim thay coupon" }
```

**Lỗi (đã sử dụng):**
```json
{ "code": 5006, "message": "Coupon nay da duoc su dung" }
```

**Lỗi (hết hạn):**
```json
{ "code": 5007, "message": "Coupon da het han" }
```

**Lỗi (không hoạt động):**
```json
{ "code": 5008, "message": "Coupon khong con hoat dong" }
```

**Lỗi (chưa đủ giá trị đơn hàng):**
```json
{ "code": 5009, "message": "Gia tri don hang chua dat muc toi thieu de ap dung coupon" }
```

---

## 17. Reviews

> User chỉ có thể review sau khi đơn hàng đã `DELIVERED`. Mỗi (user, watch, order) chỉ được review 1 lần. Review cần admin duyệt trước khi hiển thị công khai.

### GET `/reviews` — Lấy tất cả review (Admin)

**Auth:** ADMIN

**Query Params:** `isApproved` (optional, boolean) — lọc theo trạng thái duyệt

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "userId": 1,
      "userFullName": "Nguyen Van A",
      "watchId": 1,
      "watchName": "Rolex Submariner",
      "orderId": 5,
      "orderCode": "ORD-20260527-7654321",
      "rating": 5,
      "comment": "San pham rat tot, giao hang nhanh",
      "isApproved": false,
      "createdAt": "2026-06-01T10:00:00Z"
    }
  ]
}
```

---

### GET `/reviews/watch/{watchId}` — Lấy review theo đồng hồ

**Auth:** Public

**Query Params:** `isApproved` (optional, boolean, mặc định `true`)

> Mặc định chỉ trả về review đã được duyệt. Admin có thể truyền `isApproved=false` để xem review chờ duyệt.

**Response:** _(giống GET `/reviews`)_

---

### GET `/reviews/user/{userId}` — Lấy review của user

**Auth:** Authenticated

**Response:** _(giống GET `/reviews`)_

---

### GET `/reviews/{id}` — Lấy review theo ID

**Auth:** ADMIN

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "userId": 1,
    "userFullName": "Nguyen Van A",
    "watchId": 1,
    "watchName": "Rolex Submariner",
    "orderId": 5,
    "orderCode": "ORD-20260527-7654321",
    "rating": 5,
    "comment": "San pham rat tot, giao hang nhanh",
    "isApproved": false,
    "createdAt": "2026-06-01T10:00:00Z"
  }
}
```

**Lỗi (không tìm thấy):**
```json
{ "code": 10001, "message": "Khong tim thay danh gia" }
```

---

### POST `/reviews` — Tạo review mới

**Auth:** Authenticated

**Request Body:**
```json
{
  "userId": 1,
  "watchId": 1,
  "orderId": 5,
  "rating": 5,
  "comment": "San pham rat tot, giao hang nhanh"
}
```

> `rating`: từ 1 đến 5. `comment` là optional.

**Response:**
```json
{
  "code": 201,
  "message": "Tao danh gia thanh cong, dang cho duyet",
  "data": {
    "id": 1,
    "userId": 1,
    "userFullName": "Nguyen Van A",
    "watchId": 1,
    "watchName": "Rolex Submariner",
    "orderId": 5,
    "orderCode": "ORD-20260527-7654321",
    "rating": 5,
    "comment": "San pham rat tot, giao hang nhanh",
    "isApproved": false,
    "createdAt": "2026-06-01T10:00:00Z"
  }
}
```

**Lỗi (đơn hàng chưa giao):**
```json
{ "code": 10003, "message": "Chi co the danh gia khi don hang da giao thanh cong" }
```

**Lỗi (đơn hàng không thuộc user):**
```json
{ "code": 10004, "message": "Don hang nay khong thuoc ve ban" }
```

**Lỗi (sản phẩm không có trong đơn):**
```json
{ "code": 10005, "message": "San pham nay khong co trong don hang" }
```

**Lỗi (đã review rồi):**
```json
{ "code": 10002, "message": "Ban da danh gia san pham nay cho don hang nay" }
```

---

### PATCH `/reviews/{id}/approve` — Admin duyệt review

**Auth:** ADMIN

**Response:**
```json
{
  "code": 200,
  "message": "Duyet danh gia thanh cong",
  "data": {
    "id": 1,
    "userId": 1,
    "userFullName": "Nguyen Van A",
    "watchId": 1,
    "watchName": "Rolex Submariner",
    "orderId": 5,
    "orderCode": "ORD-20260527-7654321",
    "rating": 5,
    "comment": "San pham rat tot, giao hang nhanh",
    "isApproved": true,
    "createdAt": "2026-06-01T10:00:00Z"
  }
}
```

---

### DELETE `/reviews/{id}` — Admin xóa review

**Auth:** ADMIN

**Response:**
```json
{ "code": 200, "message": "Xoa danh gia thanh cong" }
```

---

## Error Codes

| Code | Ý nghĩa |
|------|---------|
| 1001 | Không tìm thấy user |
| 1002 | Không tìm thấy email |
| 1003 | User đã tồn tại |
| 1004 | Mật khẩu phải có ít nhất 6 ký tự |
| 1005 | Email không đúng định dạng |
| 1006 | Sai mật khẩu |
| 1007 | Token không hợp lệ hoặc đã hết hạn |
| 1008 | Email này đã được xác thực |
| 2001 | Không tìm thấy đồng hồ |
| 2002 | Mã SKU đã tồn tại |
| 2003 | Không tìm thấy thương hiệu |
| 2004 | Không tìm thấy danh mục |
| 2005 | Không tìm thấy phân khúc |
| 2006 | Tên thương hiệu đã tồn tại |
| 2008 | Không tìm thấy biến thể đồng hồ |
| 2009 | Tên danh mục đã tồn tại |
| 2010 | Slug danh mục đã tồn tại |
| 2011 | Danh mục cha không hợp lệ (tạo vòng lặp) |
| 2012 | Tên phân khúc đã tồn tại |
| 2013 | Không tìm thấy ảnh biến thể đồng hồ |
| 3001 | Không tìm thấy địa chỉ |
| 3002 | Địa chỉ không thuộc về user này |
| 4001 | Không tìm thấy giỏ hàng |
| 4002 | Không tìm thấy sản phẩm trong giỏ hàng |
| 4003 | Sản phẩm đã tồn tại trong giỏ hàng |
| 4004 | Biến thể đồng hồ không còn hoạt động |
| 4005 | Số lượng phải lớn hơn 0 |
| 5001 | Không tìm thấy đơn hàng |
| 5002 | Đơn hàng không thể huỷ ở trạng thái này |
| 5003 | Đơn hàng phải có ít nhất 1 sản phẩm |
| 5004 | Số lượng tồn kho không đủ |
| 5005 | Không tìm thấy coupon |
| 5006 | Coupon này đã được sử dụng |
| 5007 | Coupon đã hết hạn |
| 5008 | Coupon không còn hoạt động |
| 5009 | Giá trị đơn hàng chưa đạt mức tối thiểu để áp dụng coupon |
| 5010 | Chuyển đổi trạng thái đơn hàng không hợp lệ |
| 6001 | Không tìm thấy OTP hợp lệ, vui lòng yêu cầu gửi lại |
| 6002 | OTP đã hết hạn |
| 6003 | OTP này đã được sử dụng |
| 6004 | Mã OTP không chính xác |
| 6005 | Đã nhập sai quá 5 lần, vui lòng yêu cầu OTP mới |
| 6006 | Vui lòng đợi 1 phút trước khi gửi lại OTP |
| 6007 | Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn |
| 7001 | Không tìm thấy giao dịch thanh toán |
| 7002 | Giao dịch này đã được xử lý |
| 7003 | Giao dịch không thuộc đơn hàng này |
| 7004 | Phương thức thanh toán không hợp lệ cho hành động này |
| 8001 | Không tìm thấy shipper |
| 8002 | Tên shipper đã tồn tại |
| 8003 | Chỉ cập nhật mã vận đơn khi đơn hàng ở trạng thái SHIPPING |
| 8004 | Chỉ gán shipper khi đơn hàng ở trạng thái CONFIRMED hoặc PROCESSING |
| 9001 | Upload ảnh thất bại, vui lòng thử lại |
| 9002 | Không tìm thấy chương trình khuyến mãi |
| 9003 | Mã coupon này đã tồn tại |
| 11001 | Không tìm thấy màu sắc |
| 11002 | Tên màu sắc đã tồn tại |
| 10001 | Không tìm thấy đánh giá |
| 10002 | Bạn đã đánh giá sản phẩm này cho đơn hàng này |
| 10003 | Chỉ có thể đánh giá khi đơn hàng đã giao thành công |
| 10004 | Đơn hàng này không thuộc về bạn |
| 10005 | Sản phẩm này không có trong đơn hàng |
| 10006 | Điểm đánh giá phải từ 1 đến 5 |
