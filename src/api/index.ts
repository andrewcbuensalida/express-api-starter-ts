import express from "express";
import puppeteer from "puppeteer";
import MessageResponse from "../interfaces/MessageResponse";
import puppeteerExtra from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";

puppeteerExtra.use(Stealth());

const router = express.Router();

function delay(time: number) {
	return new Promise(function (resolve) {
		setTimeout(resolve, time);
	});
}

router.get<{}, MessageResponse>("/zillow", async (req, res) => {
	console.log("in zillow1");

	const { city } = <{ city: string }>req.query;
	console.log(`Example city: `, city);
	if (!city) {
		res.json({ message: "Must include city" });
		return;
	}
	// scrape zillow for house listings in city

	let browser = await puppeteerExtra.launch({
		headless: false,
	});
	let page = await browser.newPage();

	await page.setUserAgent(
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
	);

	await page.goto(`https://www.zillow.com/homes/for_sale/`);
	await delay(5000);

	console.log("1");

	// const cityInput = await page.$(
	// 	`input[placeholder="Address, neighborhood, city, ZIP"]`
	// );
	let cityInput = await page.$(
		`input[placeholder="City, Neighborhood, ZIP, Address"]`
	);

	if (!cityInput) {
		cityInput = await page.$(
			`input[placeholder="Address, neighborhood, city, ZIP"]`
		);
	}

	console.log(`Example cityInput: `, cityInput);
	await cityInput?.type(city, { delay: 200 });
	await delay(5000);

	const firstCitySearchSuggestion = await page.$(`li[role="option"]`);
	console.log(
		`Example firstCitySearchSuggestion: `,
		firstCitySearchSuggestion
	);
	await firstCitySearchSuggestion?.click();
	await delay(5000);

  // have to scroll down so all listings captured

	const pricesElements = await page.$$(
		`span[data-test="property-card-price"]`
	);

	const pricesPromises = pricesElements.map(async (priceElement: any) => {
		return await (
			await priceElement.getProperty("textContent")
		).jsonValue();
	});
	const prices = await Promise.all(pricesPromises);
	console.log(`Example prices: `, prices);

	const addressElements = await page.$$(
		`address[data-test="property-card-addr"]`
	);

	// could also do it this way to get the inner text of an element
	const addressPromises = addressElements.map(async (addressElement: any) => {
		return await page.evaluate((el) => el.innerText, addressElement);
	});
	const addresses = await Promise.all(addressPromises);
	console.log(`Example prices: `, addresses);

	const listings = [];
	for (let i = 0; i < prices.length; i++) {
		const listing = {
			price: prices[i],
			address: addresses[i],
		};
		listings.push(listing)
	}
	browser.close();
	res.json({ message: "Successfully scraped", listings });
});

export default router;
