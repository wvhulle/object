import { removeUndefined } from '../index.js'

export function depthFirstTraversal<DataGoingDown, DataGoingUp, GraphNode>({
	children,
	initialDataGoingDown,
	mergeParentDataIntoChild,
	mergeSiblings,
	nodeTransformer,
	root
}: {
	children: (
		parent: GraphNode,
		dataGoingDown: DataGoingDown
	) => { child: GraphNode; dataGoingDown: DataGoingDown }[]
	initialDataGoingDown: DataGoingDown
	mergeParentDataIntoChild?: (parentData: DataGoingUp, childData: DataGoingUp) => DataGoingUp
	mergeSiblings?: (child1: DataGoingUp, child2: DataGoingUp) => DataGoingUp
	nodeTransformer: (v: GraphNode, transformerOutputFromParent?: DataGoingDown) => DataGoingUp
	root: GraphNode
}): DataGoingUp {
	const seen = new Set<GraphNode>()

	const recurse = (currentNode: GraphNode, dataFromParent: DataGoingDown): DataGoingUp => {
		seen.add(currentNode)
		const currentValue = nodeTransformer(currentNode, dataFromParent)

		const childValues = children(currentNode, dataFromParent)
			.map(({ child, dataGoingDown: transformerOutputFromParent }) =>
				seen.has(child) ? undefined : recurse(child, transformerOutputFromParent)
			)
			.filter(removeUndefined)

		if (childValues.length === 0 || !mergeSiblings) {
			return currentValue
		} else {
			if (mergeParentDataIntoChild) {
				return mergeParentDataIntoChild(currentValue, childValues.reduce(mergeSiblings))
			} else {
				return mergeSiblings(currentValue, childValues.reduce(mergeSiblings))
			}
		}
	}

	return recurse(root, initialDataGoingDown)
}
