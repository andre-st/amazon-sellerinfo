const SELLER_RATING_REX      = new RegExp( 'feedback-detail-description" href="#"><b>([0-9]+%)',       'm' );
const SELLER_COUNTRY_REX     = new RegExp( '<span class="a-list-item">([A-Z]{2})<\/span><\/li><\/ul>', 'm' );    // Two letter code
const SELLER_URL_ID_REX      = new RegExp( 'seller=([a-zA-Z9-9+-_]+)' );
const SELLER_LINK_SELECTOR   = 'a[href^="/gp/help/seller/at-a-glance.html"]';
const SELLER_URL_STUB        = window.location.origin + '/gp/help/seller/at-a-glance.html/ref=ox_sc_seller_sfl_s1?seller=';  // Absolute URL for permission's sake
const SELLER_RATING_UNKNOWN  = '?';
const SELLER_COUNTRY_UNKNOWN = '?';


// Seller info URLs are different even for the same seller.
// We don't want multiple requests for basically the same info
// as it also triggers Amazon's HTTP503 request throttling.
// So we will build something with the seller ID:
const sellerLinks = Array.from( document.querySelectorAll( SELLER_LINK_SELECTOR ));
const sellerIds   = sellerLinks
				.map( l => l.getAttribute( 'href' ).match( SELLER_URL_ID_REX )[1] );
				.filter( (v,i,a) => a.indexOf( v ) === i );  // Unique


// UI elements are added via CSS:
const updateSellerLinks = (id,r,c) => sellerLinks
				.filter ( l =>  l.getAttribute( 'href' ).includes( 'seller=' + id ))
				.forEach( l =>{ l.setAttribute( 'data-andrest-rating',  r )
				                l.setAttribute( 'data-andrest-country', c ); });


// Fetch all seller info asynchronously:
sellerIds.forEach( id =>
{
	const absUrl = SELLER_URL_STUB + id;
	fetch( absUrl )
	.then( resp =>
	{
		if( resp.ok )
			return resp.text();
		else
		{
			console.log( '[ERROR] Fetching seller info failed: ' + absUrl + ' (HTTP ' + resp.status + ')' );
			updateSellerLinks( id, SELLER_RATING_UNKNOWN, SELLER_COUNTRY_UNKNOWN );
		}
	})
	.then( text =>
	{
		console.log( '[DEBUG] Fetched ' + absUrl );
		const m = text.match( SELLER_RATING_REX  );
		const c = text.match( SELLER_COUNTRY_REX );
		updateSellerLinks( id, m ? m[1] : SELLER_RATING_UNKNOWN, c ? c[1] : SELLER_COUNTRY_UNKNOWN );
	});
});



