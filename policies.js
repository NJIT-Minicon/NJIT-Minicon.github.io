async function getMD(name) {
    return await fetch(`policy/${name}.md`).then(r => r.text());
}

const PREAMBLE = document.querySelector("#preamble");
const TABS = document.querySelector("#policies");
const ACTIVE = document.querySelector("#active-policy");

const POLICIES = {
    "accessibility": {name: "Accessibility"},
    "behavior-harassment": {name: "Anti-Harassment & Behavior Policy"},
    "health-safety": {name: "Health & Safety Policies"},
    "exhibitor-artist-alley": {name: "Exhibitor and Artist Alley Policies"},
    "filming-photography": {name: "Filming and Photography Policy"},
    "weapons": {name: "Weapons Policy"}
}

let active = location.hash.substring(1);

getMD("preamble").then(async (preamble) => {
    PREAMBLE.setHTMLUnsafe(marked.parse(preamble));
    for (const policy in POLICIES) {
        POLICIES[policy].content = marked.parse(await getMD(policy));
    }
    for (const policy in POLICIES) {
        if (!active || !POLICIES[active] || active === policy) {
            active = policy;
            location.hash = policy;
            ACTIVE.setHTMLUnsafe(POLICIES[policy].content);
        }
        const link = document.createElement("li");
        link.setHTMLUnsafe(`<a href="#${policy}">${POLICIES[policy].name}</a>`);
        TABS.appendChild(link);
    }
});

addEventListener("hashchange", () => {
    let newActive = location.hash.substring(1);
    if (!POLICIES[newActive]) {
        location.hash = active;
        return;
    }

    active = newActive;
    ACTIVE.setHTMLUnsafe(POLICIES[active].content);
});