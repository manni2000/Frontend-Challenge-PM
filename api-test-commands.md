# Test the Beer API directly with curl (Windows Compatible)

## 1. Test Beer List API
```bash
curl -X GET "https://api.catalog.beer/beer?count=3" -H "Accept: application/json" -H "Authorization: Basic MTZjNGI4ZWItNjAzNi00ZGVhLTg0NGYtZTAxZDFlZTJhNDM1Og=="
```

## 2. Test Individual Beer API
```bash
curl -X GET "https://api.catalog.beer/beer/ed8d5bcd-9016-4954-9f4c-81855dbad55a" -H "Accept: application/json" -H "Authorization: Basic MTZjNGI4ZWItNjAzNi00ZGVhLTg0NGYtZTAxZDFlZTJhNDM1Og=="
```

## 3. Test Different Beer ID
```bash
curl -X GET "https://api.catalog.beer/beer/64cd7a20-ebf3-4358-bacf-180d1b7d9b96" -H "Accept: application/json" -H "Authorization: Basic MTZjNGI4ZWItNjAzNi00ZGVhLTg0NGYtZTAxZDFlZTJhNDM1Og=="
```

## 4. Alternative: Use PowerShell (if curl doesn't work)
```powershell
Invoke-RestMethod -Uri "https://api.catalog.beer/beer?count=3" -Method GET -Headers @{
  "Accept" = "application/json"
  "Authorization" = "Basic MTZjNGI4ZWItNjAzNi00ZGVhLTg0NGYtZTAxZDFlZTJhNDM1Og=="
}
```

## API Key Info
- Your API Key: 16c4b8eb-6036-4dea-844f-e01d1ee2a435
- Base64 Encoded: MTZjNGI4ZWItNjAzNi00ZGVhLTg0NGYtZTAxZDFlZTJhNDM1Og==

## What to Look For
Check if the API response contains:
- `image_url` field
- `tagline` field  
- `description` field
- Any other image-related fields

## Expected Response Structure
Based on our testing, the API returns:
```json
{
  "id": "beer-id",
  "object": "beer", 
  "name": "Beer Name",
  "style": "Beer Style",
  "description": null,
  "abv": 5.3,
  "ibu": 66,
  "image_url": undefined,
  "brewer": {...}
}
```

## Windows Command Tips
- Use single line commands (no backslashes)
- Copy the entire command and paste it
- Make sure quotes are preserved properly
