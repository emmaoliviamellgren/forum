'use client';

import { createContext, useContext, useState } from 'react';
import { Comment, Thread } from '@/app/types/thread';
import { updateThread } from '@/lib/thread.db';

type CommentsContextType = {
    comments: Comment[];
    setComments: (comments: Comment[]) => void;
    answered: boolean;
    setAnswered: (answered: boolean) => void;
    answeredComment: Comment | undefined;
    answeredCommentId: string | null;
    setAnsweredCommentId: (commentId: string | null) => void;
    handleCommentSubmit: (newComment: Comment) => Promise<void>;
    handleMarkAsAnswered: (commentId: string) => Promise<void>;
};

// Context with default value
export const CommentsContext = createContext<CommentsContextType | undefined>(
    undefined
);

// Provider component
const CommentsProvider = ({ children }: { children: React.ReactNode }) => {
    const [thread, setThread] = useState<Thread | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [answered, setAnswered] = useState<boolean>(false);
    const [answeredCommentId, setAnsweredCommentId] = useState<string | null>(
        null
    );

    const answeredComment = comments.find(
        (comment) => comment.id === answeredCommentId
    );

    const handleCommentSubmit = async (newComment: Comment): Promise<void> => {
        if (thread) {
            setComments([...comments, newComment]);
        }
    };

    const handleMarkAsAnswered = async (commentId: string): Promise<void> => {
        try {
            if (!thread) {
                console.error('Thread not found.');
                return;
            }

            const newIsAnswered = answeredCommentId !== commentId;

            const fieldsToUpdate: Partial<Thread> = {
                isAnswered: newIsAnswered,
            };

            if (newIsAnswered) {
                fieldsToUpdate.answeredCommentId = commentId;
            } else {
                fieldsToUpdate.answeredCommentId = null;
            }

            await updateThread(thread.id, fieldsToUpdate);

            setAnswered(newIsAnswered);
            setAnsweredCommentId(newIsAnswered ? commentId : null);
        } catch (error) {
            console.error('Error toggling comment as answered:', error);
        }
    };

    const value = {
        comments,
        setComments,
        answeredComment,
        answeredCommentId,
        setAnsweredCommentId,
        handleCommentSubmit,
        handleMarkAsAnswered,
        answered,
        setAnswered,
    };

    return (
        <CommentsContext.Provider value={value}>
            {children}
        </CommentsContext.Provider>
    );
};

export default CommentsProvider;

export const useComments = () => {
    const context = useContext(CommentsContext);
    if (!context) {
        throw new Error('useComments must be used within a CommentsProvider');
    }
    return context;
};
