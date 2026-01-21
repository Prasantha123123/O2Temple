import { type ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { User, LogOut } from 'lucide-react';

interface HeaderLayoutProps {
    children: ReactNode;
    user?: {
        name: string;
        email: string;
        role: string;
    };
}

export default function HeaderLayout({ children, user }: HeaderLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo Section */}
                        <div className="flex items-center space-x-4">
                            <div>
                                <img 
                                    src="/jaanNetworklogo.jpeg" 
                                    alt="JAAN Network" 
                                    className="h-12 w-auto"
                                />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-700">Admin Dashboard</h1>
                            </div>
                        </div>

                        {/* User Info Section */}
                        <div className="flex items-center space-x-8">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Account Type:</span>
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500 text-white">
                                    {user?.role || 'Admin'}
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Logged As:</span>
                                <span className="font-medium text-gray-800">{user?.name || 'Admin User'}</span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-gray-600" />
                                </div>
                                <Link 
                                    href="/logout" 
                                    method="post"
                                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                                >
                                    <LogOut className="w-4 h-4 text-gray-600" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}