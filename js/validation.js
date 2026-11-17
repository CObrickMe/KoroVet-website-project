// === 1. ЕЛЕМЕНТИ DOM ===
const form = document.getElementById('appointmentForm');
const phoneInput = document.getElementById('userPhone');
const phoneError = document.getElementById('userPhoneError');

const successModal = document.getElementById('successModal');
const modalContent = document.getElementById('modalContent');
const closeModalBtn = document.getElementById('closeModalBtn');

// === 2. ЗМІННІ СТАНУ ===
let isPhoneTouched = false;
let previousActiveElement;

// === 3. ЛОГІКА ВАЛІДАЦІЇ ТЕЛЕФОНУ ===
function validatePhone() {
    const val = phoneInput.value;
    // Витягуємо лише цифри
    const digitsOnly = val.replace(/\D/g, '');

    let isFormatValid = false;
    let errorMessage = "Введіть коректний номер телефону";

    if (digitsOnly.startsWith('380') && digitsOnly.length === 12) {
        isFormatValid = true;
    } else if (digitsOnly.startsWith('0') && digitsOnly.length === 10) {
        isFormatValid = true;
    } else if (digitsOnly.length > 12) {
        errorMessage = "Забагато цифр у номері";
    } else if (digitsOnly.length > 0 && digitsOnly.length < 10) {
        errorMessage = "Номер занадто короткий";
    }

    // Управління станами UI
    if (!isFormatValid) {
        phoneInput.setAttribute('aria-invalid', 'true');
        phoneInput.removeAttribute('data-valid');
        phoneError.textContent = errorMessage;
        phoneError.classList.remove('hidden');
    } else {
        phoneInput.setAttribute('aria-invalid', 'false'); // Підтримка a11y
        phoneInput.setAttribute('data-valid', 'true');
        phoneError.classList.add('hidden');
    }

    return isFormatValid;
}

// Подія input: блокує літери та динамічно перевіряє, якщо поле вже "забруднене"
phoneInput.addEventListener('input', (e) => {
    const cleanedValue = e.target.value.replace(/[^\d\+\s\(\)\-]/g, '');
    if (e.target.value !== cleanedValue) {
        e.target.value = cleanedValue;
    }
    if (isPhoneTouched) {
        validatePhone();
    }
});

// Подія blur: фінальна перевірка при втраті фокусу та форматування
phoneInput.addEventListener('blur', (e) => {
    isPhoneTouched = true;
    const isValid = validatePhone();

    if (isValid) {
        const digitsOnly = e.target.value.replace(/\D/g, '');
        if (digitsOnly.startsWith('0') && digitsOnly.length === 10) {
            e.target.value = '+38' + digitsOnly;
        } else if (digitsOnly.startsWith('380') && digitsOnly.length === 12) {
            e.target.value = '+' + digitsOnly;
        }
    }
});


// === 4. ЛОГІКА МОДАЛЬНОГО ВІКНА ===
function openModal() {
    previousActiveElement = document.activeElement;

    successModal.classList.remove('hidden');
    successModal.classList.add('flex');
    successModal.setAttribute('aria-hidden', 'false');

    requestAnimationFrame(() => {
        successModal.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95', 'opacity-0');
    });

    closeModalBtn.focus();
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleModalKeydown);
}

function closeModal() {
    successModal.classList.add('opacity-0');
    modalContent.classList.add('scale-95', 'opacity-0');
    successModal.setAttribute('aria-hidden', 'true');

    setTimeout(() => {
        successModal.classList.add('hidden');
        successModal.classList.remove('flex');
        document.body.style.overflow = '';

        if (previousActiveElement) {
            previousActiveElement.focus();
        }
    }, 300);

    document.removeEventListener('keydown', handleModalKeydown);

    // Очищаємо форму після закриття
    form.reset();

    // Скидаємо стани валідації телефону до початкових, 
    // щоб після очищення форми поле не світилося зеленим чи червоним
    isPhoneTouched = false;
    phoneInput.removeAttribute('data-valid');
    phoneInput.setAttribute('aria-invalid', 'false');
    phoneError.classList.add('hidden');
}

function handleModalKeydown(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
    if (event.key === 'Tab') {
        event.preventDefault();
        closeModalBtn.focus();
    }
}

closeModalBtn.addEventListener('click', closeModal);

successModal.addEventListener('click', (event) => {
    if (event.target === successModal) {
        closeModal();
    }
});


// === 5. ВІДПРАВКА ФОРМИ ===
form.addEventListener('submit', (event) => {
    // 1. ЗАВЖДИ зупиняємо стандартне оновлення сторінки
    event.preventDefault();

    // 2. Запускаємо нашу кастомну перевірку телефону
    isPhoneTouched = true;
    const isPhoneValid = validatePhone();

    // 3. Перевіряємо вбудовану валідацію браузера (required, email)
    if (!form.checkValidity()) {
        // Якщо якесь поле порожнє, примусово показуємо стандартні підказки браузера
        form.reportValidity();
        return; // Зупиняємо подальші дії, чекаємо поки користувач виправить
    }

    // 4. Якщо стандартні поля заповнені, але номер телефону неправильний
    if (!isPhoneValid) {
        phoneInput.focus(); // Фокусуємо на телефоні
        return;
    }

    // 5. Якщо ВСІ поля валідні — відкриваємо модальне вікно
    openModal();
});