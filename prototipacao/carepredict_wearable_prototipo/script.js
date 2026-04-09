const screens = document.querySelectorAll('.screen');
const buttons = document.querySelectorAll('[data-go]');
const navBtns = document.querySelectorAll('.nav-btn');

function showScreen(id){
  screens.forEach(screen => screen.classList.toggle('active', screen.id === id));
  navBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.go === id));
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    showScreen(btn.dataset.go);
  });
});
