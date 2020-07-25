# Firefox Addon: Amazon Seller Info, v1.0

![Maintenance](https://img.shields.io/maintenance/yes/2020.svg)

I often forget to check the seller before ordering (probably by design). 
This addon shows me the seller ratings on the Amazon shopping cart webpage, 
right before I could mess up.


![Screenshot](README-screenshot.png?raw=true "Screenshot")


## Install permanently

1. currently not available on addons.mozilla.org (GitHub support only)
2. download [latest XPI-file](https://github.com/andre-st/amazon-sellerinfo/releases) (was checked and signed by Mozilla)
3. visit `about:addons`, click gear symbol &#9881;, install from file, select downloaded XPI-file 


## Install temporary (developers)

1. download/clone this project
2. visit `about:debugging` in Firefox
3. click "Load Temporary Add-on" and select `manifest.json`

For permanent install of unsigned add-ons [see here](https://support.mozilla.org/en-US/kb/add-on-signing-in-firefox#w_what-are-my-options-if-i-want-to-use-an-unsigned-add-on-advanced-users)


## Permissions

- modifies Amazon's shopping cart webpage
- reads Amazon's seller info webpage
- details see 'permissions' in [manifest.json](manifest.json)
- this addon is easy to inspect if you consider using it:
	- no 3rd party libs, nothing minified, small files
	- XPI files are just Zip archives


## Observations and limitations

- European Amazon sites only
- Amazon's request throttling might kick in and you will see one or many "?" ratings (web console should print a HTTP 503 error)
- see [current issues](https://github.com/andre-st/amazon-sellerinfo/issues)



## Feedback

If you like this project, give it a star on GitHub.
Report bugs or suggestions [via GitHub](https://github.com/andre-st/firefox-whewtab/issues)
or see the [AUTHORS.md](AUTHORS.md) file.

