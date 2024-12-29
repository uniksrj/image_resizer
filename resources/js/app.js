import './bootstrap';
import 'cropperjs/dist/cropper.min.css';
import Cropper from 'cropperjs';
window.Cropper = Cropper;
import Compressor from 'compressorjs';
window.Compressor = Compressor;
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel'; 
import $ from 'jquery';
window.$ = window.jQuery = $;


$(document).ready(function() {
    console.log('jQuery is working!');
});
