function updateActiveMenu(page) {
  const navItems = document.querySelectorAll('.navframe .navbtn');
  navItems.forEach(item => {
    item.classList.remove('active');
  });

  const currentActiveItem = document.querySelector(`.navframe .navbtn[data-page="${page}"]`);
  if (currentActiveItem) {
    currentActiveItem.classList.add('active');
  }
}

async function navigateTo(page) {
  const content = document.getElementById('app-content');
  content.classList.add('fade-out');

  // 트랜지션 대기(250ms == 0.25s)
  await new Promise(resolve => setTimeout(resolve, 250));

  try {
    const res = await fetch(`${page}.html`);
    if (!res.ok) throw new Error('페이지를 찾을 수 없습니다.');
    const html = await res.text();

    content.innerHTML = html;

    const newUrl = (page === 'cv') ? './' : `?page=${page}`;
    history.pushState({ page }, '', newUrl);

    updateActiveMenu(page);
  } catch (err) {
    content.innerHTML = '<h2>404 Page Not Found</h2>';
  }

  // 내용 교체 후 페이드인
  content.classList.remove('fade-out');
}

// 뒤로가기 대응
window.addEventListener('popstate', (event) => {
  const page = event.state?.page || 'cv';
  navigateTo(page);
});

// 최초 접속 및 새로고침 대응
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const initialPage = urlParams.get('page') || 'cv';
  
  navigateTo(initialPage);
});

// 언어 드롭다운 메뉴
function toggleLangMenu(event) {
  event.stopPropagation();
  document.getElementById('navlang').classList.toggle('open');
}

// 메뉴 외부 영역을 누르면 메뉴 닫아주기
document.addEventListener('click', function (event) {
  const navlang = document.getElementById('navlang');
  if (navlang.classList.contains('open') && !navlang.contains(event.target)) {
    navlang.classList.remove('open');
  }
});

// 언어 선택 후 메뉴 닫아주기
function selectLanguage(lang) {
  document.getElementById('navlang').classList.remove('open');
}

function copyEmail(emailText) {
  navigator.clipboard.writeText(emailText).then(() => {
    alert('메일 주소를 복사했습니다');
  }).catch(err => {
    console.error('복사 실패:', err);
  });
}