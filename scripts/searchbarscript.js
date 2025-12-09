//  =========================================== NAV SEARCH BAR BEHAVOUR  =============================================
/* --- DOM References --- */
const searchBox = document.getElementById('searchBox');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const cancelBtn = document.getElementById('cancelBtn');
const searchBtn = document.getElementById('searchBtn');
const navLeft = document.querySelector('.nav-left');
const navRight = document.querySelector('.nav-right');

let expanded = false;
const DURATION = 500;

/* --- Nav Search Bar Expand --- */
function expandSearch() {
  if (expanded) return;
  expanded = true;

  navLeft.style.opacity = '0';
  navRight.style.opacity = '0';

  setTimeout(() => {
    navLeft.style.display = 'none';
    navRight.style.display = 'none';
    cancelBtn.style.display = 'flex';
    searchBox.classList.add('expanded');
    cancelBtn.classList.add('visible');
  }, DURATION);
}

/* --- Nav Search Bar Collapse --- */
function collapseSearch() {
  if (!expanded) return;
  expanded = false;

  cancelBtn.classList.remove('visible');
  searchResults.classList.remove('visible');

  setTimeout(() => {
    searchBox.classList.remove('expanded');
    navLeft.style.display = 'flex';
    navRight.style.display = 'flex';
    cancelBtn.style.display = 'none';
    setTimeout(() => {
      navLeft.style.opacity = '1';
      navRight.style.opacity = '1';
    }, DURATION);
  }, DURATION);
}

function clearsearchbar(){
  searchInput.value = r.name;
}

/* --- Event Bindings --- */
searchInput.addEventListener('focus', expandSearch);
cancelBtn.addEventListener('click', collapseSearch);
searchBtn.addEventListener('click', collapseSearch);
document.addEventListener('click', e => {
  if (!searchBox.contains(e.target)) collapseSearch();
});

//  ==========================================================================================================