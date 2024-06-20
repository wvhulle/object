export * from "./class.js";
export * from "./date.js";
export * from "./records.js";
export * from "./replace.js";
export * from "./traversal.js";
export * from "./decimal.js";

export type Nullable<T, K> = undefined extends T ? K : never;

export const removeNull = <S>(value: S | null): value is S => value != null;
export const removeUndefined = <S>(value: S | undefined): value is S =>
	value != undefined;

export type JavaScriptPrimitive = string | number | undefined | null | boolean;

export { MaybePromise } from "./function.js";

export type Undefined<T> = {
	[P in keyof T]: P extends undefined ? T[P] : never;
};

export type FilterFlags<Base, Condition> = {
	[Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};

export type AllowedNames<Base, Condition> = FilterFlags<
	Base,
	Condition
>[keyof Base];

export type OptionalKeys<T> = Exclude<
	keyof T,
	NonNullable<keyof SubType<Undefined<T>, never>>
>;
export type NullableKeys<T> = { [K in keyof T]-?: Nullable<T[K], K> }[keyof T];
export type NonNullableKeys<T> = {
	[K in keyof T]: null extends T[K]
		? never
		: undefined extends T[K]
			? never
			: K;
}[keyof T];

export type SubType<Base, Condition> = Pick<
	Base,
	AllowedNames<Base, Condition>
>;

export type NotUndefined<T> = {
	[key in keyof T]: T[key] extends undefined ? never : T[key];
};

export type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>;
		}
	: T;

export type NullableToOptional<T = unknown> = {
	[optionalKey in NullableKeys<T>]?: T[optionalKey];
} & { [requiredKey in NonNullableKeys<T>]: T[requiredKey] };

export const stringKeys = <T extends object>(obj: T) =>
	[...Object.getOwnPropertyNames(obj)] as (string & keyof T)[];

export const keys = <T extends NonNullable<object>>(obj: T): (keyof T)[] =>
	[
		...Object.getOwnPropertyNames(obj),
		...Object.getOwnPropertySymbols(obj),
	] as (keyof T)[];
