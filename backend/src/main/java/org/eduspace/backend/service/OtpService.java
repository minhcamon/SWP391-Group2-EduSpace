package org.eduspace.backend.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {
    // Lớp chứa mã OTP, Thời gian hết hạn, và Thời điểm gửi gần nhất
    private static class OtpData {
        String otpCode;
        long expirationTime;
        long lastSentTime;

        public OtpData(String otpCode, long expirationTime) {
            this.otpCode = otpCode;
            this.expirationTime = expirationTime;
            this.lastSentTime = System.currentTimeMillis();
        }
    }

    // Storage lưu OTP trên RAM
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();

    // Cấu hình thời gian
    private static final long VALIDITY_MILLIS = 5 * 60 * 1000; // OTP sống 5 phút
    private static final long COOLDOWN_MILLIS = 60 * 1000; // Spam Cooldown: 1 phút

    // 1. Sinh OTP (Có chống spam)
    public String generateOTP(String email) {
        long currentTime = System.currentTimeMillis();
        // Kiểm tra Cooldown xem user có bấm gửi liên tục không
        if (otpStorage.containsKey(email)) {
            OtpData existingOtp = otpStorage.get(email);
            long timeSinceLastSent = currentTime - existingOtp.lastSentTime;

            if (timeSinceLastSent < COOLDOWN_MILLIS) {
                long secondsLeft = (COOLDOWN_MILLIS - timeSinceLastSent) / 1000;
                throw new RuntimeException("Vui lòng đợi " + secondsLeft + " giây nữa trước khi yêu cầu gửi lại OTP.");
            }
        }
        // Sinh mã mới và lưu đè
        Random random = new Random();
        String otp = String.valueOf(100000 + random.nextInt(900000));

        otpStorage.put(email, new OtpData(otp, currentTime + VALIDITY_MILLIS));
        return otp;
    }

    // 2. Xác thực OTP (Chỉ trả về true / false)
    public boolean validateOTP(String email, String otpInput) {
        if (otpStorage.containsKey(email)) {
            OtpData otpData = otpStorage.get(email);

            // Đã vượt quá 5 phút
            if (System.currentTimeMillis() > otpData.expirationTime) {
                otpStorage.remove(email);
                return false;
            }

            // Đúng mã
            if (otpData.otpCode.equals(otpInput)) {
                otpStorage.remove(email);
                return true;
            }
        }
        return false;
    }

    // 3. Quét RAM dọn rác mỗi 5 phút tự động
    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void cleanupExpiredData() {
        long currentTime = System.currentTimeMillis();
        // Xóa tất cả các bản ghi có thời gian hiện tại lớn hơn thời gian hết hạn
        otpStorage.entrySet().removeIf(entry -> currentTime > entry.getValue().expirationTime);
    }
}
