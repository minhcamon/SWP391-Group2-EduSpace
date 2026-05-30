package org.eduspace.backend.annotation;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE) // Gắn trên cấp độ Class
@Retention(RetentionPolicy.RUNTIME)
@RequestMapping("/api/admin")
public @interface AdminRoute {
}
