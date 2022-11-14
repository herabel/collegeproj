const filterInputs = document.querySelectorAll('.filters input');
const resetButton = document.querySelector('.btn-reset');
const imageToChange = document.querySelector('.editor img');
const nextPictureButton = document.querySelector('.btn-next');
const loadButton = document.querySelector('.btn-load--input');
const saveButton = document.querySelector('.btn-save');
const fullScreenButton = document.querySelector('.fullscreen');
let imgIndex = 1;
const filters = {
  blur: 0,
  invert: 0,
  sepia: 0,
  saturate: '100%',
  'hue-rotate': 0,
}

const resetFilters = () => {
  const defaultFilterValues = {
    blur: 0,
    invert: 0,
    sepia: 0,
    saturate: '100%',
    'hue-rotate': 0,
  };
  filterInputs.forEach(filterInput => filterInput.value = defaultFilterValues[filterInput.name]);
  filterInputs.forEach(handleFilters);
};

const currentTimeOfTheDay = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 6) {
    return 'night';
  } else if (currentHour < 12) {
    return 'morning';
  } else if (currentHour < 18) {
    return 'day';
  } else {
    return 'evening';
  }
}

const handleFilters = (filter) => {
  const suffix = filter.dataset.sizing || '';
  document.documentElement.style.setProperty(`--${filter.name}`, `${filter.value}${suffix}`);
  filters[filter.name] = `${filter.value}${suffix}`;
}

function viewBgImage(src) {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    body.style.backgroundImage = `url(${src})`;
  };
}

const showNextPicture = () => {
  let baseUrl = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/`;
  imageToChange.src = `${baseUrl}${currentTimeOfTheDay()}/${("0" + imgIndex).slice(-2)}.jpg`;
  imgIndex < 20 ? imgIndex++ : imgIndex = 1;
}

const readImage = () => {
  const file = loadButton.files[0];
  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    imageToChange.src = event.target.result;
  });
  reader.readAsDataURL(file)
}

const downloadImg = () => {
  const image = new Image();
  image.setAttribute('crossOrigin', 'anonymous')
  image.src = imageToChange.src;
  let canvas = document.createElement('canvas');
  image.onload = () => {
    canvas.width = image.width; // or 'width' if you want a special/scaled size
    canvas.height = image.height; // or 'height' if you want a special/scaled size
    let ctx = canvas.getContext('2d');
    ctx.filter = '';
    for (let prop in filters) {
      if (ctx.filter === 'none') {
        ctx.filter = `${prop}(${filters[prop]})`;
        console.log(ctx.filter)
      } else {
        ctx.filter = `${ctx.filter} ${prop}(${filters[prop]})`;
      }
    }
    console.log(ctx.filter)
    ctx.drawImage(image,0,0, canvas.width, canvas.height);
    let link = document.createElement('a')
    link.download = 'download.png';
    link.href = canvas.toDataURL();
    link.click();
  }
}

const toggleFullscreen = () => {
  let elem = document.querySelector("body");
  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch(err => {
      alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
    document.exitFullscreen();
  }
}

filterInputs.forEach((element) => addEventListener('input', () => {
  element.parentElement.querySelector('output').value = element.value;
  handleFilters(element);
}));

loadButton.addEventListener('change', readImage);
resetButton.addEventListener('click', resetFilters);
nextPictureButton.addEventListener('click', showNextPicture);
saveButton.addEventListener('click', downloadImg);
fullScreenButton.addEventListener('click', toggleFullscreen);
