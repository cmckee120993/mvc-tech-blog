async function updatePost(event) {
    event.preventDefault();

    const title = document.querySelector('input[name="post-title"]').value;
    const body = document.querySelector('input[name="post-body"]').value;

    const response = await fetch(`/api/post/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({
            title,
            body
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/dashbaord/');
    } else {
        alert(response.statusText);
    }
};

const postID = document.querySelector('input[name="post-id"]').value;

async function deleteClickHandler() {
    await fetch(`/api/post/${postId}`, {
        method: 'DELETE'
    });

    document.location.replace('/dashboard');
}
document.querySelector('.edit-post-form').addEventListener('submit', updatePost);
document.querySelector('.delete-btn').addEventListener('click', deleteClickHandler);