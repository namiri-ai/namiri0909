// EmailJS 공개 설정값: 이곳에서만 관리합니다.
const SITE_URL = "https://0909lecturefolder.vercel.app/";
const EMAILJS_PUBLIC_KEY = "gtemfWT4yR4nS-1KL";
const EMAILJS_SERVICE_ID = "service_a5p2brf";
const EMAILJS_TEMPLATE_ID = "template_gpdflwn"; // 접수 알림
const EMAILJS_AUTOREPLY_ID = "template_8am4eip"; // 자동회신

const labMarkup = `<a class="lab-link" href="https://hanconyeon.com/" target="_blank" rel="noopener"><img src="https://ai-homepage-prompt.vercel.app/logo.png" alt="한국AI콘텐츠연구소" onerror="this.hidden=true"><span><strong>한국AI콘텐츠연구소</strong><small>KOREA AI CONTENTS LAB</small></span></a>`;
const formMarkup = `<form class="contact-form" id="contact-form" novalidate><div class="form-grid"><label>이름<input name="from_name" required autocomplete="name"></label><label>이메일<input name="from_email" type="email" required autocomplete="email"></label><label>연락처<input name="phone" type="tel" autocomplete="tel"></label><label>소속<input name="company" autocomplete="organization"></label><label class="form-wide">문의 유형<select name="inquiry_type"><option>교육 문의</option><option>워크숍 문의</option><option>컨설팅 문의</option><option>기타</option></select></label><label class="form-wide">문의 내용<textarea name="message" rows="6" required></textarea></label></div><input type="hidden" name="to_email" value="microniki3@gmail.com"><input type="hidden" name="reply_to"><input type="hidden" name="submitted_at"><input type="hidden" name="page_url"><input type="hidden" name="agreed_at"><div class="privacy-wrap"><label class="privacy-check"><input name="privacy_agreed" type="checkbox" value="미동의" required><span>[필수] 개인정보 수집 · 이용에 동의합니다</span></label><details class="privacy-details"><summary>전문 보기</summary><table><tbody><tr><th>수집 항목</th><td>이름, 이메일, 연락처, 소속</td></tr><tr><th>수집 · 이용 목적</th><td>문의 접수 및 답변 회신</td></tr><tr><th>보유 · 이용 기간</th><td>문의 처리 완료 후 1년 뒤 파기</td></tr><tr><th>동의 거부 권리</th><td>거부할 수 있으나 거부 시 문의 접수가 불가합니다</td></tr></tbody></table></details></div><p class="form-status" role="status" aria-live="polite">개인정보 수집 · 이용에 동의해 주세요.</p><button class="form-submit" type="submit" disabled>문의 보내기 <span>↗</span></button></form>`;

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const labHeader = document.createElement('div');
  labHeader.className = 'lab-header'; labHeader.innerHTML = labMarkup;
  header.before(labHeader);
  const footer = document.querySelector('footer');
  footer.insertAdjacentHTML('beforeend', `${labMarkup}<p>© 2026 한국AI콘텐츠연구소</p>`);
  footer.querySelector('.lab-link')?.classList.add('footer-lab');
  document.querySelector('.contact')?.insertAdjacentHTML('beforeend', formMarkup);

  const form = document.querySelector('#contact-form');
  if (!form) return;
  const consent = form.elements.privacy_agreed;
  const submit = form.querySelector('.form-submit');
  const status = form.querySelector('.form-status');
  const setConsent = () => {
    submit.disabled = !consent.checked;
    consent.value = consent.checked ? '동의함' : '미동의';
    status.textContent = consent.checked ? '' : '개인정보 수집 · 이용에 동의해 주세요.';
  };
  consent.addEventListener('change', setConsent); setConsent();
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!consent.checked) { status.textContent = '동의해 주세요.'; consent.focus(); return; }
    if (!form.checkValidity()) { status.textContent = '이름, 이메일, 문의 내용을 확인해 주세요.'; form.reportValidity(); return; }
    if (!window.emailjs) { status.textContent = '메일 전송 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'; return; }
    const now = new Date().toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' });
    form.elements.reply_to.value = form.elements.from_email.value;
    form.elements.submitted_at.value = now;
    form.elements.page_url.value = window.location.href;
    form.elements.agreed_at.value = now;
    const data = Object.fromEntries(new FormData(form));
    submit.disabled = true; status.textContent = '문의 내용을 전송하고 있습니다…';
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, data, { publicKey: EMAILJS_PUBLIC_KEY });
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_ID, data, { publicKey: EMAILJS_PUBLIC_KEY });
      form.reset(); setConsent(); status.textContent = '문의가 접수되었습니다. 입력하신 이메일로 확인 메일을 보냈습니다.';
    } catch (error) {
      status.textContent = '전송에 실패했습니다. 잠시 후 다시 시도하거나 이메일로 문의해 주세요.';
      submit.disabled = false;
    }
  });
});
