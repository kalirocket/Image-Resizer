const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const output_path = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const height_input = document.querySelector('#height');
const width_input = document.querySelector('#width');


const loadImage = (e) => {
    const file = e.target.files[0];

    if (!isFileImage(file)) {
        console.log('Please select an image');
        return null;
    }

    // Get original dimensions
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = function () {
        width_input.value = this.width;
        height_input.value = this.height;
    }

    form.classList.remove('hidden');
    filename.textContent = file.name;
}

// Make sure file is image
function isFileImage(file) {
    const accepted_image_types = ['image/gif', 'image/png', 'image/jpg', 'image/jpeg'];
    return file && accepted_image_types.includes(file['type']);
}

img.addEventListener('change', loadImage);