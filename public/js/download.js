
const overlay = document.getElementById('freezeOverlay');

$(document).ready(function () {

    $(document).on('click', '#closeAlert', function () {
        overlay.classList.add('hidden');
        window.location.href = '/';
    })
    /*
        $(document.body).on('click', '#download_image', function () {
            let filename = $(this).attr('filename');
            console.log(filename);
            let downloadDelay = 5000;
            overlay.classList.remove('hidden');
    
            const monitorDownload = setInterval(() => {
                const xhr = new XMLHttpRequest();
                xhr.open('HEAD', `/storage/uploads/${filename}`, true);
    
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        clearInterval(monitorDownload);
                        setTimeout(() =>{
                            $.ajax({
                                url: '/delete-image',
                                method: 'POST',
                                data: JSON.stringify({
                                    filename: filename,
                                }),
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                                },
                                success: function (data) {
                                    console.log(data);
                                    if (data.status === 1) {                    
                                        overlay.classList.remove('hidden');
                                    }
                    
                                },
                                error: function (err) {
                                    console.error(err);
                                }
                            },downloadDelay)
                        })
                    }
                }
            });
    
            
    
        })
    */

    $(document.body).on('click', '#download_image', function () {
        let filename = $(this).attr('filename');
        let downloadDelay = 2000; 

        // Show overlay
        const overlay = document.getElementById('freezeOverlay');
        overlay.classList.remove('hidden');

        // Monitor download progress
        const monitorDownload = setInterval(() => {
            const xhr = new XMLHttpRequest();
            xhr.open('HEAD', `/storage/uploads/${filename}`, true);

            xhr.onload = function () {
                if (xhr.status === 200) {
                    clearInterval(monitorDownload); 
                    setTimeout(() => {
                        $.ajax({
                            url: '/delete-image',
                            method: 'POST',
                            data: JSON.stringify({ filename: filename }),
                            contentType: 'application/json',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                            },
                            success: function (data) {
                                console.log('File deleted successfully.');
                            },
                            error: function (err) {
                                console.error('Error deleting file:', err);
                            },
                        });
                    }, downloadDelay);
                }
            };

            xhr.onerror = function () {
                console.error('Error checking download status.');
            };

            xhr.send();
        }, 300); 

        // Close overlay manually
        document.getElementById('closeAlert').addEventListener('click', function () {
            clearInterval(monitorDownload); // Stop monitoring
            overlay.classList.add('hidden');
            window.location.href = '/';
        });
    });
})