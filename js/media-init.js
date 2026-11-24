document.addEventListener('DOMContentLoaded', function () {
    if (typeof Swiper !== 'undefined' && document.querySelector('.reviews-swiper')) {
        new Swiper('.reviews-swiper', {
            loop: true,
            spaceBetween: 24,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                320: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });
    }

    if (typeof Fancybox !== 'undefined') {
        Fancybox.bind("[data-fancybox='clinic-gallery']", {
            Carousel: { Transition: "fade" },
            Images: { Panzoom: { maxScale: 3 } }
        });
    }

    if (typeof Typed !== 'undefined' && document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: [
                'турбота про кожного улюбленця.',
                'сучасна діагностика 24/7.',
                'досвідчені лікарі та спокій.'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            loop: true
        });
    }
});