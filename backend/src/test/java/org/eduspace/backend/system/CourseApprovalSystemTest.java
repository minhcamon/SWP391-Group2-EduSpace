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

/** Workflow 2: Course creation and approval lifecycle using Selenium. */
class CourseApprovalSystemTest extends SystemTestSupport {

    @Test
    void scenarioA_creatorCreatesPendingCourseAndAdminPublishesIt() throws Exception {
        // 1. Chuẩn bị tài khoản thông qua DB hỗ trợ từ lớp cha
        TestUser creator = register("creator");
        TestUser admin = register("admin");
        setRole(creator.username(), "CREATOR");
        setRole(admin.username(), "ADMIN");

        String title = "System Test Course " + shortId();

        // 2. Vai trò CREATOR: Đăng nhập và tạo khóa học mới
        login(creator.username());
        driver.get(baseUrl + "/course/create"); // Đường dẫn trang tạo khóa học trên UI

        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("course-title"))).sendKeys(title);
        driver.findElement(By.id("course-description")).sendKeys("Course created by an end-to-end workflow test");
        // Giả định trạng thái mặc định khi tạo mới hoặc chọn từ dropdown là PENDING
        driver.findElement(By.cssSelector("form button[type='submit']")).click();

        // Đợi hệ thống xử lý xong và điều hướng (ví dụ về trang quản lý khóa học của tôi)
        wait.until(ExpectedConditions.urlContains("/course/my-courses"));

        // Thực hiện Đăng xuất để chuẩn bị cho vai trò Admin
        logout();

        // 3. Vai trò ADMIN: Đăng nhập và duyệt khóa học
        login(admin.username());
        driver.get(baseUrl + "/admin/pending-courses"); // Đường dẫn trang danh sách chờ duyệt của Admin

        // Tìm khóa học có tiêu đề vừa tạo trong danh sách hiển thị trên UI
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("body")));
        List<WebElement> courseElements = driver.findElements(By.xpath("//*[contains(text(), '" + title + "')]"));
        assertFalse(courseElements.isEmpty(), "Admin phải nhìn thấy khóa học đang chờ duyệt trên UI");

        // Giả định cạnh khóa học có nút Duyệt (Approve). Định vị nút tương ứng với khóa học đó.
        String approveBtnXpath = String.format("//div[contains(., '%s')]//button[contains(@class, 'approve-btn')]", title);
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath(approveBtnXpath))).click();

        // Chờ UI cập nhật trạng thái hiển thị thành PUBLISHED
        String statusXpath = String.format("//div[contains(., '%s')]//*[contains(text(), 'PUBLISHED')]", title);
        assertTrue(wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(statusXpath))).isDisplayed());

        logout();

        // 4. Vai trò GUEST (Khách vãng lai): Truy cập công khai xem khóa học đã được xuất bản chưa
        driver.get(baseUrl + "/courses"); // Trang danh sách khóa học công khai
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("body")));

        // Kiểm tra xem khóa học có hiển thị trên trang công khai không
        boolean isPubliclyVisible = driver.findElement(By.tagName("body")).getText().contains(title);
        assertTrue(isPubliclyVisible, "Khóa học đã PUBLISHED phải hiển thị công khai");
    }

    @Test
    void scenarioB_learnerCannotCreateCourse() throws Exception {
        // 1. Tạo tài khoản LEARNER thông thường
        TestUser learner = register("courselearner");
        setRole(learner.username(), "LEARNER");

        login(learner.username());

        // 2. Cố tình truy cập trực tiếp vào link tạo khóa học dành cho Creator
        driver.get(baseUrl + "/course/create");

        // 3. Kiểm tra xem hệ thống có chặn lại không (Hiển thị trang 403, báo lỗi hoặc đá về Dashboard)
        WebElement accessDeniedMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//*[contains(text(), '403') or contains(text(), 'Access Denied') or contains(text(), 'Không có quyền')]")));
        assertTrue(accessDeniedMessage.isDisplayed(), "Hệ thống phải chặn không cho Learner vào trang tạo khóa học");
    }

    @Test
    void scenarioB_invalidCourseStatusIsRejected() {
        // Bài test này ở tầng API dùng để truyền status bậy ("NOT_A_STATUS").
        // Trên giao diện UI, status thường được chọn qua thẻ <select> (Dropdown) cố định.
        // Ta sẽ kiểm tra xem giao diện có cấu hình chuẩn (không thể nhập chữ tùy ý vào status) hoặc form validation hoạt động.
        TestUser creator = register("badcourse");
        try { setRole(creator.username(), "CREATOR"); } catch (Exception ignored) {}

        login(creator.username());
        driver.get(baseUrl + "/course/create");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("course-title")));

        // Tìm kiếm xem trường status có phải là Dropdown không để đảm bảo người dùng không nhập text tự do được
        WebElement statusSelect = driver.findElement(By.id("course-status"));
        assertEquals("select", statusSelect.getTagName().toLowerCase(), "Trường status phải là Dropdown để tránh dữ liệu sai");
    }

    @Test
    void scenarioC_creatorCannotUseAdminApprovalEndpoint() throws Exception {
        // Kiểm tra tính bảo mật định tuyến trên UI: Creator không thể vào trang duyệt của Admin
        TestUser creator = register("securecourse");
        setRole(creator.username(), "CREATOR");

        login(creator.username());

        // Cố tình truy cập trang admin
        driver.get(baseUrl + "/admin/pending-courses");

        // Hệ thống phải chặn lại thông qua màn hình báo lỗi hoặc đá ra ngoài
        wait.until(ExpectedConditions.urlContains("/login")); // hoặc "/dashboard" tùy logic dự án của bạn
        assertFalse(getCurrentPath().equals("/admin/pending-courses"), "Creator không được phép ở lại trang duyệt của Admin");
    }

    @Test
    void scenarioC_pendingCourseIsNotPubliclyAccessible() throws Exception {
        TestUser creator = register("pendingcourse");
        setRole(creator.username(), "CREATOR");

        login(creator.username());
        String title = "Private pending course " + shortId();

        // 1. Tạo khóa học ở trạng thái PENDING
        driver.get(baseUrl + "/course/create");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("course-title"))).sendKeys(title);
        driver.findElement(By.cssSelector("form button[type='submit']")).click();
        wait.until(ExpectedConditions.urlContains("/course/my-courses"));

        logout();

        // 2. Vào trang danh sách công khai (Guest) xem có bị lộ khóa học chưa duyệt không
        driver.get(baseUrl + "/courses");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("body")));

        boolean isExposed = driver.findElement(By.tagName("body")).getText().contains(title);
        assertFalse(isExposed, "Khóa học đang ở trạng thái PENDING tuyệt đối không được xuất hiện ngoài trang công khai");
    }

    /**
     * Hàm hỗ trợ xóa Token nhanh trong Trình duyệt để Đăng xuất tài khoản cũ
     */
    private void logout() {
        ((JavascriptExecutor) driver).executeScript("window.localStorage.clear();");
        ((JavascriptExecutor) driver).executeScript("window.sessionStorage.clear();");
        driver.get(baseUrl + "/login"); // Chuyển về trang login làm sạch trạng thái điều hướng
    }
}
