document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calc-form');
    const petTypeSelect = document.getElementById('calc-pet-type');
    const serviceSelect = document.getElementById('calc-service');
    const weightInput = document.getElementById('calc-pet-weight');
    const totalPriceOutput = document.getElementById('calc-total-price');
    const errorArea = document.getElementById('calc-error-area');
    const errorMessage = document.getElementById('calc-error-message');

    if (
        !form ||
        !petTypeSelect ||
        !serviceSelect ||
        !weightInput ||
        !totalPriceOutput ||
        !errorArea ||
        !errorMessage
    ) {
        return;
    }

    const PET_PRICES = Object.freeze({
        cat: 0,
        dog: 150,
        rodent: 50,
        bird: 100,
    });

    const SERVICE_PRICES = Object.freeze({
        checkup: 400,
        vaccination: 650,
        ultrasound: 800,
        tests: 500,
        surgery: 2000,
    });

    const WEIGHT_CONFIG = Object.freeze({
        MIN: 0.1,
        MAX: 100,
        PRICE_PER_KG: 20,
    });

    const EMPTY_RESULT = '—';
    const BLOCKED_KEYS = new Set(['e', 'E', '+', '-']);

    const priceFormatter = new Intl.NumberFormat('uk-UA', {
        maximumFractionDigits: 0,
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorArea.classList.remove('hidden');
    }

    function hideError() {
        errorMessage.textContent = '';
        errorArea.classList.add('hidden');
    }

    function resetTotal() {
        totalPriceOutput.textContent = EMPTY_RESULT;
    }

    function hasKey(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    }

    function parseWeight(rawValue) {
        const normalized = rawValue.trim().replace(',', '.');
        if (normalized === '') {
            return { status: 'empty', value: null };
        }

        const parsed = Number(normalized);
        if (!Number.isFinite(parsed)) {
            return { status: 'invalid', value: null };
        }

        if (parsed <= 0) {
            return { status: 'non_positive', value: parsed };
        }

        if (parsed < WEIGHT_CONFIG.MIN || parsed > WEIGHT_CONFIG.MAX) {
            return { status: 'out_of_range', value: parsed };
        }

        return { status: 'valid', value: parsed };
    }

    function calculatePrice() {
        const petType = petTypeSelect.value;
        const service = serviceSelect.value;
        const weightState = parseWeight(weightInput.value);

        if (weightState.status === 'invalid') {
            resetTotal();
            showError('Введіть коректне числове значення ваги тварини.');
            return;
        }

        if (weightState.status === 'non_positive') {
            resetTotal();
            showError('Вага тварини повинна бути більшою за 0 кг.');
            return;
        }

        if (weightState.status === 'out_of_range') {
            resetTotal();
            showError(
                `Допустима вага тварини — від ${WEIGHT_CONFIG.MIN} до ${WEIGHT_CONFIG.MAX} кг.`
            );
            return;
        }

        const isPetValid = hasKey(PET_PRICES, petType);
        const isServiceValid = hasKey(SERVICE_PRICES, service);

        if (!isPetValid || !isServiceValid || weightState.status === 'empty') {
            resetTotal();
            hideError();
            return;
        }

        const total = Math.round(
            PET_PRICES[petType] +
            SERVICE_PRICES[service] +
            weightState.value * WEIGHT_CONFIG.PRICE_PER_KG
        );

        if (!Number.isFinite(total) || total < 0) {
            resetTotal();
            showError('Не вдалося виконати розрахунок. Перевірте введені дані.');
            return;
        }

        hideError();
        totalPriceOutput.textContent = `${priceFormatter.format(total)} грн`;
    }

    weightInput.addEventListener('keydown', (event) => {
        if (BLOCKED_KEYS.has(event.key)) {
            event.preventDefault();
        }
    });

    petTypeSelect.addEventListener('change', calculatePrice);
    serviceSelect.addEventListener('change', calculatePrice);
    weightInput.addEventListener('input', calculatePrice);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
    });
});