const causes = ['wounds', 'other', 'disease']
const parseDate = d3.timeParse('%m/%Y')
const margin = { top: 20, right: 50, bottom: 30, left: 20 }
const width = 960 - margin.left -margin.right
const height = 500 - margin.top - margin.bottom

const x = d3.scaleBand()
	.rangeRound([0, width])

const y = d3.scaleLinear()
	.rangeRound([height, 0])

const z = d3.scaleOrdinal(d3.schemeCategory10)

const xAxis = d3.axisBottom()
	.scale(x)
	.tickFormat(d3.timeFormat('%b'))

const yAxis = d3.axisRight()
	.scale(y)

const svg = d3.select('body')
	.append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.append('g')
	.attr('transform', `translate(${margin.left},${margin.top})`)

const type = (d) => {
	d.date = parseDate(d.date)
	causes.forEach(c => {
		d[c] = +d[c]
	})
	return d
}

d3.tsv('http://localhost:8000/crimea.tsv', type, (crimea) => {

	const layers = d3.stack()
	.keys(causes)
	(crimea)

	x.domain(layers[0].map(d => d.data.date))

	y.domain([0, d3.max(layers[layers.length - 1], d => (d[0] + d[1]) )]).nice()

	const layer = svg.selectAll('layer')
		.data(layers)
		.enter()
		.append('g')
		.attr('class', 'layer')
		.style('fill', (d, i) => (z(i) ))

	layer.selectAll('rect')
		.data(d => d)
		.enter()
		.append('rect')
		.attr('x', d => x(d.data.date))
		.attr('y', d => y(d[0] + d[1]))
		.attr('height', d => y(d[0]) - y(d[1] + d[0]))
		.attr('width', x.bandwidth() - 1)

	svg.append('g')
		.attr('class', 'axis axis--x')
		.attr('transform', `translate(0,${height})`)
		.call(xAxis)

	svg.append('g')
		.attr('class', 'axis axis--y')
		.attr('transform', `translate(${width},0)`)
		.call(yAxis)
})
