const width = 940
const height = 600
const center = { x: width/2, y: height/2}
const forceStrength = 0.03

let nodes = []

let svg = null
let bubbles = null

const charge = (d) => (-forceStrength * Math.pow(d.radius, 2.0))

const ticked = () => {
	bubbles
	.attr('cx', d => d.x)
	.attr('cy', d => d.y)
}

const simulation = d3.forceSimulation()
	.velocityDecay(0.2)
	.force('x', d3.forceX(). strength(
		forceStrength).x(center.x))
	.force('y', d3.forceY(). strength(
		forceStrength).y(center.y))
	.force('charge', d3.forceManyBody().strength(charge))
	.on('tick', ticked)

// prevent force from automatically starting
simulation.stop()

const fillColor = d3.scaleOrdinal()
	.domain(['low', 'medium', 'high'])
	.range(['#d84b2a', '#beccae', '#7aa25c'])


const createNodes = (rawData) => {
	const maxAmount = d3.max(rawData, d => +d.total_amount)

	// size bubbles based on area
	const radiusScale = d3.scalePow()
		.exponent(0.5)
		.range([2, 85])
		.domain([0, maxAmount])

	// convert rawData to nodeData

	const myNodes = rawData.map(d => ({
		id: d.id,
		radius: radiusScale(+d.total_amount),
		value: +d.total_amount,
		name: d.grant_title,
		org: d.organization,
		group: d.group,
		year: d.start_year,
		x: Math.random() * 900,
		y: Math.random() * 800,
	}))

	myNodes.sort((a, b) => (b.value - a.value))

	return myNodes
}

const groupBubbles = (_simulation) => {
	_simulation.force('x', d3.forceX().strength(forceStrength).x(center.x))
	_simulation.alpha(1).restart()
}

const chart = (selector, rawData) => {
	nodes = createNodes(rawData)
	console.log('nodes', nodes)
	svg = d3.select(selector)
		.append('svg')
		.attr('width', width)
		.attr('height', height)

	bubbles = svg.selectAll('.bubble')
		.data(nodes, d => d.id)

	const bubblesE = bubbles.enter().append('circle')
		.classed('bubble', true)
		.attr('r', 0)
		.attr('fill', d => fillColor(d.group))
		.attr('stroke', d => d3.rgb(fillColor(d.group)).darker())
		.attr('stroke-width', 2)
		.on('mouseover', () => { console.log('add shoe detail')})

	bubbles = bubbles.merge(bubblesE)

	bubbles.transition()
		.duration(2000)
		.attr('r', d => d.radius)

	simulation.nodes(nodes)

	groupBubbles(simulation)
}



d3.csv('http://localhost:8000/grant_money.csv', (err, data) => {
	chart('#chart', data)
})
