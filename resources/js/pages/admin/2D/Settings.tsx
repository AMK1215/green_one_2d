import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
    Settings, 
    Clock, 
    Target, 
    Trophy, 
    DollarSign,
    ToggleLeft,
    ToggleRight,
    Plus,
    Eye,
    EyeOff
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/owner/dashboard',
    },
    {
        title: '2D Management',
        href: '/admin/2d/settings',
    },
];

interface HeadCloseDigit {
    id: number;
    head_close_digit: string;
    status: boolean;
}

interface ChooseDigit {
    id: number;
    choose_close_digit: string;
    status: boolean;
}

interface Battle {
    id: number;
    battle_name: string;
    start_time: string;
    end_time: string;
    status: boolean;
}

interface TwoDLimit {
    id: number;
    two_d_limit: number;
    created_at: string;
}

interface TwoDResult {
    id: number;
    win_number: number;
    session: string;
    result_date: string;
    result_time: string;
}

interface Props {
    headCloseDigits: HeadCloseDigit[];
    chooseCloseDigits: ChooseDigit[];
    battles: Battle[];
    twoDLimit: TwoDLimit | null;
    twoDResult: TwoDResult | null;
}

export default function TwoDSettings({ 
    headCloseDigits, 
    chooseCloseDigits, 
    battles, 
    twoDLimit, 
    twoDResult 
}: Props) {
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    
    const { data: limitData, setData: setLimitData, post: postLimit, processing: limitProcessing } = useForm({
        two_d_limit: '',
    });
    
    const { data: resultData, setData: setResultData, post: postResult, processing: resultProcessing } = useForm({
        two_d_result: '',
        session: '',
        result_date: '',
        result_time: '',
    });


    const handleLimitSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postLimit('/admin/2d/limit', {
            onSuccess: () => {
                setShowLimitModal(false);
                setLimitData('two_d_limit', '');
            }
        });
    };

    const handleResultSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postResult('/admin/2d/result', {
            onSuccess: () => {
                setShowResultModal(false);
                setResultData({
                    two_d_result: '',
                    session: '',
                    result_date: '',
                    result_time: '',
                });
            }
        });
    };

    const toggleHeadCloseDigit = (digit: HeadCloseDigit) => {
        router.post('/admin/2d/toggle-head-close', {
            id: digit.id,
            status: digit.status ? 0 : 1,
        }, {
            onSuccess: () => {
                // Success - page will reload automatically
            },
            onError: (errors) => {
                console.error('Error toggling head close digit:', errors);
                alert('Error: ' + (errors.error || 'Failed to toggle digit status'));
            }
        });
    };

    const toggleChooseDigit = (digit: ChooseDigit) => {
        router.post('/admin/2d/toggle-choose-digit', {
            id: digit.id,
            status: digit.status ? 0 : 1,
        }, {
            onSuccess: () => {
                // Success - page will reload automatically
            },
            onError: (errors) => {
                console.error('Error toggling choose digit:', errors);
                alert('Error: ' + (errors.error || 'Failed to toggle digit status'));
            }
        });
    };

    const toggleBattle = (battle: Battle) => {
        router.post('/admin/2d/toggle-battle', {
            id: battle.id,
            status: battle.status ? 0 : 1,
        }, {
            onSuccess: () => {
                // Success - page will reload automatically
            },
            onError: (errors) => {
                console.error('Error toggling battle:', errors);
                alert('Error: ' + (errors.error || 'Failed to toggle battle status'));
            }
        });
    };

    const formatTime = (timeString: string) => {
        try {
            // Handle both datetime strings and time-only strings
            let date: Date;
            
            if (timeString.includes('T')) {
                // Full datetime string (e.g., "2025-09-21T12:01:00.000000Z")
                date = new Date(timeString);
            } else {
                // Time-only string (e.g., "12:01:00")
                date = new Date(`2000-01-01T${timeString}`);
            }
            
            // Format time in Yangon/Asia timezone
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Yangon'
            });
        } catch (error) {
            console.error('Error formatting time:', timeString, error);
            return 'Invalid Time';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="2D Settings" />
            
            <style dangerouslySetInnerHTML={{
                __html: `
                .modern-card {
                    background: linear-gradient(145deg, #ffffff, #f8f9fa);
                    border: 1px solid #e3e6f0;
                    border-radius: 16px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                    overflow: hidden;
                }

                .modern-card:hover {
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                    transform: translateY(-2px);
                }

                .result-card {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 20px;
                    text-align: center;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                    transition: all 0.3s ease;
                }

                .result-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
                }

                .digit-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
                    gap: 12px;
                    padding: 20px;
                }

                .digit-card {
                    background: linear-gradient(145deg, #f1f5f9, #e2e8f0);
                    border: 2px solid #cbd5e1;
                    border-radius: 12px;
                    padding: 16px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    min-height: 100px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #64748b;
                }

                .digit-card:hover {
                    border-color: #4f46e5;
                    box-shadow: 0 4px 15px rgba(79, 70, 229, 0.2);
                    transform: translateY(-2px);
                }

                .digit-card.active {
                    background: linear-gradient(145deg, #10b981, #059669);
                    border-color: #10b981;
                    color: white;
                    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                }

                .digit-number {
                    font-size: 2rem;
                    font-weight: bold;
                    margin-bottom: 8px;
                }

                .modern-toggle {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                }

                .modern-toggle input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .modern-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #94a3b8;
                    transition: 0.3s;
                    border-radius: 24px;
                }

                .modern-slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: 0.3s;
                    border-radius: 50%;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                input:checked + .modern-slider {
                    background-color: #10b981;
                }

                input:checked + .modern-slider:before {
                    transform: translateX(26px);
                }

                .status-badge {
                    font-size: 0.75rem;
                    font-weight: 600;
                    padding: 4px 8px;
                    border-radius: 6px;
                    margin-top: 8px;
                }

                .status-on {
                    background-color: #dcfce7;
                    color: #166534;
                }

                .status-off {
                    background-color: #fef3c7;
                    color: #92400e;
                }

                .battle-card {
                    background: linear-gradient(145deg, #f1f5f9, #e2e8f0);
                    border: 2px solid #cbd5e1;
                    border-radius: 12px;
                    padding: 20px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    min-width: 200px;
                    color: #334155;
                }

                .battle-card .font-semibold {
                    color: #1e293b !important;
                    font-weight: 600;
                }

                .battle-card .text-xs {
                    color: #475569 !important;
                }

                .battle-card:hover {
                    border-color: #4f46e5;
                    box-shadow: 0 4px 15px rgba(79, 70, 229, 0.2);
                    transform: translateY(-2px);
                }

                .battle-card.active {
                    background: linear-gradient(145deg, #10b981, #059669);
                    border-color: #10b981;
                    color: white;
                    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                }

                .choose-digit-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    gap: 15px;
                    padding: 20px;
                    max-height: 500px;
                    overflow-y: auto;
                }

                .choose-digit-card {
                    background: linear-gradient(145deg, #f1f5f9, #e2e8f0);
                    border: 2px solid #cbd5e1;
                    border-radius: 12px;
                    padding: 16px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    min-height: 100px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-between;
                    color: #64748b;
                }

                .choose-digit-card:hover {
                    border-color: #4f46e5;
                    box-shadow: 0 4px 15px rgba(79, 70, 229, 0.2);
                    transform: translateY(-2px);
                }

                .choose-digit-card.active {
                    background: linear-gradient(145deg, #10b981, #059669);
                    border-color: #10b981;
                    color: white;
                    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                }

                .choose-digit-number {
                    font-size: 1.4rem;
                    font-weight: bold;
                    margin-bottom: 8px;
                }

                .choose-digit-toggle {
                    position: relative;
                    display: inline-block;
                    width: 44px;
                    height: 22px;
                }

                .choose-digit-toggle input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .choose-digit-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #94a3b8;
                    transition: 0.3s;
                    border-radius: 22px;
                }

                .choose-digit-slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 3px;
                    bottom: 3px;
                    background-color: white;
                    transition: 0.3s;
                    border-radius: 50%;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                input:checked + .choose-digit-slider {
                    background-color: #10b981;
                }

                input:checked + .choose-digit-slider:before {
                    transform: translateX(22px);
                }

                .choose-digit-status {
                    font-size: 0.75rem;
                    font-weight: 600;
                    margin-top: 6px;
                    padding: 2px 6px;
                    border-radius: 4px;
                    background-color: rgba(255, 255, 255, 0.2);
                }

                .choose-digit-card.active .choose-digit-status {
                    background-color: rgba(255, 255, 255, 0.3);
                }

                .modern-button {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    padding: 12px 24px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                }

                .modern-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
                }

                .modern-button.success {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                }

                .modern-button.success:hover {
                    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
                }

                .section-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin-bottom: 20px;
                    text-align: center;
                }

                .stats-card {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 16px;
                    padding: 24px;
                    text-align: center;
                    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
                }

                .stats-value {
                    font-size: 2.5rem;
                    font-weight: bold;
                    margin-bottom: 8px;
                }

                .stats-label {
                    font-size: 0.9rem;
                    opacity: 0.9;
                }
                `
            }} />

            <div className="space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        2D Management Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Configure battle times, limits, and digit settings
                    </p>
                </div>

                {/* Top Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Battle Times */}
                    <div className="modern-card">
                        <div className="p-6">
                            <div className="flex items-center justify-center mb-4">
                                <Clock className="h-8 w-8 text-blue-600 mr-3" />
                                <h3 className="text-xl font-semibold text-gray-900">Battle Times</h3>
                            </div>
                            <div className="space-y-3">
                                {battles.map((battle) => (
                                    <div
                                        key={battle.id}
                                        className={`battle-card ${battle.status ? 'active' : ''}`}
                                        onClick={() => toggleBattle(battle)}
                                    >
                                        <div className="font-semibold text-sm">{battle.battle_name}</div>
                                        <div className="text-xs opacity-75">
                                            {formatTime(battle.start_time)} - {formatTime(battle.end_time)}
                                        </div>
                                        <div className="modern-toggle mt-2">
                                            <input
                                                type="checkbox"
                                                checked={battle.status}
                                                onChange={() => {}}
                                            />
                                            <span className="modern-slider"></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* TwoD Limit */}
                    <div className="modern-card">
                        <div className="p-6">
                            <div className="flex items-center justify-center mb-4">
                                <Target className="h-8 w-8 text-green-600 mr-3" />
                                <h3 className="text-xl font-semibold text-gray-900">2D Limit (Break)</h3>
                            </div>
                            <div className="stats-card">
                                {twoDLimit ? (
                                    <>
                                        <div className="stats-value">
                                            {twoDLimit.two_d_limit.toLocaleString()}
                                        </div>
                                        <div className="stats-label">Current Limit</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="stats-value">0</div>
                                        <div className="stats-label">No Limit Set</div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* TwoD Result */}
                    <div className="modern-card">
                        <div className="p-6">
                            <div className="flex items-center justify-center mb-4">
                                <Trophy className="h-8 w-8 text-yellow-600 mr-3" />
                                <h3 className="text-xl font-semibold text-gray-900">Latest Result</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="result-card">
                                    <div className="text-sm font-medium mb-1">Win Number</div>
                                    <div className="text-2xl font-bold">
                                        {twoDResult ? twoDResult.win_number.toString().padStart(2, '0') : '--'}
                                    </div>
                                </div>
                                <div className="result-card">
                                    <div className="text-sm font-medium mb-1">Session</div>
                                    <div className="text-lg font-semibold">
                                        {twoDResult ? twoDResult.session.charAt(0).toUpperCase() + twoDResult.session.slice(1) : '--'}
                                    </div>
                                </div>
                                <div className="result-card">
                                    <div className="text-sm font-medium mb-1">Date</div>
                                    <div className="text-sm">
                                        {twoDResult ? twoDResult.result_date : '--'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                    <button 
                        type="button" 
                        className="modern-button success"
                        onClick={() => setShowLimitModal(true)}
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add 2D Limit
                    </button>
                    <button 
                        type="button" 
                        className="modern-button"
                        onClick={() => setShowResultModal(true)}
                    >
                        <Trophy className="h-5 w-5 mr-2" />
                        Add Result
                    </button>
                </div>

                {/* Head Close Digits */}
                <div className="modern-card">
                    <div className="p-6">
                        <h3 className="section-title text-gray-900">Head Close Digits</h3>
                        <p className="text-center text-gray-600 mb-6">Toggle status for head close digits (0-9)</p>
                        <div className="digit-grid">
                            {headCloseDigits.map((digit) => (
                                <div
                                    key={digit.id}
                                    className={`digit-card ${digit.status ? 'active' : ''}`}
                                    onClick={() => toggleHeadCloseDigit(digit)}
                                >
                                    <div className="digit-number">{digit.head_close_digit}</div>
                                    <div className="modern-toggle">
                                        <input
                                            type="checkbox"
                                            checked={digit.status}
                                            onChange={() => {}}
                                        />
                                        <span className="modern-slider"></span>
                                    </div>
                                    <div className={`status-badge ${digit.status ? 'status-on' : 'status-off'}`}>
                                        {digit.status ? 'ON' : 'OFF'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Choose Close Digits */}
                <div className="modern-card">
                    <div className="p-6">
                        <h3 className="section-title">Choose Close Digits</h3>
                        <p className="text-center text-gray-600 mb-6">Toggle status for choose close digits (00-99)</p>
                        <div className="choose-digit-grid">
                            {chooseCloseDigits.map((digit) => (
                                <div
                                    key={digit.id}
                                    className={`choose-digit-card ${digit.status ? 'active' : ''}`}
                                    onClick={() => toggleChooseDigit(digit)}
                                >
                                    <div className="choose-digit-number">{digit.choose_close_digit}</div>
                                    <div className="choose-digit-toggle">
                                        <input
                                            type="checkbox"
                                            checked={digit.status}
                                            onChange={() => {}}
                                        />
                                        <span className="choose-digit-slider"></span>
                                    </div>
                                    <div className="choose-digit-status">
                                        {digit.status ? 'ON' : 'OFF'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* TwoD Limit Modal */}
            {showLimitModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
                        <h3 className="text-2xl font-bold mb-6 text-center">Add 2D Limit</h3>
                        <form onSubmit={handleLimitSubmit}>
                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="two_d_limit" className="text-lg font-medium">2D Limit Amount</Label>
                                    <Input
                                        id="two_d_limit"
                                        type="number"
                                        value={limitData.two_d_limit}
                                        onChange={(e) => setLimitData('two_d_limit', e.target.value)}
                                        placeholder="Enter limit amount"
                                        className="mt-2 text-lg"
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => setShowLimitModal(false)}
                                        className="px-6"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={limitProcessing}
                                        className="px-6 modern-button success"
                                    >
                                        {limitProcessing ? 'Adding...' : 'Add Limit'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TwoD Result Modal */}
            {showResultModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
                        <h3 className="text-2xl font-bold mb-6 text-center">Add 2D Result</h3>
                        <form onSubmit={handleResultSubmit}>
                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="two_d_result" className="text-lg font-medium">Winning Number</Label>
                                    <Input
                                        id="two_d_result"
                                        type="number"
                                        min="0"
                                        max="99"
                                        value={resultData.two_d_result}
                                        onChange={(e) => setResultData('two_d_result', e.target.value)}
                                        placeholder="Enter winning number (0-99)"
                                        className="mt-2 text-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="session" className="text-lg font-medium">Session</Label>
                                    <select
                                        id="session"
                                        value={resultData.session}
                                        onChange={(e) => setResultData('session', e.target.value)}
                                        className="w-full mt-2 p-3 border border-gray-300 rounded-lg text-lg"
                                        required
                                    >
                                        <option value="">Select session</option>
                                        <option value="morning">Morning</option>
                                        <option value="evening">Evening</option>
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="result_date" className="text-lg font-medium">Result Date</Label>
                                    <Input
                                        id="result_date"
                                        type="date"
                                        value={resultData.result_date}
                                        onChange={(e) => setResultData('result_date', e.target.value)}
                                        className="mt-2 text-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="result_time" className="text-lg font-medium">Result Time</Label>
                                    <Input
                                        id="result_time"
                                        type="time"
                                        value={resultData.result_time}
                                        onChange={(e) => setResultData('result_time', e.target.value)}
                                        className="mt-2 text-lg"
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => setShowResultModal(false)}
                                        className="px-6"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={resultProcessing}
                                        className="px-6 modern-button"
                                    >
                                        {resultProcessing ? 'Adding...' : 'Add Result'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}