// ============================== BHARATHI VIDYALAYA ABOUT JS PAGE & LEADERSHIP JS PAGE ==============================

// ============================ ACTIVATE NAV LINK ===============================
document.addEventListener('DOMContentLoaded', ()=>{
    const currentPage = window.location.pathname.split('/').pop().toLocaleLowerCase() || 'about.html'
    const navLink = document.querySelectorAll(".desktop-nav a, .mobile-nav a")

    navLink.forEach((link)=>{
        const href = link.getAttribute('href')
        
        if (!href) return;

        const linkPage = href.split('/').pop().toLowerCase() || 'about.html';

        if(linkPage === currentPage){
            link.classList.add('active')
        }
        else{
            link.classList.remove('active')
        }
    })

    // ================================= MOBILE NAV TOGGLE =================================
        const menuToggle = document.getElementById('menuToggle');
        const mobileNav = document.getElementById('mobileNav');

        if(!menuToggle || !mobileNav) return

        menuToggle.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle ('open')
            menuToggle.setAttribute('aria-expanded', isOpen)
        })

        // Close mobile menu when a navigation link is clicked
        const mobileLinks = mobileNav.querySelectorAll('a')
        mobileLinks.forEach((link) => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove( 'open')
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        
    // ======================================= ENQUIRY MODAL =======================================
    const enquiryModal = document.getElementById("enquiryModel");
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

    // =========================================== ADMISSION ENQUIRY FORM VALIDATION ===========================================
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
        }
    });

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
const glimpseTrack = document.getElementById("glimpseTrack");
const glimpseSlides = document.querySelectorAll(".glimpse-slide");
const glimpsePrev = document.getElementById("glimpsePrev");
const glimpseNext = document.getElementById("glimpseNext");

let currentIndex = 0;

function updateGlimpseCarousel() {
    const slideWidth = glimpseSlides[0].offsetWidth;

    glimpseTrack.style.transform =
        `translateX(-${currentIndex * slideWidth}px)`;
}

// Next
glimpseNext.addEventListener("click", () => {
    currentIndex++;

    if (currentIndex >= glimpseSlides.length) {
        currentIndex = 0;
    }

    updateGlimpseCarousel();
});

// Previous
glimpsePrev.addEventListener("click", () => {
    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = glimpseSlides.length - 1;
    }

    updateGlimpseCarousel();
});

window.addEventListener("resize", updateGlimpseCarousel);
    
})
