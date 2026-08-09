package TAWactch.example.TAWatch.exception;

import TAWactch.example.TAWatch.Enum.ErrorCode;

public class AppException extends RuntimeException {
    private ErrorCode errorCode;
    public AppException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }

}
