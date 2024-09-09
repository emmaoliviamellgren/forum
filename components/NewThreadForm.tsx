'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import { ComboBox } from './SelectCategoryNewThread';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '../app/providers/authProvider';
import { Thread, ThreadCategory, ThreadTag } from '../app/types/thread';
import { createThread } from '@/lib/thread.db';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';
import { useTags } from '@/app/contexts/TagsContext';
import { TagsForToggling } from './Tags';

const FormSchema = z.object({
    threadTitle: z.string().min(10, {
        message: 'Your new thread message must be at least 10 characters.',
    }),
    threadBody: z.string().min(10, {
        message: 'Your new thread message must be at least 10 characters.',
    }),
    threadCategory: z.string().min(1, {
        message: 'Thread category is required.',
    }),
    isQnA: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
});

export const NewThreadForm = () => {
    const { selectedTags, setSelectedTags, handleToggleTag } = useTags();

    const { user: currentUser } = useAuth();
    const router = useRouter();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            threadTitle: '',
            threadBody: '',
            threadCategory: '',
            isQnA: false
        } as z.infer<typeof FormSchema>,
    });

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        if (!currentUser) {
            toast.error('You must be logged in to create a thread.');
            return;
        }

        try {
            const newThread: Thread = {
                id: '',
                creationDate: Timestamp.fromDate(new Date()),
                comments: [],
                title: data.threadTitle,
                category: data.threadCategory as ThreadCategory,
                description: data.threadBody,
                creator: {
                    id: currentUser.id,
                    email: currentUser.email,
                    username: currentUser.username,
                    name: '',
                    isModerator: false,
                },
                isQnA: data.isQnA || false,
                isAnswered: false,
                isLocked: false,
                tags: selectedTags
            };

            await createThread(newThread);

            form.reset();
            setSelectedTags([]);

            router.push('/');
        } catch (error) {
            toast.error('Failed to create thread: ' + (error as Error).message);
            console.error('Error creating thread:', error);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='mx-auto w-2/3 space-y-4 pl-12 py-12 max-w-3xl'>
                <FormField
                    control={form.control}
                    name='threadTitle'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-xl'>
                                Create Thread
                            </FormLabel>
                            <FormDescription className='pb-6'>
                                Please provide a title, body and its
                                corresponding category for your new thread.
                            </FormDescription>
                            <FormControl>
                                <Input
                                    placeholder='Title'
                                    className='resize-none'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='threadBody'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    placeholder='Body'
                                    rows={5}
                                    className='resize-none'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='isQnA'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className='flex items-center'>
                                    <Checkbox
                                        id='isQnA'
                                        checked={field.value || false}
                                        onCheckedChange={(checked) => {
                                            field.onChange(checked);
                                        }}
                                    />
                                    <Label
                                        htmlFor='isQnA'
                                        className='ml-2 cursor-pointer'>
                                        Q&A
                                    </Label>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='tags'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className='flex items-center'>
                                    <Collapsible>
                                        <CollapsibleTrigger>
                                            <div className='flex gap-1 items-center'>
                                                <FaPlus />
                                                <p className='text-sm font-medium'>
                                                    Add tag{' '}
                                                    <span className='text-muted-foreground/50'>
                                                        (optional)
                                                    </span>
                                                </p>
                                            </div>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <TagsForToggling />
                                        </CollapsibleContent>
                                    </Collapsible>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='flex items-center justify-between'>
                    <FormField
                        control={form.control}
                        name='threadCategory'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <ComboBox
                                        value={field.value as ThreadCategory}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type='submit'
                        className='px-8'>
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    );
};
