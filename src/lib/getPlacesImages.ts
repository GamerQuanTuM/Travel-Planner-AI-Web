let apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";

const getPlaceId = async (query: string) => {
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${apiKey}`);
        const data = await response.json();
        const placeId = data.results[0]?.place_id;

        if (placeId) {
            return placeId;
        } else {
            throw new Error('Place ID not found');
        }
    } catch (error) {
        console.error('Error fetching place ID:', error);
    }
};

const getPlaceDetails = async (placeId: string) => {
    try {
        const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;
        const response = await fetch(placeDetailsUrl);
        const data = await response.json();
        const photos = data.result?.photos;

        if (photos && photos.length > 0) {
            const maxDimension = 1024;
            const photoReference = photos[photos.length - 1]?.photo_reference;
            const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxDimension}&maxheight=${maxDimension}&photoreference=${photoReference}&key=${apiKey}`;
            return photoUrl;
        } else {
            console.log('No photos found for this place');
        }
    } catch (error) {
        console.error('Error fetching place details:', error);
    }
};

const getImagesFromGoogle = async (query: string) => {
    const placeId = await getPlaceId(query);
    if (placeId) {
       const image = await getPlaceDetails(placeId);
       return image;
    }
    return null;
};

export default getImagesFromGoogle;
