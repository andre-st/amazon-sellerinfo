const SELLER_LINK_SELECTOR   = 'a[href^="/gp/help/seller/at-a-glance.html"]';
const extractSellerCountry   = (s   ) => (_ = s.match( /<span class="a-list-item">([A-Z]{2})<\/span><\/li><\/ul>/m )) && _[1];  // Two letter code
const extractSellerRating    = (s   ) => (_ = s.match( /feedback-detail-description" href="#"><b>([0-9]+%)/m       )) && _[1];
const sellerIdFromUrl        = (u   ) => (_ = u.match( /seller=([a-zA-Z9-9+-_]+)/                                  )) && _[1];
const isUrlOfSeller          = (u,id) => u.includes( 'seller=' + id );
const sellerUrl              = (  id) => window.location.origin + '/gp/help/seller/at-a-glance.html/ref=ox_sc_seller_sfl_s1?seller=' + id;  // Absolute URL for permission's sake


// Seller info URLs are different even for the same seller.
// We don't want multiple requests for basically the same info
// as it also triggers Amazon's HTTP503 request throttling.
// So we will build something with the seller ID:
const sellerLinks = Array.from( document.querySelectorAll( SELLER_LINK_SELECTOR ));
const sellerIds   = sellerLinks
				.map( l => sellerIdFromUrl( l.getAttribute( 'href' )))
				.filter( (v,i,a) => a.indexOf( v ) === i );  // Unique


// UI elements are added via CSS:
const updateSellerLinks = (id,r,c) => sellerLinks
				.filter ( l =>  isUrlOfSeller( l.getAttribute( 'href' ), id ))
				.forEach( l =>{ l.setAttribute( 'data-andrest-rating',  r || '?' )
				                l.setAttribute( 'data-andrest-country', c || '?' ); });


// Fetch all seller info asynchronously:
sellerIds.forEach( id =>
{
	const url = sellerUrl( id );
	fetch( url )
	.then( resp =>
	{
		if( resp.ok )
			return resp.text();
		else
		{
			console.log( '[ERROR] Fetching seller info failed: ' + url + ' (HTTP ' + resp.status + ')' );
			updateSellerLinks( id );
		}
	})
	.then( text =>
	{
		console.log( '[DEBUG] Fetched seller info: ' + url );
		updateSellerLinks( id, extractSellerRating( text ), extractSellerCountry( text ));
	});
});



