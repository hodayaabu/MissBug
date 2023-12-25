import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true,
})

const BASE_URL = '//localhost:3030/api/bug/'

// const BASE_URL = (window.process.env.NODE_ENV !== 'development') ?
//     '/api/bug/' :
//     '//localhost:3030/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getEmptyBug,
    getDefaultFilter,
    getDefaultSort
}


async function query(filterBy = {}, sortBy = getDefaultSort()) {
    var { data: bugs } = await axios.get(BASE_URL, { params: { filterBy, sortBy } })
    // _sortBugs(bugs, sortBy)
    return bugs
}

async function getById(bugId) {
    const url = BASE_URL + bugId

    var { data: bug } = await axios.get(url)
    return bug
}

async function remove(bugId) {
    const url = BASE_URL + bugId
    var { data: res } = await axios.delete(url)
    return res
}

async function save(bug) {
    const method = bug._id ? 'put' : 'post'
    const { data: savedBug } = await axios[method](BASE_URL, bug)
    return savedBug
}


function getEmptyBug(title = '', severity = '', description = "", labels = "") {
    return { title, severity, description, labels }
}

function getDefaultFilter() {
    return { title: '', minSeverity: '', labels: "", pageIdx: undefined }
}

function getDefaultSort() {
    return {
        by: 'date',
        dir: 1
    }
}

// function _sortBugs(bugs, sortBy) {
//     if (sortBy.by === 'date') {
//         bugs.sort((bug1, bug2) => (bug2.createdAt - bug1.createdAt) * sortBy.dir)
//     } else if (sortBy.by === 'title') {
//         bugs.sort((bug1, bug2) => (bug2.title - bug1.title) * sortBy.dir)
//     } else if (sortBy.by === 'severity') {
//         bugs.sort((bug1, bug2) => (bug1.severity - bug2.severity) * sortBy.dir)
//     }
// }