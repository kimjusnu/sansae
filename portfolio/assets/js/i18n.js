/**
 * Language switching — English and Korean.
 *
 * Korean lives in the markup; English lives in the DICT below. That asymmetry
 * is deliberate:
 *
 *   - Crawlers that do not run JS (KakaoTalk, most social previews) read the
 *     raw HTML, so shares stay Korean and keep matching the Korean OG image.
 *   - There is no Korean dictionary to drift out of sync with the markup.
 *     Switching to Korean simply restores what the DOM already said, captured
 *     once at boot.
 *
 * English is the default view, so the very first paint is normally a swap. The
 * inline head script hides the body until this file finishes, with a timer that
 * un-hides it if this file never arrives — a missing translation must never
 * leave a blank page.
 *
 * Contract, all opt-in per element:
 *   data-i18n="key"                       → textContent
 *   data-i18n-html="key"                   → innerHTML
 *   data-i18n-attr="placeholder:key|aria-label:key"  → attributes
 *
 * data-i18n-html writes authored strings from this file and never anything a
 * visitor typed, so there is no injection path. Anything visitor-supplied must
 * keep using data-i18n.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'lang';
  var DEFAULT_LANG = 'en';

  var DICT = {
    en: {
      /* ---------------- document ---------------- */
      'meta.title': 'Junsu Kim · Frontend · AI Engineer Portfolio',
      'meta.description':
        'Portfolio of Junsu Kim, a frontend and AI engineer who has personally owned planning, design, implementation, deployment and operation.',
      'a11y.skip': 'Skip to content',
      'a11y.langGroup': 'Language',

      /* ---------------- intro gate ---------------- */
      'intro.label': 'Enter site',
      'intro.name': 'Junsu Kim',
      'intro.role': 'Frontend · AI Engineer',
      'intro.hint': 'Press the button, or hit ESC to skip',

      /* ---------------- header ---------------- */
      'brand.name': 'Junsu Kim',
      'nav.label': 'Main menu',
      'nav.about': 'Strengths',
      'nav.work': 'Work',
      'nav.process': 'Process',
      'nav.experience': 'Experience',
      'nav.contact': 'Contact',
      'nav.open': 'Open menu',
      'nav.close': 'Close menu',
      'cta.email': 'Send email',
      'cta.resume': 'View resume',

      /* ---------------- hero ---------------- */
      'hero.badge': 'Open to joining a new team',
      'hero.title': 'I observe the problem,<br>then <em>ship the product</em>',
      'hero.lede':
        "I'm Junsu Kim, a frontend and AI engineer who has owned planning, design, implementation, deployment and operation. I find the problems users actually run into and solve them with the web and LLMs.",
      'hero.cta1': 'See the work',
      'hero.cta2': 'Get in touch',
      'hero.meta1': 'Incheon · Seoul',

      /* ---------------- principles ---------------- */
      'principles.title': 'Working principles',
      'principles.1.h': 'I own it end to end',
      'principles.1.p':
        'One person carries it from planning through deployment and operation, so improvement continues without a handoff.',
      'principles.2.h': 'I find problems on site',
      'principles.2.p':
        'I define problems by seeing the real environment. I visited farms, watched how orders actually flowed, then designed the screens.',
      'principles.3.h': 'I verify the improvement',
      'principles.3.p':
        'I read user behaviour with GA4 and Clarity, then check in the numbers whether the change actually helped.',

      /* ---------------- about ---------------- */
      'about.title': 'I can carry a product <em>from end to end</em> on my own',
      'about.lede':
        'I spend less time building a screen than making sure that screen actually gets used.',
      'about.1.h': 'End-to-end ownership',
      'about.1.p':
        'Planning → design → implementation → deployment → operation. I take every step until the idea reaches the user.',
      'about.2.h': 'Full-stack execution',
      'about.2.p':
        "From the frontend through a FastAPI backend to Docker and CI/CD. I don't hand the blocked part to someone else.",
      'about.3.h': 'Problems defined on the ground',
      'about.3.p':
        'I observe where the product is used and read behavioural data, so I define the real problem behind the request.',
      'about.4.h': 'AI built into the product',
      'about.4.p':
        'I integrate LLMs and SAM2 into real screen flows. On My Feed I cut the AI classification error rate from 10% to 3%.',

      /* ---------------- work ---------------- */
      'work.title': 'Things I built and <em>shipped</em>',
      'work.lede': 'Real, running projects — every demo link is live.',
      'work.open': 'Open site',
      'work.1.tag': 'Open source · team of 4',
      'work.1.p':
        'An open-source design system of 30+ components published to npm. Built by a team of four, where his part was designing and building the UI components, alongside Storybook docs and a Rollup build. 2nd place at the Woongjin ThinkBig x Udemy bootcamp.',
      'work.2.tag': 'SaaS',
      'work.2.p':
        'A SaaS for authoring, reviewing and managing quizzes. I designed the modular editor and the review workflow, and built zero-downtime deployment on Docker.',
      'work.3.tag': 'Capstone · team of 3',
      'work.3.p':
        'A PWA that logs meals by analysing food photos with AI. A team of three, where his part was planning, the frontend and presenting; built as a PWA rather than a native app, with web push for a native-feeling experience. Excellence Award at the Korea Engineering Exhibition.',
      'work.3.link': 'Exhibition page',
      'work.4.tag': 'Migration · team lead',
      'work.4.p':
        'Moved a real company\'s Vue service, which search engines struggled with, onto Next.js, redesigning server rendering and the metadata structure. He led the team on schedule and UI, and it won an Excellence Award at the Sniper Factory bootcamp.',

      /* ---------------- process ---------------- */
      'process.title': 'How I <em>work</em>',
      'process.lede':
        'Four steps, one loop. I check the numbers, then start again at step one.',
      'process.1.h': 'Define',
      'process.1.p':
        'I look at the site of use and the data together, and narrow down what actually needs solving.',
      'process.2.h': 'Design',
      'process.2.p':
        'Screen flow, data structure and permission scope all get drawn in the same place.',
      'process.3.h': 'Build',
      'process.3.p':
        'Frontend, API and deployment pipeline get built and automated as one continuous piece.',
      'process.4.h': 'Operate',
      'process.4.p': 'I read real usage metrics and decide what to fix next.',

      /* ---------------- experience ---------------- */
      'exp.title': 'The path <em>so far</em>',
      'exp.1.when': '2025.07 — Present',
      'exp.1.role': 'Associate (full-time) · SaaS planning · Frontend · AI integration',
      'exp.1.a':
        'My Feed: digitised farm orders scattered across paper ledgers and KakaoTalk, and brought in SAM2 to cut the AI classification error rate from 10% to 3%.',
      'exp.1.b':
        'Measured user behaviour with GA4 and Clarity to prioritise UX improvements.',
      'exp.1.c':
        'Website rebuild: took enquiries from none at all to 4 calls and 5 online a month, and helped close a real contract.',
      'exp.1.d':
        'Designed a three-tier RBAC dashboard and set up GitHub Actions CI/CD.',
      'exp.2.role': 'Intern · Technical research',
      'exp.2.a':
        'Implemented the modular editor and review workflow for the StartupQT quiz-authoring SaaS.',
      'exp.2.b': 'Built the GitHub Actions, Docker and PM2 pipeline single-handedly, with an Nginx reverse proxy and HTTPS.',
      'exp.3.school': 'Tech University of Korea',
      'exp.3.role':
        'B.S. Computer Engineering, Software major · GPA 3.45 / 4.5 (major 3.54)',
      'skills.title': 'Core skills',
      'skills.llm': 'LLM integration',
      'skills.data': 'Data · Other',
      'cred.title': 'Awards · Certifications',
      'cred.1': 'Korea Engineering Exhibition, Excellence Award — Eat Fit',
      'cred.2': 'Sniper Factory Bootcamp, Excellence Award — Wairi, team lead',
      'cred.3': 'Woongjin ThinkBig × Udemy Bootcamp, 2nd place — Componique',
      'cred.ga4': 'GA4 Certification',

      /* ---------------- final CTA ---------------- */
      'final.title': 'Looking for a problem to solve together',
      'final.p':
        "If you need someone to own a product from start to finish, please get in touch. I'll send my resume and detailed case studies by email.",
      'final.github': 'View GitHub',

      /* ---------------- chat ---------------- */
      'chat.toggle': 'Ask the AI',
      'chat.panelLabel': 'AI assistant',
      'chat.title': 'Portfolio assistant',
      'chat.sub': 'Answers about my experience and projects',
      'chat.close': 'Close',
      'chat.s1': 'What projects have you built?',
      'chat.s2': 'What is your main tech stack?',
      'chat.s3': 'What did you do at AimBe Lab?',
      'chat.inputLabel': 'Enter your question',
      'chat.placeholder': 'Ask me anything',
      'chat.send': 'Send',
      'chat.disclaimer':
        'The AI answers from resume data. Conversations are not stored — please confirm anything important by email.',
      'chat.greeting':
        "Hello. I answer questions about Junsu Kim's experience and projects. What would you like to know?",
      'chat.errRate':
        'Questions are coming in a bit fast. Please try again shortly, or email —',
      'chat.errGeneric': "Couldn't fetch an answer. Please email —",

      /* ---------------- footer ---------------- */
      'footer.tagline':
        'A frontend and AI engineer who observes problems and turns them into shipped products.',
      'footer.label': 'Footer menu',
      'footer.explore': 'Explore',
      'footer.contact': 'Contact',
      'footer.resume': 'Resume',
      'footer.prev': 'Previous portfolio',
      'footer.blog': 'Tech blog',
      'footer.bottom': '© 2026 Junsu Kim. Designed & built by Junsu Kim.',
    },

    /* Korean normally comes from the markup. These are the exceptions: strings
       that only ever exist in JavaScript, so there is no DOM node to read. */
    ko: {
      'nav.open': '메뉴 열기',
      'nav.close': '메뉴 닫기',
      'chat.greeting':
        '안녕하세요. 김준수의 이력과 프로젝트에 대해 답해드립니다. 무엇이 궁금하신가요?',
      'chat.errRate': '질문이 잠시 몰렸습니다. 조금 뒤에 다시 시도하시거나 메일로 문의해 주세요 —',
      'chat.errGeneric': '답변을 가져오지 못했습니다. 메일로 문의해 주세요 —',
    },
  };

  // A page can add its own strings by defining window.i18nStrings in a script
  // loaded before this one. The resume does that rather than growing DICT with
  // keys the home page would carry and never use.
  if (window.i18nStrings) {
    Object.keys(window.i18nStrings).forEach(function (lang) {
      var extra = window.i18nStrings[lang];
      DICT[lang] = DICT[lang] || {};
      Object.keys(extra).forEach(function (key) {
        DICT[lang][key] = extra[key];
      });
    });
  }

  var root = document.documentElement;

  /* ----------------------------------------------------------
     Korean originals, captured straight from the markup
     ---------------------------------------------------------- */
  var ko = { text: {}, html: {}, attr: {} };

  function capture() {
    ko.text['meta.title'] = document.title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc) ko.text['meta.description'] = desc.getAttribute('content');

    each('[data-i18n]', function (el) {
      ko.text[el.getAttribute('data-i18n')] = el.textContent;
    });
    each('[data-i18n-html]', function (el) {
      ko.html[el.getAttribute('data-i18n-html')] = el.innerHTML;
    });
    each('[data-i18n-attr]', function (el) {
      parseAttrSpec(el).forEach(function (pair) {
        ko.attr[pair.key] = el.getAttribute(pair.attr);
      });
    });
  }

  function each(selector, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), fn);
  }

  /** "placeholder:chat.placeholder|aria-label:chat.send" → [{attr, key}, …] */
  function parseAttrSpec(el) {
    return el
      .getAttribute('data-i18n-attr')
      .split('|')
      .map(function (part) {
        var i = part.indexOf(':');
        return { attr: part.slice(0, i).trim(), key: part.slice(i + 1).trim() };
      })
      .filter(function (pair) {
        return pair.attr && pair.key;
      });
  }

  /* ----------------------------------------------------------
     Applying a language
     ---------------------------------------------------------- */
  function lookup(lang, kind, key) {
    // What the markup said always wins for Korean; DICT.ko only fills the gaps
    // for strings that never appear in the DOM.
    if (lang === 'ko' && ko[kind][key] !== undefined) return ko[kind][key];
    var dict = DICT[lang];
    return dict ? dict[key] : undefined;
  }

  function apply(lang) {
    var desc = document.querySelector('meta[name="description"]');
    var title = lookup(lang, 'text', 'meta.title');
    var description = lookup(lang, 'text', 'meta.description');
    if (title) document.title = title;
    if (desc && description) desc.setAttribute('content', description);

    each('[data-i18n]', function (el) {
      var value = lookup(lang, 'text', el.getAttribute('data-i18n'));
      if (value !== undefined) el.textContent = value;
    });

    each('[data-i18n-html]', function (el) {
      var value = lookup(lang, 'html', el.getAttribute('data-i18n-html'));
      if (value !== undefined) el.innerHTML = value;
    });

    each('[data-i18n-attr]', function (el) {
      parseAttrSpec(el).forEach(function (pair) {
        var value = lookup(lang, 'attr', pair.key);
        if (value !== undefined) el.setAttribute(pair.attr, value);
      });
    });

    root.lang = lang;
    root.setAttribute('data-lang', lang);

    each('[data-lang-set]', function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang-set') === lang));
    });
  }

  /* ----------------------------------------------------------
     Public surface — other scripts read strings through this
     ---------------------------------------------------------- */
  var current = DEFAULT_LANG;
  var listeners = [];

  var api = {
    get lang() {
      return current;
    },
    /** Localised string for a key; falls back to the Korean markup, then the key. */
    t: function (key) {
      var value = lookup(current, 'text', key);
      if (value === undefined) value = ko.text[key];
      if (value === undefined) value = ko.attr[key];
      return value === undefined ? key : value;
    },
    /** Runs fn now and again after every switch, so callers stay in sync. */
    onChange: function (fn) {
      listeners.push(fn);
      fn(current);
    },
    set: function (lang) {
      if (lang !== 'ko' && lang !== 'en') return;
      if (lang === current) return;
      current = lang;
      try {
        window.localStorage.setItem(STORAGE_KEY, lang);
      } catch (e) {
        /* private mode — the choice just will not persist */
      }
      apply(lang);
      listeners.forEach(function (fn) {
        fn(lang);
      });
    },
  };

  window.i18n = api;

  /* ----------------------------------------------------------
     Boot
     ---------------------------------------------------------- */
  function preferred() {
    var match = window.location.search.match(/[?&]lang=(en|ko)/);
    if (match) return match[1];
    try {
      var stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'ko') return stored;
    } catch (e) {
      /* storage blocked — fall through to the default */
    }
    return DEFAULT_LANG;
  }

  function init() {
    capture();
    current = preferred();
    apply(current);
    // The body was hidden by the inline head script to keep the swap off-screen.
    root.classList.remove('i18n-pending');

    each('[data-lang-set]', function (btn) {
      btn.addEventListener('click', function () {
        api.set(btn.getAttribute('data-lang-set'));
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
