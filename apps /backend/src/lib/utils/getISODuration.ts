import { parse as parseDuration } from 'iso8601-duration';

function extractUnit(parsedDuration: any): string {
    if (parsedDuration.years) return 'years';
    if (parsedDuration.months) return 'months';
    if (parsedDuration.weeks) return 'weeks';
    if (parsedDuration.days) return 'days';
    // Extend this to hours, minutes, etc., if needed.
    return '';
}

function getDurationValue(parsedDuration: any): number {
    return (
        parsedDuration.years || 
        parsedDuration.months || 
        parsedDuration.weeks || 
        parsedDuration.days || 
        0
    );
}

export function calculateQuotePrice(duration: string, frequency: string, itemPrice: number): number {
    const parsedDuration = parseDuration(duration);
    const parsedFrequency = parseDuration(frequency);

    const durationUnit = extractUnit(parsedDuration);
    const frequencyUnit = extractUnit(parsedFrequency);

    if (durationUnit !== frequencyUnit) {
        throw new Error("Duration and frequency must be in the same unit.");
    }

    const timesToBeDelivered = getDurationValue(parsedDuration) / getDurationValue(parsedFrequency);
    const quotePrice = timesToBeDelivered * itemPrice;

    return quotePrice;
}

export function getRangeUsingDurationFrequency(duration: string, frequency: string,){
    const parsedDuration = parseDuration(duration);
    const parsedFrequency = parseDuration(frequency);

    const durationUnit = extractUnit(parsedDuration);
    const frequencyUnit = extractUnit(parsedFrequency);

    if (durationUnit !== frequencyUnit) {
        throw new Error("Duration and frequency must be in the same unit.");
    }

    const timesToBeDelivered = getDurationValue(parsedDuration) / getDurationValue(parsedFrequency);

    return timesToBeDelivered;
}


