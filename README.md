# How to test the feature

1 `npm ci`
2 `npm run dev`
3 In postman, create a GET request to `http://localhost:5000/api/v1/zillow?city=San Jose` (can change San Jose to any US city), then click Send. This will open a Chromium browser
4 If "Press & Hold" human verification button shows, manually click and hold. This is difficult to automatically do with Puppeteer. After manual verification, it shouldn't ask you again for a while. Repeat step 3.

# TODO

1 pagination
2 scroll down to get all listings
3 collect # bedrooms, # bathrooms, etc

# Developer Notes

To prevent an element from blurring when clicking dev tools,
settings > more tools > Rendering > Emulate a Focused page
