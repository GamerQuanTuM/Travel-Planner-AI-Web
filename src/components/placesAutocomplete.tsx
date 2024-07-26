"use client"

import React from 'react';
import GooglePlacesAutocomplete from "react-google-autocomplete";

type AutocompleteProps = {
    onPlaceSelected: (place: { formatted_address: string; } | undefined) => void;
};

const Autocomplete: React.FC<AutocompleteProps> = ({ onPlaceSelected }) => {

    return (
        <>
            <GooglePlacesAutocomplete
                className='border-[1px] py-1.5 px-4 rounded-md border-[#e5e7eb]'
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ''}
                onPlaceSelected={(place) => onPlaceSelected(place)}
            />
        </>
    );
};

export default Autocomplete;
