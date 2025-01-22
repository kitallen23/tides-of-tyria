import { lazy } from "react";

export const SettingsPage = lazy(() => import("@/views/settings/SettingsPage"));
export const HomePage = lazy(() => import("@/views/home/HomePage"));
export const ChecklistPage = lazy(
    () => import("@/views/checklist/ChecklistPage")
);

/**
 * Uncomment these to test skeletons
 */

// export const SettingsPage = () => {
//     throw new Promise(() => {});
// };
// export const HomePage = () => {
//     throw new Promise(() => {});
// };
// export const ChecklistPage = () => {
//     throw new Promise(() => {});
// };
