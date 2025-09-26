# Firebase Studio

This is a Next.js starter project built in Firebase Studio.

## How to Clone and Run Locally

Follow these steps to get the project running on your local machine using VS Code.

### Prerequisites

Before you begin, ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)

### 1. Clone the Project

Open your terminal or command prompt and clone the project repository. You will need to replace `[YOUR_GIT_REPOSITORY_URL]` with the actual URL of your Git repository.

```bash
git clone [YOUR_GIT_REPOSITORY_URL]
cd [YOUR_PROJECT_DIRECTORY]
```

### 2. Install Dependencies

Once you are inside the project directory, install all the required npm packages.

```bash
npm install
```

### 3. Set Up Environment Variables

The project uses Genkit with the Google AI plugin for its AI features, which requires a Gemini API key.

1.  Create a new file named `.env` in the root of your project directory.
2.  Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  Add the following line to your `.env` file, replacing `YOUR_API_KEY` with your actual key:

```
GEMINI_API_KEY=YOUR_API_KEY
```

### 4. Run the Development Servers

This project requires two separate development servers to run concurrently: one for the Next.js frontend and one for the Genkit AI backend.

1.  **Open two terminals** in VS Code (`Terminal` > `New Terminal`).
2.  In the **first terminal**, start the Next.js development server:

    ```bash
    npm run dev
    ```
    Your application will be available at `http://localhost:9002`.

3.  In the **second terminal**, start the Genkit development server:

    ```bash
    npm run genkit:dev
    ```
    This will start the Genkit development UI, which you can use to inspect your AI flows.

You're all set! You can now edit the code in VS Code, and the changes will be reflected in your local browser.
