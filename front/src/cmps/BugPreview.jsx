

export function BugPreview({ bug }) {

    return <article >
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>Severity: <span>{bug.severity}</span></p>
        <p> {bug.description}</p>
        {bug.labels && bug.labels.map((label) => (
            <p key={label}>{label}</p>
        ))}

    </article>
}