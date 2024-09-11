import { useTags } from "@/app/contexts/TagsContext";
import { AiOutlineTags } from "react-icons/ai";

const SortByTags = () => {
    const { tags, setSelectedTag } = useTags();

    return (
        <ul className='grid w-fit gap-3 p-4 md:min-w-max grid-cols-1 md:grid-cols-2 lg:min-w-max'>
            {tags.map((tag) => (
                <span
                    key={tag.id}
                    onClick={() => setSelectedTag(tag)}
                    className='flex cursor-pointer border-dashed border-2 rounded-full items-center px-3 shadow-md shadow:bg-gray-800/10 py-1 hover:bg-accent hover:text-accent-foreground transition-colors'>
                    <AiOutlineTags className='size-5' />
                    <li className='text-[0.82rem] font-medium leading-snug text-primary/80 p-2 w-fit'>
                        {tag.name}
                    </li>
                </span>
            ))}
        </ul>
    );
};

export default SortByTags;
