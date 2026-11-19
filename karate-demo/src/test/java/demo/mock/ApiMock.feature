Feature: Mock-API fuer die Demo-Suite (wird vom MockServer im Test geladen)
  Hinweis: Karate-2-JS-Engine hat kein java.*-Interop - deshalb reine JS-IDs.

  Background:
    * def users = {}

  Scenario: pathMatches('/api/users') && methodIs('post')
    * def user = request
    * def id = 'user-' + Object.keys(users).length
    * user.id = id
    * users[id] = user
    * def response = user
    * def responseStatus = 201

  Scenario: pathMatches('/api/users')
    * def list = []
    * karate.forEach(users, function(k, v){ list.push(v) })
    * def response = list

  Scenario: pathMatches('/api/users/{id}')
    * def found = null
    * karate.forEach(users, function(k, v){ if (k == pathParams.id) found = v })
    * if (found == null) karate.set('responseStatus', 404)
    * def response = found ? found : {}
