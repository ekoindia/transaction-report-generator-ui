// main.js
// All JavaScript logic from the HTML file, except the webhookEndpoints.js import

function getEndpoint(transactionType, isAll, isDumpMode) {
	// For dump mode, only use admin webhooks (no 'all' option)
	if (isDumpMode) {
		return window.dumpWebhooks[transactionType] || null;
	}

	// For raw data mode, use existing logic
	if (!transactionType) return null;
	return isAll
		? window.allWebhooks[transactionType]
		: window.adminWebhooks[transactionType];
}

const transactionTypeOptions = [
	{ label: "Indo Nepal", value: "indo_nepal" },
	{ label: "Aeps withdrawl", value: "aeps_withdrawl" },
	{ label: "Aeps Mini Statement", value: "aeps_mini_statement" },
	{ label: "Credit Card Bill Payment", value: "credit_card_bill_payment" },
	{ label: "AePs Fund Settlement", value: "aeps_fund_settlement" },
	{ label: "NeoBank", value: "neobank" },
	{ label: "Account Verification", value: "account_verification" },
	{ label: "DMT", value: "dmt" },
	{ label: "BBPS", value: "bbps" },
	{ label: "Airtel CMS", value: "airtel_cms" },
	{ label: "PG", value: "pg" },
	{ label: "QR", value: "qr" },
];

const dumpTransactionTypeOptions = [
	{ label: "DMT", value: "DmtDump" },
	{ label: "Wallet Balance", value: "WalletBalance" },
	{ label: "Neobank", value: "NeobankDump" },
	{ label: "Wallet", value: "WalletDump" },
	{ label: "Payout", value: "PayoutDump" },
	{ label: "Archive", value: "ArchiveDump" },
	{ label: "QR", value: "QR_Dump" },
	{ label: "PG", value: "PG_Dump" },
];

const verticalOptions = [
	{ label: "EPS", value: "EPS" },
	{ label: "Eloka", value: "Eloka" },
	{ label: "Connect", value: "Connect" },
];

const agentTypeOptions = {
	Eloka: [
		{ label: "Admin & Network", value: "admin_network" },
		{ label: "Individual", value: "individual" },
	],
	Connect: [
		{ label: "Individual", value: "individual" },
		{ label: "Distributor's Network", value: "distributors_network" },
	],
};

function renderOptions(
	selectEl,
	options,
	placeholderText = `Select an option`
) {
	selectEl.innerHTML = `<option value="" disabled selected>${placeholderText}</option>`;
	options.forEach((opt) => {
		const optionEl = document.createElement("option");
		optionEl.value = opt.value;
		optionEl.text = opt.label;
		selectEl.appendChild(optionEl);
	});
}

function getCurrentDateTimeLocal() {
	const now = new Date();
	now.setSeconds(0, 0);
	const pad = (n) => String(n).padStart(2, "0");
	return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
		now.getDate()
	)}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

document.addEventListener("DOMContentLoaded", function () {
	// Initialize with raw data mode (default)
	updateTransactionTypes(false);

	renderOptions(
		document.getElementById("vertical"),
		verticalOptions,
		"Select Vertical"
	);

	const now = getCurrentDateTimeLocal();
	document.getElementById("end_date").value = now;
	document.getElementById("end_date").max = now;
	document.getElementById("start_date").max = now;

	document.getElementById("message").style.display = "none";
});

function updateTransactionTypes(isDumpMode) {
	const options = isDumpMode
		? dumpTransactionTypeOptions
		: transactionTypeOptions;
	renderOptions(
		document.getElementById("transaction_type"),
		options,
		"Select Transaction Type"
	);
}

function updateAdminCodeOptions(isDumpMode) {
	const allLabel = document.getElementById("admin-all-label");

	if (isDumpMode) {
		// Hide "All" option for dump mode
		allLabel.style.display = "none";
		// Force selection to "By Admin Code"
		document.querySelector(
			'input[name="admin_option"][value="code"]'
		).checked = true;
		// Enable admin code input
		const adminInput = document.getElementById("admin_code");
		adminInput.disabled = false;
		adminInput.required = true;
		adminInput.value = "";
	} else {
		// Show "All" option for raw data mode
		allLabel.style.display = "block";
	}
}

// Mode selection event listener
document.querySelectorAll('input[name="mode_option"]').forEach((radio) => {
	radio.addEventListener("change", function () {
		const isDumpMode = this.value === "dump";

		// Update transaction types based on mode
		updateTransactionTypes(isDumpMode);

		// Update admin code options
		updateAdminCodeOptions(isDumpMode);

		// Reset agent type visibility
		document.getElementById("agentTypeGroup").style.display = "none";
		document.getElementById("agent_type").innerHTML = "";
		document.getElementById("agent_type").required = false;

		// Clear selections
		document.getElementById("transaction_type").selectedIndex = 0;
		document.getElementById("vertical").selectedIndex = 0;
	});
});

document.getElementById("vertical").addEventListener("change", function () {
	const vertical = this.value;
	const isDumpMode =
		document.querySelector('input[name="mode_option"]:checked').value ===
		"dump";
	const isAdminByCode =
		document.querySelector('input[name="admin_option"]:checked').value ===
		"code";

	// Show agent type for "By Admin Code" in raw mode, or for Eloka/Connect in dump mode
	const shouldShowAgentType =
		isAdminByCode &&
		(!isDumpMode ||
			(isDumpMode && (vertical === "Eloka" || vertical === "Connect")));

	if (agentTypeOptions[vertical] && shouldShowAgentType) {
		renderOptions(
			document.getElementById("agent_type"),
			agentTypeOptions[vertical],
			"Select Agent Type"
		);
		document.getElementById("agentTypeGroup").style.display = "block";
		document.getElementById("agent_type").required = true;
	} else {
		document.getElementById("agentTypeGroup").style.display = "none";
		document.getElementById("agent_type").innerHTML = "";
		document.getElementById("agent_type").required = false;
	}
});

document.querySelectorAll('input[name="admin_option"]').forEach((radio) => {
	radio.addEventListener("change", function () {
		const isAll = this.value === "all";
		const adminInput = document.getElementById("admin_code");

		adminInput.value = isAll ? "ALL" : "";
		adminInput.disabled = isAll;
		adminInput.required = !isAll;

		// Trigger a change on the vertical dropdown to re-evaluate agent type visibility
		document.getElementById("vertical").dispatchEvent(new Event("change"));
	});
});

document
	.getElementById("n8nForm")
	.addEventListener("submit", async function (e) {
		e.preventDefault();
		const messageEl = document.getElementById("message");
		messageEl.style.display = "none";
		messageEl.className = "";

		// ✅ Password Validation
		const password = document.getElementById("access_password").value;
		const passwordPattern =
			/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{12}$/;
		const allowedPassword = "eko@123abcX!";

		if (!passwordPattern.test(password) || password !== allowedPassword) {
			messageEl.innerHTML =
				"Unauthorized: Incorrect or invalid password format.";
			messageEl.classList.add("error");
			messageEl.style.display = "block";
			return;
		}

		const formatDateTime = (dt) => (dt ? dt.replace("T", " ") + ":00" : "");
		const isAll =
			document.querySelector('input[name="admin_option"]:checked')
				.value === "all";
		const isDumpMode =
			document.querySelector('input[name="mode_option"]:checked')
				.value === "dump";

		// Get the local part and build the email
		const emailLocal = document.getElementById("email_local").value.trim();
		const email = emailLocal ? emailLocal + "@eko.co.in" : "";

		const data = {
			start_date: formatDateTime(
				document.getElementById("start_date").value
			),
			end_date: formatDateTime(document.getElementById("end_date").value),
			email: email,
			user_name: document.getElementById("user_name").value,
			department_name: document.getElementById("department_name").value,
			admin_code: isAll
				? "ALL"
				: document.getElementById("admin_code").value,
			transaction_type: document.getElementById("transaction_type").value,
			vertical: document.getElementById("vertical").value,
			agent_type:
				document.getElementById("agentTypeGroup").style.display ===
				"block"
					? document.getElementById("agent_type").value
					: null,
			mode: isDumpMode ? "dump" : "raw",
		};

		// Only allow non-empty local part, and must be a valid local part (no @ allowed)
		if (!emailLocal.match(/^[A-Za-z0-9._%+-]+$/)) {
			messageEl.innerHTML =
				"Please enter a valid email local part (before @eko.co.in), without @.";
			messageEl.classList.add("error");
			return;
		}

		try {
			const endpoint = getEndpoint(
				data.transaction_type,
				isAll,
				isDumpMode
			);

			if (!endpoint) {
				messageEl.innerHTML =
					"No endpoint configured for this transaction type.";
				messageEl.classList.add("error");
				messageEl.style.display = "block";
				return;
			}

			const res = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (res.ok) {
				messageEl.innerHTML =
					"Report generated successfully. Check your inbox.";
				messageEl.classList.add("success");
				messageEl.style.display = "block";

				document.getElementById("n8nForm").reset();
				document.getElementById("agentTypeGroup").style.display =
					"none";
				document.getElementById("admin_code").disabled = false;

				// Reset to default mode (Raw Data)
				document.querySelector(
					'input[name="mode_option"][value="raw"]'
				).checked = true;
				updateTransactionTypes(false);
				updateAdminCodeOptions(false);

				const now = getCurrentDateTimeLocal();
				document.getElementById("end_date").value = now;
				document.getElementById("end_date").max = now;
				document.getElementById("start_date").max = now;
			} else {
				messageEl.innerHTML = "Something went wrong. Please try again.";
				messageEl.classList.add("error");
				messageEl.style.display = "block";
			}
		} catch (err) {
			console.error(err);
			messageEl.innerHTML =
				"Network error. Please check your connection.";
			messageEl.classList.add("error");
			messageEl.style.display = "block";
		}
	});

const emailInput = document.getElementById("email_local");
emailInput.addEventListener("input", function (e) {
	// Prevent user from typing '@' or any part of the domain
	if (this.value.includes("@")) {
		this.value = this.value.replace(/@.*/, "");
	}
});
