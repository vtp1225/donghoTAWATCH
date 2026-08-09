package TAWactch.example.TAWatch.dto.respone;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiRespone<T> {
    private int code;
    private String message;
    private T data;

    public ApiRespone(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public ApiRespone() {}

    public int getCode() { return code; }
    public void setCode(int code) { this.code = code; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
}
