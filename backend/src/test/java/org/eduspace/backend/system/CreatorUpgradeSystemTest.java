package org.eduspace.backend.system;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Workflow 6: Learner account upgrade to Creator using Selenium. */
class CreatorUpgradeSystemTest extends SystemTestSupport {

    @Test
    void scenarioA_learnerRequestsCreatorUpgradeAndAdminApprovesIt() throws Exception {
        // 1. Tạo tài khoản và phân quyền Admin qua DB
        TestUser learner = register("upgrade");
        TestUser admin = register("upgradeadmin");
        setRole(admin.username(), "ADMIN");

        // 2. Vai trò LEARNER: Đăng nhập và gửi yêu cầu nâng cấp lên Creator
        login(learner.username());
        driver.get(baseUrl + "/profile"); // Giả định nút nâng cấp nằm trong trang profile/dashboard

        // Chờ nút "Yêu cầu nâng cấp" (Request Upgrade) hiển thị và click
        wait.until(ExpectedConditions.elementToBeClickable(By.id("btn-request-upgrade"))).click();

        // Đợi thông báo thành công xuất hiện
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("[data-sonner-toast]")));

        logout();

        // 3. Vai trò ADMIN: Đăng nhập và duyệt yêu cầu nâng cấp
        login(admin.username());
        driver.get(baseUrl + "/admin/creator-requests"); // Trang quản lý yêu cầu của Admin

        // Đợi danh sách tải xong, tìm kiếm dòng có email của Learner
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("body")));
        List<WebElement> requestElements = driver.findElements(By.xpath("//*[contains(text(), '" + learner.email() + "')]"));
        assertFalse(requestElements.isEmpty(), "Admin phải nhìn thấy yêu cầu nâng cấp của learner trên UI");

        // Định vị nút Duyệt (Approve) tương ứng với hàng chứa email của learner đó
        String approveBtnXpath = String.format("//div[contains(., '%s')]//button[contains(@class, 'approve-request-btn')]", learner.email());
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(approveBtnXpath))).click();

        // Chờ UI cập nhật trạng thái hiển thị thành APPROVED
        String statusXpath = String.format("//div[contains(., '%s')]//*[contains(text(), 'APPROVED')]", learner.email());
        assertTrue(wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(statusXpath))).isDisplayed());

        logout();

        // 4. Vai trò LEARNER: Đăng nhập lại để kiểm tra xem Role đã đổi thành CREATOR chưa
        login(learner.username());
        driver.get(baseUrl + "/profile");

        WebElement roleField = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("profile-role")));
        assertEquals("CREATOR", roleField.getText().trim(), "Tài khoản của Learner phải được cập nhật role thành CREATOR trên giao diện");
    }

    @Test
    void scenarioB_unauthenticatedUserCannotSendUpgradeRequest() {
        // Truy cập thẳng vào trang profile/gửi yêu cầu mà chưa đăng nhập
        driver.get(baseUrl + "/profile");

        // Đảm bảo hệ thống đá về trang login, không hiển thị nút hoặc form gửi yêu cầu
        wait.until(ExpectedConditions.urlContains("/login"));
        assertEquals("/login", getCurrentPath());
    }

    @Test
    void scenarioB_creatorCannotSendLearnerUpgradeRequest() throws Exception {
        // Tạo một tài khoản đã có quyền CREATOR sẵn
        TestUser creator = register("alreadycreator");
        setRole(creator.username(), "CREATOR");

        login(creator.username());
        driver.get(baseUrl + "/profile");

        // Kiểm tra xem nút nâng cấp có bị ẨN đi hoặc bị VÔ HIỆU HÓA (disabled) không đối với tài khoản đã là Creator
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("profile-role")));
        List<WebElement> upgradeButtons = driver.findElements(By.id("btn-request-upgrade"));

        // Có thể asset nút không tồn tại, hoặc nếu tồn tại thì phải có thuộc tínhdisabled
        if (!upgradeButtons.isEmpty()) {
            assertFalse(upgradeButtons.get(0).isEnabled(), "Nút nâng cấp phải bị vô hiệu hóa nếu user đã là Creator");
        }
    }

    @Test
    void scenarioC_duplicatePendingRequestIsRejected() {
        TestUser learner = register("doubleupgrade");

        login(learner.username());
        driver.get(baseUrl + "/profile");

        // Click gửi yêu cầu lần 1
        wait.until(ExpectedConditions.elementToBeClickable(By.id("btn-request-upgrade"))).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("[data-sonner-toast]")));

        // Giả sử sau khi gửi, nút đó bị disabled để ngăn gửi lần 2 (UI Validation tốt)
        WebElement upgradeBtn = driver.findElement(By.id("btn-request-upgrade"));
        assertFalse(upgradeBtn.isEnabled(), "Nút phải bị khóa lại sau khi đã gửi yêu cầu thành công");
    }

    @Test
    void scenarioC_learnerCannotApproveOwnUpgradeRequest() {
        TestUser learner = register("selfapprove");

        login(learner.username());

        // Cố tình truy cập thẳng vào trang quản lý của Admin để phê duyệt
        driver.get(baseUrl + "/admin/creator-requests");

        // Giao diện phải chặn lại vì không có quyền Admin truy cập (Hiển thị 403 hoặc đá về trang login/dashboard)
        WebElement accessDeniedMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//*[contains(text(), '403') or contains(text(), 'Access Denied') or contains(text(), 'Không có quyền')]")));
        assertTrue(accessDeniedMessage.isDisplayed(), "Learner không được quyền truy cập trang duyệt yêu cầu của Admin");
    }

    /**
     * Hàm hỗ trợ xóa Token nhanh trong Trình duyệt để Đăng xuất tài khoản cũ
     */
    private void logout() {
        ((JavascriptExecutor) driver).executeScript("window.localStorage.clear();");
        ((JavascriptExecutor) driver).executeScript("window.sessionStorage.clear();");
        driver.get(baseUrl + "/login");
    }
}
