package org.eduspace.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your OTP verification code - EduSpace");
        message.setText("Your OTP verification code is: " + otp
                + "\n\nThis code will expire in 5 minutes. Please do not share this code with anyone.");

        mailSender.send(message);
    }
}
