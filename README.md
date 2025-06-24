# transaction-report-generator-ui

A simple UI for generating transaction reports.

## Features

-   User-friendly interface for report generation
-   Email validation and formatting
-   API integration for report requests
-   Clean separation of HTML, CSS, and JavaScript files for maintainability

## Project Structure

-   `index.html` — Main HTML file, links to CSS and JS files
-   `style.css` — All styles for the UI
-   `main.js` — All JavaScript logic for form handling and API requests
-   `webhookEndpoints.js` — Maintains all webhook URLs for different admin code selections

## Getting Started

1.  Clone the repository:

    ```sh
    git clone <repo-url>
    ```

2.  Open `index.html` in your browser to use the UI.

## Usage

-   Enter the required details in the form.
-   The email will automatically be formatted to end with `@eko.co.in` before sending the API request.
-   Submit to generate and download the transaction report.

## Form Details

The main form in this project collects the following information to generate a transaction report:

-   **Access Password**: Required for authorization. Must be a 12-character password with a special character (default: `eko@123abcX!`).
-   **Start Date / End Date**: Select the date and time range for the report.
-   **Email**: Enter only the local part (before `@`). The domain `@eko.co.in` is automatically appended, ensuring only company emails are used.
-   **Username**: The name of the user requesting the report.
-   **Department Name**: The department for which the report is being generated.
-   **Admin Code Selection**: Choose between providing an Admin Code or selecting 'All'. If 'All' is selected, the Admin Code field is auto-filled and disabled.
-   **Admin Code**: Enter the specific admin code (required unless 'All' is selected).
-   **Transaction Type**: Select the type of transaction for the report (e.g., Indo Nepal, NeoBank, DMT, etc.).
-   **Vertical**: Select the business vertical (EPS, Eloka, Connect).
-   **Agent Type**: (Conditional) Appears for certain verticals and admin code options.

### Email Handling

-   Users only enter the part before `@` in the email field.
-   The form automatically appends `@eko.co.in` to the email before sending the API request, ensuring all emails are company emails.
-   The form prevents entering `@` or any domain in the email field.

### Submission

-   On submission, the form validates all fields and sends a POST request to the appropriate API endpoint based on the selected transaction type and admin code selection.
-   Webhook URLs are managed in `webhookEndpoints.js` for easy updates.
-   Success and error messages are displayed to the user.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
