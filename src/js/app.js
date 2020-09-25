import { Swiper, Navigation } from 'swiper';

Swiper.use([Navigation]);

const homeSwiper = new Swiper('#homeSlider', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    }
});

