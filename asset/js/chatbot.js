/* =========================================================================
   TRỢ LÝ AI (CHATBOT) — trả lời tự động các câu hỏi thường gặp.
   Không cần server: chạy hoàn toàn trên trình duyệt (rule-based FAQ).
   Câu hỏi ngoài phạm vi kiến thức sẽ gợi ý nhắn Zalo / Facebook trực tiếp.

   ★ SỬA THÔNG TIN CỦA BẠN Ở MỤC "CONFIG" NGAY BÊN DƯỚI ★
   ========================================================================= */
(function () {
	'use strict';
	/* ============================ CONFIG ================================ */
	const CONFIG = {
		zaloNumber: '0388249616'
		, zaloLink: 'https://zalo.me/0388249616', // link mở chat Zalo
		facebookLink: 'https://www.facebook.com/example', // đổi thành link Facebook thật
		// độ trễ (ms) trước khi bong bóng chat tự bật gợi ý lần đầu tiên
		autoOpenHintDelay: 4500,
		// độ trễ giả lập "đang nhập..." trước khi trả lời (ms)
		typingDelayMin: 550
		, typingDelayMax: 1100
	};
	/* =========================== KNOWLEDGE BASE ==========================
	   Mỗi mục gồm: từ khoá để nhận diện câu hỏi + câu trả lời VI/EN.
	   Thêm/sửa/xoá mục tại đây để trợ lý "biết" nhiều hơn.
	======================================================================= */
	const KB = [
		{
			id: 'greeting'
			, keywords: ['xin chao', 'chao', 'hello', 'hi ', 'hey', 'alo']
			, vi: 'Xin chào! Mình là trợ lý ảo của Minh Thúy 👋 Bạn muốn hỏi về kinh nghiệm giảng dạy, học phí, lịch học hay chứng chỉ của Thúy không?'
			, en: "Hi there! I'm Minh Thúy's virtual assistant 👋 Want to ask about her teaching experience, fees, schedule, or certificates?"
    }
		, {
			id: 'experience'
			, keywords: ['kinh nghiem', 'bao nhieu nam', 'nam kinh nghiem', 'experience', 'how many years', 'lam viec o dau', 'grapeseed']
			, vi: 'Thúy có hơn 5 năm kinh nghiệm giảng dạy tiếng Anh, hiện đang công tác tại hệ thống GrapeSEED, từng đào tạo hơn 300 học viên. Bạn có thể xem chi tiết ở mục "Kinh nghiệm" trên trang nhé!'
			, en: "Thúy has 5+ years of English teaching experience, currently at GrapeSEED, and has trained 300+ students. Check the “Experience” section on this page for details!"
    }
		, {
			id: 'certificates'
			, keywords: ['chung chi', 'bang cap', 'toeic', 'certificate', 'qualification', 'degree']
			, vi: 'Thúy có chứng chỉ TOEIC 800+, Chứng nhận Phương pháp GrapeSEED, và Chứng chỉ Nghiệp vụ Sư phạm Tiếng Anh. Xem đầy đủ tại mục "Chứng chỉ" phía trên nhé.'
			, en: 'Thúy holds a TOEIC 800+ certificate, GrapeSEED Methodology Certification, and an English Pedagogy Certificate. See the full list in the “Certificates” section above.'
    }
		, {
			id: 'format'
			, keywords: ['hinh thuc', 'day 1-1', 'day 1 1', 'nhom nho', 'online', 'offline', 'truc tuyen', 'format', 'class type']
			, vi: 'Thúy dạy linh hoạt theo nhiều hình thức: kèm 1-1, lớp nhóm nhỏ, luyện thi TOEIC và cả lớp online. Bạn xem chi tiết ở mục "Dịch vụ" nhé!'
			, en: 'Thúy teaches flexibly: 1-on-1, small groups, TOEIC exam prep, and online classes. See the “Services” section for details!'
    }
		, {
			id: 'pricing'
			, keywords: ['hoc phi', 'gia', 'chi phi', 'bao nhieu tien', 'price', 'fee', 'cost', 'tuition']
			, vi: 'Học phí tùy theo hình thức học (1-1 / nhóm nhỏ / luyện thi) và số buổi mỗi tuần, nên mình chưa thể báo giá cố định ở đây. Bạn nhắn Zalo/Facebook để Thúy tư vấn lịch học và mức phí phù hợp nhất nhé!'
			, en: 'Tuition depends on the format (1-on-1 / small group / exam prep) and sessions per week, so I can’t quote a fixed price here. Please message via Zalo/Facebook so Thúy can advise the best schedule and fee for you!'
			, forceFallback: true
    }
		, {
			id: 'schedule'
			, keywords: ['lich day', 'lich hoc', 'gio day', 'khi nao ranh', 'ranh khong', 'schedule', 'availability', 'time slot', 'dat lich']
			, vi: 'Thúy có lịch trống tham khảo hàng tuần ở mục "Lịch dạy" trên trang. Để chốt khung giờ chính xác, bạn nhắn Zalo cho Thúy nhé — bấm nút bên dưới!'
			, en: 'Check Thúy’s reference weekly availability in the “Schedule” section above. To confirm an exact time slot, please message her on Zalo — tap the button below!'
    }
		, {
			id: 'location'
			, keywords: ['dia chi', 'o dau', 'khu vuc', 'location', 'address', 'ha noi', 'hanoi']
			, vi: 'Thúy hiện dạy tại khu vực Hà Nội, Việt Nam (có nhận lớp online cho học viên ở xa). Bạn xem thêm ở mục "Liên hệ".'
			, en: 'Thúy is based in Hanoi, Vietnam (online classes available for students elsewhere). See the “Contact” section for more.'
    }
		, {
			id: 'contact'
			, keywords: ['lien he', 'so dien thoai', 'email', 'contact', 'phone', 'nhan tin', 'message']
			, vi: 'Bạn có thể liên hệ Thúy qua email, số điện thoại 0388249616, hoặc điền form ở mục "Liên hệ". Nhanh nhất là nhắn Zalo — bấm nút bên dưới nhé!'
			, en: 'You can reach Thúy by email, phone (0388249616), or the form in the “Contact” section. Fastest way: message on Zalo — tap the button below!'
    }
		, {
			id: 'cv'
			, keywords: ['cv', 'ho so', 'resume', 'tai cv', 'download cv', 'xem cv']
			, vi: 'Bạn có thể xem hoặc tải CV của Thúy ở mục "Liên hệ", có 2 nút "Xem CV" và "Tải CV của tôi" nhé.'
			, en: 'You can view or download Thúy’s CV in the “Contact” section — look for the “View CV” and “Download my CV” buttons.'
    }
		, {
			id: 'age-level'
			, keywords: ['do tuoi', 'tre em', 'hoc vien may tuoi', 'lop may', 'age group', 'kids', 'children', 'level']
			, vi: 'Thúy chuyên giảng dạy cho học viên nhỏ tuổi theo hệ GrapeSEED, đồng thời cũng nhận luyện thi TOEIC cho người lớn / học sinh cấp 3, sinh viên. Nhắn cụ thể độ tuổi của bạn để Thúy tư vấn lớp phù hợp nhé!'
			, en: 'Thúy specializes in young learners (GrapeSEED system) and also teaches TOEIC prep for adults, high-schoolers, and university students. Tell her the exact age group so she can suggest the right class!'
    }
		, {
			id: 'methodology'
			, keywords: ['phuong phap', 'cach day', 'giang day nhu the nao', 'methodology', 'teaching method']
			, vi: 'Thúy áp dụng phương pháp giảng dạy chuẩn GrapeSEED kết hợp cá nhân hoá theo từng học viên. Xem chi tiết từng bước ở mục "Phương pháp" trên trang nhé.'
			, en: 'Thúy applies the GrapeSEED methodology combined with a personalized approach for each student. See the step-by-step process in the “Methodology” section.'
    }
		, {
			id: 'results'
			, keywords: ['ket qua', 'thanh tich', 'diem toeic tang', 'results', 'achievement', 'improvement']
			, vi: 'Học viên của Thúy tăng trung bình 260+ điểm TOEIC, với 95% đạt mục tiêu đề ra. Xem biểu đồ chi tiết ở mục "Kết quả".'
			, en: 'Thúy’s students gain an average of 260+ TOEIC points, with 95% hitting their target score. See the charts in the “Results” section.'
    }
		, {
			id: 'thanks'
			, keywords: ['cam on', 'thank', 'cảm ơn']
			, vi: 'Không có gì cả! Nếu cần thêm thông tin, cứ nhắn cho mình hoặc kết bạn Zalo với Thúy nhé 🌸'
			, en: 'You’re welcome! Feel free to ask more, or connect with Thúy on Zalo anytime 🌸'
    }
  ];
	const FALLBACK = {
		vi: 'Câu hỏi này hơi ngoài phạm vi mình có thể trả lời tự động 🙏 Bạn kết bạn Zalo hoặc nhắn Facebook để Minh Thúy phản hồi trực tiếp và chi tiết hơn nhé!'
		, en: "That question is a bit beyond what I can auto-answer 🙏 Please add Thúy on Zalo or message her on Facebook for a direct, detailed reply!"
	};
	const QUICK_REPLIES = [
		{ vi: 'Học phí thế nào?', en: 'What are the fees?', id: 'pricing' }
		, { vi: 'Lịch dạy ra sao?', en: 'What’s the schedule?', id: 'schedule' }
		, { vi: 'Kinh nghiệm giảng dạy?', en: 'Teaching experience?', id: 'experience' }
		, { vi: 'Chứng chỉ gì?', en: 'What certificates?', id: 'certificates' }
		, { vi: 'Nhắn Zalo ngay', en: 'Message on Zalo', id: 'zalo-direct' }
  ];
	/* ============================ HELPERS ================================ */
	function stripDiacritics(str) {
		return str.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/đ/gi, 'd')
			.toLowerCase();
	}
	
	function currentLang() {
		return document.documentElement.lang === 'en' ? 'en' : 'vi';
	}
	const KB_NORMALIZED = KB.map(item => ({
		...item
		, keywordsNorm: item.keywords.map(stripDiacritics)
	}));
	
	function findAnswer(userText) {
		const norm = stripDiacritics(userText);
		let best = null;
		let bestScore = 0;
		KB_NORMALIZED.forEach(item => {
			let score = 0;
			item.keywordsNorm.forEach(kw => {
				if (norm.includes(kw)) score += kw.length; // ưu tiên từ khoá dài/đặc trưng hơn
			});
			if (score > bestScore) {
				bestScore = score;
				best = item;
			}
		});
		if (!best || bestScore === 0) return null;
		return best;
	}
	/* ============================ DOM REFS ================================ */
	const toggleBtn = document.getElementById('chat-toggle');
	const panel = document.getElementById('chat-panel');
	const closeBtn = document.getElementById('chat-close');
	const messagesEl = document.getElementById('chat-messages');
	const quickRepliesEl = document.getElementById('chat-quick-replies');
	const form = document.getElementById('chat-form');
	const input = document.getElementById('chat-input');
	const badge = document.getElementById('chat-badge');
	if (!toggleBtn || !panel) return; // an toàn nếu markup chưa có
	let hasGreeted = false;
	/* ============================ RENDER HELPERS =========================== */
	function scrollToBottom() {
		messagesEl.scrollTop = messagesEl.scrollHeight;
	}
	
	function addBubble(html, sender) {
		const div = document.createElement('div');
		div.className = 'chat-msg ' + sender;
		div.innerHTML = html;
		messagesEl.appendChild(div);
		scrollToBottom();
		return div;
	}
	
	function addFallbackActions(container) {
		const wrap = document.createElement('div');
		wrap.className = 'chat-msg-actions';
		wrap.innerHTML = `
      <a class="chat-action-btn zalo" href="${CONFIG.zaloLink}" target="_blank" rel="noopener">💬 Zalo</a>
      <a class="chat-action-btn fb" href="${CONFIG.facebookLink}" target="_blank" rel="noopener">📘 Facebook</a>
    `;
		container.appendChild(wrap);
	}
	
	function showTyping() {
		const div = document.createElement('div');
		div.className = 'chat-typing';
		div.id = 'chat-typing-indicator';
		div.innerHTML = '<span></span><span></span><span></span>';
		messagesEl.appendChild(div);
		scrollToBottom();
		return div;
	}
	
	function removeTyping() {
		const t = document.getElementById('chat-typing-indicator');
		if (t) t.remove();
	}
	
	function renderQuickReplies() {
		const lang = currentLang();
		quickRepliesEl.innerHTML = '';
		QUICK_REPLIES.forEach(q => {
			const btn = document.createElement('button');
			btn.type = 'button';
			btn.className = 'chat-quick-btn';
			btn.textContent = lang === 'en' ? q.en : q.vi;
			btn.addEventListener('click', () => handleQuickReply(q));
			quickRepliesEl.appendChild(btn);
		});
	}
	
	function handleQuickReply(q) {
		const lang = currentLang();
		addBubble(escapeHtml(lang === 'en' ? q.en : q.vi), 'user');
		if (q.id === 'zalo-direct') {
			respondWithTyping(() => {
				const el = addBubble(lang === 'en' ? 'Great — tap the button below to chat with Thúy directly on Zalo!' : 'Tuyệt vời — bấm nút bên dưới để nhắn trực tiếp cho Thúy qua Zalo nhé!', 'bot');
				addFallbackActions(el);
			});
			return;
		}
		const item = KB_NORMALIZED.find(k => k.id === q.id);
		respondWithTyping(() => deliverAnswer(item, lang));
	}
	
	function respondWithTyping(callback) {
		showTyping();
		const delay = CONFIG.typingDelayMin + Math.random() * (CONFIG.typingDelayMax - CONFIG.typingDelayMin);
		setTimeout(() => {
			removeTyping();
			callback();
		}, delay);
	}
	
	function deliverAnswer(item, lang) {
		if (!item) {
			const el = addBubble(escapeHtml(FALLBACK[lang]), 'bot');
			addFallbackActions(el);
			return;
		}
		const text = lang === 'en' ? item.en : item.vi;
		const el = addBubble(escapeHtml(text), 'bot');
		if (item.forceFallback) addFallbackActions(el);
	}
	
	function escapeHtml(str) {
		const div = document.createElement('div');
		div.textContent = str;
		return div.innerHTML;
	}
	
	function greetIfNeeded() {
		if (hasGreeted) return;
		hasGreeted = true;
		const lang = currentLang();
		showTyping();
		setTimeout(() => {
			removeTyping();
			addBubble(escapeHtml(lang === 'en' ? "Hi! I'm Minh Thúy's virtual assistant 👋 Ask me about her experience, fees, schedule, or certificates — or tap a quick question below." : 'Xin chào! Mình là trợ lý ảo của Minh Thúy 👋 Hỏi mình về kinh nghiệm, học phí, lịch dạy, chứng chỉ... hoặc bấm nhanh câu hỏi bên dưới nhé.'), 'bot');
		}, 500);
	}
	/* ============================ EVENTS =================================== */
	function openChat() {
		panel.classList.add('open');
		panel.setAttribute('aria-hidden', 'false');
		toggleBtn.classList.add('open');
		toggleBtn.setAttribute('aria-expanded', 'true');
		if (badge) badge.classList.add('hidden');
		renderQuickReplies();
		greetIfNeeded();
		setTimeout(() => input && input.focus(), 250);
	}
	
	function closeChat() {
		panel.classList.remove('open');
		panel.setAttribute('aria-hidden', 'true');
		toggleBtn.classList.remove('open');
		toggleBtn.setAttribute('aria-expanded', 'false');
	}
	toggleBtn.addEventListener('click', () => {
		panel.classList.contains('open') ? closeChat() : openChat();
	});
	closeBtn && closeBtn.addEventListener('click', closeChat);
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && panel.classList.contains('open')) closeChat();
	});
	form && form.addEventListener('submit', (e) => {
		e.preventDefault();
		const val = (input.value || '')
			.trim();
		if (!val) return;
		const lang = currentLang();
		addBubble(escapeHtml(val), 'user');
		input.value = '';
		respondWithTyping(() => {
			const item = findAnswer(val);
			deliverAnswer(item, lang);
		});
	});
	// cập nhật lại quick-replies khi người dùng đổi ngôn ngữ VI/EN
  ['lang-vi', 'lang-en', 'lang-vi-m', 'lang-en-m'].forEach(id => {
		const btn = document.getElementById(id);
		if (btn) btn.addEventListener('click', () => {
			if (quickRepliesEl.innerHTML) renderQuickReplies();
		});
	});
	// gợi ý mở chat tự động 1 lần sau vài giây (không làm phiền nếu đã tương tác)
	try {
		if (!sessionStorage.getItem('chatHintShown')) {
			setTimeout(() => {
				if (!panel.classList.contains('open')) {
					toggleBtn.classList.add('chat-toggle-hint');
				}
			}, CONFIG.autoOpenHintDelay);
			sessionStorage.setItem('chatHintShown', '1');
		} else if (badge) {
			badge.classList.add('hidden');
		}
	} catch (err) {
		/* sessionStorage có thể bị chặn (chế độ ẩn danh) — bỏ qua an toàn */
	}
})();