// تحميل البيانات من ملف JSON
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const formatDate = (d) => {
      let month = (d.getMonth() + 1).toString().padStart(2, "0");
      let day = d.getDate().toString().padStart(2, "0");
      return `${d.getFullYear()}-${month}-${day}`;
    };

    const yesterdayStr = formatDate(yesterday);
    const todayStr = formatDate(today);
    const tomorrowStr = formatDate(tomorrow);

    const grids = {
      yesterday: document.querySelector(".grid-yesterday"),
      today: document.querySelector(".grid-today"),
      tomorrow: document.querySelector(".grid-tomorrow")
    };

    Object.values(grids).forEach(g => g.innerHTML = "");

    data.matches.forEach(match => {
      const box = createMatchBox(match);
      let container;
      if (match.date === yesterdayStr) container = grids.yesterday;
      else if (match.date === todayStr) container = grids.today;
      else if (match.date === tomorrowStr) container = grids.tomorrow;
      if (container) container.appendChild(box);
    });

    updateMatchStatus();
    setInterval(updateMatchStatus, 10000);
  })
  .catch(err => console.error("خطأ في تحميل البيانات:", err));

function createMatchBox(match) {
  const box = document.createElement("div");
  box.classList.add("box1");

  box.innerHTML = `
      <div class="botola">
        <img src="${match.flagleague}" alt="">
        <p>${match.league}</p>
      </div>
      <div class="match">
        <div class="flag1">
          <img src="${match.team1.flag}" alt="">
          <p>${match.team1.name}</p>
        </div>
        <div class="date">
          <p>${match.time}</p>
          <h6>${match.score ? match.score : ""}</h6>
        </div>
        <div class="flag2">
          <p>${match.team2.name}</p>
          <img src="${match.team2.flag}" alt="">
        </div>
      </div>
      <div class="tv">
        <p>القناة الناقلة - ${match.channel}</p>
      </div>
  `;

  const scoreEl = box.querySelector(".date h6");
  scoreEl.dataset.datetime = `${match.date}T${match.time}:00`;
  scoreEl.dataset.score = match.score || "";

  return box;
}

function updateMatchStatus() {
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  document.querySelectorAll(".box1").forEach(box => {
    const scoreEl = box.querySelector(".date h6");
    const matchTime = new Date(scoreEl.dataset.datetime);
    const realScore = scoreEl.dataset.score;
    const matchDateStr = matchTime.toISOString().split("T")[0];

    const matchEnd = new Date(matchTime.getTime() + 90 * 60000);

    // مباريات الأمس بدون نتيجة => اختفاء
    if (matchDateStr === yesterdayStr && now > matchEnd && (!realScore || realScore.trim() === "")) {
      box.style.display = "none";
      return;
    } else {
      box.style.display = "flex"; // إعادة الظهور إذا تطلب الأمر
    }

    if (now < matchTime) {
      scoreEl.textContent = "لم تبدأ";
      scoreEl.style.color = "#000";
      scoreEl.classList.remove("result");
    } else if (now >= matchTime && now <= matchEnd) {
      scoreEl.textContent = "جارية";
      scoreEl.style.color = "#ff0000";
      scoreEl.classList.remove("result");
    } else {
      if (realScore && realScore.trim() !== "") {
        scoreEl.textContent = realScore;
        scoreEl.classList.add("result");
      } else {
        scoreEl.textContent = "انتهت";
        scoreEl.style.color = "#008000";
        scoreEl.classList.remove("result");
      }
    }
  });
}

// التنقل بين الأقسام
document.getElementById("link-today").addEventListener("click", () => {
  document.querySelector(".grid-today").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("link-tomorrow").addEventListener("click", () => {
  document.querySelector(".grid-tomorrow").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("link-yesterday").addEventListener("click", () => {
  document.querySelector(".grid-yesterday").scrollIntoView({ behavior: "smooth" });
});

// القائمة المنسدلة والوضع الليلي
document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.getElementById("menu-icon");
  const navLinks = document.getElementById("nav-links");
  const darkModeToggle = document.getElementById("dark-mode-toggle");

  menuIcon.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
});


