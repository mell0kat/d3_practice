const margin = { top: 0, right: 320, bottom: 0, left: 0 }
const fullWidth = 960
const fullHeight = 500
const width = fullWidth - margin.left - margin.right
const height = fullHeight - margin.top - margin.bottom

const tree = d3.tree()
	.separation((a, b) => ((a.parent === b.parent) ? 1 : 0.5))
	.size([height, width])

const svg = d3.select('body')
	.append('svg')
	.attr('width', fullWidth)
	.attr('height', fullHeight)

const g = svg.append('g')
	.attr('transform', `translate(${margin.left},${margin.top})`)

const elbow = (d, i) => {
	return `M${d.source.y},${d.source.x}H${d.target.y},V${d.target.x}${d.target.children ? '' : 'h' + margin.right}`
}

d3.json('http://localhost:8000/tree.json', (err, json) => {
	if (err) throw err

	const nodes = d3.hierarchy(json, (d) => d.parents)

	// maps hierarchy to tree layout
	const treeNodes = tree(nodes)

	// adds links between nodes
	const link = g.selectAll('.link')
		.data(treeNodes.links())
		.enter().append('path')
		.attr('class', 'link')
		.attr('d', elbow)

	const node = g.selectAll('.node')
		.data(treeNodes.descendants())
		.enter().append('g')
		.attr('class', 'node')
		.attr( 'transform', d => `translate(${d.y},${d.x})`)

	node.append('text')
		.attr('class', 'name')
		.attr('x', 8)
		.attr('y', -6)
		.text(d => `${d.data.name}`)

	node.append('text')
		.attr('x', 8)
		.attr('y', 8)
		.attr('dy', '.71em')
		.attr('class', 'about lifespan')
		.text(d => `${d.data.born} - ${d.data.died}`)

	node.append('text')
		.attr('class', 'about location')
		.attr('x', 8)
		.attr('y', 8)
		.attr('dy', '1.86em')
		.text(d => `${d.data.location}`)
})
