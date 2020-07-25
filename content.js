const SELLER_RATING_REX      = new RegExp( 'feedback-detail-description" href="#"><b>([0-9]+%)',       'm' );
const SELLER_COUNTRY_REX     = new RegExp( '<span class="a-list-item">([A-Z]{2})<\/span><\/li><\/ul>', 'm' );  // Two letter code
const SELLER_RATING_UNKNOWN  = '?';
const SELLER_COUNTRY_UNKNOWN = '?';

const sellerLinks     = Array.from( document.querySelectorAll( 'a[href^="/gp/help/seller/at-a-glance.html"]' ));
const sellerUrls      = sellerLinks.map( l => l.getAttribute( 'href' ));
const sellerUrlsUniq  = sellerUrls.filter( (v,i,a) => a.indexOf( v ) === i );  // Prevents HTTP 503 request throttling
const rateSellerLinks = (href,r,c) => sellerLinks
                                        .filter ( l => l.getAttribute( 'href' ) == href )
                                        .forEach( l => {
                                           l.setAttribute( 'data-andrest-rating',  r );
                                           l.setAttribute( 'data-andrest-country', c );
                                        });
                                        // UI elements are added via CSS.

sellerUrlsUniq.forEach( url =>
{
	// We need an absolute URL for permissions sake:
	const a      = document.createElement( 'A' );
	a.href       = url;
	const absUrl = a.href;
	
	fetch( absUrl )
	.then( resp =>
	{
		if( resp.ok )
			return resp.text();
		else
		{
			console.log( '[ERROR] Fetching seller info failed: ' + url + ' (HTTP ' + resp.status + ')' );
			rateSellerLinks( url, SELLER_RATING_UNKNOWN, SELLER_COUNTRY_UNKNOWN );
		}
	})
	.then( text =>
	{
		console.log( '[DEBUG] Fetched ' + url );
		const m = text.match( SELLER_RATING_REX  );
		const c = text.match( SELLER_COUNTRY_REX );
		rateSellerLinks( url,
				m ? m[1] : SELLER_RATING_UNKNOWN,
				c ? c[1] : SELLER_COUNTRY_UNKNOWN );
	});
});



