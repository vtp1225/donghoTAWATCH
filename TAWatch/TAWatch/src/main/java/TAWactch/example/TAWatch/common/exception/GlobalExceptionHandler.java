package TAWactch.example.TAWatch.common.exception;

import TAWactch.example.TAWatch.common.dto.response.ApiResponse;
import TAWactch.example.TAWatch.common.enums.ErrorCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<ApiResponse> handleException(Exception ex) {
        ApiResponse apiRespone = new ApiResponse();
        apiRespone.setMessage(ex.getClass().getSimpleName() + ": " + ex.getMessage());
        apiRespone.setCode(ErrorCode.UNCATEGORIED_EXCEPTION.getCode());
        return ResponseEntity.badRequest().body(apiRespone);
    }

    @ExceptionHandler(value = AppException.class)
    public ResponseEntity<ApiResponse> handleException(AppException ex) {
        ApiResponse apiRespone = new ApiResponse();
        apiRespone.setMessage(ex.getErrorCode().getMessage());
        apiRespone.setCode(ex.getErrorCode().getCode());
        return ResponseEntity.badRequest().body(apiRespone);
    }


    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        ErrorCode errorCode = ErrorCode.INVALID_KEY;
        String keyName = ex.getBindingResult().getFieldError().getDefaultMessage();
        try {
            errorCode = ErrorCode.valueOf(keyName);
        } catch (IllegalArgumentException e) {
        }
        ApiResponse apiRespone = new ApiResponse();
        apiRespone.setMessage(errorCode.getMessage());
        apiRespone.setCode(errorCode.getCode());
        return ResponseEntity.badRequest().body(apiRespone);
    }
}
