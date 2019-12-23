import React, { useState } from "react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import Backend from "react-dnd-html5-backend"

const imagesUrl = [
  "https://images.unsplash.com/photo-1533158307587-828f0a76ef46?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80",
  "https://images.unsplash.com/photo-1533158307587-828f0a76ef46?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80"
]

const ItemTypes = {
  ACTIVE_FILTER: "active_filter",
  AVAILABLE_FILTER: "available_filter"
}

function Image(props) {
  const { src } = props

  return (
    <img
      style={{ display: "inline-block" }}
      src={src}
      width={200}
      height={200}
    />
  )
}

function intToRGB(i) {
  let c = (i & 0x00ffffff).toString(16).toUpperCase()
  return "00000".substring(0, 6 - c.length) + c
}

const AVAILABLE_FILTERS = [
  { name: "gaussian" },
  { name: "laplacian" },
  { name: "gradient" },
  { name: "median" },
  { name: "open" },
  { name: "close" }
]

const ACTIVE_FILTERS = [...AVAILABLE_FILTERS]

function AvailableFilterContainer({addFilter}) {
  const style = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly"
  }

  return (
    <div style={style}>
      {AVAILABLE_FILTERS.map((filter, index) => (
        <AvailableFilter key={index} addFilter={addFilter} filter={filter} />
      ))}
    </div>
  )
}

function ActiveFilterContainer({ activeFilters, addFilter }) {
	const [, drop] = useDrop({
		accept: ItemTypes.AVAILABLE_FILTER,
		drop: (item, monitor) => addFilter(item.filter),
		// canDrop(...a) => console.log(a),
	})

  const style = {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "yellow"
  }

  return (
		<div 
		ref={drop}
		style={style}>
      {activeFilters.map((filter, index) => (
        <ActiveFilter key={index} filter={filter} />
      ))}
    </div>
  )
}

function AvailableFilter({ addFilter, filter }) {
  const { name } = filter
	const [{isDragging}, drag] = useDrag({
		item: {type: ItemTypes.AVAILABLE_FILTER, filter},
		collect: monitor => ({
			isDragging: monitor.isDragging()
		})
	})
	const style = {
		opacity: isDragging ? 0.5 : 1
	}

  return (
    <div
			ref={drag}
			style={style}
      onClick={() => {
        addFilter(filter)
      }}
    >
      {" "}
      {name}{" "}
    </div>
  )
}

function ActiveFilter(props) {
  const {
    filter: { id, name }
  } = props

  const style = {
    backgroundColor: intToRGB(id),
    height: 50
  }

  return (
    <div style={style}>
      {name} {id * 1.0}
    </div>
  )
}

function Container(props) {
  const { children } = props
  const style = {
    padding: 20,
    backgroundColor: "#AAAAAA"
  }
  return <div style={style}>{children}</div>
}

function App() {
  const [activeFilters, setActiveFilters] = useState([])

  function addFilter(newFilter) {
		newFilter.id = activeFilters.length
    setActiveFilters(activeFilters.concat([newFilter]))
  }

  return (
    <Container>
      <DndProvider backend={Backend}>
        <AvailableFilterContainer addFilter={addFilter} />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: "gray",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: 10
          }}
        >
          <Image src={imagesUrl[0]} />
          <ActiveFilterContainer activeFilters={activeFilters} addFilter={addFilter}/>
          <Image src={imagesUrl[1]} />
        </div>
      </DndProvider>
    </Container>
  )
}

export default App
