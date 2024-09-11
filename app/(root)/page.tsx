'use client';

import { Button } from '@/components/ui/button';
import { Threads } from '../../components/Threads';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers/authProvider';
import SortByTags from '@/components/SortByTags';
import { useTags } from '../contexts/TagsContext';

const LandingPage = () => {
    const router = useRouter();
    const { user } = useAuth();
    const { clearFilter } = useTags();

    const handleAddNewThreadClick = async (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        if (!user) {
            e.preventDefault();
            router.push('/log-in');
        }
    };
    return (
        <>
            <header className='bg-gradient-to-br from-zinc-900 to-zinc-700 h-fit w-full'>
                <div className='pl-12 py-8 max-w-6xl mx-auto'>
                    <h1 className='text-base text-white font-medium'>
                        Welcome to Threads
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        A community of developers
                    </p>
                </div>
                <div className='px-6 md:px-12 pt-32'>
                    <p className='pl-4 text-muted-foreground/60 text-lg md:text-2xl font-extralight'>Sort threads by tags</p>
                    <SortByTags />
                </div>
            </header>
            <main className='mx-auto pb-5'>
                <Threads />
                <Link
                    href='/threads/new'
                    onClick={handleAddNewThreadClick}>
                    <Button
                        className='flex items-center gap-1 mx-auto pl-12 px-6 my-8 max-w-6xl'
                        variant='outline'>
                        <Plus className='size-4' />
                        <span>Add new Thread</span>
                    </Button>
                </Link>
            </main>
        </>
    );
};

export default LandingPage;
