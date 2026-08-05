(() => {
  const cfg = window.ARBEQUINA_CONFIG || {};
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  // Header and navigation
  const header = $('.site-header');
  const syncHeader = () => header?.classList.toggle('scrolled', window.scrollY > 20 || document.body.dataset.page !== 'home');
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });
  const menu = $('.nav-links');
  $('.menu-toggle')?.addEventListener('click', () => menu?.classList.toggle('open'));
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => menu?.classList.remove('open')));
  const page = document.body.dataset.page;
  $(`[data-nav="${page}"]`)?.classList.add('active');

  // Availability bridge
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  $$('input[type="date"]').forEach(input => input.min = minDate);
  $$('[data-booking-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(form);
      const params = new URLSearchParams();
      ['checkin','checkout','guests'].forEach(k => data.get(k) && params.set(k, data.get(k)));
      window.location.href = `book.html?${params.toString()}`;
    });
  });

  // Booking page: activate the Smoobu iframe when the URL is configured.
  const iframe = $('[data-smoobu-frame]');
  const placeholder = $('[data-booking-placeholder]');
  if (iframe && cfg.smoobuBookingUrl) {
    iframe.src = cfg.smoobuBookingUrl;
    iframe.hidden = false;
    placeholder?.remove();
  }
  const qs = new URLSearchParams(location.search);
  ['checkin','checkout','guests'].forEach(key => {
    const el = $(`[name="${key}"]`);
    if (el && qs.get(key)) el.value = qs.get(key);
  });

  // Interactive room tour
  const roomData = {
    living: {
      image: 'assets/images/interior-wide.webp',
      title: 'Living & dining',
      copy: 'A bright, open space for slow mornings, shared meals and easy evenings after exploring Playa Flamenca.',
      features: ['Comfortable lounge', 'Dining area', 'Terrace connection']
    },
    kitchen: {
      image: 'assets/images/kitchen.webp',
      title: 'Kitchen',
      copy: 'A practical space for breakfast, groceries and simple meals whenever you prefer an evening at home.',
      features: ['Preparation space', 'Everyday storage', 'Dining connection']
    },
    bedroom: {
      image: 'assets/images/bedroom.webp',
      title: 'Bedrooms',
      copy: 'Calm sleeping spaces designed for restful nights after beach days, shopping and time around the pool.',
      features: ['Restful atmosphere', 'Practical storage', 'Comfort-focused layout']
    },
    terrace: {
      image: 'assets/images/patio.webp',
      title: 'Private terrace',
      copy: 'A private outdoor setting for morning coffee, unhurried meals and warm Mediterranean evenings.',
      features: ['Outdoor dining', 'Lounge seating', 'Open-air living']
    },
    pools: {
      image: 'assets/images/pool-main.webp',
      title: 'Pools & amenities',
      copy: 'Shared resort-style spaces for easy afternoons close to the apartment.',
      features: ['Main pool', 'Pool and bar area', 'Landscaped surroundings']
    }
  };
  const updateTour = key => {
    const room = roomData[key];
    if (!room) return;
    $$('.tour-tab').forEach(b => b.classList.toggle('active', b.dataset.room === key));
    const img = $('[data-tour-image]');
    if (img) {
      img.style.opacity = '.25';
      setTimeout(() => { img.src = room.image; img.alt = room.title; img.style.opacity = '1'; }, 120);
    }
    const title = $('[data-tour-title]');
    const copy = $('[data-tour-copy]');
    const list = $('[data-tour-features]');
    if (title) title.textContent = room.title;
    if (copy) copy.textContent = room.copy;
    if (list) list.innerHTML = room.features.map(x => `<li>${x}</li>`).join('');
  };
  $$('.tour-tab').forEach(btn => btn.addEventListener('click', () => updateTour(btn.dataset.room)));

  // Accordions
  $$('.accordion-trigger').forEach(btn => btn.addEventListener('click', () => {
    const item = btn.closest('.accordion-item');
    const open = item.classList.contains('open');
    $$('.accordion-item').forEach(x => x.classList.remove('open'));
    if (!open) item.classList.add('open');
    $$('.accordion-trigger').forEach(x => x.setAttribute('aria-expanded', x.closest('.accordion-item').classList.contains('open')));
  }));

  // Gallery filtering and lightbox
  $$('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
    $$('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    $$('.gallery-item').forEach(item => item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter));
  }));
  const lightbox = $('.lightbox');
  $$('.gallery-item').forEach(item => item.addEventListener('click', () => {
    const img = $('img', item);
    const target = $('img', lightbox);
    if (img && target) { target.src = img.src; target.alt = img.alt; lightbox.classList.add('open'); }
  }));
  const closeLightbox = () => lightbox?.classList.remove('open');
  $('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => e.target === lightbox && closeLightbox());
  document.addEventListener('keydown', e => e.key === 'Escape' && closeLightbox());

  // Stay planner
  const planner = $('[data-planner]');
  planner?.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(planner);
    const group = fd.get('group');
    const style = fd.get('style');
    const days = Number(fd.get('days'));
    const base = {
      relax: ['Settle in and enjoy a quiet terrace evening.', 'Spend an unhurried day between the beach and the pools.', 'Take a coastal walk and enjoy dinner nearby.'],
      family: ['Arrive, unpack and explore the community facilities.', 'Enjoy a beach morning followed by pool time.', 'Visit La Zenia Boulevard for family-friendly dining and entertainment.'],
      explore: ['Walk to Playa Flamenca and explore the coast.', 'Browse La Zenia Boulevard and enjoy local dining.', 'Mix a relaxed pool day with nearby cafés and essentials.']
    }[style] || [];
    const extra = ['Choose a favourite local spot and return at a slower pace.', 'Keep the final day flexible for the beach, pool or shopping.', 'Enjoy a calm morning before departure.'];
    const plan = [...base, ...extra].slice(0, Math.min(days, 6));
    const output = $('[data-planner-output]');
    if (output) output.innerHTML = `<p class="eyebrow">Your suggested stay</p><h3 class="subheading">A ${days}-day ${style} plan for ${group}.</h3><ol>${plan.map((x,i)=>`<li><strong>Day ${i+1}.</strong> ${x}</li>`).join('')}</ol><a class="btn btn-primary" href="book.html">Check dates for this stay</a>`;
  });

  // Concierge prototype
  const panel = $('.chat-panel');
  $('.chat-launcher')?.addEventListener('click', () => panel?.classList.toggle('open'));
  $('.chat-close')?.addEventListener('click', () => panel?.classList.remove('open'));
  const replies = {
    dates: 'Live dates and prices are handled by Smoobu. I can take you to the secure booking page now.',
    beach: 'The beaches are approximately 700 metres from Flamenca Village.',
    zenia: 'La Zenia Boulevard is approximately 700 metres away for shopping, dining and entertainment.',
    market: 'Mercadona is located immediately outside the community gate.',
    family: 'The apartment is presented as a family-friendly base with shared pools and nearby activities. Confirm the exact sleeping setup on the booking page before reserving.'
  };
  const addMessage = (text, cls='bot') => {
    const body = $('.chat-messages');
    if (!body) return;
    body.insertAdjacentHTML('beforeend', `<div class="message ${cls}">${text}</div>`);
    body.scrollTop = body.scrollHeight;
  };
  $$('[data-chat]').forEach(btn => btn.addEventListener('click', () => {
    addMessage(btn.textContent, 'user');
    setTimeout(() => addMessage(replies[btn.dataset.chat] || replies.dates), 180);
  }));
  $('[data-chat-form]')?.addEventListener('submit', e => {
    e.preventDefault();
    const input = $('input', e.currentTarget);
    const q = input.value.trim();
    if (!q) return;
    addMessage(q, 'user'); input.value = '';
    const low = q.toLowerCase();
    const answer = low.includes('beach') ? replies.beach : low.includes('zenia') || low.includes('shop') ? replies.zenia : low.includes('mercadona') || low.includes('supermarket') ? replies.market : low.includes('family') || low.includes('child') ? replies.family : replies.dates;
    setTimeout(() => addMessage(answer), 220);
  });

  // Contact helpers
  $$('[data-whatsapp]').forEach(a => {
    if (cfg.whatsappNumber) a.href = `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent('Hello, I am interested in Arbequina Apartment.')}`;
    else a.addEventListener('click', e => { e.preventDefault(); panel?.classList.add('open'); addMessage('WhatsApp will be enabled after the public host number is confirmed.'); });
  });


  // Open the concierge from any feature button.
  $$('[data-open-chat]').forEach(btn => btn.addEventListener('click', () => panel?.classList.add('open')));

  // Social profile links remain disabled until approved URLs are configured.
  $$('[data-instagram]').forEach(a => { if (cfg.instagramUrl) a.href = cfg.instagramUrl; else a.addEventListener('click', e => e.preventDefault()); });
  $$('[data-facebook]').forEach(a => { if (cfg.facebookUrl) a.href = cfg.facebookUrl; else a.addEventListener('click', e => e.preventDefault()); });

  // Standalone reference form. Replace with Wix Forms on the live Wix website.
  $('[data-contact-form]')?.addEventListener('submit', e => {
    e.preventDefault();
    const note = $('[data-form-note]', e.currentTarget);
    if (note) note.textContent = 'Thank you. In Wix, this form will create a contact and notify Isabelle through Wix Inbox.';
  });

  // Lightweight standalone analytics support. Wix production uses Marketing Integrations.
  const track = (name, params = {}) => {
    window.dispatchEvent(new CustomEvent('arbequina:event', { detail: { name, ...params } }));
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
  };
  $$('a[href="book.html"],a[href^="book.html?"]').forEach(a => a.addEventListener('click', () => track('check_availability_click', { page: document.body.dataset.page || 'unknown' })));
  $('.chat-launcher')?.addEventListener('click', () => track('concierge_open', { page: document.body.dataset.page || 'unknown' }));

})();
