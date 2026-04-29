# MVP Roadmap - DI Promptų Biblioteka

> Statusas: Historical / Deprecated (neaktyvus roadmap failas).  
> Dabartinis scope ir release seka valdoma per `CHANGELOG.md`, `DEPLOYMENT.md` ir `docs/DOCUMENTATION.md`.

**Projekto data:** 2026-02-03  
**MVP tikslas:** Parengti stabilų, saugų ir pilnai funkcionalų produktą, kurį galima naudoti production aplinkoje

---

## 📊 Esamos Funkcijos (Current State)

### ✅ Jau Implementuota
- [x] 8 specializuoti promptai organizacijos analizei
- [x] Interaktyvus dizainas su kopijavimo funkcija
- [x] Responsive dizainas (mobile, tablet, desktop)
- [x] Kontaktų rinkimo forma su Google Sheets integracija
- [x] Accessibility palaikymas (ARIA, keyboard navigation)
- [x] Error handling ir fallback mechanizmai
- [x] Dokumentacija (README.md, INTEGRACIJA.md, VARIANTU_PALYGINIMAS.md)
- [x] Cursor rules (.cursorrules)

### ⚠️ Reikia Patobulinti
- [ ] Google Script URL setup (dabar placeholder)
- [ ] CAPTCHA integracija (rekomenduojama)
- [ ] Rate limiting (spam apsauga)
- [ ] Analytics integracija (optional)
- [ ] Testavimas (unit tests, integration tests)
- [ ] Production deployment
- [ ] GDPR compliance patikra

---

## 🎯 MVP Tikslai (MVP Goals)

### Must Have (P0) - Kritinės funkcijos
1. **Saugumas ir konfidencialumas**
   - CAPTCHA integracija kontaktų formai
   - Rate limiting apsauga
   - GDPR compliance patikra ir dokumentacija

2. **Stabilumas ir patikimumas**
   - Visų funkcijų testavimas
   - Error handling patobulinimai
   - Browser compatibility testai

3. **Deployment ir konfigūracija**
   - Production-ready konfigūracija
   - Deployment instrukcijos
   - Environment setup dokumentacija

### Should Have (P1) - Svarbios funkcijos
4. **Vartotojo patirtis**
   - Loading states patobulinimai
   - Error messages patobulinimai
   - Performance optimizacija

5. **Dokumentacija**
   - Deployment guide
   - Troubleshooting guide
   - Security best practices dokumentacija

### Nice to Have (P2) - Pageidautinos funkcijos
6. **Analytics ir monitoring**
   - Basic analytics (pvz., Google Analytics)
   - Error tracking (optional)

7. **Papildomos funkcijos**
   - Promptų paieška/filtravimas
   - Promptų eksportavimas (PDF, TXT)
   - Dark mode (optional)

---

## 📅 Laiko Planas (Timeline)

### Faza 1: Saugumas ir Stabilumas (2026-02-03 - 2026-02-10)
**Trukmė:** 1 savaitė  
**Prioritetas:** P0 - Must Have

#### Sprint 1.1: CAPTCHA ir Rate Limiting (2026-02-03 - 2026-02-05)
- [ ] Google reCAPTCHA v3 integracija
- [ ] Rate limiting implementacija (client-side + server-side)
- [ ] CAPTCHA testavimas
- [ ] Dokumentacija atnaujinimas

**Deliverables:**
- CAPTCHA integruota kontaktų formoje
- Rate limiting veikia
- Testavimo rezultatai

#### Sprint 1.2: Error Handling ir Testing (2026-02-06 - 2026-02-08)
- [ ] Error handling patobulinimai
- [ ] Unit testai kritinėms funkcijoms
- [ ] Integration testai (form submission, copy functionality)
- [ ] Browser compatibility testai

**Deliverables:**
- Testų suite
- Testavimo dokumentacija
- Browser compatibility report

#### Sprint 1.3: GDPR Compliance (2026-02-09 - 2026-02-10)
- [ ] GDPR compliance patikra
- [ ] Privatumo politikos tekstas
- [ ] Cookie consent (jei reikia)
- [ ] Duomenų apsaugos dokumentacija

**Deliverables:**
- GDPR compliance dokumentas
- Privatumo politikos tekstas
- Atnaujinta dokumentacija

---

### Faza 2: Deployment ir Konfigūracija (2026-02-11 - 2026-02-17)
**Trukmė:** 1 savaitė  
**Prioritetas:** P0 - Must Have

#### Sprint 2.1: Production Konfigūracija (2026-02-11 - 2026-02-13)
- [ ] Environment variables setup
- [ ] Google Script URL konfigūracija
- [ ] Production build procesas (jei reikia)
- [ ] Configuration management

**Deliverables:**
- Production-ready konfigūracija
- Environment setup dokumentacija
- Configuration guide

#### Sprint 2.2: Deployment (2026-02-14 - 2026-02-16)
- [ ] Deployment platform pasirinkimas (GitHub Pages, Netlify, Vercel)
- [ ] Deployment automation
- [ ] CI/CD setup (optional)
- [ ] Deployment testavimas

**Deliverables:**
- Deployed aplikacija
- Deployment instrukcijos
- Monitoring setup

#### Sprint 2.3: Dokumentacija ir Finalizacija (2026-02-17)
- [ ] Deployment guide
- [ ] Troubleshooting guide
- [ ] Security best practices
- [ ] Final testing

**Deliverables:**
- Pilna dokumentacija
- Production-ready aplikacija

---

### Faza 3: UX Patobulinimai (2026-02-18 - 2026-02-24)
**Trukmė:** 1 savaitė  
**Prioritetas:** P1 - Should Have

#### Sprint 3.1: Performance ir UX (2026-02-18 - 2026-02-21)
- [ ] Performance optimizacija
- [ ] Loading states patobulinimai
- [ ] Error messages patobulinimai
- [ ] User feedback patobulinimai

**Deliverables:**
- Optimizuotas kodas
- Patobulinta UX
- Performance metrics

#### Sprint 3.2: Papildoma Dokumentacija (2026-02-22 - 2026-02-24)
- [ ] User guide
- [ ] FAQ sekcija
- [ ] Video tutorial (optional)
- [ ] Best practices guide

**Deliverables:**
- User documentation
- FAQ
- Tutorial material

---

### Faza 4: Papildomos Funkcijos (2026-02-25 - 2026-03-03)
**Trukmė:** 1 savaitė  
**Prioritetas:** P2 - Nice to Have

#### Sprint 4.1: Analytics ir Monitoring (2026-02-25 - 2026-02-27)
- [ ] Google Analytics integracija (optional)
- [ ] Error tracking setup (optional)
- [ ] Usage analytics

**Deliverables:**
- Analytics setup
- Monitoring dashboard

#### Sprint 4.2: Papildomos Funkcijos (2026-02-28 - 2026-03-03)
- [ ] Promptų paieška/filtravimas
- [ ] Promptų eksportavimas (PDF, TXT)
- [ ] Dark mode (optional)

**Deliverables:**
- Papildomos funkcijos
- Feature documentation

---

## 🎯 Milestones

### Milestone 1: Saugumas Užtikrintas (2026-02-10)
**Kriterijai:**
- ✅ CAPTCHA integruota ir veikia
- ✅ Rate limiting implementuotas
- ✅ GDPR compliance patvirtintas
- ✅ Error handling patobulintas

**Deliverables:**
- Saugus ir patikimas kodas
- GDPR compliance dokumentacija

---

### Milestone 2: Production Ready (2026-02-17)
**Kriterijai:**
- ✅ Visi testai praeina
- ✅ Deployment sukurtas
- ✅ Dokumentacija pilna
- ✅ Konfigūracija production-ready

**Deliverables:**
- Deployed aplikacija
- Deployment dokumentacija
- Production konfigūracija

---

### Milestone 3: MVP Complete (2026-02-24)
**Kriterijai:**
- ✅ Visos P0 funkcijos implementuotos
- ✅ Visos P1 funkcijos implementuotos
- ✅ Dokumentacija pilna
- ✅ User testing atliktas

**Deliverables:**
- Pilnai funkcionalus MVP
- User documentation
- Performance metrics

---

## 📊 Funkcijų Prioriteto Matrica

| Funkcija | Prioritetas | Faza | Sąmata | Rizika |
|----------|------------|------|--------|--------|
| CAPTCHA integracija | P0 | 1 | 2d | Žema |
| Rate limiting | P0 | 1 | 1d | Žema |
| GDPR compliance | P0 | 1 | 2d | Vidutinė |
| Error handling | P0 | 1 | 2d | Žema |
| Testing | P0 | 1 | 3d | Vidutinė |
| Production config | P0 | 2 | 2d | Žema |
| Deployment | P0 | 2 | 2d | Vidutinė |
| Dokumentacija | P0 | 2 | 2d | Žema |
| Performance UX | P1 | 3 | 3d | Žema |
| Analytics | P2 | 4 | 2d | Žema |
| Papildomos funkcijos | P2 | 4 | 5d | Vidutinė |

**Sąmata:** d = dienos

---

## ⚠️ Rizikos Valdymas

### Aukštos Rizikos Sritis
1. **Google Apps Script Integracija**
   - **Rizika:** CORS arba permission problemos
   - **Mitigacija:** Testuoti anksti, turėti fallback variantus
   - **Planas:** Testuoti su skirtingomis konfigūracijomis

2. **GDPR Compliance**
   - **Rizika:** Neatitikimas reikalavimams
   - **Mitigacija:** Konsultuotis su teisininkais, naudoti templates
   - **Planas:** Patikrinti su GDPR specialistu

### Vidutinės Rizikos Sritis
3. **Browser Compatibility**
   - **Rizika:** Neveikia senesnėse naršyklėse
   - **Mitigacija:** Testuoti visose pagrindinėse naršyklėse
   - **Planas:** Browser testing suite

4. **Deployment**
   - **Rizika:** Deployment problemos
   - **Mitigacija:** Testuoti local, turėti rollback planą
   - **Planas:** Staged deployment

### Žemos Rizikos Sritis
5. **Performance**
   - **Rizika:** Lėtas veikimas
   - **Mitigacija:** Performance testing, optimizacija
   - **Planas:** Performance monitoring

---

## 📋 Task Breakdown - Detali Sąrašas

### Faza 1: Saugumas ir Stabilumas

#### Task 1.1.1: Google reCAPTCHA v3 Integracija
- [ ] Pridėti reCAPTCHA script į HTML
- [ ] Implementuoti reCAPTCHA token gavimą
- [ ] Siųsti token su form submission
- [ ] Validuoti token serverio pusėje (Google Apps Script)
- [ ] Testuoti su skirtingais scenarijais
- [ ] Dokumentuoti naudojimą

**Sąmata:** 1 diena  
**Priklausomybės:** Nėra

---

#### Task 1.1.2: Rate Limiting Implementacija
- [ ] Client-side rate limiting (localStorage)
- [ ] Server-side rate limiting (Google Apps Script)
- [ ] Error handling rate limit pasiekus
- [ ] User feedback rate limit pasiekus
- [ ] Testuoti rate limiting
- [ ] Dokumentuoti konfigūraciją

**Sąmata:** 1 diena  
**Priklausomybės:** Nėra

---

#### Task 1.2.1: Unit Testai
- [ ] Setup testų framework (Jest arba Mocha)
- [ ] Testai kopijavimo funkcijai
- [ ] Testai email validacijai
- [ ] Testai form submission
- [ ] Testai error handling
- [ ] CI/CD integracija (optional)

**Sąmata:** 2 dienos  
**Priklausomybės:** Nėra

---

#### Task 1.2.2: Integration Testai
- [ ] Testai Google Apps Script integracijai
- [ ] Testai form submission flow
- [ ] Testai error scenarijams
- [ ] Browser compatibility testai
- [ ] Mobile device testai

**Sąmata:** 1 diena  
**Priklausomybės:** Task 1.2.1

---

#### Task 1.3.1: GDPR Compliance
- [ ] Privatumo politikos tekstas
- [ ] Cookie consent (jei reikia)
- [ ] Duomenų apsaugos dokumentacija
- [ ] User consent mechanism
- [ ] Data retention policy
- [ ] Right to deletion implementation

**Sąmata:** 2 dienos  
**Priklausomybės:** Nėra

---

### Faza 2: Deployment ir Konfigūracija

#### Task 2.1.1: Environment Configuration
- [ ] Sukurti config.js failą
- [ ] Environment variables setup
- [ ] Google Script URL konfigūracija
- [ ] Development vs Production config
- [ ] Configuration validation
- [ ] Dokumentacija

**Sąmata:** 1 diena  
**Priklausomybės:** Nėra

---

#### Task 2.2.1: Deployment Setup
- [ ] Pasirinkti deployment platform (GitHub Pages/Netlify/Vercel)
- [ ] Sukurti deployment script
- [ ] CI/CD pipeline (optional)
- [ ] Environment variables setup deployment
- [ ] Testuoti deployment procesą
- [ ] Dokumentuoti deployment

**Sąmata:** 2 dienos  
**Priklausomybės:** Task 2.1.1

---

#### Task 2.3.1: Dokumentacija
- [ ] Deployment guide
- [ ] Troubleshooting guide
- [ ] Security best practices
- [ ] Configuration guide
- [ ] FAQ sekcija

**Sąmata:** 1 diena  
**Priklausomybės:** Task 2.2.1

---

### Faza 3: UX Patobulinimai

#### Task 3.1.1: Performance Optimizacija
- [ ] CSS optimizacija
- [ ] JavaScript optimizacija
- [ ] Image optimization (jei yra)
- [ ] Lazy loading (jei reikia)
- [ ] Performance testing
- [ ] Performance metrics

**Sąmata:** 2 dienos  
**Priklausomybės:** Nėra

---

#### Task 3.1.2: UX Patobulinimai
- [ ] Loading states patobulinimai
- [ ] Error messages patobulinimai
- [ ] Success messages patobulinimai
- [ ] User feedback patobulinimai
- [ ] Accessibility patobulinimai
- [ ] User testing

**Sąmata:** 1 diena  
**Priklausomybės:** Nėra

---

## 📈 Sėkmės Metrikos (Success Metrics)

### Techninės Metrikos
- ✅ Visi testai praeina (100% pass rate)
- ✅ Browser compatibility: Chrome, Firefox, Safari, Edge
- ✅ Mobile compatibility: iOS Safari, Chrome Mobile
- ✅ Performance: Page load < 2s
- ✅ Accessibility: WCAG AA compliance

### Verslo Metrikos
- ✅ Form submission success rate > 95%
- ✅ User error rate < 5%
- ✅ CAPTCHA pass rate > 90%
- ✅ Zero security incidents

### Dokumentacijos Metrikos
- ✅ Visi dokumentai atnaujinti
- ✅ Deployment guide sukurtas
- ✅ Troubleshooting guide sukurtas
- ✅ User documentation pilna

---

## 🔄 Iteracijos ir Atnaujinimai

### Weekly Review
- Kiekvieną penktadienį: Progress review
- Task completion rate
- Rizikos valdymas
- Planavimo koregavimai

### Sprint Retrospective
- Kas pavyko gerai?
- Kas galėtų būti geriau?
- Ką pakeisti kitame sprinte?

---

## 📞 Komunikacija ir Koordinacija

### Daily Standup (jei komanda)
- Ką darėte vakar?
- Ką darote šiandien?
- Ar yra kliūčių?

### Weekly Planning
- Sprint planning
- Task assignment
- Prioritetų nustatymas

---

## ✅ Definition of Done (DoD)

Kiekvienas task laikomas baigtu, kai:
- [ ] Kodas parašytas ir veikia
- [ ] Testai parašyti ir praeina
- [ ] Code review atliktas (jei komanda)
- [ ] Dokumentacija atnaujinta
- [ ] Browser compatibility patikrinta
- [ ] Accessibility patikrinta
- [ ] Security patikrinta
- [ ] Commit pranešimas aiškus

---

## 🎉 MVP Launch Checklist

Prieš MVP launch, patikrinkite:
- [ ] Visi P0 taskai baigti
- [ ] Visi testai praeina
- [ ] Dokumentacija pilna
- [ ] Deployment veikia
- [ ] Security audit atliktas
- [ ] GDPR compliance patvirtintas
- [ ] Performance optimizuotas
- [ ] Browser compatibility patikrinta
- [ ] User testing atliktas
- [ ] Monitoring setup

---

**Paskutinis atnaujinimas:** 2026-02-03  
**Roadmap versija:** 1.0  
**Projekto statusas:** In Progress
