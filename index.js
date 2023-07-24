const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser')
const fs = require('fs');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const port = 8989;

// app.get('/', async (req, res) => {
app.post('/', async (req, res) => {
  try {
    // Launch a headless browser
    const browser = await puppeteer.launch();

    // Open a new page
    const page = await browser.newPage();

    // Navigate to the route you want to print as PDF
    // await page.goto('https://poolvilla-laravel.porrapat.com/villas/reservations/print/9b6588bf-d8db-4621-a61d-df72f7d2ede1'); // Replace with your actual route

    // Wait for any asynchronous content to load (optional, if needed)
    // await page.waitForTimeout(3000);

    // await page.setContent('<h1>Hello</h1>', { waitUntil: 'domcontentloaded' });
    const postData = req.body;
    
    // Process the data or do whatever you need with it
    // console.log('Received POST data:', JSON.stringify(postData));

    const htmltemp = JSON.parse(JSON.stringify(postData));
    const html = htmltemp.myhtml;
    // console.log(html);
    await page.setContent(html, { waitUntil: 'networkidle0' });
    // await page.setContent(html, { waitUntil: 'domcontentloaded' });

    // Print the page as PDF
    const pdfBuffer = await page.pdf({
      format: 'A4', // Choose the format (A4, Letter, etc.)
      printBackground: true, // Include background colors and images
      displayHeaderFooter: false,
      margin: {
        top: '10px',
        bottom: '0px',
        left: '0px',
        right: '0px',
      },
    });

    // Close the browser
    await browser.close();

    res.contentType('application/pdf');
    res.send(pdfBuffer);

    console.log('PDF printed successfully!');
    
    // Optionally, you can send a response to the client indicating that the PDF was saved.
    // res.send('PDF saved successfully!');
  } catch (err) {
    console.error('Error printing PDF:', err);
    res.status(500).send('Error printing PDF');
  }
});

// Replace 'my-route' with the route you want to print as PDF.
// For example, you might have a separate route handler for this.

app.get('/my-route', (req, res) => {
  // Render the content you want to print as PDF
  // This could be an HTML template or any dynamically generated content.
  // For this example, we'll just send a simple HTML page.
  const html = '<html><body><h1>Hello, this will be printed as a PDF!</h1></body></html>';
  res.send(html);
});

// Start the web server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});