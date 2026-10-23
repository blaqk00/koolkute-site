# Koolkute: how to run and update your site

Working name: "Koolkute". This is a placeholder. To change it, edit the "name" and "tagline" lines in data/site.json. Nothing else needs to change.

## What is in the folder

- index.html: the page itself. you normally don't need to touch this.
- css/style.css: the colors and layout. pastel, rounded, phone first.
- js/app.js: the code that builds the cards from your data. you normally don't need to touch this.
- data/items.json: the daily drop. this is where you add new finds.
- data/downloads.json: the exclusive downloads (wallpapers, stickers). empty for now.
- data/site.json: the site name, about text, disclosure and copyright lines.
- images/: a folder for your own pictures (optional, see below).

## How to add a new find (the daily routine)

1. Open data/items.json in any text editor on your phone (or in the browser editor of your host).
2. Copy one whole block, from the opening curly bracket { to the closing one }, and paste it at the top of the list, right after the first [ bracket. Put a comma after the closing } of the block you paste if another block follows it.
3. Change these fields in your new block:
   - id: any unique word, like "drop-2026-10-24-a"
   - drop_date: the date of the drop, written like 2026-10-24 (year, month, day). the newest date shows as "daily drop". older dates move to "past drops". future dates stay hidden until their day arrives.
   - category: plushies, stationery, keychains, room decor, or anything you like
   - name: the product name
   - blurb: one or two short cute sentences about it
   - cute_score: a whole number from 1 to 5 (5 is the cutest)
   - emoji: one emoji to show if there is no picture
   - image: a web address of a picture (see pictures below). leave "" to use the emoji
   - affiliate_url: the buy link. leave "" until you have one. the button then says "buy link coming soon"
   - button_text: what the button says, like "shop it" or "get it on the seller's site"
4. Save the file. Done.

Rules to keep the file working:
- every text value sits between double quotes " ".
- between two blocks there is a comma, and the last block has no comma after it.
- a block with a missing quote or comma will break the page. if the page shows "couldn't load the drop", check for a missing comma or quote.

## Remove the examples

data/items.json starts with two EXAMPLE blocks. delete them (the whole { } block, plus its comma) once you have real finds.

## Affiliate links

When you have an affiliate link from a program you've joined, paste it into affiliate_url. The page already marks these buttons as sponsored and shows the disclosure in the about section. Nothing has been signed up for yet. You would join the programs yourself later.

## Exclusive downloads (wallpapers, stickers)

Add entries to data/downloads.json using the same copy-and-edit method. Fields: name, blurb, preview (a picture of the item), file_url (the download link), emoji. Each downloadable card shows a faint watermark with the site name and a per-visit tag, and blocks right-click, drag and copy on that section.

Be aware: no website can truly stop screenshots. These are deterrents. The watermark is what makes a leaked copy traceable. Free finds are not protected, on purpose, so people can share them.

## Pictures

You have two options:
- put the picture file in the images/ folder and use a path like "images/bunny.jpg" for the image field, or
- paste a web address (starting with https://) of a picture that is already online.

Use pictures you have the right to show. Pictures from a seller's own site are fine to link, but ask before reusing them if you're unsure.

## Putting the site online (not done yet)

Nothing has been bought, registered or signed up for. When you are ready, you can upload the whole cute-stuff-site folder to a free static host (drag-and-drop hosts or a free GitHub Pages site both work). Ask folk and it will walk you through the steps. Good to know: the page reads its data files from the web, so it has to be opened through a web address. Opening index.html straight from your phone's files will show a "couldn't load" message.

## Ideas for later (not built yet)

- a "send to a friend" button on each card
- a weekly email digest (needs an email list tool)
- a simple counter of which finds people click most
- a "wishlist" button that saves favorites on that phone
