const newPostHandler = async (event) => {
    event.preventDefault();
    
    // Collect values from the post form
    const title = document.querySelector('#post-name').value.trim();
    const content = document.querySelector('#post-body').value.trim();
  
    if (title && content) {
      // Send a POST request to the API endpoint
      const response = await fetch('/api/posts/', {
        method: 'POST',
        body: JSON.stringify({ title, content }),
        headers: { 'Content-Type': 'application/json'},
      });
      console.log(response)
      if (response.ok) {
        document.location.replace('/')
      } else {
        alert(response.statusText);
      }
    }
    else {
      alert('Please add text to both fields!')
    }
  };
 document.querySelector('.post-form').addEventListener('submit', newPostHandler)