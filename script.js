    // ---------- БАЗА ДАННЫХ ТРЕКОВ ----------
    const tracksDB = [
        { title: "Sonne", artist: "Rammstein", desc: "Метал / Альтернативный рок", icon: "fa-sun" },
        { title: "Golden Hour", artist: "The Starlights", desc: "Инди-поп, летнее настроение", icon: "fa-moon" },
        { title: "Neon Dreams", artist: "Velvet Code", desc: "Синтвейв, 80s vibe", icon: "fa-lightbulb" },
        { title: "Объятия", artist: "Лампабикт", desc: "Фолк / акустика", icon: "fa-tree" },
        { title: "Lost in Tokyo", artist: "Kaito", desc: "Lo-fi / хип-хоп", icon: "fa-city" },
        { title: "Скованные одной цепью", artist: "Nautilus Pompilius", desc: "Рок", icon: "fa-charging-station" },
        { title: "Чёрная луна", artist: "Агата Кристи", desc: "Рок", icon: "fa-cloud-moon" },
        { title: "Rush Hour", artist: "DJ Nimbus", desc: "Драм-н-бейс", icon: "fa-bolt" },
        { title: "Концерт Ля минор", artist: "Иоганн Себастьян Бах", desc: "Классическая", icon: "fa-water" }
    ];

    // сколько карточек показать изначально
    let visibleCount = 4;      // первые 4 трека
    const container = document.getElementById('tracksContainer');
    const loadBtn = document.getElementById('loadMoreBtn');

    // функция отрисовки карточек 
    function renderTracks() {
        container.innerHTML = '';
        const tracksToShow = tracksDB.slice(0, visibleCount);
        tracksToShow.forEach(track => {
            const card = document.createElement('div');
            card.className = 'track-card';
            card.innerHTML = `
                <div class="track-img"><i class="fas ${track.icon} fa-3x"></i></div>
                <div class="track-info">
                    <div class="track-title">${escapeHTML(track.title)}</div>
                    <div class="track-artist"><i class="fas fa-user-musician"></i> ${escapeHTML(track.artist)}</div>
                    <div class="track-desc">${escapeHTML(track.desc)}</div>
                </div>
            `;
            container.appendChild(card);
        });
        // скрыть кнопку, если показали все
        if (visibleCount >= tracksDB.length) {
            loadBtn.style.display = 'none';
        } else {
            loadBtn.style.display = 'inline-flex';
        }
    }

    // простая защита от XSS
    function escapeHTML(str) {
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    // показать еще (добавляет по 3 карточки или до конца)
    function loadMoreTracks() {
        const leftCount = tracksDB.length - visibleCount;
        if (leftCount <= 0) return;
        const increment = Math.min(3, leftCount);
        visibleCount += increment;
        renderTracks();
    }

    // начальная отрисовка
    renderTracks();
    loadBtn.addEventListener('click', loadMoreTracks);

    // ---------- ТЕМНАЯ ТЕМА (localStorage) ----------
    const themeToggle = document.getElementById('themeToggleBtn');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> Светлая';
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i> Темная';
        }
    }

    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        if (prefersDark) applyTheme('dark');
        else applyTheme('light');
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark');
        applyTheme(isDark ? 'light' : 'dark');
    });

    // ---------- ФОРМА: валидация + console.log ----------
    const form = document.getElementById('feedbackForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const msgInput = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const msgError = document.getElementById('msgError');

    function validateEmail(email) {
        const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return re.test(email);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        
        // очистка ошибок
        nameError.textContent = '';
        emailError.textContent = '';
        msgError.textContent = '';

        const nameVal = nameInput.value.trim();
        if (nameVal === '') {
            nameError.textContent = 'Укажите ваше имя';
            isValid = false;
        }

        const emailVal = emailInput.value.trim();
        if (emailVal === '') {
            emailError.textContent = 'Введите email';
            isValid = false;
        } else if (!validateEmail(emailVal)) {
            emailError.textContent = 'Некорректный email (пример: name@domain.com)';
            isValid = false;
        }

        const msgVal = msgInput.value.trim();
        if (msgVal === '') {
            msgError.textContent = 'Напишите сообщение';
            isValid = false;
        }

        if (isValid) {
            const formData = {
                name: nameVal,
                email: emailVal,
                message: msgVal,
                timestamp: new Date().toISOString()
            };
            console.log('📬 Данные формы обратной связи:', formData);
            alert(`Спасибо, ${nameVal}! Ваше сообщение отправлено (проверьте консоль разработчика).`);
            form.reset();
        } else {
            console.warn('Ошибка валидации формы');
        }
    });
