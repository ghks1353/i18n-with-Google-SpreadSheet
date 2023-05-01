const fs = require("fs");
const axios = require("axios");
const parser = require("csv-parser");
const { exit } = require("process");

let nuxtMode = false;
let targetLanguagesTmp = [];
let targetLanguages = [];

let spreadSheetID = "";
let spreadSheetGID = "0";
let configPath = "./nuxt.config.js";
let resultPath = "";

const results = [];

process.env.NO_VALIDATE_ENV_SETTINGS = true;

let config;
let url = "";

const translations = {};

// Parameter options
process.argv.forEach(function (val, index, array) {
	if (index <= 1) return;
	if (val.indexOf("=") == -1) return;
	if (val.split("=").length <= 1) return;

	let valueName = val.split("=")[0];
	let value = val.split("=")[1];

	switch (valueName) {
		case "nuxtMode":
		case "nuxt":
		case "nuxt_mode":
			nuxtMode = value == "1" || value == "true";
			break;

		case "config":
			configPath = value;
			break;

		case "output":
		case "to":
		case "result":
		case "path":
			resultPath = value;
			break;

		case "lang":
		case "language":
		case "languages":
			if (value.indexOf(",") == -1) {
				return;
			}
			targetLanguagesTmp = value.split(",");
			break;

		case "target":
		case "spreadsheet":
			spreadSheetID = value;
			break;

		case "gid":
		case "sheet":
			spreadSheetGID = value;
			break;
	}
});

if (spreadSheetID == "") {
	console.log("[i18n] Parameter missing: target");
	console.log("[i18n] Usage: target=<Google SpreadSheet ID>");
	return;
}

if (!nuxtMode && targetLanguagesTmp.length <= 0) {
	console.log(
		"[i18n] Target languages is empty. Please provide an array if you're not using nuxt=true"
	);
	console.log("[i18n] Usage: lang=A,B,C");
	console.log("[i18n] Example: lang=ko,en,ja");
	return;
}
if (resultPath == "") {
	console.log("[i18n] Warn: output=<Output Directory> is empty.");
	console.log("[i18n] Script will generate output files on same directory");
	resultPath = "./";
}

if (nuxtMode) {
	config = require(configPath).default;
}

url =
	"https://docs.google.com/spreadsheets/d/" +
	spreadSheetID +
	"/export?format=csv&id=" +
	spreadSheetID +
	"&gid=" +
	spreadSheetGID + "&seed=" + String(new Date().getTime());

console.log("[i18n] Find me on: https://github.com/ghks1353");

if (nuxtMode) {
	console.log(
		"[i18n] Target languages:",
		config.i18n.locales,
		", found on nuxt.config.js"
	);
	targetLanguages = config.i18n.locales;
} else {
	console.log("[i18n] Target languages:", targetLanguagesTmp);
	targetLanguagesTmp.forEach((item) => {
		targetLanguages.push({
			code: item,
		});
	});
}

console.log("[i18n] Creating temp folder");
if (!fs.existsSync("./temp")) {
	fs.mkdirSync("./temp");
}
if (!fs.existsSync(resultPath)) {
	fs.mkdirSync(resultPath);
}

targetLanguages.forEach((item) => {
	translations[item.code] = {};
});

async function loadFromDrive() {
	const st = await axios.get(url, { responseType: "stream" });
	st.data.pipe(fs.createWriteStream(`./temp/lang.csv`));

	setTimeout(async () => {
		fs.createReadStream(`./temp/lang.csv`)
			.pipe(parser())
			.on("data", (data) => {
				results.push(data);
			})
			.on("end", async () => {
				console.log(
					"[i18n] Fetched " + results.length.toString() + " data(s)"
				);
				results.forEach((item) => {
					let keyID = "";
					let langs = {};
					for (const [key, value] of Object.entries(item)) {
						if (key == "Constants") keyID = value;
						targetLanguages.forEach((litem) => {
							if (key == litem.code) {
								langs[litem.code] = value;
							}
						});
					}

					targetLanguages.forEach((litem) => {
						if (langs[litem.code] != "") {
							// check key already exists
							if (
								translations[litem.code][keyID] != null &&
								translations[litem.code][keyID] != ""
							) {
								// if item exists make it array if not and inert it.
								if (
									Array.isArray(
										translations[litem.code][keyID]
									)
								) {
									translations[litem.code][keyID].push(
										langs[litem.code]
									);
								} else {
									translations[litem.code][keyID] = [
										translations[litem.code][keyID],
									];
									translations[litem.code][keyID].push(
										langs[litem.code]
									);
								}
							} else {
								translations[litem.code][keyID] =
									langs[litem.code];
							}
						}
					});
				});

				console.log("[i18n] Saving files...");

				for (const [key, value] of Object.entries(translations)) {
					fs.writeFileSync(
						`./temp/${key}.json`,
						JSON.stringify(value)
					);

					if (fs.existsSync(`${resultPath}/${key}.json`)) {
						fs.unlinkSync(`${resultPath}/${key}.json`);
					}

					fs.renameSync(
						`./temp/${key}.json`,
						`${resultPath}/${key}.json`
					);
				}

				fs.unlinkSync(`./temp/lang.csv`);

				// unlink temp folder
				fs.rmdirSync(`./temp`);

				console.log("[i18n] Completed!");
			});
	}, 3000);
}
loadFromDrive();
