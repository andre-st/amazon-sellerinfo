# Browser Add-On for Amazon: Seller Info, v1.3

![Maintenance](https://img.shields.io/maintenance/yes/2022.svg)

I often forget to check the seller before placing the order (probably by design).
This add-on shows me the sellers ratings and countries on the following Amazon webpages, right before I could mess up:

- shopping cart webpage 
- final "Review/Place Your Order" webpage


![Screenshot](README-screenshot.png?raw=true "Screenshot")



## Install

### Firefox
1. currently not available on addons.mozilla.org (GitHub support only)
2. download [latest XPI-file](https://github.com/andre-st/amazon-sellerinfo/releases) (was checked and signed by Mozilla)
3. visit `about:addons`, click gear symbol &#9881;, install from file, select downloaded XPI-file 

### Chrome
1. follow section "Install for developers"



## Install for developers

### Firefox
1. download/clone this project
2. visit `about:debugging` in Firefox
3. click "Load Temporary Add-on" and select `manifest.json`

For permanent install of unsigned add-ons [see here](https://support.mozilla.org/en-US/kb/add-on-signing-in-firefox#w_what-are-my-options-if-i-want-to-use-an-unsigned-add-on-advanced-users)


### Chrome, Brave and other Chromium derivates
1. download/clone this project
2. Chrome > Settings > Extensions > [x] Developer mode (upper right corner)
3. Chrome > Settings > Extensions > click <kbd>Load unpacked extension</kbd> 
4. browse to the source directory of the downloaded, unarchived release and confirm



## Permissions

- modifies some Amazon webpages in order to display seller ratings next to the seller names
- reads Amazon's seller info webpage
- details see `permissions` and `matches` in [manifest.json](manifest.json)
- this add-on is easy to inspect if you consider using it:
	- small files
	- no 3rd party libs, nothing minified
	- Mozilla's `addon.xpi` files are just Zip archives


## Observations and limitations

- European Amazon sites only: Amazon.co.uk, Amazon.de, Amazon.fr, Amazon.it, and Amazon.es
- Amazon's request throttling might kick in and you will see one or many "?" ratings (web console should print a HTTP 503 error)
- after some time (perhaps of testing too often), 1 (foreign) seller info page was not accessible anymore although others were still available - even with the add-on being disabled.
	I was redirected to the help page. Maybe a bug or anti-bot feature. Accessible after ~24 hours again.
- see [current issues](https://github.com/andre-st/amazon-sellerinfo/issues)



## Feedback

If you like this project, give it a star on GitHub.
Report bugs or suggestions [via GitHub](https://github.com/andre-st/firefox-whewtab/issues)
or see the [AUTHORS.md](AUTHORS.md) file.

