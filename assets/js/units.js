// Unit data + renderer for unit.html
// One file, one URL param (?u=<id>), all ~22 CPC40120 core units.

(function () {
  'use strict';

  // ---------- Question banks (one set per sub-section) ----------
  // Each unit page shows three sample questions drawn from the bank that
  // matches the unit's sub-section, plus one short-answer question.
  const QUESTION_BANKS = {
    codes: [
      {
        type: 'mc',
        q: 'Under the National Construction Code, which class is a single detached dwelling?',
        opts: ['Class 1a', 'Class 2', 'Class 9b', 'Class 10a'],
        correct: 0,
      },
      {
        type: 'mc',
        q: 'A garden shed under 10 m² in a residential zone is typically classified as which NCC class?',
        opts: ['Class 1b', 'Class 4', 'Class 10a', 'Class 8'],
        correct: 2,
      },
      {
        type: 'mc',
        q: 'For Class 2–9 Type C construction, the maximum effective height is:',
        opts: ['Less than 12 m', 'Less than 25 m', 'Less than 50 m', 'No limit'],
        correct: 1,
      },
      { type: 'short', q: 'In your own words, describe the difference between a Deemed-to-Satisfy and a Performance Solution under NCC.' },
    ],
    whs: [
      {
        type: 'mc',
        q: 'In the hierarchy of risk control, which is the most effective control?',
        opts: ['Administrative controls', 'Personal protective equipment', 'Engineering controls', 'Elimination'],
        correct: 3,
      },
      {
        type: 'mc',
        q: 'A SWMS must be prepared before commencing which type of work?',
        opts: ['Any office-based work', 'High-risk construction work', 'Only work above 2 m', 'All work over $50,000'],
        correct: 1,
      },
      {
        type: 'mc',
        q: 'Who is the "PCBU" on a construction site?',
        opts: ['The site foreman', 'The Person Conducting a Business or Undertaking', 'The principal contractor only', 'The WHS regulator'],
        correct: 1,
      },
      { type: 'short', q: 'Identify two hazards you would expect on a residential frame stage worksite, and the risk controls you would apply for each.' },
    ],
    plans: [
      {
        type: 'mc',
        q: 'A scale of 1:100 means 1 mm on the drawing equals:',
        opts: ['10 mm in reality', '100 mm in reality', '1 m in reality', '10 m in reality'],
        correct: 1,
      },
      {
        type: 'mc',
        q: 'Which view in a residential drawing set shows interior wall finishes and ceiling heights?',
        opts: ['Site plan', 'Section', 'Elevation', 'Roof plan'],
        correct: 1,
      },
      {
        type: 'mc',
        q: 'A "setback" on a site plan refers to:',
        opts: ['The distance from the dwelling to the nearest boundary', 'The height of the eaves', 'The footing depth', 'The fall of the land'],
        correct: 0,
      },
      { type: 'short', q: 'Given a set of plans for a Class 1a dwelling, list the three documents you would expect to find alongside the architectural drawings.' },
    ],
    planning: [
      {
        type: 'mc',
        q: 'In a critical path schedule, the activity with zero float is:',
        opts: ['Always the longest', 'On the critical path', 'A buffer activity', 'A milestone'],
        correct: 1,
      },
      {
        type: 'mc',
        q: 'A material schedule should normally be issued to suppliers:',
        opts: ['After site set-out', 'Before construction commences, with lead times factored in', 'Only after the slab is poured', 'After framing is complete'],
        correct: 1,
      },
      {
        type: 'mc',
        q: 'A construction program for a Class 1a dwelling typically covers which stages?',
        opts: ['Frame and fix only', 'Slab → frame → lock-up → fix → completion', 'Just structural', 'Defects only'],
        correct: 1,
      },
      { type: 'short', q: 'Explain why lead times for imported windows should be entered into the construction program before footings are poured.' },
    ],
    estimating: [
      {
        type: 'mc',
        q: 'A "first principles" estimate is best described as:',
        opts: ['Using last project\'s rate', 'Building up cost from labour, materials and plant', 'Asking a quantity surveyor for a guess', 'Adding 20% to the architect\'s allowance'],
        correct: 1,
      },
      {
        type: 'mc',
        q: 'Preliminaries in a tender include:',
        opts: ['Trade contractor margins only', 'Site establishment, supervision, insurances, scaffolding', 'GST only', 'Defects rectification'],
        correct: 1,
      },
      {
        type: 'mc',
        q: 'When evaluating a tender, the lowest price is:',
        opts: ['Always the best choice', 'A red flag — verify completeness of scope', 'Required by law', 'Ignored if alternative tenders exist'],
        correct: 1,
      },
      { type: 'short', q: 'Identify three risks of submitting a tender without a documented "first principles" estimate.' },
    ],
    contracts: [
      {
        type: 'mc',
        q: 'A "practical completion" clause typically triggers:',
        opts: ['Final payment of the full contract sum', 'Commencement of the defects liability period', 'Site demobilisation only', 'Tender close'],
        correct: 1,
      },
      {
        type: 'mc',
        q: 'A variation order is best described as:',
        opts: ['A change to the scope, time or cost — issued and accepted in writing', 'An unwritten agreement on site', 'Any minor design change', 'Only used in commercial projects'],
        correct: 0,
      },
      {
        type: 'mc',
        q: 'In a fixed-price contract, who bears the risk of material price increases?',
        opts: ['The client', 'The principal contractor', 'The supplier', 'The regulator'],
        correct: 1,
      },
      { type: 'short', q: 'Describe the difference between liquidated damages and general damages under a construction contract.' },
    ],
    structural: [
      {
        type: 'mc',
        q: 'A simply-supported beam is loaded uniformly. The maximum bending moment occurs:',
        opts: ['At one of the supports', 'At mid-span', 'At a quarter point', 'At the load application point'],
        correct: 1,
      },
      {
        type: 'mc',
        q: 'Wind load actions on a residential dwelling are determined under which Australian Standard?',
        opts: ['AS 1170.2', 'AS 3600', 'AS 4055', 'Both AS 1170.2 and AS 4055 for non-cyclonic sites'],
        correct: 3,
      },
      {
        type: 'mc',
        q: 'In timber framing, a "stud" primarily carries:',
        opts: ['Wind only', 'Vertical (axial) loads', 'Tension only', 'Earthquake load'],
        correct: 1,
      },
      { type: 'short', q: 'Explain why bracing requirements increase as wind classification moves from N1 to N4.' },
    ],
    sustainability: [
      {
        type: 'mc',
        q: 'Under the NCC, residential buildings must achieve a minimum NatHERS rating of:',
        opts: ['5 stars', '6 stars', '7 stars (NCC 2022)', '8 stars'],
        correct: 2,
      },
      {
        type: 'mc',
        q: 'Which strategy provides the largest reduction in cooling load for an Adelaide dwelling?',
        opts: ['Reflective foil to roof only', 'Eaves designed to shade north-facing windows in summer', 'Painting walls white', 'Larger air-conditioning unit'],
        correct: 1,
      },
      {
        type: 'mc',
        q: 'A waste-management plan on a Class 1a build should aim to:',
        opts: ['Send everything to landfill', 'Separate timber, metal, cardboard and clean concrete for recycling', 'Only recycle copper', 'Burn timber offcuts on site'],
        correct: 1,
      },
      { type: 'short', q: 'Identify three actions you would put in a site Environmental Management Plan for sediment control.' },
    ],
    business: [
      {
        type: 'mc',
        q: 'An operational plan typically covers what time horizon?',
        opts: ['10 years', 'A single project only', '1 year, broken into quarterly targets', 'Indefinite'],
        correct: 2,
      },
      {
        type: 'mc',
        q: 'A scope-management technique includes:',
        opts: ['Verbal agreement only', 'A documented scope baseline + change-control process', 'Adding work on request without documentation', 'Removing items from contract silently'],
        correct: 1,
      },
      {
        type: 'mc',
        q: 'When building a business relationship with a key supplier, the most reliable basis is:',
        opts: ['Lowest price every time', 'Mutual reliability, communication and clear commercial terms', 'Personal friendship only', 'A handshake'],
        correct: 1,
      },
      { type: 'short', q: 'List three KPIs you would track to measure the operational performance of a small builder over a financial year.' },
    ],
    intro: [
      {
        type: 'mc',
        q: 'How long do you have to complete CPC40120 under the standard enrolment?',
        opts: ['6 months', '12 months', '18 months', 'No limit'],
        correct: 1,
      },
      {
        type: 'mc',
        q: 'If you need a Reasonable Adjustment for an assessment, you should:',
        opts: ['Submit anyway and request adjustment afterwards', 'Contact your trainer before the assessment and submit the form', 'Wait until the Competency Verification Interview', 'No adjustments are allowed'],
        correct: 1,
      },
      {
        type: 'mc',
        q: 'A Unique Student Identifier (USI) is:',
        opts: ['Optional', 'Required to receive a qualification', 'Issued only by your employer', 'The same as a Tax File Number'],
        correct: 1,
      },
      { type: 'short', q: 'In one sentence, describe what "competency" means in vocational education.' },
    ],
  };

  // ---------- Unit catalog ----------
  // status: 'satisfactory' | 'progress' | 'new' | 'locked'
  const UNITS = {
    'intro': {
      code: 'Module 1', title: 'Course Introduction — Online Knowledge Check',
      section: 'Welcome & Course Introduction', sectionKey: 'intro',
      status: 'satisfactory', submitted: '24 Nov 2025', score: '10/10',
      desc: 'Orientation, course expectations, and a short knowledge check on how the CPC40120 self-paced course is delivered.',
      projectTask: null,
    },
    'cpccbc4001': {
      code: 'CPCCBC4001', title: 'Apply building codes and standards to the construction process for Class 1 and 10 buildings',
      section: 'Codes, Standards & Legislation', sectionKey: 'codes',
      status: 'satisfactory', submitted: '07 Feb 2026', score: '14/15',
      desc: 'Apply NCC Volume Two and relevant Australian Standards to the design and construction of Class 1 (dwellings) and Class 10 (sheds, fences, retaining walls) buildings.',
      projectTask: 'Review the supplied plans for a single-storey Class 1a dwelling in Adelaide. Prepare a compliance report against the NCC Volume Two deemed-to-satisfy provisions covering fire separation, energy efficiency and structural provisions. Upload your written report (PDF) and any marked-up drawings (PDF or JPG).',
      submittedFiles: [['compliance-report-cpccbc4001.pdf', '1.8 MB'], ['plans-marked-up.pdf', '4.2 MB']],
    },
    'cpccbc4053': {
      code: 'CPCCBC4053', title: 'Apply building codes and standards to the construction process for Class 2 to 9 Type C buildings',
      section: 'Codes, Standards & Legislation', sectionKey: 'codes',
      status: 'satisfactory', submitted: '21 Mar 2026', score: '13/15',
      desc: 'Apply NCC Volume One Type C construction requirements to Class 2 (apartments), Class 3 (boarding), Class 5 (offices) and other Class 2–9 buildings up to 25 m effective height.',
      projectTask: 'Identify the NCC class and Type C requirements for a two-storey mixed-use building (Class 5 office over Class 6 retail). Document compliance pathways and required fire-resistance levels (FRL) for the structural elements.',
      submittedFiles: [['type-c-compliance-cpccbc4053.pdf', '2.1 MB']],
    },
    'cpccbc4009': {
      code: 'CPCCBC4009', title: 'Apply legal requirements to building and construction projects',
      section: 'Codes, Standards & Legislation', sectionKey: 'codes',
      status: 'new',
      desc: 'Apply contract law, planning law, the Building Work Contractors Act (SA), workers compensation and consumer protection requirements to a building project.',
      projectTask: 'Given a sample residential building dispute scenario, identify the relevant SA legislation and explain the resolution path through the South Australian Civil and Administrative Tribunal (SACAT).',
    },
    'cpccbc4002': {
      code: 'CPCCBC4002', title: 'Manage occupational health and safety in the building workplace',
      section: 'WHS & Site Safety', sectionKey: 'whs',
      status: 'satisfactory', submitted: '04 Apr 2026', score: '15/15',
      desc: 'Plan, implement, monitor and review WHS systems on a residential or low-rise commercial site. Produce a Safe Work Method Statement (SWMS) and conduct toolbox talks.',
      projectTask: 'Produce a SWMS for working at heights during a roof framing operation. Include hazard identification, risk rating, controls (using the hierarchy of controls), permit-to-work conditions, and emergency procedures.',
      submittedFiles: [['swms-roof-framing.pdf', '1.4 MB'], ['toolbox-talk-record.pdf', '320 KB']],
    },
    'cpcwhs3001': {
      code: 'CPCWHS3001', title: 'Identify construction work hazards and select risk control strategies',
      section: 'WHS & Site Safety', sectionKey: 'whs',
      status: 'new',
      desc: 'Identify the common hazards on a construction site, conduct a documented risk assessment, and select appropriate controls in line with the hierarchy of risk control.',
      projectTask: 'Walk through a construction site (or video provided in resources) and produce a hazard register with at least eight identified hazards. For each, document the risk rating before and after controls.',
    },
    'cpccbc4012': {
      code: 'CPCCBC4012', title: 'Read and interpret plans and specifications',
      section: 'Plans, Drawings & Set-Out', sectionKey: 'plans',
      status: 'satisfactory', submitted: '28 Feb 2026', score: '15/15',
      desc: 'Read architectural, structural and services drawings for a Class 1a build. Cross-reference plans, sections, elevations, schedules and the specification document.',
      projectTask: 'Using the supplied drawing set for a two-bedroom dwelling, complete the take-off worksheet — quantities for slab, framing, roof, cladding and windows. Highlight any conflict between the drawings and the specification.',
      submittedFiles: [['takeoff-worksheet.xlsx', '780 KB'], ['conflict-report.pdf', '420 KB']],
    },
    'cpccbc4014': {
      code: 'CPCCBC4014', title: 'Prepare simple building sketches and drawings',
      section: 'Plans, Drawings & Set-Out', sectionKey: 'plans',
      status: 'new',
      desc: 'Prepare freehand and CAD sketches for site briefings — plans, sections, elevations and details. Use appropriate symbols, scales and dimensioning conventions.',
      projectTask: 'Sketch a wall section through a typical brick-veneer-on-slab Class 1a wall, including footing, slab edge thickening, dampcourse, frame, insulation, and external cladding. Annotate with NCC compliance notes.',
    },
    'cpccbc4018': {
      code: 'CPCCBC4018', title: 'Apply site surveys and set-out procedures to building and construction projects',
      section: 'Plans, Drawings & Set-Out', sectionKey: 'plans',
      status: 'new',
      desc: 'Set out a building from boundary markers, establish levels using a dumpy level or laser, and verify set-out against site plans before excavation.',
      projectTask: 'Using the supplied site survey, set out the corner pegs and offset profiles for a Class 1a dwelling. Document the procedure with photos and a set-out report. Verify squareness using the 3-4-5 method.',
    },
    'cpccom1015': {
      code: 'CPCCOM1015', title: 'Carry out measurements and calculations',
      section: 'Plans, Drawings & Set-Out', sectionKey: 'plans',
      status: 'new',
      desc: 'Carry out linear, area, volume and angular measurements for construction work. Convert between units and apply basic geometry and trigonometry to setting-out problems.',
      projectTask: 'Complete the supplied measurement worksheet — calculate areas of irregular floor plates, volumes of concrete required for a footing run, and apply Pythagoras to a roof rafter length.',
    },
    'cpccbc4005': {
      code: 'CPCCBC4005', title: 'Produce labour and material schedules for ordering',
      section: 'Project Planning & Resources', sectionKey: 'planning',
      status: 'new',
      desc: 'Quantify labour and materials from a tendered scope of works. Produce a procurement schedule that incorporates lead times, packaging and site storage.',
      projectTask: 'Using the supplied take-off, produce a procurement schedule for the frame package — timber, fixings, deliveries, and labour crew assignments — across a six-week construction program.',
    },
    'cpccbc4007': {
      code: 'CPCCBC4007', title: 'Plan building or construction work',
      section: 'Project Planning & Resources', sectionKey: 'planning',
      status: 'new',
      desc: 'Develop a project plan including scope, schedule, resources, risks and quality controls. Apply critical-path concepts and identify dependencies between trades.',
      projectTask: 'Develop a 20-week construction program for a Class 1a build using the supplied scope. Include critical-path activities, weather contingencies and a procurement lead-time overlay.',
    },
    'cpccbc4006': {
      code: 'CPCCBC4006', title: 'Select, procure and store construction materials for building projects',
      section: 'Project Planning & Resources', sectionKey: 'planning',
      status: 'new',
      desc: 'Select materials by specification, assess supplier reliability, manage delivery sequencing and site storage to minimise damage and double-handling.',
      projectTask: 'Prepare a procurement plan for the wet-area finishes package. Compare three suppliers on price, lead time and warranty terms. Recommend a supplier and justify your decision.',
    },
    'cpccbc4004': {
      code: 'CPCCBC4004', title: 'Identify and produce estimated costs for building and construction projects',
      section: 'Estimating & Tendering', sectionKey: 'estimating',
      status: 'new',
      desc: 'Produce a first-principles cost estimate for a residential build using current rates, supplier quotes and historical data. Build up costs for labour, materials, plant, and preliminaries.',
      projectTask: 'Prepare a first-principles estimate for the slab and frame stages of the supplied Class 1a project. Build the labour-and-materials breakdown and apply a preliminaries percentage.',
    },
    'cpccbc4013': {
      code: 'CPCCBC4013', title: 'Prepare and evaluate tender documentation',
      section: 'Estimating & Tendering', sectionKey: 'estimating',
      status: 'new',
      desc: 'Compile a tender package, issue to tenderers, evaluate returned tenders against price, scope and qualifications, and recommend an award.',
      projectTask: 'Compile a tender package (scope, drawings, specification, conditions of tender) for the supplied project. Evaluate three returned tenders using a scoring matrix and produce a recommendation report.',
    },
    'cpccbc4003': {
      code: 'CPCCBC4003', title: 'Select, prepare and administer a construction contract',
      section: 'Contracts & Site Administration', sectionKey: 'contracts',
      status: 'progress',
      desc: 'Select an appropriate standard form of contract for a residential build, prepare the contract document and administer it through to practical completion. Saturday cohort sessions: Apr 18, May 2, May 9 (all attended); next session 23 May 2026.',
      projectTask: 'Using the HIA New Homes Contract template, prepare a contract for the supplied scope. Identify five clauses that you would negotiate with the client and justify your position.',
    },
    'cpccbc4008': {
      code: 'CPCCBC4008', title: 'Supervise site communication and administration processes for building and construction projects',
      section: 'Contracts & Site Administration', sectionKey: 'contracts',
      status: 'new',
      desc: 'Establish and supervise communication protocols on a building site — RFIs, toolbox talks, daily site diary, variations, EOTs, progress claims and handover documentation.',
      projectTask: 'Record a 5-minute video walking through a daily site diary entry, a toolbox talk briefing, and a variation discussion with a client. Upload your video (MP4, under 1 GB).',
    },
    'cpccbc4010': {
      code: 'CPCCBC4010', title: 'Apply structural principles to residential and commercial constructions',
      section: 'Structural Principles', sectionKey: 'structural',
      status: 'new',
      desc: 'Identify load paths in residential and low-rise commercial structures. Apply principles of bending, shear and compression to footings, beams, columns and connections.',
      projectTask: 'For the supplied Class 1a frame plan, trace the load path from roof to footing. Identify the critical load-bearing members and verify bracing requirements per AS 1684 for an N3 wind classification.',
    },
    'cpccbc4011': {
      code: 'CPCCBC4011', title: 'Apply structural principles to commercial low-rise constructions',
      section: 'Structural Principles', sectionKey: 'structural',
      status: 'new',
      desc: 'Identify and verify structural elements in commercial low-rise construction — steel portal frames, concrete tilt panels, suspended slabs and connection details.',
      projectTask: 'Analyse the supplied portal-frame warehouse — identify primary and secondary structural members, the bracing strategy, and the load path under wind and gravity loads.',
    },
    'cpccbc4020': {
      code: 'CPCCBC4020', title: 'Build thermally efficient and sustainable structures',
      section: 'Sustainability & Thermal Efficiency', sectionKey: 'sustainability',
      status: 'new',
      desc: 'Design and construct dwellings that meet NCC 7-star NatHERS performance — insulation R-values, glazing performance, thermal mass, draught sealing and orientation.',
      projectTask: 'Modify the supplied Class 1a dwelling design to achieve 7-star NatHERS. Document the changes — insulation upgrade, glazing specification, eave shading, orientation — and explain the rationale.',
    },
    'bsbsus411': {
      code: 'BSBSUS411', title: 'Implement and monitor environmentally sustainable work practices',
      section: 'Sustainability & Thermal Efficiency', sectionKey: 'sustainability',
      status: 'new',
      desc: 'Audit current site practices for environmental impact, set sustainability targets, and implement procedures for waste, water and energy.',
      projectTask: 'Audit the supplied case-study site against environmental indicators (waste, water, energy, sediment). Produce an Environmental Management Plan with three improvement actions.',
    },
    'bsbops402': {
      code: 'BSBOPS402', title: 'Coordinate business operational plans',
      section: 'Business & Operations', sectionKey: 'business',
      status: 'new',
      desc: 'Develop, implement and monitor an operational plan for a small builder. Set KPIs, allocate resources, and review outcomes against the plan.',
      projectTask: 'Develop an operational plan for a fictional builder ("BuildRight SA") covering 12 months. Include quarterly KPIs, resourcing, marketing actions and a budget summary.',
    },
    'bsbpmg423': {
      code: 'BSBPMG423', title: 'Apply project scope management techniques',
      section: 'Business & Operations', sectionKey: 'business',
      status: 'new',
      desc: 'Define, document and control project scope using a baseline + change-control approach. Manage scope creep and document variations.',
      projectTask: 'Apply scope-management techniques to the supplied Class 1a project. Produce a scope baseline, a change-control register, and a variation order for a client-requested kitchen upgrade.',
    },
    'bsbtwk401': {
      code: 'BSBTWK401', title: 'Build and maintain business relationships',
      section: 'Business & Operations', sectionKey: 'business',
      status: 'new',
      desc: 'Build and maintain productive business relationships with clients, suppliers, subcontractors and consultants — both face-to-face and in writing.',
      projectTask: 'Record a 5-minute video of a simulated negotiation with a supplier over a delivery delay. Demonstrate active listening, problem framing, and a documented next-step commitment.',
    },
  };

  // ---------- Renderer ----------

  function el(html) {
    const wrap = document.createElement('div');
    wrap.innerHTML = html.trim();
    return wrap.firstElementChild;
  }

  function statusBadge(status) {
    switch (status) {
      case 'satisfactory': return '<span class="badge badge-success">Satisfactory</span>';
      case 'progress': return '<span class="badge badge-progress">In Progress</span>';
      case 'new': return '<span class="badge badge-info">Not Started</span>';
      case 'locked': return '<span class="badge badge-muted">Locked</span>';
      default: return '';
    }
  }

  function renderHero(unit) {
    const dueLabel = unit.status === 'satisfactory'
      ? `Submitted ${unit.submitted}${unit.score ? ' · Score ' + unit.score : ''}`
      : unit.status === 'progress'
      ? 'In progress'
      : unit.status === 'locked'
      ? 'Unlocks after CPC40120 completion'
      : 'Not started';

    return `
      <div class="unit-hero">
        <div class="crumb">${unit.section}</div>
        <h1>${unit.code} — ${unit.title}</h1>
        <div class="unit-meta">
          <span>${statusBadge(unit.status)}</span>
          <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>${dueLabel}</span>
          <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>Trainer: Luke Gu</span>
        </div>
        <p class="description">${unit.desc}</p>
      </div>`;
  }

  function renderQuestion(q, i, locked, showAnswers) {
    if (q.type === 'short') {
      const filled = showAnswers
        ? '<textarea readonly>This unit\'s reflection was completed and accepted by the assessor.</textarea>'
        : `<textarea ${locked ? 'disabled' : ''} placeholder="Type your answer..."></textarea>`;
      return `
        <div class="question-block">
          <div class="q-num">Question ${i + 1} · Short answer</div>
          <p class="q-text">${q.q}</p>
          ${filled}
        </div>`;
    }
    const opts = q.opts.map((opt, idx) => {
      const correctCls = showAnswers && idx === q.correct ? ' correct' : '';
      const checked = showAnswers && idx === q.correct ? 'checked' : '';
      return `
        <label class="q-option${correctCls}">
          <input type="radio" name="q${i}" ${checked} ${locked ? 'disabled' : ''} />
          <span>${opt}</span>
        </label>`;
    }).join('');
    return `
      <div class="question-block">
        <div class="q-num">Question ${i + 1} · Multiple choice</div>
        <p class="q-text">${q.q}</p>
        <div class="q-options">${opts}</div>
      </div>`;
  }

  function renderKnowledgeCard(unit) {
    const bank = QUESTION_BANKS[unit.sectionKey] || [];
    const isDone = unit.status === 'satisfactory';
    const locked = unit.status === 'locked';
    const showAnswers = isDone;
    const cta = locked
      ? '<button class="btn btn-secondary" disabled>Locked</button>'
      : isDone
      ? '<button class="btn btn-ghost">View submission</button>'
      : unit.status === 'progress'
      ? '<button class="btn btn-primary">Continue assessment</button>'
      : '<button class="btn btn-primary">Start assessment</button>';
    const footMeta = isDone
      ? `<div class="submitted-info">Submitted <strong>${unit.submitted}</strong>${unit.score ? ' · Score <strong>' + unit.score + '</strong>' : ''} · Marked by Luke Gu</div>`
      : unit.status === 'progress'
      ? '<div class="submitted-info">In progress · last saved 14 May 2026</div>'
      : '<div class="submitted-info">No submission yet</div>';
    const questionsHtml = bank.map((q, i) => renderQuestion(q, i, locked, showAnswers)).join('');
    return `
      <div class="assess-card">
        <div class="assess-card-head">
          <div class="left">
            <span class="a-icon knowledge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </span>
            <div>
              <h2>Knowledge Questions</h2>
              <p class="a-desc">${bank.length} questions — multiple choice and short answer. Closed-book; allow ~45 minutes.</p>
            </div>
          </div>
          ${statusBadge(unit.status)}
        </div>
        <div class="assess-card-body">
          <div class="question-list-summary">
            <span><strong>${bank.length}</strong> questions · ~45 min · Pass mark <strong>70%</strong></span>
            <span>${isDone ? 'Submission viewable below' : 'Sample questions shown — full set unlocks when you start'}</span>
          </div>
          ${questionsHtml}
        </div>
        <div class="assess-card-foot">
          ${footMeta}
          ${cta}
        </div>
      </div>`;
  }

  function renderProjectCard(unit) {
    if (!unit.projectTask) return '';
    const isDone = unit.status === 'satisfactory' && unit.submittedFiles;
    const locked = unit.status === 'locked';
    const files = (unit.submittedFiles || []).map(([name, size]) => `
      <div class="uploaded-file">
        <span class="file-glyph"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
        <div class="file-info"><div class="file-name">${name}</div><div class="file-size">${size}</div></div>
        <a href="#" class="file-action"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download</a>
      </div>`).join('');
    const footMeta = isDone
      ? `<div class="submitted-info">Submitted <strong>${unit.submitted}</strong> · Marked by Luke Gu</div>`
      : '<div class="submitted-info">Submit when you\'ve completed the task. Files up to 1 GB; PDF, JPG, PNG, MP4 accepted.</div>';
    const cta = locked
      ? '<button class="btn btn-secondary" disabled>Locked</button>'
      : isDone
      ? '<button class="btn btn-ghost">View submission</button>'
      : '<button class="btn btn-primary" disabled>Submit for marking</button>';
    return `
      <div class="assess-card">
        <div class="assess-card-head">
          <div class="left">
            <span class="a-icon project">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
            </span>
            <div>
              <h2>Project Task — file upload</h2>
              <p class="a-desc">${unit.projectTask}</p>
            </div>
          </div>
          ${statusBadge(unit.status)}
        </div>
        <div class="assess-card-body">
          ${isDone
            ? `<div class="uploaded-files">${files}</div>`
            : locked
            ? '<div class="question-list-summary"><span>Upload unlocks when CPC40120 is complete.</span></div>'
            : `
              <label class="upload-zone" id="upload-zone">
                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.mp4,.docx,.xlsx,.zip" />
                <span class="upload-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </span>
                <h4>Drag &amp; drop your submission files here</h4>
                <p>or click to choose from your device</p>
                <span class="file-types">PDF · JPG · PNG · MP4 · DOCX · XLSX · ZIP — up to 1 GB each</span>
              </label>
              <div class="uploaded-files" id="uploaded-list"></div>
            `}
        </div>
        <div class="assess-card-foot">
          ${footMeta}
          ${cta}
        </div>
      </div>`;
  }

  function renderCriteria(unit) {
    // Generic performance criteria — three by sub-section.
    const criteriaBySection = {
      codes: [
        'Identify NCC class and applicable provisions for the project',
        'Cross-reference referenced Australian Standards and state variations',
        'Document the compliance pathway (DTS or Performance Solution) for each element',
      ],
      whs: [
        'Identify hazards using a documented method',
        'Apply the hierarchy of controls and produce a SWMS',
        'Monitor and review controls during the work',
      ],
      plans: [
        'Read and interpret architectural, structural and services drawings',
        'Cross-reference plans with specifications and schedules',
        'Identify and document conflicts or missing information',
      ],
      planning: [
        'Develop a documented project plan with scope, resources and schedule',
        'Apply critical-path and dependency analysis',
        'Monitor progress against the plan and report variances',
      ],
      estimating: [
        'Produce a first-principles estimate from drawings and specifications',
        'Compile and issue a tender package',
        'Evaluate returned tenders using a documented scoring method',
      ],
      contracts: [
        'Select an appropriate standard form of contract',
        'Prepare and administer the contract through to practical completion',
        'Document variations, EOTs and progress claims in accordance with the contract',
      ],
      structural: [
        'Identify the load path through a building',
        'Verify structural elements against the applicable Australian Standards',
        'Recognise the limits of standard solutions and when to engage an engineer',
      ],
      sustainability: [
        'Apply NCC energy-efficiency provisions to building design and construction',
        'Develop and implement an Environmental Management Plan',
        'Audit and report on environmental performance over the project lifecycle',
      ],
      business: [
        'Develop and document an operational plan with KPIs',
        'Implement project scope management with a documented baseline',
        'Build and maintain productive business relationships with key stakeholders',
      ],
      intro: [
        'Understand the structure of the CPC40120 course',
        'Locate course resources, your trainer and the help desk',
        'Demonstrate awareness of competency-based assessment',
      ],
    };
    const items = (criteriaBySection[unit.sectionKey] || []).map((c, i) => `
      <div class="criteria-item">
        <span class="num">${i + 1}.</span>
        <span>${c}</span>
      </div>`).join('');
    return `<div class="criteria-list">${items}</div>`;
  }

  function renderResources(unit) {
    return `
      <div class="criteria-list">
        <div class="criteria-item">
          <span class="num"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
          <div style="flex:1">
            <strong>${unit.code} — Learner Guide</strong>
            <div style="font-size:12px;color:var(--ac-text-muted);margin-top:2px">PDF · the primary reading for this unit</div>
          </div>
          <a href="#" class="btn btn-ghost btn-sm">Open</a>
        </div>
        <div class="criteria-item">
          <span class="num"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg></span>
          <div style="flex:1">
            <strong>Walkthrough Video</strong>
            <div style="font-size:12px;color:var(--ac-text-muted);margin-top:2px">~18 min · trainer commentary on the assessment task</div>
          </div>
          <a href="#" class="btn btn-ghost btn-sm">Watch</a>
        </div>
        <div class="criteria-item">
          <span class="num"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
          <div style="flex:1">
            <strong>Reference links</strong>
            <div style="font-size:12px;color:var(--ac-text-muted);margin-top:2px">NCC Online, Australian Standards (via SAI Global), Safe Work SA</div>
          </div>
          <a href="#" class="btn btn-ghost btn-sm">Open</a>
        </div>
      </div>`;
  }

  function renderNotFound(id) {
    return `
      <div class="unit-hero">
        <h1>Unknown unit: ${id || '(none)'}</h1>
        <p class="description">We couldn't find a unit with this identifier. <a href="course.html">Back to the Learning Plan</a>.</p>
      </div>`;
  }

  // ---------- Wire file upload UX ----------
  function wireFileUpload() {
    const zone = document.getElementById('upload-zone');
    if (!zone) return;
    const input = zone.querySelector('input[type="file"]');
    const list = document.getElementById('uploaded-list');
    function add(file) {
      const sizeKB = file.size / 1024;
      const sizeText = sizeKB > 1024 ? (sizeKB / 1024).toFixed(1) + ' MB' : Math.round(sizeKB) + ' KB';
      const row = el(`
        <div class="uploaded-file">
          <span class="file-glyph"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
          <div class="file-info"><div class="file-name">${file.name}</div><div class="file-size">${sizeText} · ready to submit</div></div>
          <span class="file-action"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Remove</span>
        </div>`);
      row.querySelector('.file-action').addEventListener('click', () => row.remove());
      list.appendChild(row);
      // Enable submit button
      const submit = document.querySelector('.assess-card .btn-primary');
      if (submit) submit.disabled = false;
    }
    input.addEventListener('change', e => {
      [...e.target.files].forEach(add);
    });
    ['dragenter', 'dragover'].forEach(evt => zone.addEventListener(evt, e => {
      e.preventDefault();
      zone.classList.add('dragover');
    }));
    ['dragleave', 'drop'].forEach(evt => zone.addEventListener(evt, e => {
      e.preventDefault();
      zone.classList.remove('dragover');
    }));
    zone.addEventListener('drop', e => {
      [...e.dataTransfer.files].forEach(add);
    });
  }

  // ---------- Wire tabs ----------
  function wireUnitTabs() {
    const tabs = document.querySelectorAll('.unit-tabs button');
    const panes = document.querySelectorAll('.unit-pane');
    tabs.forEach(t => t.addEventListener('click', () => {
      tabs.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      panes.forEach(p => p.style.display = 'none');
      t.classList.add('active');
      t.setAttribute('aria-selected', 'true');
      const id = t.dataset.tab;
      const pane = document.getElementById('pane-' + id);
      if (pane) pane.style.display = '';
    }));
  }

  // ---------- Main ----------
  function init() {
    const id = new URLSearchParams(location.search).get('u');
    const unit = UNITS[id];
    const root = document.getElementById('unit-root');
    if (!root) return;

    if (!unit) {
      root.innerHTML = renderNotFound(id);
      return;
    }

    // Update page title
    document.title = `${unit.code} — ${unit.title} — Alliance College`;
    const titleCrumb = document.getElementById('crumb-unit');
    if (titleCrumb) titleCrumb.textContent = `${unit.code}`;

    root.innerHTML = `
      ${renderHero(unit)}
      <div class="tabs unit-tabs" role="tablist">
        <button class="active" type="button" role="tab" data-tab="assess" aria-selected="true">Assessments</button>
        <button type="button" role="tab" data-tab="criteria" aria-selected="false">Performance Criteria</button>
        <button type="button" role="tab" data-tab="resources" aria-selected="false">Resources</button>
      </div>
      <div class="unit-pane" id="pane-assess">
        ${renderKnowledgeCard(unit)}
        ${renderProjectCard(unit)}
      </div>
      <div class="unit-pane" id="pane-criteria" style="display:none">
        ${renderCriteria(unit)}
      </div>
      <div class="unit-pane" id="pane-resources" style="display:none">
        ${renderResources(unit)}
      </div>
    `;

    wireFileUpload();
    wireUnitTabs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
