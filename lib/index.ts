export type Nullable<T, K> = undefined extends T ? K : never

export const removeNull = <S>(value: S | null): value is S => value != null
export const removeUndefined = <S>(value: S | undefined): value is S => value != undefined

export type JavaScriptPrimitive = string | number | undefined | null | boolean

export { MaybePromise } from './function.js'

export * from './objects/index.js'
