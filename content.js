// 1. On the shopping cart webpage, every seller has a different info URL for each item that he sells.
//    Querying all of one seller's URLs on the page means N requests for the same info.
//    It might trigger Amazon's HTTP 503 request throttling earlier than necessary, too.
//    Deduplication wouldn't work here as the URLs are different.
//
//    So we extract the *unique* seller IDs from these URLs, and
//    construct *fewer* seller URLs using these unique IDs, query them, and
//    update some data-attributes of *all* the (different) links of that seller on the webpage.
//
// 2. Style-sheets create the visual elements using the data attributes of the updated links.
//

const sellerCountryFrom = (s   ) => (_ = s.match( /<span class="a-list-item">([A-Z]{2})<\/span><\/li><\/ul>/m )) && _[1];  // Two letter code
const sellerRatingFrom  = (s   ) => (_ = s.match( /feedback-detail-description" href="#"><b>([0-9]+%)/m       )) && _[1];
const sellerIdFrom      = (s   ) => (_ = s.match( /seller=([a-zA-Z9-9+-_]+)/                                  )) && _[1];
const sellerIdFromLink  = (l   ) => sellerIdFrom( l.getAttribute( 'href' ));
const isUrlOfSeller     = (s,id) => s.includes( 'seller=' + id );
const sellerUrl         = (  id) => window.location.origin + '/sp/ref=x_' + Date.now() + '?seller=' + id;
const sellerLinks       = Array.from( document.querySelectorAll( 'a[href*="seller="]' ));
const sellerIds         = sellerLinks.map( sellerIdFromLink ).filter( (v,i,a) => a.indexOf( v ) === i );  // Unique


const updateSellerLinks = (id,r,c) => sellerLinks
                            .filter ( l =>  isUrlOfSeller( l.getAttribute( 'href' ), id ))
                            .forEach( l =>{ l.setAttribute( 'data-andrest-rating',  r || '?' )
                                            l.setAttribute( 'data-andrest-country', c || '?' ); });

sellerIds.forEach( id =>
{
	const url = sellerUrl( id );
	fetch( url )  // Async! Absolute URL for permission's sake.
	.then( resp =>
	{
		if( resp.ok ) return resp.text();
		console.error( '[ERROR] Cannot fetch seller info from ' + url + ': HTTP ' + resp.status );
		updateSellerLinks( id );
	})
	.then( text =>
	{
		console.log( '[DEBUG] Fetched seller info: ' + url );
		updateSellerLinks( id, sellerRatingFrom( text ), sellerCountryFrom( text ));
	})
	.catch( err =>  // Internet connection issues (not web server):
	{
		console.error( '[FATAL] Cannot fetch seller info from ' + url + ': ', err );
		updateSellerLinks( id );
	});
});


