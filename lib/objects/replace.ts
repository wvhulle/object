import { keys } from './index.js'

export type Replace<Type, From, To> = Type extends object
	? Type extends (infer A)[]
		? Replace<A, From, To>[]
		: Type extends (...args: unknown[]) => unknown
		? Type
		: Type extends Record<string | number, unknown>
		? { [K in keyof Type]: Replace<Type[K], From, To> }
		: Type extends From
		? To
		: Type
	: Type
// type Type = Date | null;
// type Replaced = Replace<Type, Date, string>; // string | null

export function replaceTypeRecursively<T, OldType extends object, NewType>(
	obj: T,
	oldTypeGuard: (value: unknown) => value is OldType,
	newTypeCreator: (value: OldType) => NewType
): Replace<T, OldType, NewType> {
	if (obj === null || obj === undefined) {
		return obj as Replace<T, OldType, NewType>
	} else if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
		return obj as Replace<T, OldType, NewType>
	} else {
		if (obj instanceof Array) {
			return obj.map(<A>(value: A) =>
				replaceTypeRecursively<A, OldType, NewType>(value, oldTypeGuard, newTypeCreator)
			) as Replace<T, OldType, NewType>
		} else if (Object.getPrototypeOf(obj) === Object.prototype) {
			const result = {} as {
				[K in keyof NonNullable<T>]: Replace<NonNullable<T>[K], OldType, NewType>
			}

			keys(obj as object).forEach(<K extends keyof NonNullable<T>>(key: K) => {
				if (Object.prototype.hasOwnProperty.call(obj, key)) {
					const value = obj[key] as NonNullable<T>[K]

					if (oldTypeGuard(value)) {
						result[key] = newTypeCreator(value) as Replace<
							NonNullable<T>[K],
							OldType,
							NewType
						>
					} else if (typeof value === 'object' && value) {
						result[key] = replaceTypeRecursively<
							NonNullable<T>[K] & object,
							OldType,
							NewType
						>(value, oldTypeGuard, newTypeCreator)
					} else {
						result[key] = value as Replace<NonNullable<T>[K], OldType, NewType>
					}
				}
			})

			return result as Replace<T, OldType, NewType>
		} else {
			return obj as Replace<T, OldType, NewType>
		}
	}
}
