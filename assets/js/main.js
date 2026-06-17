/* =====================================================================
   슈가맨워크 천호역점 — main.js (Step 3)
   사진 플레이스홀더 자동 교체:
   assets/images/ 에 해당 파일이 실제로 올라오면, 회색 플레이스홀더를
   <img> 로 자동 교체합니다. 파일이 없으면 플레이스홀더가 그대로 남습니다.
   (코드 수정 없이 사진 파일만 추가하면 됩니다.)
   ===================================================================== */
(function () {
  "use strict";

  document.querySelectorAll(".ph[data-img]").forEach(function (ph) {
    var src = ph.getAttribute("data-img");
    if (!src) return;

    var probe = new Image();
    probe.onload = function () {
      var img = document.createElement("img");
      img.src = src;
      img.alt = (ph.getAttribute("data-label") || "").split("—").pop().trim() || "슈가맨워크 천호역점";
      img.loading = "lazy";
      ph.replaceWith(img);
    };
    // onerror: 파일이 아직 없으면 플레이스홀더 유지 (아무 동작 안 함)
    probe.src = src;
  });
})();
