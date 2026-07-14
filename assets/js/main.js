(function () {
  "use strict";

  const select = (el, all = false) => {
    const element = el.trim();
    return all ? [...document.querySelectorAll(element)] : document.querySelector(element);
  };

  const setText = (selector, value) => {
    const el = select(selector);
    if (el) {
      el.textContent = value;
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) {
      return "Active";
    }
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const on = (type, el, listener, all = false) => {
    const selected = select(el, all);
    if (!selected) {
      return;
    }
    if (all) {
      selected.forEach((item) => item.addEventListener(type, listener));
      return;
    }
    selected.addEventListener(type, listener);
  };

  const onscroll = (el, listener) => el.addEventListener("scroll", listener);

  const navLinks = select("#navbar .scrollto", true);
  const activateNavOnScroll = () => {
    const position = window.scrollY + 220;
    navLinks.forEach((link) => {
      if (!link.hash) {
        return;
      }
      const section = select(link.hash);
      if (!section) {
        return;
      }
      if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  };

  window.addEventListener("load", activateNavOnScroll);
  onscroll(document, activateNavOnScroll);

  const scrollto = (el) => {
    const target = select(el);
    if (!target) {
      return;
    }
    window.scrollTo({
      top: target.offsetTop,
      behavior: "smooth",
    });
  };

  on("click", ".mobile-nav-toggle", function () {
    select("body").classList.toggle("mobile-nav-active");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  on(
    "click",
    ".scrollto",
    function (e) {
      if (!select(this.hash)) {
        return;
      }
      e.preventDefault();
      const body = select("body");
      if (body.classList.contains("mobile-nav-active")) {
        body.classList.remove("mobile-nav-active");
        const navbarToggle = select(".mobile-nav-toggle");
        navbarToggle.classList.toggle("bi-list");
        navbarToggle.classList.toggle("bi-x");
      }
      scrollto(this.hash);
    },
    true
  );

  window.addEventListener("load", () => {
    if (window.location.hash && select(window.location.hash)) {
      scrollto(window.location.hash);
    }
  });

  const backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 200) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  const typed = select(".typed");
  if (typed) {
    const typedStrings = typed.getAttribute("data-typed-items").split(",");
    new Typed(".typed", {
      strings: typedStrings,
      loop: true,
      typeSpeed: 60,
      backSpeed: 35,
      backDelay: 1700,
    });
  }

  const skillBars = select(".progress-bar", true);
  if (skillBars.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          const bar = entry.target;
          bar.style.width = `${bar.getAttribute("aria-valuenow")}%`;
          observer.unobserve(bar);
        });
      },
      { threshold: 0.5 }
    );
    skillBars.forEach((bar) => observer.observe(bar));
  }

  const fetchGitHubStats = async () => {
    const username = "SripriyaPKulkarni";
    const repoName = "sripriyapkulkarni.github.io";

    try {
      const [userRes, repoRes, eventsRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/repos/${username}/${repoName}`),
        fetch(`https://api.github.com/users/${username}/events/public?per_page=100`),
      ]);

      if (userRes.ok) {
        const user = await userRes.json();
        setText("#gh-public-repos", user.public_repos ?? "172");
        setText("#gh-followers", user.followers ?? "44");
        setText("#gh-following", user.following ?? "26");
        setText("#gh-updated-at", formatDate(user.updated_at));
      }

      if (repoRes.ok) {
        const repo = await repoRes.json();
        setText("#gh-portfolio-stars", repo.stargazers_count ?? "1");
        setText("#gh-portfolio-forks", repo.forks_count ?? "0");
      }

      if (eventsRes.ok) {
        const events = await eventsRes.json();
        setText("#gh-public-events", `${events.length} events`);
      } else {
        setText("#gh-public-events", "93+ contributions");
      }
    } catch (error) {
      setText("#gh-public-events", "93+ contributions");
      setText("#gh-public-repos", "172");
      setText("#gh-followers", "44");
      setText("#gh-following", "26");
      setText("#gh-updated-at", "Active");
      setText("#gh-portfolio-stars", "1");
      setText("#gh-portfolio-forks", "0");
    }
  };

  window.addEventListener("load", () => {
    fetchGitHubStats();
    AOS.init({
      duration: 850,
      easing: "ease-out-cubic",
      once: true,
    });
  });

  // Keep legacy automation-practice function names for blog-linked demos.
  window.hideElement = () => {
    const el = document.getElementById("displayed-text");
    if (el) {
      el.style.display = "none";
    }
  };

  window.showElement = () => {
    const el = document.getElementById("displayed-text");
    if (el) {
      el.style.display = "block";
    }
  };
})();