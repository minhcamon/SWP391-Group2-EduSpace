package org.eduspace.backend.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    // Lớp nội bộ để giữ Mã OTP và Thời gian hết hạn
    private static class OtpData {
        String otpCode;
        long expirationTime; // milliseconds

        public OtpData(String otpCode, long expirationTime) {
            this.otpCode = otpCode;
            this.expirationTime = expirationTime;
        }
    }

    // Storage lưu OTP tạm thời. Key = Email
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();

    // Thời gian hết hạn mặc định là 5 phút
    private static final long OTP_VALIDITY_MILLIS = 5 * 60 * 1000;

    public String generateOTP(String email) {
        // 1. Sinh mã OTP 6 số
        Random random = new Random();
        int otpValue = 100000 + random.nextInt(900000);
        String otp = String.valueOf(otpValue);

        // 2. Tính thời điểm hết hạn = Hiện tại + 5 phút
        long expireTime = System.currentTimeMillis() + OTP_VALIDITY_MILLIS;

        // 3. Lưu vào Map
        otpStorage.put(email, new OtpData(otp, expireTime));

        return otp;
    }

    public boolean validateOTP(String email, String otpInput) {
        if (otpStorage.containsKey(email)) {
            OtpData otpData = otpStorage.get(email);
            long currentTime = System.currentTimeMillis();

            // Nếu thời gian hiện tại đã vượt qua thời gian hết hạn -> Đã hết hạn
            if (currentTime > otpData.expirationTime) {
                otpStorage.remove(email); // Xóa rác
                return false;
            }

            // Nếu chưa hết hạn, kiểm tra xem mã có khớp không
            if (otpData.otpCode.equals(otpInput)) {
                otpStorage.remove(email); // Xác thực thành công thì xóa luôn để không tái sử dụng
                return true;
            }
        }
        return false;
    }
}
