// ==================================== BHARATHI VIDYALAYA HOME PAGE SCRIPT ====================================
document.addEventListener('DOMContentLoaded', () => {
    
    // ========================= STICKY HEADER SHADOW ON SCROLL =========================
    const siteHeader = document.getElementById('siteHeader')
    if (siteHeader) {
        const toggleHeaderShoadow = () => {
            siteHeader.classList.toggle ('is-scrolled', window.scrollY > 8)
        };
        toggleHeaderShoadow()
        window.addEventListener('scroll', toggleHeaderShoadow, { passive:true })
    }    
})
// ============================ ACTIVATE NAV LINK ===============================
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
    const navLinks = document.querySelectorAll(".desktop-nav a, .mobile-nav a");

    navLinks.forEach((link) => {
        const href = link.getAttribute('href');

        if (!href) return;
        const linkPage = href.split('/').pop().toLowerCase() || 'index.html';

        if (linkPage === currentPage){
            link.classList.add('active')
        }
        else {
            link.classList.remove('active')
        }
    });
});

// ================================= MOBILE NAV TOGGLE =================================

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');

    if (!menuToggle || !mobileNav) return;
    
    menuToggle.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle ('open')
        menuToggle.setAttribute('aria-expanded', isOpen)
    });
    // Close mobile menu when a navigation link is clicked
    const mobileLinks = mobileNav.querySelectorAll('a')
    mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove( 'open')
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
});

// ========================================= HERO SLIDER =========================================

document.addEventListener("DOMContentLoaded", () => {
    const heroSlider = document.querySelector(".hero-slider");
    const slides = document.querySelectorAll(".hero-slide");
    const prevButton = document.getElementById("prevSlider");
    const nextButton = document.getElementById("nextSlider");
    const dotsContainer = document.getElementById("sliderDots");
    const currentSlideNumber = document.getElementById("currentSlideNumber");
    const totalSlidesNumber = document.getElementById("totalSlidesNumber");

    // Stop if the slider elements don't exist
    if (!heroSlider || !slides.length || !prevButton || !nextButton || !dotsContainer) {
        return;
    }

    let currentIndex = 0;
    let autoSlideTimer = null;

    const totalSlides = slides.length;

    // SETTINGS
    const AUTO_SLIDE_DELAY = 5000;
    const RESUME_DELAY = 7000;

    // Check user's motion preference
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // INITIAL SETUP 
    if (totalSlidesNumber) {
        totalSlidesNumber.textContent = String(totalSlides).padStart(2, "0");
    }

    // CREATE DOTS
    slides.forEach((_, index) => {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "slider-dot";

        if (index === 0) {
            dot.classList.add("active");
        }

        dot.addEventListener("click", () => {
            goToSlide(index);
            restartAutoSlide();
        });

        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".slider-dot");

    // SHOW SLIDES
    function showSlide(index) {
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle("active", slideIndex === index);
        });

        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === index;

            dot.classList.toggle("active", isActive);

            if (isActive) {
                dot.setAttribute("aria-current", "true");
            }
            else {
                dot.removeAttribute("aria-current");
            }
        });

        if (currentSlideNumber) {
            currentSlideNumber.textContent = String(index + 1).padStart( 2,"0");
        }

        currentIndex = index;
    }

    // GOTO SPECIFIC SLIDE
    function goToSlide(index) {
        if (index < 0) {
            index = totalSlides - 1;
        }

        if (index >= totalSlides) {
            index = 0;
        }

        showSlide(index);
    }

    // NEXT SLIDE
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    // PREVIOUS SLIDE
    function previousSlide() {
        goToSlide(currentIndex - 1);
    }

    // BUTTON EVENTS
    nextButton.addEventListener("click", () => {
        nextSlide();
        restartAutoSlide();
    });

    prevButton.addEventListener("click", () => {
        previousSlide();
        restartAutoSlide();
    });

    // AUTO SLIDE
    function startAutoSlide() {
        if (reducedMotion || autoSlideTimer !== null) {
            return;
        }

        autoSlideTimer = setInterval(() => {
            nextSlide();
        }, AUTO_SLIDE_DELAY);
    }

    function stopAutoSlide() {
        if (autoSlideTimer !== null) {
            clearInterval(autoSlideTimer);
            autoSlideTimer = null;
        }
    }

    function restartAutoSlide() {
        if (reducedMotion) {
            return;
        }

        stopAutoSlide();

        setTimeout(() => {
            startAutoSlide();
        }, RESUME_DELAY);
    }

    // PAUSE WHEN MOUSE IS OVER SLIDER
    heroSlider.addEventListener("mouseenter", () => {
        stopAutoSlide();
    });

    heroSlider.addEventListener("mouseleave", () => {
        startAutoSlide();
    });

    // KEYBOARD CONTROLS
    document.addEventListener("keydown", (event) => {
        // Don't change slides when typing inside a form/input
        const activeElement = document.activeElement;

        if (
            activeElement && ( activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA" || activeElement.tagName === "SELECT")
        ) {
            return;
        }

        if (event.key === "ArrowRight") {
            nextSlide();
            restartAutoSlide();
        }

        if (event.key === "ArrowLeft") {
            previousSlide();
            restartAutoSlide();
        }
    });

    // TOUCH / SWIPE SUPPORT
    let touchStartX = 0;
    let touchEndX = 0;

    heroSlider.addEventListener( "touchstart", (event) => { 
            touchStartX = event.changedTouches[0].screenX;
            stopAutoSlide();
        },
        { passive: true }
    );

    heroSlider.addEventListener( "touchend", (event) => {
            touchEndX = event.changedTouches[0].screenX;
            handleSwipe();
            restartAutoSlide();
        },
        { passive: true }
    );

    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;

        // Minimum swipe distance
        if (Math.abs(swipeDistance) < 50) {
            return;
        }

        if (swipeDistance < 0) {
            // Swipe left → next
            nextSlide();
        }
        else {
            // Swipe right → previous
            previousSlide();
        }
    }

    // INITIALIZE
    showSlide(0);
    if (!reducedMotion) {
        startAutoSlide();
    }
});

// ============================= ADMISSION ENQUIRY MODAL =============================
document.addEventListener("DOMContentLoaded", () => {
    const enquiryModal = document.getElementById("enquiry-model") || document.getElementById("enquiryModel");
    const modalClose = enquiryModal?.querySelector(".model-close");
    const modalBackdrop = enquiryModal?.querySelector(".model-backdrop");

    // Stop if modal doesn't exist
    if (!enquiryModal) {
        return;
    }

    // OPEN MODAL
    function openEnquiryModal() {
        enquiryModal.classList.add("open");

        // Prevent background page from scrolling
        document.body.style.overflow = "hidden";

        // Move keyboard focus to close button
        if (modalClose) {
            setTimeout(() => {
                modalClose.focus();
            }, 100);
        }
    }

    // CLOSE MODAL
    function closeEnquiryModal() {
        enquiryModal.classList.remove("open");

        // Restore background page scrolling
        document.body.style.overflow = "";
    }

    // FIND ALL ENQUIRY BUTTONS
    const enquiryButtons = document.querySelectorAll(
        ".nav-enquiry, " +
        ".mobile-enquiry, " +
        ".hero-actions .btn-primary, " +
        ".home-cta .btn-light"
    );

    // Add click event to every enquiry button
    enquiryButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            openEnquiryModal();
        });
    });

    // CLOSE BUTTON
    if (modalClose) {
        modalClose.addEventListener("click", () => {
            closeEnquiryModal();
        });
    }

    // CLICK BACKDROP TO CLOSE  
    if (modalBackdrop) {
        modalBackdrop.addEventListener("click", () => {
            closeEnquiryModal();
        });
    }

    // ESCAPE KEY TO CLOSE
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && enquiryModal.classList.contains("open")) {
            closeEnquiryModal();
        }
    });
});

// =========================================== ADMISSION ENQUIRY FORM VALIDATION ===========================================

document.addEventListener("DOMContentLoaded", () => {
    const enquiryForm = document.getElementById("inquiryForm");
    if (!enquiryForm) return;
    const parentName = document.getElementById("parentName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const classApplying = document.getElementById("classApplying");
    const address = document.getElementById("address");


    // ERROR MESSAGE
    function showError(field, message) {
        clearError(field);

        field.classList.add("input-error");

        const error = document.createElement("small");
        error.className = "form-error";
        error.textContent = message;

        field.parentElement.appendChild(error);
    }

    // CLEAR ERROR
    function clearError(field) {
        field.classList.remove("input-error");

        const error = field.parentElement.querySelector(".form-error");

        if (error) {
            error.remove();
        }
    }

    // NAME VALIDATION
    function validateName() {
        const value = parentName.value.trim();

        if (value === "") {
            showError(
                parentName,
                "Please enter the child's / parent's name."
            );
            return false;
        }

        // Only English letters and spaces
        if (!/^[A-Za-z\s]+$/.test(value)) {
            showError(
                parentName,
                "Name must contain letters only."
            );
            return false;
        }

        // Prevent names containing only spaces
        if (value.length < 2) {
            showError(
                parentName,
                "Name must contain at least 2 characters."
            );
            return false;
        }

        clearError(parentName);
        return true;
    }

    // EMAIL VALIDATION
    email.addEventListener("keydown", (event) => {

    const allowedKeys = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
        "Tab"
    ];

    if (allowedKeys.includes(event.key)) {
        return;
    }

    if (email.value.length >= 40) {

        event.preventDefault();

        showError(
            email,
            "Email address must not exceed 40 characters."
        );
    }
});


    // EMAIL VALIDATION

    function validateEmail() {

        const value = email.value.trim();

        // Email is optional
        if (value === "") {
            clearError(email);
            return true;
        }

        // Maximum 40 characters validation
        if (value.length > 40) {
            showError(
                email,
                "Email address must not exceed 40 characters."
            );
            return false;
        }

        // Basic email format validation
        const emailPattern =
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if (!emailPattern.test(value)) {
            showError(
                email,
                "Please enter a valid email address."
            );
            return false;
        }

        const allowedDomains = [
            "com",
            "co",
            "in",
            "org",
            "net",
            "edu",
            "gov"
        ];

        const domainExtension = value
            .split("@")[1]
            .split(".")
            .pop()
            .toLowerCase();

        if (!allowedDomains.includes(domainExtension)) {
            showError(
                email,
                "Only .com, .co, .in, .org, .net, .edu and .gov domains are accepted."
            );
            return false;
        }

        clearError(email);
        return true;
    }

    // LIVE EMAIL VALIDATION
    email.addEventListener("input", () => {
        validateEmail();
    });

    email.addEventListener("blur", () => {
        validateEmail();
    });
    // PHONE VALIDATION
    function validatePhone() {
        const value = phone.value.trim();

        if (value === "") {
            showError(
                phone,
                "Please enter your 10-digit phone number."
            );
            return false;
        }

        // Check if anything other than digits exists
        if (!/^\d+$/.test(value)) {
            showError(
                phone,
                "Phone number must contain digits only."
            );
            return false;
        }

        // Check exactly 10 digits
        if (value.length !== 10) {
            showError(
                phone,
                "Phone number must contain exactly 10 digits."
            );
            return false;
        }

        // Indian mobile numbers must start with 6, 7, 8 or 9
        if (!/^[6-9]/.test(value)) {
            showError(
                phone,
                "Phone number must start with 6, 7, 8 or 9."
            );
            return false;
        }

        clearError(phone);
        return true;
    }

    // CLASS VALIDATION
    function validateClass() {
        const value = classApplying.value.trim();

        if (value === "") {
            showError(
                classApplying,
                "Please select a class."
            );
            return false;
        }

        clearError(classApplying);
        return true;
    }

    // GENDER VALIDATION
    function validateGender() {
        // Gender is optional.
        // No validation is required.

        return true;
    }

    // ADDRESS VALIDATION
    function validateAddress() {
        const value = address.value.trim();

        // Address is optional
        if (value === "") {
            clearError(address);
            return true;
        }

        // If entered, minimum 10 characters
        if (value.length < 10) {
            showError(
                address,
                "Address must contain at least 10 characters."
            );
            return false;
        }

        clearError(address);
        return true;
    }

    // FORM SUBMISSION 
    enquiryForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const nameValid = validateName();
        const emailValid = validateEmail();
        const phoneValid = validatePhone();
        const classValid = validateClass();
        const genderValid = validateGender();
        const addressValid = validateAddress();

        const formIsValid = nameValid && emailValid && phoneValid && classValid && genderValid && addressValid;

        if (!formIsValid) {

            // Focus first invalid field
            const firstInvalidField =
                enquiryForm.querySelector(".input-error");

            if (firstInvalidField) {
                firstInvalidField.focus();
            }

            return;
        }

        // ========== SUCCESS: Show message + close modal ==========
        const modal = document.getElementById("enquiry-model") || document.getElementById("enquiryModel");
        const formDialog = enquiryForm.closest(".model-dialog");

        // Create success message
        const successBox = document.createElement("div");
        successBox.className = "enquiry-success";
        successBox.innerHTML = `
        <div style="text-align:center; padding: 30px 10px;">
            <div style="font-size: 3rem; margin-bottom: 12px;">✓</div>
            <h3 style="font-family:'Fraunces',serif; color:#2B2620; margin-bottom:10px;">
            Enquiry Submitted!
            </h3>
            <p style="color:#5B5346; margin:0 0 20px;">
            Thank you. The school team will contact you soon.
            </p>
            <button type="button" class="btn btn-primary" id="successCloseBtn"
            style="padding:12px 28px; border-radius:100px; background:#4C9A5B; color:#fff; font-weight:800;">
            Close
            </button>
        </div>
        `;

        // Hide the form and show success
        enquiryForm.style.display = "none";
        const heading = formDialog.querySelector(".model-heading");
        if (heading) heading.style.display = "none";

        formDialog.appendChild(successBox);

        // Close button
        document.getElementById("successCloseBtn").addEventListener("click", () => {
            closeAndReset();
        });

        // Auto close after 4 seconds
        const autoClose = setTimeout(() => {
            closeAndReset();
        }, 4000);

        function closeAndReset() {
        clearTimeout(autoClose);

        // Close modal
        if (modal) {
            modal.classList.remove("open");
            document.body.style.overflow = "";
        }

        // Reset form for next time
        enquiryForm.reset();
        enquiryForm.style.display = "";
        if (heading) heading.style.display = "";
        successBox.remove();

        // Clear any previous error styles
        enquiryForm.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
        enquiryForm.querySelectorAll(".form-error").forEach(el => el.remove());
        }    });

    // LIVE NAME VALIDATION
    parentName.addEventListener("input", () => {

        parentName.value = parentName.value.replace(
            /[^A-Za-z\s]/g,
            ""
        );

        validateName();
    });

    // LIVE EMAIL VALIDATION
    email.addEventListener("input", () => {
        validateEmail();
    });

    // LIVE PHONE VALIDATION
    phone.addEventListener("input", () => {

        phone.value = phone.value.replace(/\D/g, "");

        if (phone.value.length > 10) {
            phone.value = phone.value.slice(0, 10);
        }

        validatePhone();
    });

    // CLASS LIVE VALIDATION
    classApplying.addEventListener("change", () => {
        validateClass();
    });

    // ADDRESS LIVE VALIDATION
    address.addEventListener("input", () => {
        validateAddress();
    });
});

// ================================= SEND A MESSAGE FORM VALIDATION =================================
document.addEventListener('DOMContentLoaded', () => {

    const messageForm = document.getElementById('homeMessageForm');

    const contactName = document.getElementById('homeContactName');
    const contactPhone = document.getElementById('homeContactPhone');
    const contactEmail = document.getElementById('homeContactEmail');
    const contactTopic = document.getElementById('homeContactTopic');
    const contactMessage = document.getElementById('homeContactMessage');

    // Stop if form doesn't exist
    if (!messageForm) return;
    
    // SHOW ERROR MESSAGE
    function showErrorMessage(field, message) {

        clearError(field);

        field.classList.add('input-error');

        const error = document.createElement('small');

        error.className = 'form-error';
        error.textContent = message;

        field.parentElement.appendChild(error);
    }

    // CLEAR ERROR MESSAGE
    function clearError(field) {

        field.classList.remove('input-error');

        const error =
            field.parentElement.querySelector('.form-error');

        if (error) {
            error.remove();
        }
    }

    contactEmail.addEventListener('keydown', (event) => {

    const allowedKeys = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
        "Tab"
    ];

    if (allowedKeys.includes(event.key)) {
        return;
    }

    if (contactEmail.value.length >= 40) {
        event.preventDefault();

        showErrorMessage(
            contactEmail,
            "Email address must not exceed 40 characters."
        );
    }
});

    // NAME VALIDATION
    function validateContactName() {
        const value = contactName.value.trim();
        if (value === '') {
            showErrorMessage(
                contactName,
                'Please enter your name.'
            );
            return false;
        }

        // Only letters and spaces
        if (!/^[A-Za-z\s]+$/.test(value)) {
            showErrorMessage(
                contactName,
                'Name must contain letters only.'
            );
            return false;
        }

        // Minimum 2 characters
        if (value.length < 2) {
            showErrorMessage(
                contactName,
                'Name must contain at least 2 characters.'
            );
            return false;
        }
        clearError(contactName);
        return true;
    }

    // PHONE VALIDATION
    function validateContactPhone() {

        const value = contactPhone.value.trim();

        if (value === '') {

            showErrorMessage(
                contactPhone,
                'Please enter your phone number.'
            );

            return false;
        }

        // Digits only
        if (!/^\d+$/.test(value)) {

            showErrorMessage(
                contactPhone,
                'Phone number must contain digits only.'
            );

            return false;
        }

        // Exactly 10 digits
        if (value.length !== 10) {

            showErrorMessage(
                contactPhone,
                'Phone number must contain exactly 10 digits.'
            );

            return false;
        }

        // Indian mobile number
        if (!/^[6-9]/.test(value)) {

            showErrorMessage(
                contactPhone,
                'Phone number must start with 6, 7, 8 or 9.'
            );

            return false;
        }

        clearError(contactPhone);

        return true;
    }

    // EMAIL VALIDATION

    function validateContactEmail() {

        const value = contactEmail.value.trim();

        if (value === '') {
            showErrorMessage(
                contactEmail,
                'Please enter your email address.'
            );
            return false;
        }

        // Maximum 40 characters
        if (value.length > 40) {
            showErrorMessage(
                contactEmail,
                'Email address must not exceed 40 characters.'
            );
            return false;
        }

        // Allowed email domains
        const emailPattern =
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|co|in|org|net|edu|gov)$/i;

        if (!emailPattern.test(value)) {
            showErrorMessage(
                contactEmail,
                'Please enter a valid email address.'
            );
            return false;
        }

        clearError(contactEmail);
        return true;
    }

    // TOPIC VALIDATION
    function validateContactTopic() {

        const value = contactTopic.value.trim();

        if (value === '') {

            showErrorMessage(
                contactTopic,
                'Please select a topic.'
            );

            return false;
        }

        clearError(contactTopic);

        return true;
    }

    // MESSAGE VALIDATION
    function validateContactMessage() {

        const value = contactMessage.value.trim();

        if (value === '') {

            showErrorMessage(
                contactMessage,
                'Please enter your message.'
            );

            return false;
        }

        if (value.length < 10) {

            showErrorMessage(
                contactMessage,
                'Message must contain at least 10 characters.'
            );

            return false;
        }

        clearError(contactMessage);

        return true;
    }

    // FORM SUBMISSION
    messageForm.addEventListener('submit', (event) => {

        event.preventDefault();

        const nameValid = validateContactName();
        const phoneValid = validateContactPhone();
        const emailValid = validateContactEmail();
        const topicValid = validateContactTopic();
        const messageValid = validateContactMessage();

        const formIsValid = nameValid && phoneValid && emailValid && topicValid && messageValid;

        // INVALID FORM
        if (!formIsValid) {

            const firstInvalidField =
                messageForm.querySelector('.input-error');

            if (firstInvalidField) {
                firstInvalidField.focus();
            }

            return;
        }

        // VALID FORM
        // ========== SUCCESS MESSAGE (inline form) ==========
        const messageWrapper = messageForm.closest(".home-message-wrapper");
        const messageHeading = messageWrapper.querySelector(".home-message-heading");

        // Create success box
        const successBox = document.createElement("div");
        successBox.className = "message-success";
        successBox.innerHTML = `
        <div style="text-align:center; padding: 40px 20px;">
            <div style="
            width: 64px; height: 64px; margin: 0 auto 18px;
            border-radius: 50%; background: #E8F5E4;
            display: flex; align-items: center; justify-content: center;
            font-size: 1.8rem; color: #4C9A5B; font-weight: 700;
            ">✓</div>
            <h3 style="
            font-family: 'Fraunces', serif;
            font-size: 1.4rem;
            color: #2B2620;
            margin: 0 0 10px;
            ">Message Sent!</h3>
            <p style="
            color: #5B5346;
            margin: 0 0 24px;
            font-size: 0.98rem;
            line-height: 1.5;
            ">
            Thank you for contacting us.<br>
            Our team will get back to you soon.
            </p>
            <button type="button" id="sendAnotherBtn" style="
            padding: 12px 28px;
            border-radius: 100px;
            background: #4C9A5B;
            color: #fff;
            font-weight: 800;
            font-size: 0.92rem;
            border: none;
            cursor: pointer;
            ">Send Another Message</button>
        </div>
        `;

        // Hide form + heading, show success
        messageForm.style.display = "none";
        if (messageHeading) messageHeading.style.display = "none";
        messageWrapper.appendChild(successBox);

        // "Send Another Message" button
        document.getElementById("sendAnotherBtn").addEventListener("click", () => {
        successBox.remove();
        messageForm.style.display = "";
        if (messageHeading) messageHeading.style.display = "";
        messageForm.reset();

        // Clear any leftover error styles
        messageForm.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
        messageForm.querySelectorAll(".form-error").forEach(el => el.remove());
        });

        // Successful submission code will be added here later.
    });

    // LIVE NAME VALIDATION 
    contactName.addEventListener('input', () => {

        // Remove numbers and symbols
        contactName.value =
            contactName.value.replace(/[^A-Za-z\s]/g, '');

        validateContactName();
    });

    // LIVE PHONE VALIDATION
    contactPhone.addEventListener('input', () => {

        // Remove anything except numbers
        contactPhone.value =
            contactPhone.value.replace(/\D/g, '');

        // Maximum 10 digits
        if (contactPhone.value.length > 10) {

            contactPhone.value =
                contactPhone.value.slice(0, 10);
        }

        validateContactPhone();
    });

    // LIVE EMAIL VALIDATION
    contactEmail.addEventListener('input', () => {

        validateContactEmail();
    });

    contactEmail.addEventListener('blur', () => {
    validateContactEmail();
    });

    // LIVE TOPIC VALIDATION
    contactTopic.addEventListener('change', () => {

        validateContactTopic();
    });

    // LIVE CONTACT VALIDATION
    contactMessage.addEventListener('input', () => {

        validateContactMessage();
    });
});