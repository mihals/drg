import {loadAtlas} from './game';
let btnEl = document.getElementById("starterBtn")
btnEl.addEventListener('click',() => {
    alert("btnCliked")
})
btnEl.disabled = false;
loadAtlas()