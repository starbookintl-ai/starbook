// ======================================================== PAGE DETECTION ========================================
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("#cf-grid-celebs")) cfInitHome();
  else if (document.querySelector("#cf-profile")) cfInitCeleb();
  else if (document.querySelector("#cf-event")) cfInitEvent();
});
//=================================================================================================================









//========================================================= HOME PAGE ==============================================
//==================================================================================================================
//==================================================================================================================
function cfInitHome() {
  const celebGrid = document.querySelector("#cf-grid-celebs");
  const eventGrid = document.querySelector("#cf-grid-events");
  const searchInput = document.querySelector("#cf-search");
  const suggestions = document.querySelector("#cf-suggestions");
  const searchBtn = document.querySelector("#cf-search-btn");
  const modal = document.querySelector("#cf-modal");
  const modalClose = document.querySelector("#cf-modal-close");








  //============================================= Render celebrities =============================================
  //  FALLBACK_CELEBS.slice(0,8).forEach(c => {
    FALLBACK_CELEBS.forEach(c => {
    const card = document.createElement("article");
    card.className = "cf-card";
    card.innerHTML = `
      <img src="${c.image}" alt="${c.name}">
      <div class="cf-card-content">
        <h3>${c.name}</h3>
        <p>${c.role}</p>
      </div>
      <div class="cf-card-actions">
        <button class="cf-btn-view" data-type="celeb" data-id="${c.id}">View</button>
      </div>`;
    celebGrid.appendChild(card);
  });
  //==============================================================================================================






  //============================================= Click handlers =================================================
  document.body.addEventListener("click", e => {
    if (e.target.classList.contains("cf-btn-view")) {
      const type = e.target.dataset.type;
      const id = e.target.dataset.id;
      if (type === "celeb") window.location.href = `celebinfo.html?id=${id}`;
      else window.location.href = `eventinfo.html?id=${id}`;
    }
  });
  //===============================================================================================================






  //============================================ Search suggestions ===============================================
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    suggestions.innerHTML = "";
    if (!q) return (suggestions.style.display = "none");

    const celebMatches = FALLBACK_CELEBS.filter(c => c.name.toLowerCase().includes(q));
    const eventMatches = FALLBACK_EVENTS.filter(e => e.name.toLowerCase().includes(q));

    const results = [...celebMatches.map(c => ({ type: "celeb", ...c })), ...eventMatches.map(e => ({ type: "event", ...e }))];



    if (results.length === 0) {
      suggestions.innerHTML = `<div class="cf-suggestion-item"><div class="cf-suggestion-info"><span class="cf-suggestion-name">No matching results</span></div></div>`;
      suggestions.style.display = "block";
      return;
    }

    results.slice(0, 8).forEach(r => {
      const item = document.createElement("div");
      item.className = "cf-suggestion-item";
      item.innerHTML = `
        <img src="${r.image}" alt="${r.name}" class="cf-suggestion-img">
        <div class="cf-suggestion-info">
          <span class="cf-suggestion-name">${r.name}</span>
          <span class="cf-suggestion-role">${r.type === "celeb" ? r.role : r.venue}</span>
        </div>`;
      item.addEventListener("click", () => {
        searchInput.value = r.name;
        suggestions.style.display = "none";
      });

      suggestions.appendChild(item);
    });
    suggestions.style.display = "block";

   });





  //============================================================================================================





  // ============================================== Search button ==================================================
  searchBtn.addEventListener("click", () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) return;
    const celeb = FALLBACK_CELEBS.find(c => c.name.toLowerCase() === q);
    const event = FALLBACK_EVENTS.find(e => e.name.toLowerCase() === q);

    if (celeb) window.location.href = `celebinfo.html?id=${celeb.id}`;
    else if (event) window.location.href = `eventinfo.html?id=${event.id}`;
    else modal.style.display = "flex";
  });

    //when user click enter key when typing on the search bar
    searchInput.addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
    searchBtn.click();
    }
  });

  modalClose.addEventListener("click", () => (modal.style.display = "none"));
  modal.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });
}

//==================================================================================================================
//==================================================================================================================
//==================================================================================================================








