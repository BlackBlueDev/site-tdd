/**
 * IGREJA TABERNÁCULO DE DAVI - CASA DE ORAÇÃO
 * Caruaru, Pernambuco
 * Interações e Componentes Dinâmicos
 */

function initAll() {
  initPromisesBox();
  initDepartmentFilter();
  initDepartmentModal();
  initPixCopy();
  initNavigation();
  initSearch();
  initHistoryVideo();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

/* ==========================================================================
   1. CONTAGEM REGRESSIVA PARA O PRÓXIMO CULTO (3 Cultos Semanais)
   ========================================================================== */
function initCountdown() {
  const timerDisplay = document.getElementById('countdown-display');
  const serviceLabel = document.getElementById('next-service-label');
  if (!timerDisplay) return;

  // Cultos oficiais da igreja:
  // 1 = Segunda-feira: 19:30 (Culto de Oração)
  // 3 = Quarta-feira: 19:30 (Culto de Cura e Libertação)
  // 0 = Domingo: 18:00 (Grande Culto Principal da Família)
  const schedule = [
    { day: 1, hour: 19, min: 30, title: 'Segunda-feira às 19h30: Culto de Oração' },
    { day: 3, hour: 19, min: 30, title: 'Quarta-feira às 19h30: Culto de Cura e Libertação' },
    { day: 0, hour: 18, min: 0, title: 'Domingo às 18h: Grande Culto Principal da Família' }
  ];

  function getNextServiceDate() {
    const now = new Date();
    let nextCandidates = [];

    for (let s of schedule) {
      let target = new Date(now);
      let dayDiff = (s.day - now.getDay() + 7) % 7;
      target.setDate(now.getDate() + dayDiff);
      target.setHours(s.hour, s.min, 0, 0);

      // Se for hoje e o horário já passou, avança 7 dias
      if (dayDiff === 0 && target <= now) {
        target.setDate(target.getDate() + 7);
      }
      nextCandidates.push({ date: target, title: s.title });
    }

    nextCandidates.sort((a, b) => a.date - b.date);
    return nextCandidates[0];
  }

  function updateTimer() {
    const nextService = getNextServiceDate();
    const now = new Date();
    const diff = nextService.date - now;

    if (serviceLabel) {
      serviceLabel.textContent = nextService.title;
    }

    if (diff <= 0) {
      timerDisplay.textContent = 'CULTO AO VIVO AGORA';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');
    if (days > 0) {
      timerDisplay.textContent = `${days}d ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`;
    } else {
      timerDisplay.textContent = `${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`;
    }
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   2. CAIXA DE PROMESSAS INTERATIVA (Versículos Bíblicos Completos)
   ========================================================================== */
const biblicalPromises = [
  {
    verse: "Porque a minha casa será chamada casa de oração para todos os povos.",
    ref: "Isaías 56:7"
  },
  {
    verse: "Naquele dia levantarei o tabernáculo caído de Davi, e repararei as suas brechas, e levantarei as suas ruínas, e o edificarei como nos dias antigos.",
    ref: "Amós 9:11"
  },
  {
    verse: "Uma coisa pedi ao Senhor e a buscarei: que possa morar na casa do Senhor todos os dias da minha vida, para contemplar a formosura do Senhor e aprender no seu templo.",
    ref: "Salmo 27:4"
  },
  {
    verse: "Ide, portanto, fazei discípulos de todas as nações, batizando-os em nome do Pai, e do Filho, e do Espírito Santo; ensinando-os a guardar todas as coisas que eu vos tenho mandado; e eis que eu estou convosco todos os dias, até a consumação dos séculos.",
    ref: "Mateus 28:19-20"
  },
  {
    verse: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.",
    ref: "Isaías 41:10"
  },
  {
    verse: "O meu Deus, segundo as suas riquezas, suprirá todas as vossas necessidades em glória, por Cristo Jesus.",
    ref: "Filipenses 4:19"
  },
  {
    verse: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.",
    ref: "Jeremias 29:11"
  },
  {
    verse: "Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará. Direi do Senhor: Ele é o meu Deus, o meu refúgio, a minha fortaleza, e nele confiarei.",
    ref: "Salmo 91:1-2"
  },
  {
    verse: "Não to mandei eu? Esforça-te, e tem bom ânimo; não temas, nem te espantes; porque o Senhor teu Deus é contigo, por onde quer que andares.",
    ref: "Josué 1:9"
  },
  {
    verse: "Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.",
    ref: "Romanos 8:28"
  },
  {
    verse: "Elevo os meus olhos para os montes; de onde me virá o socorro? O meu socorro vem do Senhor, que fez os céus e a terra.",
    ref: "Salmo 121:1-2"
  },
  {
    verse: "A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza.",
    ref: "2 Coríntios 12:9"
  },
  {
    verse: "Mas os que esperam no Senhor renovarão as suas forças, subirão com asas como águias; correrão, e não se cansarão; caminharão, e não se fatigarão.",
    ref: "Isaías 40:31"
  }
];

let currentPromiseIndex = 0;

function initPromisesBox() {
  const verseEl = document.getElementById('promise-verse');
  const refEl = document.getElementById('promise-ref');
  const drawBtn = document.getElementById('btn-draw-promise');
  const shareBtn = document.getElementById('btn-share-promise');

  if (!verseEl || !refEl) return;

  function renderPromise(index) {
    verseEl.style.opacity = '0';
    refEl.style.opacity = '0';
    setTimeout(() => {
      verseEl.textContent = `"${biblicalPromises[index].verse}"`;
      refEl.textContent = biblicalPromises[index].ref;
      verseEl.style.opacity = '1';
      refEl.style.opacity = '1';
    }, 200);
  }

  // Sorteio inicial
  renderPromise(currentPromiseIndex);

  if (drawBtn) {
    drawBtn.addEventListener('click', () => {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * biblicalPromises.length);
      } while (nextIndex === currentPromiseIndex && biblicalPromises.length > 1);
      currentPromiseIndex = nextIndex;
      renderPromise(currentPromiseIndex);
      showToast("✨ Uma nova promessa de Deus para o seu coração!");
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const p = biblicalPromises[currentPromiseIndex];
      const text = `*Palavra de Fé - Igreja Tabernáculo de Davi (Caruaru - PE)*%0A%0A"${p.verse}"%0A— _${p.ref}_%0A%0AQue esta promessa abençoe a sua vida e a sua família! 🙏`;
      const whatsappUrl = `https://api.whatsapp.com/send?text=${text}`;
      window.open(whatsappUrl, '_blank');
    });
  }
}

/* ==========================================================================
   3. FILTRO DE MINISTÉRIOS E DEPARTAMENTOS
   ========================================================================== */
function initDepartmentFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const deptCards = document.querySelectorAll('.dept-card');

  if (!filterBtns.length || !deptCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      deptCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   4. MODAL DETALHADO DO DEPARTAMENTO (Sem Abreviações)
   ========================================================================== */
const departmentData = {
  'louvor': {
    name: 'Departamento de Louvor e Adoração',
    subtitle: 'Altar de Adoração e Louvor',
    verse: '1 Crônicas 16:4',
    desc: 'O Ministério de Louvor tem a nobre missão de ministrar diante da Arca da Aliança e conduzir toda a congregação à presença do Senhor. Inspirados no modelo de adoração e consagração do rei Davi, nossos levitas e músicos dedicam seus dons com integridade e excelência espiritual nos cultos da igreja.',
    meetings: 'Atuação nos cultos de Segunda-feira às 19h30, Quarta-feira às 19h30 e Domingo às 18h00, além de ensaios ministeriais agendados.',
    contact: 'Coordenação do Ministério de Louvor, sob a liderança do Pastor Erivonaldo Teixeira e da Pastora Marta Teixeira.'
  },
  'casais': {
    name: 'Rede de Casais',
    subtitle: 'Famílias Fortes e Alianças Restauradas',
    verse: 'Efésios 5:31',
    desc: 'Cremos que a família é um projeto santo do coração de Deus. A Rede de Casais promove acolhimento aos cônjuges, edificação matrimonial, aconselhamento à luz das Escrituras Sagradas e comunhão fraterna.',
    meetings: 'Participação ativa nos cultos de Segunda-feira às 19h30, Quarta-feira às 19h30 e Domingo às 18h00, com encontros periódicos de casais.',
    contact: 'Liderança de Famílias, com apoio do Pastor Erivonaldo Teixeira e da Pastora Marta Teixeira.'
  },
  'mulheres': {
    name: 'Guardiãs da Fé',
    subtitle: 'Mulheres Virtuosas e Consagradas',
    verse: 'Provérbios 31:29-30',
    desc: 'Mulheres consagradas à oração, ao estudo edificante da Bíblia Sagrada e ao cuidado com as famílias. Promovemos acolhimento espiritual, comunhão e apoio mútuo a todas as irmãs da igreja e da comunidade em Caruaru.',
    meetings: 'Presença viva nos cultos de Segunda-feira às 19h30, Quarta-feira às 19h30 e Domingo às 18h00, além de círculos de comunhão.',
    contact: 'Coordenação oficial da Pastora Marta Teixeira.'
  },
  'diaconato': {
    name: 'Diaconato',
    subtitle: 'Servir com Excelência, Honra e Amor Cristão',
    verse: '1 Timóteo 3:13',
    desc: 'O Diaconato expressa o verdadeiro coração de servo de Jesus Cristo. Responsável pelo acolhimento caloroso de cada membro e visitante que chega ao templo, pela organização solene da Santa Ceia e pelo suporte aos cultos da igreja.',
    meetings: 'Escala oficial durante os cultos de Segunda-feira às 19h30, Quarta-feira às 19h30 e Domingo às 18h00.',
    contact: 'Corpo Diaconal, sob orientação pastoral da Igreja Tabernáculo de Davi.'
  },
  'kids': {
    name: 'Departamento Infantil',
    subtitle: 'Ensinando a Criança no Caminho da Verdade',
    verse: 'Provérbios 22:6',
    desc: 'Ambiente seguro, bíblico e afetuoso onde crianças aprendem a Palavra de Deus com amor e atividades cristãs adequadas para cada idade, enquanto os pais adoram a Deus no templo.',
    meetings: 'Salas abertas com acolhimento infantil nos cultos de Segunda-feira às 19h30, Quarta-feira às 19h30 e Domingo às 18h00.',
    contact: 'Coordenação Pedagógica do Departamento Infantil.'
  },
  'midia': {
    name: 'Mídia e Comunicação',
    subtitle: 'Proclamando as Boas Novas da Salvação',
    verse: 'Marcos 16:15',
    desc: 'Equipe de comunicação, sonorização, iluminação e transmissão digital responsável por divulgar o evangelho e as celebrações da Casa de Oração com clareza e dedicação.',
    meetings: 'Atuação técnica durante todos os cultos oficiais: Segunda-feira às 19h30, Quarta-feira às 19h30 e Domingo às 18h00.',
    contact: 'Equipe de Comunicação e Tecnologia da Igreja.'
  },
  'jovem': {
    name: 'Renova Jovem',
    subtitle: 'Juventude Apaixonada por Jesus e Pura em Santidade',
    verse: '1 Timóteo 4:12',
    desc: 'Movimento de jovens e adolescentes comprometidos com a Palavra de Deus, vivendo em santidade, comunhão fraterna e testemunho cristão.',
    meetings: 'Participação unida nos cultos oficiais de Segunda-feira às 19h30, Quarta-feira às 19h30 e Domingo às 18h00.',
    contact: 'Liderança do Renova Jovem e Liderança Pastoral.'
  },
  'teatro': {
    name: 'Ministério de Teatro e Artes Cênicas',
    subtitle: 'A Arte a Serviço da Proclamação do Reino de Deus',
    verse: 'Salmo 150:6',
    desc: 'Representações bíblicas e expressões dramáticas que anunciam o amor de Jesus Cristo e a mensagem da redenção com sensibilidade e impacto visual.',
    meetings: 'Apresentações durante as celebrações oficiais de Segunda-feira às 19h30, Quarta-feira às 19h30 e Domingo às 18h00.',
    contact: 'Coordenação de Artes Cênicas da Igreja.'
  }
};

function initDepartmentModal() {
  const modal = document.getElementById('dept-modal');
  const closeBtn = document.getElementById('btn-close-modal');
  const moreBtns = document.querySelectorAll('.dept-btn-more');

  if (!modal) return;

  function openDeptModal(deptKey) {
    const data = departmentData[deptKey];
    if (!data) return;

    document.getElementById('modal-dept-title').textContent = data.name;
    document.getElementById('modal-dept-subtitle').textContent = data.subtitle;
    document.getElementById('modal-dept-verse').textContent = `Base Bíblica: ${data.verse}`;
    document.getElementById('modal-dept-desc').textContent = data.desc;
    document.getElementById('modal-dept-meetings').textContent = data.meetings;
    document.getElementById('modal-dept-contact').textContent = data.contact;

    const serveBtn = document.getElementById('modal-dept-serve-btn');
    if (serveBtn) {
      serveBtn.href = `https://api.whatsapp.com/send?phone=5581999999999&text=Olá! Desejo saber mais sobre o ${encodeURIComponent(data.name)} da Igreja Tabernáculo de Davi em Caruaru.`;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  moreBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const deptKey = btn.getAttribute('data-dept');
      openDeptModal(deptKey);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. DÍZIMOS E OFERTAS - COPIAR CÓDIGO PIX (COPIA E COLA)
   ========================================================================== */
function initPixCopy() {
  const copyBtn = document.getElementById('btn-copy-pix');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const pixCode = copyBtn.getAttribute('data-pix-code') || "00020126490014BR.GOV.BCB.PIX0127erivonaldo.lima@hotmail.com5204000053039865802BR5925ERIVONALDO TEIXEIRA DE LI6009SAO PAULO6226052276qb7A6du2tMyfzCldJzyR63046CF3";
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(pixCode).then(() => {
        showToast("✅ Código PIX Copia e Cola copiado com sucesso! Deus abençoe sua semeadura.");
      }).catch(() => {
        fallbackCopy(pixCode);
      });
    } else {
      fallbackCopy(pixCode);
    }
  });

  function fallbackCopy(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.setAttribute('readonly', '');
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast("✅ Código PIX Copia e Cola copiado com sucesso! Deus abençoe sua semeadura.");
    } catch (err) {
      showToast("❌ Erro ao copiar. Tente novamente.");
    }
    document.body.removeChild(tempInput);
  }
}

/* ==========================================================================
   6. NAVEGAÇÃO MOBILE, DRAWER & ACTIVE LINK OBSERVER
   ========================================================================== */
function initNavigation() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerLinks = document.querySelectorAll('.mobile-drawer-link');
  const bottomNavItems = document.querySelectorAll('.bottom-nav-item');

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('active');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });
  }

  function openDrawer() {
    menuToggle.classList.add('active');
    mobileDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    menuToggle.classList.remove('active');
    mobileDrawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Desktop "Mais" sandwich dropdown
  const moreDropdown = document.getElementById('nav-more-dropdown');
  const moreBtn = document.getElementById('btn-nav-more');
  const moreMenu = document.getElementById('nav-more-menu');

  if (moreBtn && moreDropdown) {
    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = moreDropdown.classList.toggle('active');
      moreBtn.setAttribute('aria-expanded', String(isActive));
    });

    document.addEventListener('click', (e) => {
      if (!moreDropdown.contains(e.target)) {
        moreDropdown.classList.remove('active');
        moreBtn.setAttribute('aria-expanded', 'false');
      }
    });

    if (moreMenu) {
      moreMenu.querySelectorAll('.nav-more-link').forEach(link => {
        link.addEventListener('click', () => {
          moreDropdown.classList.remove('active');
          moreBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  // Active section observer
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        bottomNavItems.forEach(item => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3
  });

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   7. BUSCA INSTITUCIONAL RÁPIDA
   ========================================================================== */
function initSearch() {
  const searchBtn = document.getElementById('btn-search-trigger');
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  const closeSearchBtn = document.getElementById('btn-close-search');
  const searchResults = document.getElementById('search-results');

  if (!searchBtn || !searchModal || !searchInput) return;

  const siteIndex = [
    { title: "Horários dos Cultos e Agenda", anchor: "#cultos", desc: "Segunda-feira às 19h30 (Culto de Oração), Quarta-feira às 19h30 (Culto de Cura e Libertação) e Domingo às 18h00 (Culto Principal da Família)." },
    { title: "Quem Somos, Missão e Visão", anchor: "#sobre", desc: "Conheça a história e a identidade bíblica da Igreja Tabernáculo de Davi - Casa de Oração." },
    { title: "Os 9 Valores Fundamentais", anchor: "#valores", desc: "Adoração extravagante, evangelismo intencional, presença de Deus e integridade bíblica." },
    { title: "Pastor Erivonaldo Teixeira e Pastora Marta Teixeira", anchor: "#pastores", desc: "Liderança pastoral e ministério da Igreja Tabernáculo de Davi em Caruaru." },
    { title: "Ministérios e Departamentos", anchor: "#ministerios", desc: "Rede de Casais, Guardiãs da Fé, Louvor, Diaconato, Departamento Infantil, Mídia, Renova Jovem e Teatro." },
    { title: "Caixa de Promessas Bíblicas", anchor: "#promessas", desc: "Receba uma palavra inspiradora da Bíblia Sagrada para a sua vida." },
    { title: "Dízimos, Ofertas e Contribuição PIX", anchor: "#doacoes", desc: "Contribuição transparente para o sustento da igreja e missões." },
    { title: "Localização e Endereço Oficial", anchor: "#localizacao", desc: "Rua Herculano Cordeiro, 294, Salgado, Caruaru - PE, CEP: 55020-330 (próximo à Escola Arnaldo Assunção)." },
    { title: "Vídeo: O Início e História da Igreja", anchor: "#sobre", desc: "Assista ao relato em vídeo de como Deus iniciou a Igreja Tabernáculo de Davi em Caruaru." },
    { title: "Redes Sociais Oficiais e YouTube", anchor: "#sobre", desc: "Instagram (@tddsede), YouTube (@tabernaculodedavioficial) e Facebook oficial." }
  ];

  searchBtn.addEventListener('click', () => {
    searchModal.classList.add('active');
    searchInput.focus();
    renderResults("");
  });

  if (closeSearchBtn) {
    closeSearchBtn.addEventListener('click', () => {
      searchModal.classList.remove('active');
    });
  }

  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
      searchModal.classList.remove('active');
    }
  });

  searchInput.addEventListener('input', (e) => {
    renderResults(e.target.value.toLowerCase().trim());
  });

  function renderResults(query) {
    if (!searchResults) return;
    const matches = siteIndex.filter(item => {
      return item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query);
    });

    if (matches.length === 0) {
      searchResults.innerHTML = `<p style="padding: 1.5rem; color: #64748b; text-align: center;">Nenhum resultado encontrado para "${query}".</p>`;
      return;
    }

    searchResults.innerHTML = matches.map(item => `
      <a href="${item.anchor}" class="search-result-item" style="display: block; padding: 1rem 1.25rem; border-bottom: 1px solid #e2e8f0; text-decoration: none;">
        <strong style="color: #0a1128; font-size: 1rem; display: block; font-family: 'Cinzel', serif;">${item.title}</strong>
        <span style="color: #64748b; font-size: 0.86rem; display: block; margin-top: 2px;">${item.desc}</span>
      </a>
    `).join('');

    searchResults.querySelectorAll('.search-result-item').forEach(link => {
      link.addEventListener('click', () => {
        searchModal.classList.remove('active');
      });
    });
  }
}

/* ==========================================================================
   8. SISTEMA DE NOTIFICAÇÃO TOAST
   ========================================================================== */
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ==========================================================================
   9. VÍDEO HISTÓRICO DA IGREJA ("COMO TUDO COMEÇOU")
   ========================================================================== */
function initHistoryVideo() {
  const playerContainer = document.getElementById('church-history-player');
  const playTrigger = document.getElementById('btn-play-church-history');
  const actionPlayBtn = document.getElementById('btn-play-history-action');
  const thumbImg = document.getElementById('history-thumb-img');

  const youtubeVideoId = 'xFh8gIsuPLg';
  const iframeHtml = `
    <iframe 
      src="https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1" 
      title="O Início - Igreja Tabernáculo de Davi" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen 
      style="width: 100%; height: 100%; border: none; display: block; border-radius: var(--border-radius-md);">
    </iframe>
  `;

  function startVideo() {
    if (!playerContainer) return;
    playerContainer.innerHTML = iframeHtml;
  }

  if (playTrigger) playTrigger.addEventListener('click', startVideo);
  if (thumbImg) thumbImg.addEventListener('click', startVideo);
  if (actionPlayBtn) actionPlayBtn.addEventListener('click', startVideo);
}
