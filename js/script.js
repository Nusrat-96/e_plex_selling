(function () {
    'use strict';

    const header = document.getElementById('siteHeader');
    const backToTop = document.getElementById('backToTop');

    function onScroll() {
        const y = window.scrollY;
        if (header) header.classList.toggle('scrolled', y > 40);
        if (backToTop) backToTop.classList.toggle('visible', y > 400);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backToTop) {
        backToTop.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offset = (header ? header.offsetHeight : 0) + 10;
                    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
        });
    });

    const navCollapse = document.getElementById('mainNav');
    if (navCollapse) {
        navCollapse.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(function (link) {
            link.addEventListener('click', function () {
                if (navCollapse.classList.contains('show') && window.innerWidth < 992) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navCollapse) || new bootstrap.Collapse(navCollapse, { toggle: false });
                    bsCollapse.hide();
                }
            });
        });
    }

    if (window.innerWidth >= 992) {
        document.querySelectorAll('.main-navbar .dropdown').forEach(function (drop) {
            const toggle = drop.querySelector('.dropdown-toggle');
            const menu = drop.querySelector('.dropdown-menu');
            if (!toggle || !menu) return;
            drop.addEventListener('mouseenter', function () { menu.classList.add('show'); toggle.setAttribute('aria-expanded', 'true'); });
            drop.addEventListener('mouseleave', function () { menu.classList.remove('show'); toggle.setAttribute('aria-expanded', 'false'); });
        });
    }

    const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };
    const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                io.unobserve(entry.target);
            }
        });
    }, observerOptions);
    document.querySelectorAll('.service-card, .blog-card, .testimonial-card, .section-head, .about-image-wrap').forEach(function (el) {
        el.classList.add('reveal');
        io.observe(el);
    });

    const counters = document.querySelectorAll('.stat-item h3');
    const counterIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseFloat(el.textContent);
            const suffix = el.querySelector('span') ? el.querySelector('span').textContent : '';
            if (isNaN(target)) return;
            let current = 0;
            const step = target / 40;
            const tick = setInterval(function () {
                current += step;
                if (current >= target) {
                    el.innerHTML = (Number.isInteger(target) ? target : target.toFixed(1)) + '<span>' + suffix + '</span>';
                    clearInterval(tick);
                } else {
                    el.innerHTML = (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + '<span>' + suffix + '</span>';
                }
            }, 30);
            counterIO.unobserve(el);
        });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterIO.observe(el); });

    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
    const sections = Array.from(navLinks)
        .map(function (link) {
            const id = link.getAttribute('href').slice(1);
            return { link: link, section: document.getElementById(id) };
        })
        .filter(function (item) { return item.section; });

    function onScrollSpy() {
        const offset = (header ? header.offsetHeight : 0) + 80;
        let currentId = null;
        sections.forEach(function (item) {
            const top = item.section.getBoundingClientRect().top;
            if (top <= offset) currentId = item.section.id;
        });
        navLinks.forEach(function (l) { l.classList.remove('active'); });
        if (currentId) {
            const match = sections.find(function (i) { return i.section.id === currentId; });
            if (match) match.link.classList.add('active');
        } else if (navLinks[0]) {
            navLinks[0].classList.add('active');
        }
    }
    window.addEventListener('scroll', onScrollSpy, { passive: true });
    onScrollSpy();

    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const filter = btn.getAttribute('data-filter');
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            portfolioItems.forEach(function (item) {
                const match = filter === 'all' || item.getAttribute('data-category') === filter;
                item.classList.toggle('hide', !match);
            });
        });
    });

    document.querySelectorAll('form:not(.newsletter-form)').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                const orig = btn.innerHTML;
                btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> Message Sent';
                btn.disabled = true;
                setTimeout(function () { btn.innerHTML = orig; btn.disabled = false; form.reset(); }, 2500);
            }
        });
    });
})();
