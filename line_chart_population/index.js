const w = 600
const h = 200
const padding = 50

const dataset = [
	[1927 ,2],
	[1960, 3],
	[1974, 4],
	[1987, 5],
	[1999, 6],
	[2012, 7]
]

const svg = d3.select('body')
	.append('svg')
	.attr('width', w)
	.attr('height', h)

const xScale = d3.scaleLinear()
	.domain([d3.min(dataset, d => d[0]), d3.max(dataset, d => d[0])])
	.range([padding, w - (padding*2)])

const yScale = d3.scaleLinear()
	.domain([d3.min(dataset, d => d[1]), d3.max(dataset, d => d[1])])
	.range([h - padding, padding]) // this makes y axis go up instead of down

const xAxis = d3.axisBottom()
	.scale(xScale)
	.ticks(5)

const yAxis = d3.axisLeft()
	.scale(yScale)
	.ticks(5)

const lineFunction = d3.line()
	.x(d => xScale(d[0]))
	.y(d => yScale(d[1]))
	.curve(d3.curveLinear)

const lineGraph = svg.append('path')
	.attr('d', lineFunction(dataset))
	.attr('stroke', 'lightblue')
	.attr('stroke-width', 5)
	.attr('fill', 'none')

svg.selectAll('text')
	.data(dataset)
	.enter()
	.append('text')
	.text(d => `Y: ${d[0]}, ${d[1]}b`)
	.attr('x', d => xScale(d[0]))
	.attr('y', d => yScale(d[1]))
	.attr('font-family', 'sans-serif')
	.attr('font-size', '14px')
	.attr('fill', 'grey')

svg.append('g')
	.attr('class', 'axis')
	.attr('transform', `translate(0,${h - padding})`)
	.call(xAxis)

svg.append('g')
	.attr('class', 'axis')
	.attr('transform', `translate(${padding},0)`)
	.call(yAxis)


// credit to https://build-podcast.com/d3js/
