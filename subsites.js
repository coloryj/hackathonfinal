const sidebar = document.querySelector(".sidebar");
const mobileScrim = document.querySelector(".mobile-scrim");
const mobileMenuButton = document.querySelector(".mobile-menu");
const toast = document.querySelector("#toast");
let toastTimeout;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 3200);
}

if (sidebar && mobileScrim && mobileMenuButton) {
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
}

const cptedForm = document.querySelector("#cpted-form");
if (cptedForm) {
  const results = document.querySelector("#request-results");

  cptedForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!cptedForm.reportValidity()) return;

    const category = cptedForm.elements.category.value;
    const location = cptedForm.elements.location.value.trim();
    const description = cptedForm.elements.description.value.trim();
    const time = cptedForm.elements.time.value || "시간대 미선택";
    if (!category || !location || !description) return;

    const item = document.createElement("article");
    item.className = "request-item";
    const heading = document.createElement("div");
    heading.className = "request-item-head";
    const title = document.createElement("strong");
    title.textContent = `${category} · ${location}`;
    const status = document.createElement("span");
    status.className = "request-status";
    status.textContent = "화면 내 등록";
    const detail = document.createElement("p");
    detail.textContent = `${time} · ${description}`;
    heading.append(title, status);
    item.append(heading, detail);
    results.prepend(item);
    cptedForm.reset();
    showToast("개선 의견을 이 화면에 등록했습니다. 실제 기관으로 전송되지는 않습니다.");
  });
}

const crimeZones = document.querySelectorAll(".crime-zone");
const crimeCategory = document.querySelector("#crime-category");
if (crimeZones.length && crimeCategory) {
  const categoryNames = {
    theft: "절도",
    assault: "폭력",
    fraud: "사기",
  };
  const riskNames = {
    low: "예시 분포 낮음",
    medium: "예시 분포 보통",
    high: "예시 분포 높음",
  };
  const riskOrder = ["low", "medium", "high"];
  const areaTitle = document.querySelector("#crime-area-title");
  const areaSubtitle = document.querySelector("#crime-area-subtitle");
  const riskBadge = document.querySelector("#crime-risk");
  const count = document.querySelector("#crime-count");
  const categoryRows = document.querySelectorAll(".category-row");

  function updateZoneCounts(category) {
    crimeZones.forEach((zone) => {
      const zoneCount = category === "all"
        ? Number(zone.dataset.count)
        : Number(zone.dataset[`count${category[0].toUpperCase()}${category.slice(1)}`]);
      zone.querySelector("span").textContent = `가상 발생 ${zoneCount}건`;
    });
  }

  function updateArea(zone) {
    const category = crimeCategory.value;
    const level = zone.dataset.risk;
    const total = category === "all"
      ? Number(zone.dataset.count)
      : Number(zone.dataset[`count${category[0].toUpperCase()}${category.slice(1)}`]);

    areaTitle.textContent = `가상 구역 ${zone.dataset.zone}`;
    areaSubtitle.textContent = "성북구 체험용 가상 구역";
    riskBadge.textContent = riskNames[level];
    riskBadge.className = `risk-badge${level === "low" ? "" : ` ${level}`}`;
    count.textContent = String(total);

    categoryRows.forEach((row) => {
      const rowCategory = row.dataset.category;
      const rowCount = Number(zone.dataset[`count${rowCategory[0].toUpperCase()}${rowCategory.slice(1)}`]);
      const bar = row.querySelector(".category-bar span");
      row.hidden = category !== "all" && rowCategory !== category;
      row.querySelector("strong").textContent = String(rowCount);
      bar.style.width = `${total === 0 ? 0 : Math.max(8, Math.round(rowCount / total * 100))}%`;
    });
  }

  crimeZones.forEach((zone) => {
    zone.addEventListener("click", () => {
      crimeZones.forEach((item) => {
        item.classList.remove("selected");
        item.setAttribute("aria-pressed", "false");
      });
      zone.classList.add("selected");
      zone.setAttribute("aria-pressed", "true");
      updateArea(zone);
    });
  });

  crimeCategory.addEventListener("change", () => {
    const selectedZone = document.querySelector(".crime-zone.selected");
    updateZoneCounts(crimeCategory.value);
    if (selectedZone) updateArea(selectedZone);
    const categoryLabel = crimeCategory.value === "all"
      ? "전체 유형"
      : categoryNames[crimeCategory.value];
    showToast(`${categoryLabel} 가상 예시를 표시합니다.`);
  });

  updateZoneCounts("all");
}

const gameStage = document.querySelector("#game-stage");
if (gameStage) {
  const questions = [
    {
      scene: "🚦",
      prompt: "초록불이 켜졌어요. 길을 건널 때 어떻게 하면 좋을까요?",
      answers: [
        "멈춰서 차가 오는지 살피고, 손을 들고 건너요.",
        "친구보다 먼저 뛰어가요.",
        "휴대폰을 보면서 건너요.",
      ],
      correct: 0,
      feedback: "맞아요! 멈추고 살핀 뒤, 손을 들고 천천히 건너요.",
    },
    {
      scene: "🍬",
      prompt: "모르는 사람이 과자를 주며 같이 가자고 해요. 어떻게 할까요?",
      answers: [
        "과자를 받고 따라가요.",
        "따라가지 않고, 믿을 수 있는 어른에게 바로 말해요.",
        "아무에게도 말하지 않아요.",
      ],
      correct: 1,
      feedback: "잘했어요! 낯선 사람을 따라가지 말고 보호자나 선생님께 알려요.",
    },
    {
      scene: "🧸",
      prompt: "놀이터에서 공이 길 쪽으로 굴러갔어요. 어떻게 할까요?",
      answers: [
        "혼자 바로 뛰어가서 가져와요.",
        "차가 없으면 빠르게 뛰어가요.",
        "멈춰서 선생님이나 보호자에게 도움을 청해요.",
      ],
      correct: 2,
      feedback: "멋져요! 차도로 혼자 가지 않고, 곁에 있는 어른에게 도움을 청해요.",
    },
    {
      scene: "🏪",
      prompt: "가족과 함께 있다가 길을 잃었어요. 누구에게 도움을 청할까요?",
      answers: [
        "아무나 따라가요.",
        "가게 직원이나 경찰관처럼 믿을 수 있는 어른에게 말해요.",
        "숨겨진 곳에 혼자 있어요.",
      ],
      correct: 1,
      feedback: "정답이에요! 안전한 가게 직원이나 경찰관에게 도움을 청해요.",
    },
  ];

  const questionView = document.querySelector(".game-question-view");
  const scene = document.querySelector("#game-scene");
  const prompt = document.querySelector("#game-question");
  const options = document.querySelector("#game-options");
  const feedback = document.querySelector("#game-feedback");
  const step = document.querySelector("#game-step");
  const progress = document.querySelector("#game-progress");
  const scoreText = document.querySelector("#game-score");
  const nextButton = document.querySelector("#game-next");
  const finishTitle = document.querySelector("#game-finish-title");
  const finishCopy = document.querySelector("#game-finish-copy");
  const finishArt = document.querySelector("#game-finish-art");
  let questionIndex = 0;
  let score = 0;
  let answered = false;

  function renderQuestion() {
    const question = questions[questionIndex];
    answered = false;
    step.textContent = `${questionIndex + 1}번째 약속`;
    progress.style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
    scene.textContent = question.scene;
    prompt.textContent = question.prompt;
    feedback.textContent = "";
    scoreText.textContent = `별 ${score}개 모았어요`;
    nextButton.disabled = true;
    nextButton.textContent = "정답을 골라봐요";
    options.replaceChildren();

    question.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "game-answer";
      const letter = document.createElement("span");
      letter.className = "answer-letter";
      letter.textContent = String.fromCharCode(65 + index);
      const text = document.createElement("span");
      text.textContent = answer;
      button.append(letter, text);
      button.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        options.querySelectorAll("button").forEach((option) => {
          option.disabled = true;
        });
        if (index === question.correct) {
          score += 1;
          button.classList.add("correct-answer");
          feedback.textContent = question.feedback;
        } else {
          button.classList.add("wrong-answer");
          options.children[question.correct].classList.add("correct-answer");
          feedback.textContent = `괜찮아요. ${question.feedback}`;
        }
        scoreText.textContent = `별 ${score}개 모았어요`;
        nextButton.disabled = false;
        nextButton.textContent = questionIndex === questions.length - 1 ? "탐험 마치기" : "다음 약속 보기 →";
      });
      options.append(button);
    });
  }

  nextButton.addEventListener("click", () => {
    if (!answered) return;
    questionIndex += 1;
    if (questionIndex < questions.length) {
      renderQuestion();
      return;
    }

    questionView.hidden = true;
    gameStage.classList.add("finished");
    finishTitle.textContent = score === questions.length ? "안전 약속 달인!" : "안전 약속 탐험 끝!";
    finishCopy.textContent = `${questions.length}개의 약속 중 ${score}개를 잘 골랐어요. 오늘 배운 안전 약속을 가족이나 선생님과 함께 이야기해 봐요.`;
    finishArt.textContent = score === questions.length ? "🏆" : "🌟";
  });

  document.querySelector("#game-restart").addEventListener("click", () => {
    questionIndex = 0;
    score = 0;
    gameStage.classList.remove("finished");
    questionView.hidden = false;
    renderQuestion();
  });

  renderQuestion();
}
