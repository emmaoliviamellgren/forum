import { useTags } from '@/app/contexts/TagsContext';
import { AiOutlineTags } from 'react-icons/ai';
import { TiDelete } from 'react-icons/ti';

const SortByTags = () => {
    const { tags, setSelectedTag, selectedTag } = useTags();

    return (
            <ul className='flex flex-wrap gap-3 p-4 mx-auto'>
                {tags.map((tag) => (
                    <span
                        key={tag.id}
                        onClick={() => setSelectedTag(tag)}
                        className={`flex cursor-pointer border-2 rounded-sm items-center px-3 shadow-md shadow:bg-gray-800/10 dark:hover:bg-accent hover:opacity-70 dark:hover:opacity-100 transition-all duration-100 hover:text-primary ${
                            selectedTag?.id == tag.id
                                ? 'border-solid border-border/80 dark:border-primary/80'
                                : 'border-dashed border-border/10 dark:border-primary/10'
                        }`}>
                        <AiOutlineTags className='size-5 text-secondary dark:text-primary/80' />
                        <li className='text-[0.82rem] font-medium leading-snug text-secondary dark:text-primary/80 p-2 flex items-center'>
                            {tag.name}
                            {selectedTag?.id == tag.id && (
                                <TiDelete
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedTag(null);
                                    }}
                                    className='size-5 ml-2 -mr-2'
                                />
                            )}
                        </li>
                    </span>
                ))}
            </ul>
    );
};

export default SortByTags;
