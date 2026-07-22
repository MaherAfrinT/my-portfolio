import React from 'react';
import { PageTransition } from '../../components/layout/PageTransition';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { LucideIcons } from '../../lib/icon-map';

export function UnderConstructionPage() {
  return (
    <PageTransition>
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4 space-y-8">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-500">
          <LucideIcons.Hammer className="h-12 w-12" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold md:text-5xl text-[#0e2a36] dark:text-white">
            Page Under Construction
          </h1>
          <p className="mx-auto max-w-lg text-lg text-[#566e7a] dark:text-slate-400">
            This page is currently being built or doesn't exist yet. Please check back later!
          </p>
        </div>
        <div className="pt-4">
          <Button as={Link} to="/" className="bg-cyan-500 text-[#0e2a36] hover:bg-cyan-600">
            Return Home
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
