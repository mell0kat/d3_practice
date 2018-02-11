
const dataset = [
	[0.383, 0.4, 'Mercury'],
	[0.949, 0.7, 'Venus'],
	[1, 1, 'Earth'],
	[0.532, 1.5, 'Mars'],
	[11.21, 5.2, 'Jupiter'],
	[9.45, 9.58, 'Saturn'],
	[4.01, 19.23, 'Uranus'],
	[3.88, 30.1, 'Neptune']
]

const width = 1240
const height = 700
const padding = 40

const svg = d3.select('body')
	.append('svg')
	.attr('width', width)
	.attr('height', height)

const xScale = d3.scaleLinear()
	.domain([d3.min(dataset, d => d[1]), d3.max(dataset, d => d[1])])
	.range([padding, width - (padding*2)])

svg.selectAll('circle')
	.data(dataset)
	.enter()
	.append('circle')
	.attr('cx', d => xScale(d[1]))
	.attr('cy', 100)
	.attr('fill', 'red')
	.attr('r', d => d[0] * 6)

svg.selectAll('text')
	.data(dataset)
	.enter()
	.append('text')
	.text(d => d[2])
	.attr('x', d => xScale(d[1]))
	.attr('y', (d, i) => 20*(i+1))

d3.selectAll('p')
	.on('click', () => {
		svg.selectAll('text')
		.data(dataset)
		.transition()
		.duration(1000)
		.ease('bounce')
		.attr('x', () => (w - 300))
		.each('end', () => {
			d3.select(this)
				.text(d => `${d[2]} with size ${d[0]}`)
		})

		svg.selectAll('circle')
		.data(dataset)
		.transition()
		.delay(1000)
		.duration(1000)
		.ease('linear')
		.attr('fill', 'brown')
		.attr('r', (d) => (d[0] * 5))
	})

	d3.select('body')
	.append('p')
	.text('Inspiration for this block from https://build-podcast.com/d3js/')

// credit to https://build-podcast.com/d3js/
