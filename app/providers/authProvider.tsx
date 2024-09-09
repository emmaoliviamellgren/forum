'use client';

import { auth } from '@/firebase.config';
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    updateProfile,
    UserCredential,
} from 'firebase/auth';

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';
import toast from 'react-hot-toast';
import { User } from '../types/user';
import { checkUserRole, setUserRole } from '@/lib/user.db';

type AuthValues = {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
};
type AuthContextType = {
    user: User | null;
    authLoaded: boolean;
    handleSetModerator: () => Promise<void>;
    register: (values: AuthValues) => Promise<string | void>;
    login: (values: AuthValues) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [authLoaded, setAuthLoaded] = useState<boolean>(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (_user) => {
            if (_user) {
                const userRole = await checkUserRole(_user.uid);
                const user = {
                    id: _user.uid,
                    username: _user.displayName || '',
                    name: '',
                    email: _user.email || '',
                    password: '',
                    isModerator: userRole,
                };
                setUser(user);
            } else {
                setUser(null);
            }
            setAuthLoaded(true);
        });

        return () => unsub();
    }, []);

    const handleSetModerator = async () => {
        if (user) {
            try {
                await setUserRole(user.id, true);
                // Optionally, you can update the user state here to reflect the change
                user.isModerator = true;
                setUser({ ...user });
            } catch (error) {
                console.error('Failed to set user role:', error);
            }
        }
    };

    const register = async (values: AuthValues): Promise<string | void> => {
        const toastId = toast.loading('Creating account...');

        try {
            const userCredential: UserCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    values.email,
                    values.password
                );

            if (!userCredential.user) {
                throw new Error('Something went wrong!. Please try again.');
            }
            console.log(userCredential);

            await updateProfile(userCredential.user, {
                displayName: `${values.firstName} ${values.lastName}`,
            });

            setUser(user);

            toast.success('Account created successfully', { id: toastId });

            return userCredential.user.uid;
        } catch (error: any) {
            console.log(error.message);
            console.log(error.code);
            const message = error.code.split('/')[1].replace(/-/g, ' ');
            toast.error(message || error.message, { id: toastId });
        }
    };

    const login = async (values: AuthValues): Promise<void> => {
        const toastId = toast.loading('Signing in...');

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                values.email,
                values.password
            );

            if (!userCredential.user) {
                throw new Error('Something went wrong!. Please try again.');
            }
            console.log(userCredential);
            const token = await userCredential.user.getIdToken();
            console.log('token:', token);

            toast.success('Logged in successfully', { id: toastId });
        } catch (error: any) {
            console.log(error.message);
            const message = error.code.split('/')[1].replace(/-/g, ' ');
            toast.error(message || error.message, { id: toastId });
        }
    };

    const value = {
        handleSetModerator,
        user,
        authLoaded,
        register,
        login,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export default AuthContextProvider;

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within an AuthContextProvider');
    return context;
};
