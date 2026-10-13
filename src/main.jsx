import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Compass, Heart, Leaf, Menu, Sprout, X } from 'lucide-react';
import './styles.css';

const categories = [
  { no: '01', title: 'Enterprise & innovation', text: 'For women creating livelihoods, businesses and new possibilities.' },
  { no: '02', title: 'Land & livelihood', text: 'For those growing food, stewarding nature and sustaining rural life.' },
  { no: '03', title: 'Culture & craft', text: 'For the makers and keepers carrying knowledge into the future.' },
  { no: '04', title: 'Community & care', text: 'For leaders bringing people together and making everyday life better.' },
  { no: '05', title: 'Emerging leader', text: 'For a young changemaker already shaping what comes next.' },
  { no: '06', title: 'Lifetime contribution', text: 'For a remarkable journey whose impact spans generations.' },
];
const roles = ['Shakti Ambassador', 'Community Scout', 'Mentor', 'Volunteer', 'Incubation Partner', 'Buyer', 'Institutional Collaborator', 'Sponsor / CSR Partner'];
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ztpzadsxtngbxespsmbq.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_dk5opXVq293wA2R8f-atCg_BfvovyTl';
const faqs = [
  ['Who can be nominated?', 'A woman whose work is creating positive change in Kodagu. Nominees may be entrepreneurs, farmers, artisans, community leaders, or emerging changemakers.'],
  ['Can I nominate myself?', 'Yes. Women may nominate themselves, or be nominated by someone who knows their work. We will ask for the nominee’s consent before a nomination is reviewed.'],
  ['Is there a fee to nominate?', 'No. The Shakti Awards nomination process is free. We will never ask nominees to pay to be considered.'],
  ['What happens after I submit?', 'The Shakti team will review each submission and may contact the nominator or nominee for more information. A submission receipt is shown only after secure database confirmation.'],
  ['Where does Shakti operate?', 'Phase 1 focuses on Kodagu, Karnataka. Shakti Awards is an independent women’s enterprise and impact platform. GGA is one of its programmes.'],
];

function App() {
  const [dialog, setDialog] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function openFlow(kind) {
    setDialog(kind); setForm({}); setResult(null); setError(''); setMobileOpen(false);
  }
  function setField(e) { setForm((prev) => ({ ...prev, [e.target.name]: e.target.value })); }
  async function submit(e) {
    e.preventDefault(); setError('');
    const endpoint = `${SUPABASE_URL}/functions/v1/submit`;
    setBusy(true);
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SUPABASE_PUBLISHABLE_KEY }, body: JSON.stringify({ ...form, type: dialog, source: 'shakti-website', consent: true }) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body.submissionId) throw new Error(body.message || 'We could not securely save your submission. Please try again.');
      setResult(body.submissionId);
    } catch (err) { setError(err.message || 'We could not connect securely. Please try again later.'); }
    finally { setBusy(false); }
  }

  const close = () => setDialog(null);
  return <>
    <header className="nav-wrap">
      <a className="brand" href="#top" aria-label="Shakti Awards home"><img src="/shakti-logo.jpg" alt="" /><span>SHAKTI<small>AWARDS</small></span></a>
      <nav className={mobileOpen ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
        <a href="#vision" onClick={() => setMobileOpen(false)}>Our vision</a><a href="#awards" onClick={() => setMobileOpen(false)}>The awards</a><a href="#journey" onClick={() => setMobileOpen(false)}>Our approach</a><a href="#community" onClick={() => setMobileOpen(false)}>Get involved</a>
      </nav>
      <button className="nav-cta" onClick={() => openFlow('nomination')}>Nominate <ArrowUpRight size={15}/></button>
      <button className="menu-btn" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X/> : <Menu/>}</button>
    </header>

    <main id="top">
      <section className="hero">
        <div className="hero-photo" aria-hidden="true"></div><div className="hero-grain" aria-hidden="true"></div>
        <div className="hero-content">
          <div className="eyebrow hero-eyebrow"><span className="gold-dot"></span> ROOTED IN KODAGU · OPEN TO THE POSSIBLE</div>
          <h1>Real Women.<br/>Remarkable Journeys.<br/><em>A Greater Tomorrow.</em></h1>
          <p className="hero-copy">A platform for the women shaping enterprise, community and a more hopeful future.</p>
          <div className="hero-actions"><button className="button button-gold" onClick={() => openFlow('nomination')}>Nominate an inspiring woman <ArrowRight size={16}/></button><a className="button button-ghost" href="#community">Join the Shakti movement</a></div>
          <button className="partner-link" onClick={() => openFlow('role')}><span>Partner with Shakti</span><ArrowUpRight size={14}/></button>
        </div>
        <div className="hero-caption"><span>01 / 04</span><i></i><span>WOMEN · ENTERPRISE · IMPACT</span></div>
        <a className="scroll-cue" href="#vision" aria-label="Scroll to our vision"><ArrowDown size={16}/></a>
        <div className="hero-side-note">KODAGU&nbsp; · &nbsp;KARNATAKA&nbsp; · &nbsp;INDIA</div>
      </section>

      <section className="intro section" id="vision"><div className="intro-left reveal"><span className="eyebrow">A DIFFERENT KIND OF RECOGNITION</span><h2>Every remarkable<br/>journey <em>begins</em><br/>somewhere.</h2></div><div className="intro-right reveal"><p className="lead">In Kodagu, women are building businesses, tending the land, preserving culture and strengthening communities every day.</p><p>Shakti Awards is an independent women’s enterprise and impact platform that brings those journeys into view—and helps them grow. Our first chapter begins here, in the hills of Karnataka.</p><a className="text-link" href="#journey">Discover the Shakti approach <ArrowRight size={15}/></a></div><span className="intro-index">KODAGU, INDIA <b>12°25′ N · 75°44′ E</b></span></section>

      <section className="story-band"><div className="story-image" role="img" aria-label="Women shaping a brighter future together"></div><div className="story-overlay"></div><div className="story-content reveal"><span className="eyebrow">NOT JUST A MOMENT. A MOVEMENT.</span><h2>She grows food.<br/>She builds futures.<br/><em>She moves us all.</em></h2><p>Recognising a woman’s work is only the beginning. The right connection, capability and opportunity can help it reach further.</p><a href="#pillars" className="button button-outline">What we believe <ArrowRight size={15}/></a></div><span className="story-credit">KODAGU · PEOPLE AND PLACE</span></section>

      <section className="awards section" id="awards"><div className="section-heading reveal"><div><span className="eyebrow">THE SHAKTI AWARDS</span><h2>Many paths.<br/><em>One brighter future.</em></h2></div><p>Honouring the women who are already shaping what tomorrow can be.</p></div><div className="category-grid">{categories.map((c, i) => <article className="category-card reveal" style={{'--delay': `${i * 70}ms`}} key={c.no}><span className="category-no">{c.no}</span><span className="category-icon">{i === 1 ? <Sprout/> : i === 3 ? <Heart/> : i === 2 ? <Leaf/> : <Compass/>}</span><h3>{c.title}</h3><p>{c.text}</p><button aria-label={`Nominate for ${c.title}`} onClick={() => openFlow('nomination')}><ArrowUpRight size={17}/></button></article>)}</div><p className="placeholder-note">Award categories shown for planning purposes and subject to confirmation.</p></section>

      <section className="journey" id="journey"><div className="journey-head reveal"><span className="eyebrow">BEYOND THE SPOTLIGHT</span><h2>A journey that <em>keeps going.</em></h2><p>Thoughtfully discovered. Carefully considered. Built for lasting momentum.</p></div><div className="journey-steps">{[['01','Discover','We listen for the stories and ideas that deserve to be seen.'],['02','Assess','A thoughtful, transparent review honours the work and its context.'],['03','Recognise','A moment of recognition brings a woman’s journey into view.'],['04','Accelerate','Connections, mentorship and opportunity help her take the next step.'],['05','Grow','Progress is followed over time, so impact can continue to compound.']].map((s,i)=><div className="journey-step reveal" style={{'--delay': `${i*80}ms`}} key={s[0]}><span>{s[0]}</span><div className="step-line"></div><h3>{s[1]}</h3><p>{s[2]}</p></div>)}</div></section>

      <section className="pillars section" id="pillars"><div className="pillars-heading reveal"><span className="eyebrow">WHAT LASTING IMPACT LOOKS LIKE</span><h2>Success ripples <em>outward.</em></h2></div><div className="pillar-grid">{[['01','Stronger communities','Women’s leadership opens doors for others.'],['02','Resilient livelihoods','Enterprise creates possibility close to home.'],['03','Living heritage','Skills, culture and knowledge move forward.'],['04','A thriving landscape','People and nature grow stronger together.']].map((p,i)=><article className="pillar reveal" style={{'--delay': `${i*90}ms`}} key={p[0]}><span className="pillar-num">{p[0]}</span><div className="pillar-rule"></div><h3>{p[1]}</h3><p>{p[2]}</p></article>)}</div><div className="impact-note"><span>MEASURE WHAT MATTERS</span><p>We are building an approach to understand the stories, opportunities and outcomes behind each journey. Impact measures will be shared when they are verified.</p></div></section>

      <section className="community" id="community"><div className="community-image"></div><div className="community-content reveal"><span className="eyebrow">THERE IS A PLACE FOR YOU HERE</span><h2>Good things grow<br/><em>when we grow together.</em></h2><p>Be a bridge between a woman’s ambition and the opportunity she deserves. Bring your time, experience, network or partnership to Shakti.</p><button className="button button-gold" onClick={() => openFlow('role')}>Find your place in Shakti <ArrowRight size={16}/></button><div className="role-list">{roles.map(r=><button key={r} onClick={() => openFlow('role')}>{r}<ArrowUpRight size={13}/></button>)}</div></div></section>

      <section className="partners section"><div className="partners-intro reveal"><span className="eyebrow">A COLLECTIVE EFFORT</span><h2>For those who<br/><em>believe in what’s possible.</em></h2><p>We welcome thoughtful collaboration from the people and organisations committed to women’s enterprise and community-led progress.</p></div><div className="partner-columns"><article className="partner-item reveal"><span>01 / INCUBATION</span><h3>Help an idea find its next step.</h3><p>Bring capability, networks and practical support closer to women-led enterprises.</p><button onClick={() => openFlow('role')}>Explore partnership <ArrowRight size={14}/></button></article><article className="partner-item reveal"><span>02 / BUYERS & COLLABORATORS</span><h3>Make room for women’s work.</h3><p>Connect with makers, founders and communities whose work deserves a wider audience.</p><button onClick={() => openFlow('role')}>Start a conversation <ArrowRight size={14}/></button></article><article className="partner-item reveal"><span>03 / SPONSORS & CSR</span><h3>Back a future that includes everyone.</h3><p>Support a locally rooted platform for recognition, opportunity and measurable learning.</p><button onClick={() => openFlow('role')}>Partner with Shakti <ArrowRight size={14}/></button></article></div><p className="placeholder-note">No external partners or sponsors are represented as confirmed at this time.</p></section>

      <section className="faq section"><div className="faq-title reveal"><span className="eyebrow">A FEW GOOD QUESTIONS</span><h2>Before we <em>begin.</em></h2><a href="mailto:hello@shaktiawards.oohms.in" className="text-link">Still curious? Get in touch <ArrowRight size={15}/></a></div><div className="faq-list">{faqs.map(([q,a],i)=><div className={`faq-item ${openFaq===i?'active':''}`} key={q}><button onClick={()=>setOpenFaq(openFaq===i?-1:i)} aria-expanded={openFaq===i}><span>{q}</span><ChevronDown size={17}/></button>{openFaq===i&&<p>{a}</p>}</div>)}</div></section>

      <section className="closing"><div className="closing-bg"></div><div className="closing-content reveal"><span className="eyebrow">THE FIRST CHAPTER STARTS HERE</span><h2>Know a woman<br/>who is changing <em>things?</em></h2><p>Tell us her story. Help us see what she sees.</p><button className="button button-gold" onClick={() => openFlow('nomination')}>Nominate an inspiring woman <ArrowRight size={16}/></button></div><span className="closing-mark">S</span></section>
    </main>

    <footer className="footer"><div className="footer-top"><a className="brand footer-brand" href="#top"><img src="/shakti-logo.jpg" alt=""/><span>SHAKTI<small>AWARDS</small></span></a><p>Real women. Remarkable journeys.<br/>A greater tomorrow.</p><div className="footer-nav"><a href="#vision">Our vision</a><a href="#awards">The awards</a><a href="#community">Get involved</a><a href="mailto:hello@shaktiawards.oohms.in">Contact</a></div><button className="back-top" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>BACK TO TOP ↑</button></div><div className="footer-bottom"><span>© {new Date().getFullYear()} SHAKTI AWARDS · KODAGU, INDIA</span><span>AN INDEPENDENT WOMEN’S ENTERPRISE & IMPACT PLATFORM</span><a href="mailto:hello@shaktiawards.oohms.in?subject=Privacy%20enquiry">PRIVACY ENQUIRIES</a></div></footer>

    {dialog && <div className="modal-backdrop" role="presentation" onMouseDown={(e)=>e.target===e.currentTarget&&close()}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title"><button className="modal-close" onClick={close} aria-label="Close form"><X/></button>{result ? <div className="success-state"><span className="success-icon"><Check/></span><span className="eyebrow">SAFELY RECEIVED</span><h2 id="form-title">Thank you for<br/><em>taking the first step.</em></h2><p>Your submission has been securely recorded. Keep this reference for your records:</p><code>{result}</code><button className="button button-gold" onClick={close}>Done <ArrowRight size={15}/></button></div> : <><span className="eyebrow">{dialog==='nomination'?'CELEBRATE HER JOURNEY':'BE PART OF THE MOVEMENT'}</span><h2 id="form-title">{dialog==='nomination'?'Nominate an inspiring woman.':'Let’s grow something good.'}</h2><p className="form-intro">{dialog==='nomination'?'Tell us a little about her and the work she is doing in Kodagu.':'Tell us how you would like to contribute. Our team will be in touch.'}</p><form onSubmit={submit} className="form-grid">
      {dialog==='nomination' ? <><label className="full">Your name<input name="nominatorName" required autoComplete="name" onChange={setField}/></label><label>Your email<input name="nominatorEmail" type="email" required autoComplete="email" onChange={setField}/></label><label>Your phone<input name="nominatorPhone" type="tel" autoComplete="tel" onChange={setField}/></label><label>Woman you are nominating<input name="nomineeName" required onChange={setField}/></label><label>Her village / town<input name="location" required onChange={setField}/></label><label className="full">What makes her journey remarkable?<textarea name="story" required minLength="30" rows="4" onChange={setField} placeholder="Share a little about what she does and the change she is creating…"/></label><label className="full">Category<select name="category" required defaultValue="" onChange={setField}><option value="" disabled>Select a category</option>{categories.map(c=><option key={c.no}>{c.title}</option>)}</select></label><label className="consent full"><input type="checkbox" name="nomineeConsent" required/><span>I have the nominee’s permission to share these details, or I understand Shakti will seek her consent before proceeding.</span></label></> : <><label className="full">I would like to contribute as<select name="role" required defaultValue="" onChange={setField}><option value="" disabled>Select a role</option>{roles.map(r=><option key={r}>{r}</option>)}</select></label><label>Your name<input name="name" required autoComplete="name" onChange={setField}/></label><label>Organisation<input name="organisation" onChange={setField}/></label><label>Your email<input name="email" type="email" required autoComplete="email" onChange={setField}/></label><label>Your phone<input name="phone" type="tel" autoComplete="tel" onChange={setField}/></label><label className="full">A little about how you can help<textarea name="message" rows="3" onChange={setField}/></label><label className="consent full"><input type="checkbox" name="privacyConsent" required/><span>I agree that Shakti may use these details to respond to my enquiry. See our <a href="mailto:hello@shaktiawards.oohms.in?subject=Privacy%20enquiry">privacy enquiry contact</a>.</span></label></>}
      <p className="privacy-note full">Your information is used only to manage this submission and follow up about Shakti Awards. We do not publish nominee details without permission.</p>{error&&<p className="form-error full" role="alert">{error}</p>}<button className="button button-gold full submit-btn" disabled={busy}>{busy?'Submitting securely…':'Submit securely'} <ArrowRight size={15}/></button></form></>}</section></div>}
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
