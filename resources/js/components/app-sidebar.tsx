import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { 
    BookOpen, 
    Folder, 
    LayoutGrid, 
    Users, 
    UserCheck, 
    BarChart3, 
    Settings, 
    ArrowLeftRight,
    Dice1,
    History,
    Wallet,
    Image,
    Megaphone,
    Trophy,
    Award,
    CreditCard,
    MessageSquare,
    TrendingUp
} from 'lucide-react';
import AppLogo from './app-logo';

// Define navigation based on user role and permissions
function getNavItems(): NavItem[] {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    
    if (!user) {
        return [
            {
                title: 'Dashboard',
                href: '/owner/dashboard',
                icon: LayoutGrid,
            },
        ];
    }

    // Check user role - Only Owner and Agent have admin dashboard access
    const isOwner = user.roles?.some((role: any) => role.title === 'Owner');
    const isAgent = user.roles?.some((role: any) => role.title === 'Agent');
    const isPlayer = user.roles?.some((role: any) => role.title === 'Player');
    
    // Get user permissions for more granular control (through roles)
    const userPermissions = user.roles?.flatMap((role: any) => 
        role.permissions?.map((perm: any) => perm.title) || []
    ) || [];

    if (isOwner) {
        const ownerNavItems: NavItem[] = [
            {
                title: 'Dashboard',
                href: '/owner/dashboard',
                icon: LayoutGrid,
            },
        ];

        // Add Agents management if Owner has permission
        if (userPermissions.includes('agent_index')) {
            ownerNavItems.push({
                title: 'Agents',
                href: '/admin/agents',
                icon: Users,
            });
        }

        // Add All Players view if Owner has permission
        if (userPermissions.includes('player_index')) {
            ownerNavItems.push({
                title: 'All Players',
                href: '/admin/owner/players',
                icon: UserCheck,
            });
        }

        // Add Banner Management if Owner has permission
        if (userPermissions.includes('banner_index')) {
            ownerNavItems.push({
                title: 'Banners',
                href: '/admin/banners',
                icon: Image,
            });
        }

        // Add Banner Text Management if Owner has permission
        if (userPermissions.includes('banner_text_index')) {
            ownerNavItems.push({
                title: 'Banner Texts',
                href: '/admin/banner-texts',
                icon: MessageSquare,
            });
        }

        // Add Promotion Management if Owner has permission
        if (userPermissions.includes('promotion_index')) {
            ownerNavItems.push({
                title: 'Promotions',
                href: '/admin/promotions',
                icon: Megaphone,
            });
        }

        // Add Top Ten Withdraw Management if Owner has permission
        if (userPermissions.includes('top_ten_withdraw_index')) {
            ownerNavItems.push({
                title: 'Top Ten Withdraw',
                href: '/admin/top-ten-withdraws',
                icon: Trophy,
            });
        }

        // Add Winner Text Management if Owner has permission
        if (userPermissions.includes('winner_text_index')) {
            ownerNavItems.push({
                title: 'Winner Texts',
                href: '/admin/winner-texts',
                icon: Award,
            });
        }

        // Add 2D Management if Owner has permission
        if (userPermissions.includes('2d_dashboard')) {
            ownerNavItems.push({
                title: '2D Management',
                href: '/admin/2d/settings',
                icon: Dice1,
            });
        }

        // Add Reports if Owner has permission
        if (userPermissions.includes('report_check')) {
            ownerNavItems.push({
                title: 'Reports',
                href: '/admin/owner/reports',
                icon: BarChart3,
            });
        }

        // Add System Settings if Owner has permission
        if (userPermissions.includes('owner_access')) {
            ownerNavItems.push({
                title: 'System Settings',
                href: '/admin/system-settings',
                icon: Settings,
            });
        }

        return ownerNavItems;
    } else if (isAgent) {
        const agentNavItems: NavItem[] = [
            {
                title: 'Dashboard',
                href: '/agent/dashboard',
                icon: LayoutGrid,
            },
        ];

        // Add My Players if Agent has permission
        if (userPermissions.includes('player_manage')) {
            agentNavItems.push({
                title: 'My Players',
                href: '/admin/players',
                icon: UserCheck,
            });
        }

        // Add Deposit/Withdraw Management if Agent has permission
        if (userPermissions.includes('deposit_management') || userPermissions.includes('withdraw_management')) {
            agentNavItems.push({
                title: 'Deposit/Withdraw',
                href: '/admin/deposit-withdraw',
                icon: Wallet,
            });
        }

        // Add Bank Management if Agent has permission
        if (userPermissions.includes('bank_index')) {
            agentNavItems.push({
                title: 'Bank Management',
                href: '/admin/banks',
                icon: CreditCard,
            });
        }

        // Add Contact Management if Agent has permission
        if (userPermissions.includes('contact_index')) {
            agentNavItems.push({
                title: 'Contacts',
                href: '/admin/contacts',
                icon: MessageSquare,
            });
        }

        // Add Payment Management if Agent has permission
        if (userPermissions.includes('payment_index')) {
            agentNavItems.push({
                title: 'Payments',
                href: '/admin/payments',
                icon: TrendingUp,
            });
        }

        // Add Transfers if Agent has permission
        if (userPermissions.includes('transfer_log')) {
            agentNavItems.push({
                title: 'Transfers',
                href: '/admin/agent/transfers',
                icon: ArrowLeftRight,
            });
        }

        // Add Reports if Agent has permission
        if (userPermissions.includes('agent_report_player')) {
            agentNavItems.push({
                title: 'Reports',
                href: '/admin/agent/reports',
                icon: BarChart3,
            });
        }

        return agentNavItems;
    } else if (isPlayer) {
        const playerNavItems: NavItem[] = [
            {
                title: 'Dashboard',
                href: '/player/dashboard',
                icon: LayoutGrid,
            },
        ];

        // Add Betting if Player has permission
        if (userPermissions.includes('two_digit_betting')) {
            playerNavItems.push({
                title: '2D Betting',
                href: '/player/2d-betting',
                icon: Dice1,
            });
        }

        // Add Betting History if Player has permission
        if (userPermissions.includes('view_betting_history')) {
            playerNavItems.push({
                title: 'Betting History',
                href: '/player/betting-history',
                icon: History,
            });
        }

        // Add Wallet if Player has permission
        if (userPermissions.includes('deposit') || userPermissions.includes('withdraw')) {
            playerNavItems.push({
                title: 'Wallet',
                href: '/player/wallet',
                icon: Wallet,
            });
        }

        return playerNavItems;
    }

    // Default dashboard for unknown roles
    return [
    {
        title: 'Dashboard',
        href: '/owner/dashboard',
        icon: LayoutGrid,
    },
];
}

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const mainNavItems = getNavItems();
    
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/owner/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
