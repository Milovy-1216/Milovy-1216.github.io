(function(){
  const nav = document.getElementById('siteNav');
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = Array.from(document.querySelectorAll('#home, #section1, #section2, #section3'));

  // Toggle mobile menu
  menuBtn.addEventListener('click', ()=>{
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.style.display = expanded ? 'none' : 'block';
  });

  // Custom smooth scroll with slower animation
  function smoothScrollTo(targetY, duration = 2000) { // 2 秒慢速
    const startY = window.pageYOffset;
    const diff = targetY - startY;
    let start;

    function step(timestamp) {
      if (!start) start = timestamp;
      const time = timestamp - start;
      const percent = Math.min(time / duration, 1);
      window.scrollTo(0, startY + diff * percent);
      if (time < duration) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // Scroll to section with custom slow scroll
  function scrollToSection(id){
    const el = document.getElementById(id);
    if(!el) return;
    const navHeight = nav.offsetHeight;
    const rectTop = el.getBoundingClientRect().top + window.pageYOffset;
    const target = Math.max(0, rectTop - navHeight - 8);
    smoothScrollTo(target, 2000); // 使用 2 秒平滑捲動
    if(window.innerWidth <= 768){
      mobileMenu.style.display = 'none';
      menuBtn.setAttribute('aria-expanded','false');
    }
  }

  // Attach click handlers
  document.querySelectorAll('a[data-target]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const id = a.getAttribute('data-target');
      scrollToSection(id);
      history.replaceState(null, '', '#' + id);
    });
  });

  // Update active link depending on scroll position
  function updateActiveLink(){
    const currentScroll = window.pageYOffset + nav.offsetHeight + 20;
    let currentId = sections[0].id;
    for(const s of sections){
      if(s.offsetTop <= currentScroll) currentId = s.id;
    }
    navLinks.forEach(a=> a.classList.toggle('active', a.getAttribute('data-target') === currentId));
    document.querySelectorAll('#mobileMenu a').forEach(a=> a.classList.toggle('active', a.getAttribute('data-target') === currentId));
  }

  // Add shadow when scrolling
  function handleSticky(){
    if(window.pageYOffset > 10){
      nav.classList.add('sticky');
    } else {
      nav.classList.remove('sticky');
    }
  }

  updateActiveLink();
  handleSticky();

  window.addEventListener('scroll', ()=>{
    handleSticky();
    updateActiveLink();
  }, {passive:true});

  // Scroll to hash on load
  if(location.hash){
    const id = location.hash.replace('#','');
    setTimeout(()=> scrollToSection(id), 100);
  }

  // Keyboard accessibility: Esc closes mobile menu
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      mobileMenu.style.display = 'none';
      menuBtn.setAttribute('aria-expanded','false');
    }
  });
})();
