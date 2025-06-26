# transaction-report-generator-ui

A simple UI for generating transaction reports with support for both Raw Data and Dump Data modes.

## Features

-   User-friendly interface for report generation
-   **Mode Selection**: Choose between Raw Data and Dump Data modes
-   **Conditional Form Logic**: Form fields adapt based on selected mode
-   Email validation and formatting
-   API integration for report requests
-   Clean separation of HTML, CSS, and JavaScript files for maintainability

## Project Structure

-   `index.html` — Main HTML file, links to CSS and JS files
-   `style.css` — All styles for the UI
-   `main.js` — All JavaScript logic for form handling and API requests
-   `webhookEndpoints.js` — Maintains all webhook URLs for different admin code selections and dump data endpoints

## Getting Started

1.  Clone the repository:

    ```sh
    git clone https://github.com/ekoindia/transaction-report-generator-ui.git
    ```

2.  Open `index.html` in your browser to use the UI.

## Usage

-   Enter the required details in the form.
-   The email will automatically be formatted to end with `@eko.co.in` before sending the API request.
-   Submit to generate and download the transaction report.

## Form Details

The main form in this project collects the following information to generate a transaction report:

-   **Start Date / End Date**: Select the date and time range for the report.
-   **Email**: Enter only the local part (before `@`). The domain `@eko.co.in` is automatically appended, ensuring only company emails are used.
-   **Username**: The name of the user requesting the report.
-   **Department Name**: The department for which the report is being generated.
-   **Mode**: Choose between "Raw Data" (default) and "Dump Data" modes.
-   **Admin Code Selection**: Choose between providing an Admin Code or selecting 'All'. Note: 'All' option is only available in Raw Data mode.
-   **Admin Code**: Enter the specific admin code (required unless 'All' is selected in Raw Data mode).
-   **Transaction Type**: Select the type of transaction for the report. Available options depend on the selected mode.
-   **Vertical**: Select the business vertical (EPS, Eloka, Connect).
-   **Agent Type**: (Conditional) Appears for certain verticals and admin code options. In "Raw Data" mode, it appears when "By Admin Code" is selected for specific verticals. In "Dump Data" mode, it appears for "Eloka" and "Connect" verticals.

### Mode Selection

#### Raw Data Mode (Default)

-   **Admin Code Selection**: Both "By Admin Code" and "All" options available
-   **Transaction Types**: Standard transaction types (Indo Nepal, NeoBank, DMT, BBPS, etc.)
-   **Agent Type**: Available for specific verticals when using "By Admin Code"
-   **Webhooks**: Uses existing raw data endpoints from `adminWebhooks` and `allWebhooks`

#### Dump Data Mode

-   **Admin Code Selection**: Only "By Admin Code" option (no "All" option)
-   **Transaction Types**: Specialized dump types:
    -   DmtDump
    -   WalletBalance
    -   NeobankDump
    -   WalletDump
    -   PayoutDump
    -   ArchiveDump
    -   QR_Dump
    -   PG_Dump
-   **Agent Type**: Shown only when the vertical is "Eloka" or "Connect".
-   **Webhooks**: Uses dedicated dump data endpoints from `dumpWebhooks`

### Email Handling

-   Users only enter the part before `@` in the email field.
-   The form automatically appends `@eko.co.in` to the email before sending the API request, ensuring all emails are company emails.
-   The form prevents entering `@` or any domain in the email field.

### Submission

-   On submission, the form validates all fields and sends a POST request to the appropriate API endpoint based on the selected mode, transaction type, and admin code selection.
-   **Raw Data Mode**: Uses endpoints from `adminWebhooks` or `allWebhooks` depending on admin code selection
-   **Dump Data Mode**: Uses endpoints from `dumpWebhooks` (admin code only)
-   Webhook URLs are managed in `webhookEndpoints.js` for easy updates.
-   Success and error messages are displayed to the user.

### Dynamic Form Behavior

-   **Mode Changes**: Switching between Raw Data and Dump Data modes automatically updates available transaction types and admin code options
-   **Admin Code Logic**: The "All" option is hidden when Dump Data mode is selected
-   **Agent Type Visibility**: Agent type selection is only shown in Raw Data mode for specific verticals
-   **Form Reset**: After successful submission, the form resets to Raw Data mode with default values

## Webhook Endpoints

The application uses three sets of webhook endpoints defined in `webhookEndpoints.js`:

### Raw Data Endpoints

-   **`adminWebhooks`**: Used when "By Admin Code" is selected in Raw Data mode
-   **`allWebhooks`**: Used when "All" is selected in Raw Data mode

### Dump Data Endpoints

-   **`dumpWebhooks`**: Used exclusively in Dump Data mode (only admin code supported)

Each endpoint corresponds to a specific transaction type and handles the appropriate data processing on the backend.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
