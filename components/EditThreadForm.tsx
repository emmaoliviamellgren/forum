'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
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
import { useAuth } from '../app/providers/authProvider';
import { Thread, ThreadCategory, ThreadTag } from '../app/types/thread';
import { createThread, getThreadById, updateThread } from '@/lib/thread.db';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useComments } from '@/app/contexts/CommentsContext';
import Loading from './Loading';
import { TagsForToggling } from './Tags';
import { useTags } from '@/app/contexts/TagsContext';
import { HiTag } from 'react-icons/hi';

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
    tags: z
        .array(
            z.object({
                id: z.string(),
                name: z.string(),
            })
        )
        .optional(),
});

export const EditThreadForm = () => {
    const router = useRouter();

    const { user: currentUser } = useAuth();
    const { id } = useComments();
    const { tags, fetchTagsForThread, handleToggleTag } = useTags();

    const [loading, setLoading] = useState(true);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            threadTitle: '',
            threadBody: '',
            threadCategory: '',
            isQnA: false,
            tags: [],
        } as z.infer<typeof FormSchema>,
    });
    const { watch } = form;
    const tagsAddedToThread: ThreadTag[] = watch('tags') || [];
    console.log(tagsAddedToThread);
    const [thread, setThread] = useState<Thread | null>(null);

    useEffect(() => {
        const fetchThread = async () => {
            try {
                const thread = await getThreadById(id);
                setThread(thread);
                if (thread) {
                    const threadTags = fetchTagsForThread(thread);
                    form.reset({
                        threadTitle: thread.title,
                        threadBody: thread.description,
                        threadCategory: thread.category,
                        isQnA: thread.isQnA,
                        tags: threadTags,
                    });
                }
            } catch (error) {
                toast.error('Failed to fetch thread data.');
            } finally {
                setLoading(false);
            }
        };

        fetchThread();
    }, [id, form, fetchTagsForThread, tags]);

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        if (!currentUser) {
            toast.error('You must be logged in to create a thread.');
            return;
        }

        try {
            await updateThread(id, {
                title: data.threadTitle,
                description: data.threadBody,
                category: data.threadCategory as ThreadCategory,
                isQnA: data.isQnA,
                tags: data.tags ?? [],
            });
            toast.success('Thread updated successfully!');
            router.push(`/threads/${data.threadCategory}/${id}`);
        } catch (error) {
            toast.error('Failed to update thread.');
        }
    };

    if (loading) return <Loading />;

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
                                Edit Thread
                            </FormLabel>
                            <FormDescription className='pb-6'>
                                Edit your thread here.
                            </FormDescription>
                            <FormControl>
                                <Input
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
                                    <ToggleGroup
                                        variant='outline'
                                        type='multiple'
                                        className='flex flex-wrap'>
                                        {tags
                                            .filter((tag) =>
                                                thread?.tags?.some(
                                                    (t) => t.id === tag.id
                                                )
                                            )
                                            .map((tag) => (
                                                <div
                                                    key={tag.id}
                                                    className='mt-6 cursor-pointer'>
                                                    <ToggleGroupItem
                                                        value={tag.id}
                                                        onClick={() =>
                                                            handleToggleTag(tag)
                                                        }
                                                        className='flex gap-1.5 cursor-pointer rounded-sm items-center bg-accent text-accent-foreground transition-colors font-medium text-xs'>
                                                        <HiTag className='size-4 ml-1' />
                                                        <p className='text-[0.82rem] pr-2'>
                                                            {tag.name}
                                                        </p>
                                                    </ToggleGroupItem>
                                                </div>
                                            ))}

                                        {tags
                                            .filter(
                                                (tag) =>
                                                    !thread?.tags?.some(
                                                        (t) => t.id === tag.id
                                                    )
                                            )
                                            .map((tag) => (
                                                <div
                                                    key={tag.id}
                                                    className='mt-6 cursor-pointer'>
                                                    <ToggleGroupItem
                                                        value={tag.id}
                                                        onClick={() =>
                                                            handleToggleTag(tag)
                                                        }
                                                        className='flex gap-1.5 cursor-pointer rounded-sm items-center hover:text-accent-foreground transition-colors font-medium text-primary/80 text-xs'>
                                                        <HiTag className='size-4 ml-1' />
                                                        <p className='text-[0.82rem] pr-2'>
                                                            {tag.name}
                                                        </p>
                                                    </ToggleGroupItem>
                                                </div>
                                            ))}
                                    </ToggleGroup>
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
