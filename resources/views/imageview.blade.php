@extends('layout.mainView')
    @section('content')
    <div class="container">
        <h1>Resize Your Image</h1>
        <div class="resize-container">
            <!-- Image Section -->
            <div class="image-section">                
                <img src="{{ $imageUrl }}" alt="Uploaded Image" id="uploaded-image" />
            </div>
            
            <!-- Resize Tool Form Section -->
            <div class="form-section">
                <form id="resizeForm" method="POST" action="{{ route('resize-image') }}">
                    @csrf
                    <input type="hidden" name="filename" value="{{ $filename }}">
    
                    <!-- Width and Height Inputs with Unit Selection -->
                    <label for="width">Width:</label>
                    <input type="number" name="width" id="width" required>
    
                    {{-- <label for="width-unit">Width Unit:</label>
                    <select name="width_unit" id="width-unit">
                        <option value="px">px</option>
                        <option value="in">inches</option>
                        <option value="cm">cm</option>
                    </select> --}}
    
                    <label for="height">Height:</label>
                    <input type="number" name="height" id="height" required>
    
                    <label for="height-unit">Unit:</label>
                    <select name="unit" id="unit">
                        <option value="px">px</option>
                        <option value="in">inches</option>
                        <option value="cm">cm</option>
                    </select>
    
                    <!-- Target Size Field -->
                    <label for="target_size">Target File Size (KB):</label>
                    <input type="number" name="target_size" id="target_size" placeholder="Enter target size in KB" >

                    <label for="quality_image">Image Quality:</label>
                    <input type="number" name="quality_image" id="quality_image" placeholder="" >
    
                    <!-- Format Selection -->
                    <label for="format">Save As Format:</label>
                    <select name="format" id="format">
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="gif">GIF</option>
                    </select>
    
                    <!-- Submit Button -->
                    <button type="submit">Resize and Save</button>
                </form>
            </div>
        </div>
         
    </div>
    @endsection

