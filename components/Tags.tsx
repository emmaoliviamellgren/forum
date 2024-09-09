import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useTags } from '@/app/contexts/TagsContext';
import { AiOutlineTags } from 'react-icons/ai';
import { HiTag } from 'react-icons/hi';

export const TagsForToggling = () => {
    const { tags, handleToggleTag } = useTags();

    return (
        <ToggleGroup
            variant='outline'
            type='multiple'
            className='flex flex-wrap my-3'>
            {tags.map((tag) => (
                <ToggleGroupItem
                    key={tag.id}
                    value={tag.id}
                    onClick={() => handleToggleTag(tag)}
                    className='flex gap-1.5 cursor-pointer rounded-sm items-center hover:text-accent-foreground transition-colors font-medium text-primary/80 text-xs'>
                    <HiTag className='size-4 ml-1' />
                    <p className='text-[0.82rem] pr-2'>{tag.name}</p>
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
};

export const TagsInNavigationMenu = () => {
    const { tags } = useTags();

    return (
        <ul className='grid w-fit gap-3 p-4 md:min-w-max grid-cols-1 md:grid-cols-2 lg:min-w-max'>
            {tags.map((tag) => (
                <span
                    key={tag.id}
                    className='flex cursor-pointer border-dashed border-2 rounded-full items-center px-3 shadow-md shadow:bg-gray-800/10 py-1 hover:bg-accent hover:text-accent-foreground transition-colors'>
                    <AiOutlineTags className='size-5' />
                    <li
                        className='text-[0.82rem] font-medium leading-snug text-primary/80 p-2 w-fit'
                        // onClick={() => handleRedirect(tag.name)}
                    >
                        {tag.name}
                    </li>
                </span>
            ))}
        </ul>
    );
};
