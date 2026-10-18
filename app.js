const filterButtons = document.querySelectorAll(".filter-chip");
const markers = document.querySelectorAll(".map-marker");
const mapArt = document.querySelector(".map-art");
const reportDialog = document.querySelector("#report-dialog");
const reportForm = document.querySelector("#report-form");
const toast = document.querySelector("#toast");
let toastTimeout;
let zoomLevel = 1;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 3200);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");

    const filter = button.dataset.filter;
    markers.forEach((marker) => {
      marker.classList.toggle("is-hidden", filter !== "all" && marker.dataset.mapType !== filter);
    });
  });
  button.setAttribute("aria-pressed", button.classList.contains("active") ? "true" : "false");
});

document.querySelectorAll(".report-open").forEach((button) => {
  button.addEventListener("click", () => reportDialog.showModal());
});

document.querySelector(".dialog-close").addEventListener("click", () => reportDialog.close());
document.querySelector(".dialog-cancel").addEventListener("click", () => reportDialog.close());

reportDialog.addEventListener("click", (event) => {
  if (event.target === reportDialog) reportDialog.close();
});

reportForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!reportForm.reportValidity()) return;

  const category = reportForm.elements.category.value;
  const location = reportForm.elements.location.value.trim();
  const description = reportForm.elements.description.value.trim();
  if (!category || !location || !description) return;

  const list = document.querySelector("#reports-list");
  const item = document.createElement("article");
  item.className = "report-item";

  const icon = document.createElement("span");
  icon.className = "report-icon report-icon-amber";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "!";

  const copy = document.createElement("div");
  copy.className = "report-copy";
  const titleRow = document.createElement("div");
  titleRow.className = "report-title-row";
  const title = document.createElement("h3");
  title.textContent = `${category} 제보`;
  const tag = document.createElement("span");
  tag.className = "report-tag tag-pending";
  tag.textContent = "등록됨";
  titleRow.append(title, tag);

  const locationText = document.createElement("p");
  locationText.textContent = `${location} · ${description}`;
  const time = document.createElement("time");
  time.textContent = "방금 전";
  copy.append(titleRow, locationText, time);
  item.append(icon, copy);
  list.prepend(item);

  reportForm.reset();
  reportDialog.close();
  showToast("제보가 이 화면에 등록되었습니다. 실제 기관으로 전송되지는 않습니다.");
});

document.querySelector("#zoom-in").addEventListener("click", () => {
  zoomLevel = Math.min(zoomLevel + 0.12, 1.5);
  mapArt.style.transform = `scale(${zoomLevel})`;
});

document.querySelector("#zoom-out").addEventListener("click", () => {
  zoomLevel = Math.max(zoomLevel - 0.12, 1);
  mapArt.style.transform = `scale(${zoomLevel})`;
});

document.querySelector("#locate-me").addEventListener("click", () => {
  showToast("현재 위치 기능은 실제 지도 서비스 연결 후 이용할 수 있어요.");
});

document.querySelector("#open-map").addEventListener("click", () => {
  document.querySelector("#map").scrollIntoView({ behavior: "smooth", block: "center" });
  showToast("안전 지도는 예시 화면이며 실제 위치 정보와 연동되지 않습니다.");
});

document.querySelector("#map-area-button").addEventListener("click", () => {
  showToast("현재 예시 지역은 서울특별시 성북구입니다.");
});

document.querySelector("#guide-detail").addEventListener("click", () => {
  showToast("밝은 길 이용하기 · 주변에 귀가 알리기 · 긴급 시 112 신고하기");
});

const sidebar = document.querySelector(".sidebar");
const mobileScrim = document.querySelector(".mobile-scrim");
const mobileMenuButton = document.querySelector(".mobile-menu");

function closeMobileMenu() {
  sidebar.classList.remove("mobile-open");
  mobileScrim.classList.remove("visible");
  mobileMenuButton.setAttribute("aria-expanded", "false");
  mobileMenuButton.setAttribute("aria-label", "메뉴 열기");
}

mobileMenuButton.setAttribute("aria-expanded", "false");
mobileMenuButton.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("mobile-open");
  mobileScrim.classList.toggle("visible", isOpen);
  mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
  mobileMenuButton.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
});
mobileScrim.addEventListener("click", closeMobileMenu);
sidebar.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});
