'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type TagsContextType = {};

export const TagsContext = createContext<TagsContextType | undefined>(
    undefined
);

const TagsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const value = {};

    return (
        <TagsContext.Provider value={value}>{children}</TagsContext.Provider>
    );
};

export default TagsProvider;

export const useTags = () => {
    const context = useContext(TagsContext);
    if (!context) {
        throw new Error('useTags must be used within a TagsProvider');
    }
    return context;
};
