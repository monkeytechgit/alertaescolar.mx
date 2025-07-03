// === MODAL FUNCTIONALITY ===
function openPricingForm(buttonType = 'demo') {
    const modal = document.getElementById('pricing-modal');
    const tipoSolicitudSelect = document.getElementById('tipo-solicitud');
    const pricingForm = document.getElementById('pricing-form');

    // Limpiar el formulario siempre que se abre
    if (pricingForm) pricingForm.reset();

    // Mapear el valor del botón al valor del select
    let selectValue = '';
    switch (buttonType) {
        case 'impresion-independiente':
        case 'cotizacion-impresion':
            selectValue = 'cotizacion-impresion';
            break;
        case 'sistema-completo':
            selectValue = 'sistema-completo';
            break;
        case 'consulta':
        case 'consulta-gratuita':
            selectValue = 'consulta-gratuita';
            break;
        case 'muestra-diseno':
            selectValue = 'muestra-diseno';
            break;
        default:
            selectValue = '';
    }
    if (tipoSolicitudSelect) tipoSolicitudSelect.value = selectValue;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closePricingForm() {
    const modal = document.getElementById('pricing-modal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Supabase configuration is loaded from supabase-config.js

// Handle form submission
async function handlePricingFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    console.log('Form data:', data);

    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;

    try {
        // Prepare data for Supabase - ensure all fields match the table structure
        const supabaseData = {
            tipo_solicitud: data['tipo-solicitud'] || 'consulta-general',
            correo: data['email'] || '',
            telefono: data['telefono'] || null,
            nombre_institucion: data['institucion'] || '',
            tipo_institucion: data['tipo-institucion'] || null,
            cantidad_alumnos: data['cantidad-alumnos'] || null,
            responsable: data['responsable'] || '',
            mensaje: data['mensaje'] || null,
            created_at: new Date().toISOString() // This will be automatically set by Supabase, but we include it for safety
        };

        // Validate required fields
        if (!supabaseData.correo || !supabaseData.nombre_institucion || !supabaseData.responsable) {
            throw new Error('Por favor completa todos los campos obligatorios.');
        }

        // Check if Supabase is configured
        if (!window.SUPABASE_CONFIG ||
            window.SUPABASE_CONFIG.url === 'YOUR_SUPABASE_URL_HERE' ||
            window.SUPABASE_CONFIG.anonKey === 'YOUR_SUPABASE_ANON_KEY_HERE') {
            throw new Error('Supabase no está configurado. Por favor configura supabase-config.js con tus credenciales reales.');
        }

        // Send to Supabase
        const response = await fetch(`${window.SUPABASE_CONFIG.url}/rest/v1/contacto_webpage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': window.SUPABASE_CONFIG.anonKey,
                'Authorization': `Bearer ${window.SUPABASE_CONFIG.anonKey}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(supabaseData)
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Supabase error response:', errorData);
            throw new Error(`Error ${response.status}: ${response.statusText}. ${errorData}`);
        }

        // Get the type of request to customize the message
        const tipoSolicitud = data['tipo-solicitud'];
        let message = '¡Gracias por tu interés! Te contactaremos pronto.';

        switch (tipoSolicitud) {
            case 'demo-gratuito':
                message = '¡Gracias por solicitar el demo! Te contactaremos pronto para programar una demostración personalizada.';
                break;
            case 'cotizacion-personalizada':
                message = '¡Gracias por tu interés! Te contactaremos pronto con la cotización personalizada.';
                break;
            case 'consulta-general':
                message = '¡Gracias por tu consulta! Te contactaremos pronto para resolver tus dudas.';
                break;
            case 'hablar-especialista':
                message = '¡Gracias por tu interés! Un especialista te contactará pronto para ayudarte.';
                break;
        }

        // Show success message
        showNotification(message, 'success');
        closePricingForm();

        // Reset form
        event.target.reset();

    } catch (error) {
        console.error('Error submitting form:', error);
        let errorMessage = 'Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.';

        if (error.message.includes('Supabase no está configurado')) {
            errorMessage = 'Error de configuración: ' + error.message;
        } else if (error.message.includes('campos obligatorios')) {
            errorMessage = error.message;
        }

        showNotification(errorMessage, 'error');
    } finally {
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Close modal when clicking outside
function handleModalClick(event) {
    const modal = document.getElementById('pricing-modal');
    if (event.target === modal) {
        closePricingForm();
    }
}

// === MOBILE NAVIGATION ===
document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('show');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link (except dropdown toggles)
        const navLinks = document.querySelectorAll('.nav__link:not(.nav__dropdown-toggle)');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
                navToggle.classList.remove('active');
            });
        });
    }

    // === MOBILE DROPDOWN FUNCTIONALITY ===
    const dropdownToggles = document.querySelectorAll('.nav__dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            // Always prevent default navigation for dropdown toggles
            e.preventDefault();

            // Only handle dropdown behavior on mobile
            if (window.innerWidth <= 768) {
                const dropdown = this.closest('.nav__dropdown');
                const isActive = dropdown.classList.contains('active');

                // Close all other dropdowns
                document.querySelectorAll('.nav__dropdown').forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });

                // Toggle current dropdown
                dropdown.classList.toggle('active', !isActive);
            }
        });
    });

    // Close dropdowns when clicking on dropdown links
    const dropdownLinks = document.querySelectorAll('.nav__dropdown-link');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Close dropdown
            document.querySelectorAll('.nav__dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
            // Close mobile menu
            navMenu.classList.remove('show');
            navToggle.classList.remove('active');
        });
    });

    // Handle window resize - close dropdowns when switching to desktop
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            document.querySelectorAll('.nav__dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
});

// === SMOOTH SCROLLING ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// === FAQ ACCORDION ===
document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                otherItem.querySelector('i').style.transform = 'rotate(0deg)';
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
});

// === SCROLL ANIMATIONS ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function () {
    const elementsToAnimate = document.querySelectorAll('.hero__text, .section__header, .feature-item, .platform-card, .step-card, .testimonial-card');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
});

// === STATISTICS COUNTER ANIMATION ===
function animateCounters() {
    const counters = document.querySelectorAll('.hero__stat-number, .stat-number');

    counters.forEach(counter => {
        const target = counter.innerText;
        const isPercentage = target.includes('%');
        const isRating = target.includes('/');
        const numericTarget = parseFloat(target.replace(/[^\d.]/g, ''));

        let current = 0;
        const increment = numericTarget / 50; // 50 frames for animation

        const updateCounter = () => {
            if (current < numericTarget) {
                current += increment;
                if (isPercentage) {
                    counter.innerText = Math.ceil(current) + '%';
                } else if (isRating) {
                    counter.innerText = current.toFixed(1) + '/5';
                } else {
                    counter.innerText = Math.ceil(current).toLocaleString() + (target.includes('+') ? '+' : '');
                }
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target; // Set final value
            }
        };

        updateCounter();
    });
}

// === NAVBAR SCROLL EFFECT ===
window.addEventListener('scroll', function () {
    const header = document.querySelector('.header');
    if (!header) return;
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// === FORM HANDLING (if contact forms are added) ===
function handleFormSubmission(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Enviando...';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerText = 'Enviado ✓';
                submitBtn.style.backgroundColor = 'var(--success-color)';

                // Reset after 3 seconds
                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                    form.reset();
                }, 3000);
            }, 2000);
        });
    }
}

// === INITIALIZE ANIMATIONS ON SCROLL ===
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(animateCounters, 500);
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function () {
    const heroStats = document.querySelector('.hero__stats');
    if (heroStats) {
        heroObserver.observe(heroStats);
    }
});

// === TESTIMONIALS CAROUSEL (if needed) ===
function initTestimonialsCarousel() {
    const testimonialGrid = document.querySelector('.testimonials-grid');
    if (!testimonialGrid) return;

    let currentIndex = 0;
    const cards = testimonialGrid.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;

    function showTestimonials() {
        cards.forEach((card, index) => {
            card.style.transform = `translateX(${(index - currentIndex) * 100}%)`;
        });
    }

    // Auto-rotate testimonials on mobile
    if (window.innerWidth <= 768) {
        setInterval(() => {
            currentIndex = (currentIndex + 1) % totalCards;
            showTestimonials();
        }, 5000);
    }
}

// === LOADING ANIMATION ===
window.addEventListener('load', function () {
    document.body.classList.add('loaded');

    // Initialize components after load
    initTestimonialsCarousel();
});

// === UTILITY FUNCTIONS ===
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function showNotification(message, type = 'info') {
    // Remove any existing notifications first
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;

    // Create a more detailed notification with better styling
    notification.innerHTML = `
        <div class="notification__content">
            <div class="notification__icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            </div>
            <div class="notification__text">
                <div class="notification__title">${type === 'success' ? '¡Enviado Exitosamente!' : type === 'error' ? 'Error' : 'Información'}</div>
                <div class="notification__message">${message}</div>
            </div>
            <button class="notification__close" onclick="this.closest('.notification').remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="notification__progress"></div>
    `;

    document.body.appendChild(notification);

    // Add entrance animation
    setTimeout(() => {
        notification.classList.add('notification--show');
    }, 100);

    // Auto-remove after 6 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('notification--show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 6000);
}

// === RESIZE HANDLER ===
window.addEventListener('resize', function () {
    // Reinitialize components that depend on screen size
    initTestimonialsCarousel();
});

// === COMING SOON DIALOG ===
function openComingSoonDialog(category) {
    const messages = {
        'Hardware': '📱 La página detallada del Hardware estará disponible muy pronto.\n\n🔧 Mientras tanto, conoce más sobre nuestro equipo profesional que incluye:\n• Galaxy Tab A9+ optimizada\n• Lector QR de alta velocidad \n• Soporte ajustable premium\n• Batería externa de larga duración',
        'Credenciales Escolares': '🎫 La página detallada de las Credenciales Escolares estará disponible muy pronto.\n\n✨ Mientras tanto, conoce las características de nuestras credenciales:\n• Material PVC resistente y duradero\n• Diseño personalizado con colores institucionales\n• Código QR único por estudiante\n• Acabado profesional de alta calidad'
    };

    const message = messages[category] || `La página detallada de ${category} estará disponible muy pronto.`;

    showNotification(`${message}\n\n💬 Por ahora puedes solicitar más información usando el botón "Solicitar Demo" o contactándonos directamente.\n\n¡Gracias por tu interés! 🚀`, 'info');
}