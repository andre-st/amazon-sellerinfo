# Firefox Addon: Amazon Seller Info, v1.0

![Maintenance](https://img.shields.io/maintenance/no/2020.svg)

I often forget to check the seller before ordering. 
This addon shows me the seller ratings on the Amazon shopping cart webpage, 
right before I could mess up.


![Screenshot](README-screenshot.png?raw=true "Screenshot")


## Install temporary

1. download/clone this project
2. visit `about:debugging` in Firefox
3. click "Load Temporary Add-on" and select `manifest.json`

## Install permanently

1. currently not available on addons.mozilla.org
2. download [latest XPI-file](https://github.com/andre-st/amazon-sellerinfo/releases)
3. visit `about:config` and change `xpinstall.signatures.required` = false
4. visit `about:addons`, click gear symbol &#9881;, install from file, select downloaded XPI-file 

## Permissions

- `localStorage`: required for saving website thumbnails locally 
  (Firefox cache would reload every time from the web given worse headers, slows down page)
- `<all_urls>`: required for having web-access to the configured images through 
  the _Canvas API_ which is used for creating website thumbnails


## Observations and limitations

- none yet


## Feedback

If you like this project, give it a star on GitHub.
Report bugs or suggestions [via GitHub](https://github.com/andre-st/firefox-whewtab/issues)
or see the [AUTHORS.md](AUTHORS.md) file.

