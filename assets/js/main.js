/* =====================================================================
   슈가맨워크 천호역점 — main.js (Step 4)
   1) .ph[data-img] 플레이스홀더 → 실제 <img> 자동 교체
   2) 모바일 내비게이션 토글
   3) 헤더 스크롤 그림자
   4) 스크롤 등장 애니메이션 (IntersectionObserver)
   5) 갤러리 + 라이트박스
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- 1. 사진 플레이스홀더 자동 교체 ----------
     assets/images/ 에 파일이 있으면 회색 플레이스홀더를 <img>로 교체.
     파일이 없으면 플레이스홀더가 그대로 남습니다. */
  document.querySelectorAll(".ph[data-img]").forEach(function (ph) {
    var src = ph.getAttribute("data-img");
    if (!src) return;

    var probe = new Image();
    probe.onload = function () {
      var img = document.createElement("img");
      img.src = src;
      img.alt =
        (ph.getAttribute("data-label") || "").split("—").pop().trim() ||
        "슈가맨워크 천호역점";
      img.loading = "lazy";
      // 플레이스홀더 안에 채워 넣어 레이아웃 클래스(.ph-tall 등)를 유지
      ph.appendChild(img);
      ph.classList.add("is-loaded");
    };
    probe.src = src;
  });

  /* ---------- 2. 모바일 내비게이션 토글 ---------- */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");

  function closeNav() {
    if (!header) return;
    header.classList.remove("nav-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "메뉴 열기");
    }
  }

  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    });
  }
  if (nav) {
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
  }

  /* ---------- 3. 헤더 스크롤 그림자 + 플로팅 CTA ---------- */
  var floatingCta = document.getElementById("floatingCta");
  var contactSection = document.getElementById("contact");

  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);

    if (floatingCta) {
      // Hero를 지나면 노출하되, 문의 섹션이 화면에 보이면 숨김(중복 방지)
      var pastHero = window.scrollY > window.innerHeight * 0.6;
      var contactVisible = false;
      if (contactSection) {
        var rect = contactSection.getBoundingClientRect();
        contactVisible = rect.top < window.innerHeight && rect.bottom > 0;
      }
      floatingCta.classList.toggle("is-shown", pastHero && !contactVisible);
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  /* ---------- 4. 스크롤 등장 애니메이션 ---------- */
  var revealEls = document.querySelectorAll(
    ".section-eyebrow, .section-title, .section-lead, .about-grid, .target-box, " +
      ".space-card, .price-card, .benefit-highlight, .benefit-grid li, " +
      ".location-grid, .location-photo, .contact-actions, .reviews-more, " +
      ".guide-card, .faq-item, .faq-cta"
  );
  if ("IntersectionObserver" in window && revealEls.length) {
    revealEls.forEach(function (el, i) {
      el.classList.add("reveal");
      // 같은 그리드 안 카드들은 살짝 시차를 둬서 순차 등장
      el.style.transitionDelay = (i % 4) * 60 + "ms";
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- 4-b. 후기 셔플 + 자동 로테이션 ----------
     - 고정 숫자 없이, 방문자 리뷰 풀(.review-card)에서 일부만 노출
     - 페이지 진입 시 매번 셔플 → 매 방문마다 다른 후기 조합
     - 화면에 보일 때만 일정 간격으로 한 장씩 부드럽게 교체 */
  var reviewGrid = document.querySelector(".review-grid");
  if (reviewGrid) {
    var pool = Array.prototype.slice.call(
      reviewGrid.querySelectorAll(".review-card")
    );

    function shuffle(arr) {
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = arr[i];
        arr[i] = arr[j];
        arr[j] = t;
      }
      return arr;
    }

    // 표시 개수: 화면 폭에 맞춰 (그리드 칼럼 수와 동일하게 깔끔히 채움)
    function visibleCount() {
      var w = window.innerWidth;
      if (w <= 640) return 3; // 1열 × 3
      if (w <= 880) return 4; // 2열 × 2
      return 6; // 3열 × 2
    }

    var reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (pool.length > 1) {
      shuffle(pool);
      // 모든 카드를 그리드에서 분리 후 JS로 재배치
      pool.forEach(function (c) {
        if (c.parentNode) c.parentNode.removeChild(c);
      });

      var shown = []; // 현재 화면에 표시 중인 카드
      var queueIndex = 0; // pool 순환 인덱스

      function nextFromPool() {
        var card = pool[queueIndex % pool.length];
        queueIndex++;
        return card;
      }

      function fillInitial() {
        reviewGrid.innerHTML = "";
        shown = [];
        var n = Math.min(visibleCount(), pool.length);
        for (var i = 0; i < n; i++) {
          var card = nextFromPool();
          card.classList.remove("is-out");
          card.classList.add("is-in");
          reviewGrid.appendChild(card);
          shown.push(card);
        }
      }
      fillInitial();

      // 한 장씩 교체 (예비 카드가 있을 때만)
      function rotateOnce() {
        if (pool.length <= shown.length) return;
        var slot = Math.floor(Math.random() * shown.length);
        var oldCard = shown[slot];

        var newCard = nextFromPool();
        var guard = 0;
        while (shown.indexOf(newCard) !== -1 && guard < pool.length) {
          newCard = nextFromPool();
          guard++;
        }
        if (shown.indexOf(newCard) !== -1) return; // 마땅한 후보 없음

        oldCard.classList.remove("is-in");
        oldCard.classList.add("is-out");
        window.setTimeout(function () {
          if (oldCard.parentNode !== reviewGrid) return;
          reviewGrid.replaceChild(newCard, oldCard);
          oldCard.classList.remove("is-out");
          newCard.classList.remove("is-out");
          void newCard.offsetWidth; // reflow → 페이드 인 트리거
          newCard.classList.add("is-in");
          shown[slot] = newCard;
        }, 450);
      }

      var rotateTimer = null;
      function startRotation() {
        if (rotateTimer || reduceMotion) return;
        rotateTimer = window.setInterval(rotateOnce, 4500);
      }
      function stopRotation() {
        if (rotateTimer) {
          window.clearInterval(rotateTimer);
          rotateTimer = null;
        }
      }

      // 화면에 보일 때만 로테이션 (성능·배터리 절약)
      if ("IntersectionObserver" in window) {
        var rio = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) startRotation();
              else stopRotation();
            });
          },
          { threshold: 0.15 }
        );
        rio.observe(reviewGrid);
      } else {
        startRotation();
      }

      // 폭 변경으로 표시 개수가 달라지면 다시 채움
      var lastVisible = visibleCount();
      window.addEventListener(
        "resize",
        function () {
          var v = visibleCount();
          if (v !== lastVisible) {
            lastVisible = v;
            fillInitial();
          }
        },
        { passive: true }
      );
    }
  }

  /* ---------- 5. 갤러리 + 라이트박스 ---------- */
  var items = Array.prototype.slice.call(
    document.querySelectorAll(".gallery-item[data-img]")
  );
  var lightbox = document.getElementById("lightbox");

  // 썸네일: 배경 이미지로 채우기
  items.forEach(function (item) {
    var src = item.getAttribute("data-img");
    if (!src) return;
    var probe = new Image();
    probe.onload = function () {
      item.style.backgroundImage = "url('" + src + "')";
      item.classList.add("loaded");
    };
    probe.src = src;
  });

  if (lightbox && items.length) {
    var imgEl = lightbox.querySelector(".lightbox-img");
    var capEl = lightbox.querySelector(".lightbox-caption");
    var current = 0;

    function show(index) {
      current = (index + items.length) % items.length;
      var item = items[current];
      imgEl.src = item.getAttribute("data-img");
      var cap = item.getAttribute("data-caption") || "";
      imgEl.alt = cap;
      capEl.textContent = cap;
    }
    function open(index) {
      show(index);
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function close() {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    items.forEach(function (item, i) {
      item.addEventListener("click", function () {
        open(i);
      });
    });
    lightbox
      .querySelector(".lightbox-close")
      .addEventListener("click", close);
    lightbox
      .querySelector(".lightbox-prev")
      .addEventListener("click", function () {
        show(current - 1);
      });
    lightbox
      .querySelector(".lightbox-next")
      .addEventListener("click", function () {
        show(current + 1);
      });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(current - 1);
      else if (e.key === "ArrowRight") show(current + 1);
    });
  }
})();
