import React from 'react';
import { Header } from '@/components/ui/header-2';

export default function Demo() {
	return (
		<div className="w-full bg-[#F7F5EE] min-h-screen text-[#1E3A20]">
			<Header />

			<main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-12">
				<div className="space-y-3 mb-6">
					<div className="bg-[#EAE4D2] h-7 w-4/6 rounded-lg border border-[#D8D1BD]" />
					<div className="bg-[#EAE4D2] h-7 w-1/2 rounded-lg border border-[#D8D1BD]" />
				</div>
				<div className="flex gap-2 mb-8">
					<div className="bg-[#EAE4D2] h-4 w-16 rounded-md border border-[#D8D1BD]" />
					<div className="bg-[#EAE4D2] h-4 w-14 rounded-md border border-[#D8D1BD]" />
				</div>

				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="space-y-3 mb-8 p-6 rounded-2xl bg-white border border-[#E2DCBD] shadow-sm">
						<div className="bg-[#EAE4D2] h-5 w-full rounded-md border border-[#D8D1BD]" />
						<div className="bg-[#EAE4D2] h-5 w-11/12 rounded-md border border-[#D8D1BD]" />
						<div className="bg-[#EAE4D2] h-5 w-3/4 rounded-md border border-[#D8D1BD]" />
						<div className="bg-[#EAE4D2] h-5 w-1/2 rounded-md border border-[#D8D1BD]" />
					</div>
				))}
			</main>
		</div>
	);
}
