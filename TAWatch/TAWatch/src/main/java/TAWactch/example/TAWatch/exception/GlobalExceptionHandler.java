package TAWactch.example.TAWatch.exception;

import TAWactch.example.TAWatch.Enum.ErrorCode;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<ApiRespone> handleException(Exception ex) {
        ApiRespone apiRespone = new ApiRespone();
        apiRespone.setMessage(ex.getClass().getSimpleName() + ": " + ex.getMessage());
        apiRespone.setCode(ErrorCode.UNCATEGORIED_EXCEPTION.getCode());
        return ResponseEntity.badRequest().body(apiRespone);
    }

    @ExceptionHandler(value = AppException.class)
    public ResponseEntity<ApiRespone> handleException(AppException ex) {
        ApiRespone apiRespone = new ApiRespone();
        apiRespone.setMessage(ex.getErrorCode().getMessage());
        apiRespone.setCode(ex.getErrorCode().getCode());
        return ResponseEntity.badRequest().body(apiRespone);
    }


    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<ApiRespone> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        ErrorCode errorCode = ErrorCode.INVALID_KEY;
        String keyName = ex.getBindingResult().getFieldError().getDefaultMessage();
        try {
            errorCode = ErrorCode.valueOf(keyName);
        } catch (IllegalArgumentException e) {
        }
        ApiRespone apiRespone = new ApiRespone();
        apiRespone.setMessage(errorCode.getMessage());
        apiRespone.setCode(errorCode.getCode());
        return ResponseEntity.badRequest().body(apiRespone);
    }
}
