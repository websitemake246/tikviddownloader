// Data plans for each network
const dataPlans = {
    mtn: [
        { name: "500MB", details: "30 days validity", price: 500, popular: false },
        { name: "1GB", details: "30 days validity", price: 1000, popular: true },
        { name: "2GB", details: "30 days validity", price: 1200, popular: false },
        { name: "5GB", details: "30 days validity", price: 2500, popular: false },
        { name: "10GB", details: "30 days validity", price: 4500, popular: false },
        { name: "1GB", details: "7 days validity", price: 300, popular: false }
    ],
    airtel: [
        { name: "500MB", details: "30 days validity", price: 500, popular: false },
        { name: "1GB", details: "30 days validity", price: 1000, popular: true },
        { name: "2GB", details: "30 days validity", price: 1200, popular: false },
        { name: "5GB", details: "30 days validity", price: 2500, popular: false },
        { name: "10GB", details: "30 days validity", price: 4500, popular: false }
    ],
    glo: [
        { name: "1GB", details: "30 days validity", price: 800, popular: true },
        { name: "2GB", details: "30 days validity", price: 1000, popular: false },
        { name: "5GB", details: "30 days validity", price: 2000, popular: false },
        { name: "10GB", details: "30 days validity", price: 4000, popular: false }
    ],
    "9mobile": [
        { name: "500MB", details: "30 days validity", price: 500, popular: false },
        { name: "1GB", details: "30 days validity", price: 1000, popular: true },
        { name: "2GB", details: "30 days validity", price: 1200, popular: false },
        { name: "5GB", details: "30 days validity", price: 2500, popular: false }
    ]
};

let selectedNetwork = 'mtn';
let selectedPlan = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set up network buttons
    document.querySelectorAll('.network-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.network-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update selected network
            selectedNetwork = this.dataset.network;
            
            // Load data plans for selected network
            loadDataPlans();
            
            // Clear selected plan
            selectedPlan = null;
            updateOrderForm();
        });
    });
    
    // Load initial data plans for MTN
    loadDataPlans();
    
    // Set up form submission
    document.getElementById('orderForm').addEventListener('submit', submitOrder);
    
    // Phone number validation
    document.getElementById('phoneNumber').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length > 11) {
            this.value = this.value.substring(0, 11);
        }
    });
});

// Load data plans for the selected network
function loadDataPlans() {
    const plansContainer = document.getElementById('plansContainer');
    const plans = dataPlans[selectedNetwork];
    
    plansContainer.innerHTML = '';
    
    plans.forEach((plan, index) => {
        const planCard = document.createElement('div');
        planCard.className = 'plan-card';
        planCard.dataset.index = index;
        
        planCard.innerHTML = `
            ${plan.popular ? '<div class="popular">POPULAR</div>' : ''}
            <div class="plan-name">${plan.name}</div>
            <div class="plan-details">${plan.details}</div>
            <div class="plan-price">₦${plan.price}</div>
        `;
        
        planCard.addEventListener('click', function() {
            // Remove selected class from all cards
            document.querySelectorAll('.plan-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Add selected class to clicked card
            this.classList.add('selected');
            
            // Update selected plan
            selectedPlan = plans[index];
            
            // Update order form
            updateOrderForm();
        });
        
        plansContainer.appendChild(planCard);
    });
}

// Update order form with selected plan details
function updateOrderForm() {
    if (selectedPlan) {
        document.getElementById('selectedPlan').value = 
            `${selectedPlan.name} - ${selectedPlan.details}`;
        document.getElementById('amount').value = selectedPlan.price;
    } else {
        document.getElementById('selectedPlan').value = '';
        document.getElementById('amount').value = '';
    }
}

// Submit order
function submitOrder(e) {
    e.preventDefault();
    
    // Get form values
    const phoneNumber = document.getElementById('phoneNumber').value;
    const email = document.getElementById('email').value;
    
    // Validation
    if (!phoneNumber || phoneNumber.length !== 11) {
        alert('Please enter a valid 11-digit phone number');
        return;
    }
    
    if (!selectedPlan) {
        alert('Please select a data plan');
        return;
    }
    
    // Generate order ID
    const orders = JSON.parse(localStorage.getItem('datahub_orders')) || [];
    const orderId = 'ORD' + String(orders.length + 1).padStart(3, '0');
    
    // Create order object
    const order = {
        id: orderId,
        phone: phoneNumber,
        email: email,
        network: selectedNetwork,
        plan: `${selectedPlan.name} - ${selectedPlan.details}`,
        amount: selectedPlan.price,
        status: 'pending',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    
    // Save to localStorage (in real app, send to server)
    orders.push(order);
    localStorage.setItem('datahub_orders', JSON.stringify(orders));
    
    // Show order status
    showOrderStatus(order);
    
    // Reset form
    document.getElementById('orderForm').reset();
    selectedPlan = null;
    updateOrderForm();
    
    // Unselect plan cards
    document.querySelectorAll('.plan-card').forEach(card => {
        card.classList.remove('selected');
    });
}

// Show order status after submission
function showOrderStatus(order) {
    document.getElementById('statusOrderId').textContent = order.id;
    document.getElementById('statusNumber').textContent = order.phone;
    document.getElementById('statusPlan').textContent = order.plan;
    document.getElementById('statusAmount').textContent = order.amount;
    
    document.getElementById('orderStatus').style.display = 'block';
    
    // Scroll to status
    document.getElementById('orderStatus').scrollIntoView({ 
        behavior: 'smooth' 
    });
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (document.getElementById('orderStatus').style.display !== 'none') {
            closeStatus();
        }
    }, 10000);
}

// Close order status
function closeStatus() {
    document.getElementById('orderStatus').style.display = 'none';
}

// Basic admin authentication check
function checkAdminAccess() {
    const password = prompt('Enter admin password:');
    // In a real app, this would be a secure server-side check
    if (password === 'admin123') { // Default password
        window.location.href = 'admin.html';
    } else {
        alert('Invalid password!');
    }
}

// Add this to index.html footer for admin link
document.addEventListener('DOMContentLoaded', function() {
    // Add admin link to footer (only for demo)
    const footer = document.querySelector('footer');
    const adminLink = document.createElement('p');
    adminLink.innerHTML = '<a href="#" onclick="checkAdminAccess()" style="color:#f39c12;"><i class="fas fa-user-shield"></i> Admin Login</a>';
    footer.appendChild(adminLink);
});
