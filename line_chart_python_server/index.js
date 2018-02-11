const margin = { top: 20, right: 20, bottom: 20, left: 50 }
const width = 600
const height = 300
const innerWidth = width - margin.left - margin.right
const innerHeight = height - margin.top - margin.bottom
const legendRectSize = 18
const legendSpacing = 4

d3.select('body')
	.append('h2')
	.text('Drug Overdose Deaths Among Adolescents Aged 15-19 in the United States: 1999-2015')

const headers = ['male', 'total', 'female']

const xScale = d3.scaleLinear()
	.range([0, innerWidth])

const yScale = d3.scaleLinear()
	.range([innerHeight, 0])

const svg = d3.select('body')
	.append('svg')
	.attr('width', width)
	.attr('height', height)

const g = svg.append('g')
	.attr('transform', `translate(${margin.left},${margin.top})`)

const lineMaker = (gender) => d3.line()
	.x(d => xScale(d.year))
	.y(d => yScale(d[gender]))

d3.json('http://localhost:8000/overdose_deaths_data.json', (data) => {

	xScale.domain(d3.extent(data, d => d.year))

	yScale.domain([
		d3.min(data, d => d3.min([d.male, d.female, d.total])),
		d3.max(data, d => d3.max([d.male, d.female, d.total]))
	])

	const xAxis = d3.axisBottom()
		.scale(xScale)
		.ticks(5)
		.tickFormat(d => d.toString())

	const yAxis = d3.axisLeft()
		.scale(yScale)
		.ticks(5)

	g.append('g')
		.attr('class', 'axis')
		.attr('transform', `translate(0,${innerHeight})`)
		.call(xAxis)

	g.append('g')
		.attr('class', 'axis')
		.call(yAxis)
		.append('text')
		.attr('fill', '#000')
		.attr('transform', 'rotate(-90)')
		.attr('y', 5)
		.attr('dy', 10)
		.text('Deaths per 100,000 population')


	const randomColor = d3.interpolateRgb('purple', 'blue')

	g.selectAll('.path')
		.data(headers)
		.enter()
		.append('path')
		.attr('d', h => lineMaker(h)(data))
		.attr('stroke', (h, i) => randomColor(i / headers.length))
		.attr('stroke-width', 3)
		.attr('fill', 'none')
		.attr('data-legend', h => h)

	// Legend
	const legend = g.selectAll('.legend'
		)
		.data(headers)
		.enter()
		.append('g')
		.attr('class', 'legend')
		.attr('transform', (d, i) => {
			const legend_height = legendRectSize + legendSpacing
			return `translate(50,${i * (legend_height)})`
		})

	legend.append('rect')
		.attr('width', legendRectSize)
		.attr('height', legendRectSize)
		.style('fill', (d, i) => randomColor(i / headers.length))
		.style('stroke', (d, i) => randomColor(i / headers.length))

	legend.append('text')
		.attr('x', legendRectSize + legendSpacing)
		.attr('y', legendRectSize - legendSpacing)
		.text(d => d)

})
