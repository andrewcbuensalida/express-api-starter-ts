import express from "express";
import puppeteer from "puppeteer";
import MessageResponse from "../interfaces/MessageResponse";

const router = express.Router();

function delay(time: number) {
	return new Promise(function (resolve) {
		setTimeout(resolve, time);
	});
}

router.get<{}, MessageResponse>("/", async (req, res) => {
	const { url } = <{ url: string }>req.query;
	console.log(`Example url: `, url);
	if (!url) {
		res.json({ message: "Must include url" });
		return;
	}
	// scrape url for house listings

	let browser = await puppeteer.launch({
		headless: false,
	});
	let page = await browser.newPage();
  
	await page.goto(url);
  await delay(500);
	browser.close();

	// open twice to activate captcha
	browser = await puppeteer.launch({
		headless: false,
	});
	page = await browser.newPage();

	await page.goto(url);

	console.log("1");
	// this does not work. it just hangs
	// await page.waitForNavigation({ waitUntil: "load" });
	let iframe = await page.$('iframe[title="Human verification challenge"]');
	console.log(`Example iframe: `, iframe);
	const frame = await iframe?.contentFrame()
	console.log(`Example frame: `, frame)
	let iframeDiv = await frame?.$("body div p");
	console.log(`Example iframeDiv: `, iframeDiv)
	const frameHTML = await frame?.$eval("body div p", (element) => {
    console.log('iframeDiv',element.innerHTML);
    return element.innerHTML
	});
  console.log(`Example frameHTML: `, frameHTML);

	if (iframeDiv) {
		console.log("in if");
		// await delay(5000);
		await iframeDiv.click({ delay: 6000 }); // this errors, says not clickable

	}
  await delay(500000);
	await page.waitForSelector(
		'[placeholder="Enter an address, neighborhood, city, or ZIP code"]'
	);

	console.log("2");

	await page.type(
		'[placeholder="Enter an address, neighborhood, city, or ZIP code"]',
		"San Diego",
		{ delay: 200 }
	);
	console.log("3");
	await delay(2000);

	const firstCitySearchSuggestion = await page.$(`[role="option"]`);
	console.log(
		`Example firstCitySearchSuggestion: `,
		firstCitySearchSuggestion
	);
	await firstCitySearchSuggestion?.click();

	await delay(2000);
	const forSaleButton = await page.$(
		"body > div:nth-child(137) > div > div.yui3-lightbox.interstitial > div > div > div > ul > li:nth-child(1) > button"
	);
	// $eval looks for the element based on the selector, then passes that element as an argument to the callback
	const button = await page.$eval(
		"body > div:nth-child(137) > div > div.yui3-lightbox.interstitial > div > div > div > ul > li:nth-child(1) > button",
		(element) => {
			return element?.innerText;
		}
	);

	console.log("button", button);

	// await delay(2000);
	console.log(`Example forSaleButton: `, forSaleButton);

	await forSaleButton?.click();
	console.log("after clicking for sale");

	// await delay(2000);

	// await page.waitForSelector('body')
	await page.waitForNavigation();

	// browser.close();
	res.json({ message: "Successfully scraped" });
});

export default router;
