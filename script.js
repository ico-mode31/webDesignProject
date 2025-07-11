const messageCountElem = document.getElementById('message-count');
const messageList = document.getElementById('message-list');
const user = JSON.parse(localStorage.getItem('user'));
let editIndex = null;
let messageCount = 0;

if (!user) {
  window.location.href = 'login.html';
}

function logout() {
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

function updateMessageCount() {
  messageCountElem.textContent = `${messageCount} message${messageCount !== 1 ? 's' : ''} found`;
}

function addMessage(to, content, index, sender) {
  const newCard = document.createElement('div');
  newCard.className = 'message-card';
  newCard.innerHTML = `
    <strong>To: ${to}</strong>
    <p class="message-content">${content}</p>
    <div class="message-actions">
      <button class="react-button" onclick="toggleHeart(${index})">❤️</button>
    </div>
  `;

  if (user.email === sender) {
    const editBtn = document.createElement('button');
    editBtn.textContent = "Edit";
    editBtn.style.cssText = "margin-top:10px;margin-right:5px;background:#ffc107;border:none;padding:5px 10px;border-radius:6px;cursor:pointer;";
    editBtn.onclick = () => editMessage(index);
    newCard.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "Delete";
    deleteBtn.style.cssText = "margin-top:10px;background:#dc3545;color:white;border:none;padding:5px 10px;border-radius:6px;cursor:pointer;";
    deleteBtn.onclick = () => deleteMessage(index);
    newCard.appendChild(deleteBtn);

    const shareBtn = document.createElement('button');
    shareBtn.textContent = "Share";
    shareBtn.style.cssText = "margin-top:10px;margin-left:5px;background:#007bff;color:white;border:none;padding:5px 10px;border-radius:6px;cursor:pointer;";
    shareBtn.onclick = () => shareMessage(content);
    newCard.appendChild(shareBtn);
  }

  const heartButton = newCard.querySelector('.react-button');
  heartButton.style.position = 'absolute';
  heartButton.style.top = '10px';
  heartButton.style.right = '10px';

  messageList.appendChild(newCard);
  messageCount++;
  updateMessageCount();
}

function renderMessages() {
  messageList.innerHTML = '';
  messageCount = 0;

  let messages = JSON.parse(localStorage.getItem('messages')) || [];
  messages = messages.filter(({ to }) => to.toLowerCase() !== 'jane');

  messages.forEach(({ to, content, sender }, index) => {
    addMessage(to, content, index, sender);
  });
}

function handleMessageSubmit() {
  const to = document.getElementById('to-name').value.trim();
  const content = document.getElementById('message-content').value.trim();

  if (!to || !content) return;

  let messages = JSON.parse(localStorage.getItem('messages')) || [];

  if (editIndex !== null) {
    messages[editIndex] = { to, content, sender: user.email };
    editIndex = null;
  } else {
    messages.push({ to, content, sender: user.email });
  }

  localStorage.setItem('messages', JSON.stringify(messages));

  document.getElementById('to-name').value = '';
  document.getElementById('message-content').value = '';
  document.getElementById('message-form').style.display = 'none';

  const sendBtn = document.querySelector('#message-form button');
  sendBtn.textContent = 'Send';

  renderMessages();
}

function editMessage(index) {
  const messages = JSON.parse(localStorage.getItem('messages')) || [];
  const msg = messages[index];
  if (!msg || msg.sender !== user.email) return;

  document.getElementById('to-name').value = msg.to;
  document.getElementById('message-content').value = msg.content;
  document.getElementById('message-form').style.display = 'block';

  const sendBtn = document.querySelector('#message-form button');
  sendBtn.textContent = 'Update';
  editIndex = index;
}

function deleteMessage(index) {
  let messages = JSON.parse(localStorage.getItem('messages')) || [];
  if (messages[index].sender !== user.email) return;

  messages.splice(index, 1);
  localStorage.setItem('messages', JSON.stringify(messages));
  renderMessages();
}

function searchMessages() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const cards = document.querySelectorAll('.message-card');
  cards.forEach(card => {
    const name = card.querySelector('strong').textContent.toLowerCase();
    card.style.display = name.includes(query) ? 'block' : 'none';
  });
}

let heartCounts = {};
function toggleHeart(index) {
  if (!heartCounts[index]) {
    heartCounts[index] = 1;
  } else {
    heartCounts[index]++;
  }
  alert(`You liked this message! Total likes: ${heartCounts[index]}`);
}

function shareMessage(content) {
  const shareText = `Check out this message: "${content}"`;
  if (navigator.share) {
    navigator.share({
      title: 'Message from SafeSpace',
      text: shareText,
      url: window.location.href
    })
      .then(() => console.log('Message shared successfully!'))
      .catch((error) => console.error('Error sharing message:', error));
  } else {
    alert(shareText);
  }
}

const modal = document.getElementById("premium-modal");
const upgradeButton = document.getElementById("upgrade-button");

upgradeButton.onclick = function () {
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    closeModal();
  }
}

function signUp() {
      const username = document.getElementById('signup-username').value;
      const password = document.getElementById('signup-password').value;
      if (username && password) {
        localStorage.setItem('user', JSON.stringify({ username, password }));
        alert('Account created! You can now log in.');
        window.location.href = 'login.html';
      } else {
        alert('Please fill in all fields.');
      }
    }

    function login() {
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (storedUser && storedUser.username === username && storedUser.password === password) {
        alert('Login successful!');
        window.location.href = 'index.html';
      } else {
        alert('Invalid credentials!');
      }
    }

     const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const container = document.getElementById('all-message-list');
    
    function searchMessages() {
      const query = document.getElementById('search-input').value.toLowerCase();
      const cards = document.querySelectorAll('.message-card');
      cards.forEach(card => {
        const name = card.querySelector('strong').textContent.toLowerCase();
        card.style.display = name.includes(query) ? 'block' : 'none';
      });
    }

    messages.forEach(msg => {
      const card = document.createElement('div');
      card.className = 'message-card';
      card.innerHTML = `<strong>To: ${msg.to}</strong><p>${msg.content}</p>`;
      container.appendChild(card);
    });

renderMessages();