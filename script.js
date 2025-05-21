document.addEventListener('DOMContentLoaded', function() {
    // ==================== NAVIGASI MOBILE ====================
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuToggle.innerHTML = navMenu.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // ==================== GULIR HALUS ====================
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
                
                // Tutup menu mobile jika terbuka
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });

    // ==================== ANIMASI ANGKA ====================
    const animateNumbers = () => {
        const stats = document.querySelectorAll('.number[data-count]');
        
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const durasi = 2000;
            const step = target / (durasi / 16);
            
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

    // ==================== SLIDER TESTIMONI ====================
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    let testimonialInterval;
    
    function showTestimonial(index) {
        testimonialItems.forEach(item => item.classList.remove('active'));
        
        // Kembali ke awal jika di akhir
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
    
    // Jeda saat hover
    const testimonialSlider = document.querySelector('.testimonial-slider');
    testimonialSlider.addEventListener('mouseenter', () => {
        clearInterval(testimonialInterval);
    });
    
    testimonialSlider.addEventListener('mouseleave', startAutoRotation);
    
    // Inisialisasi
    showTestimonial(currentIndex);
    startAutoRotation();

    // ==================== HEADER MENEMPEL ====================
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

    // ==================== PETA INTERAKTIF ====================
    if (document.getElementById('interactive-map')) {
        // Inisialisasi peta di tengah Desa Modang
        const map = L.map('interactive-map').setView([-1.2389, 116.8644], 14);
        
        // Tambahkan layer dasar OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(map);
        
        // Pengaturan ikon untuk jenis yang berbeda
        const iconSettings = {
            waterfall: { icon: 'fa-water', color: '#3498db' },
            tree: { icon: 'fa-tree', color: '#2ecc71' },
            culture: { icon: 'fa-landmark', color: '#e67e22' },
            default: { icon: 'fa-map-marker-alt', color: '#e74c3c' }
        };
        
        // Grup layer untuk filter
        const mapLayers = {
            boundary: L.layerGroup(),
            attractions: L.layerGroup(),
            rivers: L.layerGroup(),
            roads: L.layerGroup(),
            villages: L.layerGroup(),
            trails: L.layerGroup()
        };
        
        // Data atraksi contoh (ganti dengan data nyata)
        const attractions = [
            {
                name: "Air Terjun Dinding Olo",
                position: [-1.235, 116.855],
                type: "waterfall",
                description: "Air terjun setinggi 30 meter dengan pemandangan spektakuler",
            },
            {
                name: "Pohon Ulin Raksasa",
                position: [-1.233, 116.868],
                type: "tree",
                description: "Pohon ulin berusia ratusan tahun dengan diameter 2 meter",
            },
            {
                name: "Air Terjun Doyam Seriam",
                position: [-1.242, 116.875],
                type: "waterfall",
                description: "Air terjun bertingkat dengan kolam alami yang jernih",
            },
            {
                name: "Rumah Adat Dayak",
                position: [-1.237, 116.862],
                type: "culture",
                description: "Rumah panjang tradisional masyarakat Dayak",
            }
        ];
        
        // Tambahkan marker untuk setiap atraksi
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
        
        // Poligon batas contoh (ganti dengan koordinat nyata)
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
        
        // Sungai contoh (ganti dengan koordinat nyata)
        const riverCoords = [
            [-1.238, 116.852],
            [-1.235, 116.858],
            [-1.240, 116.865]
        ];
        
        L.polyline(riverCoords, {
            color: '#3498db',
            weight: 3
        }).addTo(mapLayers.rivers);
        
        // Tambahkan layer yang terlihat secara default
        mapLayers.attractions.addTo(map);
        mapLayers.boundary.addTo(map);
        
        // Fungsi kontrol filter
        document.getElementById('show-boundary').addEventListener('change', function(e) {
            e.target.checked ? mapLayers.boundary.addTo(map) : map.removeLayer(mapLayers.boundary);
        });
        
        document.getElementById('show-attractions').addEventListener('change', function(e) {
            e.target.checked ? mapLayers.attractions.addTo(map) : map.removeLayer(mapLayers.attractions);
        });
        
        document.getElementById('show-rivers').addEventListener('change', function(e) {
            e.target.checked ? mapLayers.rivers.addTo(map) : map.removeLayer(mapLayers.rivers);
        });
        
        // Tambahkan kontrol skala
        L.control.scale().addTo(map);
        
        // Tambahkan kontrol layer
        L.control.layers(null, {
            "Atraksi Wisata": mapLayers.attractions,
            "Batas Desa": mapLayers.boundary,
            "Sungai": mapLayers.rivers
        }, { collapsed: false }).addTo(map);
    }

    // ==================== PROFIL PENGELOLA ====================
    const loadTeamProfiles = async () => {
        try {
            const response = await fetch('profiles.json');
            if (!response.ok) throw new Error('Failed to load profiles');
            
            const data = await response.json();
            const container = document.getElementById('team-container');
            
            // Skeleton loading
            container.innerHTML = `
                <div class="team-skeleton"></div>
                <div class="team-skeleton"></div>
                <div class="team-skeleton"></div>
                <div class="team-skeleton"></div>
            `;
            
            // Set timeout untuk simulasi loading (bisa dihapus di production)
            setTimeout(() => {
                container.innerHTML = '';
                
                data.pengelola.forEach(member => {
                    const card = document.createElement('div');
                    card.className = 'team-card';
                    card.innerHTML = `
                        <img src="${member.foto}" alt="${member.nama}" class="team-image" loading="lazy">
                        <div class="team-info">
                            <h3>${member.nama}</h3>
                            <div class="jabatan">${member.jabatan}</div>
                            <div class="team-social">
                                <a href="https://wa.me/${member.sosmed.wa}" class="social-link" target="_blank" aria-label="WhatsApp">
                                    <i class="fab fa-whatsapp"></i>
                                </a>
                                <a href="mailto:${member.sosmed.email}" class="social-link" aria-label="Email">
                                    <i class="fas fa-envelope"></i>
                                </a>
                            </div>
                        </div>
                    `;
                    container.appendChild(card);
                    
                    // Animasi muncul
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                });
            }, 1000);
            
        } catch (error) {
            console.error('Error loading team profiles:', error);
            document.getElementById('team-container').innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Gagal memuat data pengelola. Silakan coba lagi nanti.</p>
                </div>
            `;
        }
    };

    // ==================== LAZY LOAD GAMBAR ====================
    const lazyLoadImages = () => {
        if ('loading' in HTMLImageElement.prototype) {
            // Mendukung lazy loading secara native
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => img.loading = 'lazy');
        } else {
            // Fallback menggunakan IntersectionObserver
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
    
    // ==================== MANAJEMEN AUTOPLAY VIDEO ====================
    const manageVideos = () => {
        const videos = document.querySelectorAll('video');
        
        videos.forEach(video => {
            // Pastikan video dimute untuk autoplay
            video.muted = true;
            
            // Putar/jeda berdasarkan visibilitas
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        video.play().catch(e => console.log('Gagal memutar video:', e));
                    } else {
                        video.pause();
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(video);
        });
    };
    
    // ==================== GALERI LIGHTBOX ====================
    const initGallery = () => {
        const galleryImages = document.querySelectorAll('.gallery-img');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('.close-btn');
        
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                lightbox.style.display = 'block';
                lightboxImg.src = img.src;
                document.body.style.overflow = 'hidden';
            });
        });
        
        closeBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    };
    
    // ==================== INISIALISASI SEMUA FUNGSI ====================
    const initAll = () => {
        lazyLoadImages();
        manageVideos();
        loadTeamProfiles();
        initGallery();
        
        // Tahun saat ini di footer
        document.getElementById('current-year').textContent = new Date().getFullYear();
    };
    
    initAll();

    // ==================== KOMENTAR DINAMIS ====================
    const commentForm = document.getElementById('comment-form');
    const commentsContainer = document.getElementById('comments-container');

    commentForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nameInput = document.getElementById('comment-name');
        const commentInput = document.getElementById('comment-text');

        const name = nameInput.value.trim();
        const comment = commentInput.value.trim();

        if (name === '' || comment === '') {
            alert('Mohon isi nama dan komentar Anda.');
            return;
        }

        // Buat elemen komentar baru
        const commentElement = document.createElement('div');
        commentElement.classList.add('visitor-comment');
        commentElement.style.marginBottom = '15px';
        commentElement.style.padding = '10px';
        commentElement.style.border = '1px solid #ccc';
        commentElement.style.borderRadius = '5px';
        commentElement.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';

        commentElement.innerHTML = `
            <p style="margin: 0;"><strong>${name}</strong></p>
            <p style="margin: 5px 0 0 0;">${comment}</p>
        `;

        // Tambahkan komentar ke container
        commentsContainer.appendChild(commentElement);

        // Scroll ke komentar terbaru
        commentsContainer.scrollTop = commentsContainer.scrollHeight;

        // Bersihkan input form
        nameInput.value = '';
        commentInput.value = '';
    });
});

// ==================== FUNGSI UNTUK SLIDE APARATUR (LEGACY) ====================
let geserPosisi = 0;
const slider = document.getElementById('sliderAparatur');
const cardWidth = 215; // 200px kartu + 15px jarak

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