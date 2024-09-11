'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { Thread, ThreadTag } from '../types/thread';
import { getAllThreads } from '@/lib/thread.db';

type TagsContextType = {
    tags: ThreadTag[];
    filteredThreads: Thread[];
    selectedTags: ThreadTag[];
    setSelectedTags: React.Dispatch<React.SetStateAction<ThreadTag[]>>;
    selectedTag: ThreadTag | null;
    setSelectedTag: (tag: ThreadTag | null) => void;
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
    const [selectedTag, setSelectedTag] = useState<ThreadTag | null>(null);
    const [threads, setThreads] = useState<Thread[]>([]);

    useEffect(() => {
        const fetchThreads = async () => {
            try {
                const data: Thread[] = await getAllThreads();
                setThreads(data);
            } catch (error) {
                console.error('Error fetching threads:', error);
            }
        };

        fetchThreads();
    }, []);

    console.log(threads)

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

    const filterThreadsByTag = (tag: ThreadTag | null) => {
        console.log('Filtering threads by tag:', tag);
        console.log('Threads:', threads);
        return tag
            ? threads.filter((thread) => thread?.tags?.some((t) => t.id === tag.id))
            : threads;
    };

    const filteredThreads = filterThreadsByTag(selectedTag);

    const value = { filteredThreads, tags, handleToggleTag, selectedTags, setSelectedTags, selectedTag, setSelectedTag };

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
