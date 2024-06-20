import type { NotUndefined } from "./index.js";

// import type { JavaScriptPrimitive } from '../index.js'

export const replaceKey = <
	InputObject extends object,
	RemovedKey extends keyof InputObject,
	ReplacingKey extends PropertyKey,
	OutputValue = unknown,
>(
	list: InputObject[],
	removedKey: RemovedKey,
	replacingKey: ReplacingKey,
	convertFunction: (originalValue: InputObject[RemovedKey]) => OutputValue,
): (Omit<InputObject, RemovedKey> & Record<ReplacingKey, OutputValue>)[] =>
	list.map((object) =>
		convertProperty(object, removedKey, replacingKey, convertFunction),
	);

export function drop<O, K extends keyof O>(
	object: O,
	...keys: K[]
): Omit<O, K> {
	if (typeof object !== "object") {
		throw new Error(
			`Expected an object but received ${JSON.stringify(
				object,
			)}. Cannot remove keys ${JSON.stringify(keys.map((k) => k.toString()))}`,
		);
	}

	if (object === null) {
		throw new Error(`Expected a non empty object but received null.`);
	}
	const copy = Object.assign({}, object);
	for (const k of keys) {
		delete copy[k];
	}
	return copy;
}

export const trim = (obj: Record<string, string>): Record<string, string> =>
	Object.keys(obj).reduce<Record<string, string>>((acc, curr) => {
		const current = obj[curr];

		if (current !== undefined) {
			acc[curr.toString().trim()] = current.toString().trim();
		}

		return acc;
	}, {});

export const mergeAllProperties = <
	Data extends object,
	RemovedKey1 extends keyof Data,
	RemovedKey2 extends Exclude<keyof Data, RemovedKey1>,
	ReplacingKey extends PropertyKey,
	V,
>(
	list: Data[],
	removedKey1: RemovedKey1,
	removedKey2: RemovedKey2,
	finalProperty: ReplacingKey,
	mergeFunction: (value1: Data[RemovedKey1], value2: Data[RemovedKey2]) => V,
) =>
	list.map((obj) =>
		mergeKeyValues(obj, removedKey1, removedKey2, finalProperty, mergeFunction),
	);

export const renameAllProperties = <
	T extends Record<string, unknown>,
	OldKey extends keyof T,
	NewKey extends string,
>(
	list: T[],
	oldName: OldKey,
	newName: NewKey,
	scale: number,
): (Omit<T, OldKey> & Record<NewKey, number>)[] =>
	list.map((obj) => renameProperty(obj, oldName, newName, scale));

export const dropAllProperties = <
	T extends Record<string, unknown>,
	K extends keyof T,
>(
	list: T[],
	property: K,
): Omit<T, K>[] =>
	list.map((obj) => {
		delete obj[property];
		return obj;
	});

export function renameProperty<
	T extends Record<string, unknown>,
	OldKey extends keyof T,
	NewKey extends string,
>(
	object: T,
	oldName: OldKey,
	newName: NewKey,
	scale: number,
): Omit<T, OldKey> & Record<NewKey, number> {
	const value = object[oldName];
	delete object[oldName];
	if (typeof value === "number") {
		return { ...object, [newName]: value * scale };
	} else if (typeof value === "string") {
		return { ...object, [newName]: parseInt(value) };
	} else {
		throw new Error(
			`The value of ${oldName.toString()} should be either a number or a string.`,
		);
	}
}

export function mergeKeyValues<
	T,
	K1 extends keyof T,
	K2 extends Exclude<keyof T, K1>,
	K3 extends PropertyKey,
	V,
>(
	obj: T,
	key1: K1,
	key2: K2,
	newKey: K3,
	mergeFn: (a: T[K1], b: T[K2]) => V,
): Omit<T, K1 | K2> & Record<K3, V> {
	function omitDelete<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
		for (const k of keys) delete obj[k];
		return obj;
	}
	const mergedValue = mergeFn(obj[key1], obj[key2]);
	const copy = { ...obj };
	const extra = { [newKey]: mergedValue } as Record<K3, V>;
	const x = omitDelete(copy, [key1, key2]);
	//  ^? Omit<T, K1 | K2>
	const y = Object.assign(x, extra);
	//  ^? Omit<T, K1 | K2> & Record<K3, V>
	return y;
}

export function convertProperty<
	Data extends object,
	NewValueType,
	RemovedKey extends keyof Data,
>(
	obj: Data,
	oldProperty: RemovedKey,
	newProperty: PropertyKey,
	f: (oldValue: Data[RemovedKey]) => NewValueType,
): Omit<Data, RemovedKey> & Record<PropertyKey, NewValueType> {
	const newPropertyValue = f(obj[oldProperty]);
	delete obj[oldProperty];
	return { ...obj, [newProperty]: newPropertyValue };
}
export const removeUndefinedValues: <T>(obj: T) => NotUndefined<T> = <T>(
	obj: T,
) => {
	if (obj) {
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				if ((obj[key] as unknown) === undefined) {
					delete obj[key];
				}
			}
		}
	}
	return obj as NotUndefined<T>;
};
