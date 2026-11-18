const FAILED = "Sorry, this couldn't load. Try refreshing the page, or email us at [miniconservices@gmail.com](mailto:miniconservices@gmail.com).";

// Show a message instead of a 404 page or a blank page if something fails
async function getMD(name) {
    return await fetch(`policy/${name}.md`).then(r => r.ok ? r.text() : FAILED).catch(() => FAILED);
}

const PREAMBLE = document.querySelector("#preamble");
const TABS = document.querySelector("#policies");
const ACTIVE = document.querySelector("#active-policy");

let active;

function initMD(mdList, preambleName) {
    // Fetch everything at once instead of one at a time
    let promiseList = Object.keys(mdList);
    if (preambleName) promiseList.unshift(preambleName);
    Promise.all(promiseList.map(getMD)).then((rawMD) => {
        if (preambleName) {
            PREAMBLE?.setHTMLUnsafe(marked.parse(rawMD.shift()));
        }
        // Read the hash now since it might have changed while loading
        active = location.hash.substring(1);
        for (const md in mdList) {
            mdList[md].content = marked.parse(rawMD.shift());
        }
        for (const md in mdList) {
            const link = document.createElement("a");
            link.href = "#" + md;
            link.innerText = mdList[md].name;
            link.id = "link-" + md;
            if (!active || !mdList[active] || active === md) {
                active = md;
                location.hash = md;
                ACTIVE.setHTMLUnsafe(mdList[md].content);
                link.classList.add("active");
            }
            TABS.appendChild(link);
        }
    });

    addEventListener("hashchange", () => {
        // Tabs aren't there until everything loads, the code above picks up the hash then
        if (!TABS.children.length) return;
        let newActive = location.hash.substring(1);
        if (!mdList[newActive]) {
            location.hash = active;
            return;
        }
        document.querySelector("#link-" + active).classList.remove("active");
        active = newActive;
        document.querySelector("#link-" + active).classList.add("active");
        ACTIVE.setHTMLUnsafe(mdList[active].content);
    });
}