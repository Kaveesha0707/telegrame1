// Select DOM elements
const keywordForm = document.getElementById('keywordForm');
const keywordList = document.getElementById('keywordList');
const keywordInput = document.getElementById('keywordInput');
const channelIdInput = document.getElementById('channelIdInput');

// API URL
const API_URL = 'http://localhost:3000/api/keywords';

// Fetch all keywords from the server
async function fetchKeywords() {
  try {
    const response = await fetch(API_URL);
    const keywords = await response.json();

    // Clear the current list before adding new items
    keywordList.innerHTML = '';

    keywords.forEach((keyword) => {
      const li = document.createElement('li');
      li.innerHTML = `Channel: ${keyword.channelId} - Keyword: ${keyword.text} (${keyword.alertCount})`;

      // Create delete button
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'DELETE';
      deleteButton.classList.add('remove-btn');
      deleteButton.onclick = () => deleteKeyword(keyword._id);

      li.appendChild(deleteButton);
      keywordList.appendChild(li);
    });
  } catch (err) {
    console.error('Error fetching keywords:', err.message);
  }
}

// Handle adding a new keyword
async function addKeyword(event) {
  event.preventDefault();

  const channelId = channelIdInput.value.trim();
  const text = keywordInput.value.trim();

  if (!channelId || !text) {
    return alert("Please enter both Channel ID and Keyword!");
  }

  const submitButton = keywordForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channelId, text }), // Send both channelId and text
    });

    if (response.status === 201) {
      // Clear input fields
      channelIdInput.value = '';
      keywordInput.value = '';
      fetchKeywords(); // Reload keywords
    } else {
      const error = await response.text();
      alert(`Error: ${error}`);
    }
  } catch (err) {
    console.error('Error adding keyword:', err.message);
  } finally {
    submitButton.disabled = false;
  }
}

// Handle deleting a keyword
async function deleteKeyword(keywordId) {
  if (confirm("Are you sure you want to delete this keyword?")) {
    try {
      const response = await fetch(`${API_URL}/${keywordId}`, {
        method: "DELETE",
      });

      if (response.status === 200) {
        fetchKeywords(); // Reload keywords after deletion
      } else {
        alert("Failed to delete keyword.");
      }
    } catch (err) {
      console.error('Error deleting keyword:', err.message);
    }
  }
}

// Attach event listener to the form
keywordForm.addEventListener('submit', addKeyword);

// Initial fetch to display existing keywords
fetchKeywords();
