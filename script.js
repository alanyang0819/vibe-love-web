/* 相隔兩地，心在一起 — 儀表板互動 */
const DASHBOARD_CONFIG = {
  title: "我們的小小世界",
  greeting: "一起收藏我們的時光、里程碑，還有下一個相聚的片刻。",
  dayStartsAt: 6,
  nightStartsAt: 18,
  cities: [
    { name: "桃園", person: "綸", latitude: 24.9937, longitude: 121.2969, timeZone: "Asia/Taipei" },
    { name: "高雄", person: "晴", latitude: 22.6273, longitude: 120.3014, timeZone: "Asia/Taipei" }
  ],
  relationshipStart: "2026-07-10",
  anniversary: { timeZone: "Asia/Taipei", locale: "zh-Hant" },
  messages: [
    "距離只是證明，我們的愛知道如何跋涉而來。",
    "無論我身在何方，都一直為妳加油。",
    "離我們下一次說妳好，又更近了一天。",
    "想把今天的好心情，第一個分享給妳。",
    "妳是我每天都想靠近一點的人。",
    "不管今天順不順利，我都站在妳這邊。",
    "辛苦了，今天也已經做得很棒。",
    "累了就休息一下，我的想念不會催妳。",
    "別忘了吃飯、喝水，還有想我一下。",
    "今天有乖乖照顧自己嗎？",
    "妳的訊息一亮起來，我的心情也亮了。",
    "妳不用一直堅強，在我這裡可以放心撒嬌。",
    "再忙也要記得，你一直被我放在心上。",
    "我想念的不只是妳，還有和妳一起的日常。",
    "距離很長，但我對妳的喜歡更長。",
    "妳一出現，平凡的一天就變得可愛了。",
    "今天也偷偷喜歡妳很多次。",
    "提醒一下：妳是我最偏心的那個人。",
    "想和妳分享一片雲、一杯飲料，還有我的心。",
    "妳負責可愛，我負責一直喜歡妳。",
    "我們的默契，連想念都會同步。",
    "今天的任務：平安順心，順便想我。",
    "報告，我已經開始期待下一次見面。",
    "下次見面要先抱多久？我先預約一整天。",
    "再等一下下，我們就能把想念變成擁抱。",
    "每一個倒數，都在把我們推向見面。",
    "想把見面那天的第一個笑容留給妳。",
    "我們很快就能並肩走路，而不是隔著螢幕想念。",
    "下次見面，想和妳把錯過的日常補回來。",
    "我正在收集想和妳一起完成的小事。",
    "等我們見面，請把所有想念都交給我。",
    "見面不是結束等待，是開始更多一起的日子。",
    "今天也謝謝妳，讓遠距離值得期待。",
    "有妳在未來裡，連等待都變得甜甜的。"
  ]
};

(() => {
  "use strict";

  const WEATHER_API = "https://api.open-meteo.com/v1/forecast";
  const WEATHER_CODES = {
    0: ["☀️", "晴朗"], 1: ["🌤️", "大致晴朗"], 2: ["⛅", "局部多雲"], 3: ["☁️", "陰天"],
    45: ["🌫️", "有霧"], 48: ["🌫️", "霧凇"], 51: ["🌦️", "小毛毛雨"], 53: ["🌦️", "毛毛雨"],
    55: ["🌧️", "大毛毛雨"], 56: ["🌧️", "輕微凍雨"], 57: ["🌧️", "凍雨"], 61: ["🌦️", "小雨"],
    63: ["🌧️", "中雨"], 65: ["🌧️", "大雨"], 66: ["🌧️", "輕微凍雨"], 67: ["🌧️", "強凍雨"],
    71: ["🌨️", "小雪"], 73: ["🌨️", "中雪"], 75: ["❄️", "大雪"], 77: ["❄️", "雪粒"],
    80: ["🌦️", "短暫小雨"], 81: ["🌧️", "短暫中雨"], 82: ["⛈️", "短暫大雨"],
    85: ["🌨️", "短暫小雪"], 86: ["🌨️", "短暫大雪"], 95: ["⛈️", "雷雨"],
    96: ["⛈️", "雷雨伴隨冰雹"], 99: ["⛈️", "強雷雨伴隨冰雹"]
  };
  const state = { messageIndex: -1, messageBusy: false, weather: [], weatherStatus: "loading", weatherBusy: false, mood: "", customization: {} };
  const STORAGE_KEYS = {
    note: "gf-romantic-memory-note",
    moodPrefix: "gf-romantic-mood-",
    customization: "gf-romantic-customization"
  };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const setText = (node, value) => { if (node) node.textContent = value; };
  const dom = {
    title: $("#dashboard-title"),
    greeting: $("#dashboard-greeting"),
    clocks: $$("[data-clock-card]"),
    anniversary: $("#anniversary"),
    anniversaryLabel: $("[data-anniversary-label]"),
    anniversaryDate: $("[data-anniversary-date]"),
    anniversaryError: $("[data-anniversary-error]"),
    duration: Object.fromEntries(["days", "hours", "minutes", "seconds"].map((key) => [key, $(`[data-duration="${key}"]`)])),
    message: $("[data-surprise-message]"),
    button: $("[data-surprise-button]"),
    feedback: $("[data-feedback-status]"),
    cards: $$("[data-card-feedback]"),
    focusControl: $("[data-focus-control]"),
    weatherRefresh: $("[data-weather-refresh]"),
    jumpLinks: $$(".section-nav a"),
    moodOptions: $$("[data-mood]"),
    note: $("[data-memory-note]"),
    characterCount: $("[data-character-count]"),
    checkinSaved: $("[data-checkin-saved]"),
    customizationForm: $("[data-customization-form]"),
    nicknameInput: $("[data-nickname-input]"),
    greetingInput: $("[data-greeting-input]"),
    settingsStatus: $("[data-settings-status]"),
    themeToggle: $("[data-theme-toggle]")
  };

  const readCustomization = () => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.customization) || "{}");
      return saved && typeof saved === "object" ? {
        nickname: typeof saved.nickname === "string" ? saved.nickname.slice(0, 24) : "",
        greeting: typeof saved.greeting === "string" ? saved.greeting.slice(0, 120) : "",
        cozy: saved.cozy === true
      } : {};
    } catch {
      return {};
    }
  };

  const applyCustomization = () => {
    const nickname = state.customization.nickname?.trim();
    const greeting = state.customization.greeting?.trim();
    setText(dom.title, nickname ? `${nickname}的小小世界` : DASHBOARD_CONFIG.title);
    setText(dom.greeting, greeting || DASHBOARD_CONFIG.greeting);
    document.documentElement.dataset.theme = state.customization.cozy ? "cozy" : "light";
    if (dom.themeToggle) dom.themeToggle.checked = state.customization.cozy === true;
  };

  const persistCustomization = () => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.customization, JSON.stringify(state.customization));
      return true;
    } catch {
      return false;
    }
  };

  const saveCustomization = (event) => {
    event.preventDefault();
    state.customization = {
      nickname: dom.nicknameInput.value.trim(),
      greeting: dom.greetingInput.value.trim(),
      cozy: dom.themeToggle.checked
    };
    applyCustomization();
    setText(dom.settingsStatus, persistCustomization()
      ? "已儲存你的專屬設定。" : "無法儲存設定，請檢查瀏覽器的儲存權限。");
  };

  const toggleTheme = () => {
    state.customization.cozy = dom.themeToggle.checked;
    applyCustomization();
    setText(dom.settingsStatus, persistCustomization()
      ? `${state.customization.cozy ? "暖心" : "明亮"}模式已切換。` : "模式已切換，但無法儲存設定。");
  };

  const localDateKey = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  };

  const readStorage = (key, fallback = "") => {
    try { return window.localStorage.getItem(key) ?? fallback; } catch { return fallback; }
  };

  const writeStorage = (key, value) => {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  };

  const showSaved = (message = "已儲存") => {
    setText(dom.checkinSaved, message);
    window.clearTimeout(showSaved.timeout);
    showSaved.timeout = window.setTimeout(() => setText(dom.checkinSaved, ""), 2200);
  };

  function updateCharacterCount() {
    if (!dom.note || !dom.characterCount) return;
    setText(dom.characterCount, `${dom.note.value.length} / ${dom.note.maxLength}`);
  }

  function renderMood() {
    dom.moodOptions.forEach((option) => {
      const selected = option.dataset.mood === state.mood;
      option.setAttribute("aria-pressed", String(selected));
      option.classList.toggle("is-selected", selected);
    });
  }

  function loadRomanticCheckIn() {
    state.mood = readStorage(`${STORAGE_KEYS.moodPrefix}${localDateKey()}`);
    if (dom.note) dom.note.value = readStorage(STORAGE_KEYS.note);
    renderMood();
    updateCharacterCount();
  }

  function selectMood(option) {
    state.mood = option.dataset.mood || "";
    if (writeStorage(`${STORAGE_KEYS.moodPrefix}${localDateKey()}`, state.mood)) {
      renderMood();
      showSaved("今天的心情已記下");
    } else {
      setText(dom.checkinSaved, "無法儲存，請檢查瀏覽器設定");
    }
  }

  function saveNote() {
    if (!dom.note) return;
    if (writeStorage(STORAGE_KEYS.note, dom.note.value)) showSaved("小紙條已儲存");
    else setText(dom.checkinSaved, "無法儲存，請檢查瀏覽器設定");
    updateCharacterCount();
  }

  const isValidTimeZone = (timeZone) => {
    try {
      new Intl.DateTimeFormat("en-US", { timeZone }).format();
      return typeof timeZone === "string" && timeZone.length > 0;
    } catch {
      return false;
    }
  };

  const parts = (date, options) => Object.fromEntries(
    new Intl.DateTimeFormat("en-US", options).formatToParts(date)
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value])
  );

  function renderWeather(card, weather) {
    const weatherNode = $("[data-weather]", card);
    if (!weatherNode) return;
    if (weather === undefined) {
      setText(weatherNode, "天氣載入中⋯");
      weatherNode.dataset.state = "loading";
      return;
    }
    const description = WEATHER_CODES[weather.code];
    if (!weather || !Number.isFinite(weather.temperature) || !description) {
      setText(weatherNode, "目前天氣無法取得");
      weatherNode.dataset.state = "error";
      return;
    }
    setText(weatherNode, `${description[0]} ${description[1]} · ${weather.temperature}°C`);
    weatherNode.dataset.state = "ready";
  }

  function renderClock(card, city, now) {
    if (!city || !isValidTimeZone(city.timeZone)) {
      card.dataset.state = "unavailable";
      setText($("[data-clock-state]", card), "暫時無法取得時間");
      return;
    }
    try {
      const time = parts(now, { timeZone: city.timeZone, hour: "numeric", minute: "2-digit", second: "2-digit", hour12: false });
      const local = parts(now, { timeZone: city.timeZone, hour: "numeric", hourCycle: "h23" });
      const isDay = Number(local.hour) >= DASHBOARD_CONFIG.dayStartsAt && Number(local.hour) < DASHBOARD_CONFIG.nightStartsAt;
      const zonePart = new Intl.DateTimeFormat("zh-Hant-TW", { timeZone: city.timeZone, timeZoneName: "short" })
        .formatToParts(now).find((part) => part.type === "timeZoneName");
      card.classList.toggle("is-day", isDay);
      card.classList.toggle("is-night", !isDay);
      card.dataset.state = isDay ? "day" : "night";
      setText($("[data-clock-city]", card), city.name);
      setText($("[data-clock-time]", card), `${time.hour}:${time.minute}:${time.second}`);
      setText($("[data-clock-date]", card), new Intl.DateTimeFormat("zh-Hant-TW", {
        timeZone: city.timeZone, weekday: "long", year: "numeric", month: "long", day: "numeric"
      }).format(now));
      setText($("[data-clock-zone]", card), `${city.timeZone} · ${zonePart?.value || city.timeZone}`);
      setText($("[data-clock-state]", card), isDay ? "白天" : "夜晚");
    } catch {
      card.classList.remove("is-day", "is-night");
      card.dataset.state = "unavailable";
      setText($("[data-clock-state]", card), "暫時無法取得時間");
    }
  }

  async function fetchWeather({ announce = false } = {}) {
    if (state.weatherBusy) return;
    state.weatherBusy = true;
    if (dom.weatherRefresh) dom.weatherRefresh.disabled = true;
    if (announce) setText(dom.feedback, "正在更新天氣⋯");
    const params = new URLSearchParams({
      latitude: DASHBOARD_CONFIG.cities.map(({ latitude }) => latitude).join(","),
      longitude: DASHBOARD_CONFIG.cities.map(({ longitude }) => longitude).join(","),
      current: "temperature_2m,weather_code",
      temperature_unit: "celsius",
      timezone: "Asia/Taipei"
    });
    try {
      const response = await fetch(`${WEATHER_API}?${params}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);
      const payload = await response.json();
      const results = Array.isArray(payload) ? payload : [payload];
      state.weather = results.map(({ current }) => ({
        code: Number(current?.weather_code),
        temperature: Number(current?.temperature_2m)
      }));
      state.weatherStatus = "ready";
      dom.clocks.forEach((card, index) => renderWeather(card, state.weather[index]));
      if (announce) setText(dom.feedback, "天氣已更新。");
    } catch {
      state.weatherStatus = "error";
      dom.clocks.forEach((card) => {
        const weatherNode = $("[data-weather]", card);
        setText(weatherNode, "目前天氣暫時無法取得");
        if (weatherNode) weatherNode.dataset.state = "error";
      });
      if (announce) setText(dom.feedback, "天氣暫時無法取得，請稍後再試。");
    } finally {
      state.weatherBusy = false;
      if (dom.weatherRefresh) dom.weatherRefresh.disabled = false;
    }
  }

  const durationParts = (milliseconds) => {
    const total = Math.max(0, Math.floor(milliseconds / 1000));
    return {
      days: Math.floor(total / 86400),
      hours: Math.floor((total % 86400) / 3600),
      minutes: Math.floor((total % 3600) / 60),
      seconds: total % 60
    };
  };

  const anniversaryCalendarDate = (year, month, day, timeZone) => {
    const utcDate = new Date(Date.UTC(year, month - 1, day));
    if (!isValidTimeZone(timeZone)) return utcDate;

    // Resolve a calendar date to midnight in its configured zone without
    // letting the browser's local time zone change the date-only value.
    let target = utcDate;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const local = parts(target, {
        timeZone, year: "numeric", month: "numeric", day: "numeric",
        hour: "numeric", minute: "numeric", second: "numeric", hourCycle: "h23"
      });
      const localAsUtc = Date.UTC(
        Number(local.year), Number(local.month) - 1, Number(local.day),
        Number(local.hour), Number(local.minute), Number(local.second)
      );
      target = new Date(target.getTime() + (utcDate.getTime() - localAsUtc));
    }
    return target;
  };
  const formatCalendarDate = (date, timeZone) => {
    const dateParts = parts(date, { timeZone, year: "numeric", month: "numeric", day: "numeric" });
    return `${dateParts.year}/${dateParts.month}/${dateParts.day}`;
  };

  function renderAnniversary(now) {
    const { timeZone } = DASHBOARD_CONFIG.anniversary;
    const currentYear = isValidTimeZone(timeZone)
      ? Number(parts(now, { timeZone, year: "numeric" }).year)
      : NaN;
    const startMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(DASHBOARD_CONFIG.relationshipStart);
    const startYear = startMatch ? Number(startMatch[1]) : NaN;
    const month = startMatch ? Number(startMatch[2]) : NaN;
    const day = startMatch ? Number(startMatch[3]) : NaN;
    const start = Number.isInteger(startYear) && Number.isInteger(month) && Number.isInteger(day)
      ? anniversaryCalendarDate(startYear, month, day, timeZone)
      : new Date(NaN);
    const startParts = Number.isNaN(start.getTime()) || !isValidTimeZone(timeZone)
      ? {}
      : parts(start, { timeZone, year: "numeric", month: "numeric", day: "numeric" });
    if (Number.isNaN(start.getTime()) || !isValidTimeZone(timeZone)
      || !Number.isInteger(startYear) || !Number.isInteger(month) || !Number.isInteger(day)
      || startParts.year !== String(startYear)
      || startParts.month !== String(month)
      || startParts.day !== String(day)
      || !Number.isInteger(currentYear)
      || !Number.isInteger(month) || !Number.isInteger(day)
      || month < 1 || month > 12 || day < 1 || day > 31) {
      dom.anniversary.dataset.anniversaryState = "invalid";
      setText(dom.anniversaryLabel, "暫時無法取得紀念日資訊");
      setText(dom.anniversaryError, "請檢查紀念日設定。");
      return;
    }
    // Resolve the nearest upcoming occurrence from the current calendar year.
    let targetYear = currentYear;
    let target = anniversaryCalendarDate(targetYear, month, day, timeZone);
    if (now >= target) targetYear += 1;
    target = anniversaryCalendarDate(targetYear, month, day, timeZone);
    const isCountdown = now < target;
    const duration = durationParts(isCountdown ? target - now : now - start);
    dom.anniversary.dataset.anniversaryState = isCountdown ? "countdown" : "count-up";
    setText(dom.anniversaryLabel, isCountdown ? "倒數迎接我們的下一個紀念日" : "我們已相伴");
    setText(dom.anniversaryDate, `下一個紀念日 · ${formatCalendarDate(target, timeZone)}`);
    ["days", "hours", "minutes", "seconds"].forEach((key) => setText(dom.duration[key], String(duration[key]).padStart(2, "0")));
    setText(dom.anniversaryError, "");
  }

  function surprise() {
    if (state.messageBusy || !DASHBOARD_CONFIG.messages.length) return;
    state.messageBusy = true;
    dom.button.disabled = true;
    dom.message.setAttribute("aria-busy", "true");
    $(".message-card")?.classList.add("is-surprising");
    window.setTimeout(() => $(".message-card")?.classList.remove("is-surprising"), 950);
    dom.message.classList.add("is-fading");
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => {
      let index = state.messageIndex;
      while (DASHBOARD_CONFIG.messages.length > 1 && index === state.messageIndex) {
        index = Math.floor(Math.random() * DASHBOARD_CONFIG.messages.length);
      }
      state.messageIndex = index;
      setText(dom.message, DASHBOARD_CONFIG.messages[index]);
      setText(dom.feedback, "已送出一點愛。");
      dom.message.classList.remove("is-fading");
      dom.message.setAttribute("aria-busy", "false");
      dom.button.disabled = false;
      state.messageBusy = false;
    }, reduced ? 0 : 180);
  }

  function tapFeedback(card) {
    card.classList.remove("is-tapped");
    // Force a reflow so repeated taps still replay the small acknowledgement.
    void card.offsetWidth;
    card.classList.add("is-tapped");
    window.setTimeout(() => card.classList.remove("is-tapped"), 450);
    if (card !== $(".message-card")) setText(dom.feedback, "收到你的靠近。");
  }

  function toggleAnniversaryFocus() {
    const focused = dom.anniversary.classList.toggle("is-focused");
    dom.focusControl?.setAttribute("aria-pressed", String(focused));
    setText(dom.focusControl, focused ? "取消聚焦" : "聚焦紀念日");
    setText(dom.feedback, focused ? "已突出顯示我們的紀念日。" : "已恢復完整視圖。");
    if (focused) dom.anniversary.focus({ preventScroll: true });
  }

  function update() {
    const now = new Date();
    dom.clocks.forEach((card, index) => {
      renderClock(card, DASHBOARD_CONFIG.cities[index], now);
      if (state.weatherStatus === "ready") renderWeather(card, state.weather[index]);
    });
    renderAnniversary(now);
  }

  state.customization = readCustomization();
  dom.nicknameInput.value = state.customization.nickname || "";
  dom.greetingInput.value = state.customization.greeting || "";
  applyCustomization();
  dom.clocks.forEach((card, index) => {
    setText($("[data-clock-person]", card), DASHBOARD_CONFIG.cities[index]?.person || "我們的時光");
    renderWeather(card);
  });
  dom.button.disabled = !DASHBOARD_CONFIG.messages.length;
  dom.button.addEventListener("click", surprise);
  dom.customizationForm.addEventListener("submit", saveCustomization);
  dom.themeToggle.addEventListener("change", toggleTheme);
  dom.focusControl?.addEventListener("click", toggleAnniversaryFocus);
  dom.weatherRefresh?.addEventListener("click", () => fetchWeather({ announce: true }));
  dom.jumpLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({
        behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start"
      });
      window.setTimeout(() => target.focus({ preventScroll: true }), 0);
      setText(dom.feedback, `已前往${link.textContent}。`);
    });
  });
  loadRomanticCheckIn();
  dom.moodOptions.forEach((option) => option.addEventListener("click", () => selectMood(option)));
  dom.note?.addEventListener("input", saveNote);
  dom.cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      tapFeedback(card);
    });
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      if (card === $(".message-card")) {
        surprise();
      } else {
        tapFeedback(card);
      }
    });
  });
  update();
  fetchWeather();
  window.setInterval(update, 1000);
  window.setInterval(fetchWeather, 10 * 60 * 1000);
})();
