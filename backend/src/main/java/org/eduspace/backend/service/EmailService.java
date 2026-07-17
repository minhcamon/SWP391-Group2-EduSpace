package org.eduspace.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public void sendVerificationEmail(String toEmail, String verificationToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Xác nhận tài khoản - EduSpace");
        
        String verificationLink = frontendUrl + "/verify-email?token=" + verificationToken;
        
        String emailContent = "Chào mừng bạn đến với EduSpace!\n\n"
                + "Vui lòng nhấp vào liên kết bên dưới để xác nhận địa chỉ email của bạn và kích hoạt tài khoản:\n\n"
                + verificationLink + "\n\n"
                + "⚠️ Liên kết này sẽ hết hạn sau 1 phút.\n\n"
                + "Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email này.\n\n"
                + "Trân trọng,\n"
                + "Đội ngũ EduSpace";
        
        message.setText(emailContent);
        mailSender.send(message);
    }

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your OTP verification code - EduSpace");
        message.setText("Your OTP verification code is: " + otp
                + "\n\nThis code will expire in 5 minutes. Please do not share this code with anyone.");

        mailSender.send(message);
    }
}
