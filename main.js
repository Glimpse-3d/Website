/* --------------------------------------------------
MENU
-------------------------------------------------- */

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

/* --------------------------------------------------
SCROLL INDICATOR
-------------------------------------------------- */

const scrollIndicator = document.getElementById('scrollIndicator');

window.addEventListener('scroll', () => {
    if (window.scrollY > 120) {
        scrollIndicator.classList.add('hidden');
    } else {
        scrollIndicator.classList.remove('hidden');
    }
});


/* --------------------------------------------------
LOADER INITIAL MODEL
-------------------------------------------------- */

const mv = document.querySelector('model-viewer');
const bar = document.getElementById('loader-bar');
const percent = document.getElementById('loader-percent');
const loader = document.getElementById('model-loader');

mv.addEventListener('progress', (e) => {
  const p = Math.round(e.detail.totalProgress * 100);
  bar.style.width = p + '%';
  percent.textContent = p + '%';
});

mv.addEventListener('load', () => {
  loader.style.opacity = '0';
  setTimeout(() => loader.style.display = 'none', 400);
});


/* --------------------------------------------------
CHANGE HERO MODEL
-------------------------------------------------- */

const models = [
'projects/model14/model14.gltf',
'projects/model9/model9.gltf',
'projects/model5/model5.gltf',
'projects/model13/model13.gltf'
];

let currentModelIndex = 0;

function changeModel() {

currentModelIndex = (currentModelIndex + 1) % models.length;

const mv = document.querySelector('model-viewer');
const btn = document.getElementById('change-model-btn');

mv.src = models[currentModelIndex];

btn.style.transform = 'rotate(360deg)';
btn.style.transition = 'transform 0.4s ease';

setTimeout(() => {
btn.style.transform = '';
btn.style.transition = '';
}, 400);

}

/* --------------------------------------------------
PORTFOLIO DATA
-------------------------------------------------- */

const projectImages = [

{
src:'projects/model16/thumbnail.png',
title:'Carlo Armchair',
client:'Munna',
model:'model16',
category:'product'
},

{
src:'projects/model15/thumbnail.png',
title:'Dale Chair',
client:'Laskasas',
model:'model15',
category:'product'
},

{
src:'projects/model14/thumbnail.png',
title:'Mudhif Chair',
client:'Alma de Luce',
model:'model14',
category:'product'
},

{
src:'projects/model9/thumbnail.png',
title:'Krysset Chair',
client:'Fredrik A. Kayser',
model:'model9',
category:'product'
},

{
src:'projects/model5/thumbnail.png',
title:'GF Chair',
client:'Gonçalo Fernandes',
model:'model5',
category:'product'
},

{
src:'projects/model13/thumbnail.png',
title:'Flowerpot',
client:'Verner Panton',
model:'model13',
category:'product'
},

{
src:'projects/model4/thumbnail.png',
title:'Cantareira',
client:'Eduardo Souto Moura',
model:'model4',
category:'architecture'
},

{
src:'projects/model3/thumbnail.png',
title:'IN PROGRESS',
client:'',
model:'model3',
category:'architecture'
},

{
src:'projects/model12/thumbnail.png',
title:'IN PROGRESS',
client:'',
model:'model12',
category:'architecture'
},

{
src:'projects/model8/thumbnail.png',
title:'IN PROGRESS',
client:'',
model:'model8',
category:'architecture'
}

];

/* --------------------------------------------------
PORTFOLIO RENDER
-------------------------------------------------- */

const track = document.getElementById('portfolio-track');
const currentSlide = document.getElementById('current-slide');
const totalSlides = document.getElementById('total-slides');

function renderProjects(filter="all"){

track.innerHTML="";

const filtered = projectImages.filter(p =>
filter==="all" || p.category===filter
);

filtered.forEach(item=>{

const a=document.createElement('a');

a.className='portfolio-item';

a.href=item.title==="IN PROGRESS"
? "#"
: `projects/general_html.html?model=${item.model}`;

a.innerHTML=`

<div class="portfolio-image">

<img src="${item.src}" alt="${item.title}" class="portfolio-thumb">


</div>

<div class="portfolio-info">

<h4>${item.title}</h4>
<span>${item.client}</span>

</div>

`;

track.appendChild(a);

});

if(totalSlides) totalSlides.textContent = filtered.length;

}

renderProjects();

/* --------------------------------------------------
FILTER BUTTONS
-------------------------------------------------- */

document.querySelectorAll(".filter-btn").forEach(btn=>{

btn.addEventListener("click",()=>{

document.querySelectorAll(".filter-btn")
.forEach(b=>b.classList.remove("active"));

btn.classList.add("active");

renderProjects(btn.dataset.filter);

});

});


/* --------------------------------------------------
SLIDE COUNTER
-------------------------------------------------- */

let isScrolling;

track.addEventListener('scroll', () => {

    window.clearTimeout(isScrolling);

    isScrolling = setTimeout(() => {

        const firstItem = track.querySelector('.portfolio-item');
        if (!firstItem) return;

        const itemWidth = firstItem.offsetWidth + 16;

        const currentIndex =
            Math.round(track.scrollLeft / itemWidth) + 1;

        if (currentSlide)
            currentSlide.textContent =
                Math.min(currentIndex, projectImages.length);

    }, 100);

});

/* --------------------------------------------------
REVEAL ANIMATION
-------------------------------------------------- */

function reveal(){

document.querySelectorAll('.reveal').forEach(el=>{

if(el.getBoundingClientRect().top <
window.innerHeight - 80){

el.classList.add('active');

}

});

}

window.addEventListener('scroll', () => {
    requestAnimationFrame(reveal);
});
document.addEventListener('DOMContentLoaded', reveal);

/* --------------------------------------------------
FAQ
-------------------------------------------------- */

document.querySelectorAll('.faq-question').forEach(btn => {

btn.addEventListener('click', () => {

const item = btn.parentElement;

const isOpen = item.classList.contains('open');

document.querySelectorAll('.faq-item')
.forEach(i => i.classList.remove('open'));

if (!isOpen) item.classList.add('open');

});

});

/* --------------------------------------------------
KEY SHORTCUT
-------------------------------------------------- */

document.addEventListener('keydown', (e) => {

if (e.key === 't' || e.key === 'T') {

window.location.href = 'thumbs/modelviewer.html';

}

});


/* --------------------------------------------------
ABRIR DESCRIÇÕES BENEFICIOS TLM
-------------------------------------------------- */
document.querySelectorAll('.benefit-card').forEach(card => {
    card.querySelector('.benefit-toggle').addEventListener('click', () => {
        card.classList.toggle('open');
    });
});

/* --------------------------------------------------
ABRIR PASSOS HOW IT WORKS TLM
-------------------------------------------------- */
document.querySelectorAll('.step-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.step').classList.toggle('open');
    });
});