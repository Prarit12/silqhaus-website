# CSV-Based Property Listings System

This system parses property data from CSV files as the source of truth, with robust image handling, Google Drive link conversion, and server-side validation.

## CSV File Setup

### File Location
Place your CSV file in the `attached_assets/` directory. Current file: 
- `attached_assets/Listings (1)_1758732045452.csv`

### Required CSV Columns

The system automatically maps these CSV columns (case-insensitive):

**Core Property Data:**
- `Name` → Property title
- `City` → Location/city  
- `Bedrooms Number` → Number of bedrooms
- `Bathroom Type` → Number of bathrooms  
- `Price` → Base price per night
- `Public Address` or `Street` → Full address
- `Square Meters` → Property size in sqm

**Coordinates:**
- `Lat` → Latitude
- `Lng` → Longitude

**Images:**
- `Thumbnail Url` → Cover image URL
- Any additional image fields for gallery

**Optional:**
- `Airbnb Interaction` → Property description
- `Amenities` → Comma-separated amenities list
- `Property Type Id` → Property type/category

### Image Handling

**Google Drive Link Conversion:**
```javascript
// Automatically converts Google Drive share links
From: https://drive.google.com/file/d/FILE_ID/view?...
To: https://drive.google.com/uc?export=view&id=FILE_ID
```

**Image Validation:**
- Server performs HEAD requests to validate each image URL
- Invalid/unreachable images fallback to `/placeholder.jpg`
- Validation results are cached to improve performance

**Fallback Behavior:**
- Invalid images → `/placeholder.jpg`
- Missing image fields → Empty string
- Failed image loads → SafeImg component handles client-side fallback

## API Endpoints

### Properties
```http
GET /api/properties              # Get all properties
GET /api/properties?refresh=1    # Force refresh cache
GET /api/properties?debugImgs=1  # Debug image URLs
GET /api/properties/:id          # Get single property
GET /api/properties/featured     # Get featured properties
```

### Health Check
```http
GET /api/health/data            # Get parsing status & cache info
```

## Cache Management

**Automatic Caching:**
- CSV data is cached in memory for 10 minutes
- Image validation results are cached indefinitely
- Cache refreshes automatically after expiration

**Manual Refresh:**
```bash
# Force refresh via API
curl "http://localhost:5000/api/properties?refresh=1"

# Or restart the server
npm run dev
```

## Debugging

**Image Debugging:**
Add `?debugImgs=1` to any property endpoint to see detailed image information:
```bash
curl "http://localhost:5000/api/properties/1?debugImgs=1"
curl "http://localhost:5000/api/properties?debugImgs=1" 
```

**Check Developer Tools:**
- Network tab → Filter by "Img" to see image load status
- Console for any mixed-content warnings
- Should see 200 responses for valid images, fallbacks for invalid ones

**Health Monitoring:**
```bash
curl "http://localhost:5000/api/health/data"
```
Returns:
- Last refresh time
- Number of properties parsed
- Source file path
- Validation cache size

## Development

**Adding New CSV Files:**
1. Place new CSV in `attached_assets/`
2. Update file path in `server/listings.ts` constructor
3. Restart server or use `?refresh=1`

**Custom Field Mapping:**
Edit the `getField()` calls in `server/listings.ts` to map additional CSV columns.

**Image Requirements:**
- Images should be publicly accessible URLs
- Google Drive links are automatically converted
- Large images are lazy-loaded on frontend
- Fallback placeholder should exist at `client/public/placeholder.jpg`

## Frontend Integration

**SafeImg Component:**
```tsx
import { SafeImg } from '@/components/SafeImg';

<SafeImg 
  src={property.imageCover} 
  alt={property.title}
  loading="lazy"
/>
```

**Property Data Structure:**
```typescript
interface Property {
  id: string;
  title: string;
  location?: string;
  bedrooms?: number;
  priceBase?: number;
  imageCover?: string;
  imageGallery?: string[];
  // ... additional fields
}
```

## Common Issues

**No properties parsed:** Check CSV column headers match expected field names in the mapping

**Images not loading:** Verify URLs are publicly accessible, check Network tab for 404s

**Cache not refreshing:** Use `?refresh=1` parameter or restart server

**CSV parsing errors:** Check server logs for specific parsing errors and row details