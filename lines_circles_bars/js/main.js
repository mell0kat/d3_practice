
d3.select('#chart')
	.selectAll('div')
	.data([4, 8, 15, 16, 23, 42])
	.enter()
	.append('div')
	.style('height', d => d + 'px')

const colorMap = d3.interpolateRgb(
	d3.rgb('#d6e685'),
	d3.rgb('#1e6823')
)

d3.select('#github_chart')
	.selectAll('div')
	.data([.2, .4, 0, 0, .13, .92])
	.enter()
	.append('div')
	.style('background-color', d => (d === 0 ? '#eee': colorMap(d)))


const data = [{
	label: '7am',
	sales: 20,
},
{
	label: '8am',
	sales: 12,
},
{
	label: '9am',
	sales: 8,
},
{
	label: '10am',
	sales: 27,
}]

const g = d3.select('#svg_circles')
	.selectAll('g')
	.data(data)
	.enter()
	.append('g')

g.append('circle')
	.attr('cy', 40)
	.attr('cx', (d, i) => (i + 1) * 50)
	.attr('r', d => d.sales)

g.append('text')
	.attr('y', 90)
	.attr('x', (d, i) => (i + 1) * 50)
	.text(d => d.label)

const line_chart_data = [
	{ x: 0, y: 30 },
	{ x: 50, y: 20 },
	{ x: 100, y: 40 },
	{ x: 150, y: 80 },
	{ x: 200, y: 95 }
]

const line = d3.line()
	.x(d => d.x)
	.y(d => 100 - d.y)
	.curve(d3.curveLinear)

d3.select('#svg_line_chart')
	.append('path')
	.attr('stroke-width', 2)
	.attr('d', line(line_chart_data))
	.style('fill', 'none')
	.style('stroke', 'black')


const line_chart_data_2 = [
	{ x: 0, y: 30 },
	{ x: 25, y: 15 },
	{ x: 50, y: 20 }
]

const width = 500
const height = 200
const padding = 20
const xMax = d3.max(line_chart_data_2, d => d.x)
const yMax = d3.max(line_chart_data_2, d => d.y)


const xScale = d3.scaleLinear()
	.domain([0, xMax])
	.range([padding, width - padding])

const yScale = d3.scaleLinear()
	.domain([0, yMax])
	.range([height - padding, padding])



const line2 = d3.line()
	.x(d => xScale(d.x))
	.y(d => yScale(d.y))
	.curve(d3.curveLinear)

d3.select('#svg_line_chart_2')
	.append('path')
	.attr('stroke-width', 2)
	.attr('d', line2(line_chart_data_2))
	.style('fill', 'none')
	.style('stroke', 'green')

const life = d3.scaleTime()
	.domain([new Date(1993, 9, 27), new Date()])
	.range([0, 100])
console.log(life(new Date(2013, 9, 27)))


const flight_data = [
	{
		departs: '06:00am',
		arrives: '07:25am',
		id: 'Jetstar 500'
	},
	{
		departs: '06:00am',
		arrives: '07:25am',
		id: 'Quantas 400'
	},
		{
		departs: '06:00am',
		arrives: '07:25am',
		id: 'Virgin 803'
	}
]

flight_data.forEach(d => {
	d.departureDate = moment(d.departs, 'hh-mm-a').toDate()
	d.arrivalDate = moment(d.arrives, 'hh-mm-a').toDate()
	d.xScale = d3.scaleTime()
		.domain([d.departureDate, d.arrivalDate])
		.range([100, 500])
})

const now = moment(flight_data[0].departs, 'hh:mm a')

const end = moment(flight_data[flight_data.length - 1].arrives, 'hh:mm a')

const loop = () => {
	const time = now.toDate()
	const currentData = data.filter(d => (d.departureDate <= time && time <= d.arrivalDate))
	render(currentData, time)

	if (now <= end) {
		now = now.add(5, 'minutes')
		setTimeout(loop, 500)
	}
}

const render = (data, time) => {
	d3.select('.time')
	.text(moment(time).format('hh:mm a'))

	const flight = d3.select('#flight_chart')
		.selectAll('g.flight')
		.data(data, d => d.id)

	const newFlight = flight.enter()
		.append('g')
		.attr('class', 'flight')

	const xPoint = d => d.xScale(time)
	const yPoint = (d, i) => 100 + (i * 25)

	newFlight.append('circle')
	.attr('class', 'flight-dot')
	.attr('cx', xPoint)
	.attr('cy', yPoint)
	.attr('r', '5')

	flight.select('.flight-dot')
		.attr('cx', xPoint)
		.attr('cy', yPoint)

	const oldFlight = flight.exit()
		.remove()
}





