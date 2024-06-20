import { hasConstructor } from "./class.js";
import { replaceTypeRecursively } from "./replace.js";

import { Decimal } from "decimal.js";

export const decimalToString = <T>(operation: T) =>
	replaceTypeRecursively<T, Decimal, string>(
		operation,
		(v): v is Decimal =>
			typeof v === "object" && v !== null && hasConstructor(v, Decimal),
		(v) => {
			if (hasConstructor(v, Decimal)) {
				return v.toSignificantDigits().toString();
			} else {
				throw new Error(
					`Received ${JSON.stringify(v)} but expected a Decimal.`,
				);
			}
		},
	);
