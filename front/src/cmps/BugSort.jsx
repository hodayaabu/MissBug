import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export function BugSort({ onSetSortBy, sortBy }) {

    function onChangeSort(by) {
        const dir = (sortBy.by !== by) ? 1 : sortBy.dir * -1
        const newSort = {
            by,
            dir
        }
        onSetSortBy(newSort)
    }

    const sorts = ['title', 'severity', 'date']

    return (
        <section className="bug-sort">
            {
                sorts.map(sort => <button key={sort}
                    onClick={() => onChangeSort(sort)}
                >
                    {sort}
                    {(sortBy.by === sort && sortBy.dir === 1) && <span ><KeyboardArrowDownIcon fontSize='small' /></span>}
                    {(sortBy.by === sort && sortBy.dir === -1) && <span><KeyboardArrowUpIcon fontSize='small' /></span>}
                </button>)
            }
        </section>
    )
}
