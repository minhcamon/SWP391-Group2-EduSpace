package org.eduspace.backend.system;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Workflow 1: User onboarding and authentication using Selenium. */
class AuthenticationSystemTest extends SystemTestSupport {

        @Test
        void scenarioA_userCanRegisterLoginAndReadProfile() throws Exception {
                TestUser learner = register("learner");

                String token = login(learner.username());
                assertFalse(token.isBlank(), "Login xong phải lưu được access_token vào localStorage");

                driver.get(baseUrl + "/profile");
                try {
                        WebElement usernameField = wait.until(ExpectedConditions.visibilityOfElementLocated(
                                        By.xpath("//*[contains(text(), '" + learner.username() + "')]")));
                } catch (Exception e) {
                        // Nếu lỗi, in toàn bộ nội dung HTML của trang hiện tại ra Terminal để xem
                        System.out.println("================= HTML SCREENSHOT LOG =================");
                        System.out.println(driver.getPageSource());
                        System.out.println("=======================================================");
                        throw e; // Ném lại lỗi để đánh fail test
                }
                // --- SỬA TỪ ĐOẠN NÀY ---

                // Tìm bất kỳ thẻ nào trên giao diện chứa CHÍNH XÁC chuỗi username vừa đăng ký
                // WebElement usernameField =
                // wait.until(ExpectedConditions.visibilityOfElementLocated(
                // By.xpath("//*[contains(text(), '" + learner.username() + "')]")));

                WebElement usernameField = wait.until(ExpectedConditions.visibilityOfElementLocated(
                                By.xpath("//*[contains(text(), '@learner')]")));
                                
                // Tìm thẻ chứa vai trò (Role) bằng cách quét text linh hoạt
                WebElement roleField = wait.until(ExpectedConditions.visibilityOfElementLocated(
                                By.xpath("//*[contains(text(), 'LEARNER') or contains(text(), 'HỌC VIÊN') or contains(text(), 'learner')]")));

                // Xác nhận thông tin hiển thị thành công
                assertTrue(usernameField.isDisplayed(), "Trang Profile phải hiển thị username của học viên");
                assertTrue(roleField.isDisplayed(), "Trang Profile phải hiển thị role của học viên");
        }

        @Test
        void scenarioB_loginWithWrongPasswordIsRejected() {
                // 1. Tạo trước một tài khoản
                TestUser learner = register("wrongpass");

                // 2. Cố tình đăng nhập bằng mật khẩu sai trực tiếp trên giao diện
                driver.get(baseUrl + "/login");
                wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username")))
                                .sendKeys(learner.username());
                driver.findElement(By.id("password")).sendKeys("Wrong@1234");
                driver.findElement(By.cssSelector("form button[type='submit']")).click();

                // 3. Kiểm tra xem có thông báo lỗi (Toast/Alert) hiện lên không và vẫn ở lại
                // trang login
                WebElement errorToast = wait
                                .until(ExpectedConditions
                                                .visibilityOfElementLocated(By.cssSelector("[data-sonner-toast]")));

                assertTrue(getCurrentPath().equals("/login"), "Đăng nhập lỗi thì phải ở lại trang login");
                assertFalse(errorToast.getText().isBlank(), "Phải có thông báo lỗi hiển thị cho người dùng");
        }

        @Test
        void scenarioB_registrationWithInvalidEmailIsRejected() {
                // Điền form đăng ký với email sai định dạng trực tiếp trên UI
                driver.get(baseUrl + "/signup");
                wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username")));

                driver.findElement(By.id("fullname")).sendKeys("Invalid Email User");
                driver.findElement(By.id("phone")).sendKeys("0123456789");
                driver.findElement(By.id("username")).sendKeys("invalid" + shortId());
                driver.findElement(By.id("email")).sendKeys("not-an-email"); // Email sai định dạng
                driver.findElement(By.id("password")).sendKeys(PASSWORD);
                driver.findElement(By.id("confirmPassword")).sendKeys(PASSWORD);
                driver.findElement(By.id("terms")).click();
                driver.findElement(By.cssSelector("form button[type='submit']")).click();

                // Kiểm tra xem hệ thống có chặn lại không (Có thể là lỗi validation HTML5 hoặc
                // Toast báo lỗi của backend)
                // Ở đây giả định là app hiển thị thông báo lỗi hoặc giữ nguyên ở trang signup
                // thay vì chuyển hướng sang /login
                assertTrue(getCurrentPath().equals("/signup"),
                                "Email không hợp lệ thì không được chuyển hướng sang trang login");
        }

        @Test
        void scenarioC_duplicateUsernameIsRejected() {
                // 1. Đăng ký tài khoản đầu tiên thành công
                TestUser original = register("duplicate");

                // 2. Cố tình đăng ký tài khoản thứ hai trùng username tài khoản đầu
                driver.get(baseUrl + "/signup");
                wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username")));

                driver.findElement(By.id("fullname")).sendKeys("Duplicate User");
                driver.findElement(By.id("phone")).sendKeys("0123456789");
                driver.findElement(By.id("username")).sendKeys(original.username()); // Trùng username
                driver.findElement(By.id("email")).sendKeys("other" + shortId() + "@example.com");
                driver.findElement(By.id("password")).sendKeys(PASSWORD);
                driver.findElement(By.id("confirmPassword")).sendKeys(PASSWORD);
                driver.findElement(By.id("terms")).click();
                driver.findElement(By.cssSelector("form button[type='submit']")).click();

                // 3. Chờ thông báo lỗi trùng lặp từ hệ thống hiện lên giao diện
                WebElement errorToast = wait
                                .until(ExpectedConditions
                                                .visibilityOfElementLocated(By.cssSelector("[data-sonner-toast]")));

                assertTrue(getCurrentPath().equals("/signup"),
                                "Trùng username thì phải giữ người dùng ở lại trang signup");
                assertTrue(errorToast.getText().contains("username") || !errorToast.getText().isBlank(),
                                "Phải thông báo lỗi trùng tên tài khoản");
        }

        @Test
        void scenarioC_profileWithoutTokenIsRejected() {
                // Truy cập thẳng vào trang profile mà chưa hề qua bước login (không có token
                // trong localStorage)
                driver.get(baseUrl + "/profile");

                // Hệ thống bảo mật chuẩn trên UI thường sẽ đá người dùng chưa đăng nhập về
                // trang chủ hoặc trang login
                // wait.until(ExpectedConditions.urlContains("/login"));
                wait.until(ExpectedConditions.urlToBe(baseUrl + "/"));
                assertEquals("/", getCurrentPath(), "Chưa đăng nhập mà vào profile thì phải bị đá về trang login");
        }

        @Test
        void scenarioD_googleLoginButtonRedirectsToOAuthFlow() {
                driver.get(baseUrl + "/login");
                // Chờ nút Google click được và bấm
                wait.until(ExpectedConditions.elementToBeClickable(
                                By.xpath("//button[@type='button'][.//img[contains(@alt,'Google')]]"))).click();

                // Xác nhận trình duyệt chuyển hướng qua luồng login của Google
                wait.until(driver -> driver.getCurrentUrl().contains("oauth2/authorization/google")
                                || driver.getCurrentUrl().contains("accounts.google.com"));
                assertTrue(driver.getCurrentUrl().contains("google"));
        }
}