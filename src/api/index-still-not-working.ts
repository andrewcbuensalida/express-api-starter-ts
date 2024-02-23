import express from "express";
import puppeteer from "puppeteer";
import MessageResponse from "../interfaces/MessageResponse";

const router = express.Router();

function delay(time: number) {
	return new Promise(function (resolve) {
		setTimeout(resolve, time);
	});
}

router.get<{}, MessageResponse>('/zillow',async (req, res) => {
  console.log('in zillow');
  
	const { city } = <{ city: string }>req.query;
	console.log(`Example city: `, city);
	if (!city) {
		res.json({ message: "Must include city" })
		return;
	}
	// scrape zillow for house listings in city

	let browser = await puppeteer.launch({
		headless: false,
	});
	let page = await browser.newPage();

	await page.goto(`https://www.zillow.com/homes/San-Diego,-CA_rb/`);
	// await delay(500);

	console.log("1");

	// browser.close();
	res.json({ message: "Successfully scraped" });
});

export default router;
