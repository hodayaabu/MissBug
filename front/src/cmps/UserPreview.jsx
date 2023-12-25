

export function UserPreview({ user }) {
    return <article >
        <h4>{user.fullname} - {user.username}</h4>
        <p><strong>Score:</strong> {user.score}</p>

    </article>
}