import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// Enquiry form submission
document.getElementById('sendEnquiry').addEventListener('click', function() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  // Send enquiry data to server
  fetch('/sendEnquiry', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, message })
  })
  .then(response => {
    if (response.ok) {
      alert('Enquiry sent successfully!');
      document.getElementById('enquiryModal').style.display = 'none'; // Hide modal on success
    } else {
      throw new Error('Failed to send enquiry');
    }
  })
  .catch(error => {
    console.error('Error sending enquiry:', error);
    alert('Failed to send enquiry. Please try again later.');
  });
});

// Populate portfolio cards dynamically
const portfolioData = [
  { title: 'Tattoo Portfolio', image: 'mooncake.jpg', src: './src' },
  { title: 'Available Designs', image: 'circle.jpg', src: './src' },
  { title: 'Crafts Portfolio', image: 'oatmilk.jpg', src: './src' }
];

const portfolioCardsContainer = document.getElementById('portfolioCards');
portfolioData.forEach(item => {
  const cardHtml = `
    <div class="col-md-4">
      <div class="card">
        <img src="${item.image}" class="card-img-top" alt="${item.title}">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
          <a href="${item.link}" class="btn btn-primary">View Portfolio</a>
        </div>
      </div>
    </div>
  `;
  portfolioCardsContainer.insertAdjacentHTML('beforeend', cardHtml);
});

reportWebVitals();
