###  The Euro Debt Crisis by M. Bostock - converted to d3v4 by Me

Based on M. Bostock's [original](https://bl.ocks.org/mbostock/1308257)

What I learnt

* **d3.arc** creates a donut-like shape and can be using for adding labels to groups created by d3.chord
* **d3.format** can be used to format numbers (sig figs, commas, etc.)

* Can use second argument of d3.csv (and other fetch functions) to format each row

* svg element 'textPath' is used to draw text along a path (include an href attr with a reference to the path)

* .darker() function available for d3.rgb

* svg 'title' is used as a tooltip (on hover) description of svg elements (not all browsers support)
