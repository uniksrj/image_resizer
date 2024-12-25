@extends('layout.mainView')

@section('content')
    <link rel="stylesheet" href="{{ asset('css/rotate.css') }}">
    <div class="container mx-auto min-h-[992px] max-h-[992px] flex flex-col md:flex-row py-0">
        <!-- Sidebar -->
        <aside class="w-full md:w-1/4 bg-green-300 shadow text-white min-h-screen p-2">
            <div class="block w-full pt-3">
                <h4 class="text-2xl sans font-bold">Rotate Image</h4>
            </div>
            <div class="w-full py-2 bg-green-300 rounded-2xl gap-3 border-4 border-dotted rounded-md  grid my-3">
                <div class="grid gap-1">
                    <svg class="mx-auto" width="40" height="40" viewBox="0 0 40 40" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <g id="File">
                            <path id="icon"
                                d="M31.6497 10.6056L32.2476 10.0741L31.6497 10.6056ZM28.6559 7.23757L28.058 7.76907L28.058 7.76907L28.6559 7.23757ZM26.5356 5.29253L26.2079 6.02233L26.2079 6.02233L26.5356 5.29253ZM33.1161 12.5827L32.3683 12.867V12.867L33.1161 12.5827ZM31.8692 33.5355L32.4349 34.1012L31.8692 33.5355ZM24.231 11.4836L25.0157 11.3276L24.231 11.4836ZM26.85 14.1026L26.694 14.8872L26.85 14.1026ZM11.667 20.8667C11.2252 20.8667 10.867 21.2248 10.867 21.6667C10.867 22.1085 11.2252 22.4667 11.667 22.4667V20.8667ZM25.0003 22.4667C25.4422 22.4667 25.8003 22.1085 25.8003 21.6667C25.8003 21.2248 25.4422 20.8667 25.0003 20.8667V22.4667ZM11.667 25.8667C11.2252 25.8667 10.867 26.2248 10.867 26.6667C10.867 27.1085 11.2252 27.4667 11.667 27.4667V25.8667ZM20.0003 27.4667C20.4422 27.4667 20.8003 27.1085 20.8003 26.6667C20.8003 26.2248 20.4422 25.8667 20.0003 25.8667V27.4667ZM23.3337 34.2H16.667V35.8H23.3337V34.2ZM7.46699 25V15H5.86699V25H7.46699ZM32.5337 15.0347V25H34.1337V15.0347H32.5337ZM16.667 5.8H23.6732V4.2H16.667V5.8ZM23.6732 5.8C25.2185 5.8 25.7493 5.81639 26.2079 6.02233L26.8633 4.56274C26.0191 4.18361 25.0759 4.2 23.6732 4.2V5.8ZM29.2539 6.70608C28.322 5.65771 27.7076 4.94187 26.8633 4.56274L26.2079 6.02233C26.6665 6.22826 27.0314 6.6141 28.058 7.76907L29.2539 6.70608ZM34.1337 15.0347C34.1337 13.8411 34.1458 13.0399 33.8638 12.2984L32.3683 12.867C32.5216 13.2702 32.5337 13.7221 32.5337 15.0347H34.1337ZM31.0518 11.1371C31.9238 12.1181 32.215 12.4639 32.3683 12.867L33.8638 12.2984C33.5819 11.5569 33.0406 10.9662 32.2476 10.0741L31.0518 11.1371ZM16.667 34.2C14.2874 34.2 12.5831 34.1983 11.2872 34.0241C10.0144 33.8529 9.25596 33.5287 8.69714 32.9698L7.56577 34.1012C8.47142 35.0069 9.62375 35.4148 11.074 35.6098C12.5013 35.8017 14.3326 35.8 16.667 35.8V34.2ZM5.86699 25C5.86699 27.3344 5.86529 29.1657 6.05718 30.593C6.25217 32.0432 6.66012 33.1956 7.56577 34.1012L8.69714 32.9698C8.13833 32.411 7.81405 31.6526 7.64292 30.3798C7.46869 29.0839 7.46699 27.3796 7.46699 25H5.86699ZM23.3337 35.8C25.6681 35.8 27.4993 35.8017 28.9266 35.6098C30.3769 35.4148 31.5292 35.0069 32.4349 34.1012L31.3035 32.9698C30.7447 33.5287 29.9863 33.8529 28.7134 34.0241C27.4175 34.1983 25.7133 34.2 23.3337 34.2V35.8ZM32.5337 25C32.5337 27.3796 32.532 29.0839 32.3577 30.3798C32.1866 31.6526 31.8623 32.411 31.3035 32.9698L32.4349 34.1012C33.3405 33.1956 33.7485 32.0432 33.9435 30.593C34.1354 29.1657 34.1337 27.3344 34.1337 25H32.5337ZM7.46699 15C7.46699 12.6204 7.46869 10.9161 7.64292 9.62024C7.81405 8.34738 8.13833 7.58897 8.69714 7.03015L7.56577 5.89878C6.66012 6.80443 6.25217 7.95676 6.05718 9.40704C5.86529 10.8343 5.86699 12.6656 5.86699 15H7.46699ZM16.667 4.2C14.3326 4.2 12.5013 4.1983 11.074 4.39019C9.62375 4.58518 8.47142 4.99313 7.56577 5.89878L8.69714 7.03015C9.25596 6.47133 10.0144 6.14706 11.2872 5.97592C12.5831 5.8017 14.2874 5.8 16.667 5.8V4.2ZM23.367 5V10H24.967V5H23.367ZM28.3337 14.9667H33.3337V13.3667H28.3337V14.9667ZM23.367 10C23.367 10.7361 23.3631 11.221 23.4464 11.6397L25.0157 11.3276C24.9709 11.1023 24.967 10.8128 24.967 10H23.367ZM28.3337 13.3667C27.5209 13.3667 27.2313 13.3628 27.0061 13.318L26.694 14.8872C27.1127 14.9705 27.5976 14.9667 28.3337 14.9667V13.3667ZM23.4464 11.6397C23.7726 13.2794 25.0543 14.5611 26.694 14.8872L27.0061 13.318C26.0011 13.1181 25.2156 12.3325 25.0157 11.3276L23.4464 11.6397ZM11.667 22.4667H25.0003V20.8667H11.667V22.4667ZM11.667 27.4667H20.0003V25.8667H11.667V27.4667ZM32.2476 10.0741L29.2539 6.70608L28.058 7.76907L31.0518 11.1371L32.2476 10.0741Z"
                                fill="#ffd700" />
                        </g>
                    </svg>
                </div>
                <div class="grid gap-2">
                    <div id="dropZone" class="w-full flex items-center justify-center" ondragover="dragOver(event)"
                        ondragleave="dragLeave(event)" ondrop="handleDrop(event)">
                        <div class="text-center">
                            <label class="w-full cursor-pointer">
                                <input type="file" id="uploadFile" hidden  onchange="handleFileChange(event)"/>
                                <div class="flex w-full h-9 px-2 bg-gold rounded-lg text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none"
                                    style="background-color: #FFBF00;" >
                                    <span id="dropZoneText" class="text-lg font-bold" style="color: #FFFFFF">Choose
                                        File</span>
                                </div>
                            </label>
                            <p class="mt-2 text-sm text-gray-500">or drag a file into this area</p>
                        </div>
                    </div>
                    <div id="progressLoadingImg" class="flex flex-col mt-2 w-full hidden">
                        <!-- Progress Bar -->
                        <div class="w-full bg-gray-200 rounded-lg h-2">
                            <div id="progressBar" class="h-2 bg-blue-500 rounded-lg" style="width: 0%;"></div>
                        </div>
                        <!-- Progress Text -->
                        <span id="progressText" class="text-sm text-gray-500 text-center mt-2">0% Uploaded</span>
                    </div>
                </div>
            </div> <!-- Buttons Container -->
            <div class="w-full justify-center flex gap-7">
                <div class="w-5/12 h-max border rounded-md bg-white justify-center flex shadow-sm space-x-6">
                    <button id="rotateRight" class="w-24 h-24 text-black flex items-center justify-center">
                        <i class="fa-solid fa-rotate-right text-4xl"></i>
                    </button>
                </div>
                <div class=" w-5/12 h-max bg-white rounded-md border shadow-sm justify-center flex space-x-6 ">
                    <button id="rotateLeft" class="w-24 h-24 text-black flex items-center justify-center ">
                        <i class="fa-solid fa-rotate-left text-4xl"></i>
                    </button>
                </div>
            </div>
            <div class="w-full justify-center flex gap-7">
                <div class="w-2/5 h-max justify-center flex space-x-6 my-2">
                    <span class="text-sm justify-center font-bold text-shadow-lg text-black">clock wise</span>
                </div>
                <div class=" w-2/5 h-max justify-center flex space-x-6 my-2">
                    <span class="text-sm justify-center font-bold text-shadow-lg text-black">counter clock wise</span>
                </div>
            </div>

            <div class="w-full p-6 bg-white shadow rounded-lg my-3">
                <h2 class="text-lg font-semibold text-gray-700 mb-4">Straighten</h2>
                <div class="relative flex gap-2 items-center">
                    <!-- Slider -->
                    <input type="range"  min="-45" max="45" step="1" id="colorSlider"
                        class="w-10/12 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        ><span id="degree" class="text-black">0&deg;</span>
                </div>
                <span class="text-xs block text-gray-400 py-2">Rotate image in any angle</span>
            </div>

            <div class="w-full shadow rounded-lg my-3">
                <button id="resetButton" class="w-full h-10 bg-white rounded-lg cursor-pointer mt-4 text-black"
                    >Reset</button>
            </div>
            <hr class=" border-3">
            <div class="w-full shadow rounded-lg my-8">
                <button
                    class="w-full h-16 bg-sky-400 rounded-lg cursor-pointer mt-4 text-white text-lg antialiased font-bold"
                    onclick="processImage()">Process Image</button>
            </div>
        </aside>



        <!-- Main Content -->
        <main class="w-full  md:w-3/4 bg-white shadow">
            <div class="w-full h-28 border-b-2 p-6">
                <div></div>
            </div>
            <div class="w-full min-h-[736px] max-h-[736px]">
                <div class="flex justify-center items-center w-[1084px] h-[680px] overflow-hidden bg-gray-100">
                    <span id="dynamic_img" class="p-8">
                        <img id="uploadedImage" src="{{ asset('storage/cut_logo.png') }}" alt="Demo Image"
                            class="object-contain max-w-full max-h-full">
                    </span>
                </div>
            </div>
            <div class="w-full h-28 border-t-2 p-6">
                <div></div>
            </div>
        </main>
    </div>
    <script type="module" src="{{ asset('js/rotate.js') }}" ></script>
    {{-- defer --}}
@endsection

@section('title')
    Rotate Image
@endsection
