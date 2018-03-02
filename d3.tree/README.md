###  d3.tree - A Family Tree

This graph is based on [Mike Bostock's block](https://bl.ocks.org/mbostock/2966094) converted to d3 v4

#### What I've learnt
* d3.hierarchy() constructs a root node from given hierarchal (json) data

* nodes have .descendants() method as well as .links() which have a source and target object

* d3.tree() assigns a .x and .y (which are arbitrary, could be used for angle and radius) to the root node and its decendants

* for svg elements, x and y are absolute coords while dx and dy are relative coords

* dx and dy use 'em's are are good for centering things

* can add multiple classes be simply space separating
  *  e.g .attr('class', 'about location')



