const sellerCountryFrom = (s   ) => (_ = s.match( /<span class="a-list-item">([A-Z]{2})<\/span><\/li><\/ul>/m )) && _[1];  // Two letter code
const sellerRatingFrom  = (s   ) => (_ = s.match( /feedback-detail-description" href="#"><b>([0-9]+%)/m       )) && _[1];
const sellerIdFrom      = (s   ) => (_ = s.match( /seller=([a-zA-Z9-9+-_]+)/                                  )) && _[1];
const isUrlOfSeller     = (s,id) => s.includes( 'seller=' + id );
const sellerUrl         = (  id) => window.location.origin + '/gp/help/seller/at-a-glance.html?seller=' + id;
const sellerLinks       = Array.from( document.querySelectorAll( 'a[href^="/gp/help/seller/at-a-glance.html"]' ));
const sellerIds         = sellerLinks
                            .map   ( (l    ) => sellerIdFrom( l.getAttribute( 'href' )))
                            .filter( (v,i,a) => a.indexOf( v ) === i );
                            // Since the same seller has different URLs,
                            // we will create seller URLs using these IDs,
                            // unique to prevent Amazon's HTTP 503 request throttling

const updateSellerLinks = (id,r,c) => sellerLinks
                                        .filter ( l =>  isUrlOfSeller( l.getAttribute( 'href' ), id ))
                                        .forEach( l =>{ l.setAttribute( 'data-andrest-rating',  r || '?' )
                                                        l.setAttribute( 'data-andrest-country', c || '?' ); });
sellerIds.forEach( id =>
{
	const url = sellerUrl( id );  // Absolute URL for permission's sake
	fetch( url )  // Async!
	.then( resp =>
	{
		if( resp.ok ) return resp.text();
		
		//Internet connection OK but server issues:
		console.error( '[ERROR] Cannot fetch seller info from ' + url + ': HTTP ' + resp.status );
		updateSellerLinks( id );
	})
	.then( text =>
	{
		console.log( '[DEBUG] Fetched seller info: ' + url );
		updateSellerLinks( id, sellerRatingFrom( text ), sellerCountryFrom( text ));
	})
	.catch( err =>  // Intenet connection issues:
	{
		console.error( '[FATAL] Cannot fetch seller info from ' + url + ': ', err );
		updateSellerLinks( id );
	});
});


