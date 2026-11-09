async function getMD(name) {
    return await fetch(`policy/${name}.md`).then(r => r.text());
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

let active = location.hash.substring(1);

getMD("preamble").then(async (preamble) => {
    PREAMBLE.setHTMLUnsafe(marked.parse(preamble));
    for (const policy in POLICIES) {
        POLICIES[policy].content = marked.parse(await getMD(policy));
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