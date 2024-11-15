# Resume Tailor - Chrome Extension

The **Resume Tailor** Chrome Extension uses Google Gemini AI to tailor your resume to any job description. It automatically generates a customized CV and can even auto-populate application fields for you.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- Leverages Google Gemini AI to enhance and tailor your resume for specific job descriptions.
- Automatically generates a custom CV based on job requirements.
- Auto-fills application fields when possible, saving you time during the application process.
- Open-source project – contributions are welcome!

## Installation

To test the extension locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone git@github.com:msabree/resume-tailor-extension.git
   ```

2. Create a `.env` file in the project root and add your API key:
   ```
   REACT_APP_AI_API_KEY=<YOUR API KEY HERE>
   ```

3. Install dependencies and build the project:
   ```bash
   npm install
   npm run build
   ```

4. Load the unpacked extension into Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode**
   - Click **Load unpacked** and select the `dist` folder in your project

## Usage

1. After loading the extension, visit any job site where you wish to apply.
2. Click the extension icon that appears in the top-right corner of your browser.
3. Upload your resume in a text format (e.g., `.txt`, `.docx`).
4. Google Gemini AI will analyze the job description on the site and tailor your resume to match it.
5. You can then generate a custom CV based on the tailored content.
6. The extension will also auto-fill applicable fields in the job application form, where possible.

## Contributing

We welcome contributions! If you'd like to improve the extension, follow these steps:
1. Fork the repository.
2. Create a new branch for your changes.
3. Submit a pull request with a clear description of your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For questions or inquiries, please contact [msabree](mailto:makeen.sabree@gmail.com).