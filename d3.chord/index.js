const width = 480
const height = 500
const outerRadius = Math.min(width, height) / 2 - 4
const innerRadius = outerRadius - 20

const numFormat = d3.format(',.3r') // grouped thousands with three significant digits, "4,000"

const debits = []
const credits = []

// chord layout for computing angles of chords

const layout = d3.chord()
	.sortGroups(d3.descending)
	.sortSubgroups(d3.descending)
	.sortChords(d3.descending)
	.padAngle(.04)

// Color scale for "risk"
const fill = d3.scaleOrdinal()
	.domain([0, 1, 2])
	. range(["#DB704D", "#D2D0C6", "#ECD08D", "#F8EDD3"])

// This is for creating donut chart around the circle (for groups)
const arc = d3.arc()
	.innerRadius(innerRadius)
	.outerRadius(outerRadius)

// chord generator for the chords
const ribbon = d3.ribbon() //???
	.radius(innerRadius)

const svg = d3.select('body')
	.selectAll('div')
	.data([debits, credits])
	.enter()
	.append('div')
	.style('display', 'inline-block')
	.style('width', `${width}px`)
	.style('height', `${height}px`)
	.append('svg')
	.attr('width', width)
	.attr('height', height)
	.append('g')
	.attr('transform', `translate(${width/2},${height / 2})`)

function value () {
	return this.amount
}

const formatRow = (row) => {
	const _row = {}
	_row.amount = +row.amount
	_row.risk = +row.risk
	_row.valueOf = value // for chord layout
	return { ...row, ..._row}
}

d3.csv('http://localhost:8000/debts.csv', formatRow, (data) => {


	let countryByName = d3.map()
	let countryIndex = -1
	const countryByIndex = []

	data.forEach(d => {

		if (countryByName.has(d.creditor)) {
			d.creditor = countryByName.get(d.creditor)
		} else {
			countryByName.set(d.creditor, d.creditor = { name: d.creditor, index: ++countryIndex })

		}
		if (countryByName.has(d.debtor)) {
			d.debtor = countryByName.get(d.debtor)
		} else {
			countryByName.set(d.debtor, d.debtor = { name: d.debtor, index: ++countryIndex })
		}
		d.debtor.risk = d.risk
	})


  // square matrix of debits and credits
	for (let i = 0; i <= countryIndex; i++) {
		debits[i] = []
		credits[i] = []
		for (let j =0; j <= countryIndex; j++){
			debits[i][j] = 0
			credits[i][j] = 0
		}
	}

	data.forEach(d => {
		debits[d.creditor.index][d.debtor.index] = d
		credits[d.debtor.index][d.creditor.index] = d
		countryByIndex[d.creditor.index] = d.creditor
		countryByIndex[d.debtor.index] = d.debtor
	})

	svg.each(function(matrix, j){
		console.log('MATRIX', matrix)
		const svg = d3.select(this)


		svg.selectAll('.chord')
			.data(layout(matrix))
			.enter().append('path')
			.attr('class', 'chord')
			.style('fill', d => fill(d.source.value.risk))
			.style('stroke', d => d3.rgb(fill(d.source.value.risk)).darker())
			.attr('d', ribbon)
			.append('title')
			.text(d => { console.log(d)
				if (!d.source.value.debtor) { return `W in progress`}
				return `${d.source.value.debtor.name} owes  ${d.source.value.creditor.name} $${numFormat(d.source.value)} B.`})

		// Add groups
		const g = svg.selectAll('.group')
			.data(layout(matrix).groups)
			.enter().append('g')
			.attr('class', 'group')

		// Add group "donut chart" arc
		g.append('path')
			.style('fill', d => fill(countryByIndex[d.index].risk))
			.attr('id', (d,i) => `group${d.index}-${j}`)
			.attr('d', arc)
			.append('title')
			.text(d => `${countryByIndex[d.index].name} ${(j ? 'owes' : 'is owed')} $${numFormat(d.value)}B.`)

		g.append('text')
			.attr('x', 6)
			.attr('dy', 15)
			.filter(d => d.value > 110)
			.append('textPath')
			.attr('href', d => `#group${d.index}-${j}`)
			.text(d => countryByIndex[d.index].name)

	})

})

//d3.arc can be using for labeling groups
// using d3.format to format numbers, sig figs, commas etc

//leran about row formatting function

//text path is used to draw text along a path (incluude an href attr with a reference to the path)
