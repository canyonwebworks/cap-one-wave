jQuery( document ).ready( function($) {

	$( document ).on( "change", ".cow-select", function() {
		$( this ).closest( 'tr' ).find( 'td:first input' ).val( $( this ).val() );
	}).trigger( "change" );

	// Mostly functions on page load, sets selected attribute on <option>
	$( ".cow-select" ).each( function() {
		let value = $( this ).data( "selected" );
		$( this ).find( "option[value='" + value + "']" ).attr( 'selected', 'selected' );

	});

});