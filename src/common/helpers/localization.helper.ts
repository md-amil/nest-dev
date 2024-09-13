const AVAILABLE_TRANSLATIONS = [
    "hi_IN",
    "hi",
    "mr",
    "bn",
    "te",
    "kn",
    "ta",
];

export function isDefault(locale: string) {
    if (!locale || !AVAILABLE_TRANSLATIONS.includes(locale)) {
        return true;
    }

    return false;
}

function suffixLocale(locale: string) {
    return `-${locale}__translation`;
}

export function localizeSlug(slug: string, locale?: string) {
    if (isDefault(locale)) {
        return slug;
    }

    return slug + suffixLocale(locale);
}

export function normalizeSlug(slug: string, locale: string) {
    if (isDefault(locale)) {
        return slug;
    }

    // We need to provide back support for the old 4 chars locale.
    // TODO: Temp remove after all the translations are completed.
    if (!slug.includes('__translation')) {
        return slug.replace('-hi_in', '');
    }

    return slug.replace(suffixLocale(locale), '');
}
