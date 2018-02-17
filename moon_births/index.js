const margin = { top: 20, right: 20, bottom: 20, left: 100 }
const width = 1050
const height = 300
const innerWidth = width - margin.left - margin.right
const innerHeight = height - margin.top - margin.bottom

const timeParseString = '%Y %b %d'
// const legendRectSize = 18
// const legendSpacing = 4

d3.select('body')
	.append('h2')
	.text('2016 Moon Phases')

// const headers = ['male', 'total', 'female']

const xScale = d3.scaleLinear()
	.range([0, innerWidth])

const yScale = d3.scaleOrdinal()
	.range([innerHeight / 2, innerHeight, innerHeight / 2,  0])

const svg = d3.select('body')
	.append('svg')
	.attr('width', width)
	.attr('height', height)

const g = svg.append('g')
	.attr('transform', `translate(${margin.left},${margin.top})`)

const lineMaker = d3.line()
	.x(d => xScale(d3.timeParse(timeParseString)(d.date)))
	.y(d => yScale(d.phase))
	.curve(d3.curveMonotoneX)

const clean = (data) => data.phasedata.map(phaseItem => ({ ...phaseItem } ))


d3.json('http://localhost:8000/moon_phases.json', (data) => {
	const phase_data = clean(data)

	xScale.domain(d3.extent(phase_data, d => {
		console.log(d3.timeParse(timeParseString)(d.date))

		return d3.timeParse(timeParseString)(d.date)
}
	))
	console.log(xScale.domain())

	yScale.domain(['Last Quarter', 'New Moon', 'First Quarter', 'Full Moon'])

	const xAxis = d3.axisBottom()
		.scale(xScale)
		.ticks(8)
		.tickFormat(d3.timeFormat('%b %d'))

	const yAxis = d3.axisLeft()
		.scale(yScale)
		.ticks(4)
		.tickFormat(d => {
			if (d === 'First Quarter') {
				return 'First & Last Quarter'
			} else if (d === 'Last Quarter'){
				return ''
			}
			else return d
	})

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
		.text('Moon Phases')


	const randomColor = d3.interpolateRgb('purple', 'blue')

	g.append('path')
		.attr('d', lineMaker(phase_data))
		.attr('stroke', 'green')
		.attr('stroke-width', 3)
		.attr('fill', 'none')
		.attr('data-legend', h => h)

	// Legend
	// const legend = g.selectAll('.legend'
	// 	)
	// 	.data(headers)
	// 	.enter()
	// 	.append('g')
	// 	.attr('class', 'legend')
	// 	.attr('transform', (d, i) => {
	// 		const legend_height = legendRectSize + legendSpacing
	// 		return `translate(50,${i * (legend_height)})`
	// 	})

	// legend.append('rect')
	// 	.attr('width', legendRectSize)
	// 	.attr('height', legendRectSize)
	// 	.style('fill', (d, i) => randomColor(i / headers.length))
	// 	.style('stroke', (d, i) => randomColor(i / headers.length))

	// legend.append('text')
	// 	.attr('x', legendRectSize + legendSpacing)
	// 	.attr('y', legendRectSize - legendSpacing)
	// 	.text(d => d)

})
