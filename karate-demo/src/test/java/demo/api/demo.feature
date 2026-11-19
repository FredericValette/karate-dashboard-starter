Feature: Demo-CRUD gegen einen von Karate gestarteten Mock-Server
  Kein externes System noetig: der MockServer im Test liefert die /api/users Endpunkte.

  Background:
    * url serverUrl + '/api/users'

  Scenario: Benutzer anlegen (POST /users)
    * request { name: 'Alice', email: 'alice@example.com' }
    * method post
    * status 201
    * match response == { id: '#string', name: 'Alice', email: 'alice@example.com' }

  Scenario: Angelegten Benutzer zuruecklesen (GET /users/{id})
    * request { name: 'Bob', email: 'bob@example.com' }
    * method post
    * status 201
    * def userId = response.id

    * path userId
    * method get
    * status 200
    * match response.id == userId
    * match response.name == 'Bob'

  Scenario: Benutzerliste abfragen (GET /users)
    * method get
    * status 200
    # jede gelieferte Liste ist ein Array von Objekten mit string-id
    * match each response contains { id: '#string' }

  Scenario: Unbekannter Benutzer liefert 404 (GET /users/{id})
    * path 'gibt-es-nicht'
    * method get
    * status 404
