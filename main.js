// main.js
// All JavaScript logic from the HTML file, except the webhookEndpoints.js import

function getEndpoint(transactionType, isAll) {
	const mapKey = {
		indo_nepal: "indo_nepal",
		neobank: "neobank",
		dmt: "dmt",
		account_verification: "account_verification",
		aeps_fund_settlement: "aeps_fund_settlement",
		aeps_mini_statement: "aeps_mini_statement",
		aeps_cashout: "aeps_cashout",
		credit_card_bill_payment: "credit_card_bill_payment",
		airtel_cms: "airtel_cms",
		pg: "pg",
		qr: "qr",
		travel_and_insurance: "travel_and_insurance",
		bbps: "bbps",
	}[transactionType];
	if (!mapKey) return null;
	return isAll ? window.allWebhooks[mapKey] : window.adminWebhooks[mapKey];
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
	renderOptions(
		document.getElementById("transaction_type"),
		transactionTypeOptions,
		"Select Transaction Type"
	);
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

document.getElementById("vertical").addEventListener("change", function () {
	const vertical = this.value;
	const showAgent =
		document.querySelector('input[name="admin_option"]:checked').value ===
		"code";

	if (agentTypeOptions[vertical] && showAgent) {
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

		if (isAll) {
			document.getElementById("agentTypeGroup").style.display = "none";
			document.getElementById("agent_type").innerHTML = "";
			document.getElementById("agent_type").required = false;
		} else {
			const vertical = document.getElementById("vertical").value;
			if (agentTypeOptions[vertical]) {
				renderOptions(
					document.getElementById("agent_type"),
					agentTypeOptions[vertical],
					"Select Agent Type"
				);
				document.getElementById("agentTypeGroup").style.display =
					"block";
				document.getElementById("agent_type").required = true;
			}
		}
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
				!isAll &&
				document.getElementById("agentTypeGroup").style.display ===
					"block"
					? document.getElementById("agent_type").value
					: null,
		};

		// Only allow non-empty local part, and must be a valid local part (no @ allowed)
		if (!emailLocal.match(/^[A-Za-z0-9._%+-]+$/)) {
			messageEl.innerHTML =
				"Please enter a valid email local part (before @eko.co.in), without @.";
			messageEl.classList.add("error");
			return;
		}

		try {
			const endpoint = getEndpoint(data.transaction_type, isAll);

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
