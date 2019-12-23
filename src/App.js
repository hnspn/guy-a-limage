import React, { useState } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'

const imagesUrl = [
  'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80',
  'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80',
]

const ItemTypes = {
  ACTIVE_FILTER: 'active_filter',
  AVAILABLE_FILTER: 'available_filter',
}

function Image(props) {
  const { src } = props

  return (
    <img
      style={{ display: 'inline-block' }}
      src={src}
      width={200}
      height={200}
    />
  )
}

const AVAILABLE_FILTERS = [
  { name: 'gaussian' },
  { name: 'laplacian' },
  { name: 'gradient' },
  { name: 'median' },
  { name: 'open' },
  { name: 'close' },
]

function AvailableFilterContainer({ addFilter }) {
  const style = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  }

  return (
    <div style={style}>
      {AVAILABLE_FILTERS.map((filter, index) => (
        <AvailableFilter key={index} addFilter={addFilter} filter={filter} />
      ))}
    </div>
  )
}

function ActiveFilterContainer({ activeFilters, addFilter, removeFilter }) {
  const [, drop] = useDrop({
    accept: ItemTypes.AVAILABLE_FILTER,
    drop: (item, monitor) => addFilter(item.filter),
    // canDrop(...a) => console.log(a),
  })

  const style = {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'yellow',
  }

  return (
    <div ref={drop} style={style}>
      {activeFilters.map((filter, index) => (
        <ActiveFilter key={index} filter={filter} removeFilter={removeFilter} />
      ))}
    </div>
  )
}

function AvailableFilter({ addFilter, filter }) {
  const { name } = filter
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.AVAILABLE_FILTER, filter },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })
  const style = {
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={drag}
      style={style}
      onClick={() => {
        addFilter(filter)
      }}
    >
      {' '}
      {name}{' '}
    </div>
  )
}

function ActiveFilter({ removeFilter, filter }) {
  const { uid, name } = filter

  const color = uid % 2 == 0 ? 'blue' : 'red'
  const textColor = uid % 2 == 1 ? 'blue' : 'red'
  const style = {
    backgroundColor: color,
    color: textColor,
    height: 50,
  }

  return (
    <div style={style}>
      {name} {uid * 1.0}
      <button
        onClick={() => {
          removeFilter(filter)
        }}
      >
        X
      </button>
    </div>
  )
}

function Container(props) {
  const { children } = props
  const style = {
    padding: 20,
    backgroundColor: '#AAAAAA',
  }
  return <div style={style}>{children}</div>
}

function App() {
  const [activeFilters, setActiveFilters] = useState([])
  const [lastUid, setLastUid] = useState(0)

  function addFilter(filter) {
    const newFilter = { ...filter }
    newFilter.uid = lastUid
    setLastUid(lastUid + 1)
    setActiveFilters(activeFilters.concat([newFilter]))
  }

  function findFilter(filter) {
    return activeFilters.findIndex(f => filter.uid == f.uid)
  }

  function removeFilter(filter) {
    const position = findFilter(filter)
    const newArray = activeFilters.slice()
    newArray.splice(position, 1)
    setActiveFilters(newArray)
  }

  return (
    <Container>
      <DndProvider backend={Backend}>
        <AvailableFilterContainer addFilter={addFilter} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'gray',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <Image src={imagesUrl[0]} />
          <ActiveFilterContainer
            activeFilters={activeFilters}
            addFilter={addFilter}
            removeFilter={removeFilter}
          />
          <Image src={imagesUrl[1]} />
        </div>
      </DndProvider>
    </Container>
  )
}

export default App
