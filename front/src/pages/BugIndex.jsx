import { useEffect, useCallback, useState } from 'react'

import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { bugService } from '../services/bug.service.js'
import { utilService } from '../services/util.service.js'
import { BugSort } from '../cmps/BugSort.jsx'


export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
  const [sortBy, setSortBy] = useState(bugService.getDefaultSort())

  const debounceSetFilterBy = useCallback(utilService.debounce(onSetFilterBy, 500), [])

  useEffect(() => {
    loadBugs()
  }, [filterBy, sortBy])

  async function loadBugs() {
    const bugs = await bugService.query(filterBy, sortBy)
    setBugs(bugs)
  }

  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId)
      setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
      showSuccessMsg('Bug removed')

    } catch (err) {
      console.log('Error from onRemoveBug ->', err)
      showErrorMsg('Cannot remove bug')
    }
  }

  async function onAddBug() {
    const bug = {
      title: prompt('Bug title?'),
      severity: +prompt('Bug severity?'),
      description: prompt('Bug description?'),
      labels: prompt('Bug labels? add "," before new label').split(',')
    }

    try {
      const savedBug = await bugService.save(bug)
      setBugs(prevBugs => [...prevBugs, savedBug])
      showSuccessMsg('Bug added')

    } catch (err) {
      console.log('Error from onAddBug ->', err)
      showErrorMsg('Cannot add bug')
    }
  }

  async function onEditBug(bug) {
    const severity = +prompt('New severity?')
    const bugToSave = { ...bug, severity }

    try {
      const savedBug = await bugService.save(bugToSave)
      setBugs(prevBugs => prevBugs.map((currBug) =>
        currBug._id === savedBug._id ? savedBug : currBug
      ))
      showSuccessMsg('Bug updated')

    } catch (err) {
      console.log('Error from onEditBug ->', err)
      showErrorMsg('Cannot update bug')
    }
  }

  function onSetFilterBy(filterBy) {
    setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
  }

  function onChangePageIdx(pageIdx) {
    setFilterBy(prevFilter => ({ ...prevFilter, pageIdx }))
  }

  if (!bugs) return <div>Loading...</div>
  const isPaging = filterBy.pageIdx !== undefined
  return (
    <main className="main-layout">
      <h3>Bugs App</h3>
      <main>
        <div className="car-pagination">
          <label> Use paging?
            <input type="checkbox" checked={isPaging} onChange={() => onChangePageIdx(isPaging ? undefined : 0)} />
          </label>
          {isPaging && <>
            <button onClick={() => onChangePageIdx(filterBy.pageIdx - 1)}>-</button>
            <span>{filterBy.pageIdx + 1}</span>
            <button onClick={() => onChangePageIdx(filterBy.pageIdx + 1)}>+</button>
          </>}
        </div>
        <BugFilter filterBy={filterBy} onSetFilterBy={debounceSetFilterBy} />
        <BugSort sortBy={sortBy} onSetSortBy={setSortBy} />

        <button onClick={onAddBug}>Add Bug ⛐</button>
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      </main>
    </main>
  )
}
