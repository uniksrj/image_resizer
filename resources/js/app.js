import './bootstrap';
import 'cropperjs/dist/cropper.min.css';
import Cropper from 'cropperjs';
window.Cropper = Cropper;
import Compressor from 'compressorjs';
window.Compressor = Compressor;
import $ from 'jquery';
window.$ = window.jQuery = $;


$(document).ready(function() {
    console.log('jQuery is working!');
});
