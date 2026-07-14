package org.eduspace.backend.system;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Course lifecycle system tests using Selenium. */
class CourseApprovalSystemTest extends SystemTestSupport {

    @Test
    void creatorCreatesPendingCourseAdminPublishesAndGuestSeesIt() throws Exception {
        TestUser creator = register("creator");
        TestUser admin = register("admin");
        setRole(creator.username(), "CREATOR");
        setRole(admin.username(), "ADMIN");

        String title = "System Test Course " + shortId();

        login(creator.username());
        createPendingCourse(title, "Course created by an end-to-end workflow test");

        driver.get(baseUrl + "/creator/courses");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("body")));
        assertTrue(driver.findElement(By.tagName("body")).getText().contains(title),
                "Creator must see the newly submitted pending course");

        logout();

        login(admin.username());
        driver.get(baseUrl + "/admin/courses-management");
        WebElement pendingCourseRow = waitForRowContaining(title);
        assertTrue(pendingCourseRow.getText().contains(title),
                "Admin must see the pending course before approval");

        pendingCourseRow.findElement(By.cssSelector("button.bg-emerald-600")).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("[data-sonner-toast]")));
        wait.until(ExpectedConditions.invisibilityOf(pendingCourseRow));

        logout();

        driver.get(baseUrl + "/courses");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("body")));
        assertTrue(driver.findElement(By.tagName("body")).getText().contains(title),
                "Published course must be visible on the public course list");
    }

    @Test
    void creatorCanSaveDraftCourse() throws Exception {
        TestUser creator = register("draftcreator");
        setRole(creator.username(), "CREATOR");

        String title = "Draft Course " + shortId();

        login(creator.username());
        driver.get(baseUrl + "/creator/create-course");
        fillCourseOverview(title, "Draft course created by system test");
        clickSaveDraft();

        wait.until(ExpectedConditions.urlContains("/creator/courses"));
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("body")));
        assertTrue(driver.findElement(By.tagName("body")).getText().contains(title),
                "Creator must see the saved draft course in course management");
    }

    @Test
    void creatorCanSaveDraftCourseWithVideoLinkLesson() throws Exception {
        TestUser creator = register("videocreator");
        setRole(creator.username(), "CREATOR");

        String title = "Video Link Course " + shortId();
        String lessonTitle = "External Video Lesson " + shortId();
        String videoUrl = "https://example.com/course-video-" + shortId() + ".mp4";

        login(creator.username());
        driver.get(baseUrl + "/creator/create-course");
        fillCourseOverview(title, "Course with a pasted video URL");

        addModule();
        addVideoLessonWithPastedUrl(lessonTitle, videoUrl);
        clickSaveDraft();

        wait.until(ExpectedConditions.urlContains("/creator/courses"));

        int savedLessons = queryForInt("""
                SELECT COUNT(*)
                FROM lessons l
                JOIN modules m ON l.module_id = m.module_id
                JOIN courses c ON m.course_id = c.course_id
                WHERE c.title = ? AND l.title = ? AND l.content_type = 'VIDEO' AND l.content_url = ?
                """, title, lessonTitle, videoUrl);

        assertEquals(1, savedLessons, "Video lesson URL must be persisted with the created draft course");
    }

    @Test
    void creatorCanUploadDocumentLessonWhenSavingDraftCourse() throws Exception {
        TestUser creator = register("doccreator");
        setRole(creator.username(), "CREATOR");

        String title = "Document Upload Course " + shortId();
        String lessonTitle = "Uploaded Document Lesson " + shortId();
        Path document = Files.createTempFile("eduspace-e2e-", ".pdf");
        Files.writeString(document, """
                %PDF-1.4
                1 0 obj
                << /Type /Catalog /Pages 2 0 R >>
                endobj
                2 0 obj
                << /Type /Pages /Count 0 >>
                endobj
                trailer
                << /Root 1 0 R >>
                %%EOF
                """);

        login(creator.username());
        driver.get(baseUrl + "/creator/create-course");
        fillCourseOverview(title, "Course with an uploaded document lesson");

        addModule();
        addDocumentLessonWithUpload(lessonTitle, document);
        clickSaveDraft();

        wait.until(ExpectedConditions.urlContains("/creator/courses"));

        int savedLessons = queryForInt("""
                SELECT COUNT(*)
                FROM lessons l
                JOIN modules m ON l.module_id = m.module_id
                JOIN courses c ON m.course_id = c.course_id
                WHERE c.title = ?
                  AND l.title = ?
                  AND l.content_type = 'DOCUMENT'
                  AND (l.content_url LIKE 'http://%' OR l.content_url LIKE 'https://%')
                """, title, lessonTitle);

        assertEquals(1, savedLessons, "Uploaded document lesson must be persisted with a public URL");
    }

    @Test
    void videoLessonRejectsInvalidUrlBeforeSaving() throws Exception {
        TestUser creator = register("invalidvideo");
        setRole(creator.username(), "CREATOR");

        login(creator.username());
        driver.get(baseUrl + "/creator/create-course");
        fillCourseOverview("Invalid Video URL Course " + shortId(), "Course used to validate bad lesson URLs");

        addModule();
        openInlineVideoForm();
        clickPasteVideoLinkMode();
        lessonTitleInput().sendKeys("Invalid URL Lesson");
        videoUrlInput().sendKeys("ftp://invalid-video-url");
        clickInlineConfirm();

        WebElement toast = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("[data-sonner-toast]")));
        assertFalse(toast.getText().isBlank(), "Invalid lesson URL must show a validation toast");
        assertTrue(getCurrentPath().equals("/creator/create-course"),
                "Invalid lesson URL must keep the creator on the course builder");
    }

    @Test
    void learnerCannotOpenCreatorCourseBuilder() throws Exception {
        TestUser learner = register("courselearner");
        setRole(learner.username(), "LEARNER");

        login(learner.username());
        driver.get(baseUrl + "/creator/create-course");

        wait.until(driver -> !getCurrentPath().equals("/creator/create-course"));
        assertFalse(isElementPresent(By.id("course-title")),
                "Learner must not see the Creator course builder");
    }

    @Test
    void creatorCannotOpenAdminCourseModeration() throws Exception {
        TestUser creator = register("securecourse");
        setRole(creator.username(), "CREATOR");

        login(creator.username());
        driver.get(baseUrl + "/admin/courses-management");

        wait.until(driver -> !getCurrentPath().equals("/admin/courses-management"));
        assertFalse(getCurrentPath().equals("/admin/courses-management"),
                "Creator must not stay on the Admin course moderation page");
    }

    @Test
    void pendingCourseIsNotPubliclyVisible() throws Exception {
        TestUser creator = register("pendingcourse");
        setRole(creator.username(), "CREATOR");

        String title = "Private Pending Course " + shortId();

        login(creator.username());
        createPendingCourse(title, "Pending course should not be public yet");

        logout();

        driver.get(baseUrl + "/courses");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("body")));
        assertFalse(driver.findElement(By.tagName("body")).getText().contains(title),
                "Pending course must not be visible on the public course list");
    }

    private void fillCourseOverview(String title, String description) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("course-title"))).sendKeys(title);
        driver.findElement(By.id("course-desc")).sendKeys(description);
    }

    private void clickSaveDraft() {
        driver.findElement(By.xpath("//button[contains(@class,'border-primary') and contains(@class,'text-primary')]"))
                .click();
    }

    private void addModule() {
        wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[contains(@class,'bg-primary/10') and contains(@class,'text-primary')]")))
                .click();
    }

    private void openInlineVideoForm() {
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(., 'Video')]"))).click();
    }

    private void openInlineDocumentForm() {
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("(//button[contains(@class,'border-dashed')])[2]")))
                .click();
    }

    private void clickPasteVideoLinkMode() {
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(., 'link video')]"))).click();
    }

    private WebElement lessonTitleInput() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//input[contains(@placeholder,'Ti') or contains(@placeholder,'lesson') or contains(@placeholder,'bai')]")));
    }

    private WebElement videoUrlInput() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//input[contains(@placeholder,'link video') or contains(@placeholder,'YouTube')]")));
    }

    private void clickInlineConfirm() {
        driver.findElement(By.xpath("//button[contains(., 'X') and contains(., 'c nh')]")).click();
    }

    private void addVideoLessonWithPastedUrl(String lessonTitle, String videoUrl) {
        openInlineVideoForm();
        clickPasteVideoLinkMode();
        lessonTitleInput().sendKeys(lessonTitle);
        videoUrlInput().sendKeys(videoUrl);
        clickInlineConfirm();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//a[contains(@href, '" + videoUrl + "')]")));
    }

    private void addDocumentLessonWithUpload(String lessonTitle, Path document) {
        openInlineDocumentForm();
        lessonTitleInput().sendKeys(lessonTitle);
        WebElement fileInput = driver.findElement(By.cssSelector("input[type='file']"));
        ((JavascriptExecutor) driver).executeScript(
                "arguments[0].classList.remove('hidden'); arguments[0].style.display='block';",
                fileInput);
        fileInput.sendKeys(document.toAbsolutePath().toString());
        new WebDriverWait(driver, Duration.ofSeconds(90))
                .until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("a[href^='http']")));
        clickInlineConfirm();
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[contains(., '" + lessonTitle + "')]")));
    }

    private void createPendingCourse(String title, String description) {
        driver.get(baseUrl + "/creator/create-course");
        fillCourseOverview(title, description);

        driver.findElement(By.xpath("//button[contains(@class,'bg-primary') and contains(@class,'text-white')]"))
                .click();

        WebElement dialog = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("[data-slot='dialog-content']")));
        List<WebElement> submitOptions = dialog.findElements(By.cssSelector(".grid.grid-cols-1 button"));
        assertFalse(submitOptions.isEmpty(), "Course submit dialog must show submit options");
        submitOptions.get(0).click();

        wait.until(ExpectedConditions.urlContains("/creator/courses"));
    }

    private WebElement waitForRowContaining(String text) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//tr[contains(., '" + text + "')]")));
    }

    private boolean isElementPresent(By locator) {
        return !driver.findElements(locator).isEmpty();
    }
}
