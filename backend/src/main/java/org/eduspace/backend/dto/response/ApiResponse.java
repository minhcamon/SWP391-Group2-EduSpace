package org.eduspace.backend.dto.response;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {
    private boolean isSuccess;
    private int code;
    private String message;
    private T data;

    public static <T> ApiResponse<T> success(String message, T data){
        return new ApiResponse<>(true,200,message,data);
    }

    private static <T> ApiResponse<T> error(int code, String message, T data){
        return new ApiResponse<>(false,code,message,data);
    }
}
