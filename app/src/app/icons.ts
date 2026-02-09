/**
 * Global Icon Registry for Pitstop Planner
 * Import this in app.component.ts to register all icons globally
 */

import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';

/**
 * Register all Ionicons globally
 * This allows you to use any icon name in templates without individual registration
 */
export function registerIcons() {
    // Convert all icon names from camelCase to kebab-case for Ionic
    const icons = Object.keys(allIcons).reduce((acc, key) => {
        acc[key] = allIcons[key as keyof typeof allIcons];
        return acc;
    }, {} as { [key: string]: string });

    addIcons(icons);
}

/**
 * Automotive-specific icons commonly used in the app
 * Pre-registered subset for better tree-shaking if you prefer selective imports
 */
export const automotiveIcons = {
    // Performance & Speed
    speedometer: allIcons.speedometer,
    speedometerOutline: allIcons.speedometerOutline,
    flash: allIcons.flash,
    flashOutline: allIcons.flashOutline,

    // Vehicle & Garage
    carSport: allIcons.carSport,
    carSportOutline: allIcons.carSportOutline,
    car: allIcons.car,
    carOutline: allIcons.carOutline,

    // Maintenance & Tools
    construct: allIcons.construct,
    constructOutline: allIcons.constructOutline,
    hammer: allIcons.hammer,
    hammerOutline: allIcons.hammerOutline,
    build: allIcons.build,
    buildOutline: allIcons.buildOutline,

    // Status & Alerts
    checkmarkCircle: allIcons.checkmarkCircle,
    checkmarkCircleOutline: allIcons.checkmarkCircleOutline,
    warning: allIcons.warning,
    warningOutline: allIcons.warningOutline,
    alertCircle: allIcons.alertCircle,
    alertCircleOutline: allIcons.alertCircleOutline,

    // Navigation & UI
    settings: allIcons.settings,
    settingsOutline: allIcons.settingsOutline,
    informationCircle: allIcons.informationCircle,
    informationCircleOutline: allIcons.informationCircleOutline,
    close: allIcons.close,
    closeCircle: allIcons.closeCircle,
    checkmark: allIcons.checkmark,

    // Calendar & Schedule
    calendar: allIcons.calendar,
    calendarOutline: allIcons.calendarOutline,
    time: allIcons.time,
    timeOutline: allIcons.timeOutline,

    // Lists & Organization
    list: allIcons.list,
    listOutline: allIcons.listOutline,
    documentText: allIcons.documentText,
    documentTextOutline: allIcons.documentTextOutline,

    // Colors & Theme
    colorPalette: allIcons.colorPalette,
    colorPaletteOutline: allIcons.colorPaletteOutline,
};

/**
 * Register only automotive-specific icons
 * Better for bundle size if you don't need all icons
 */
export function registerAutomotiveIcons() {
    addIcons(automotiveIcons);
}
