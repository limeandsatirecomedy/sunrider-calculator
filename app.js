/* ===========================================================
   SUNRIDER INDIA
   Infinity Compensation Estimator
   Version 2.0
   Compensation Plan 2025
=========================================================== */


/* ===========================================================
   RANKS
=========================================================== */

const ranks = [
    "IBO",
    "Star",
    "Star Prime",
    "Star Elite",
    "Ace",
    "Ace Prime",
    "Ace Elite",
    "Ace Royal",
    "Hero",
    "Hero Elite",
    "Hero Royal",
    "Icon",
    "Icon Elite",
    "Icon Royal"
];

const rankIndex = Object.fromEntries(
    ranks.map((r, i) => [r, i])
);


/* ===========================================================
   UNILEVEL %
=========================================================== */

const uni = [

    [0,0,0,0,0],

    [5,0,0,0,0],

    [7,0,0,0,0],

    [9,2,0,0,0],

    [10,4,0,0,0],

    [10,5,2,0,0],

    [10,6,4,0,0],

    [10,8,5,2,0],

    [10,8,5,2,2],

    [10,8,5,2,2],

    [10,8,5,2,2],

    [10,8,5,2,2],

    [10,8,5,2,2],

    [10,8,5,2,2]

];


/* ===========================================================
   FAST START BONUS
=========================================================== */

const fast = {

    "Star Prime":2500,

    "Star Elite":5000,

    "Ace":8000,

    "Ace Prime":11000,

    "Ace Elite":13500

};


/* ===========================================================
   DEVELOPMENT BONUS
=========================================================== */

const development = {

    ace:1800,

    prime:3600,

    elite:4800,

    royal:6000

};


/* ===========================================================
   DOM HELPERS
=========================================================== */

const q = selector => document.querySelector(selector);

const n = selector => {

    const el = q(selector);

    if(!el) return 0;

    return Math.max(
        0,
        Number(el.value) || 0
    );

};


/* ===========================================================
   AVERAGE VALUE
=========================================================== */

function averageValue(){

    const avg = Number(
        q("#avg-value").value
    );

    return avg > 0 ? avg : 38;

}


/* ===========================================================
   MONEY FORMAT
=========================================================== */

function money(value){

    return new Intl.NumberFormat(

        "en-IN",

        {

            style:"currency",

            currency:"INR",

            minimumFractionDigits:2

        }

    ).format(value);

}


/* ===========================================================
   POPULATE DROPDOWNS
=========================================================== */

function fillDropdowns(){

    const options = ranks
        .map(r => `<option>${r}</option>`)
        .join("");

    q("#title").innerHTML = options;

    q("#career-title").innerHTML = options;

    q("#fast-rank").innerHTML =
    `<option value="">Select Promotion</option>` +
    Object.keys(fast)
        .map(r => `<option value="${r}">${r}</option>`)
        .join("");

}


/* ===========================================================
   OUTPUT OBJECT
=========================================================== */

const out = {

    retail:0,

    fast:0,

    aceRoyal:0,

    unilevel:0,

    development:0,

    checkMatch:0,

    turbo:0,

    icon:0

};


/* ===========================================================
   MAIN CALCULATOR
=========================================================== */

function calculate(e){

    if(e){

        e.preventDefault();

    }

    const avg = averageValue();

    const title = q("#title").value;

    const titleIndex = rankIndex[title];
    /* ======================================================
       PERSONAL SALES COMMISSION
    ====================================================== */

    const pv = n("#retail-pv");

    let retailRate = 0;

    if (pv >= 2500) {

        retailRate = 15;

    } else if (pv >= 2000) {

        retailRate = 10;

    } else if (pv >= 1000) {

        retailRate = 8;

    } else if (pv >= 400) {

        retailRate = 5;

    } else if (pv >= 150) {

        retailRate = 3;

    }

    out.retail = pv * avg * retailRate / 100;

    q("#retail-result").textContent = money(out.retail);

    q("#retail-note").textContent =
        `${pv} PV × ₹${avg.toFixed(2)} × ${retailRate}% = ${money(out.retail)}`;



    /* ======================================================
       FAST START BONUS
    ====================================================== */

   let fastBonus = 0;

const selectedPromotion = q("#fast-rank").value;

if (
    selectedPromotion !== "" &&
    q("#fast-time").value === "yes"
) {
    fastBonus = fast[selectedPromotion] || 0;
}

    out.fast = fastBonus;

    q("#fast-result").textContent = money(out.fast);

    const sponsorMatch =
        q("#fast-sponsor").value === "yes"
            ? fastBonus
            : 0;

    q("#fast-note").textContent =
        `Fast Start: ${money(out.fast)}  |  Sponsor Match: ${money(sponsorMatch)} (reference only)`;



    /* ======================================================
       ACE ROYAL ADVANCEMENT
    ====================================================== */

    const advancements = n("#ace-advances");

    const matching = n("#ace-matches");

    out.aceRoyal =
        (advancements + matching) * 25000;

    q("#ace-result").textContent =
        money(out.aceRoyal);
    /* ======================================================
       UNILEVEL BONUS
    ====================================================== */

    out.unilevel = 0;

    for (let level = 0; level < 5; level++) {

        const pv = n(`#l${level + 1}`);

        const rate = uni[titleIndex][level];

        out.unilevel +=

            pv *

            avg *

            rate /

            100;

    }

    q("#unilevel-result").textContent =

        money(out.unilevel);

    q("#unilevel-note").textContent =

        "Calculated using: Level PV × Average ₹/PV × Applicable %";



    /* ======================================================
       DEVELOPMENT BONUS
    ====================================================== */

    const aceLegs = n("#dev-ace");

    const acePrimeLegs = n("#dev-prime");

    const aceEliteLegs = n("#dev-elite");

    const aceRoyalLegs = n("#dev-royal");



    out.development =

        (aceLegs * development.ace) +

        (acePrimeLegs * development.prime) +

        (aceEliteLegs * development.elite) +

        (aceRoyalLegs * development.royal);



    q("#development-result").textContent =

        money(out.development);



    q("#development-note").textContent =

        `Ace (${aceLegs}) × ₹${development.ace.toLocaleString("en-IN")}
         | Ace Prime (${acePrimeLegs}) × ₹${development.prime.toLocaleString("en-IN")}
         | Ace Elite (${aceEliteLegs}) × ₹${development.elite.toLocaleString("en-IN")}
         | Ace Royal (${aceRoyalLegs}) × ₹${development.royal.toLocaleString("en-IN")}`;

    /* ======================================================
       CHECK MATCH BONUS
    ====================================================== */

    out.checkMatch = 0;

    const isHeroOrAbove = titleIndex >= rankIndex["Hero"];

    if (isHeroOrAbove) {

        const eligibleTen = n("#match-ten");

        const eligibleFifteen = n("#match-fifteen");

        const generations =
            titleIndex - rankIndex["Hero"] + 1;

        const maxPayout =
            generations * 60000;

        const calculatedMatch =

            (eligibleTen * 0.10) +

            (eligibleFifteen * 0.15);

        out.checkMatch = Math.min(

            calculatedMatch,

            maxPayout

        );

        q("#check-note").textContent =

            `Hero Generation Limit: ${generations}
             | Maximum Check Match: ${money(maxPayout)}`;

    }

    else{

        q("#check-note").textContent =

            "Check Match Bonus is available only for Hero and above.";

    }

    q("#check-result").textContent =

        money(out.checkMatch);



    /* ======================================================
       TURBO INFINITY BONUS
    ====================================================== */

    out.turbo = 0;

    if(isHeroOrAbove){

        const cv = n("#turbo-cv");

        out.turbo =

            cv * 0.005;

    }

    q("#turbo-result").textContent =

        money(out.turbo);



    /* ======================================================
       ICON BONUS
    ====================================================== */

    out.icon = 0;

    const iconRank =

        q("#icon-rank").value;

    const qualifiedMonths =

        n("#icon-months");



    const iconTable = {

        none : {

            total : 0,

            months : 0

        },

        icon : {

            total : 600000,

            months : 5

        },

        elite : {

            total : 1200000,

            months : 8

        },

        royal : {

            total : 3000000,

            months : 12

        }

    };



    const plan = iconTable[iconRank];



    if(plan.months > 0){

        const payableMonths = Math.min(

            qualifiedMonths,

            plan.months

        );

        const monthlyInstallment =

            plan.total /

            plan.months;

        out.icon =

            payableMonths *

            monthlyInstallment;

        q("#icon-note").textContent =

            `${payableMonths} of ${plan.months}
             qualified month(s).`;

    }

    else{

        q("#icon-note").textContent =

            "No Icon Bonus selected.";

    }



    q("#icon-result").textContent =

        money(out.icon);
    /* ======================================================
       GRAND TOTAL
    ====================================================== */

    const total =

        out.retail +

        out.fast +

        out.aceRoyal +

        out.unilevel +

        out.development +

        out.checkMatch +

        out.turbo +

        out.icon;



    q("#total").textContent = money(total);

const heroTotal = q("#grandTotal");
if(heroTotal){
    heroTotal.textContent = money(total);
}
/* ---------- HERO SUMMARY ---------- */

const paidAs = q("#summaryPaidAs");
if (paidAs) {
    paidAs.textContent = q("#title").value;
}

const career = q("#summaryCareer");
if (career) {
    career.textContent = q("#career-title").value;
}

const average = q("#summaryAverage");
if (average) {
    average.textContent = averageValue().toFixed(2);
}
const heroPaid = q("#heroPaidAs");
if(heroPaid){
    heroPaid.textContent = q("#title").value;
}

const heroCareer = q("#heroCareer");
if(heroCareer){
    heroCareer.textContent = q("#career-title").value;
}

const heroAverage = q("#heroAverage");
if(heroAverage){
    heroAverage.textContent = "₹" + averageValue().toFixed(2);
}



    /* ======================================================
       BREAKDOWN
    ====================================================== */

    const breakdown = q("#breakdown");

if (breakdown) {
    breakdown.innerHTML = `

        <div class="line">

            <span>Personal Sales Commission</span>

            <strong>${money(out.retail)}</strong>

        </div>

        <div class="line">

            <span>Fast Start Bonus</span>

            <strong>${money(out.fast)}</strong>

        </div>

        <div class="line">

            <span>Ace Royal Advancement</span>

            <strong>${money(out.aceRoyal)}</strong>

        </div>

        <div class="line">

            <span>Unilevel Bonus</span>

            <strong>${money(out.unilevel)}</strong>

        </div>

        <div class="line">

            <span>Development Bonus</span>

            <strong>${money(out.development)}</strong>

        </div>

        <div class="line">

            <span>Check Match Bonus</span>

            <strong>${money(out.checkMatch)}</strong>

        </div>

        <div class="line">

            <span>Turbo Infinity Bonus</span>

            <strong>${money(out.turbo)}</strong>

        </div>

        <div class="line">

            <span>Icon Bonus</span>

            <strong>${money(out.icon)}</strong>

        </div>

        <hr>

        <div class="line total">

            <span>Total Estimated Payout</span>

            <strong>${money(total)}</strong>

        </div>

    `;

}   // <-- End calculate()



/* ======================================================
   RESET
====================================================== */

q("#reset-calculator")?.addEventListener(

    "click",

    () => {

        q("#calculator").reset();

        calculate();

    }

);



/* ======================================================
   PRINT
====================================================== */

q("#print-report")?.addEventListener(

    "click",

    () => window.print()

);


/* ======================================================
   PDF EXPORT
====================================================== */

q("#download-pdf")?.addEventListener("click", () => {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const line = (text, x, y, size = 11, bold = false) => {
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(size);
        doc.text(text, x, y);
    };

    let y = 18;

    /* ---------- Header ---------- */

    line("SUNRIDER INDIA", 20, y, 18, true);
    y += 8;

    line("Infinity Compensation Calculator", 20, y, 14, true);
    y += 7;

    line("Compensation Estimate Report", 20, y, 11);
    y += 10;

    doc.line(20, y, 190, y);
    y += 10;

    /* ---------- Date ---------- */

    line("Generated:", 20, y, 11, true);
    line(new Date().toLocaleString(), 55, y);
    y += 10;

    /* ---------- Business Profile ---------- */

    line("BUSINESS PROFILE", 20, y, 13, true);
    y += 8;

    line("Monthly Paid-As Title:", 20, y, 11, true);
    line(q("#title").value, 80, y);
    y += 7;

    line("Career Title:", 20, y, 11, true);
    line(q("#career-title").value, 80, y);
    y += 7;

    line("Average ₹ / PV:", 20, y, 11, true);
    line(q("#avg-value").value, 80, y);
    y += 12;

    doc.line(20, y, 190, y);
    y += 10;

    /* ---------- Bonus Breakdown ---------- */

    line("BONUS BREAKDOWN", 20, y, 13, true);
    y += 8;

    const rows = [

        ["Retail Sales Bonus", q("#retail-result").textContent],

        ["Fast Start Bonus", q("#fast-result").textContent],

        ["Ace Royal Advancement", q("#ace-result").textContent],

        ["Unilevel Bonus", q("#unilevel-result").textContent],

        ["Development Bonus", q("#development-result").textContent],

        ["Monthly Fixed Bonus", q("#fixed-result").textContent],

        ["Check Match Bonus", q("#check-result").textContent],

        ["Turbo Infinity Bonus", q("#turbo-result").textContent],

        ["Icon Bonus", q("#icon-result").textContent]

    ];

    rows.forEach(r => {

        line(r[0], 20, y);

        line(r[1], 170, y, 11, true);

        y += 7;

    });

    y += 5;

    doc.line(20, y, 190, y);

    y += 10;

    /* ---------- Total ---------- */

    line("TOTAL ESTIMATED MONTHLY PAYOUT", 20, y, 14, true);

    y += 10;

    line(q("#total").textContent, 20, y, 20, true);

    y += 18;

    /* ---------- Disclaimer ---------- */

    doc.setDrawColor(180);

    doc.rect(20, y, 170, 28);

    y += 7;

    line(
        "This calculator provides estimated values only.",
        24,
        y
    );

    y += 6;

    line(
        "Final commissions are determined by",
        24,
        y
    );

    y += 6;

    line(
        "Sunrider India according to qualification",
        24,
        y
    );

    y += 6;

    line(
        "and official compensation policies.",
        24,
        y
    );

    /* ---------- Save ---------- */

    const today = new Date().toISOString().slice(0,10);

    doc.save(`Sunrider_Compensation_Report_${today}.pdf`);

});


/* ======================================================
   INITIALIZE
====================================================== */

fillDropdowns();

calculate();



q("#calculator").addEventListener(

    "submit",

    calculate

);



q("#calculator").addEventListener(

    "input",

    calculate

);



q("#calculator").addEventListener(

    "change",

    calculate

);



if("serviceWorker" in navigator){

    navigator.serviceWorker.register(

        "./service-worker.js"

    );

}
