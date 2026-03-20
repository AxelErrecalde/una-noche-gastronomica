document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Transform hamburger to X
        const bars = menuToggle.querySelectorAll('.bar');
        if(navMenu.classList.contains('active')) {
            bars[0].style.transform = 'translateY(7px) rotate(45deg)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close mobile menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                const bars = menuToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const offset = Math.min(100, windowHeight / 5); // Trigger earlier or based on screen size
        
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - offset) {
                el.classList.add('active');
            }
        });
    };
    
    // Initial check
    setTimeout(revealOnScroll, 100);
    
    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);

    // Form Submission (Real Integration with Google Sheets)
    const form = document.getElementById('inquiryForm');
    const formStatus = document.getElementById('formStatus');
    
    // IMPORTANT: Replace this URL with your Google Apps Script Web App URL
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwTgiHv46eJdmxotJp2eGw3jkXUoNlejrnPDoa8Uiz9AVV2--V0q--6n2_PyY-2FRGO/exec';
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            btn.textContent = 'Enviando...';
            btn.disabled = true;
            
            // Mejora de compatibilidad: Enviamos como 'application/x-www-form-urlencoded'
            const formData = new URLSearchParams();
            new FormData(form).forEach((value, key) => formData.append(key, value));
            formData.append('timestamp', new Date().toLocaleString());
            
            console.log('Enviando datos a Google Sheets:', Object.fromEntries(formData));

            fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Importante para evitar errores de red local
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            })
            .then(() => {
                btn.textContent = '¡Reserva Enviada!';
                btn.style.backgroundColor = '#4CAF50';
                btn.style.color = 'white';
                formStatus.textContent = 'Gracias. Los datos se han guardado.';
                formStatus.style.color = '#4CAF50';
                
                setTimeout(() => {
                    form.reset();
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                    formStatus.textContent = '';
                }, 4000);
            })
            .catch(error => {
                console.error('Error:', error);
                btn.textContent = 'Error al enviar';
                btn.disabled = false;
                formStatus.textContent = 'Hubo un problema. Por favor intenta por WhatsApp.';
                formStatus.style.color = '#f44336';
            });
        });
    }

    // Gallery Modal Logic
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('gallery-modal');
    
    if (modal && galleryItems.length > 0) {
        const modalImg = document.getElementById('modal-img');
        const modalCaption = document.getElementById('modal-caption');
        const closeModalBtn = document.querySelector('.close-modal');

        const dishData = {
            'plato1.jpg': { title: 'Risotto de Calabaza', desc: 'Risotto de calabaza al dente servido junto a una crujiente bruschetta de pan ciabatta.' },
            'plato2.jpg': { title: 'Zanahorias Glaseadas', desc: 'Zanahorias dulces glaseadas, emplatadas sobre un suave cremoso de coliflor y ragú de hongos.' },
            'plato3.jpg': { title: 'Lingote de Osobuco', desc: 'Osobuco braseado bañado en su propia demi-glace, acompañado de milhojas de papa con kétchup de remolacha.' },
            'plato4.jpg': { title: 'Panna Cotta de Vainilla', desc: 'Clásico postre italiano, decorado con gajos de pomelo en almíbar, confitura de pomelo y toques de chocolate.' }
        };

        const dateTag = '<p class="modal-date">Cena Privada del 1 de Marzo</p>';

        galleryItems.forEach(item => {
            item.style.cursor = 'pointer';
            
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const src = img.getAttribute('src');
                const filename = src.split('/').pop();
                
                modalImg.src = src;
                
                const data = dishData[filename] || { title: img.getAttribute('alt'), desc: '' };
                
                modalCaption.innerHTML = `
                    <h4>${data.title}</h4>
                    <p>${data.desc}</p>
                    ${dateTag}
                `;
                
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeGalleryModal = () => {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        };

        closeModalBtn.addEventListener('click', closeGalleryModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeGalleryModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeGalleryModal();
            }
        });
    }
});
