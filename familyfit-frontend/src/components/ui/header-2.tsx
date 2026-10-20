'use client';
import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';

export interface NavLink {
	label: string;
	href: string;
}

export interface HeaderProps {
	links?: NavLink[];
	onSignIn?: () => void;
	onGetStarted?: () => void;
	signInHref?: string;
	getStartedHref?: string;
	user?: any;
}

export function Header({
	links = [
		{
			label: 'How it works',
			href: '#how-it-works',
		},
		{
			label: 'For your family',
			href: '#family-care',
		},
		{
			label: 'Our approach',
			href: '#our-approach',
		},
	],
	onSignIn,
	onGetStarted,
	signInHref = '/login',
	getStartedHref = '/login?mode=signup',
	user,
}: HeaderProps) {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(15);

	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	const primaryActionText = user ? 'Open Dashboard' : 'Get Started';
	const primaryActionHref = user ? '/dashboard' : getStartedHref;

	return (
		<header
			className={cn(
				'fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-20px)] sm:w-[calc(100%-48px)] max-w-5xl transition-all duration-300 ease-out pointer-events-auto',
			)}
		>
			<div
				className={cn(
					'w-full mx-auto flex items-center justify-between px-4 sm:px-6 transition-all duration-300 ease-out rounded-2xl border',
					'bg-[#F3EDDF]/92 backdrop-blur-xl border-[#D8D1BD] shadow-[0_12px_36px_rgba(30,58,32,0.12)]',
					scrolled && !open
						? 'h-13 sm:h-14 py-1'
						: 'h-15 sm:h-16 py-1.5'
				)}
			>
				{/* Brand Logo matching Hero & Website Theme */}
				<a
					href="/"
					className="flex items-center gap-2.5 text-[#1E3A20] font-black text-xl tracking-tight select-none group"
					aria-label="FamilyFit home"
				>
					<span className="w-8 h-8 rounded-lg bg-[#244C27] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
						<Heart size={18} fill="currentColor" />
					</span>
					<span className="font-bold text-lg sm:text-xl text-[#1E3A20]">
						family<span className="text-[#2F5D2A] font-extrabold">fit</span>
					</span>
				</a>

				{/* Desktop Navigation Links */}
				<div className="hidden items-center gap-1.5 md:flex">
					{links.map((link) => (
						<a
							key={link.label}
							href={link.href}
							className={cn(
								buttonVariants({ variant: 'ghost' }),
								'text-[#2A442E] hover:text-[#1E3A20] hover:bg-[#EAE4D2] font-semibold text-sm rounded-lg transition-colors px-3.5'
							)}
						>
							{link.label}
						</a>
					))}

					<div className="h-5 w-[1px] bg-[#D8D1BD] mx-2" />

					{/* Sign In & Primary Action Buttons */}
					{!user && (
						<a
							href={signInHref}
							onClick={onSignIn}
							className={cn(
								buttonVariants({ variant: 'ghost' }),
								'text-[#244C27] hover:text-[#1E3A20] hover:bg-[#EAE4D2] font-bold text-sm px-4 rounded-lg'
							)}
						>
							Log in
						</a>
					)}

					<a
						href={primaryActionHref}
						onClick={onGetStarted}
						className={cn(
							buttonVariants(),
							'bg-[#244C27] hover:bg-[#1A3A1F] text-white font-bold text-sm px-5 h-10 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]'
						)}
					>
						<span>{primaryActionText}</span>
						<ArrowRight size={15} className="ml-1.5" />
					</a>
				</div>

				{/* Mobile Hamburger Button */}
				<Button
					size="icon"
					variant="outline"
					onClick={() => setOpen(!open)}
					className="md:hidden border-[#C9C1AA] bg-[#F7F5EE] text-[#1E3A20] hover:bg-[#EAE4D2] rounded-xl h-10 w-10"
					aria-label={open ? 'Close menu' : 'Open menu'}
				>
					<MenuToggleIcon open={open} className="size-5" duration={300} />
				</Button>
			</div>

			{/* Mobile Slide-down Menu Drawer */}
			<div
				className={cn(
					'fixed inset-x-0 top-[72px] bottom-0 z-40 bg-[#F3EDDF]/98 backdrop-blur-2xl border-t border-[#D8D1BD] px-6 py-6 flex flex-col justify-between md:hidden transition-all duration-300 ease-out',
					open
						? 'opacity-100 translate-y-0 pointer-events-auto'
						: 'opacity-0 -translate-y-4 pointer-events-none'
				)}
			>
				<div className="flex flex-col gap-2">
					<p className="text-xs font-bold uppercase tracking-wider text-[#55624F] px-3 pb-1">
						Navigation
					</p>
					{links.map((link) => (
						<a
							key={link.label}
							href={link.href}
							onClick={() => setOpen(false)}
							className="flex items-center justify-between text-lg font-bold text-[#1E3A20] hover:text-[#244C27] hover:bg-[#EAE4D2] px-4 py-3 rounded-xl transition-colors"
						>
							<span>{link.label}</span>
							<ArrowRight size={16} className="text-[#55624F]" />
						</a>
					))}
				</div>

				<div className="flex flex-col gap-3 pt-6 border-t border-[#E2DCBD]">
					{!user && (
						<a
							href={signInHref}
							onClick={() => {
								setOpen(false);
								if (onSignIn) onSignIn();
							}}
							className={cn(
								buttonVariants({ variant: 'outline' }),
								'w-full h-12 rounded-xl border-[#C9C1AA] bg-white text-[#1E3A20] font-bold text-base hover:bg-[#F2ECDD]'
							)}
						>
							Log in
						</a>
					)}
					<a
						href={primaryActionHref}
						onClick={() => {
							setOpen(false);
							if (onGetStarted) onGetStarted();
						}}
						className={cn(
							buttonVariants(),
							'w-full h-12 rounded-xl bg-[#244C27] hover:bg-[#1A3A1F] text-white font-bold text-base shadow-md flex items-center justify-center gap-2'
						)}
					>
						<span>{primaryActionText}</span>
						<ArrowRight size={17} />
					</a>
				</div>
			</div>
		</header>
	);
}

export default Header;
