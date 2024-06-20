export function constructors<T>(obj: object) {
	let currentPrototype = obj.constructor as (new (...args: unknown[]) => T) | undefined
	const constructors: string[] = []
	let lastPrototype = undefined as NonNullable<object> | undefined
	while (currentPrototype && lastPrototype !== currentPrototype) {
		lastPrototype = currentPrototype
		//   console.log('Current Prototype:', currentPrototype);
		constructors.push(currentPrototype.name)
		//   console.log('Constructor:', currentPrototype.constructor);

		currentPrototype = Object.getPrototypeOf(currentPrototype) as
			| (new (...args: unknown[]) => T)
			| undefined
	}

	return constructors.filter(c => c && typeof c === 'string' && c.length > 0)
}

export function hasConstructor<Args extends unknown[], Class extends object>(
	obj: unknown,
	constructor: string | (new (...args: Args) => Class)
): obj is Class {
	if (typeof obj !== 'object' || obj === null) {
		return false
	} else {
		if (typeof constructor === 'string') {
			return constructors(obj).includes(constructor)
		} else {
			return constructors(obj).find(
				prototype =>
					(typeof prototype === 'string' && prototype.includes(constructor.name)) ||
					constructor.name.includes(prototype)
			)
				? true
				: false
		}
	}
}

export type Methods<Class> = keyof {
	[key in keyof Class]: Class[key] extends (...args: unknown[]) => unknown ? Class[key] : never
}
