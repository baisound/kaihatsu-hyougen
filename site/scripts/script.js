(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  const setMenu = (open) => {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.querySelector('.sr-only').textContent = open ? 'メニューを閉じる' : 'メニューを開く';
    mobileMenu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  };

  menuButton?.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  mobileMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  const revealItems = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -7% 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const navLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
  const sections = [...document.querySelectorAll('[data-section][id]')];
  if ('IntersectionObserver' in window && navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!current) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${current.target.id}`;
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-28% 0px -62% 0px', threshold: [0, .1, .3] });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  let ticking = false;
  const parallaxItems = [...document.querySelectorAll('[data-parallax]')];

  const updateScrollEffects = () => {
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    document.documentElement.style.setProperty('--progress', progress.toFixed(4));

    if (!reduceMotion) {
      parallaxItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const rate = Number(item.dataset.parallax || 0);
        const relative = rect.top + rect.height / 2 - window.innerHeight / 2;
        item.style.setProperty('--parallax-y', `${relative * rate}px`);
        item.style.transform = `translate3d(0, ${relative * rate}px, 0)`;
      });
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateScrollEffects);
  }, { passive: true });
  updateScrollEffects();

  const sendAnalyticsEvent = (name, parameters) => {
    if (window.siteAnalyticsConsent && window.siteAnalyticsConsent.get() !== 'granted') return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: name,
      site_environment: ['localhost', '127.0.0.1'].includes(window.location.hostname) ? 'local' : 'production',
      ...parameters
    });
  };

  const consentApi = window.siteAnalyticsConsent;
  const consentPanel = document.querySelector('[data-consent-panel]');
  const consentManage = document.querySelector('[data-consent-manage]');

  const setConsentPanel = (open) => {
    if (!consentPanel) return;
    consentPanel.hidden = !open;
    document.body.classList.toggle('consent-panel-open', open);
    if (open) consentPanel.querySelector('[data-consent-choice="granted"]')?.focus({ preventScroll: true });
  };

  if (consentApi && consentPanel) {
    if (consentApi.get() === null) setConsentPanel(true);

    consentPanel.querySelectorAll('[data-consent-choice]').forEach((button) => {
      button.addEventListener('click', () => {
        const previous = consentApi.get();
        const choice = button.dataset.consentChoice;
        consentApi.set(choice);
        setConsentPanel(false);
        if (previous === 'granted' && choice === 'denied') window.location.reload();
      });
    });

    consentManage?.addEventListener('click', () => setConsentPanel(true));
  }

  const getLinkText = (link) => (
    link.getAttribute('aria-label') || link.textContent || ''
  ).replace(/\s+/g, ' ').trim().slice(0, 100);

  const getLinkLocation = (link) => (
    link.closest('[id]')?.id || document.body.className || 'page'
  ).toString().slice(0, 100);

  const getSafeLinkUrl = (url) => `${url.origin}${url.pathname}`;

  const getCtaId = (link, url) => (
    link.dataset.ctaId
    || `${getLinkLocation(link)}:${url.pathname || 'page'}:${url.hash || 'link'}`
  ).toString().slice(0, 100);

  const getYouTubeId = (url) => {
    if (url.hostname === 'youtu.be') return url.pathname.slice(1);
    return url.searchParams.get('v') || url.pathname.split('/').filter(Boolean).pop();
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;

    const url = new URL(link.href, window.location.href);
    const ctaText = getLinkText(link);
    const ctaLocation = getLinkLocation(link);
    const ctaId = getCtaId(link, url);

    if (url.hostname === 'docs.google.com' && url.pathname.includes('/forms/')) {
      sendAnalyticsEvent('contact_form_open', {
        cta_id: ctaId,
        cta_text: ctaText,
        cta_location: ctaLocation,
        link_url: getSafeLinkUrl(url)
      });
      return;
    }

    if (url.hostname === 'youtube.com' || url.hostname === 'www.youtube.com' || url.hostname === 'youtu.be') {
      sendAnalyticsEvent('select_content', {
        content_type: 'youtube_video',
        item_id: getYouTubeId(url)
      });
      return;
    }

    if (link.matches('.action')) {
      sendAnalyticsEvent('cta_click', {
        cta_id: ctaId,
        cta_text: ctaText,
        cta_location: ctaLocation,
        link_url: getSafeLinkUrl(url)
      });
    }
  });

  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.setProperty('--ry', `${x * 3.4}deg`);
        card.style.setProperty('--rx', `${y * -3.4}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--rx', '0deg');
      });
    });
  }
})();
