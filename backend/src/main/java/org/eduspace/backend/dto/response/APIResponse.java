package org.eduspace.backend.dto.response;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class APIResponse<T> {
    private boolean isSuccess;
    private int code;
    private String message;
    private T data;

    public static <T> APIResponse<T> success(String message, T data){
        return new APIResponse<>(true,200,message,data);
    }

    public static <T> APIResponse<T> error(int code, String message, T data){
        return new APIResponse<>(false,code,message,data);
    }
}
