// ======================================================== PAGE DETECTION ========================================
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("#cf-grid-celebs")) cfInitHome();
  else if (document.querySelector("#cf-profile")) cfInitCeleb();
  else if (document.querySelector("#cf-event")) cfInitEvent();
});
//=================================================================================================================





//  =========================================== SLIDE BAR BEHAVIOUR  ================================================
let slideIndex = 0;
const slides = document.querySelectorAll(".slides");
const dots = document.querySelectorAll(".dots .dot");
function showSlide(n) { slides.forEach((s, i) => { s.style.opacity = i === n ? "1" : "0"; dots[i].classList.toggle("active", i === n); }); }
function changeSlide(n) { slideIndex = (slideIndex + n + slides.length) % slides.length; showSlide(slideIndex); }
setInterval(() => changeSlide(1), 7000);
//  ====================================================================================================================






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
  //FALLBACK_CELEBS.forEach(c => {
  FALLBACK_CELEBS.slice(0,8).forEach(c => {
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






  //=============================================== Render events =================================================
  FALLBACK_EVENTS.slice(0,4).forEach(e => {
    const card = document.createElement("article");
    card.className = "cf-card";
    card.innerHTML = `
      <img src="${e.image}" alt="${e.name}">
      <div class="cf-card-content">
        <h3>${e.name}</h3>
        <p style="margin: 20px 0px">${e.description}</p>
        <p><span>${e.date}</span> | <span>${e.venue}</span></p>
      </div>
      <div class="cf-card-actions">
        <button class="cf-btn-view" data-type="event" data-id="${e.id}">Get Pass</button>
      </div>`;
    eventGrid.appendChild(card);
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








//==================================================== CELEB PAGE ================================================
//==================================================================================================================
//==================================================================================================================
 // --- Simulate getting selected celeb ID from URL ---
 const urlParams = new URLSearchParams(window.location.search);
 const celebId = parseInt(urlParams.get('id')) || 1; // fallback

 // --- Load data (assuming data.js defines FALLBACK_CELEBS) --- 
 const celeb = FALLBACK_CELEBS.find(c => c.id === celebId);

 if (celeb) {
   document.getElementById('cf-image').src = celeb.image;
   document.getElementById('cf-name').textContent = celeb.name;
   document.getElementById('cf-availability-value').textContent = celeb.availability;
   document.getElementById('cf-role').textContent = celeb.role;
   document.getElementById('cf-base').textContent = celeb.primary_residential_region;
   document.getElementById('cf-rating').textContent = celeb.rating;
   document.getElementById('cf-bio-heading').textContent = celeb.bio_heading;
   document.getElementById('cf-bio-body').textContent = celeb.bio_body;
   document.getElementById('cf-upcoming-events').textContent = celeb.upcoming_events;


   //--- Book Now button function ---
   document.getElementById('bookBtn').addEventListener("click", e => {
    window.location.href = `CelebBookingForm.html?id=${celebId}`;
    });


   // --- Calculate Age ---
   if (celeb.dob) {
     const birthDate = new Date(celeb.dob);
     const today = new Date();
     let age = today.getFullYear() - birthDate.getFullYear();
     const monthDiff = today.getMonth() - birthDate.getMonth();
     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
       age--;
     }
     document.getElementById('cf-age').textContent = `${age}`;
   }

   // --- Availability Indicator ---
   const availabilityEl = document.getElementById('cf-availability');
   const dot = availabilityEl.querySelector('.cf-dot');
   const text = availabilityEl.querySelector('span:last-child');
   const status = celeb.availability?.toLowerCase() || 'available';
   dot.className = 'cf-dot ' + (status.includes('limited') ? 'limited' : status.includes('unavailable') ? 'unavailable' : 'available');
   text.textContent = celeb.availability;
 }

 // --- Scroll Animation: Wave Fade-In ---
/* const cards = document.querySelectorAll('.cf-card');
 const observer = new IntersectionObserver(entries => {
   entries.forEach((entry, idx) => {
     if (entry.isIntersecting) {
       setTimeout(() => entry.target.classList.add('visible'), idx * 150);
     }
   });
 }, { threshold: 0.2 });
 cards.forEach(card => observer.observe(card));*/
//==================================================================================================================
//==================================================================================================================
//==================================================================================================================








//====================================================== EVENT PAGE ================================================
//==================================================================================================================
//==================================================================================================================
function cfInitEvent() {
  const id = parseInt(new URLSearchParams(location.search).get("id"));
  const e = FALLBACK_EVENTS.find(x => x.id === id);
  if (!e) return (document.body.innerHTML = "<h2>Event not found</h2>");
  document.getElementById("cf-event").innerHTML = `
    <div class="cf-event-hero"><img src="${e.image}"><div class="cf-event-info"><h1>${e.name}</h1><p>${e.date} | ${e.venue}</p></div></div>
    <div class="cf-content"><p>${e.desc}</p><button class="cf-btn-pass">Book Event Pass</button></div>`;
  document.querySelector(".cf-btn-pass").addEventListener("click", () => alert(`Pass booked for ${e.name}`));
}
//==================================================================================================================
//==================================================================================================================
//==================================================================================================================


