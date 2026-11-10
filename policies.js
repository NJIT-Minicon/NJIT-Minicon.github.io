const FAILED = "Sorry, this couldn't load. Try refreshing the page, or email us at [miniconservices@gmail.com](mailto:miniconservices@gmail.com).";

// Show a message instead of a 404 page or a blank page if something fails
async function getMD(name) {
    return await fetch(`policy/${name}.md`).then(r => r.ok ? r.text() : FAILED).catch(() => FAILED);
}

const PREAMBLE = document.querySelector("#preamble");
const TABS = document.querySelector("#policies");
const ACTIVE = document.querySelector("#active-policy");

const POLICIES = {
    "registration-general": {name: "Registration and General Rules"},
    "accessibility": {name: "Accessibility"},
    "health-safety": {name: "Health & Safety Policies"},
    "behavior-harassment": {name: "Anti-Harassment & Behavior Policy"},
    "filming-photography": {name: "Filming and Photography Policy"},
    "cosplay-dress": {name: "Cosplay Policy and Dress Code"},
    "weapons": {name: "Weapons Policy"}
}

let active;

// Fetch everything at once instead of one at a time
Promise.all(["preamble", ...Object.keys(POLICIES)].map(getMD)).then(([preamble, ...policies]) => {
    PREAMBLE.setHTMLUnsafe(marked.parse(preamble));
    // Read the hash now since it might have changed while loading
    active = location.hash.substring(1);
    for (const policy in POLICIES) {
        POLICIES[policy].content = marked.parse(policies.shift());
    }
    for (const policy in POLICIES) {
        const link = document.createElement("a");
        link.href = "#" + policy;
        link.innerText = POLICIES[policy].name;
        link.id = "link-" + policy;
        if (!active || !POLICIES[active] || active === policy) {
            active = policy;
            location.hash = policy;
            ACTIVE.setHTMLUnsafe(POLICIES[policy].content);
            link.classList.add("active");
        }
        TABS.appendChild(link);
    }
});

addEventListener("hashchange", () => {
    // Tabs aren't there until everything loads, the code above picks up the hash then
    if (!TABS.children.length) return;
    let newActive = location.hash.substring(1);
    if (!POLICIES[newActive]) {
        location.hash = active;
        return;
    }
    document.querySelector("#link-" + active).classList.remove("active");
    active = newActive;
    document.querySelector("#link-" + active).classList.add("active");
    ACTIVE.setHTMLUnsafe(POLICIES[active].content);
});