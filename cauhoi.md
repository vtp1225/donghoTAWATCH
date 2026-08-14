### A. Tổng quan hệ thống

**1. Hệ thống của em giải quyết bài toán gì?**
Hệ thống của em giải quyết bài toán số hóa toàn diện quy trình kinh doanh đồng hồ trực tuyến. Thay vì chỉ có chức năng mua bán cơ bản, hệ thống xử lý chuyên sâu từ khâu quản lý thuộc tính sản phẩm (thương hiệu, màu sắc, phân khúc), quản lý tồn kho chặt chẽ qua phiếu nhập, cho đến tối ưu trải nghiệm giỏ hàng, thanh toán trực tuyến (VNPay) và xét duyệt đánh giá.

**2. Đối tượng sử dụng hệ thống là ai?**
Hệ thống phục vụ 3 nhóm đối tượng:
- **Khách hàng (bao gồm cả khách vãng lai và đã đăng nhập):** Tìm kiếm, xem chi tiết, thêm giỏ hàng, đặt hàng và thanh toán.
- **Nhân viên (Staff):** Xử lý đơn hàng, nhập/xuất kho, và kiểm duyệt các đánh giá của khách hàng.
- **Quản trị viên (Admin):** Quản lý toàn bộ danh mục, thương hiệu, mã giảm giá, phân quyền nhân sự và xem thống kê doanh thu.

**3. Tại sao chọn đề tài bán đồng hồ thay vì lĩnh vực khác?**
Bán đồng hồ có tính đặc thù cao hơn các mặt hàng thông thường. Một chiếc đồng hồ có nhiều biến thể (về màu sắc mặt, chất liệu dây), hình ảnh đa dạng và giá trị cao. Chọn đề tài này giúp em thiết kế cấu trúc CSDL phức tạp hơn (tách sản phẩm và biến thể), đồng thời áp dụng được quy trình thanh toán an toàn và quản lý kho hàng nghiêm ngặt.

**4. Điểm nổi bật của hệ thống so với các website bán hàng thông thường?**
- Cho phép khách chưa đăng nhập (khách vãng lai) vẫn có thể dùng giỏ hàng, sau đó tự động gộp giỏ hàng khi họ đăng nhập.
- Áp dụng lưu vết mọi lịch sử trạng thái của đơn hàng và phiếu nhập kho để đảm bảo minh bạch luồng hàng hóa.
- Tích hợp chuẩn API thanh toán tự động qua VNPay.

**5. Nếu mở rộng cho nhiều loại sản phẩm khác thì hệ thống có dùng lại được không?**
Phần cốt lõi như Authentication (JWT), Giỏ hàng, Đặt hàng, Thanh toán và Kho hàng hoàn toàn dùng lại được. Tuy nhiên, ở phần sản phẩm, vì em đang thiết kế tối ưu riêng cho đặc thù đồng hồ (các bảng `Watch`, `WatchVariant`), nếu muốn bán điện thoại hay quần áo, em sẽ cần cấu trúc lại bảng sản phẩm thành dạng động (Dynamic Attributes - EAV) để linh hoạt hơn.

---

### B. Đăng ký - Đăng nhập

**6. Tại sao cần xác thực email khi đăng ký?**
Để đảm bảo tài khoản là của người dùng thật (chống bot tạo tài khoản rác), và quan trọng nhất là làm cơ sở an toàn để gửi các hóa đơn thanh toán, trạng thái đơn hàng, cũng như lấy lại mật khẩu sau này.

**7. Nếu người dùng không xác thực email thì sao?**
Tài khoản sẽ được tạo nhưng ở trạng thái "Chưa kích hoạt". Họ vẫn lưu thông tin trong hệ thống nhưng sẽ bị chặn quyền ở các tính năng quan trọng như đặt hàng hay đánh giá, cho đến khi họ nhập mã OTP kích hoạt.

**8. Tại sao dùng JWT thay vì Session?**
Vì hệ thống của em thiết kế theo chuẩn RESTful API, Frontend (React) và Backend hoàn toàn độc lập. Dùng JWT (Stateless) giúp Backend không cần lưu trữ trạng thái đăng nhập trong bộ nhớ, tiết kiệm tài nguyên máy chủ và rất dễ mở rộng (scale) sau này nếu hệ thống có nhiều server.

**9. Nếu token bị đánh cắp thì sao?**
Để giảm thiểu rủi ro, em cấu hình thời gian sống của Access Token rất ngắn (khoảng 15-30 phút). Nếu kẻ gian lấy được, họ chỉ dùng được một thời gian ngắn. Sau đó hệ thống bắt buộc dùng Refresh Token (được lưu trữ bảo mật hơn) để cấp lại token mới.

**10. Quy trình quên mật khẩu hoạt động như thế nào?**
Khi người dùng báo quên mật khẩu, hệ thống sinh ra một mã OTP có hạn sử dụng ngắn và gửi vào email. Người dùng nhập mã này lên web, nếu khớp, hệ thống mới cho phép họ tạo mật khẩu mới và lưu lại (đã được mã hóa).

---

### C. Quản lý sản phẩm

**11. Tại sao sản phẩm có nhiều ảnh?**
Đồng hồ là mặt hàng thời trang, khách hàng cần xem chi tiết từ nhiều góc độ, mặt đồng hồ, dây đeo. Vì vậy em thiết kế 1 bảng hình ảnh riêng (`WatchVariantImage`) liên kết với từng biến thể màu sắc để lưu trữ nhiều ảnh.

**12. Nếu ảnh trên Cloudinary bị xóa thì sao?**
Ở Frontend (React), em đã chuẩn bị sẵn cơ chế: nếu link ảnh bị lỗi 404 (không tải được), giao diện sẽ tự động hiển thị một "Ảnh mặc định" (Placeholder) để không làm vỡ layout của website.

**13. Tại sao không lưu ảnh trực tiếp trong database?**
Lưu file ảnh trực tiếp dưới dạng nhị phân sẽ làm Database phình to cực kỳ nhanh, làm chậm tốc độ truy vấn và backup. Dùng dịch vụ chuyên dụng như Cloudinary giúp tải ảnh nhanh hơn rất nhiều nhờ hệ thống CDN của họ.

**14. Nếu Admin xóa một thương hiệu thì các sản phẩm thuộc thương hiệu đó thế nào?**
Hệ thống sẽ không cho phép "xóa cứng" (lệnh DELETE). Nếu thương hiệu đang có sản phẩm, em dùng cơ chế "Xóa mềm" (Soft Delete) - tức là chuyển trạng thái thương hiệu đó thành "Ẩn/Ngừng kinh doanh". Các sản phẩm cũ vẫn giữ nguyên dữ liệu nhưng không hiển thị cho khách hàng mua nữa.

**15. Tại sao tách Brand và Product thành hai bảng?**
Để chuẩn hóa cơ sở dữ liệu. Nếu đổi tên hoặc đổi Logo thương hiệu, em chỉ cần cập nhật ở đúng một nơi trong bảng `Brand`, toàn bộ hàng nghìn sản phẩm thuộc thương hiệu đó sẽ tự động hiển thị theo thông tin mới.

**16. Nếu sản phẩm hết hàng thì giao diện xử lý như thế nào?**
Backend sẽ trả về số lượng kho bằng 0. Khi đó, Frontend sẽ làm mờ nút "Thêm vào giỏ hàng", chặn không cho click, đồng thời dán nhãn "Hết hàng" (Out of Stock) lên ảnh sản phẩm.

**17. Nếu một sản phẩm có 1000 đánh giá thì hiển thị như thế nào để tránh chậm?**
Em sử dụng cơ chế Phân trang (Pagination). Mỗi lần khách lướt xuống hoặc bấm sang trang, Backend mới lấy 10-20 đánh giá lên. Nhờ vậy dù có hàng nghìn đánh giá, website vẫn load cực kỳ nhanh.

---

### D. Giỏ hàng

**18. Tại sao cần giỏ hàng thay vì mua ngay?**
Giỏ hàng giúp khách hàng lưu lại các sản phẩm họ đang phân vân, hoặc gom nhiều món hàng vào chung một hóa đơn để thanh toán và tính phí vận chuyển một lần cho tiện lợi.

**19. Khách chưa đăng nhập có dùng giỏ hàng được không?**
Dạ CÓ. Việc bắt khách tạo tài khoản ngay lập tức sẽ làm giảm tỷ lệ mua hàng. Em cho phép khách dùng "Giỏ hàng vãng lai" để trải nghiệm trọn vẹn website.

**20. Giỏ hàng của khách vãng lai được lưu ở đâu?**
Hệ thống dùng một mã `SessionID` duy nhất sinh ra cho thiết bị của khách. Mã này được dùng để lưu trực tiếp giỏ hàng của khách vãng lai xuống Database, giúp giỏ hàng không bị mất kể cả khi họ tải lại trang.

**21. Khi đăng nhập thì giỏ hàng khách vãng lai được xử lý như thế nào?**
Hệ thống có hàm "Merge Cart" (Gộp giỏ hàng). Ngay khi khách đăng nhập thành công, Backend sẽ gom toàn bộ sản phẩm từ giỏ hàng cũ (của SessionID) chuyển sang giỏ hàng chính thức (của UserID), rồi xóa giỏ hàng tạm kia đi.

**22. Nếu cùng một sản phẩm xuất hiện trong cả hai giỏ hàng thì sao?**
Hệ thống sẽ không tạo ra 2 dòng riêng biệt mà tự động gộp lại và cộng dồn số lượng. Nếu tổng số lượng lớn hơn số hàng tồn trong kho, nó sẽ tự hạ xuống mức tối đa bằng tồn kho hiện tại.

**23. Nếu sản phẩm trong giỏ bị xóa khỏi hệ thống thì sao?**
Khi khách vào xem giỏ hàng, nếu Backend phát hiện sản phẩm không còn tồn tại, nó sẽ lọc bỏ sản phẩm đó và trả về thông báo để khách hàng biết.

**24. Nếu giá sản phẩm thay đổi sau khi thêm vào giỏ thì sao?**
Giỏ hàng không lưu cứng giá của sản phẩm. Mỗi lần mở giỏ hàng, giá luôn được query trực tiếp từ sản phẩm gốc. Do đó, khách sẽ luôn nhìn thấy mức giá mới nhất hiện hành.

---

### E. Đặt hàng

**25. Tại sao tách Order và OrderItem?**
Bảng Order (Đơn hàng) lưu các thông tin tổng quát như: Ai mua, địa chỉ nhận ở đâu, tổng tiền bao nhiêu. Còn OrderItem (Chi tiết đơn) dùng để lưu danh sách cụ thể từng chiếc đồng hồ nằm trong hóa đơn đó. Tách ra để thể hiện quan hệ 1-Nhiều.

**26. Tại sao OrderItem phải lưu giá sản phẩm tại thời điểm đặt hàng?**
Đây là nguyên tắc kế toán bất biến. Bảng `OrderItem` phải "đóng băng" giá trị sản phẩm tại thời điểm chốt đơn để đảm bảo báo cáo doanh thu không bao giờ bị sai lệch, ngay cả khi giá đồng hồ bị Admin thay đổi vào tháng sau.

**27. Nếu sản phẩm tăng giá sau khi khách đặt hàng thì sao?**
Khách hàng không bị ảnh hưởng. Họ sẽ thanh toán chính xác theo mức giá đã chốt và lưu trong `OrderItem` tại thời điểm họ bấm nút đặt hàng.

**28. Tại sao đơn hàng có nhiều trạng thái?**
Vì một đơn hàng vật lý phải trải qua nhiều khâu: Chờ xác nhận -> Đang đóng gói -> Đang giao -> Thành công (hoặc Hủy). Hệ thống lưu lại lịch sử thay đổi trạng thái để khách hàng biết hàng đang ở đâu, và cửa hàng quản lý quy trình dễ dàng hơn.

**29. Đơn hàng ở trạng thái nào được hủy?**
Khách hàng chỉ được phép tự hủy đơn khi đơn hàng đang ở trạng thái "Chờ xác nhận" (Pending) hoặc "Đang xử lý". Nếu hàng đã giao cho Shipper, họ không được hủy trên web nữa.

**30. Nếu khách hủy đơn thì tồn kho có được hoàn lại không?**
Dạ CÓ. Khi đơn hàng đổi trạng thái sang "Đã hủy", hệ thống có logic tự động lấy số lượng hàng trong đơn cộng ngược lại vào số lượng tồn kho của hệ thống.

**31. Tại sao Admin không được xóa đơn hàng?**
Đơn hàng là chứng từ tài chính. Xóa đơn hàng sẽ làm đứt gãy lịch sử thanh toán và thống kê doanh thu. Em chỉ cho phép chuyển sang trạng thái "Đã Hủy" chứ tuyệt đối không cho dùng lệnh xóa khỏi database.

**32. Nếu khách thay đổi địa chỉ sau khi đặt hàng thì đơn hàng cũ có bị ảnh hưởng không?**
Dạ KHÔNG. Khi đặt hàng, địa chỉ cụ thể được "copy" thành một văn bản dính liền vào Đơn hàng đó. Do đó, sau này khách có xóa địa chỉ trong hồ sơ cá nhân thì hóa đơn cũ vẫn giữ nguyên thông tin giao hàng của quá khứ.

---

### F. Tồn kho

**33. Khi nào hệ thống trừ tồn kho?**
Hệ thống trừ tồn kho ngay tại thời điểm khách bấm "Đặt hàng thành công" (Create Order) để giữ chỗ, đảm bảo không bị tình trạng hết hàng mà vẫn cho khách mua.

**34. Nếu còn 1 sản phẩm nhưng có 2 khách đặt cùng lúc thì sao?**
Hệ thống sẽ khóa dòng dữ liệu đó lại (Locking). Khách A vào trước sẽ trừ tồn kho thành công về 0. Khách B vào sau chênh lệch vài mili-giây sẽ thấy tồn kho đã là 0 và hệ thống sẽ ném ra lỗi từ chối đơn hàng của B.

**35. Nếu Staff nhập sai số lượng hàng nhập thì xử lý thế nào?**
Nguyên tắc của Phiếu nhập hàng là không được phép sửa. Nếu sai, Staff phải tạo một phiếu điều chỉnh tồn kho mới hoặc tạo phiếu trả hàng để bù trừ, nhằm đảm bảo tính minh bạch mọi thao tác.

**36. Tại sao phải lưu lịch sử nhập kho?**
Để kiểm soát thất thoát, tính toán giá vốn của từng lô hàng nhập, và biết rõ nhân viên nào đã nhập hàng vào lúc nào (truy xuất nguồn gốc).

**37. Nếu xóa phiếu nhập kho thì tồn kho có bị ảnh hưởng không?**
Hệ thống đã khóa tính năng xóa phiếu nhập kho để đảm bảo tổng số lượng tồn kho luôn khớp với tổng lịch sử nhập/xuất.

---

### G. Đánh giá sản phẩm

**38. Tại sao chỉ người đã mua hàng mới được đánh giá?**
Để ngăn chặn các đối thủ cạnh tranh dùng nick ảo (seeding) vào đánh giá 1 sao nhằm phá hoại uy tín sản phẩm. Có hóa đơn thành công mới được đánh giá.

**39. Tại sao phải duyệt đánh giá?**
Để kiểm soát ngôn từ, lọc bỏ những bình luận chửi thề, spam quảng cáo hoặc link độc hại trước khi hiển thị công khai trên website.

**40. Nếu khách mua 10 lần thì được đánh giá mấy lần?**
Đánh giá gắn liền với trải nghiệm từng đơn hàng. Khách có 10 hóa đơn thành công cho sản phẩm đó thì sẽ có quyền viết tối đa 10 lượt đánh giá.

**41. Nếu khách sửa đánh giá thì sao?**
Đánh giá đang hiển thị bình thường, nếu khách sửa lại nội dung, hệ thống sẽ tự động chuyển đánh giá đó về trạng thái "Chờ duyệt" (Pending) để Staff kiểm tra lại nội dung mới.

**42. Nếu Admin từ chối một đánh giá thì dữ liệu được xử lý như thế nào?**
Đánh giá đó chuyển sang trạng thái "Bị từ chối" (Rejected). Hệ thống vẫn lưu trong DB làm bằng chứng nhưng sẽ tự động ẩn, không tải lên giao diện của khách hàng.

---

### H. Coupon (Mã giảm giá)

**43. Làm sao biết khách đã sử dụng mã giảm giá hay chưa?**
Hệ thống có hàm ghi nhận lịch sử dùng mã. Khi chốt đơn thành công, hệ thống sẽ gọi hàm đánh dấu mã đó đã được khách hàng này sử dụng.

**44. Nếu 100 người cùng dùng một coupon thì sao?**
Mỗi mã Coupon có cột "Giới hạn số lượt dùng". Nếu 100 người dùng nhưng mã chỉ có 50 lượt, hệ thống sẽ dùng Transaction duyệt tuần tự, người thứ 51 trở đi sẽ bị báo lỗi hết lượt.

**45. Nếu coupon hết hạn trong lúc khách đang thanh toán thì sao?**
Lúc khách áp mã ở giỏ hàng là thành công, nhưng tại giây phút chốt đơn (tạo hóa đơn), Backend sẽ kiểm tra hạn sử dụng lại một lần nữa. Nếu mã vừa hết hạn, hệ thống sẽ từ chối tạo đơn và thông báo cho khách.

---

### I. Thanh toán

**46. Tại sao chọn VNPay?**
VNPay là cổng thanh toán rất phổ biến tại Việt Nam, hỗ trợ quét mã QR, thẻ ATM, Visa. Tài liệu kỹ thuật của họ rất chuẩn và có môi trường Sandbox (thử nghiệm) hoàn hảo cho sinh viên làm đồ án.

**47. Nếu khách thanh toán thành công trên VNPay nhưng đóng trình duyệt ngay thì sao?**
Không sao cả. Em sử dụng cơ chế Webhook IPN của VNPay. Dù khách đóng trình duyệt (không quay lại web mình), máy chủ của VNPay vẫn sẽ ngầm gọi một API sang máy chủ của em để báo cáo trạng thái, và hệ thống vẫn cập nhật đơn hàng thành công bình thường.

**48. Nếu VNPay gửi thông báo thành công (callback) nhiều lần thì sao?**
Logic xử lý của em có tính "Idempotent" (độc lập thời gian). Khi nhận thông báo, hệ thống kiểm tra trạng thái đơn hàng. Nếu đơn đã là "Đã thanh toán" rồi, hệ thống sẽ chỉ trả về chữ "OK" cho VNPay ngừng gửi chứ không ghi đè dữ liệu hay gửi email lại nữa.

**49. Nếu VNPay báo thành công nhưng database của mình bị lỗi chưa cập nhật thì sao?**
Trong trường hợp xấu này, Admin có thể dựa vào "Mã giao dịch tham chiếu" mà VNPay cung cấp để kiểm tra thủ công. Hệ thống cung cấp công cụ đối soát để Admin có thể cập nhật trạng thái đơn hàng lại cho đúng.

---

### J. Phân quyền và Nâng cao

**50. Nếu hội đồng yêu cầu: "Cho Staff được hủy đơn hàng", Em sẽ sửa ở đâu?**
Em sẽ sửa ở 2 nơi:
- Ở Backend (Spring Boot): Thêm Role 'STAFF' vào hàm kiểm tra quyền của API hủy đơn (`@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")`).
- Ở Frontend (React): Thêm điều kiện kiểm tra, nếu `Role === 'STAFF'` thì vẫn hiển thị nút "Hủy đơn" trên giao diện quản lý.

**51. Nếu được làm lại từ đầu, em sẽ thay đổi điều gì?**
Em sẽ thiết kế tính năng Tìm kiếm thông minh hơn (có thể dùng ElasticSearch) để tìm đồng hồ theo nhiều tiêu chí (giá, màu, dây) nhanh hơn thay vì dùng query SQL thông thường; và thêm Redis để cache (lưu tạm) danh sách sản phẩm trên trang chủ giúp web load mượt hơn.

**52. Điểm yếu lớn nhất của hệ thống hiện tại là gì?**
Điểm yếu là khả năng xử lý lượng truy cập tăng vọt đột biến (ví dụ như Flash Sale). Hiện tại mọi giao dịch đều chọc thẳng vào MySQL, nếu traffic quá lớn có thể gây chậm cơ sở dữ liệu.

**53. Nếu có 1 triệu sản phẩm thì hệ thống còn chạy tốt không?**
Về mặt hiển thị, hệ thống vẫn ổn vì đã có Phân trang (Pagination). Nhưng nếu người dùng tìm kiếm (`Search bằng LIKE`), MySQL sẽ phải quét toàn bộ 1 triệu dòng và rất chậm. Khi đó bắt buộc phải đánh Index CSDL hoặc dùng công cụ tìm kiếm chuyên dụng.

**54. Nếu database bị mất dữ liệu thì sao?**
Trong thực tế, em sẽ phải cài đặt kịch bản (script) tự động sao lưu Database (Backup Dump) mỗi đêm và đẩy lên kho lưu trữ ngoài như Google Drive hoặc AWS S3 để có thể khôi phục lại khi gặp sự cố.

**55. Tại sao chọn MySQL thay vì MongoDB?**
Web thương mại điện tử yêu cầu tính toàn vẹn dữ liệu cực cao (quan hệ chặt chẽ giữa Hóa đơn - Kho hàng - Thanh toán). MySQL có khóa ngoại và Transaction (ACID) đảm bảo nếu thanh toán lỗi thì toàn bộ dữ liệu tự hoàn tác, điều này MongoDB khó làm chặt chẽ bằng.

**56. Tại sao chọn Spring Boot?**
Spring Boot là framework trưởng thành mạnh mẽ của Java, cực kỳ bảo mật (Spring Security), tổ chức code theo mô hình MVC rất sạch sẽ, dễ dàng triển khai (deploy) và là chuẩn công nghiệp được các công ty lớn sử dụng.

**57. Tại sao chọn React?**
React giúp xây dựng website thành một ứng dụng trang đơn (SPA). Khi người dùng bấm chuyển trang, trang web không bị nháy hay tải lại toàn bộ mà chỉ render lại những chỗ cần thiết, mang lại cảm giác mượt mà như dùng App điện thoại.

**58. Nếu Cloudinary ngừng hoạt động thì sao?**
Hệ thống của em lưu ảnh dưới dạng Link rút gọn hoặc tương đối. Khi đó, em chỉ cần chuyển toàn bộ ảnh sang một máy chủ khác, rồi cập nhật lại 1 dòng "Domain hình ảnh" trong cấu hình hệ thống là web lại chạy bình thường, không cần sửa lại database.

**59. Nếu JWT bị lộ thì sao?**
Giống như mất chìa khóa tạm thời. Tuy nhiên vì Access Token sống rất ngắn (15p), kẻ gian sẽ sớm mất quyền truy cập. Nếu phát hiện rủi ro cao, Admin có thể đổi mã bí mật (Secret Key) trên server, toàn bộ người dùng sẽ bị đăng xuất và phải đăng nhập lại.

**60. Nếu có thêm vai trò "Quản lý kho" thì em sẽ thiết kế lại hệ thống như thế nào?**
Em sẽ thêm Role `WAREHOUSE_MANAGER`. Những người có Role này khi đăng nhập vào trang quản trị sẽ chỉ thấy Menu quản lý phiếu nhập, tồn kho và danh sách sản phẩm. Các chức năng xem doanh thu tiền bạc, danh sách khách hàng hay quản lý nhân sự sẽ hoàn toàn bị ẩn đi. Ở Backend cũng chặn nghiêm ngặt các API không thuộc quyền hạn của họ.
