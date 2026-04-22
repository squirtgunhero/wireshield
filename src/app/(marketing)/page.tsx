import Link from "next/link";

function ShieldIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3Z"/>
    </svg>
  );
}

function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 8 3.5 3.5L13 5"/>
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10m-4-4 4 4-4 4"/>
    </svg>
  );
}

/* ───── Styles shared across sections ───── */
const wrap = "mx-auto max-w-[1200px] px-8 max-[720px]:px-5";
const ink = "text-[#0B1F1C]";
const inkSoft = "text-[#3D5753]";
const muted = "text-[#6B807D]";
const jade = "#0E7C66";
const jadeDeep = "#0A5A4A";
const jadeSoft = "#E6F1EE";
const paper = "#F6F5F0";

export default function MarketingPage() {
  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="relative pt-[72px] pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(900px 400px at 88% 18%, rgba(14,124,102,0.08), transparent 60%), radial-gradient(700px 500px at 10% 0%, rgba(14,124,102,0.05), transparent 60%)"
        }} />
        <div className={`${wrap} relative`}>
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-16 items-center">
            {/* Left column */}
            <div>
              <span className="inline-flex items-center gap-2.5 font-mono text-xs font-medium tracking-[0.06em] uppercase px-3 py-1.5 rounded-full border border-[rgba(14,124,102,0.14)]" style={{ color: jadeDeep, background: jadeSoft }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: jade, boxShadow: `0 0 0 4px rgba(14,124,102,0.15)` }} />
                Live fraud intelligence for closings
              </span>

              <h1 className="font-display font-normal text-[clamp(44px,6vw,76px)] leading-[0.98] tracking-[-0.035em] mt-6 mb-5" style={{ color: "#0B1F1C" }}>
                Every wire transfer, <em className="font-light italic" style={{ color: jadeDeep }}>watched.</em> Every threat, caught.
              </h1>

              <p className={`text-[19px] leading-relaxed ${inkSoft} max-w-[520px] mb-8`}>
                WireShield is the fraud defense layer for real estate transactions. It reads every email, verifies every party, and halts every suspicious wire — before funds ever move.
              </p>

              <div className="flex items-center gap-3 mb-10">
                <Link href="/signup" className="group inline-flex items-center gap-2 px-[22px] py-3.5 rounded-xl bg-[#0B1F1C] text-[#F6F5F0] text-[15px] font-medium shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_1px_2px_rgba(11,31,28,0.18)] hover:-translate-y-px hover:bg-black transition-all">
                  Start free trial <ArrowIcon />
                </Link>
                <Link href="#" className="inline-flex items-center gap-2 px-[22px] py-3.5 rounded-xl bg-white text-[#0B1F1C] text-[15px] font-medium border border-[#E4E8E5] hover:border-[#3D5753] transition-colors">
                  Book a demo
                </Link>
              </div>

              <div className={`flex items-center gap-7 ${muted} text-[13px]`}>
                <span className="inline-flex items-center gap-2"><span style={{ color: jade }}><CheckIcon /></span> No credit card</span>
                <span className="w-px h-3.5 bg-[#E4E8E5]" />
                <span className="inline-flex items-center gap-2"><span style={{ color: jade }}><CheckIcon /></span> 14-day trial</span>
                <span className="w-px h-3.5 bg-[#E4E8E5]" />
                <span className="inline-flex items-center gap-2"><span style={{ color: jade }}><CheckIcon /></span> 90-second setup</span>
              </div>
            </div>

            {/* Right column — Product panel */}
            <div className="relative">
              <div className="relative bg-white border border-[#E4E8E5] rounded-[18px] shadow-[0_1px_2px_rgba(11,31,28,0.04),0_24px_60px_-20px_rgba(11,31,28,0.18),0_8px_24px_-12px_rgba(11,31,28,0.10)] overflow-hidden">
                {/* Panel topbar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#EEF1EE] bg-[#FBFAF6]">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E1E4DF]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E1E4DF]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E1E4DF]" />
                    </div>
                    <span className="font-mono text-[11px] text-[#6B807D] tracking-[0.02em]">transaction / TXN-40281</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px]" style={{ color: jadeDeep }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: jade, boxShadow: `0 0 0 3px rgba(14,124,102,0.18)` }} />
                    MONITORING
                  </span>
                </div>

                {/* Panel body */}
                <div className="p-5">
                  {/* Transaction header */}
                  <div className="flex items-start justify-between pb-[18px] border-b border-dashed border-[#E4E8E5] mb-[18px]">
                    <div>
                      <h3 className="font-display text-lg font-medium tracking-[-0.01em] text-[#0B1F1C] m-0 mb-1">148 Maple Ridge Dr</h3>
                      <div className="font-mono text-[12.5px] text-[#6B807D]">Morristown, NJ · Closing Apr 24</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-medium text-[22px] tracking-[-0.02em] text-[#0B1F1C]">$487,500</div>
                      <div className="font-mono text-[10.5px] font-medium text-[#6B807D] tracking-[0.04em] uppercase mt-0.5">Wire pending</div>
                    </div>
                  </div>

                  {/* Check rows */}
                  <div className="flex flex-col gap-2">
                    <CheckRow status="ok" label="Routing number verified" sub="ABA 021000089 · Citibank NA" chip="Pass" />
                    <CheckRow status="ok" label="All 4 parties authenticated" sub="Buyer · Seller · Attorney · Title" chip="Pass" />

                    {/* Alert row */}
                    <div className="relative grid grid-cols-[22px_1fr_auto] items-center gap-3 px-3 py-2.5 rounded-[10px] border border-[rgba(180,50,28,0.18)]" style={{ background: "linear-gradient(180deg, #FDF3EE 0%, #FBE8E2 100%)" }}>
                      <div className="w-[22px] h-[22px] rounded-md grid place-items-center bg-[#FBE8E2] text-[#B4321C]">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v6m0 3v.5"/><circle cx="8" cy="8" r="6.5"/></svg>
                      </div>
                      <div>
                        <div className="text-[13px] font-medium text-[#0B1F1C]">Impersonation detected · Inbound email</div>
                        <div className="font-mono text-[11px] text-[#6B807D] mt-0.5">Display name spoof · Sender IP mismatch</div>
                      </div>
                      <span className="font-mono text-[10.5px] font-medium tracking-[0.04em] uppercase px-2 py-0.5 rounded-full bg-[#FBE8E2] text-[#B4321C]">Blocked</span>
                    </div>

                    {/* Alert detail terminal */}
                    <div className="mt-2.5 p-3.5 rounded-[10px] bg-[#0B1F1C] font-mono text-[11.5px] leading-[1.65] text-[#E8EEEC] overflow-hidden">
                      <span className="text-[#8AA39E]"># threat_scanner.v4 — 0.41s</span><br/>
                      <span className="text-[#FFB39E]">FROM:</span> <span className="text-white">&quot;Sarah Chen&quot; &lt;sarah.chen@<span className="text-[#FF8C6B] underline">cxpitaltitle.com</span>&gt;</span><br/>
                      <span className="text-[#FFB39E]">EXPECTED:</span> <span className="text-white">sarah.chen@<span className="text-[#B8DCD2]">capitaltitle.com</span></span><br/>
                      <span className="text-[#FFB39E]">MATCH:</span> <span className="text-[#FF8C6B]">homograph attack · 1-char drift</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating micro-card */}
              <div className="absolute -right-7 -bottom-8 max-[980px]:right-4 max-[980px]:-bottom-6 bg-white border border-[#E4E8E5] rounded-[14px] shadow-[0_1px_2px_rgba(11,31,28,0.04),0_8px_24px_-12px_rgba(11,31,28,0.12)] px-4 py-3.5 flex items-center gap-3 max-w-[280px]">
                <div className="w-9 h-9 rounded-[10px] bg-[#0B1F1C] text-[#F6F5F0] grid place-items-center shrink-0">
                  <ShieldIcon size={16} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-[#0B1F1C] mb-0.5">$487,500 protected</div>
                  <div className="text-[11.5px] text-[#6B807D] font-mono">Fraud halted · 0.41s</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="py-20 border-t border-[#EEF1EE]">
        <div className={wrap}>
          <div className="grid grid-cols-4 max-[820px]:grid-cols-2 border border-[#E4E8E5] rounded-2xl bg-white overflow-hidden">
            <StatCell num="$2.4" unit="B" label="Protected across all monitored transactions in 2025" />
            <StatCell num="340" unit="+" label="Title companies and brokerages using WireShield" />
            <StatCell num="<0.5" unit="s" label="Average threat detection and alert time" />
            <StatCell num="99.7" unit="%" label="Fraud detection rate across all attack vectors" last />
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section className="py-24 border-t border-[#EEF1EE]" id="features">
        <div className={wrap}>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-16 mb-14 items-end">
            <div>
              <div className="font-mono text-[11px] tracking-[0.12em] uppercase mb-[18px] flex items-center gap-2.5" style={{ color: jadeDeep }}>
                <span className="w-6 h-px" style={{ background: jade }} /> Capabilities
              </div>
              <h2 className="font-display font-normal text-[clamp(34px,4.2vw,52px)] leading-[1.02] tracking-[-0.025em] text-[#0B1F1C] m-0">
                End-to-end <em className="font-light italic" style={{ color: jadeDeep }}>protection</em>
              </h2>
            </div>
            <p className={`text-[17px] leading-relaxed ${inkSoft} m-0 max-w-[520px]`}>
              From the first email to funds clearing escrow, WireShield watches the entire transaction lifecycle. No integrations to babysit. No inboxes to train.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-5">
            {/* Wide card: AI Threat Scanner */}
            <div className="col-span-12 lg:col-span-7 bg-white border border-[#E4E8E5] rounded-2xl p-7 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(11,31,28,0.04),0_8px_24px_-12px_rgba(11,31,28,0.12)] hover:border-[rgba(14,124,102,0.22)] transition-all min-h-[380px]">
              <FeatureIcon d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0" />
              <h3 className="font-display font-medium text-[22px] tracking-[-0.015em] leading-tight text-[#0B1F1C] mb-2.5">AI threat scanner reads every message like your paranoid colleague</h3>
              <p className={`text-[14.5px] leading-relaxed ${inkSoft} m-0`}>Every email, text, and document passes through a multi-model pipeline that flags phishing, impersonation, homograph attacks, and BEC indicators in under half a second.</p>
              <div className="mt-6 bg-[#FBFAF6] border border-[#EEF1EE] rounded-xl p-3.5 font-mono text-xs leading-[1.7] text-[#3D5753]">
                <ScannerLine prefix="→" text={<>Scanning inbound: <span className="text-[#0A5A4A]">wire-instructions.pdf</span></>} />
                <ScannerLine prefix="✓" text={<>DKIM valid · sender history: <span className="text-[#0A5A4A]">known</span></>} />
                <ScannerLine prefix="⚠" text={<>Routing number changed from prior msg: <span className="bg-[#FBF0DC] text-[#B97908] px-1 py-px rounded">021000089 → 026009593</span></>} />
                <ScannerLine prefix="✕" text={<>Urgency signals + new account = <span className="bg-[#FBE8E2] text-[#B4321C] px-1 py-px rounded font-medium">BEC pattern 94% confidence</span></>} />
                <ScannerLine prefix="→" text={<><span className="text-[#0A5A4A]">Action:</span> hold wire · notify buyer agent</>} />
              </div>
            </div>

            {/* Narrow card: Party verification */}
            <div className="col-span-12 lg:col-span-5 bg-white border border-[#E4E8E5] rounded-2xl p-7 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(11,31,28,0.04),0_8px_24px_-12px_rgba(11,31,28,0.12)] hover:border-[rgba(14,124,102,0.22)] transition-all">
              <FeatureIcon d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7m-4 0a4 4 0 1 0 8 0 4 4 0 1 0-8 0M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              <h3 className="font-display font-medium text-[22px] tracking-[-0.015em] leading-tight text-[#0B1F1C] mb-2.5">Party verification</h3>
              <p className={`text-[14.5px] leading-relaxed ${inkSoft} m-0`}>Continuous identity checks on every buyer, seller, agent, attorney, and title officer. Re-verified when anything changes.</p>
              <div className="mt-6 flex flex-col gap-2">
                <PartyItem initials="SC" name="Sarah Chen" role="Title · Verified" status="ok" />
                <PartyItem initials="MR" name="Marcus Ruiz" role="Buyer attorney · Verified" status="ok" variant="warm" />
                <PartyItem initials="JP" name="Jordan Park" role="Buyer · Re-auth pending" status="warn" variant="cool" />
              </div>
            </div>

            {/* Thirds row */}
            <div className="col-span-12 md:col-span-4 bg-white border border-[#E4E8E5] rounded-2xl p-7 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(11,31,28,0.04),0_8px_24px_-12px_rgba(11,31,28,0.12)] hover:border-[rgba(14,124,102,0.22)] transition-all">
              <FeatureIcon d="M2 6h20v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6ZM2 10h20M6 14h4" />
              <h3 className="font-display font-medium text-[22px] tracking-[-0.015em] leading-tight text-[#0B1F1C] mb-2.5">Wire monitoring</h3>
              <p className={`text-[14.5px] leading-relaxed ${inkSoft} m-0`}>Encrypted verification of routing numbers, account details, and destination banks. Every change triggers a fresh check.</p>
            </div>

            <div className="col-span-12 md:col-span-4 bg-white border border-[#E4E8E5] rounded-2xl p-7 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(11,31,28,0.04),0_8px_24px_-12px_rgba(11,31,28,0.12)] hover:border-[rgba(14,124,102,0.22)] transition-all">
              <FeatureIcon d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
              <h3 className="font-display font-medium text-[22px] tracking-[-0.015em] leading-tight text-[#0B1F1C] mb-2.5">Domain intelligence</h3>
              <p className={`text-[14.5px] leading-relaxed ${inkSoft} m-0`}>Catches homograph attacks, typosquatting, and lookalike domains that humans miss at 11pm.</p>
              <div className="mt-6 flex flex-col gap-1.5">
                <DomainRow host="capitaltitle.com" status="ok" />
                <DomainRow host={<>c<span className="bg-[#FFE1D6] text-[#B4321C] px-0.5 rounded-sm">x</span>pitaltitle.com</>} status="bad" flagged />
                <DomainRow host="capital-title.co" status="bad" flagged />
              </div>
            </div>

            <div className="col-span-12 md:col-span-4 bg-white border border-[#E4E8E5] rounded-2xl p-7 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(11,31,28,0.04),0_8px_24px_-12px_rgba(11,31,28,0.12)] hover:border-[rgba(14,124,102,0.22)] transition-all">
              <FeatureIcon d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9ZM10.3 21a1.94 1.94 0 0 0 3.4 0" />
              <h3 className="font-display font-medium text-[22px] tracking-[-0.015em] leading-tight text-[#0B1F1C] mb-2.5">Real-time alerts</h3>
              <p className={`text-[14.5px] leading-relaxed ${inkSoft} m-0`}>Slack, SMS, and email notifications the moment anything looks off. Route to the right person, skip the noise.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="py-24 border-t border-[#EEF1EE] bg-[#FBFAF6]" id="how">
        <div className={wrap}>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-16 mb-14 items-end">
            <div>
              <div className="font-mono text-[11px] tracking-[0.12em] uppercase mb-[18px] flex items-center gap-2.5" style={{ color: jadeDeep }}>
                <span className="w-6 h-px" style={{ background: jade }} /> The flow
              </div>
              <h2 className="font-display font-normal text-[clamp(34px,4.2vw,52px)] leading-[1.02] tracking-[-0.025em] text-[#0B1F1C] m-0">
                Protection, <em className="font-light italic" style={{ color: jadeDeep }}>step by step</em>
              </h2>
            </div>
            <p className={`text-[17px] leading-relaxed ${inkSoft} m-0 max-w-[520px]`}>
              Drop WireShield into any existing transaction workflow. No replatforming, no retraining your team — just a layer of defense that compounds across every deal.
            </p>
          </div>

          <div>
            <HowStep
              num="01" label="Create"
              title="Create a transaction"
              desc="Add the property, parties, and key dates. WireShield instantly begins monitoring every associated email thread, document, and communication channel."
              meta="Setup in 90 seconds"
              metaIcon={<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6.5"/><path d="M8 4v4l2.5 2.5"/></svg>}
              viz={
                <HowViz title="New Transaction" time="12:04 PM" rows={[
                  { k: "property", v: "148 Maple Ridge Dr" },
                  { k: "parties", v: "4 added" },
                  { k: "close date", v: "Apr 24, 2026" },
                  { k: "monitoring", v: "● active", ok: true },
                ]} />
              }
            />
            <HowStep
              num="02" label="Scan"
              title="Continuous threat analysis"
              desc="Every message, identity change, and wire instruction runs through the detection pipeline. Signals compound across the deal — one weird email doesn't just get flagged, it changes the risk posture for everything after."
              meta="Sub-second pipeline"
              metaIcon={<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 8h3l2-5 3 10 2-5h3"/></svg>}
              viz={
                <HowViz title="Signal Pipeline" time="running" rows={[
                  { k: "email_scan", v: "12 / 12 ✓", ok: true },
                  { k: "domain_check", v: "7 / 7 ✓", ok: true },
                  { k: "identity_drift", v: "1 flagged", bad: true },
                  { k: "wire_integrity", v: "ok", ok: true },
                ]} progress={82} />
              }
            />
            <HowStep
              num="03" label="Clear"
              title="Verified closing"
              desc="Before a single dollar moves, every party is re-authenticated, every wire instruction is re-verified, and every communication is audit-logged. Compliance gets the paper trail. Your buyer keeps their life savings."
              meta="Full audit log exported"
              metaIcon={<CheckIcon size={12} />}
              last
              viz={
                <HowViz title="Pre-Close Clearance" time="Apr 24" rows={[
                  { k: "parties_reauth", v: "4 / 4 ✓", ok: true },
                  { k: "wire_reverify", v: "✓ passed", ok: true },
                  { k: "audit_log", v: "287 events", ok: true },
                  { k: "status", v: "● cleared to fund", ok: true },
                ]} />
              }
            />
          </div>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="py-24 border-t border-[#EEF1EE]">
        <div className={wrap}>
          <div className="relative bg-[#0B1F1C] text-[#F6F5F0] rounded-3xl p-[72px_64px] max-[820px]:p-[48px_32px] overflow-hidden grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div className="absolute inset-0 pointer-events-none" style={{
              background: "radial-gradient(500px 300px at 85% 20%, rgba(14,124,102,0.45), transparent 60%), radial-gradient(400px 300px at 10% 90%, rgba(14,124,102,0.18), transparent 60%)"
            }} />
            <div className="relative">
              <h2 className="font-display font-normal text-[clamp(32px,4vw,48px)] leading-[1.02] tracking-[-0.025em] mb-5">
                The average wire fraud loss is <em className="font-light italic text-[#B8DCD2]">six figures</em>. The defense shouldn&apos;t be an afterthought.
              </h2>
              <p className="text-[#A9BAB6] text-base leading-relaxed mb-7 max-w-[460px]">
                Start the free trial. We&apos;ll monitor your next transaction end to end — every email, every wire, every party. No credit card. No setup call required.
              </p>
              <div className="flex gap-3 items-center">
                <Link href="/signup" className="group inline-flex items-center gap-2 px-[22px] py-3.5 rounded-xl bg-[#F6F5F0] text-[#0B1F1C] text-[15px] font-medium hover:bg-white hover:-translate-y-px transition-all">
                  Start free trial <ArrowIcon />
                </Link>
                <Link href="#" className="inline-flex items-center gap-2 px-[22px] py-3.5 rounded-xl text-[#F6F5F0] text-[15px] font-medium border border-[rgba(255,255,255,0.18)] hover:border-[rgba(255,255,255,0.35)] transition-colors">
                  Talk to sales
                </Link>
              </div>
            </div>
            <div className="relative bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-2xl p-5 backdrop-blur-md">
              <div className="font-mono text-[11px] tracking-[0.08em] uppercase text-[#B8DCD2] mb-3.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8DCD2] animate-pulse" style={{ boxShadow: "0 0 0 3px rgba(184,220,210,0.2)" }} />
                What we catch
              </div>
              {["business_email_compromise", "wire_instruction_tampering", "homograph_domain_spoofing", "identity_impersonation", "seller_account_takeover"].map((k) => (
                <div key={k} className="flex justify-between py-2.5 border-t border-[rgba(255,255,255,0.06)] first:border-t-0">
                  <span className="text-[#8AA39E] font-mono text-[11.5px]">{k}</span>
                  <span className="text-[#B8DCD2] font-medium">●</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="py-10 border-t border-[#EEF1EE] bg-[#FBFAF6]">
        <div className={`${wrap} flex items-center justify-between flex-wrap gap-4`}>
          <div className="flex items-center gap-2.5">
            <span className="w-[26px] h-[26px] grid place-items-center rounded-[7px] bg-[#0B1F1C] text-[#F6F5F0]">
              <ShieldIcon />
            </span>
            <span className="font-display font-medium text-base tracking-[-0.01em]">WireShield</span>
          </div>
          <div className="flex gap-[22px]">
            {["Privacy", "Security", "Terms", "Contact"].map((l) => (
              <Link key={l} href="#" className={`text-[13px] ${inkSoft} hover:text-[#0B1F1C]`}>{l}</Link>
            ))}
          </div>
          <div className="font-mono text-[12.5px] text-[#6B807D]">© 2026 WireShield · All rights reserved</div>
        </div>
      </footer>
    </>
  );
}

/* ═══════ SUB-COMPONENTS ═══════ */

function CheckRow({ status, label, sub, chip }: { status: "ok" | "warn" | "bad"; label: string; sub: string; chip: string }) {
  const icoColors = { ok: "bg-[#E6F1EE] text-[#0A5A4A]", warn: "bg-[#FBF0DC] text-[#B97908]", bad: "bg-[#FBE8E2] text-[#B4321C]" };
  const chipColors = { ok: "bg-[#E6F1EE] text-[#0A5A4A]", warn: "bg-[#FBF0DC] text-[#B97908]", bad: "bg-[#FBE8E2] text-[#B4321C]" };
  return (
    <div className="grid grid-cols-[22px_1fr_auto] items-center gap-3 px-3 py-2.5 rounded-[10px] bg-[#FBFAF6] border border-[#EEF1EE]">
      <div className={`w-[22px] h-[22px] rounded-md grid place-items-center ${icoColors[status]}`}>
        <CheckIcon size={12} />
      </div>
      <div>
        <div className="text-[13px] font-medium text-[#0B1F1C]">{label}</div>
        <div className="font-mono text-[11px] text-[#6B807D] mt-0.5">{sub}</div>
      </div>
      <span className={`font-mono text-[10.5px] font-medium tracking-[0.04em] uppercase px-2 py-0.5 rounded-full ${chipColors[status]}`}>{chip}</span>
    </div>
  );
}

function FeatureIcon({ d }: { d: string }) {
  return (
    <div className="w-[38px] h-[38px] rounded-[10px] grid place-items-center mb-5 border border-[rgba(14,124,102,0.14)]" style={{ background: jadeSoft, color: jadeDeep }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
    </div>
  );
}

function ScannerLine({ prefix, text }: { prefix: string; text: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-[#6B807D] min-w-[24px]">{prefix}</span>
      <span>{text}</span>
    </div>
  );
}

function PartyItem({ initials, name, role, status, variant }: { initials: string; name: string; role: string; status: "ok" | "warn"; variant?: "warm" | "cool" }) {
  const avatarBg = variant === "warm" ? "bg-gradient-to-br from-[#E8DDC9] to-[#CFB68E] text-[#6B4F1F]" : variant === "cool" ? "bg-gradient-to-br from-[#DFD8E8] to-[#B8A8CF] text-[#4A3B6B]" : "bg-gradient-to-br from-[#CFE5DE] to-[#A7CFC3] text-[#0A5A4A]";
  const chipClass = status === "ok" ? "bg-[#E6F1EE] text-[#0A5A4A]" : "bg-[#FBF0DC] text-[#B97908]";
  return (
    <div className="grid grid-cols-[32px_1fr_auto] items-center gap-3 px-3 py-2.5 rounded-[10px] bg-[#FBFAF6] border border-[#EEF1EE]">
      <div className={`w-8 h-8 rounded-full grid place-items-center font-display text-[13px] font-medium ${avatarBg}`}>{initials}</div>
      <div>
        <div className="text-[13px] font-medium text-[#0B1F1C]">{name}</div>
        <div className="text-[11.5px] text-[#6B807D] font-mono">{role}</div>
      </div>
      <span className={`font-mono text-[10.5px] font-medium tracking-[0.04em] uppercase px-2 py-0.5 rounded-full ${chipClass}`}>{status === "ok" ? "✓" : "!"}</span>
    </div>
  );
}

function DomainRow({ host, status, flagged }: { host: React.ReactNode; status: "ok" | "bad"; flagged?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-3 py-2.5 rounded-[10px] font-mono text-xs border ${flagged ? "bg-[#FDF3EE] border-[rgba(180,50,28,0.18)]" : "bg-[#FBFAF6] border-[#EEF1EE]"}`}>
      <span className={`font-medium ${flagged ? "text-[#B4321C]" : "text-[#0B1F1C]"}`}>{host}</span>
      <span className={`font-mono text-[10.5px] font-medium tracking-[0.04em] uppercase px-2 py-0.5 rounded-full ${status === "ok" ? "bg-[#E6F1EE] text-[#0A5A4A]" : "bg-[#FBE8E2] text-[#B4321C]"}`}>{status === "ok" ? "Legit" : "Spoof"}</span>
    </div>
  );
}

function StatCell({ num, unit, label, last }: { num: string; unit: string; label: string; last?: boolean }) {
  return (
    <div className={`px-7 py-7 ${!last ? "border-r border-[#EEF1EE]" : ""} max-[820px]:nth-2:border-r-0 max-[820px]:nth-1:border-b max-[820px]:nth-2:border-b border-[#EEF1EE]`}>
      <div className="font-display text-[44px] font-normal tracking-[-0.03em] leading-none text-[#0B1F1C] flex items-baseline gap-0.5">
        {num}<span className="text-[22px] font-medium ml-0.5" style={{ color: jadeDeep }}>{unit}</span>
      </div>
      <div className={`mt-2.5 text-[13px] leading-snug ${inkSoft}`}>{label}</div>
    </div>
  );
}

function HowStep({ num, label, title, desc, meta, metaIcon, viz, last }: { num: string; label: string; title: string; desc: string; meta: string; metaIcon: React.ReactNode; viz: React.ReactNode; last?: boolean }) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-[180px_1fr_1.2fr] gap-10 py-9 border-t border-[#E4E8E5] ${last ? "border-b" : ""}`}>
      <div>
        <div className="font-display text-[64px] font-light italic leading-none tracking-[-0.04em]" style={{ color: jadeDeep }}>{num}</div>
        <div className="font-mono text-[10.5px] font-medium tracking-[0.12em] uppercase text-[#6B807D] mt-2.5 not-italic" style={{ fontStyle: "normal" }}>{label}</div>
      </div>
      <div>
        <h3 className="font-display font-medium text-2xl tracking-[-0.015em] text-[#0B1F1C] mb-2.5">{title}</h3>
        <p className={`text-[14.5px] leading-relaxed ${inkSoft} mb-3.5`}>{desc}</p>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded-full" style={{ color: jadeDeep, background: jadeSoft }}>
          {metaIcon} {meta}
        </span>
      </div>
      <div>{viz}</div>
    </div>
  );
}

function HowViz({ title, time, rows, progress }: { title: string; time: string; rows: { k: string; v: string; ok?: boolean; bad?: boolean }[]; progress?: number }) {
  return (
    <div className="bg-white border border-[#E4E8E5] rounded-[14px] p-4 font-mono text-[11.5px] shadow-[0_1px_2px_rgba(11,31,28,0.04),0_1px_0_rgba(11,31,28,0.02)]">
      <div className="flex items-center justify-between pb-2.5 border-b border-[#EEF1EE] mb-3">
        <span className="font-sans text-[12.5px] font-semibold text-[#0B1F1C]">{title}</span>
        <span className="text-[10.5px] text-[#6B807D]">{time}</span>
      </div>
      {rows.map((r) => (
        <div key={r.k} className="flex justify-between py-[5px]">
          <span className="text-[#6B807D]">{r.k}</span>
          <span className={`font-medium ${r.ok ? "text-[#0A5A4A]" : r.bad ? "text-[#B4321C]" : "text-[#0B1F1C]"}`}>{r.v}</span>
        </div>
      ))}
      {progress !== undefined && (
        <div className="mt-3 h-1 rounded-sm bg-[#EEF1EE] overflow-hidden">
          <div className="h-full rounded-sm" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${jade}, ${jadeDeep})` }} />
        </div>
      )}
    </div>
  );
}
