<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Metadata Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }

        .container {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
        }

        .logo {
            text-align: center;
            margin-bottom: 20px;
        }

        .logo img {
            width: 150px;
        }

        h2 {
            text-align: center;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        table,
        th,
        td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }

        .gps {
            text-align: center;
            margin-top: 20px;
        }

        .gps a {
            color: blue;
        }
    </style>
</head>

<body>

    <div class="logo">
        <img src="{{ public_path('storage/cut_logo.png') }}" alt="Company Logo">
        <h2>Image Metadata Report</h2>
    </div>

    <div class="container">
        <h3 style="text-align: center;">📷 Image Details</h3>
        <table>
            <tr>
                <th>File Name</th>
                <td>{{ $image }}</td>
            </tr>
            <tr>
                <th>File Size</th>
                <td>{{ $metadata['FileSize'] ?? 'Unknown' }} bytes</td>
            </tr>
            <tr>
                <th>Mime Type</th>
                <td>{{ $metadata['MIMEType'] ?? 'Unknown' }}</td>
            </tr>
            <tr>
                <th>Image Width</th>
                <td>{{ $metadata['ImageWidth'] ?? 'Unknown' }}</td>
            </tr>
            <tr>
                <th>Image Height</th>
                <td>{{ $metadata['ImageHeight'] ?? 'Unknown' }}</td>
            </tr>
        </table>

        <h3 style="text-align: center;">🛠 Metadata</h3>
        <table>
            @foreach ($metadata as $key => $value)
                @if (!is_array($value))
                    @if ($key != 'SourceFile' && $key != 'Directory')
                        <tr>
                            <th>{{ $key }}</th>
                            <td>{{ $value }}</td>
                        </tr>
                    @endif
                @endif
            @endforeach
        </table>

        @if ($latitude && $longitude)
            <div class="gps">
                <h3 style="text-align: center;">📍 GPS Location</h3>
                <p>Latitude: {{ $latitude }}, Longitude: {{ $longitude }}</p>
                <p><a href="{{ $googleMapsUrl }}" target="_blank">View on Google Maps</a></p>
            </div>
        @else
            <div class="gps">
                <h3>⚠️ No GPS Data Found</h3>
                <p>This image does not contain location metadata.</p>
            </div>
        @endif
    </div>

</body>

</html>
