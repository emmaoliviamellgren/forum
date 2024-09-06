'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { Thread, ThreadCategory } from '../app/types/thread';
import { createThread, getThreadById, updateThread } from '@/lib/thread.db';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useComments } from '@/app/contexts/CommentsContext';
import Loading from './Loading';

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
});

export const EditThreadForm = () => {
    const { user: currentUser } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { id } = useComments();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            threadTitle: '',
            threadBody: '',
            threadCategory: '',
            isQnA: false,
        } as z.infer<typeof FormSchema>,
    });

    useEffect(() => {
        const fetchThread = async () => {
            try {
                const thread = await getThreadById(id);
                if (thread) {
                    form.reset({
                        threadTitle: thread.title,
                        threadBody: thread.description,
                        threadCategory: thread.category,
                        isQnA: thread.isQnA,
                    });
                }
            } catch (error) {
                toast.error('Failed to fetch thread data.');
            } finally {
                setLoading(false);
            }
        };

        fetchThread();
    }, [id, form]);

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
                                            field.onChange(checked)
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
