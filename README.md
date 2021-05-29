# o-sps-back

~~~~ 
/auth/reg POST (invitationId: int, firstName: string, lastName: string, password: string, dormId: int, roomNumber: int) => ( token, user, error )
/auth/login POST (email: string, password: string) => (token: string, user: USER, error: string)
/auth/me GET () => ( USER )
~~~~

~~~~
/events/create POST (title: string, text: string, speciality: string) => ( EVENT )
/events/?speciality GET () => ( [EVENT] )
/events/:id GET () => ( EVENT )
/events/:id/comments GET () => ( [COMMENT] )
/events/:id/comments/create POST (text: string) => ( COMMENT )
~~~~

~~~~
/invitations/create POST (email: string) => ( INVITATION )
~~~~

~~~~
/fleamarket/?type GET () => ( [FLEAMATKET_POST] )
/fleamarket/:id GET () => ( FLEAMARKET_POST )
/fleamarket/create POST (image: string, title: string, text: string, type: string) => ( FLEAMARKET_POST )
~~~~
