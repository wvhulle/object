# Object

Library to deal with JavaScript objects.

## Replacing

Core to this library is a TypeScript [conditional type](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html). Conditional types are like if-then expressions for types. The validity or type-checking happens at compile time. They can be used to do some kind of pattern matching on the structure types. TypeScript is all about structural typing, so this is very useful.

```ts
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
    : Type;
```

This is a recursive conditional type that replaces all instances of `From` with `To` in a given type `Type`. All of this happens at the type level at compilation time, when TypeScript is compiled down to JavaScript.

1. The first step is to check whether `Type` is an object. If it is not an object, nothing is done.
2. If `Type` is an array type with elements of type `A`, each type `A` in the array type is replaced recursively.
3. If `Type` is a function type, it is just left as-is.
4. If `Type` is a record, each value is replaced recursively.
5. If `Type` is a sub-type of `From`, it is just replaced by `To`.

### Run-Time

At run-time, after compilation, a function is executed that satisfies the type contract of this type definition. The type of the run-time functions is

```ts
export function replaceTypeRecursively<T, OldType extends object, NewType>(
    obj: T,
    oldTypeGuard: (value: unknown) => value is OldType,
    newTypeCreator: (value: OldType) => NewType,
): Replace<T, OldType, NewType>```
```

This means that the only thing you have to do, is to provide a type-guard and a function that creates a new type from an old one. The run time function will then replace all instances of `OldType` with `NewType`.

## Traversal

For recursive traversal of objects, there is a depth-first traversal function. See [traversal.ts](./lib/traversal.ts). The special part about this function is that it carries information first downward in the tree. This information is used to compute some values. And then the compute values are merged back up in the tree.

```ts
export function depthFirstTraversal<DataGoingDown, DataGoingUp, GraphNode>({
    children,
    initialDataGoingDown,
    mergeParentDataIntoChild,
    mergeSiblings,
    nodeTransformer,
    root,
}: {
    children: (
        parent: GraphNode,
        dataGoingDown: DataGoingDown,
    ) => { child: GraphNode; dataGoingDown: DataGoingDown }[];
    initialDataGoingDown: DataGoingDown;
    mergeParentDataIntoChild?: (
        parentData: DataGoingUp,
        childData: DataGoingUp,
    ) => DataGoingUp;
    mergeSiblings?: (child1: DataGoingUp, child2: DataGoingUp) => DataGoingUp;
    nodeTransformer: (
        v: GraphNode,
        transformerOutputFromParent?: DataGoingDown,
    ) => DataGoingUp;
    root: GraphNode;
}): DataGoingUp
```
