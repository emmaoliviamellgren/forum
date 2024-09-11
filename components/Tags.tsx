import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useTags } from '@/app/contexts/TagsContext';
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
