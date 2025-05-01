document.addEventListener('DOMContentLoaded', function() {
    // ==================== MOBILE NAVIGATION ====================
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuToggle.innerHTML = navMenu.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // ==================== SMOOTH SCROLLING ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });

    // ==================== ANIMATED NUMBER COUNTERS ====================
    const animateNumbers = () => {
        const stats = document.querySelectorAll('.number[data-count]');
        
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            
            let current = 0;
            
            const updateNumber = () => {
                current += step;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = target;
                    stat.classList.add('animated');
                }
            };
            
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateNumber();
                    observer.unobserve(stat);
                }
            }, { threshold: 0.5 });
            
            observer.observe(stat);
        });
    };
    
    animateNumbers();

    // ==================== TESTIMONIAL SLIDER ====================
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    let testimonialInterval;
    
    function showTestimonial(index) {
        testimonialItems.forEach(item => item.classList.remove('active'));
        
        // Wrap around if at beginning or end
        if (index >= testimonialItems.length) index = 0;
        if (index < 0) index = testimonialItems.length - 1;
        
        testimonialItems[index].classList.add('active');
        currentIndex = index;
    }
    
    function startAutoRotation() {
        testimonialInterval = setInterval(() => {
            showTestimonial(currentIndex + 1);
        }, 5000);
    }
    
    prevBtn.addEventListener('click', function() {
        clearInterval(testimonialInterval);
        showTestimonial(currentIndex - 1);
        startAutoRotation();
    });
    
    nextBtn.addEventListener('click', function() {
        clearInterval(testimonialInterval);
        showTestimonial(currentIndex + 1);
        startAutoRotation();
    });
    
    // Pause on hover
    const testimonialSlider = document.querySelector('.testimonial-slider');
    testimonialSlider.addEventListener('mouseenter', () => {
        clearInterval(testimonialInterval);
    });
    
    testimonialSlider.addEventListener('mouseleave', startAutoRotation);
    
    // Initialize
    showTestimonial(currentIndex);
    startAutoRotation();

    // ==================== STICKY HEADER ====================
    const nav = document.querySelector('nav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            nav.style.padding = '10px 0';
            nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            nav.style.backgroundColor = 'transparent';
            nav.style.padding = '20px 0';
            nav.style.boxShadow = 'none';
        }
    });

    // ==================== INTERACTIVE MAP ====================
    if (document.getElementById('interactive-map')) {
        // Initialize the map centered on Desa Modang
        const map = L.map('interactive-map').setView([-1.2389, 116.8644], 14);
        
        // Add OpenStreetMap base layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(map);
        
        // Define icon colors for different types
        const iconSettings = {
            waterfall: { icon: 'fa-water', color: '#3498db' },
            tree: { icon: 'fa-tree', color: '#2ecc71' },
            culture: { icon: 'fa-landmark', color: '#e67e22' },
            default: { icon: 'fa-map-marker-alt', color: '#e74c3c' }
        };
        
        // Layer groups for filtering
        const mapLayers = {
            boundary: L.layerGroup(),
            attractions: L.layerGroup(),
            rivers: L.layerGroup(),
            roads: L.layerGroup(),
            villages: L.layerGroup(),
            trails: L.layerGroup()
        };
        
        // Sample attractions data (replace with real data)
        const attractions = [
            {
                name: "Air Terjun Dinding Olo",
                position: [-1.235, 116.855],
                type: "waterfall",
                description: "Air terjun setinggi 30 meter dengan pemandangan spektakuler",
                link: "air-terjun-olo.html"
            },
            {
                name: "Pohon Ulin Raksasa",
                position: [-1.233, 116.868],
                type: "tree",
                description: "Pohon ulin berusia ratusan tahun dengan diameter 2 meter",
                link: "pohon-ulin.html"
            },
            {
                name: "Air Terjun Doyam Seriam",
                position: [-1.242, 116.875],
                type: "waterfall",
                description: "Air terjun bertingkat dengan kolam alami yang jernih",
                link: "air-terjun-doyam.html"
            },
            {
                name: "Rumah Adat Dayak",
                position: [-1.237, 116.862],
                type: "culture",
                description: "Rumah panjang tradisional masyarakat Dayak",
                link: "rumah-adat.html"
            }
        ];
        
        // Add markers for each attraction
        attractions.forEach(attr => {
            const { icon, color } = iconSettings[attr.type] || iconSettings.default;
            
            const marker = L.marker(attr.position, {
                icon: L.divIcon({
                    className: 'map-marker',
                    html: `<i class="fas ${icon}" style="color:white;background:${color}"></i>`,
                    iconSize: [30, 30],
                    className: 'custom-marker'
                })
            }).addTo(mapLayers.attractions);
            
            marker.bindPopup(`
                <div class="map-popup">
                    <h3 style="color:${color};margin-top:0">${attr.name}</h3>
                    <p>${attr.description}</p>
                    <a href="${attr.link}" class="map-popup-link" style="background:${color}">
                        Lihat Detail <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `);
        });
        
        // Sample boundary polygon (replace with real coordinates)
        const boundaryCoords = [
            [-1.240, 116.850],
            [-1.230, 116.860],
            [-1.245, 116.870],
            [-1.250, 116.860]
        ];
        
        L.polygon(boundaryCoords, {
            color: '#e74c3c',
            weight: 3,
            fillOpacity: 0.1
        }).addTo(mapLayers.boundary);
        
        // Sample river (replace with real coordinates)
        const riverCoords = [
            [-1.238, 116.852],
            [-1.235, 116.858],
            [-1.240, 116.865]
        ];
        
        L.polyline(riverCoords, {
            color: '#3498db',
            weight: 3
        }).addTo(mapLayers.rivers);
        
        // Add default visible layers
        mapLayers.attractions.addTo(map);
        mapLayers.boundary.addTo(map);
        
        // Filter control functionality
        document.getElementById('show-boundary').addEventListener('change', function(e) {
            e.target.checked ? mapLayers.boundary.addTo(map) : map.removeLayer(mapLayers.boundary);
        });
        
        document.getElementById('show-attractions').addEventListener('change', function(e) {
            e.target.checked ? mapLayers.attractions.addTo(map) : map.removeLayer(mapLayers.attractions);
        });
        
        document.getElementById('show-rivers').addEventListener('change', function(e) {
            e.target.checked ? mapLayers.rivers.addTo(map) : map.removeLayer(mapLayers.rivers);
        });
        
        // Add scale control
        L.control.scale().addTo(map);
        
        // Add layer control
        L.control.layers(null, {
            "Atraksi Wisata": mapLayers.attractions,
            "Batas Desa": mapLayers.boundary,
            "Sungai": mapLayers.rivers
        }, { collapsed: false }).addTo(map);
    }

    // ==================== IMAGE LAZY LOADING ====================
    const lazyLoadImages = () => {
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading supported
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => img.loading = 'lazy');
        } else {
            // Fallback using IntersectionObserver
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    });
                }, { rootMargin: '200px 0px' });
                
                lazyImages.forEach(img => imageObserver.observe(img));
            }
        }
    };
    
    lazyLoadImages();

    // ==================== VIDEO AUTOPLAY MANAGEMENT ====================
    const manageVideos = () => {
        const videos = document.querySelectorAll('video');
        
        videos.forEach(video => {
            // Ensure videos are muted for autoplay
            video.muted = true;
            
            // Play/pause based on visibility
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        video.play().catch(e => console.log('Video play failed:', e));
                    } else {
                        video.pause();
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(video);
        });
    };
    
    manageVideos();

    // ==================== CURRENT YEAR IN FOOTER ====================
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

// ==================== Slide ====================
let geserPosisi = 0;
const slider = document.getElementById('sliderAparatur');
const cardWidth = 215; // 200px card + 15px gap

function geserKanan() {
  if (geserPosisi > -(slider.scrollWidth - slider.clientWidth)) {
    geserPosisi -= cardWidth;
    slider.style.transform = `translateX(${geserPosisi}px)`;
  }
}

function geserKiri() {
  if (geserPosisi < 0) {
    geserPosisi += cardWidth;
    slider.style.transform = `translateX(${geserPosisi}px)`;
  }
}

// ==================== Galeri ====================
function openLightbox(img) {
    document.getElementById("lightbox").style.display = "block";
    document.getElementById("lightbox-img").src = img.src;
  }

  function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
  }
