const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const output_path = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const height_input = document.querySelector('#height');
const width_input = document.querySelector('#width');

const loadImage = (e) => {
    const file = e.target.files[0];

    if (!isFileImage(file)) {
        alert_('Please select an image', true);
        return null;
    }

    // Get original dimensions
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = function () {
        width_input.value = this.width;
        height_input.value = this.height;
    }

    output_path.textContent = path.join(os.homedir(), 'imageresizer');

    form.classList.remove('hidden');
    filename.textContent = file.name;
}

// Send image data to main
const sendImage = (e) => {
    e.preventDefault();

    const width = width_input.value;
    const height = height_input.value
    const imgPath = img.files[0].path;

    if (!img.files[0]) {
        alert_('Please upload an image!', true);
        return null;
    }

    if (width === '' || height.value === '') {
        alert_('Please fill in a height and width', true);
        return null;
    }

    // Send to main using ipcRenderer
    ipcRenderer.send('image:resizer', {
        imgPath,
        height,
        width
    });
}

// Catch the image:done event
ipcRenderer.on('image:done', () => {
    alert_(`Image resized to ${width_input.value} x ${height_input.value}`, false);
});

// Make sure file is image
function isFileImage(file) {
    const accepted_image_types = ['image/gif', 'image/png', 'image/jpg', 'image/jpeg'];
    return file && accepted_image_types.includes(file['type']);
}

function alert_(message, is_error = false) {
    Toastify.toast({
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: is_error ? 'red' : 'green',
            color: 'white',
            textAlign: 'center'
        }
    })
}

img.addEventListener('change', loadImage);
form.addEventListener('submit', sendImage);