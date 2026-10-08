 // 3D Tilt Effect Logic
        const cardContainer = document.getElementById('cardContainer');
        const tiltCard = document.getElementById('tiltCard');
        
        let isHovering = false;
        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;

        // Smooth interpolation factor
        const lerp = (start, end, factor) => start + (end - start) * factor;

        cardContainer.addEventListener('mouseenter', () => {
            isHovering = true;
            tiltCard.classList.remove('floating');
            tiltCard.style.animation = 'none';
        });

        cardContainer.addEventListener('mouseleave', () => {
            isHovering = false;
            // Reset to center
            targetX = 0;
            targetY = 0;
            // Re-enable floating animation after reset
            setTimeout(() => {
                if (!isHovering) {
                    tiltCard.style.animation = '';
                    tiltCard.classList.add('floating');
                }
            }, 300);
        });

        cardContainer.addEventListener('mousemove', (e) => {
            if (!isHovering) return;

            const rect = cardContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate mouse position relative to center (-1 to 1)
            const mouseX = (e.clientX - centerX) / (rect.width / 2);
            const mouseY = (e.clientY - centerY) / (rect.height / 2);

            // Max rotation degrees
            const maxRotation = 15;
            
            targetY = mouseX * maxRotation;  // Rotate Y based on X position
            targetX = -mouseY * maxRotation; // Rotate X based on Y position (inverted)
        });

        // Animation loop for smooth 60fps movement
        function animate() {
            // Smooth interpolation
            currentX = lerp(currentX, targetX, 0.1);
            currentY = lerp(currentY, targetY, 0.1);

            // Apply transform with CSS variables for the floating animation to use
            tiltCard.style.setProperty('--rx', `${currentX}deg`);
            tiltCard.style.setProperty('--ry', `${currentY}deg`);
            tiltCard.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;

            requestAnimationFrame(animate);
        }

        animate();

        // Scroll Reveal Animation
        const revealElements = document.querySelectorAll('.reveal');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Optional: stop observing once revealed
                    // revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));

        // Parallax effect on scroll for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroSection = document.querySelector('section');
            const heroContent = heroSection.querySelector('.grid');
            
            if (scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
            }
        });