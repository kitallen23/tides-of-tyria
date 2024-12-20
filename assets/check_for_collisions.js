import META_EVENTS from "../src/utils/meta_events.js";

/**
 * Checks for collisions among recurring and fixed-time events.
 * @param {Array} events - List of event objects with either start, duration, frequency or times, duration.
 * @returns {Array} - List of colliding event pairs.
 */
function findCollidingEvents(events) {
    const minutesInDay = 1440;
    const timeline = Array(minutesInDay).fill(null);
    const collisions = [];

    events.forEach(event => {
        // Determine if the event is recurring or fixed-time
        if ("frequency" in event && "start" in event) {
            // Recurring Event
            for (let t = event.start; t < minutesInDay; t += event.frequency) {
                for (let i = 0; i < event.duration; i++) {
                    const currentTime = (t + i) % minutesInDay;
                    if (timeline[currentTime]) {
                        collisions.push([timeline[currentTime], event.key]);
                    } else {
                        timeline[currentTime] = event.key;
                    }
                }
            }
        } else if ("times" in event && Array.isArray(event.times)) {
            // Fixed-Time Event
            event.times.forEach(time => {
                for (let i = 0; i < event.duration; i++) {
                    const currentTime = (time + i) % minutesInDay;
                    if (timeline[currentTime]) {
                        collisions.push([timeline[currentTime], event.key]);
                    } else {
                        timeline[currentTime] = event.key;
                    }
                }
            });
        } else {
            console.warn(
                `Event "${event.key}" is missing required properties.`
            );
        }
    });

    // Remove duplicate pairs
    return collisions.filter(
        (pair, index, self) =>
            index ===
            self.findIndex(
                p =>
                    (p[0] === pair[0] && p[1] === pair[1]) ||
                    (p[0] === pair[1] && p[1] === pair[0])
            )
    );
}

console.info(
    `--------------------------------------------------------------------------------`
);
console.info(
    `-- Collision checker -----------------------------------------------------------`
);
console.info(
    `--------------------------------------------------------------------------------`
);
let numRegionsWithCollisions = 0;
META_EVENTS.forEach(region => {
    const regionCollisions = [];

    region.sub_areas.forEach(area => {
        const collisions = findCollidingEvents(area.phases);

        if (collisions.length) {
            regionCollisions.push({
                area: area.key,
                collisions,
            });
        }
    });

    if (regionCollisions.length) {
        console.info(`## Region: `, region.key);
        regionCollisions.forEach(({ area, collisions }) => {
            console.info(`### Area: `, area);
            console.info(collisions);
        });
        console.info(`---`);
        numRegionsWithCollisions++;
    }
});
if (numRegionsWithCollisions === 0) {
    console.info(`No collisions!`);
}
