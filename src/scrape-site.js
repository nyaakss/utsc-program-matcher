import fs from 'fs/promises';

async function scrapeSite(){
    const url = 'https://utsc.calendar.utoronto.ca/section/Computer-Science';
    
    try {
    const response = await fetch(url);
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();

    await fs.mkdir('data/raw', { recursive: true })

    await fs.writeFile('data/raw/site.html', html);
    console.log('Successfully saved computer-science.html!');
    
  } catch (error) {
    console.error('Scraping failed:', error);
  }
}
scrapeSite();