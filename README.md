# o-sps-back

~~~~ 
/auth/reg POST (invitationId, firstName, lastName, password, dormId, roomNumber) => ( token, user, error )
/auth/login POST (email, password) => (token, user, error)
/auth/me GET () => ( USER )
~~~~

~~~~
/events/create POST (title, text, speciality) => ( EVENT )
/events/?speciality GET () => ( [EVENT] )
/events/:id GET () => ( EVENT )
/events/:id/comments GET () => ( [COMMENT] )
/events/:id/comments/create POST (text) => ( COMMENT )
~~~~

~~~~
/invitations/create POST (email) => ( INVITATION )
~~~~

~~~~
/fleamarket/?type GET () => ( [FLEAMATKET_POST] )
/fleamarket/:id GET () => ( FLEAMARKET_POST )
/fleamarket/create POST (image, title, text, type) => ( FLEAMARKET_POST )
~~~~
