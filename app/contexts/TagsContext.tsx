'use client';

import { createContext, useContext, useState } from 'react';

import { ThreadTag } from '../types/thread';

type TagsContextType = {
    tags: ThreadTag[];
    selectedTags: ThreadTag[];
    setSelectedTags: React.Dispatch<React.SetStateAction<ThreadTag[]>>;
    handleToggleTag: (tag: ThreadTag) => void;
};

export const TagsContext = createContext<TagsContextType | undefined>(
    undefined
);

const TagsContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const tags: ThreadTag[] = [
        {
            id: '1',
            name: 'Cybersecurity',
        },
        {
            id: '2',
            name: 'Routing',
        },
        {
            id: '3',
            name: 'Frontend',
        },
        {
            id: '4',
            name: 'Backend',
        },
        {
            id: '5',
            name: 'Azure',
        },
        {
            id: '6',
            name: 'Machine Learning',
        },
        {
            id: '7',
            name: 'Version Control',
        },
        {
            id: '8',
            name: 'Networking Hardware',
        },
        {
            id: '9',
            name: 'Unit Testing',
        },
    ];

    const [selectedTags, setSelectedTags] = useState<ThreadTag[]>([]);

    const handleToggleTag = (tag: ThreadTag) => {
        try {
            setSelectedTags((prevTags) =>
                prevTags.some((t) => t.id === tag.id)
                    ? prevTags.filter((t) => t.id !== tag.id)
                    : [...prevTags, tag]
            );
        } catch (error) {
            console.log('Could not toggle tag:', error);
        }
    };

    const value = { tags, handleToggleTag, selectedTags, setSelectedTags };

    return (
        <TagsContext.Provider value={value}>{children}</TagsContext.Provider>
    );
};

export default TagsContextProvider;

export const useTags = () => {
    const context = useContext(TagsContext);
    if (!context) {
        throw new Error('useTags must be used within a TagsContextProvider');
    }
    return context;
};
