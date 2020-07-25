const SELLER_RATING_REX     = new RegExp( 'feedback-detail-description" href="#"><b>([0-9]+%)', 'm' );
const SELLER_RATING_UNKNOWN = '?';

const sellerLinks     = Array.from( document.querySelectorAll( 'a[href^="/gp/help/seller/at-a-glance.html"]' ));
const sellerUrls      = sellerLinks.map( l => l.getAttribute( 'href' ));
const sellerUrlsUniq  = sellerUrls.filter( (v,i,a) => a.indexOf( v ) === i );  // Prevent HTTP 503 request throttling
const rateSellerLinks = (href,r) => sellerLinks
                                     .filter ( l => l.getAttribute( 'href' ) == href )
                                     .forEach( l => l.setAttribute( 'data-andrest-rating', r ));
                                     // UI elements are added via CSS.

sellerUrlsUniq.forEach( url =>
{
	// We need an absolute URL for permissions sake:
	const a      = document.createElement( 'A' );
	a.href       = url;
	const absUrl = a.href;
	
	fetch( absUrl )
	.then( function( resp )
	{
		if( resp.ok )
			return resp.text();
		else
		{
			console.log( '[ERROR] Fetching seller info failed: ' + url + ' (HTTP ' + resp.status + ')' );
			rateSellerLinks( url, SELLER_RATING_UNKNOWN );
		}
	})
	.then( function( text )
	{
		const m = text.match( SELLER_RATING_REX );
		console.log( '[DEBUG] Fetched ' + url );
		rateSellerLinks( url, m ? m[1] : SELLER_RATING_UNKNOWN );
	});
});



