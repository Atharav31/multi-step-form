const formData = {
    name: '',
    email: '',
    phone: '',
    plan: '',
    billing: 'Monthly',
    addons: []
};

function nextStep(step) {
    const currentStep = document.querySelector('.step.active');
    const inputs = currentStep.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
            if (input.name) {
                formData[input.name] = input.value.trim();
            }
        }
    });

    if (!isValid) {
        return; // Stop execution if any required field is empty
    }

    currentStep.classList.remove('active');
    document.querySelector(`.step-${step}`).classList.add('active');

    const sidebarItems = document.querySelectorAll('.sidebar li');
    sidebarItems.forEach((item, index) => {
        if (index < step - 1) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    if (step === 4) {
        displaySummary();
    }
}

function prevStep(step) {
    const currentStep = document.querySelector('.step.active');
    currentStep.classList.remove('active');
    document.querySelector(`.step-${step}`).classList.add('active');

    const sidebarItems = document.querySelectorAll('.sidebar li');
    sidebarItems.forEach((item, index) => {
        if (index < step - 1) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function selectPlan(plan) {
    document.querySelectorAll('.plan-card').forEach(card => card.classList.remove('active'));
    document.getElementById(`plan-${plan}`).classList.add('active');
    formData.plan = plan.charAt(0).toUpperCase() + plan.slice(1); // Capitalize the plan name
    updateSummary();
}

function toggleBilling() {
    const isYearly = document.getElementById('billingToggle').checked;
    formData.billing = isYearly ? 'Yearly' : 'Monthly';
    document.querySelectorAll('.monthly-price').forEach(el => el.style.display = isYearly ? 'none' : 'block');
    document.querySelectorAll('.yearly-price').forEach(el => el.style.display = isYearly ? 'block' : 'none');
    updateSummary();
}

function toggleCheckbox(id) {
    const checkbox = document.getElementById(id);
    checkbox.checked = !checkbox.checked;
    updateAddons();
}

function updateAddons() {
    formData.addons = [];
    document.querySelectorAll('.addon-card .form-check-input:checked').forEach(checkbox => {
        const addonLabel = checkbox.nextElementSibling.textContent.trim();
        const addonPrice = checkbox.nextElementSibling.nextElementSibling.textContent.trim();
        formData.addons.push({label: addonLabel, price: addonPrice});
    });
    updateSummary();
}

function displaySummary() {
    const selectedPlanCard = document.querySelector('.plan-card.active');
    if (!selectedPlanCard) {
        alert('Please select a plan.');
        return;
    }

    const selectedPlanName = formData.plan;
    const billingType = formData.billing;

    const labels = formData.addons.map(addon => `<li>${addon.label}</li>`).join('');
    const prices = formData.addons.map(addon => `<li>${addon.price}</li>`).join('');

    const summaryContent = `
        <div class="card mb-3">
            <div class="card-header selplan">
                ${selectedPlanName} (${billingType})
                <p class="card-text text-right">${billingType === 'Yearly' ? document.querySelector('.plan-card.active .yearly-price').textContent.trim() : document.querySelector('.plan-card.active .monthly-price').textContent.trim()}</p>
                <button type="button" class="btn btn-back1" onclick="prevStep(2)">Change Plan</button>
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between des">
                    <ul class="list-unstyled">
                        ${labels}
                    </ul>
                    <ul class="list-unstyled text-right selplan">
                        ${prices}
                    </ul>
                </div>
                <div class="des">
                    <p class="card-text text-left"><strong>Total (per ${billingType})</strong></p>
                    <p class="text-right "><strong>$${billingType === 'Yearly' ? calculateYearlyPrice() : calculateMonthlyPrice()}</strong></p>
                </div>
            </div>
        </div>
    `;

    document.getElementById('summary').innerHTML = summaryContent;
}

function calculateMonthlyPrice() {
    let totalMonthlyPrice = parseFloat(document.querySelector('.plan-card.active .monthly-price').textContent.replace(/[^\d.-]/g, ''));
    formData.addons.forEach(addon => {
        const price = parseFloat(addon.price.replace(/[^\d.-]/g, ''));
        totalMonthlyPrice += price;
    });
    return totalMonthlyPrice.toFixed(2);
}

function calculateYearlyPrice() {
    let totalYearlyPrice = parseFloat(document.querySelector('.plan-card.active .yearly-price').textContent.replace(/[^\d.-]/g, ''));
    formData.addons.forEach(addon => {
        const price = parseFloat(addon.price.replace(/[^\d.-]/g, ''));
        totalYearlyPrice += price;
    });
    return totalYearlyPrice.toFixed(2);
}

document.getElementById('billingToggle').addEventListener('change', toggleBilling);
document.querySelectorAll('.plan-card').forEach(card => card.addEventListener('click', () => {
    const plan = card.id.split('-')[1];
    selectPlan(plan);
}));
document.querySelectorAll('.addon-card .form-check-input').forEach(checkbox => checkbox.addEventListener('change', () => {
    const id = checkbox.id;
    toggleCheckbox(id);
}));
function confirm() {
    // Display the thank you message
    document.querySelector('.step.active').classList.remove('active');
    document.querySelector('.step-5').classList.add('active');
}