import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Users, TrendingUp } from 'lucide-react';
import waitlistService from '@/services/waitlistService';

const WaitlistButton = ({ courseId }) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, [courseId]);

    const fetchStats = async () => {
        try {
            const data = await waitlistService.getWaitlistStats(courseId);
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch waitlist stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = () => {
        navigate(`/creator/courses/${courseId}/waitlist`);
    };

    if (loading) {
        return (
            <button
                disabled
                className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed"
            >
                <Users className="w-4 h-4 inline mr-2" />
                Đang tải...
            </button>
        );
    }

    if (!stats || stats.status === 'NO_WAITLIST' || stats.currentCount === 0) {
        return (
            <button
                onClick={handleClick}
                className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
                <Users className="w-4 h-4 inline mr-2" />
                Waitlist (0)
            </button>
        );
    }

    const getBadgeColor = () => {
        if (stats.currentCount >= stats.minRequired) {
            return 'bg-green-100 text-green-700 border-green-300';
        }
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    };

    return (
        <button
            onClick={handleClick}
            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md ${stats.currentCount >= stats.minRequired
                ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200'
                }`}
        >
            <Users className="w-4 h-4 inline mr-2" />
            Waitlist ({stats.currentCount}/{stats.maxCapacity})

            {stats.canStart && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
            )}
        </button>
    );
};

export default WaitlistButton;
