# Resume Analyser

Resume Analyser is a tool that helps in analyzing resumes to extract meaningful information and provide insights. It leverages LLMs (Gemini API) to parse and understand the content of resumes, making it easier to assess and compare candidates.

## Live Website

You can use the Resume Analyser directly through our website:
[https://resume-analyser-tool.netlify.app/](https://resume-analyser-tool.netlify.app/)

To use the web version:
1. Visit the website
2. Enter your Gemini API key (Find out how below)
3. Upload your resume (PDF format)
4. Fill in the job details and description
5. Click "Analyze Resume" to get insights

## Local Development

If you want to run the project locally:

### Prerequisites

- Node.js (version 14 or above)
- npm (version 6 or above)
- Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DeathlyGodApples/Resume-Analyser.git
   cd Resume-Analyser
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a .env file in the root directory and add your Gemini API Key:
   ```env
   VITE_GEMINI_API_KEY = *your API key*
   ```

4. Start the application:
   ```bash
   npm run dev
   ```

## Getting a Gemini API Key

To use either the website or local version, you'll need a Gemini API key:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create or sign in to your Google account
3. Generate an API key
4. Use this key either in your .env file (local development) or input it on the website

## Features

- Resume parsing and analysis
- Job description matching
- Skills gap analysis
- ATS optimization suggestions
- Interactive chat for follow-up questions


## Side Notes

Some testing files such as MorphicDemo + TestStyles don't effect any of the core functions and were just used for testing different UI/UX features. Feel free to experiement with different styles using these.
