# Run the microservice

```bash
npm run start
```

# Sample request

```http request
POST http://localhost:8080/calculate
Content-Type: application/json

{
  "legs": [["IND", "EWR"], ["SFO", "ATL"], ["ATL", "IND"]]
}
```

# Sample response

```http request
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  "SFO",
  "EWR"
]
```

# Run the tests

```bash
npm run test
```