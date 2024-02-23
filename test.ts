import puppeteer from "puppeteer";

async function scrape() {
	const browser = await puppeteer.launch({
		headless: false,
	});
	console.log(1);

	const page = await browser.newPage();
	console.log(2);
	const url = "http://127.0.0.1:4000/test.html";
	await page.goto(url);
	console.log(3);
	const iframe = await page.$("iframe");
	console.log(`Example iframe: `, iframe);
  const frame = await iframe?.contentFrame();
  console.log(`Example frame: `, frame)
	let iframeDiv = await frame?.$("#iframe_div");
  console.log(`Example iframeDiv: `, iframeDiv)

  await iframeDiv?.click();
}

console.log("starting");

scrape();
