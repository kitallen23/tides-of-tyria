import { Helmet } from "react-helmet";
import META_EVENTS from "@/utils/meta_events";

const getIndexableEventNames = () => {
    const eventNames = new Set();
    META_EVENTS.forEach(region => {
        region.sub_areas.forEach(area => {
            if (area.disableIndexing) {
                return;
            }
            area.phases.forEach(({ name }) => {
                eventNames.add(name);
            });
        });
    });
    return Array.from(eventNames);
};

const INDEXABLE_EVENT_NAMES = getIndexableEventNames();
const JSON_LD = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Tides of Tyria",
    url: "https://tides-of-tyria.chuggs.net",
    description:
        "Manage your GW2 (Guild Wars 2) events and goals with this easy-to-use timer app.",
    mainEntity: {
        "@type": "ItemList",
        itemListElement: INDEXABLE_EVENT_NAMES.map((eventName, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
                "@type": "Thing",
                name: eventName,
                description: `Details and timers for the ${eventName} event in Guild Wars 2.`,
            },
        })),
    },
};

const JsonLd = () => (
    <>
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(JSON_LD)}
            </script>
        </Helmet>
        <div style={{ display: "none" }}>
            <ul>
                {INDEXABLE_EVENT_NAMES.map((name, i) => (
                    <li key={i}>{name}</li>
                ))}
            </ul>
        </div>
    </>
);

export default JsonLd;
