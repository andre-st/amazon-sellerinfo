//
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
// 3. Moving shopping cart list items to the secondary list and vice versa creates *new* links.
//    Pages for the ordering-process steps are loaded via Javascript (so "matches" from manifest.json doesn't match).
//    Therefore we regularly check and update seller links.
//    For the sake of simplicity I just use a timer instead of the MutationObserver.
//


const _sellers = {};  // { sellerId: { rating: '96%', country: 'DE', loaded: true }, ...}


function updateSellers()
{
	const sellerCountryFrom = (s   ) => (_ = s.match( /<span class="a-list-item">([A-Z]{2})<\/span><\/li><\/ul>/m )) && _[1];  // Two letter code
	const sellerRatingFrom  = (s   ) => (_ = s.match( /feedback-detail-description" href="#"><b>([0-9]+%)/m       )) && _[1];
	const sellerIdFrom      = (s   ) => (_ = s.match( /seller=([a-zA-Z9-9+-_]+)/                                  )) && _[1];
	const sellerIdFromLink  = (l   ) => sellerIdFrom( l.getAttribute( 'href' ));
	const sellerUrl         = (  id) => window.location.origin + '/sp/ref=x_' + Date.now() + '?seller=' + id;
	const sellerLinks       = Array.from( document.querySelectorAll( 'a[href*="seller="]' ));
	
	
	const updateLinks = () => sellerLinks.forEach( l =>
	{
		const id = sellerIdFromLink( l );
		if( !(id in _sellers) || !_sellers[id].loaded ) return;
		l.setAttribute( 'data-andrest-rating',  _sellers[id].rating  || '?' );
		l.setAttribute( 'data-andrest-country', _sellers[id].country || '?' );
	});
	
	updateLinks();
	
	
	sellerLinks
	.map    ( sellerIdFromLink                )
	.filter ( (v,i,a) => a.indexOf( v ) === i )  // Unique IDs
	.filter ( id => !(id in _sellers)         )  // Just sellers not already fetched
	.forEach( id =>
	{
		_sellers[id] = { loaded: false };
		const url = sellerUrl( id );
		
		fetch( url )  // Async! Absolute URL for permission's sake.
		.then( resp =>
		{
			if( resp.ok ) return resp.text();
			console.error( '[ERROR] Cannot fetch seller info from ' + url + ': HTTP ' + resp.status );
			_sellers[id].loaded = true;
			updateLinks();
		})
		.then( text =>
		{
			console.log( '[DEBUG] Fetched seller info: ' + url );
			_sellers[id].rating  = sellerRatingFrom ( text );
			_sellers[id].country = sellerCountryFrom( text );
			_sellers[id].loaded  = true;
			updateLinks();
		})
		.catch( err =>  // Internet connection issues (not web server):
		{
			console.error( '[FATAL] Cannot fetch seller info from ' + url + ': ', err );
			_sellers[id].loaded = true;
			updateLinks();
		});
	});
}


updateSellers();
setInterval( updateSellers, 1500 );  // Polling

