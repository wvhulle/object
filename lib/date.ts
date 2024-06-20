import isNil from "lodash-es/isNil.js";

export const dateFormat = "DD-MM-YYYY";

export const timeFormat = "HH:mm:ss.SSS";
export const dateTimeFormat = `${dateFormat} ${timeFormat}`;

export const isValidDate = (d: unknown): d is Date =>
	d instanceof Date && !isNaN(d.getTime());

export const formatter = new Intl.RelativeTimeFormat("en", {
	numeric: "auto",
	style: "narrow",
});

export const DIVISIONS: {
	amount: number;
	name: Intl.RelativeTimeFormatUnit;
}[] = [
	{ amount: 60, name: "seconds" },
	{ amount: 60, name: "minutes" },
	{ amount: 24, name: "hours" },
	{ amount: 7, name: "days" },
	{ amount: 4.34524, name: "weeks" },
	{ amount: 12, name: "months" },
	{ amount: Number.POSITIVE_INFINITY, name: "years" },
];

export function formatTimeAgo(date: Date, now: Date) {
	let duration = (date.getTime() - now.getTime()) / 1000;

	for (const division of DIVISIONS) {
		// console.log(`Are the current amount ${Math.abs(duration)} of ${DIVISIONS[i].name} smaller than the amount of ${DIVISIONS[i].name} in a ${DIVISIONS[i + 1]?.name}`)
		if (isNil(division.amount) || Math.abs(duration) < division.amount) {
			return formatter.format(Math.round(duration), division.name);
		}
		duration /= division.amount;
	}
	return undefined;
}
